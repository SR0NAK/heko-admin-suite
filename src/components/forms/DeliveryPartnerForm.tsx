import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface DeliveryPartner {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  status: string;
  rating: number;
  completedDeliveries: number;
  activeOrders: number;
}

interface DeliveryPartnerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner?: DeliveryPartner;
  onSave: (partner: DeliveryPartner) => void;
}

export function DeliveryPartnerForm({ open, onOpenChange, partner, onSave }: DeliveryPartnerFormProps) {
  const [formData, setFormData] = useState<DeliveryPartner>({
    id: '',
    name: '',
    email: '',
    phone: '',
    vehicleType: '',
    vehicleNumber: '',
    status: 'active',
    rating: 0,
    completedDeliveries: 0,
    activeOrders: 0,
  });

  useEffect(() => {
    if (partner) {
      setFormData(partner);
    } else {
      setFormData({
        id: '',
        name: '',
        email: '',
        phone: '',
        vehicleType: '',
        vehicleNumber: '',
        status: 'active',
        rating: 0,
        completedDeliveries: 0,
        activeOrders: 0,
      });
    }
  }, [partner]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove id for new delivery partners, let database generate UUID
    const { id, ...partnerData } = formData;
    const partnerToSave = partner ? { ...partnerData, id } : partnerData;
    onSave(partnerToSave as DeliveryPartner);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{partner ? 'Edit Delivery Partner' : 'Add New Delivery Partner'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Partner Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type *</Label>
              <Select
                value={formData.vehicleType}
                onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bike">Bike</SelectItem>
                  <SelectItem value="Scooter">Scooter</SelectItem>
                  <SelectItem value="Car">Car</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
              <Input
                id="vehicleNumber"
                required
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label>Status</Label>
            <Switch
              checked={formData.status === 'active'}
              onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Partner</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}