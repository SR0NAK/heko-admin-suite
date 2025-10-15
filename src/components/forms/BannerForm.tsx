import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  action_type: string;
  action_value: string;
  active: boolean;
  display_order: number;
}

interface BannerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner?: Banner;
  onSave: (banner: Banner) => void;
}

export function BannerForm({ open, onOpenChange, banner, onSave }: BannerFormProps) {
  const [formData, setFormData] = useState<Banner>({
    id: '',
    title: '',
    subtitle: '',
    image: '/placeholder.svg',
    action_type: '',
    action_value: '',
    active: true,
    display_order: 0,
  });
  const [imagePreview, setImagePreview] = useState<string>('/placeholder.svg');

  useEffect(() => {
    if (banner) {
      setFormData(banner);
      setImagePreview(banner.image);
    } else {
      setFormData({
        id: '',
        title: '',
        subtitle: '',
        image: '/placeholder.svg',
        action_type: '',
        action_value: '',
        active: true,
        display_order: 0,
      });
      setImagePreview('/placeholder.svg');
    }
  }, [banner, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bannerToSave = {
      ...formData,
      id: formData.id || `B${Date.now()}`,
    };
    onSave(bannerToSave);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{banner ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Banner Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-2 rounded-lg overflow-hidden border">
                <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="action_type">Action Type</Label>
            <Input
              id="action_type"
              placeholder="e.g., category, product"
              value={formData.action_type}
              onChange={(e) => setFormData({ ...formData, action_type: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="action_value">Action Value</Label>
            <Input
              id="action_value"
              placeholder="e.g., fruits, product-id"
              value={formData.action_value}
              onChange={(e) => setFormData({ ...formData, action_value: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active">Active</Label>
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Banner</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}