import { useState } from "react";
import { Package, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { usePickups } from "@/hooks/usePickups";
import { format } from "date-fns";

export default function Pickups() {
  const { pickups, isLoading, acceptPickup, verifyPickupOTP, deliverToVendor } = usePickups();
  const [selectedPickup, setSelectedPickup] = useState<any>(null);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-blue-500";
      case "pickup_scheduled":
        return "bg-orange-500";
      case "picked_up":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleAccept = (returnId: string) => {
    acceptPickup(returnId);
  };

  const handleVerifyOtp = () => {
    if (selectedPickup && otpInput) {
      verifyPickupOTP({ returnId: selectedPickup.id, otp: otpInput });
      setShowOtpDialog(false);
      setOtpInput("");
      setSelectedPickup(null);
    } else {
      toast.error("Please enter OTP");
    }
  };

  const handleDeliverToVendor = (returnId: string) => {
    deliverToVendor(returnId);
  };

  const openOtpDialog = (pickup: any) => {
    setSelectedPickup(pickup);
    setShowOtpDialog(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Return Pickups</h1>

        <div className="grid gap-4">
          {pickups.map((pickup) => (
            <Card key={pickup.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Return #{pickup.id.slice(0, 8)}
                    </CardTitle>
                    <CardDescription>Order #{pickup.orders?.order_number}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(pickup.status)}>
                    {pickup.status.replace(/_/g, " ").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-red-500" />
                    <div>
                      <p className="font-medium">Pickup from Customer</p>
                      <p className="text-muted-foreground">Customer Address</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-green-500" />
                    <div>
                      <p className="font-medium">Deliver to Vendor</p>
                      <p className="text-muted-foreground">{pickup.vendors?.address || "Vendor address"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {pickup.pickup_scheduled_at 
                        ? format(new Date(pickup.pickup_scheduled_at), "MMM dd, yyyy HH:mm")
                        : "Not scheduled"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {pickup.return_items?.length || 0} items • Refund: ₹{pickup.refund_amount || 0}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {pickup.status === "approved" && (
                      <Button
                        size="sm"
                        onClick={() => handleAccept(pickup.id)}
                      >
                        Accept Pickup
                      </Button>
                    )}
                    {pickup.status === "pickup_scheduled" && (
                      <Button
                        size="sm"
                        onClick={() => openOtpDialog(pickup)}
                      >
                        Verify Pickup
                      </Button>
                    )}
                    {pickup.status === "picked_up" && (
                      <Button
                        size="sm"
                        onClick={() => handleDeliverToVendor(pickup.id)}
                      >
                        Deliver to Vendor
                      </Button>
                    )}
                    {pickup.status === "completed" && (
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

        {pickups.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No active pickups</p>
            </CardContent>
          </Card>
        )}

        <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verify Pickup OTP</DialogTitle>
              <DialogDescription>
                Enter the OTP provided by the customer to confirm the pickup.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Enter OTP"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  maxLength={6}
                />
              </div>
              <Button onClick={handleVerifyOtp} className="w-full">
                Verify & Confirm Pickup
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
