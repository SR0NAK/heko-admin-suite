import { useState } from "react";
import { UserRole } from "@/components/RoleSwitcher";
import AdminDashboard from "./AdminDashboard";
import VendorDashboard from "./VendorDashboard";
import DeliveryDashboard from "./DeliveryDashboard";

export default function Index() {
  const [currentRole] = useState<UserRole>("admin");

  return (
    <>
      {currentRole === "admin" && <AdminDashboard />}
      {currentRole === "vendor" && <VendorDashboard />}
      {currentRole === "delivery" && <DeliveryDashboard />}
    </>
  );
}
