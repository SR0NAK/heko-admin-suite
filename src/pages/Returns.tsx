import { useState } from "react";
import { Package, XCircle, CheckCircle, Clock } from "lucide-react";
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
import { ReturnDetailDialog } from "@/components/ReturnDetailDialog";
import { toast } from "sonner";

const mockReturns = [
  {
    id: "RET-001",
    orderId: "ORD-245",
    customer: "Rajesh Kumar",
    items: [{ name: "Organic Apples", quantity: 1, price: 180 }],
    reason: "Damaged product",
    status: "pending",
    amount: 180,
    date: "2024-01-26",
    pickupOtp: null,
    pickupStatus: null,
    deliveryPartnerId: null,
  },
  {
    id: "RET-002",
    orderId: "ORD-238",
    customer: "Priya Sharma",
    items: [{ name: "Fresh Milk", quantity: 2, price: 60 }],
    reason: "Wrong item delivered",
    status: "approved",
    amount: 120,
    date: "2024-01-25",
    pickupOtp: "3456",
    pickupStatus: "scheduled",
    deliveryPartnerId: "DP-003",
  },
  {
    id: "RET-003",
    orderId: "ORD-231",
    customer: "Amit Patel",
    items: [{ name: "Tomatoes", quantity: 1, price: 30 }],
    reason: "Not fresh",
    status: "pickup_scheduled",
    amount: 30,
    date: "2024-01-25",
    pickupOtp: "7890",
    pickupStatus: "out_for_pickup",
    deliveryPartnerId: "DP-001",
  },
  {
    id: "RET-004",
    orderId: "ORD-224",
    customer: "Neha Singh",
    items: [{ name: "Bread", quantity: 2, price: 30 }],
    reason: "Quality issue",
    status: "completed",
    amount: 60,
    date: "2024-01-24",
    pickupOtp: null,
    pickupStatus: "completed",
    deliveryPartnerId: "DP-002",
  },
];

export default function Returns() {
  const [returns, setReturns] = useState(mockReturns);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedReturn, setSelectedReturn] = useState<typeof mockReturns[0] | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const filteredReturns = returns.filter((returnItem) => {
    const matchesSearch = returnItem.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      returnItem.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      returnItem.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || returnItem.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleExportData = () => {
    toast.success("Exporting returns data...");
  };

  const handleApprove = (id: string) => {
    setReturns(returns.map(r => r.id === id ? { ...r, status: "approved" } : r));
    toast.success(`Return ${id} approved`);
  };

  const handleReject = (id: string) => {
    toast.error(`Return ${id} rejected`);
  };

  const handleView = (id: string) => {
    const returnItem = returns.find(r => r.id === id);
    if (returnItem) {
      setSelectedReturn(returnItem);
      setDetailDialogOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Returns & Refunds</h1>
          <p className="text-muted-foreground mt-1">
            Manage return requests and refund processing
          </p>
        </div>
        <Button variant="outline" onClick={handleExportData}>Export Data</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Pending Approval"
          value="12"
          icon={Clock}
        />
        <MetricCard
          title="Pickup Scheduled"
          value="8"
          icon={Package}
        />
        <MetricCard
          title="Completed Today"
          value="15"
          icon={CheckCircle}
        />
        <MetricCard
          title="Total Refunded"
          value="₹12,450"
          icon={XCircle}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Return Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">
            <p className="font-medium">Current Configuration:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>Returns allowed within 24 hours of delivery</li>
              <li>OTP verification required for pickup completion</li>
              <li>Refund credited to actual wallet (not virtual)</li>
              <li>No external withdrawal allowed</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Return Requests</CardTitle>
            <div className="flex gap-2">
              <Input 
                placeholder="Search returns..." 
                className="w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                variant="outline"
                onClick={() => setFilterStatus(filterStatus === "all" ? "pending_approval" : "all")}
              >
                {filterStatus === "all" ? "Show Pending" : "Show All"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Return ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Refund Amount</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReturns.map((returnItem) => (
                <TableRow key={returnItem.id}>
                  <TableCell className="font-medium">
                    {returnItem.id}
                  </TableCell>
                  <TableCell>{returnItem.orderId}</TableCell>
                  <TableCell>{returnItem.customer}</TableCell>
                  <TableCell>{returnItem.items.length} item(s)</TableCell>
                  <TableCell>{returnItem.reason}</TableCell>
                  <TableCell>₹{returnItem.amount}</TableCell>
                  <TableCell>{returnItem.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        returnItem.status === "completed"
                          ? "default"
                          : returnItem.status === "approved" ||
                            returnItem.status === "pickup_scheduled"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {returnItem.status === "pending_approval"
                        ? "Pending"
                        : returnItem.status === "approved"
                        ? "Approved"
                        : returnItem.status === "pickup_scheduled"
                        ? "Pickup Scheduled"
                        : "Completed"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {returnItem.status === "pending_approval" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleApprove(returnItem.id)}>
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleReject(returnItem.id)}>
                            Reject
                          </Button>
                        </>
                      )}
                      {returnItem.status !== "pending_approval" && (
                        <Button size="sm" variant="outline" onClick={() => handleView(returnItem.id)}>
                          View
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ReturnDetailDialog
        returnItem={selectedReturn}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
