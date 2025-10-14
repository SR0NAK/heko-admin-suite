import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Category {
  id: string;
  name: string;
  image: string;
  subcategories: string[];
  order: number;
}

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
  onSave: (category: Category) => void;
}

export function CategoryForm({ open, onOpenChange, category, onSave }: CategoryFormProps) {
  const [formData, setFormData] = useState<Category>(
    category || {
      id: '',
      name: '',
      image: '/placeholder.svg',
      subcategories: [],
      order: 0,
    }
  );
  const [subcategoryInput, setSubcategoryInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryToSave = {
      ...formData,
      id: formData.id || `C${Date.now()}`,
    };
    onSave(categoryToSave);
    onOpenChange(false);
  };

  const addSubcategory = () => {
    if (subcategoryInput.trim()) {
      setFormData({
        ...formData,
        subcategories: [...formData.subcategories, subcategoryInput.trim()],
      });
      setSubcategoryInput('');
    }
  };

  const removeSubcategory = (index: number) => {
    setFormData({
      ...formData,
      subcategories: formData.subcategories.filter((_, i) => i !== index),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

          <div className="space-y-2">
            <Label>Subcategories</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add subcategory"
                value={subcategoryInput}
                onChange={(e) => setSubcategoryInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubcategory())}
              />
              <Button type="button" onClick={addSubcategory}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.subcategories.map((sub, index) => (
                <div key={index} className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-md">
                  <span className="text-sm">{sub}</span>
                  <button
                    type="button"
                    onClick={() => removeSubcategory(index)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Category</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}