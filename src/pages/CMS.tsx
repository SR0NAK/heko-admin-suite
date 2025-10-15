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
import { useCMS } from "@/hooks/useCMS";
import { Skeleton } from "@/components/ui/skeleton";

export default function CMS() {
  const { banners, categories, subcategories, isLoading, createBanner, updateBanner, deleteBanner, createCategory, updateCategory, deleteCategory, createSubcategory, updateSubcategory, deleteSubcategory } = useCMS();
  const [bannerFormOpen, setBannerFormOpen] = useState(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [subcategoryFormOpen, setSubcategoryFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>();
  const [editingCategory, setEditingCategory] = useState<any>();
  const [editingSubcategory, setEditingSubcategory] = useState<any>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const handleAddBanner = () => {
    setEditingBanner(undefined);
    setBannerFormOpen(true);
  };

  const handleEditBanner = (banner: any) => {
    setEditingBanner(banner);
    setBannerFormOpen(true);
  };

  const handleDeleteBanner = (id: string) => {
    deleteBanner(id);
  };

  const handleSaveBanner = (banner: any) => {
    if (editingBanner) {
      updateBanner({ id: banner.id, ...banner });
    } else {
      createBanner(banner);
    }
    setEditingBanner(undefined);
  };

  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setCategoryFormOpen(true);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setCategoryFormOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
  };

  const handleSaveCategory = (category: any) => {
    if (editingCategory) {
      updateCategory({ id: category.id, ...category });
    } else {
      createCategory(category);
    }
    setEditingCategory(undefined);
  };

  const handleAddSubcategory = () => {
    setEditingSubcategory(undefined);
    setSubcategoryFormOpen(true);
  };

  const handleEditSubcategory = (subcategory: any) => {
    setEditingSubcategory(subcategory);
    setSubcategoryFormOpen(true);
  };

  const handleDeleteSubcategory = (id: string) => {
    deleteSubcategory(id);
  };

  const handleSaveSubcategory = (subcategory: any) => {
    if (editingSubcategory) {
      updateSubcategory({ id: subcategory.id, ...subcategory });
    } else {
      createSubcategory(subcategory);
    }
    setEditingSubcategory(undefined);
  };

  const filteredSubcategories = subcategories.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCategory === "all" || sub.category_id === filterCategory;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

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
          value={banners.filter(b => b.active).length.toString()}
          icon={Image}
        />
        <MetricCard
          title="Categories"
          value={categories.length.toString()}
          icon={Grid3x3}
        />
        <MetricCard
          title="Subcategories"
          value={subcategories.length.toString()}
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
                  <TableCell className="font-medium">{banner.display_order}</TableCell>
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
                    {banner.action_value || "-"}
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
                  <TableCell className="font-medium">{category.display_order}</TableCell>
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
                      {subcategories.filter(s => s.category_id === category.id).slice(0, 3).map((sub, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {sub.name}
                        </Badge>
                      ))}
                      {subcategories.filter(s => s.category_id === category.id).length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{subcategories.filter(s => s.category_id === category.id).length - 3}
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
                  <TableCell className="font-medium">{categories.findIndex(c => c.id === subcategory.category_id) + 1}</TableCell>
                  <TableCell>{subcategory.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{categories.find(c => c.id === subcategory.category_id)?.name || "N/A"}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    - products
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
