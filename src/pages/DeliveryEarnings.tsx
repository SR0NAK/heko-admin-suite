import { useState } from "react";
import { DollarSign, TrendingUp, Award, Calendar, Package, Clock, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeliveryPartnerDeliveries } from "@/hooks/useDeliveryPartnerDeliveries";
import { Skeleton } from "@/components/ui/skeleton";

export default function DeliveryEarnings() {
  const [activeTab, setActiveTab] = useState("today");
  const { allDeliveries, isLoadingAll, partnerProfile } = useDeliveryPartnerDeliveries();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayDeliveries = allDeliveries.filter(d => {
    const deliveryDate = new Date(d.created_at);
    deliveryDate.setHours(0, 0, 0, 0);
    return deliveryDate.getTime() === today.getTime();
  });

  const completedToday = todayDeliveries.filter(d => d.status === "delivered");
  const completedAll = allDeliveries.filter(d => d.status === "delivered");

  if (isLoadingAll) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Earnings</h1>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Deliveries</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedToday.length}</div>
              <p className="text-xs text-muted-foreground">
                Completed today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAll.length}</div>
              <p className="text-xs text-muted-foreground">
                All time completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{partnerProfile?.rating || 0}</div>
              <p className="text-xs text-muted-foreground">
                Average rating
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{partnerProfile?.active_deliveries || 0}</div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allDeliveries.length > 0 ? Math.round((completedAll.length / allDeliveries.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Delivery success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todayDeliveries.length > 0 ? Math.round((completedToday.length / todayDeliveries.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Today's completion rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payout Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Payout Breakdown</CardTitle>
            <CardDescription>Detailed breakdown of your earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
              </TabsList>

              <TabsContent value="today" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todayDeliveries.length > 0 ? (
                        todayDeliveries.map((delivery) => (
                          <TableRow key={delivery.id}>
                            <TableCell className="font-medium">{delivery.orders?.order_number}</TableCell>
                            <TableCell>{delivery.vendors?.business_name}</TableCell>
                            <TableCell>{new Date(delivery.created_at).toLocaleTimeString()}</TableCell>
                            <TableCell>₹{delivery.orders?.total || 0}</TableCell>
                            <TableCell>
                              <Badge variant={delivery.status === "delivered" ? "default" : "secondary"}>
                                {delivery.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No deliveries today
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="week" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedAll.length > 0 ? (
                        completedAll.slice(0, 20).map((delivery) => (
                          <TableRow key={delivery.id}>
                            <TableCell className="font-medium">{delivery.orders?.order_number}</TableCell>
                            <TableCell>{delivery.vendors?.business_name}</TableCell>
                            <TableCell>{new Date(delivery.created_at).toLocaleString()}</TableCell>
                            <TableCell>₹{delivery.orders?.total || 0}</TableCell>
                            <TableCell>
                              <Badge variant="default">
                                {delivery.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No completed deliveries
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Incentives & Bonuses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Active Incentives & Bonuses
            </CardTitle>
            <CardDescription>Complete these tasks to earn extra bonuses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">5-Delivery Streak</p>
                <p className="text-sm text-muted-foreground">Complete 5 deliveries in a row</p>
              </div>
              <Badge variant="secondary">+₹100</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Weekend Warrior</p>
                <p className="text-sm text-muted-foreground">Complete 10+ deliveries this weekend</p>
              </div>
              <Badge variant="secondary">+₹200</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Perfect Week</p>
                <p className="text-sm text-muted-foreground">100% on-time delivery for the week</p>
              </div>
              <Badge variant="secondary">+₹500</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
