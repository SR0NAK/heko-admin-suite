import { Building2, Store, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type UserRole = "admin" | "vendor" | "delivery_partner";

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roleConfig: Record<UserRole, { label: string; icon: any; description: string }> = {
  admin: {
    label: "Admin",
    icon: Building2,
    description: "Authority Workspace",
  },
  vendor: {
    label: "Vendor",
    icon: Store,
    description: "Store Workspace",
  },
  delivery_partner: {
    label: "Delivery Partner",
    icon: Truck,
    description: "Courier Workspace",
  },
};

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const CurrentIcon = roleConfig[currentRole].icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2">
          <CurrentIcon className="h-4 w-4" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold">{roleConfig[currentRole].label}</span>
            <span className="text-xs text-muted-foreground">{roleConfig[currentRole].description}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-popover z-50">
        {Object.entries(roleConfig).map(([role, config]) => {
          const Icon = config.icon;
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => onRoleChange(role as UserRole)}
              className="flex items-center gap-2 cursor-pointer text-black hover:text-blue-500 transition-colors"
            >
              <Icon className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{config.label}</span>
                <span className="text-xs text-muted-foreground">{config.description}</span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
