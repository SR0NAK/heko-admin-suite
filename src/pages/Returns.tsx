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

const mockReturns = [
  {
    id: "RET-001",
    orderId: "ORD-245",
    customer: "Rajesh Kumar",
    items: "Organic Apples (1 kg)",
    reason: "Damaged product",
    status: "pending_approval",
    refundAmount: 180,
    requestDate: "2024-01-26 10:30 AM",
  },
  {
    id: "RET-002",
    orderId: "ORD-238",
    customer: "Priya Sharma",
    items: "Fresh Milk (2 L)",
    reason: "Wrong item delivered",
    status: "approved",
    refundAmount: 120,
    requestDate: "2024-01-25 04:15 PM",
  },
  {
    id: "RET-003",
    orderId: "ORD-231",
    customer: "Amit Patel",
    items: "Tomatoes (500g)",
    reason: "Not fresh",
    status: "pickup_scheduled",
    refundAmount: 30,
    requestDate: "2024-01-25 02:45 PM",
  },
  {
    id: "RET-004",
    orderId: "ORD-224",
    customer: "Neha Singh",
    items: "Bread (2 pcs)",
    reason: "Quality issue",
    status: "completed",
    refundAmount: 60,
    requestDate: "2024-01-24 11:20 AM",
  },
];

export default function Returns() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Returns & Refunds</h1>
          <p className="text-muted-foreground mt-1">
            Manage return requests and refund processing
          </p>
        </div>
        <Button variant="outline">Export Data</Button>
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
              <Input placeholder="Search returns..." className="w-64" />
              <Button variant="outline">Filter</Button>
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
              {mockReturns.map((returnItem) => (
                <TableRow key={returnItem.id}>
                  <TableCell className="font-medium">
                    {returnItem.id}
                  </TableCell>
                  <TableCell>{returnItem.orderId}</TableCell>
                  <TableCell>{returnItem.customer}</TableCell>
                  <TableCell>{returnItem.items}</TableCell>
                  <TableCell>{returnItem.reason}</TableCell>
                  <TableCell>₹{returnItem.refundAmount}</TableCell>
                  <TableCell>{returnItem.requestDate}</TableCell>
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
                          <Button size="sm" variant="outline">
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            Reject
                          </Button>
                        </>
                      )}
                      {returnItem.status !== "pending_approval" && (
                        <Button size="sm" variant="outline">
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
    </div>
  );
}
