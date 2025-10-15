import { useState } from "react";
import {
  ShoppingCart,
  Package,
  Clock,
  TrendingUp,
  AlertTriangle,
  Eye,
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
import { VendorOrderDetailDialog } from "@/components/VendorOrderDetailDialog";
import { useToast } from "@/hooks/use-toast";
import { useVendorOrders } from "@/hooks/useVendorOrders";
import { useVendorReturns } from "@/hooks/useVendorReturns";

export default function VendorDashboard() {
  const { toast } = useToast();
  const { orders, isLoading: ordersLoading, updateItemStatus } = useVendorOrders();
  const { returns, isLoading: returnsLoading } = useVendorReturns();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleViewDetails = (order: any, withActions = false) => {
    setSelectedOrder(order);
    setShowActions(withActions);
    setDialogOpen(true);
  };

  const handleAccept = () => {
    toast({
      title: "Order Accepted",
      description: `Order ${selectedOrder?.id} has been accepted successfully.`,
    });
    setDialogOpen(false);
  };

  const handleReject = () => {
    toast({
      title: "Order Rejected",
      description: `Order ${selectedOrder?.id} has been rejected.`,
      variant: "destructive",
    });
    setDialogOpen(false);
  };

  const handlePartialAccept = (selectedItems: any[]) => {
    const itemNames = selectedItems.map(item => item.name).join(", ");
    toast({
      title: "Partial Order Accepted",
      description: `Accepted ${selectedItems.length} item(s) from order ${selectedOrder?.id}: ${itemNames}`,
    });
    setDialogOpen(false);
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  if (ordersLoading || returnsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const newOrders = orders.filter((o: any) => o.status === "placed") || [];
  const activeOrders = orders.filter((o: any) => ["preparing", "out_for_delivery"].includes(o.status)) || [];
  const preparingOrders = orders.filter((o: any) => o.status === "preparing") || [];
  const pendingReturns = returns.filter((r: any) => r.status === "requested") || [];
  
  const todayRevenue = orders
    .filter((o: any) => {
      const today = new Date().toDateString();
      return new Date(o.created_at).toDateString() === today && o.status === "delivered";
    })
    .reduce((sum: number, o: any) => sum + parseFloat(o.total || 0), 0);

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
          value={newOrders.length.toString()}
          icon={ShoppingCart}
          variant="default"
        />
        <MetricCard
          title="Preparing"
          value={preparingOrders.length.toString()}
          icon={Package}
          variant="secondary"
        />
        <MetricCard
          title="Active Orders"
          value={activeOrders.length.toString()}
          icon={Clock}
          variant="primary"
        />
        <MetricCard
          title="Today's Revenue"
          value={`₹${todayRevenue.toLocaleString()}`}
          icon={TrendingUp}
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
          {newOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No new orders</p>
          ) : (
            newOrders.map((order: any) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white border cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => handleViewDetails(order, true)}
              >
                <div>
                  <p className="font-semibold">Order #{order.order_number}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items?.length || 0} items
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(order, true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept();
                    }}
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active Orders</CardTitle>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/vendor-orders'}>
            View All
          </Button>
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
              {activeOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-4">
                    No active orders
                  </TableCell>
                </TableRow>
              ) : (
                activeOrders.map((order: any) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => handleViewDetails(order, false)}
                  >
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>{order.items?.length || 0}</TableCell>
                    <TableCell className="font-semibold">₹{order.total}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(order, false);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast({
                  title: "Status Updated",
                  description: "Organic Tomatoes marked as out of stock",
                })}
              >
                Mark Out
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Fresh Milk</p>
                <p className="text-sm text-muted-foreground">In Stock</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast({
                  title: "Status Updated",
                  description: "Fresh Milk marked as out of stock",
                })}
              >
                Mark Out
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Whole Wheat Bread</p>
                <p className="text-sm text-destructive">Out of Stock</p>
              </div>
              <Button 
                size="sm"
                onClick={() => toast({
                  title: "Status Updated",
                  description: "Whole Wheat Bread marked as available",
                })}
              >
                Mark Available
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Return Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingReturns.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No pending return requests</p>
            ) : (
              pendingReturns.slice(0, 3).map((ret: any) => (
                <div key={ret.id} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Return #{ret.id.slice(0, 8)}</p>
                    <StatusBadge status={ret.status} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Order: {ret.orders?.order_number} • {ret.reason}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.location.href = '/vendor-returns'}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <VendorOrderDetailDialog
        order={selectedOrder}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAccept={handleAccept}
        onReject={handleReject}
        onPartialAccept={handlePartialAccept}
        showActions={showActions}
      />
    </div>
  );
}
