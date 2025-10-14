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
  action: string;
  active: boolean;
  order: number;
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
    action: '',
    active: true,
    order: 0,
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
        action: '',
        active: true,
        order: 0,
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
            <Label htmlFor="action">Action/Link</Label>
            <Input
              id="action"
              placeholder="e.g., /category/fruits"
              value={formData.action}
              onChange={(e) => setFormData({ ...formData, action: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
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