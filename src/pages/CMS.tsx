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

const mockBanners = [
  {
    id: "1",
    title: "Summer Sale",
    subtitle: "Up to 50% off on fresh fruits",
    image: "/placeholder.svg",
    position: 1,
    active: true,
    startDate: "2024-01-20",
    endDate: "2024-02-20",
  },
  {
    id: "2",
    title: "New Arrivals",
    subtitle: "Exotic vegetables now available",
    image: "/placeholder.svg",
    position: 2,
    active: true,
    startDate: "2024-01-15",
    endDate: "2024-03-15",
  },
  {
    id: "3",
    title: "Organic Special",
    subtitle: "100% organic products",
    image: "/placeholder.svg",
    position: 3,
    active: false,
    startDate: "2024-01-10",
    endDate: "2024-01-31",
  },
];

const mockCategories = [
  {
    id: "1",
    name: "Fruits & Vegetables",
    image: "/placeholder.svg",
    productsCount: 156,
    order: 1,
    active: true,
  },
  {
    id: "2",
    name: "Dairy & Eggs",
    image: "/placeholder.svg",
    productsCount: 89,
    order: 2,
    active: true,
  },
  {
    id: "3",
    name: "Beverages",
    image: "/placeholder.svg",
    productsCount: 124,
    order: 3,
    active: true,
  },
];

export default function CMS() {
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Subtitle</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBanners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell className="font-medium">{banner.position}</TableCell>
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
                  <TableCell>
                    <div className="text-sm">
                      {banner.startDate} to {banner.endDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={banner.active ? "default" : "secondary"}>
                      {banner.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
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
            <Button>
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
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCategories.map((category) => (
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
                  <TableCell>{category.productsCount}</TableCell>
                  <TableCell>
                    <Badge variant={category.active ? "default" : "secondary"}>
                      {category.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
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
    </div>
  );
}
