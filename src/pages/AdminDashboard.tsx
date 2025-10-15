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
import { useDashboard } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { metrics, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

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
          value={metrics?.totalOrders.toString() || "0"}
          icon={ShoppingCart}
          variant="default"
        />
        <MetricCard
          title="Active Vendors"
          value={metrics?.activeVendors.toString() || "0"}
          icon={Package}
          variant="primary"
        />
        <MetricCard
          title="Delivery Partners"
          value={metrics?.deliveryPartners.toString() || "0"}
          icon={Users}
          variant="secondary"
        />
        <MetricCard
          title="Pending Actions"
          value={((metrics?.unassignedDeliveries || 0) + (metrics?.pendingReturns || 0)).toString()}
          icon={TrendingUp}
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
                  {metrics?.unassignedDeliveries || 0} deliveries awaiting partner assignment
                </p>
              </div>
              <span className="text-2xl font-bold text-[hsl(var(--status-pending))]">
                {metrics?.unassignedDeliveries || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Pending Returns</p>
                <p className="text-sm text-muted-foreground">
                  {metrics?.pendingReturns || 0} return requests awaiting review
                </p>
              </div>
              <span className="text-2xl font-bold text-[hsl(var(--status-pending))]">
                {metrics?.pendingReturns || 0}
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
              {metrics?.recentOrders.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">Customer</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>- items</TableCell>
                  <TableCell className="font-semibold">₹{order.total}</TableCell>
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
