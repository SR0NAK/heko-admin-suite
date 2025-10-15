import { useState } from "react";
import {
  Truck,
  MapPin,
  Clock,
  TrendingUp,
  Navigation,
  CheckCircle,
} from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeliveryPartnerDeliveries } from "@/hooks/useDeliveryPartnerDeliveries";
import { Skeleton } from "@/components/ui/skeleton";

export default function DeliveryDashboard() {
  const { toast } = useToast();
  const { 
    activeDeliveries, 
    isLoadingActive, 
    updateStatus, 
    verifyOTP,
    partnerProfile 
  } = useDeliveryPartnerDeliveries();
  const [otpValues, setOtpValues] = useState<{ [key: string]: string }>({});
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  const completedToday = activeDeliveries.filter(d => d.status === "delivered").length;
  const activeCount = activeDeliveries.filter(d => d.status !== "delivered" && d.status !== "failed").length;


  const handleOtpChange = (deliveryId: string, value: string) => {
    setOtpValues((prev) => ({
      ...prev,
      [deliveryId]: value,
    }));
  };

  const handleVerifyOTP = (delivery: any) => {
    const enteredOTP = otpValues[delivery.id] || "";
    
    verifyOTP({ deliveryId: delivery.id, otp: enteredOTP });
    setOtpValues((prev) => ({
      ...prev,
      [delivery.id]: "",
    }));
  };

  const handleNavigate = (delivery: any) => {
    const address = delivery.status === "out_for_delivery" 
      ? delivery.delivery_address 
      : delivery.pickup_address;
    
    toast({
      title: "Opening Navigation",
      description: `Navigating to: ${address}`,
    });
  };

  const handleUpdateStatus = (delivery: any) => {
    setSelectedDelivery(delivery);
    setNewStatus(delivery.status);
    setUpdateStatusDialogOpen(true);
  };

  const handleConfirmStatusUpdate = () => {
    if (selectedDelivery && newStatus) {
      updateStatus({ 
        deliveryId: selectedDelivery.id, 
        status: newStatus as "assigned" | "accepted" | "picked" | "out_for_delivery" | "delivered" | "failed"
      });
      setUpdateStatusDialogOpen(false);
      setSelectedDelivery(null);
    }
  };

  if (isLoadingActive) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Delivery Partner Dashboard</h1>
        <p className="text-muted-foreground">Courier Workspace</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Deliveries"
          value={activeCount.toString()}
          icon={Truck}
          variant="default"
        />
        <MetricCard
          title="Completed Today"
          value={completedToday.toString()}
          icon={CheckCircle}
          variant="primary"
        />
        <MetricCard
          title="Total Deliveries"
          value={partnerProfile?.completed_deliveries?.toString() || "0"}
          icon={Clock}
          variant="secondary"
        />
        <MetricCard
          title="Rating"
          value={partnerProfile?.rating?.toString() || "0"}
          icon={TrendingUp}
          variant="accent"
        />
      </div>


      <div className="grid gap-4 md:grid-cols-2">
        {activeDeliveries.length === 0 ? (
          <Card className="col-span-2">
            <CardContent className="pt-6 text-center text-muted-foreground">
              No active deliveries at the moment
            </CardContent>
          </Card>
        ) : (
          activeDeliveries.map((delivery) => (
            <Card key={delivery.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{delivery.orders?.order_number}</CardTitle>
                  <StatusBadge status={delivery.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Pickup Location
                  </p>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-[hsl(var(--status-processing))]" />
                    <div>
                      <p className="font-medium">{delivery.vendors?.business_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {delivery.pickup_address}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Delivery Location
                  </p>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-[hsl(var(--status-delivered))]" />
                    <div>
                      <p className="font-medium">Customer</p>
                      <p className="text-sm text-muted-foreground">
                        {delivery.delivery_address}
                      </p>
                    </div>
                  </div>
                </div>

                {delivery.status === "out_for_delivery" && (
                  <div className="space-y-2 p-3 rounded-lg bg-[hsl(var(--metric-bg-3))]">
                    <Label htmlFor={`otp-${delivery.id}`} className="text-sm font-semibold">
                      Enter Delivery OTP
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={`otp-${delivery.id}`}
                        placeholder="4-digit OTP"
                        maxLength={4}
                        value={otpValues[delivery.id] || ""}
                        onChange={(e) => handleOtpChange(delivery.id, e.target.value)}
                        className="bg-white"
                      />
                      <Button onClick={() => handleVerifyOTP(delivery)}>
                        Verify
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Customer will provide OTP to confirm delivery
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleNavigate(delivery)}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Navigate
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => handleUpdateStatus(delivery)}
                  >
                    Update Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>


      <Dialog open={updateStatusDialogOpen} onOpenChange={setUpdateStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Delivery Status</DialogTitle>
            <DialogDescription>
              Update the status for {selectedDelivery?.orderId}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Delivery Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedDelivery && (
              <div className="p-3 bg-accent/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Current Status</p>
                <StatusBadge status={selectedDelivery.status} />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmStatusUpdate}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
