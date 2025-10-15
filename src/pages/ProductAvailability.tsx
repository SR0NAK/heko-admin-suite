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
import { ProductForm } from "@/components/forms/ProductForm";
import { useProducts } from "@/hooks/useProducts";

export default function ProductAvailability() {
  const [searchTerm, setSearchTerm] = useState("");
  const { products, isLoading, updateProduct } = useProducts();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.categories && product.categories.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleToggleAvailability = (productId: string, currentValue: boolean) => {
    updateProduct({ id: productId, in_stock: !currentValue });
  };

  const handleStatusChange = (productId: string, newStatus: "active" | "paused" | "stopped") => {
    updateProduct({ id: productId, status: newStatus as "active" | "out_of_stock" });
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleSaveProduct = (product: any) => {
    setFormOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      out_of_stock: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {status === 'out_of_stock' ? 'Out of Stock' : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

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
                <TableHead>Stock</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.categories?.name || '-'}</TableCell>
                  <TableCell className="font-semibold">₹{product.price}</TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stock_quantity === 0
                          ? "text-destructive font-medium"
                          : product.stock_quantity < 20
                          ? "text-yellow-600 font-medium"
                          : ""
                      }
                    >
                      {product.stock_quantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={product.in_stock}
                      onCheckedChange={() => handleToggleAvailability(product.id, product.in_stock)}
                    />
                  </TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        Edit
                      </Button>
                      {product.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(product.id, "paused")}
                        >
                          Pause
                        </Button>
                      )}
                      {product.status === "paused" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(product.id, "active")}
                          >
                            Resume
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleStatusChange(product.id, "stopped")}
                          >
                            Stop
                          </Button>
                        </>
                      )}
                      {product.status === "stopped" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(product.id, "active")}
                        >
                          Activate
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
