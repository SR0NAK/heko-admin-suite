import { useState, ReactNode } from "react";
import { Truck, MapPin, Phone, Clock, CheckCircle2 } from "lucide-react";
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

interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: "assigned" | "picked_up" | "in_transit" | "delivered";
  otp: string;
  items: number;
  amount: number;
  scheduledTime: string;
}

const mockDeliveries: Delivery[] = [
  {
    id: "DEL001",
    orderId: "ORD123",
    customerName: "John Doe",
    customerPhone: "+1234567890",
    pickupAddress: "123 Store St, City",
    deliveryAddress: "456 Customer Ave, City",
    status: "assigned",
    otp: "1234",
    items: 3,
    amount: 1299,
    scheduledTime: "2024-01-15 14:30",
  },
  {
    id: "DEL002",
    orderId: "ORD124",
    customerName: "Jane Smith",
    customerPhone: "+1234567891",
    pickupAddress: "789 Vendor Rd, City",
    deliveryAddress: "321 Home Blvd, City",
    status: "in_transit",
    otp: "5678",
    items: 2,
    amount: 899,
    scheduledTime: "2024-01-15 15:00",
  },
];

interface DashboardLayoutProps {
  title: string;
  children: ReactNode;
}

function DashboardLayoutWrapper({ title, children }: DashboardLayoutProps) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        {children}
      </div>
    </DashboardLayout>
  );
}

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState(mockDeliveries);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  const getStatusColor = (status: Delivery["status"]) => {
    switch (status) {
      case "assigned":
        return "bg-blue-500";
      case "picked_up":
        return "bg-yellow-500";
      case "in_transit":
        return "bg-orange-500";
      case "delivered":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handlePickup = (delivery: Delivery) => {
    setDeliveries(
      deliveries.map((d) =>
        d.id === delivery.id ? { ...d, status: "picked_up" } : d
      )
    );
    toast.success("Order picked up successfully!");
  };

  const handleStartDelivery = (delivery: Delivery) => {
    setDeliveries(
      deliveries.map((d) =>
        d.id === delivery.id ? { ...d, status: "in_transit" } : d
      )
    );
    toast.success("Delivery started!");
  };

  const handleVerifyOtp = () => {
    if (selectedDelivery && otpInput === selectedDelivery.otp) {
      setDeliveries(
        deliveries.map((d) =>
          d.id === selectedDelivery.id ? { ...d, status: "delivered" } : d
        )
      );
      toast.success("Delivery completed successfully!");
      setShowOtpDialog(false);
      setOtpInput("");
      setSelectedDelivery(null);
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const openOtpDialog = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setShowOtpDialog(true);
  };

  return (
    <DashboardLayoutWrapper title="Active Deliveries">
      <div className="space-y-6">
        <div className="grid gap-4">
          {deliveries.map((delivery) => (
            <Card key={delivery.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      {delivery.orderId}
                    </CardTitle>
                    <CardDescription>{delivery.customerName}</CardDescription>
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
                      <p className="text-muted-foreground">{delivery.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-green-500" />
                    <div>
                      <p className="font-medium">Delivery</p>
                      <p className="text-muted-foreground">{delivery.deliveryAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{delivery.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{delivery.scheduledTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {delivery.items} items • ₹{delivery.amount}
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
                    {delivery.status === "picked_up" && (
                      <Button
                        size="sm"
                        onClick={() => handleStartDelivery(delivery)}
                      >
                        Start Delivery
                      </Button>
                    )}
                    {delivery.status === "in_transit" && (
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
      </div>

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
    </DashboardLayoutWrapper>
  );
}
