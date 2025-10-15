import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Package, ShoppingCart } from "lucide-react";

interface Vendor {
  id: string;
  user_id: string;
  business_name: string;
  owner_name: string;
  email?: string;
  phone: string;
  address: string;
  latitude?: number;
  longitude?: number;
  service_radius?: number;
  status: string;
  rating?: number;
  total_orders?: number;
  completed_orders?: number;
  acceptance_rate?: number;
}

interface VendorDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: Vendor | null;
  onEdit: () => void;
}

export function VendorDetailDialog({ open, onOpenChange, vendor, onEdit }: VendorDetailDialogProps) {
  if (!vendor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Vendor Details</span>
            <Badge variant={vendor.status === "active" ? "default" : "secondary"}>
              {vendor.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Basic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Vendor ID</p>
                <p className="font-medium">{vendor.id.slice(0, 8)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Business Name</p>
                <p className="font-medium">{vendor.business_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Owner Name</p>
                <p className="font-medium">{vendor.owner_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{vendor.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{vendor.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Service Radius</p>
                <p className="font-medium">{vendor.service_radius || 5} km</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Location</h3>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">{vendor.address}</p>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Performance</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-xl font-bold">{vendor.total_orders || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Orders Completed</p>
                  <p className="text-xl font-bold">{vendor.completed_orders || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-xl font-bold">{vendor.rating || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Acceptance Rate</p>
                  <p className="text-xl font-bold">{vendor.acceptance_rate || 0}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={onEdit}>
              Edit Vendor
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
