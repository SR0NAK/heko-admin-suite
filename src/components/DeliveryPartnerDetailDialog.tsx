import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Truck, Clock, Package } from "lucide-react";

interface DeliveryPartner {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  vehicle: string;
  status: string;
  activeDeliveries: number;
  activeOrders: number;
  completedToday: number;
  completedDeliveries: number;
  rating: number;
  avgTime: string;
}

interface DeliveryPartnerDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: DeliveryPartner | null;
  onEdit: () => void;
}

export function DeliveryPartnerDetailDialog({ open, onOpenChange, partner, onEdit }: DeliveryPartnerDetailDialogProps) {
  if (!partner) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Delivery Partner Details</span>
            <Badge variant={partner.status === "active" ? "default" : "secondary"}>
              {partner.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Basic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Partner ID</p>
                <p className="font-medium">{partner.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{partner.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{partner.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{partner.phone}</p>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Vehicle Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Vehicle Type</p>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{partner.vehicleType}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vehicle Number</p>
                <p className="font-medium">{partner.vehicleNumber}</p>
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
                  <p className="text-sm text-muted-foreground">Active Deliveries</p>
                  <p className="text-xl font-bold">{partner.activeDeliveries}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                  <p className="text-xl font-bold">{partner.completedToday}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Deliveries</p>
                  <p className="text-xl font-bold">{partner.completedDeliveries}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-xl font-bold flex items-center gap-1">
                    {partner.rating}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Time</p>
                  <p className="text-xl font-bold">{partner.avgTime}</p>
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
              Edit Partner
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
