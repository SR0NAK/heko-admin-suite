import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Upload } from "lucide-react";
import { useCategories, useSubcategories } from "@/hooks/useCMS";

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  discount: number;
  unit: string;
  category_id: string;
  subcategory_id: string;
  in_stock: boolean;
  stock_quantity: number;
  tags: string[];
  images?: string[];
}

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  onSave: (product: Product) => void;
}

export function ProductForm({ open, onOpenChange, product, onSave }: ProductFormProps) {
  const { categories } = useCategories();
  const { subcategories } = useSubcategories();
  
  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    mrp: 0,
    discount: 0,
    unit: '',
    category_id: '',
    subcategory_id: '',
    in_stock: true,
    stock_quantity: 0,
    tags: [],
    images: [],
  });

  // Update form data when product prop changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        mrp: product.mrp || 0,
        discount: product.discount || 0,
        unit: product.unit || '',
        category_id: product.category_id || '',
        subcategory_id: product.subcategory_id || '',
        in_stock: product.in_stock ?? true,
        stock_quantity: product.stock_quantity || 0,
        tags: product.tags || [],
        images: product.images || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        mrp: 0,
        discount: 0,
        unit: '',
        category_id: '',
        subcategory_id: '',
        in_stock: true,
        stock_quantity: 0,
        tags: [],
        images: [],
      });
    }
  }, [product]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData({ ...formData, images: [...(formData.images || []), ...newImages] });
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productToSave = {
      ...formData,
      discount: Math.round(((formData.mrp - formData.price) / formData.mrp) * 100),
      status: 'active',
    };
    onSave(productToSave);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
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
                onValueChange={(value) => setFormData({ ...formData, category_id: value, subcategory_id: '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategory</Label>
            <Select
              value={formData.subcategory_id}
              onValueChange={(value) => setFormData({ ...formData, subcategory_id: value })}
              disabled={!formData.category_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subcategory" />
              </SelectTrigger>
              <SelectContent>
                {subcategories
                  .filter((sub) => sub.category_id === formData.category_id)
                  .map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit *</Label>
            <Input
              id="unit"
              required
              placeholder="e.g., 1 kg, 500g"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="mrp">MRP *</Label>
              <Input
                id="mrp"
                type="number"
                required
                value={formData.mrp}
                onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Selling Price *</Label>
              <Input
                id="price"
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Product Images</Label>
            <div className="space-y-3">
              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('images')?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
              </div>
            </div>
          </div>


          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Quantity *</Label>
              <Input
                id="stock_quantity"
                type="number"
                required
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center justify-between space-y-2 pt-8">
              <Label htmlFor="in_stock">In Stock</Label>
              <Switch
                id="in_stock"
                checked={formData.in_stock}
                onCheckedChange={(checked) => setFormData({ ...formData, in_stock: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}