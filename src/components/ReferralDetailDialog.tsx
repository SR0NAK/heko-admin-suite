import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Referral {
  id: string;
  referrer: string;
  referee: string;
  orderValue: number;
  rewardEarned: number;
  status: string;
  date: string;
}

interface ReferralDetailDialogProps {
  referral: Referral | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReferralDetailDialog({
  referral,
  open,
  onOpenChange,
}: ReferralDetailDialogProps) {
  if (!referral) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Referral Details</DialogTitle>
          <DialogDescription>
            Complete information about referral #{referral.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Referral ID</p>
              <p className="font-medium">{referral.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{referral.date}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Referrer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name & Code</p>
                <p className="font-medium">{referral.referrer}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Referee Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{referral.referee}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Conversion Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Order Value</p>
                <p className="font-medium">
                  {referral.orderValue > 0 ? `₹${referral.orderValue}` : "Not converted yet"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reward Earned</p>
                <p className="font-medium">
                  {referral.rewardEarned > 0 ? `₹${referral.rewardEarned}` : "Not earned yet"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Status</h3>
            <div>
              <Badge
                variant={
                  referral.status === "converted"
                    ? "default"
                    : referral.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
              >
                {referral.status === "converted"
                  ? "Converted"
                  : referral.status === "pending"
                  ? "Pending"
                  : "Insufficient Balance"}
              </Badge>
              {referral.status === "insufficient_balance" && (
                <p className="text-sm text-muted-foreground mt-2">
                  The referee doesn't have sufficient virtual wallet balance to convert this referral.
                </p>
              )}
              {referral.status === "pending" && (
                <p className="text-sm text-muted-foreground mt-2">
                  Waiting for the referee to complete their first order.
                </p>
              )}
              {referral.status === "converted" && (
                <p className="text-sm text-muted-foreground mt-2">
                  Referral successfully converted and reward credited to referrer's wallet.
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
