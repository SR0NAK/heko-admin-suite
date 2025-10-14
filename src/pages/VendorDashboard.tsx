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

const newOrderAssignments = [
  {
    id: "ORD-012",
    customer: "Emily Davis",
    items: [
      { name: "Organic Apples", quantity: 2, price: 180 },
      { name: "Fresh Milk", quantity: 2, price: 60 },
      { name: "Whole Wheat Bread", quantity: 1, price: 45 },
      { name: "Organic Tomatoes", quantity: 1, price: 80 },
      { name: "Free Range Eggs", quantity: 1, price: 90 },
      { name: "Greek Yogurt", quantity: 1, price: 120 },
    ],
    total: 735,
    status: "placed" as const,
    timeRemaining: "30m",
  },
  {
    id: "ORD-013",
    customer: "Tom Hardy",
    items: [
      { name: "Organic Apples", quantity: 1, price: 180 },
      { name: "Fresh Milk", quantity: 3, price: 60 },
      { name: "Brown Bread", quantity: 2, price: 50 },
      { name: "Paneer", quantity: 1, price: 150 },
    ],
    total: 610,
    status: "placed" as const,
    timeRemaining: "25m",
  },
];

const assignedOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    items: [
      { name: "Organic Tomatoes", quantity: 2, price: 80 },
      { name: "Fresh Milk", quantity: 1, price: 60 },
      { name: "Whole Wheat Bread", quantity: 2, price: 45 },
    ],
    total: 310,
    status: "preparing" as const,
    timeRemaining: "15m",
  },
  {
    id: "ORD-005",
    customer: "Sarah Connor",
    items: [
      { name: "Organic Apples", quantity: 3, price: 180 },
      { name: "Greek Yogurt", quantity: 2, price: 120 },
      { name: "Free Range Eggs", quantity: 2, price: 90 },
      { name: "Fresh Milk", quantity: 2, price: 60 },
      { name: "Paneer", quantity: 1, price: 150 },
    ],
    total: 1200,
    status: "placed" as const,
    timeRemaining: "45m",
  },
  {
    id: "ORD-008",
    customer: "Mike Ross",
    items: [
      { name: "Organic Apples", quantity: 1, price: 180 },
      { name: "Fresh Milk", quantity: 1, price: 60 },
    ],
    total: 450,
    status: "out_for_delivery" as const,
    timeRemaining: "-",
  },
];

export default function VendorDashboard() {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<typeof assignedOrders[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleViewDetails = (order: typeof assignedOrders[0], withActions = false) => {
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

  const handlePartialAccept = (selectedItems: typeof assignedOrders[0]['items']) => {
    const itemNames = selectedItems.map(item => item.name).join(", ");
    toast({
      title: "Partial Order Accepted",
      description: `Accepted ${selectedItems.length} item(s) from order ${selectedOrder?.id}: ${itemNames}`,
    });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">{" "}
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
          {newOrderAssignments.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 rounded-lg bg-white border cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => handleViewDetails(order, true)}
            >
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-sm text-muted-foreground">
                  {order.items.length} items • Customer: {order.customer}
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
          ))}
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
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-accent/50"
                  onClick={() => handleViewDetails(order, false)}
                >
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <TableCell className="font-semibold">₹{order.total}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {order.timeRemaining}
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Update Status
                      </Button>
                    </div>
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
