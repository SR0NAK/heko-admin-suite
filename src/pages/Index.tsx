import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import AdminDashboard from "./AdminDashboard";
import VendorDashboard from "./VendorDashboard";
import DeliveryDashboard from "./DeliveryDashboard";
import { UserRole } from "@/components/RoleSwitcher";

const Index = () => {
  const [currentRole] = useState<UserRole>("admin");

  const renderDashboard = () => {
    switch (currentRole) {
      case "admin":
        return <AdminDashboard />;
      case "vendor":
        return <VendorDashboard />;
      case "delivery":
        return <DeliveryDashboard />;
    }
  };

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>;
};

export default Index;
