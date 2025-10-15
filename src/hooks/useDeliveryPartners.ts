import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDeliveryPartners = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: deliveryPartners = [], isLoading } = useQuery({
    queryKey: ["deliveryPartners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("delivery_partners")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createDeliveryPartner = useMutation({
    mutationFn: async (partnerData: any) => {
      // Allow user_id to be null if not provided
      const dataToInsert = {
        ...partnerData,
        user_id: partnerData.user_id || null,
      };
      const { error } = await supabase.from("delivery_partners").insert(dataToInsert);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveryPartners"] });
      toast({ title: "Delivery partner added successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateDeliveryPartner = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { error } = await supabase
        .from("delivery_partners")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveryPartners"] });
      toast({ title: "Delivery partner updated successfully" });
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
    deliveryPartners,
    isLoading,
    createDeliveryPartner: createDeliveryPartner.mutate,
    updateDeliveryPartner: updateDeliveryPartner.mutate,
  };
};
