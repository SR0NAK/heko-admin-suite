import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useReferrals = () => {
  const { data: referrals = [], isLoading } = useQuery({
    queryKey: ["referrals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("referral_conversions")
        .select("*, referrer:profiles!referrer_id(name), referee:profiles!referee_id(name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return {
    referrals,
    isLoading,
  };
};
