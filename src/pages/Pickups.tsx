import { useState, ReactNode } from "react";
import { Package, MapPin, Phone, Clock, CheckCircle2 } from "lucide-react";
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

interface Pickup {
  id: string;
  returnId: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  vendorAddress: string;
  status: "assigned" | "out_for_pickup" | "picked_up" | "delivered_to_vendor";
  otp: string;
  items: number;
  refundAmount: number;
  scheduledTime: string;
}

const mockPickups: Pickup[] = [
  {
    id: "PU001",
    returnId: "RET001",
    customerName: "Alice Johnson",
    customerPhone: "+1234567892",
    pickupAddress: "789 Customer Lane, City",
    vendorAddress: "123 Vendor Plaza, City",
    status: "assigned",
    otp: "4321",
    items: 2,
    refundAmount: 599,
    scheduledTime: "2024-01-16 10:00",
  },
  {
    id: "PU002",
    returnId: "RET002",
    customerName: "Bob Williams",
    customerPhone: "+1234567893",
    pickupAddress: "456 Home Street, City",
    vendorAddress: "789 Store Ave, City",
    status: "out_for_pickup",
    otp: "8765",
    items: 1,
    refundAmount: 299,
    scheduledTime: "2024-01-16 11:30",
  },
];

interface DashboardLayoutProps {
  title: string;
  children: ReactNode;
}

function DashboardLayoutWrapper({ title, children }: DashboardLayoutProps) {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        {children}
      </div>
    </DashboardLayout>
  );
}

export default function Pickups() {
  const [pickups, setPickups] = useState(mockPickups);
  const [selectedPickup, setSelectedPickup] = useState<Pickup | null>(null);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  const getStatusColor = (status: Pickup["status"]) => {
    switch (status) {
      case "assigned":
        return "bg-blue-500";
      case "out_for_pickup":
        return "bg-orange-500";
      case "picked_up":
        return "bg-yellow-500";
      case "delivered_to_vendor":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleAccept = (pickup: Pickup) => {
    setPickups(
      pickups.map((p) =>
        p.id === pickup.id ? { ...p, status: "out_for_pickup" } : p
      )
    );
    toast.success("Pickup accepted!");
  };

  const handleReject = (pickupId: string) => {
    setPickups(pickups.filter((p) => p.id !== pickupId));
    toast.success("Pickup rejected");
  };

  const handleVerifyOtp = () => {
    if (selectedPickup && otpInput === selectedPickup.otp) {
      setPickups(
        pickups.map((p) =>
          p.id === selectedPickup.id ? { ...p, status: "picked_up" } : p
        )
      );
      toast.success("Item picked up successfully!");
      setShowOtpDialog(false);
      setOtpInput("");
      setSelectedPickup(null);
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleDeliverToVendor = (pickup: Pickup) => {
    setPickups(
      pickups.map((p) =>
        p.id === pickup.id ? { ...p, status: "delivered_to_vendor" } : p
      )
    );
    toast.success("Return delivered to vendor!");
  };

  const openOtpDialog = (pickup: Pickup) => {
    setSelectedPickup(pickup);
    setShowOtpDialog(true);
  };

  return (
    <DashboardLayoutWrapper title="Return Pickups">
      <div className="grid gap-4">
          {pickups.map((pickup) => (
            <Card key={pickup.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      {pickup.returnId}
                    </CardTitle>
                    <CardDescription>{pickup.customerName}</CardDescription>
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
                      <p className="text-muted-foreground">{pickup.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-green-500" />
                    <div>
                      <p className="font-medium">Deliver to Vendor</p>
                      <p className="text-muted-foreground">{pickup.vendorAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{pickup.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{pickup.scheduledTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {pickup.items} items • Refund: ₹{pickup.refundAmount}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {pickup.status === "assigned" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(pickup.id)}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAccept(pickup)}
                        >
                          Accept
                        </Button>
                      </>
                    )}
                    {pickup.status === "out_for_pickup" && (
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
                        onClick={() => handleDeliverToVendor(pickup)}
                      >
                        Deliver to Vendor
                      </Button>
                    )}
                    {pickup.status === "delivered_to_vendor" && (
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
              <p className="text-sm text-muted-foreground mb-2">
                Demo OTP: {selectedPickup?.otp}
              </p>
              <Input
                placeholder="Enter OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                maxLength={4}
              />
            </div>
            <Button onClick={handleVerifyOtp} className="w-full">
              Verify & Confirm Pickup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayoutWrapper>
  );
}
