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
import { useReturns } from "@/hooks/useReturns";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Returns() {
  const { returns, isLoading, updateReturnStatus } = useReturns();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedReturn, setSelectedReturn] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const filteredReturns = returns.filter((returnItem) => {
    const matchesSearch = returnItem.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (returnItem.orders?.order_number && returnItem.orders.order_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (returnItem.profiles?.name && returnItem.profiles.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === "all" || returnItem.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleExportData = () => {
    toast.success("Exporting returns data...");
  };

  const handleApprove = (id: string) => {
    updateReturnStatus({ returnId: id, status: "approved" });
  };

  const handleReject = (id: string) => {
    updateReturnStatus({ returnId: id, status: "rejected" });
  };

  const handleView = (id: string) => {
    const returnItem = returns.find(r => r.id === id);
    if (returnItem) {
      setSelectedReturn(returnItem);
      setDetailDialogOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

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
          value={returns.filter(r => r.status === "requested").length.toString()}
          icon={Clock}
        />
        <MetricCard
          title="Pickup Scheduled"
          value={returns.filter(r => r.status === "pickup_scheduled").length.toString()}
          icon={Package}
        />
        <MetricCard
          title="Completed"
          value={returns.filter(r => r.status === "completed").length.toString()}
          icon={CheckCircle}
        />
        <MetricCard
          title="Total Refunded"
          value={`₹${returns.filter(r => r.status === "completed").reduce((sum, r) => sum + (r.refund_amount || 0), 0).toFixed(0)}`}
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
                    {returnItem.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>{returnItem.orders?.order_number || "N/A"}</TableCell>
                  <TableCell>{returnItem.profiles?.name || "N/A"}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{returnItem.reason}</TableCell>
                  <TableCell>₹{returnItem.refund_amount || 0}</TableCell>
                  <TableCell>{new Date(returnItem.created_at).toLocaleDateString()}</TableCell>
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
                      {returnItem.status === "requested"
                        ? "Pending"
                        : returnItem.status === "approved"
                        ? "Approved"
                        : returnItem.status === "pickup_scheduled"
                        ? "Pickup Scheduled"
                        : returnItem.status === "picked_up"
                        ? "Picked Up"
                        : "Completed"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {returnItem.status === "requested" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleApprove(returnItem.id)}>
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleReject(returnItem.id)}>
                            Reject
                          </Button>
                        </>
                      )}
                      {returnItem.status !== "requested" && (
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
