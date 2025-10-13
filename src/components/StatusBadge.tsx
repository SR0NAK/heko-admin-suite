import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type OrderStatus =
  | "placed"
  | "processing"
  | "partially_accepted"
  | "preparing"
  | "picked"
  | "out_for_delivery"
  | "delivered"
  | "partially_delivered"
  | "unfulfillable"
  | "canceled"
  | "failed";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  placed: {
    label: "Placed",
    className: "bg-[hsl(var(--status-processing))] text-white hover:bg-[hsl(var(--status-processing))]",
  },
  processing: {
    label: "Processing",
    className: "bg-[hsl(var(--status-processing))] text-white hover:bg-[hsl(var(--status-processing))]",
  },
  partially_accepted: {
    label: "Partially Accepted",
    className: "bg-[hsl(var(--status-pending))] text-white hover:bg-[hsl(var(--status-pending))]",
  },
  preparing: {
    label: "Preparing",
    className: "bg-[hsl(var(--status-pending))] text-white hover:bg-[hsl(var(--status-pending))]",
  },
  picked: {
    label: "Picked Up",
    className: "bg-[hsl(var(--status-processing))] text-white hover:bg-[hsl(var(--status-processing))]",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    className: "bg-[hsl(var(--status-processing))] text-white hover:bg-[hsl(var(--status-processing))]",
  },
  delivered: {
    label: "Delivered",
    className: "bg-[hsl(var(--status-delivered))] text-white hover:bg-[hsl(var(--status-delivered))]",
  },
  partially_delivered: {
    label: "Partially Delivered",
    className: "bg-[hsl(var(--status-delivered))] text-white hover:bg-[hsl(var(--status-delivered))]",
  },
  unfulfillable: {
    label: "Unfulfillable",
    className: "bg-[hsl(var(--status-unfulfillable))] text-white hover:bg-[hsl(var(--status-unfulfillable))]",
  },
  canceled: {
    label: "Canceled",
    className: "bg-[hsl(var(--status-failed))] text-white hover:bg-[hsl(var(--status-failed))]",
  },
  failed: {
    label: "Failed",
    className: "bg-[hsl(var(--status-failed))] text-white hover:bg-[hsl(var(--status-failed))]",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
