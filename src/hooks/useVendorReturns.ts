import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useVendorReturns = () => {
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

  const { data: returns = [], isLoading } = useQuery({
    queryKey: ["vendor-returns", vendorData?.id],
    queryFn: async () => {
      if (!vendorData?.id) return [];
      
      const { data, error } = await supabase
        .from("returns")
        .select(`
          *,
          return_items(
            id,
            quantity,
            order_item_id
          ),
          orders(
            order_number
          )
        `)
        .eq("vendor_id", vendorData.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!vendorData?.id,
  });

  const updateReturnStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: any }) => {
      const { error } = await supabase
        .from("returns")
        .update({ status: status as any })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-returns"] });
      toast({ title: "Return status updated successfully" });
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
    returns,
    isLoading,
    vendorId: vendorData?.id,
    updateReturnStatus: updateReturnStatus.mutate,
  };
};
