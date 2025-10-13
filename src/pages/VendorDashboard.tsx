import {
  ShoppingCart,
  Package,
  Clock,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const assignedOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    items: 3,
    total: "₹750",
    status: "preparing" as const,
    timeRemaining: "15m",
  },
  {
    id: "ORD-005",
    customer: "Sarah Connor",
    items: 5,
    total: "₹1,200",
    status: "placed" as const,
    timeRemaining: "45m",
  },
  {
    id: "ORD-008",
    customer: "Mike Ross",
    items: 2,
    total: "₹450",
    status: "out_for_delivery" as const,
    timeRemaining: "-",
  },
];

export default function VendorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
        <p className="text-muted-foreground">
          Fresh Mart - Store Workspace
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Pending Orders"
          value="8"
          icon={ShoppingCart}
          variant="default"
        />
        <MetricCard
          title="Preparing"
          value="5"
          icon={Package}
          variant="secondary"
        />
        <MetricCard
          title="Avg Prep Time"
          value="18m"
          icon={Clock}
          variant="primary"
        />
        <MetricCard
          title="Today's Revenue"
          value="₹12,450"
          icon={TrendingUp}
          trend={{ value: 8, label: "vs yesterday" }}
          variant="accent"
        />
      </div>

      <Card className="border-[hsl(var(--status-pending))] bg-[hsl(var(--metric-bg-3))]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[hsl(var(--status-pending))]" />
            New Order Assignments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white border">
            <div>
              <p className="font-semibold">Order #ORD-012</p>
              <p className="text-sm text-muted-foreground">
                6 items • Customer: Emily Davis
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Reject
              </Button>
              <Button size="sm">Accept All</Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-white border">
            <div>
              <p className="font-semibold">Order #ORD-013</p>
              <p className="text-sm text-muted-foreground">
                4 items • Customer: Tom Hardy
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Partial Accept
              </Button>
              <Button size="sm">Accept All</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time Left</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell className="font-semibold">{order.total}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {order.timeRemaining}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Update Status
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Organic Tomatoes</p>
                <p className="text-sm text-muted-foreground">In Stock</p>
              </div>
              <Button variant="outline" size="sm">
                Mark Out
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Fresh Milk</p>
                <p className="text-sm text-muted-foreground">In Stock</p>
              </div>
              <Button variant="outline" size="sm">
                Mark Out
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Whole Wheat Bread</p>
                <p className="text-sm text-destructive">Out of Stock</p>
              </div>
              <Button size="sm">Mark Available</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Return Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Order #ORD-003</p>
                <StatusBadge status="delivered" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Item: Organic Apples • Reason: Quality Issue
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Reject
                </Button>
                <Button size="sm" className="flex-1">
                  Approve
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
