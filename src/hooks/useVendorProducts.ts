import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useVendorProfile } from "./useVendorProfile";

export const useVendorProducts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { vendor } = useVendorProfile();

  // Fetch vendor's products (from vendor_products joined with products)
  const { data: vendorProducts = [], isLoading } = useQuery({
    queryKey: ["vendor-products", vendor?.id],
    queryFn: async () => {
      if (!vendor?.id) return [];
      
      const { data, error } = await supabase
        .from("vendor_products")
        .select(`
          *,
          products (
            id,
            name,
            description,
            price,
            mrp,
            discount,
            unit,
            images,
            status,
            categories (name),
            subcategories (name)
          )
        `)
        .eq("vendor_id", vendor.id);

      if (error) throw error;
      return data;
    },
    enabled: !!vendor?.id,
  });

  // Fetch all available products not yet added by this vendor
  const { data: availableProducts = [] } = useQuery({
    queryKey: ["available-products", vendor?.id],
    queryFn: async () => {
      if (!vendor?.id) return [];
      
      // Get all active products
      const { data: allProducts, error: productsError } = await supabase
        .from("products")
        .select(`
          id,
          name,
          description,
          price,
          mrp,
          unit,
          images,
          categories (name),
          subcategories (name)
        `)
        .eq("status", "active");

      if (productsError) throw productsError;

      // Get vendor's current products
      const { data: vendorProds, error: vendorError } = await supabase
        .from("vendor_products")
        .select("product_id")
        .eq("vendor_id", vendor.id);

      if (vendorError) throw vendorError;

      const vendorProductIds = vendorProds?.map(vp => vp.product_id) || [];
      
      // Filter out products already added by vendor
      return allProducts?.filter(p => !vendorProductIds.includes(p.id)) || [];
    },
    enabled: !!vendor?.id,
  });

  // Add product to vendor's inventory
  const addProductToInventory = useMutation({
    mutationFn: async ({ productId, stockQuantity }: { productId: string; stockQuantity: number }) => {
      if (!vendor?.id) throw new Error("Vendor not found");
      
      const { error } = await supabase.from("vendor_products").insert({
        vendor_id: vendor.id,
        product_id: productId,
        stock_quantity: stockQuantity,
        is_available: true,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["available-products"] });
      toast({ title: "Product added to your inventory" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update vendor product
  const updateVendorProduct = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { error } = await supabase
        .from("vendor_products")
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      toast({ title: "Product updated successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Remove product from vendor's inventory
  const removeProductFromInventory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("vendor_products")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["available-products"] });
      toast({ title: "Product removed from inventory" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    vendorProducts,
    availableProducts,
    isLoading,
    addProductToInventory: addProductToInventory.mutate,
    updateVendorProduct: updateVendorProduct.mutate,
    removeProductFromInventory: removeProductFromInventory.mutate,
  };
};
