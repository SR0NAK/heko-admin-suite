import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDashboard = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["dashboardMetrics"],
    queryFn: async () => {
      // Fetch counts in parallel
      const [ordersRes, vendorsRes, partnersRes, deliveriesRes, returnsRes] = await Promise.all([
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("vendors").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("delivery_partners").select("*", { count: "exact", head: true }),
        supabase.from("deliveries").select("*", { count: "exact", head: true }).eq("status", "assigned"),
        supabase.from("returns").select("*", { count: "exact", head: true }).eq("status", "requested"),
      ]);

      // Fetch recent orders - simplified to avoid recursion issues
      const { data: recentOrders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (ordersError) throw ordersError;

      return {
        totalOrders: ordersRes.count || 0,
        activeVendors: vendorsRes.count || 0,
        deliveryPartners: partnersRes.count || 0,
        unassignedDeliveries: deliveriesRes.count || 0,
        pendingReturns: returnsRes.count || 0,
        recentOrders: recentOrders || [],
      };
    },
  });

  return {
    metrics,
    isLoading,
  };
};
