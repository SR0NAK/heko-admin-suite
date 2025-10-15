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

const activeDeliveries = [
  {
    id: "DEL-001",
    orderId: "ORD-001",
    vendor: "Fresh Mart",
    customer: "John Doe",
    pickupAddress: "123 Market St, Zone A",
    deliveryAddress: "456 Oak Avenue, Zone B",
    distance: "3.2 km",
    status: "out_for_delivery" as const,
    requiresOTP: true,
    deliveryOTP: "8765",
  },
  {
    id: "DEL-002",
    orderId: "ORD-004",
    vendor: "Green Grocers",
    customer: "Alice Brown",
    pickupAddress: "789 Fresh Lane, Zone A",
    deliveryAddress: "321 Pine Street, Zone C",
    distance: "4.8 km",
    status: "preparing" as const,
    requiresOTP: false,
    deliveryOTP: null,
  },
];

const newAssignment = {
  id: "DEL-003",
  orderId: "ORD-015",
  vendor: "Fresh Mart",
  distance: "2.8 km",
  pickupAddress: "123 Market St",
  deliveryAddress: "789 Elm Rd",
};

const returnPickup = {
  id: "RET-003",
  orderId: "ORD-003",
  customer: "Bob Wilson",
  pickupAddress: "456 Oak Ave",
  returnAddress: "Fresh Mart",
  pickupOTP: "4321",
};

