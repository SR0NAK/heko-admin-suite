import { Package, MapPin, TrendingUp, Users } from "lucide-react";
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

const mockVendors = [
  {
    id: "V001",
    name: "Fresh Mart",
    phone: "+91 9876543210",
    area: "Koramangala",
    status: "active",
    productsAssigned: 156,
    ordersCompleted: 2341,
    acceptanceRate: 94,
  },
  {
    id: "V002",
    name: "Green Grocers",
    phone: "+91 9876543211",
    area: "Indiranagar",
    status: "active",
    productsAssigned: 203,
    ordersCompleted: 1876,
    acceptanceRate: 89,
  },
  {
    id: "V003",
    name: "Daily Fresh",
    phone: "+91 9876543212",
    area: "Whitefield",
    status: "inactive",
    productsAssigned: 98,
    ordersCompleted: 567,
    acceptanceRate: 76,
  },
];

export default function Vendors() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vendor Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage vendors and their service areas
          </p>
        </div>
        <Button>Add Vendor</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Total Vendors"
          value="24"
          icon={Package}
          trend={{ value: 12, label: "vs last month" }}
        />
        <MetricCard
          title="Active Vendors"
          value="21"
          icon={Users}
        />
        <MetricCard
          title="Avg Products"
          value="152"
          icon={Package}
        />
        <MetricCard
          title="Avg Acceptance"
          value="91%"
          icon={TrendingUp}
          trend={{ value: 3, label: "vs last month" }}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Vendors</CardTitle>
            <div className="flex gap-2">
              <Input placeholder="Search vendors..." className="w-64" />
              <Button variant="outline">Filter</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Service Area</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Acceptance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.id}</TableCell>
                  <TableCell>{vendor.name}</TableCell>
                  <TableCell>{vendor.phone}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {vendor.area}
                    </div>
                  </TableCell>
                  <TableCell>{vendor.productsAssigned}</TableCell>
                  <TableCell>{vendor.ordersCompleted}</TableCell>
                  <TableCell>{vendor.acceptanceRate}%</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        vendor.status === "active" ? "default" : "secondary"
                      }
                    >
                      {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
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
