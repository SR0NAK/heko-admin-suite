import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useReturns = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: returns = [], isLoading } = useQuery({
    queryKey: ["returns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("returns")
        .select(`
          *,
          orders(order_number),
          profiles(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateReturnStatus = useMutation({
    mutationFn: async ({ returnId, status }: { 
      returnId: string; 
      status: "requested" | "approved" | "rejected" | "pickup_scheduled" | "picked_up" | "completed"
    }) => {
      const { error } = await supabase
        .from("returns")
        .update({ status })
        .eq("id", returnId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returns"] });
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
    updateReturnStatus: updateReturnStatus.mutate,
  };
};