export default function DeliveryDashboard() {
  const { toast } = useToast();
  const [otpValues, setOtpValues] = useState<{ [key: string]: string }>({});
  const [returnOtpValue, setReturnOtpValue] = useState("");
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<typeof activeDeliveries[0] | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  const handleAcceptAssignment = () => {
    toast({
      title: "Assignment Accepted",
      description: `Order ${newAssignment.orderId} has been accepted. Please proceed to pickup location.`,
    });
  };

  const handleRejectAssignment = () => {
    toast({
      title: "Assignment Rejected",
      description: `Order ${newAssignment.orderId} assignment has been declined.`,
      variant: "destructive",
    });
  };

  const handleOtpChange = (deliveryId: string, value: string) => {
    setOtpValues((prev) => ({
      ...prev,
      [deliveryId]: value,
    }));
  };

  const handleVerifyOTP = (delivery: typeof activeDeliveries[0]) => {
    const enteredOTP = otpValues[delivery.id] || "";
    
    if (enteredOTP === delivery.deliveryOTP) {
      toast({
        title: "OTP Verified Successfully",
        description: `Delivery ${delivery.orderId} has been marked as completed. Payment processed.`,
      });
      setOtpValues((prev) => ({
        ...prev,
        [delivery.id]: "",
      }));
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct OTP provided by the customer.",
        variant: "destructive",
      });
    }
  };

  const handleNavigate = (delivery: typeof activeDeliveries[0]) => {
    const address = delivery.status === "out_for_delivery" 
      ? delivery.deliveryAddress 
      : delivery.pickupAddress;
    
    toast({
      title: "Opening Navigation",
      description: `Navigating to: ${address}`,
    });
    
    // In a real app, this would open Google Maps or similar
    // window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank');
  };

  const handleUpdateStatus = (delivery: typeof activeDeliveries[0]) => {
    setSelectedDelivery(delivery);
    setNewStatus(delivery.status);
    setUpdateStatusDialogOpen(true);
  };

  const handleConfirmStatusUpdate = () => {
    if (selectedDelivery && newStatus) {
      const statusMessages: { [key: string]: string } = {
        assigned: "You've been assigned to this delivery",
        preparing: "Vendor is preparing the order",
        out_for_delivery: "Out for delivery to customer",
        delivered: "Delivery completed successfully",
      };

      toast({
        title: "Status Updated",
        description: `${selectedDelivery.orderId}: ${statusMessages[newStatus] || "Status updated"}`,
      });

      setUpdateStatusDialogOpen(false);
      setSelectedDelivery(null);
    }
  };

  const handleAcceptReturnPickup = () => {
    toast({
      title: "Return Pickup Accepted",
      description: `Return ${returnPickup.id} has been accepted. Please proceed to pickup location.`,
    });
  };

  const handleRejectReturnPickup = () => {
    toast({
      title: "Return Pickup Rejected",
      description: `Return ${returnPickup.id} pickup has been declined.`,
      variant: "destructive",
    });
  };

  const handleVerifyReturnOTP = () => {
    if (returnOtpValue === returnPickup.pickupOTP) {
      toast({
        title: "Return Pickup Verified",
        description: `Return ${returnPickup.id} has been picked up successfully. Refund will be processed.`,
      });
      setReturnOtpValue("");
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct pickup OTP.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Delivery Partner Dashboard</h1>
        <p className="text-muted-foreground">Courier Workspace</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Deliveries"
          value="3"
          icon={Truck}
          variant="default"
        />
        <MetricCard
          title="Completed Today"
          value="12"
          icon={CheckCircle}
          variant="primary"
        />
        <MetricCard
          title="Avg Time"
          value="24m"
          icon={Clock}
          variant="secondary"
        />
        <MetricCard
          title="Earnings Today"
          value="₹840"
          icon={TrendingUp}
          trend={{ value: 12, label: "vs yesterday" }}
          variant="accent"
        />
      </div>

      <Card className="border-primary bg-[hsl(var(--metric-bg-1))]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            New Delivery Assignments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 rounded-lg bg-white border">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold">Order #{newAssignment.orderId}</p>
                <p className="text-sm text-muted-foreground">
                  Vendor: {newAssignment.vendor} • Distance: {newAssignment.distance}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRejectAssignment}
                >
                  Reject
                </Button>
                <Button 
                  size="sm"
                  onClick={handleAcceptAssignment}
                >
                  Accept
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Pickup: {newAssignment.pickupAddress} → Delivery: {newAssignment.deliveryAddress}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {activeDeliveries.map((delivery) => (
          <Card key={delivery.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{delivery.orderId}</CardTitle>
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
                    <p className="font-medium">{delivery.vendor}</p>
                    <p className="text-sm text-muted-foreground">
                      {delivery.pickupAddress}
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
                    <p className="font-medium">{delivery.customer}</p>
                    <p className="text-sm text-muted-foreground">
                      {delivery.deliveryAddress}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                <Navigation className="h-4 w-4" />
                <span className="text-sm font-medium">{delivery.distance}</span>
              </div>

              {delivery.requiresOTP && (
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
                    Customer will provide OTP to confirm delivery (Demo OTP: {delivery.deliveryOTP})
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
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Return Pickups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Return #{returnPickup.id}</p>
                <p className="text-sm text-muted-foreground">
                  Order #{returnPickup.orderId} • Customer: {returnPickup.customer}
                </p>
              </div>
              <StatusBadge status="placed" />
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Pickup: {returnPickup.pickupAddress} → Return to: {returnPickup.returnAddress}</span>
            </div>

            <div className="space-y-2 p-3 rounded-lg bg-[hsl(var(--metric-bg-3))]">
              <Label htmlFor="return-otp" className="text-sm font-semibold">
                Enter Pickup OTP
              </Label>
              <div className="flex gap-2">
                <Input
                  id="return-otp"
                  placeholder="4-digit OTP"
                  maxLength={4}
                  value={returnOtpValue}
                  onChange={(e) => setReturnOtpValue(e.target.value)}
                  className="bg-white"
                />
                <Button onClick={handleVerifyReturnOTP}>
                  Verify
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Vendor/Customer will provide OTP to confirm pickup (Demo OTP: {returnPickup.pickupOTP})
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRejectReturnPickup}
              >
                Reject
              </Button>
              <Button 
                size="sm"
                onClick={handleAcceptReturnPickup}
              >
                Accept Pickup
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
