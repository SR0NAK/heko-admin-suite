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

interface TaskPayout {
  id: string;
  type: "delivery" | "pickup";
  orderId: string;
  date: string;
  amount: number;
  bonus?: number;
  status: "settled" | "pending";
}

const mockTodayPayouts: TaskPayout[] = [
  {
    id: "T001",
    type: "delivery",
    orderId: "ORD123",
    date: "2024-01-15 10:30",
    amount: 50,
    bonus: 10,
    status: "settled",
  },
  {
    id: "T002",
    type: "pickup",
    orderId: "RET045",
    date: "2024-01-15 11:45",
    amount: 30,
    status: "settled",
  },
  {
    id: "T003",
    type: "delivery",
    orderId: "ORD124",
    date: "2024-01-15 14:20",
    amount: 45,
    bonus: 5,
    status: "pending",
  },
];

const mockWeekPayouts: TaskPayout[] = [
  ...mockTodayPayouts,
  {
    id: "T004",
    type: "delivery",
    orderId: "ORD120",
    date: "2024-01-14 09:15",
    amount: 50,
    status: "settled",
  },
  {
    id: "T005",
    type: "pickup",
    orderId: "RET044",
    date: "2024-01-14 16:30",
    amount: 30,
    bonus: 15,
    status: "settled",
  },
  {
    id: "T006",
    type: "delivery",
    orderId: "ORD119",
    date: "2024-01-13 11:00",
    amount: 45,
    status: "settled",
  },
];

export default function DeliveryEarnings() {
  const [activeTab, setActiveTab] = useState("today");

  const todayTotal = mockTodayPayouts.reduce((sum, task) => sum + task.amount + (task.bonus || 0), 0);
  const todayBonus = mockTodayPayouts.reduce((sum, task) => sum + (task.bonus || 0), 0);
  const weekTotal = mockWeekPayouts.reduce((sum, task) => sum + task.amount + (task.bonus || 0), 0);
  const weekBonus = mockWeekPayouts.reduce((sum, task) => sum + (task.bonus || 0), 0);

  const todayTrips = mockTodayPayouts.length;
  const weekTrips = mockWeekPayouts.length;
  const onTimeRate = 95;
  const successRate = 98;

  const pendingSettlement = mockTodayPayouts
    .filter((t) => t.status === "pending")
    .reduce((sum, task) => sum + task.amount + (task.bonus || 0), 0);

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Earnings</h1>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{todayTotal}</div>
              <p className="text-xs text-muted-foreground">
                +₹{todayBonus} in bonuses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Week's Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{weekTotal}</div>
              <p className="text-xs text-muted-foreground">
                +₹{weekBonus} in bonuses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Settlement</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{pendingSettlement}</div>
              <p className="text-xs text-muted-foreground">
                Settles in 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weekTrips}</div>
              <p className="text-xs text-muted-foreground">
                {todayTrips} today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{onTimeRate}%</div>
              <p className="text-xs text-muted-foreground">
                Excellent performance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successRate}%</div>
              <p className="text-xs text-muted-foreground">
                Keep up the great work!
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
                        <TableHead>Type</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Base Amount</TableHead>
                        <TableHead>Bonus</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTodayPayouts.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="capitalize">{task.type}</TableCell>
                          <TableCell className="font-medium">{task.orderId}</TableCell>
                          <TableCell>{task.date}</TableCell>
                          <TableCell>₹{task.amount}</TableCell>
                          <TableCell>
                            {task.bonus ? (
                              <div className="flex items-center gap-1">
                                <Award className="h-3 w-3 text-amber-500" />
                                ₹{task.bonus}
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={task.status === "settled" ? "default" : "secondary"}>
                              {task.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ₹{task.amount + (task.bonus || 0)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="week" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Base Amount</TableHead>
                        <TableHead>Bonus</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockWeekPayouts.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="capitalize">{task.type}</TableCell>
                          <TableCell className="font-medium">{task.orderId}</TableCell>
                          <TableCell>{task.date}</TableCell>
                          <TableCell>₹{task.amount}</TableCell>
                          <TableCell>
                            {task.bonus ? (
                              <div className="flex items-center gap-1">
                                <Award className="h-3 w-3 text-amber-500" />
                                ₹{task.bonus}
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={task.status === "settled" ? "default" : "secondary"}>
                              {task.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ₹{task.amount + (task.bonus || 0)}
                          </TableCell>
                        </TableRow>
                      ))}
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
