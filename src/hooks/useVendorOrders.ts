import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useVendorOrders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Get vendor ID from current user
  const { data: vendorData } = useQuery({
    queryKey: ["vendor-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch orders assigned to this vendor
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["vendor-orders", vendorData?.id],
    queryFn: async () => {
      if (!vendorData?.id) return [];
      
      const { data, error } = await supabase
        .from("order_items")
        .select(`
          *,
          orders!inner(
            id,
            order_number,
            user_id,
            total,
            status,
            created_at,
            delivery_window_start,
            delivery_window_end
          )
        `)
        .eq("vendor_id", vendorData.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Group items by order
      const ordersMap = new Map();
      data?.forEach((item: any) => {
        const orderId = item.orders.id;
        if (!ordersMap.has(orderId)) {
          ordersMap.set(orderId, {
            ...item.orders,
            items: [],
          });
        }
        ordersMap.get(orderId).items.push({
          id: item.id,
          name: item.product_name,
          quantity: item.quantity,
          price: item.unit_price,
          status: item.status,
        });
      });
      
      return Array.from(ordersMap.values());
    },
    enabled: !!vendorData?.id,
  });

  const updateItemStatus = useMutation({
    mutationFn: async ({ itemId, status }: { itemId: string; status: any }) => {
      const { error } = await supabase
        .from("order_items")
        .update({ status: status as any })
        .eq("id", itemId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
      toast({ title: "Status updated successfully" });
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
    orders,
    isLoading,
    vendorId: vendorData?.id,
    updateItemStatus: updateItemStatus.mutate,
  };
};
