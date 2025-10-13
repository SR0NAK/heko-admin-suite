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

const activeDeliveries = [
  {
    id: "DEL-001",
    orderId: "ORD-001",
    vendor: "Fresh Mart",
    customer: "John Doe",
    pickupAddress: "123 Market St, Zone A",
    deliveryAddress: "456 Oak Avenue, Zone B",
    distance: "3.2 km",
    status: "picked" as const,
    requiresOTP: true,
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
  },
];

export default function DeliveryDashboard() {
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
                <p className="font-semibold">Order #ORD-015</p>
                <p className="text-sm text-muted-foreground">
                  Vendor: Fresh Mart • Distance: 2.8 km
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Reject
                </Button>
                <Button size="sm">Accept</Button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Pickup: 123 Market St → Delivery: 789 Elm Rd</span>
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
                      placeholder="6-digit OTP"
                      maxLength={6}
                      className="bg-white"
                    />
                    <Button>Verify</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Customer will provide OTP to confirm delivery
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  Navigate
                </Button>
                <Button className="flex-1">Update Status</Button>
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
          <div className="p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold">Return #RET-003</p>
                <p className="text-sm text-muted-foreground">
                  Order #ORD-003 • Customer: Bob Wilson
                </p>
              </div>
              <StatusBadge status="placed" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <MapPin className="h-4 w-4" />
              <span>Pickup: 456 Oak Ave → Return to: Fresh Mart</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Reject
              </Button>
              <Button size="sm">Accept Pickup</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
