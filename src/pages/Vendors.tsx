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
import { VendorDetailDialog } from "@/components/VendorDetailDialog";
import { useVendors } from "@/hooks/useVendors";

export default function Vendors() {
  const { vendors, isLoading, createVendor, updateVendor } = useVendors();
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<any>(undefined);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || vendor.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Calculate real metrics
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status === "active").length;
  const avgProducts = vendors.length > 0 
    ? Math.round(vendors.reduce((sum, v) => sum + (v.total_orders || 0), 0) / vendors.length)
    : 0;
  const avgAcceptance = vendors.length > 0
    ? Math.round(vendors.reduce((sum, v) => sum + (v.acceptance_rate || 0), 0) / vendors.length)
    : 0;

  const handleSaveVendor = (vendor: any) => {
    if (editingVendor) {
      updateVendor(vendor);
    } else {
      createVendor(vendor);
    }
    setEditingVendor(undefined);
    setFormOpen(false);
  };

  const handleViewClick = (vendor: any) => {
    setSelectedVendor(vendor);
    setDetailOpen(true);
  };

  const handleEditClick = (vendor: any) => {
    setEditingVendor(vendor);
    setFormOpen(true);
  };

  const handleEditFromDetail = () => {
    if (selectedVendor) {
      setDetailOpen(false);
      setEditingVendor(selectedVendor);
      setFormOpen(true);
    }
  };

  const handleAddClick = () => {
    setEditingVendor(undefined);
    setFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          value={totalVendors}
          icon={Package}
        />
        <MetricCard
          title="Active Vendors"
          value={activeVendors}
          icon={Users}
        />
        <MetricCard
          title="Avg Orders"
          value={avgProducts}
          icon={Package}
        />
        <MetricCard
          title="Avg Acceptance"
          value={`${avgAcceptance}%`}
          icon={TrendingUp}
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
                  <TableCell>{vendor.business_name}</TableCell>
                  <TableCell>{vendor.phone}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {vendor.address?.substring(0, 30)}...
                    </div>
                  </TableCell>
                  <TableCell>{vendor.total_orders || 0}</TableCell>
                  <TableCell>{vendor.completed_orders || 0}</TableCell>
                  <TableCell>{vendor.acceptance_rate || 0}%</TableCell>
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
                      <Button size="sm" variant="outline" onClick={() => handleViewClick(vendor)}>
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

      <VendorDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        vendor={selectedVendor}
        onEdit={handleEditFromDetail}
      />

      <VendorForm
        open={formOpen}
        onOpenChange={setFormOpen}
        vendor={editingVendor}
        onSave={handleSaveVendor}
      />
    </div>
  );
}
