import {
  ShoppingCart,
  Package,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    items: 5,
    total: "₹1,250",
    status: "out_for_delivery" as const,
    vendor: "Fresh Mart",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    items: 3,
    total: "₹850",
    status: "preparing" as const,
    vendor: "Green Grocers",
  },
  {
    id: "ORD-003",
    customer: "Bob Wilson",
    items: 7,
    total: "₹2,100",
    status: "delivered" as const,
    vendor: "Fresh Mart",
  },
  {
    id: "ORD-004",
    customer: "Alice Brown",
    items: 4,
    total: "₹950",
    status: "partially_accepted" as const,
    vendor: "Multiple",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your grocery marketplace
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Orders"
          value="1,284"
          icon={ShoppingCart}
          trend={{ value: 12, label: "from last month" }}
          variant="default"
        />
        <MetricCard
          title="Active Vendors"
          value="47"
          icon={Package}
          trend={{ value: 8, label: "from last month" }}
          variant="primary"
        />
        <MetricCard
          title="Delivery Partners"
          value="128"
          icon={Users}
          trend={{ value: 15, label: "from last month" }}
          variant="secondary"
        />
        <MetricCard
          title="Conversion Rate"
          value="94%"
          icon={TrendingUp}
          trend={{ value: 3, label: "from last month" }}
          variant="accent"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[hsl(var(--status-pending))]" />
              Pending Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Unassigned Deliveries</p>
                <p className="text-sm text-muted-foreground">
                  3 deliveries awaiting partner assignment
                </p>
              </div>
              <span className="text-2xl font-bold text-[hsl(var(--status-pending))]">
                3
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Pending Returns</p>
                <p className="text-sm text-muted-foreground">
                  5 return requests awaiting review
                </p>
              </div>
              <span className="text-2xl font-bold text-[hsl(var(--status-pending))]">
                5
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Split Order Conflicts</p>
                <p className="text-sm text-muted-foreground">
                  2 orders need manual vendor assignment
                </p>
              </div>
              <span className="text-2xl font-bold text-[hsl(var(--status-pending))]">
                2
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[hsl(var(--status-delivered))]" />
              Today's Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--metric-bg-1))]">
              <div>
                <p className="font-medium">Orders Delivered</p>
                <p className="text-sm text-muted-foreground">Successfully completed</p>
              </div>
              <span className="text-2xl font-bold text-[hsl(var(--status-delivered))]">
                142
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--metric-bg-2))]">
              <div>
                <p className="font-medium">Avg Delivery Time</p>
                <p className="text-sm text-muted-foreground">Within 5km radius</p>
              </div>
              <span className="text-2xl font-bold text-primary">28m</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--metric-bg-4))]">
              <div>
                <p className="font-medium">Referral Conversions</p>
                <p className="text-sm text-muted-foreground">
                  Successful today
                </p>
              </div>
              <span className="text-2xl font-bold text-[hsl(var(--wallet-virtual))]">
                38
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.vendor}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell className="font-semibold">{order.total}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
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
