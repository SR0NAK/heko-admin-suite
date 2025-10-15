import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useReferrals = () => {
  const { data: referrals = [], isLoading } = useQuery({
    queryKey: ["referrals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("referral_conversions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch related user names separately
      const referralsWithNames = await Promise.all(
        data.map(async (referral) => {
          const [referrerRes, refereeRes] = await Promise.all([
            supabase.from("profiles").select("name").eq("id", referral.referrer_id).single(),
            supabase.from("profiles").select("name").eq("id", referral.referee_id).single(),
          ]);
          
          return {
            ...referral,
            referrer: referrerRes.data,
            referee: refereeRes.data,
          };
        })
      );

      return referralsWithNames;
    },
  });

  return {
    referrals,
    isLoading,
  };
};
