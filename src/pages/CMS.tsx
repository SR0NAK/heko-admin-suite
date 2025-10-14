import { useState } from "react";
import { Image, Grid3x3, Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/MetricCard";
import { BannerForm } from "@/components/forms/BannerForm";
import { CategoryForm } from "@/components/forms/CategoryForm";
import { toast } from "sonner";

const mockBanners = [
  {
    id: "1",
    title: "Summer Sale",
    subtitle: "Up to 50% off on fresh fruits",
    image: "/placeholder.svg",
    action: "/category/fruits",
    active: true,
    order: 1,
  },
  {
    id: "2",
    title: "New Arrivals",
    subtitle: "Exotic vegetables now available",
    image: "/placeholder.svg",
    action: "/category/vegetables",
    active: true,
    order: 2,
  },
  {
    id: "3",
    title: "Organic Special",
    subtitle: "100% organic products",
    image: "/placeholder.svg",
    action: "/category/organic",
    active: false,
    order: 3,
  },
];

const mockCategories = [
  {
    id: "1",
    name: "Fruits & Vegetables",
    image: "/placeholder.svg",
    subcategories: ["Fruits", "Vegetables", "Herbs"],
    order: 1,
  },
  {
    id: "2",
    name: "Dairy & Eggs",
    image: "/placeholder.svg",
    subcategories: ["Milk", "Cheese", "Eggs", "Yogurt"],
    order: 2,
  },
  {
    id: "3",
    name: "Beverages",
    image: "/placeholder.svg",
    subcategories: ["Soft Drinks", "Juices", "Tea & Coffee"],
    order: 3,
  },
];

export default function CMS() {
  const [banners, setBanners] = useState(mockBanners);
  const [categories, setCategories] = useState(mockCategories);
  const [bannerFormOpen, setBannerFormOpen] = useState(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<typeof mockBanners[0] | undefined>();
  const [editingCategory, setEditingCategory] = useState<typeof mockCategories[0] | undefined>();

  const handleAddBanner = () => {
    setEditingBanner(undefined);
    setBannerFormOpen(true);
  };

  const handleEditBanner = (banner: typeof mockBanners[0]) => {
    setEditingBanner(banner);
    setBannerFormOpen(true);
  };

  const handleDeleteBanner = (id: string) => {
    setBanners(banners.filter(b => b.id !== id));
    toast.success("Banner deleted successfully");
  };

  const handleSaveBanner = (banner: any) => {
    if (editingBanner) {
      setBanners(banners.map(b => b.id === banner.id ? banner : b));
      toast.success("Banner updated successfully");
    } else {
      setBanners([...banners, banner]);
      toast.success("Banner added successfully");
    }
    setEditingBanner(undefined);
  };

  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setCategoryFormOpen(true);
  };

  const handleEditCategory = (category: typeof mockCategories[0]) => {
    setEditingCategory(category);
    setCategoryFormOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    toast.success("Category deleted successfully");
  };

  const handleSaveCategory = (category: any) => {
    if (editingCategory) {
      setCategories(categories.map(c => c.id === category.id ? category : c));
      toast.success("Category updated successfully");
    } else {
      setCategories([...categories, category]);
      toast.success("Category added successfully");
    }
    setEditingCategory(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage app banners, categories, and promotional content
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Active Banners"
          value="2"
          icon={Image}
        />
        <MetricCard
          title="Categories"
          value="12"
          icon={Grid3x3}
        />
        <MetricCard
          title="Total Products"
          value="456"
          icon={Grid3x3}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Homepage Banners</CardTitle>
            <Button onClick={handleAddBanner}>
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Subtitle</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell className="font-medium">{banner.order}</TableCell>
                  <TableCell>
                    <div className="h-12 w-20 bg-muted rounded overflow-hidden">
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{banner.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {banner.subtitle}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {banner.action || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={banner.active ? "default" : "secondary"}>
                      {banner.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditBanner(banner)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteBanner(banner.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Categories</CardTitle>
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Category Name</TableHead>
                <TableHead>Subcategories</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.order}</TableCell>
                  <TableCell>
                    <div className="h-12 w-12 bg-muted rounded overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {category.subcategories.slice(0, 3).map((sub, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {sub}
                        </Badge>
                      ))}
                      {category.subcategories.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{category.subcategories.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditCategory(category)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteCategory(category.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BannerForm
        open={bannerFormOpen}
        onOpenChange={setBannerFormOpen}
        banner={editingBanner}
        onSave={handleSaveBanner}
      />

      <CategoryForm
        open={categoryFormOpen}
        onOpenChange={setCategoryFormOpen}
        category={editingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
}
