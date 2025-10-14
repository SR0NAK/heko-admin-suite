import { useState } from "react";
import { Truck, Star, TrendingUp, Clock } from "lucide-react";
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
import { toast } from "sonner";

const mockPartners = [
  {
    id: "DP001",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91 9876543210",
    vehicleType: "Bike",
    vehicleNumber: "KA01AB1234",
    vehicle: "Bike",
    status: "active",
    activeDeliveries: 3,
    activeOrders: 3,
    completedToday: 12,
    completedDeliveries: 245,
    rating: 4.8,
    avgTime: "18 min",
  },
  {
    id: "DP002",
    name: "Suresh Babu",
    email: "suresh@example.com",
    phone: "+91 9876543211",
    vehicleType: "Bike",
    vehicleNumber: "KA01CD5678",
    vehicle: "Bike",
    status: "active",
    activeDeliveries: 2,
    activeOrders: 2,
    completedToday: 15,
    completedDeliveries: 312,
    rating: 4.9,
    avgTime: "16 min",
  },
  {
    id: "DP003",
    name: "Amit Sharma",
    email: "amit@example.com",
    phone: "+91 9876543212",
    vehicleType: "Scooter",
    vehicleNumber: "KA02EF9012",
    vehicle: "Scooter",
    status: "offline",
    activeDeliveries: 0,
    activeOrders: 0,
    completedToday: 0,
    completedDeliveries: 189,
    rating: 4.6,
    avgTime: "20 min",
  },
];

export default function DeliveryPartners() {
  const [partners, setPartners] = useState(mockPartners);
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<typeof mockPartners[0] | undefined>();
  const [selectedPartner, setSelectedPartner] = useState<typeof mockPartners[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || partner.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSavePartner = (partner: any) => {
    if (editingPartner) {
      setPartners(partners.map(p => p.id === partner.id ? partner : p));
      toast.success("Delivery partner updated successfully");
    } else {
      setPartners([...partners, partner]);
      toast.success("Delivery partner added successfully");
    }
    setEditingPartner(undefined);
  };

  const handleViewClick = (partner: typeof mockPartners[0]) => {
    setSelectedPartner(partner);
    setDetailOpen(true);
  };

  const handleEditClick = (partner: typeof mockPartners[0]) => {
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
          value="45"
          icon={Truck}
          trend={{ value: 8, label: "vs last month" }}
        />
        <MetricCard
          title="Active Now"
          value="32"
          icon={Truck}
        />
        <MetricCard
          title="Avg Rating"
          value="4.7"
          icon={Star}
        />
        <MetricCard
          title="Avg Time"
          value="18 min"
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
                  <TableCell className="font-medium">{partner.id}</TableCell>
                  <TableCell>{partner.name}</TableCell>
                  <TableCell>{partner.phone}</TableCell>
                  <TableCell>{partner.vehicle}</TableCell>
                  <TableCell>{partner.activeDeliveries}</TableCell>
                  <TableCell>{partner.completedToday}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {partner.rating}
                    </div>
                  </TableCell>
                  <TableCell>{partner.avgTime}</TableCell>
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
