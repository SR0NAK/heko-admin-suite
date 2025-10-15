import { useRole } from "@/contexts/RoleContext";
import AdminDashboard from "./AdminDashboard";
import VendorDashboard from "./VendorDashboard";
import DeliveryDashboard from "./DeliveryDashboard";

export default function Index() {
  const { currentRole } = useRole();

  return (
    <>
      {currentRole === "admin" && <AdminDashboard />}
      {currentRole === "vendor" && <VendorDashboard />}
      {currentRole === "delivery_partner" && <DeliveryDashboard />}
    </>
  );
}
