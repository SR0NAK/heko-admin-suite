import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Package, User, MapPin, Clock } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  items: OrderItem[];
  total: number;
  status: string;
  timeRemaining?: string;
}

interface VendorOrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept?: () => void;
  onReject?: () => void;
  onPartialAccept?: (selectedItems: OrderItem[]) => void;
  showActions?: boolean;
}

export function VendorOrderDetailDialog({
  order,
  open,
  onOpenChange,
  onAccept,
  onReject,
  onPartialAccept,
  showActions = false,
}: VendorOrderDetailDialogProps) {
  const [partialMode, setPartialMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (open) {
      setPartialMode(false);
      setSelectedItems(new Set());
    }
  }, [open]);

  if (!order) return null;

  const toggleItemSelection = (index: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const handlePartialAcceptClick = () => {
    if (partialMode) {
      const selected = order.items.filter((_, index) => selectedItems.has(index));
      if (selected.length > 0 && onPartialAccept) {
        onPartialAccept(selected);
      }
    } else {
      setPartialMode(true);
    }
  };

  const selectedTotal = order.items
    .filter((_, index) => selectedItems.has(index))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details - {order.id}
          </DialogTitle>
          <DialogDescription>
            Review the complete order information and product list
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer & Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{order.customer}</p>
              </div>
            </div>
            {order.timeRemaining && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Time Remaining</p>
                  <p className="font-medium">{order.timeRemaining}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Product List */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products ({order.items.length} items)
              {partialMode && (
                <Badge variant="secondary" className="ml-2">
                  Select items to accept
                </Badge>
              )}
            </h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    partialMode
                      ? selectedItems.has(index)
                        ? "bg-accent border-primary"
                        : "bg-card hover:bg-accent/50 cursor-pointer"
                      : "bg-card"
                  }`}
                  onClick={() => partialMode && toggleItemSelection(index)}
                >
                  {partialMode && (
                    <Checkbox
                      checked={selectedItems.has(index)}
                      onCheckedChange={() => toggleItemSelection(index)}
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{item.price}</p>
                    <p className="text-sm text-muted-foreground">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {partialMode && selectedItems.size > 0
                  ? "Selected Items Total"
                  : "Subtotal"}
              </span>
              <span className="font-medium">
                ₹{partialMode && selectedItems.size > 0 ? selectedTotal : order.total}
              </span>
            </div>
            {partialMode && selectedItems.size > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Original Total</span>
                <span className="text-muted-foreground line-through">₹{order.total}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total Amount</span>
              <span>
                ₹{partialMode && selectedItems.size > 0 ? selectedTotal : order.total}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <>
              <Separator />
              {partialMode && (
                <div className="bg-accent/50 p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    {selectedItems.size === 0
                      ? "Select items you can fulfill from the list above"
                      : `${selectedItems.size} of ${order.items.length} items selected`}
                  </p>
                </div>
              )}
              <div className="flex gap-2 justify-end">
                {partialMode ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPartialMode(false);
                        setSelectedItems(new Set());
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePartialAcceptClick}
                      disabled={selectedItems.size === 0}
                    >
                      Confirm Selection ({selectedItems.size} items)
                    </Button>
                  </>
                ) : (
                  <>
                    {onReject && (
                      <Button variant="outline" onClick={onReject}>
                        Reject
                      </Button>
                    )}
                    {onPartialAccept && (
                      <Button variant="outline" onClick={handlePartialAcceptClick}>
                        Partial Accept
                      </Button>
                    )}
                    {onAccept && (
                      <Button onClick={onAccept}>
                        Accept All
                      </Button>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
