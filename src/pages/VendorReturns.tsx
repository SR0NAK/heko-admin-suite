import { useState } from "react";
import { Search, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { ReturnDetailDialog } from "@/components/ReturnDetailDialog";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const mockReturns = [
  {
    id: "RET-001",
    orderId: "ORD-003",
    customer: "Alice Johnson",
    items: [
      { name: "Organic Apples", quantity: 2, price: 125 }
    ],
    reason: "Quality Issue",
    status: "pending" as const,
    date: "2024-01-14",
    amount: 250,
    pickupOtp: null as string | null,
    pickupStatus: null as string | null,
    deliveryPartnerId: null as string | null,
  },
  {
    id: "RET-002",
    orderId: "ORD-007",
    customer: "Bob Smith",
    items: [
      { name: "Fresh Milk", quantity: 1, price: 80 }
    ],
    reason: "Wrong Item",
    status: "approved" as const,
    date: "2024-01-13",
    amount: 80,
    pickupOtp: "5678",
    pickupStatus: "out_for_pickup" as string | null,
    deliveryPartnerId: "DP-002",
  },
  {
    id: "RET-003",
    orderId: "ORD-011",
    customer: "Carol White",
    items: [
      { name: "Whole Wheat Bread", quantity: 1, price: 45 }
    ],
    reason: "Expired Product",
    status: "pending" as const,
    date: "2024-01-15",
    amount: 45,
    pickupOtp: null,
    pickupStatus: null,
    deliveryPartnerId: null,
  },
  {
    id: "RET-004",
    orderId: "ORD-015",
    customer: "David Brown",
    items: [
      { name: "Greek Yogurt", quantity: 2, price: 120 },
      { name: "Fresh Milk", quantity: 1, price: 60 }
    ],
    reason: "Damaged Product",
    status: "pickup_scheduled" as const,
    date: "2024-01-15",
    amount: 300,
    pickupOtp: "1234",
    pickupStatus: "scheduled" as string | null,
    deliveryPartnerId: "DP-001",
  },
];

export default function VendorReturns() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReturn, setSelectedReturn] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [selectedReturnForUpdate, setSelectedReturnForUpdate] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  const filteredReturns = mockReturns.filter((ret) => {
    const matchesSearch =
      ret.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || ret.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (returnItem: any) => {
    setSelectedReturn(returnItem);
    setDetailsOpen(true);
  };

  const handleApprove = (returnId: string) => {
    toast({
      title: "Return Approved",
      description: `Return request ${returnId} has been approved. Pickup will be scheduled.`,
    });
    setDetailsOpen(false);
  };

  const handleReject = (returnId: string) => {
    toast({
      title: "Return Rejected",
      description: `Return request ${returnId} has been rejected. Customer has been notified.`,
      variant: "destructive",
    });
    setDetailsOpen(false);
  };

  const handleUpdatePickupStatus = (returnItem: any) => {
    setSelectedReturnForUpdate(returnItem);
    setNewStatus(returnItem.pickupStatus || "");
    setUpdateStatusDialogOpen(true);
  };

  const handleConfirmStatusUpdate = () => {
    if (selectedReturnForUpdate && newStatus) {
      const statusMessages: { [key: string]: string } = {
        scheduled: "Pickup has been scheduled",
        out_for_pickup: "Delivery partner is on the way for pickup",
        completed: "Pickup completed successfully. Refund will be processed.",
      };

      toast({
        title: "Pickup Status Updated",
        description: `${selectedReturnForUpdate.id}: ${statusMessages[newStatus] || "Status updated"}`,
      });

      setUpdateStatusDialogOpen(false);
      setSelectedReturnForUpdate(null);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "outline";
      case "approved":
        return "secondary";
      case "pickup_scheduled":
        return "default";
      case "completed":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: "Pending Review",
      approved: "Approved",
      pickup_scheduled: "Pickup Scheduled",
      completed: "Completed",
      rejected: "Rejected",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Returns</h1>
        <p className="text-muted-foreground">
          Manage product return requests and pickups
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by return ID, customer, or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pickup_scheduled">Pickup Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Return Requests ({filteredReturns.length})</CardTitle>
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
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pickup Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReturns.map((returnItem) => (
                <TableRow 
                  key={returnItem.id}
                  className="cursor-pointer hover:bg-accent/50"
                  onClick={() => handleViewDetails(returnItem)}
                >
                  <TableCell className="font-medium">{returnItem.id}</TableCell>
                  <TableCell>{returnItem.orderId}</TableCell>
                  <TableCell>{returnItem.customer}</TableCell>
                  <TableCell className="text-sm">
                    {returnItem.items.length} item(s)
                  </TableCell>
                  <TableCell className="text-sm">{returnItem.reason}</TableCell>
                  <TableCell className="font-semibold">
                    ₹{returnItem.amount}
                  </TableCell>
                  <TableCell className="text-sm">{returnItem.date}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(returnItem.status)}>
                      {getStatusLabel(returnItem.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {returnItem.pickupStatus ? (
                      <Badge variant="secondary" className="capitalize">
                        {returnItem.pickupStatus.replace("_", " ")}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(returnItem);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {returnItem.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(returnItem.id);
                          }}
                        >
                          Approve
                        </Button>
                      )}
                      {(returnItem.status === "approved" || returnItem.status === "pickup_scheduled") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdatePickupStatus(returnItem);
                          }}
                        >
                          Update Pickup
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
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        returnItem={selectedReturn}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <Dialog open={updateStatusDialogOpen} onOpenChange={setUpdateStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Pickup Status</DialogTitle>
            <DialogDescription>
              Update the pickup status for return {selectedReturnForUpdate?.id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedReturnForUpdate?.pickupOtp && (
              <div className="p-4 bg-accent/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Pickup OTP</p>
                <p className="text-2xl font-bold tracking-widest">
                  {selectedReturnForUpdate.pickupOtp}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Share this OTP with the delivery partner for verification
                </p>
              </div>
            )}

            <div>
              <Label>Pickup Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="out_for_pickup">Out for Pickup</SelectItem>
                  <SelectItem value="completed">Pickup Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedReturnForUpdate?.deliveryPartnerId && (
              <div>
                <p className="text-sm text-muted-foreground">Assigned Partner</p>
                <p className="font-medium">{selectedReturnForUpdate.deliveryPartnerId}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmStatusUpdate}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
