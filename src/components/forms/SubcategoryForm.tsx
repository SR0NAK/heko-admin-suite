import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  productsCount: number;
  order: number;
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
    categoryId: '',
    categoryName: '',
    productsCount: 0,
    order: 0,
  });

  useEffect(() => {
    if (subcategory) {
      setFormData(subcategory);
    } else {
      setFormData({
        id: '',
        name: '',
        categoryId: '',
        categoryName: '',
        productsCount: 0,
        order: 0,
      });
    }
  }, [subcategory, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCategory = categories.find(c => c.id === formData.categoryId);
    const subcategoryToSave = {
      ...formData,
      id: formData.id || `SC${Date.now()}`,
      categoryName: selectedCategory?.name || formData.categoryName,
    };
    onSave(subcategoryToSave);
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
              value={formData.categoryId}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
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

          <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
            />
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
