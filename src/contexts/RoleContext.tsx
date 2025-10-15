import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserRole } from "@/components/RoleSwitcher";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface RoleContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  availableRoles: UserRole[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("admin");
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>(["admin"]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching user roles:", error);
        return;
      }

      if (data && data.length > 0) {
        const roles = data.map((r) => r.role as UserRole);
        setAvailableRoles(roles);
        setCurrentRole(roles[0]);
      }
    };

    fetchUserRoles();
  }, [user]);

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole, availableRoles }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
