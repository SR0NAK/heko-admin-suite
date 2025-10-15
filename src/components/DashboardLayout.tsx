import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { UserMenu } from "./UserMenu";
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
        <main className="flex-1 overflow-auto">
          <div className="flex items-center justify-end px-8 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <UserMenu />
          </div>
          <div className="px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
