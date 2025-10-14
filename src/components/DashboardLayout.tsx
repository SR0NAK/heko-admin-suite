import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useRole } from "@/contexts/RoleContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { currentRole, setCurrentRole } = useRole();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AppSidebar currentRole={currentRole} onRoleChange={setCurrentRole} />
        <main className="flex-1 overflow-auto px-8 py-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
