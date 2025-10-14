import { useState, ReactNode } from "react";
import { FileText, Truck, Package, Calendar, Search, Filter } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HistoryEntry {
  id: string;
  type: "delivery" | "pickup";
  orderId: string;
  customerName: string;
  date: string;
  amount: number;
  status: "completed" | "cancelled";
  earnings: number;
}

const mockHistory: HistoryEntry[] = [
  {
    id: "H001",
    type: "delivery",
    orderId: "ORD100",
    customerName: "John Doe",
    date: "2024-01-14",
    amount: 1299,
    status: "completed",
    earnings: 50,
  },
  {
    id: "H002",
    type: "pickup",
    orderId: "RET050",
    customerName: "Jane Smith",
    date: "2024-01-14",
    amount: 599,
    status: "completed",
    earnings: 30,
  },
  {
    id: "H003",
    type: "delivery",
    orderId: "ORD101",
    customerName: "Bob Wilson",
    date: "2024-01-13",
    amount: 899,
    status: "completed",
    earnings: 45,
  },
  {
    id: "H004",
    type: "delivery",
    orderId: "ORD102",
    customerName: "Alice Brown",
    date: "2024-01-13",
    amount: 2499,
    status: "cancelled",
    earnings: 0,
  },
  {
    id: "H005",
    type: "pickup",
    orderId: "RET051",
    customerName: "Charlie Davis",
    date: "2024-01-12",
    amount: 399,
    status: "completed",
    earnings: 25,
  },
];

interface DashboardLayoutProps {
  title: string;
  children: ReactNode;
}

function DashboardLayoutWrapper({ title, children }: DashboardLayoutProps) {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        {children}
      </div>
    </DashboardLayout>
  );
}

export default function DeliveryHistory() {
  const [history] = useState(mockHistory);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredHistory = history.filter((entry) => {
    const matchesSearch =
      entry.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || entry.type === filterType;
    const matchesStatus = filterStatus === "all" || entry.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalEarnings = history
    .filter((entry) => entry.status === "completed")
    .reduce((sum, entry) => sum + entry.earnings, 0);

  const totalDeliveries = history.filter((entry) => entry.type === "delivery").length;
  const totalPickups = history.filter((entry) => entry.type === "pickup").length;

  return (
    <DashboardLayoutWrapper title="Delivery History">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalEarnings}</div>
              <p className="text-xs text-muted-foreground">
                From completed jobs
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deliveries</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDeliveries}</div>
              <p className="text-xs text-muted-foreground">
                Total deliveries made
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pickups</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPickups}</div>
              <p className="text-xs text-muted-foreground">
                Total pickups completed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
            <CardDescription>View all your past deliveries and pickups</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID or customer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="delivery">Deliveries</SelectItem>
                  <SelectItem value="pickup">Pickups</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {entry.type === "delivery" ? (
                              <Truck className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Package className="h-4 w-4 text-orange-500" />
                            )}
                            <span className="capitalize">{entry.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{entry.orderId}</TableCell>
                        <TableCell>{entry.customerName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {entry.date}
                          </div>
                        </TableCell>
                        <TableCell>₹{entry.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={entry.status === "completed" ? "default" : "destructive"}
                          >
                            {entry.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{entry.earnings}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
    </DashboardLayoutWrapper>
  );
}
