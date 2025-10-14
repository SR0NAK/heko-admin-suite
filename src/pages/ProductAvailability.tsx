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
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  isAvailable: boolean;
  status: "active" | "paused" | "stopped";
}

const mockProducts: Product[] = [
  {
    id: "PRD-001",
    name: "Organic Tomatoes",
    category: "Vegetables",
    price: 80,
    stockQuantity: 50,
    isAvailable: true,
    status: "active",
  },
  {
    id: "PRD-002",
    name: "Fresh Milk",
    category: "Dairy",
    price: 60,
    stockQuantity: 30,
    isAvailable: true,
    status: "active",
  },
  {
    id: "PRD-003",
    name: "Whole Wheat Bread",
    category: "Bakery",
    price: 45,
    stockQuantity: 0,
    isAvailable: false,
    status: "stopped",
  },
  {
    id: "PRD-004",
    name: "Organic Apples",
    category: "Fruits",
    price: 120,
    stockQuantity: 25,
    isAvailable: true,
    status: "paused",
  },
];

export default function ProductAvailability() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleAvailability = (productId: string) => {
    setProducts(
      products.map((p) =>
        p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p
      )
    );
    toast({
      title: "Availability Updated",
      description: "Product availability has been updated successfully",
    });
  };

  const handleStatusChange = (productId: string, newStatus: "active" | "paused" | "stopped") => {
    setProducts(
      products.map((p) => (p.id === productId ? { ...p, status: newStatus } : p))
    );
    toast({
      title: "Status Updated",
      description: `Product status changed to ${newStatus}`,
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleSaveProduct = (product: any) => {
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? product : p)));
      toast({
        title: "Product Updated",
        description: "Product has been updated successfully",
      });
    } else {
      setProducts([...products, { ...product, id: `PRD-${products.length + 1}` }]);
      toast({
        title: "Product Added",
        description: "New product has been added successfully",
      });
    }
    setFormOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800",
      stopped: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="font-semibold">₹{product.price}</TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stockQuantity === 0
                          ? "text-destructive font-medium"
                          : product.stockQuantity < 20
                          ? "text-yellow-600 font-medium"
                          : ""
                      }
                    >
                      {product.stockQuantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={product.isAvailable}
                      onCheckedChange={() => handleToggleAvailability(product.id)}
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
