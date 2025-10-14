import { useState } from "react";
import { Package, MapPin, TrendingUp, Users } from "lucide-react";
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
import { VendorForm } from "@/components/forms/VendorForm";
import { toast } from "sonner";

const mockVendors = [
  {
    id: "V001",
    name: "Fresh Mart",
    email: "freshmart@example.com",
    phone: "+91 9876543210",
    address: "123 MG Road, Koramangala, Bangalore",
    gst: "29ABCDE1234F1Z5",
    category: "Grocery",
    area: "Koramangala",
    status: "active",
    productsAssigned: 156,
    totalProducts: 156,
    ordersCompleted: 2341,
    acceptanceRate: 94,
    rating: 4.5,
  },
  {
    id: "V002",
    name: "Green Grocers",
    email: "greengrocers@example.com",
    phone: "+91 9876543211",
    address: "456 100 Feet Road, Indiranagar, Bangalore",
    gst: "29FGHIJ5678K1Z9",
    category: "Organic",
    area: "Indiranagar",
    status: "active",
    productsAssigned: 203,
    totalProducts: 203,
    ordersCompleted: 1876,
    acceptanceRate: 89,
    rating: 4.7,
  },
  {
    id: "V003",
    name: "Daily Fresh",
    email: "dailyfresh@example.com",
    phone: "+91 9876543212",
    address: "789 ITPL Main Road, Whitefield, Bangalore",
    gst: "29KLMNO9012P1Z3",
    category: "Fresh Produce",
    area: "Whitefield",
    status: "inactive",
    productsAssigned: 98,
    totalProducts: 98,
    ordersCompleted: 567,
    acceptanceRate: 76,
    rating: 4.2,
  },
];

export default function Vendors() {
  const [vendors, setVendors] = useState(mockVendors);
  const [formOpen, setFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<typeof mockVendors[0] | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || vendor.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSaveVendor = (vendor: any) => {
    if (editingVendor) {
      setVendors(vendors.map(v => v.id === vendor.id ? vendor : v));
      toast.success("Vendor updated successfully");
    } else {
      setVendors([...vendors, vendor]);
      toast.success("Vendor added successfully");
    }
    setEditingVendor(undefined);
  };

  const handleEditClick = (vendor: typeof mockVendors[0]) => {
    setEditingVendor(vendor);
    setFormOpen(true);
  };

  const handleAddClick = () => {
    setEditingVendor(undefined);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vendor Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage vendors and their service areas
          </p>
        </div>
        <Button onClick={handleAddClick}>Add Vendor</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Total Vendors"
          value="24"
          icon={Package}
          trend={{ value: 12, label: "vs last month" }}
        />
        <MetricCard
          title="Active Vendors"
          value="21"
          icon={Users}
        />
        <MetricCard
          title="Avg Products"
          value="152"
          icon={Package}
        />
        <MetricCard
          title="Avg Acceptance"
          value="91%"
          icon={TrendingUp}
          trend={{ value: 3, label: "vs last month" }}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Vendors</CardTitle>
            <div className="flex gap-2">
              <Input 
                placeholder="Search vendors..." 
                className="w-64" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                variant="outline"
                onClick={() => setFilterStatus(filterStatus === "all" ? "active" : "all")}
              >
                {filterStatus === "all" ? "Show Active Only" : "Show All"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Service Area</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Acceptance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.id}</TableCell>
                  <TableCell>{vendor.name}</TableCell>
                  <TableCell>{vendor.phone}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {vendor.area}
                    </div>
                  </TableCell>
                  <TableCell>{vendor.productsAssigned}</TableCell>
                  <TableCell>{vendor.ordersCompleted}</TableCell>
                  <TableCell>{vendor.acceptanceRate}%</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        vendor.status === "active" ? "default" : "secondary"
                      }
                    >
                      {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditClick(vendor)}>
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditClick(vendor)}>
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <VendorForm
        open={formOpen}
        onOpenChange={setFormOpen}
        vendor={editingVendor}
        onSave={handleSaveVendor}
      />
    </div>
  );
}
