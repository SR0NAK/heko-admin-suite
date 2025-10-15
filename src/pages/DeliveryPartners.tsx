import { useState } from "react";
import { Truck, Star, Clock } from "lucide-react";
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
import { DeliveryPartnerForm } from "@/components/forms/DeliveryPartnerForm";
import { DeliveryPartnerDetailDialog } from "@/components/DeliveryPartnerDetailDialog";
import { useDeliveryPartners } from "@/hooks/useDeliveryPartners";
import { Skeleton } from "@/components/ui/skeleton";

export default function DeliveryPartners() {
  const { deliveryPartners, isLoading, createDeliveryPartner, updateDeliveryPartner } = useDeliveryPartners();
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any>();
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredPartners = deliveryPartners.filter((partner) => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (partner.vehicle_type && partner.vehicle_type.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === "all" || partner.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSavePartner = (partner: any) => {
    if (editingPartner) {
      updateDeliveryPartner({ id: partner.id, ...partner });
    } else {
      createDeliveryPartner(partner);
    }
    setEditingPartner(undefined);
  };

  const handleViewClick = (partner: any) => {
    setSelectedPartner(partner);
    setDetailOpen(true);
  };

  const handleEditClick = (partner: any) => {
    setEditingPartner(partner);
    setFormOpen(true);
  };

  const handleEditFromDetail = () => {
    if (selectedPartner) {
      setDetailOpen(false);
      setEditingPartner(selectedPartner);
      setFormOpen(true);
    }
  };

  const handleAddClick = () => {
    setEditingPartner(undefined);
    setFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Delivery Partners</h1>
          <p className="text-muted-foreground mt-1">
            Manage delivery partners and assignments
          </p>
        </div>
        <Button onClick={handleAddClick}>Add Partner</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Total Partners"
          value={deliveryPartners.length.toString()}
          icon={Truck}
        />
        <MetricCard
          title="Active Now"
          value={deliveryPartners.filter(p => p.status === "active").length.toString()}
          icon={Truck}
        />
        <MetricCard
          title="Avg Rating"
          value={(deliveryPartners.reduce((sum, p) => sum + (p.rating || 0), 0) / deliveryPartners.length || 0).toFixed(1)}
          icon={Star}
        />
        <MetricCard
          title="Active Deliveries"
          value={deliveryPartners.reduce((sum, p) => sum + (p.active_deliveries || 0), 0).toString()}
          icon={Clock}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Delivery Partners</CardTitle>
            <div className="flex gap-2">
              <Input 
                placeholder="Search partners..." 
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
                <TableHead>Partner ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Today</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Avg Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">{partner.id.slice(0, 8)}</TableCell>
                  <TableCell>{partner.name}</TableCell>
                  <TableCell>{partner.phone}</TableCell>
                  <TableCell>{partner.vehicle_type || "N/A"}</TableCell>
                  <TableCell>{partner.active_deliveries || 0}</TableCell>
                  <TableCell>{partner.completed_deliveries || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {partner.rating || 0}
                    </div>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        partner.status === "active" ? "default" : "secondary"
                      }
                    >
                      {partner.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewClick(partner)}>
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditClick(partner)}>
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

      <DeliveryPartnerDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        partner={selectedPartner}
        onEdit={handleEditFromDetail}
      />

      <DeliveryPartnerForm
        open={formOpen}
        onOpenChange={setFormOpen}
        partner={editingPartner}
        onSave={handleSavePartner}
      />
    </div>
  );
}
