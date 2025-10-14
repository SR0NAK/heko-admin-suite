import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface ReturnItem {
  id: string;
  orderId: string;
  customer: string;
  items: { name: string; quantity: number; price: number }[];
  reason: string;
  status: string;
  amount: number;
  date: string;
  pickupOtp?: string | null;
  pickupStatus?: string | null;
  deliveryPartnerId?: string | null;
}

interface ReturnDetailDialogProps {
  returnItem: ReturnItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function ReturnDetailDialog({
  returnItem,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: ReturnDetailDialogProps) {
  if (!returnItem) return null;

  const handleApprove = () => {
    if (onApprove) {
      onApprove(returnItem.id);
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject(returnItem.id);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "approved":
      case "pickup_scheduled":
        return "secondary";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Return Request Details</DialogTitle>
          <DialogDescription>
            Complete information about return {returnItem.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Return ID</p>
              <p className="font-medium">{returnItem.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-medium">{returnItem.orderId}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Customer Information</h3>
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{returnItem.customer}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Return Items</h3>
            <div className="space-y-2">
              {returnItem.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-accent/50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-muted-foreground">Request Date</p>
                <p className="font-medium">{returnItem.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="font-medium">{returnItem.items.length}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reason</p>
              <p className="font-medium">{returnItem.reason}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Refund & Status Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Refund Amount</p>
                <p className="font-medium text-lg">₹{returnItem.amount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Return Status</p>
                <Badge variant={getStatusBadgeVariant(returnItem.status)}>
                  {getStatusLabel(returnItem.status)}
                </Badge>
              </div>
            </div>
          </div>

          {(returnItem.pickupOtp || returnItem.pickupStatus || returnItem.deliveryPartnerId) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold">Pickup Information</h3>
                
                {returnItem.pickupOtp && (
                  <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
                    <p className="text-sm text-muted-foreground mb-2">Pickup OTP</p>
                    <p className="text-3xl font-bold tracking-widest text-primary">
                      {returnItem.pickupOtp}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Delivery partner will verify this OTP during pickup
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {returnItem.pickupStatus && (
                    <div>
                      <p className="text-sm text-muted-foreground">Pickup Status</p>
                      <Badge variant="secondary" className="capitalize mt-1">
                        {returnItem.pickupStatus.replace("_", " ")}
                      </Badge>
                    </div>
                  )}
                  {returnItem.deliveryPartnerId && (
                    <div>
                      <p className="text-sm text-muted-foreground">Delivery Partner</p>
                      <p className="font-medium">{returnItem.deliveryPartnerId}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-2">
            <h3 className="font-semibold">Status Timeline</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              {returnItem.status === "pending" && (
                <p>• Return request submitted and awaiting vendor review</p>
              )}
              {returnItem.status === "approved" && (
                <>
                  <p>✓ Return request approved by vendor</p>
                  <p>• Pickup will be scheduled with delivery partner</p>
                </>
              )}
              {returnItem.status === "pickup_scheduled" && (
                <>
                  <p>✓ Return request approved by vendor</p>
                  <p>✓ Pickup scheduled with delivery partner</p>
                  <p>• Awaiting OTP verification and item collection</p>
                </>
              )}
              {returnItem.status === "completed" && (
                <>
                  <p>✓ Return request approved</p>
                  <p>✓ Pickup completed with OTP verification</p>
                  <p>✓ Refund credited to customer's wallet</p>
                </>
              )}
              {returnItem.status === "rejected" && (
                <>
                  <p>✗ Return request rejected by vendor</p>
                  <p>• Customer has been notified</p>
                </>
              )}
            </div>
          </div>

          {returnItem.status === "pending" && (
            <>
              <Separator />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleReject}>
                  Reject Return
                </Button>
                <Button onClick={handleApprove}>
                  Approve Return
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
