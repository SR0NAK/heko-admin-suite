import { useState } from "react";
import { Image, Grid3x3, Plus, Edit, Trash2, Search, Filter } from "lucide-react";
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
import { SubcategoryForm } from "@/components/forms/SubcategoryForm";
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

const mockSubcategories = [
  { id: "1", name: "Fresh Fruits", categoryId: "1", categoryName: "Fruits & Vegetables", productsCount: 45, order: 1 },
  { id: "2", name: "Fresh Vegetables", categoryId: "1", categoryName: "Fruits & Vegetables", productsCount: 38, order: 2 },
  { id: "3", name: "Herbs", categoryId: "1", categoryName: "Fruits & Vegetables", productsCount: 12, order: 3 },
  { id: "4", name: "Milk", categoryId: "2", categoryName: "Dairy & Eggs", productsCount: 15, order: 1 },
  { id: "5", name: "Cheese", categoryId: "2", categoryName: "Dairy & Eggs", productsCount: 22, order: 2 },
  { id: "6", name: "Eggs", categoryId: "2", categoryName: "Dairy & Eggs", productsCount: 8, order: 3 },
  { id: "7", name: "Yogurt", categoryId: "2", categoryName: "Dairy & Eggs", productsCount: 18, order: 4 },
  { id: "8", name: "Soft Drinks", categoryId: "3", categoryName: "Beverages", productsCount: 25, order: 1 },
  { id: "9", name: "Juices", categoryId: "3", categoryName: "Beverages", productsCount: 20, order: 2 },
  { id: "10", name: "Tea & Coffee", categoryId: "3", categoryName: "Beverages", productsCount: 30, order: 3 },
];

export default function CMS() {
  const [banners, setBanners] = useState(mockBanners);
  const [categories, setCategories] = useState(mockCategories);
  const [subcategories, setSubcategories] = useState(mockSubcategories);
  const [bannerFormOpen, setBannerFormOpen] = useState(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [subcategoryFormOpen, setSubcategoryFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<typeof mockBanners[0] | undefined>();
  const [editingCategory, setEditingCategory] = useState<typeof mockCategories[0] | undefined>();
  const [editingSubcategory, setEditingSubcategory] = useState<typeof mockSubcategories[0] | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

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

  const handleAddSubcategory = () => {
    setEditingSubcategory(undefined);
    setSubcategoryFormOpen(true);
  };

  const handleEditSubcategory = (subcategory: typeof mockSubcategories[0]) => {
    setEditingSubcategory(subcategory);
    setSubcategoryFormOpen(true);
  };

  const handleDeleteSubcategory = (id: string) => {
    setSubcategories(subcategories.filter(s => s.id !== id));
    toast.success("Subcategory deleted successfully");
  };

  const handleSaveSubcategory = (subcategory: any) => {
    if (editingSubcategory) {
      setSubcategories(subcategories.map(s => s.id === subcategory.id ? subcategory : s));
      toast.success("Subcategory updated successfully");
    } else {
      setSubcategories([...subcategories, subcategory]);
      toast.success("Subcategory added successfully");
    }
    setEditingSubcategory(undefined);
  };

  const filteredSubcategories = subcategories.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCategory === "all" || sub.categoryId === filterCategory;
    return matchesSearch && matchesFilter;
  });

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

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Subcategories</CardTitle>
            <Button onClick={handleAddSubcategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subcategory
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subcategories..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Subcategory Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubcategories.map((subcategory) => (
                <TableRow key={subcategory.id}>
                  <TableCell className="font-medium">{subcategory.order}</TableCell>
                  <TableCell>{subcategory.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{subcategory.categoryName}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {subcategory.productsCount} products
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditSubcategory(subcategory)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteSubcategory(subcategory.id)}>
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

      <SubcategoryForm
        open={subcategoryFormOpen}
        onOpenChange={setSubcategoryFormOpen}
        subcategory={editingSubcategory}
        onSave={handleSaveSubcategory}
        categories={categories}
      />
    </div>
  );
}
