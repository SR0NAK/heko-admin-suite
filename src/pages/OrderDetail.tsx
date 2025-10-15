import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Package, MapPin, User, Wallet, Clock } from "lucide-react";
import { StatusBadge, OrderStatus } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles(name),
          order_items(*),
          user_addresses(*)
        `)
        .eq("id", orderId)
        .single();

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        setOrder(data);
      }
      setIsLoading(false);
    };

    fetchOrder();
  }, [orderId, toast]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    // Filter out delivery-specific statuses for orders table
    const orderStatuses = ["placed", "processing", "partially_accepted", "preparing", "out_for_delivery", "delivered", "partially_delivered", "unfulfillable", "canceled", "failed"];
    if (!orderStatuses.includes(newStatus)) {
      toast({ title: "Invalid status for order", variant: "destructive" });
      return;
    }
    
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus as any })
      .eq("id", orderId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setOrder({ ...order, status: newStatus });
      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/orders')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{order.order_number}</h1>
            <p className="text-muted-foreground">Order Details</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Order Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{order.total}</div>
            <p className="text-xs text-muted-foreground">
              Subtotal: ₹{order.subtotal} + Delivery: ₹{order.deliveryFee}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Used</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{order.walletUsed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{order.items.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Customer Name</p>
                <p className="font-medium">{order.profiles?.name || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Delivery Address</p>
                <p className="font-medium">{order.user_addresses?.address_line1 || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Update Status</label>
              <Select value={order.status} onValueChange={(value) => handleStatusUpdate(value as OrderStatus)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placed">Placed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="partially_accepted">Partially Accepted</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="partially_delivered">Partially Delivered</SelectItem>
                  <SelectItem value="unfulfillable">Unfulfillable</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Delivery Partner</p>
              <p className="font-medium">-</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Delivery OTP</p>
              <p className="font-mono text-2xl font-bold">-</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.order_items?.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.product_name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>₹{item.unit_price}</TableCell>
                  <TableCell className="text-right">₹{item.total_price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span className="font-medium">-₹{order.discount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="font-medium">₹{order.deliveryFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Wallet Used</span>
              <span className="font-medium">-₹{order.walletUsed}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-lg">
              <span className="font-bold">Total</span>
              <span className="font-bold">₹{order.total}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}