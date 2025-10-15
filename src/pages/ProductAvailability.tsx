import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddProductToInventoryDialog } from "@/components/forms/AddProductToInventoryDialog";
import { useVendorProducts } from "@/hooks/useVendorProducts";
import { useVendorProfile } from "@/hooks/useVendorProfile";

export default function ProductAvailability() {
  const [searchTerm, setSearchTerm] = useState("");
  const { vendor } = useVendorProfile();
  const { 
    vendorProducts, 
    availableProducts,
    isLoading, 
    updateVendorProduct,
    addProductToInventory 
  } = useVendorProducts();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const filteredProducts = vendorProducts.filter((vp: any) => {
    const productName = vp.products?.name || '';
    const categoryName = vp.products?.categories?.name || '';
    return (
      productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleToggleAvailability = (vendorProductId: string, currentValue: boolean) => {
    updateVendorProduct({ id: vendorProductId, is_available: !currentValue });
  };

  const handleUpdateStock = (vendorProductId: string, newStock: number) => {
    updateVendorProduct({ id: vendorProductId, stock_quantity: newStock });
  };

  const handleAddProduct = () => {
    setAddDialogOpen(true);
  };

  const handleAddToInventory = (productId: string, stockQuantity: number) => {
    addProductToInventory({ productId, stockQuantity });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Vendor Profile Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You need a vendor profile to manage products. Please contact an administrator to set up your vendor account.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Product Availability</h1>
          <p className="text-muted-foreground">
            Manage your products, pricing, and stock levels
          </p>
        </div>
        <Button onClick={handleAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Your Stock</TableHead>
                <TableHead>Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((vp: any) => {
                const product = vp.products;
                return (
                  <TableRow key={vp.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product?.images?.[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <span className="font-medium">{product?.name || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product?.categories?.name || '-'}</TableCell>
                    <TableCell className="font-semibold">₹{product?.price || 0}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={vp.stock_quantity}
                        onChange={(e) => handleUpdateStock(vp.id, Number(e.target.value))}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={vp.is_available}
                        onCheckedChange={() => handleToggleAvailability(vp.id, vp.is_available)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No products in your inventory. Click "Add Product" to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddProductToInventoryDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        availableProducts={availableProducts}
        onAdd={handleAddToInventory}
      />
    </div>
  );
}
