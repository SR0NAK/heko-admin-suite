import { useState } from "react";
import { Search } from "lucide-react";
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
import { ReturnDetailDialog } from "@/components/ReturnDetailDialog";
import { toast } from "@/hooks/use-toast";

const mockReturns = [
  {
    id: "RET-001",
    orderId: "ORD-003",
    customer: "Alice Johnson",
    product: "Organic Apples",
    reason: "Quality Issue",
    status: "pending" as const,
    date: "2024-01-14",
    amount: "₹250",
  },
  {
    id: "RET-002",
    orderId: "ORD-007",
    customer: "Bob Smith",
    product: "Fresh Milk",
    reason: "Wrong Item",
    status: "pickup_scheduled" as const,
    date: "2024-01-13",
    amount: "₹80",
  },
  {
    id: "RET-003",
    orderId: "ORD-011",
    customer: "Carol White",
    product: "Whole Wheat Bread",
    reason: "Expired Product",
    status: "pending" as const,
    date: "2024-01-15",
    amount: "₹45",
  },
];

export default function VendorReturns() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReturn, setSelectedReturn] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredReturns = mockReturns.filter(
    (ret) =>
      ret.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (returnItem: any) => {
    setSelectedReturn(returnItem);
    setDetailsOpen(true);
  };

  const handleApprove = (returnId: string) => {
    toast({
      title: "Return Approved",
      description: `Return request ${returnId} has been approved`,
    });
  };

  const handleReject = (returnId: string) => {
    toast({
      title: "Return Rejected",
      description: `Return request ${returnId} has been rejected`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Returns</h1>
        <p className="text-muted-foreground">
          Manage product return requests from customers
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search by return ID, customer, or product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
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
                <TableHead>Product</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReturns.map((returnItem) => (
                <TableRow key={returnItem.id}>
                  <TableCell className="font-medium">{returnItem.id}</TableCell>
                  <TableCell>{returnItem.orderId}</TableCell>
                  <TableCell>{returnItem.customer}</TableCell>
                  <TableCell>{returnItem.product}</TableCell>
                  <TableCell className="text-sm">{returnItem.reason}</TableCell>
                  <TableCell className="font-semibold">
                    {returnItem.amount}
                  </TableCell>
                  <TableCell className="text-sm">{returnItem.date}</TableCell>
                  <TableCell>
                    <Badge variant={returnItem.status === "pending" ? "outline" : "secondary"}>
                      {returnItem.status === "pending" ? "Pending" : "Scheduled"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(returnItem)}
                      >
                        View
                      </Button>
                      {returnItem.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(returnItem.id)}
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(returnItem.id)}
                          >
                            Approve
                          </Button>
                        </>
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
      />
    </div>
  );
}
