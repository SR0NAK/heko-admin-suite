import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Subcategory {
  id: string;
  name: string;
  category_id: string;
  active: boolean;
}

interface SubcategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subcategory?: Subcategory;
  onSave: (subcategory: Subcategory) => void;
  categories: Array<{ id: string; name: string }>;
}

export function SubcategoryForm({ open, onOpenChange, subcategory, onSave, categories }: SubcategoryFormProps) {
  const [formData, setFormData] = useState<Subcategory>({
    id: '',
    name: '',
    category_id: '',
    active: true,
  });

  useEffect(() => {
    if (subcategory) {
      setFormData(subcategory);
    } else {
      setFormData({
        id: '',
        name: '',
        category_id: '',
        active: true,
      });
    }
  }, [subcategory, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove id for new subcategories, let database generate UUID
    const { id, ...subcategoryData } = formData;
    const subcategoryToSave = subcategory ? { ...subcategoryData, id } : subcategoryData;
    onSave(subcategoryToSave as Subcategory);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{subcategory ? 'Edit Subcategory' : 'Add New Subcategory'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subcategory Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Subcategory</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
