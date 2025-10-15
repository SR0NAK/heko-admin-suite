import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const usePickups = () => {
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

  // Fetch returns/pickups
  const { data: pickups = [], isLoading } = useQuery({
    queryKey: ["pickups", partnerProfile?.id],
    queryFn: async () => {
      if (!partnerProfile?.id) return [];
      
      const { data, error } = await supabase
        .from("returns")
        .select(`
          *,
          orders!inner(
            id,
            order_number,
            user_id
          ),
          vendors!inner(business_name, address),
          return_items(id)
        `)
        .in("status", ["approved", "pickup_scheduled", "picked_up"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!partnerProfile?.id,
  });

  // Accept pickup
  const acceptPickup = useMutation({
    mutationFn: async (returnId: string) => {
      const { error } = await supabase
        .from("returns")
        .update({ status: "pickup_scheduled" })
        .eq("id", returnId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pickups"] });
      toast({ title: "Pickup accepted successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Verify OTP and mark as picked up
  const verifyPickupOTP = useMutation({
    mutationFn: async ({ returnId, otp }: { returnId: string; otp: string }) => {
      // First, get the return to check OTP
      const { data: returnData, error: fetchError } = await supabase
        .from("returns")
        .select("pickup_otp")
        .eq("id", returnId)
        .single();

      if (fetchError) throw fetchError;
      if (returnData.pickup_otp !== otp) throw new Error("Invalid OTP");

      // If OTP is correct, update status to picked_up
      const { error } = await supabase
        .from("returns")
        .update({ 
          status: "picked_up",
          picked_up_at: new Date().toISOString()
        })
        .eq("id", returnId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pickups"] });
      toast({ 
        title: "OTP Verified Successfully",
        description: "Item has been picked up."
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

  // Deliver to vendor
  const deliverToVendor = useMutation({
    mutationFn: async (returnId: string) => {
      const { error } = await supabase
        .from("returns")
        .update({ 
          status: "completed",
          completed_at: new Date().toISOString()
        })
        .eq("id", returnId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pickups"] });
      toast({ title: "Return delivered to vendor successfully" });
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
    pickups,
    isLoading,
    acceptPickup: acceptPickup.mutate,
    verifyPickupOTP: verifyPickupOTP.mutate,
    deliverToVendor: deliverToVendor.mutate,
    partnerProfile,
  };
};
