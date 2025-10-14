import { useState } from "react";
import { Search, Filter, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { VendorOrderDetailDialog } from "@/components/VendorOrderDetailDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const mockOrders = [
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
    date: "2024-01-15 10:30",
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
    date: "2024-01-15 11:15",
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
    date: "2024-01-15 09:20",
  },
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
    timeRemaining: "60m",
    date: "2024-01-15 12:00",
  },
];

export default function VendorOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order: typeof mockOrders[0]) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assigned Orders</h1>
        <p className="text-muted-foreground">
          Manage and track your assigned orders
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by order ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="placed">Placed</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time Left</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow 
                  key={order.id}
                  className="cursor-pointer hover:bg-accent/50"
                  onClick={() => handleViewDetails(order)}
                >
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell className="text-sm">{order.date}</TableCell>
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
                          handleViewDetails(order);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={order.status === "out_for_delivery"}
                        onClick={(e) => {
                          e.stopPropagation();
                          let nextStatus = "";
                          if (order.status === "placed") {
                            nextStatus = "preparing";
                          } else if (order.status === "preparing") {
                            nextStatus = "out_for_delivery";
                          }
                          if (nextStatus) {
                            handleUpdateStatus(order.id, nextStatus);
                          }
                        }}
                      >
                        {order.status === "placed" && "Mark as Preparing"}
                        {order.status === "preparing" && "Mark Out for Delivery"}
                        {order.status === "out_for_delivery" && "Out for Delivery"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <VendorOrderDetailDialog
        order={selectedOrder}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        showActions={false}
      />
    </div>
  );
}
