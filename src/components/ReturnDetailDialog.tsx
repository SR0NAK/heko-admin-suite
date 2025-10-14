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
  items: string;
  reason: string;
  status: string;
  refundAmount: number;
  requestDate: string;
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
      onOpenChange(false);
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject(returnItem.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
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
            <h3 className="font-semibold">Return Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Items</p>
                <p className="font-medium">{returnItem.items}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Request Date</p>
                <p className="font-medium">{returnItem.requestDate}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reason</p>
              <p className="font-medium">{returnItem.reason}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Refund Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Refund Amount</p>
                <p className="font-medium text-lg">₹{returnItem.refundAmount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
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
                    ? "Pending Approval"
                    : returnItem.status === "approved"
                    ? "Approved"
                    : returnItem.status === "pickup_scheduled"
                    ? "Pickup Scheduled"
                    : "Completed"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-semibold">Status Timeline</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              {returnItem.status === "pending_approval" && (
                <p>• Return request submitted and awaiting admin approval</p>
              )}
              {returnItem.status === "approved" && (
                <>
                  <p>✓ Return request approved</p>
                  <p>• Pickup will be scheduled soon</p>
                </>
              )}
              {returnItem.status === "pickup_scheduled" && (
                <>
                  <p>✓ Return request approved</p>
                  <p>✓ Pickup scheduled</p>
                  <p>• Awaiting item collection and refund processing</p>
                </>
              )}
              {returnItem.status === "completed" && (
                <>
                  <p>✓ Return request approved</p>
                  <p>✓ Pickup completed</p>
                  <p>✓ Refund credited to customer's actual wallet</p>
                </>
              )}
            </div>
          </div>

          {returnItem.status === "pending_approval" && (
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
