import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Truck,
  Wallet,
  BarChart3,
  Settings,
  Store,
  MapPin,
  RefreshCcw,
  FileText,
  Grid3x3,
  CheckSquare,
  XCircle,
  DollarSign,
  UserCircle,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { RoleSwitcher, UserRole } from "./RoleSwitcher";

interface AppSidebarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const adminMenuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Products", url: "/products", icon: Package },
  { title: "Vendors", url: "/vendors", icon: Store },
  { title: "Delivery Partners", url: "/delivery-partners", icon: Truck },
  { title: "Users & Wallets", url: "/users", icon: Users },
  { title: "Referrals", url: "/referrals", icon: RefreshCcw },
  { title: "Returns", url: "/returns", icon: XCircle },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "CMS", url: "/cms", icon: Grid3x3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

const vendorMenuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Assigned Orders", url: "/vendor-orders", icon: ShoppingCart },
  { title: "Returns", url: "/vendor-returns", icon: XCircle },
  { title: "Product Availability", url: "/product-availability", icon: Package },
  { title: "History", url: "/vendor-history", icon: FileText },
  { title: "Settings", url: "/vendor-settings", icon: Settings },
];

const deliveryMenuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Deliveries", url: "/deliveries", icon: Truck },
  { title: "Pickups", url: "/pickups", icon: MapPin },
  { title: "History", url: "/delivery-history", icon: FileText },
  { title: "Earnings", url: "/delivery-earnings", icon: DollarSign },
  { title: "Profile", url: "/delivery-profile", icon: UserCircle },
];

export function AppSidebar({ currentRole, onRoleChange }: AppSidebarProps) {
  const menuItems =
    currentRole === "admin"
      ? adminMenuItems
      : currentRole === "vendor"
      ? vendorMenuItems
      : deliveryMenuItems;

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">HEKO</h2>
            <p className="text-xs text-muted-foreground">Admin Portal</p>
          </div>
        </div>
        <RoleSwitcher currentRole={currentRole} onRoleChange={onRoleChange} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
