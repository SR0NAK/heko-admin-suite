import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  unit: string;
  images?: string[];
  categories?: { name: string };
  subcategories?: { name: string };
}

interface AddProductToInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableProducts: Product[];
  onAdd: (productId: string, stockQuantity: number) => void;
}

export function AddProductToInventoryDialog({
  open,
  onOpenChange,
  availableProducts,
  onAdd,
}: AddProductToInventoryDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stockQuantity, setStockQuantity] = useState(0);

  const filteredProducts = availableProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (selectedProduct && stockQuantity > 0) {
      onAdd(selectedProduct.id, stockQuantity);
      setSelectedProduct(null);
      setStockQuantity(0);
      setSearchTerm("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add Product to Inventory</DialogTitle>
          <DialogDescription>
            Select a product from the catalog to add to your inventory
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-[300px] border rounded-md p-4">
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedProduct?.id === product.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="flex gap-3">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {product.categories?.name} • {product.unit}
                      </p>
                      <p className="text-sm font-semibold mt-1">
                        ₹{product.price} <span className="text-muted-foreground line-through">₹{product.mrp}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No products found
                </p>
              )}
            </div>
          </ScrollArea>

          {selectedProduct && (
            <div className="space-y-2 p-4 border rounded-lg bg-muted/50">
              <Label htmlFor="stock_quantity">Initial Stock Quantity *</Label>
              <Input
                id="stock_quantity"
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                placeholder="Enter stock quantity"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAdd}
            disabled={!selectedProduct || stockQuantity <= 0}
          >
            Add to Inventory
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
