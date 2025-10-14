import { Truck, Star, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/MetricCard";

const mockPartners = [
  {
    id: "DP001",
    name: "Rajesh Kumar",
    phone: "+91 9876543210",
    vehicle: "Bike",
    status: "active",
    activeDeliveries: 3,
    completedToday: 12,
    rating: 4.8,
    avgTime: "18 min",
  },
  {
    id: "DP002",
    name: "Suresh Babu",
    phone: "+91 9876543211",
    vehicle: "Bike",
    status: "active",
    activeDeliveries: 2,
    completedToday: 15,
    rating: 4.9,
    avgTime: "16 min",
  },
  {
    id: "DP003",
    name: "Amit Sharma",
    phone: "+91 9876543212",
    vehicle: "Scooter",
    status: "offline",
    activeDeliveries: 0,
    completedToday: 0,
    rating: 4.6,
    avgTime: "20 min",
  },
];

export default function DeliveryPartners() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Delivery Partners</h1>
          <p className="text-muted-foreground mt-1">
            Manage delivery partners and assignments
          </p>
        </div>
        <Button>Add Partner</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Total Partners"
          value="45"
          icon={Truck}
          trend={{ value: 8, label: "vs last month" }}
        />
        <MetricCard
          title="Active Now"
          value="32"
          icon={Truck}
        />
        <MetricCard
          title="Avg Rating"
          value="4.7"
          icon={Star}
        />
        <MetricCard
          title="Avg Time"
          value="18 min"
          icon={Clock}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Delivery Partners</CardTitle>
            <div className="flex gap-2">
              <Input placeholder="Search partners..." className="w-64" />
              <Button variant="outline">Filter</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Today</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Avg Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPartners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">{partner.id}</TableCell>
                  <TableCell>{partner.name}</TableCell>
                  <TableCell>{partner.phone}</TableCell>
                  <TableCell>{partner.vehicle}</TableCell>
                  <TableCell>{partner.activeDeliveries}</TableCell>
                  <TableCell>{partner.completedToday}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {partner.rating}
                    </div>
                  </TableCell>
                  <TableCell>{partner.avgTime}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        partner.status === "active" ? "default" : "secondary"
                      }
                    >
                      {partner.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        Assign
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
