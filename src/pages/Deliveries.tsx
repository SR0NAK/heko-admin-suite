import { Truck, MapPin, Phone, Clock, CheckCircle2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDeliveries } from "@/hooks/useDeliveries";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Deliveries() {
  const { deliveries, isLoading, updateDeliveryStatus } = useDeliveries();
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [otpInput, setOtpInput] = useState("");

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-blue-500";
      case "picked":
        return "bg-yellow-500";
      case "out_for_delivery":
        return "bg-orange-500";
      case "delivered":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handlePickup = (delivery: any) => {
    updateDeliveryStatus({ deliveryId: delivery.id, status: "picked" });
  };

  const handleStartDelivery = (delivery: any) => {
    updateDeliveryStatus({ deliveryId: delivery.id, status: "out_for_delivery" });
  };

  const handleVerifyOtp = () => {
    if (selectedDelivery && otpInput === selectedDelivery.otp) {
      updateDeliveryStatus({ deliveryId: selectedDelivery.id, status: "delivered" });
      toast.success("Delivery completed successfully!");
      setShowOtpDialog(false);
      setOtpInput("");
      setSelectedDelivery(null);
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const openOtpDialog = (delivery: any) => {
    setSelectedDelivery(delivery);
    setShowOtpDialog(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Active Deliveries</h1>

        <div className="grid gap-4">
          {deliveries.map((delivery) => (
            <Card key={delivery.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      {delivery.orders?.order_number || delivery.order_id}
                    </CardTitle>
                    <CardDescription>{delivery.vendors?.business_name || "N/A"}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(delivery.status)}>
                    {delivery.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Pickup</p>
                      <p className="text-muted-foreground">{delivery.pickup_address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-green-500" />
                    <div>
                      <p className="font-medium">Delivery</p>
                      <p className="text-muted-foreground">{delivery.delivery_address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{delivery.delivery_partners?.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(delivery.created_at).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {delivery.orders?.order_number || "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {delivery.status === "assigned" && (
                      <Button
                        size="sm"
                        onClick={() => handlePickup(delivery)}
                      >
                        Mark Picked Up
                      </Button>
                    )}
                    {delivery.status === "picked" && (
                      <Button
                        size="sm"
                        onClick={() => handleStartDelivery(delivery)}
                      >
                        Start Delivery
                      </Button>
                    )}
                    {delivery.status === "out_for_delivery" && (
                      <Button
                        size="sm"
                        onClick={() => openOtpDialog(delivery)}
                      >
                        Complete Delivery
                      </Button>
                    )}
                    {delivery.status === "delivered" && (
                      <Badge variant="outline" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {deliveries.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Truck className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No active deliveries</p>
            </CardContent>
          </Card>
        )}

        <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verify Delivery OTP</DialogTitle>
              <DialogDescription>
                Enter the OTP provided by the customer to complete the delivery.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Demo OTP: {selectedDelivery?.otp}
                </p>
                <Input
                  placeholder="Enter OTP"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  maxLength={4}
                />
              </div>
              <Button onClick={handleVerifyOtp} className="w-full">
                Verify & Complete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
