import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface Vendor {
  id: string;
  user_id: string;
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  address: string;
  latitude?: number;
  longitude?: number;
  service_radius?: number;
  status: string;
  rating?: number;
  total_orders?: number;
  completed_orders?: number;
  acceptance_rate?: number;
}

interface VendorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor?: Vendor;
  onSave: (vendor: Vendor) => void;
}

export function VendorForm({ open, onOpenChange, vendor, onSave }: VendorFormProps) {
  const [formData, setFormData] = useState<Vendor>({
    id: '',
    user_id: '',
    business_name: '',
    owner_name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    rating: 0,
    service_radius: 5,
  });

  useEffect(() => {
    if (vendor) {
      setFormData(vendor);
    } else {
      setFormData({
        id: '',
        user_id: '',
        business_name: '',
        owner_name: '',
        email: '',
        phone: '',
        address: '',
        status: 'active',
        rating: 0,
        service_radius: 5,
      });
    }
  }, [vendor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove id for new vendors, let database generate UUID
    const { id, ...vendorData } = formData;
    const vendorToSave = vendor ? { ...vendorData, id } : vendorData;
    onSave(vendorToSave as Vendor);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{vendor ? 'Edit Vendor' : 'Add New Vendor'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name *</Label>
              <Input
                id="business_name"
                required
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner_name">Owner Name *</Label>
              <Input
                id="owner_name"
                required
                value={formData.owner_name}
                onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_radius">Service Radius (km)</Label>
            <Input
              id="service_radius"
              type="number"
              value={formData.service_radius}
              onChange={(e) => setFormData({ ...formData, service_radius: parseInt(e.target.value) })}
            />
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
            <Button type="submit">Save Vendor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}