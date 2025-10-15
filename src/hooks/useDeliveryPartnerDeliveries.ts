import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useDeliveryPartnerDeliveries = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Get delivery partner's profile first
  const { data: partnerProfile } = useQuery({
    queryKey: ["deliveryPartnerProfile", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("delivery_partners")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch active deliveries for this partner
  const { data: activeDeliveries = [], isLoading: isLoadingActive } = useQuery({
    queryKey: ["activeDeliveries", partnerProfile?.id],
    queryFn: async () => {
      if (!partnerProfile?.id) return [];
      
      const { data, error } = await supabase
        .from("deliveries")
        .select(`
          *,
          orders!inner(
            id,
            order_number,
            total,
            user_id
          ),
          vendors!inner(business_name, address)
        `)
        .eq("delivery_partner_id", partnerProfile.id)
        .in("status", ["assigned", "accepted", "picked", "out_for_delivery"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!partnerProfile?.id,
  });

  // Fetch all deliveries for history
  const { data: allDeliveries = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ["allDeliveries", partnerProfile?.id],
    queryFn: async () => {
      if (!partnerProfile?.id) return [];
      
      const { data, error } = await supabase
        .from("deliveries")
        .select(`
          *,
          orders!inner(
            id,
            order_number,
            total,
            user_id
          ),
          vendors!inner(business_name)
        `)
        .eq("delivery_partner_id", partnerProfile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!partnerProfile?.id,
  });

  // Update delivery status
  const updateStatus = useMutation({
    mutationFn: async ({ 
      deliveryId, 
      status 
    }: { 
      deliveryId: string; 
      status: "assigned" | "accepted" | "picked" | "out_for_delivery" | "delivered" | "failed"
    }) => {
      const updates: any = { status };
      
      // Update timestamps based on status
      if (status === "accepted") {
        updates.accepted_at = new Date().toISOString();
      } else if (status === "picked") {
        updates.picked_at = new Date().toISOString();
      } else if (status === "delivered") {
        updates.delivered_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("deliveries")
        .update(updates)
        .eq("id", deliveryId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeDeliveries"] });
      queryClient.invalidateQueries({ queryKey: ["allDeliveries"] });
      toast({ title: "Delivery status updated successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Verify OTP and mark as delivered
  const verifyOTP = useMutation({
    mutationFn: async ({ deliveryId, otp }: { deliveryId: string; otp: string }) => {
      // First, get the delivery to check OTP
      const { data: delivery, error: fetchError } = await supabase
        .from("deliveries")
        .select("otp")
        .eq("id", deliveryId)
        .single();

      if (fetchError) throw fetchError;
      if (delivery.otp !== otp) throw new Error("Invalid OTP");

      // If OTP is correct, update status to delivered
      const { error } = await supabase
        .from("deliveries")
        .update({ 
          status: "delivered",
          delivered_at: new Date().toISOString()
        })
        .eq("id", deliveryId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeDeliveries"] });
      queryClient.invalidateQueries({ queryKey: ["allDeliveries"] });
      toast({ 
        title: "OTP Verified Successfully",
        description: "Delivery has been marked as completed."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Invalid OTP",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    activeDeliveries,
    allDeliveries,
    isLoadingActive,
    isLoadingAll,
    updateStatus: updateStatus.mutate,
    verifyOTP: verifyOTP.mutate,
    partnerProfile,
  };
};
