import { Users, TrendingUp, Wallet, CheckCircle } from "lucide-react";
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

const mockReferrals = [
  {
    id: "1",
    referrer: "Rajesh Kumar (RAJ123)",
    referee: "Priya Sharma",
    orderValue: 450,
    rewardEarned: 45,
    status: "converted",
    date: "2024-01-25",
  },
  {
    id: "2",
    referrer: "Amit Patel (AMI789)",
    referee: "Neha Singh",
    orderValue: 620,
    rewardEarned: 62,
    status: "converted",
    date: "2024-01-24",
  },
  {
    id: "3",
    referrer: "Suresh Kumar (SUR456)",
    referee: "Rahul Verma",
    orderValue: 0,
    rewardEarned: 0,
    status: "pending",
    date: "2024-01-23",
  },
  {
    id: "4",
    referrer: "Priya Sharma (PRI456)",
    referee: "Deepak Kumar",
    orderValue: 380,
    rewardEarned: 0,
    status: "insufficient_balance",
    date: "2024-01-22",
  },
];

export default function Referrals() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Referral Management</h1>
          <p className="text-muted-foreground mt-1">
            Track referrals and reward conversions
          </p>
        </div>
        <Button variant="outline">Export Data</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Total Referrals"
          value="1,234"
          icon={Users}
          trend={{ value: 18, label: "vs last month" }}
        />
        <MetricCard
          title="Conversions"
          value="856"
          icon={CheckCircle}
          trend={{ value: 12, label: "conversion rate" }}
        />
        <MetricCard
          title="Rewards Paid"
          value="₹42,380"
          icon={Wallet}
        />
        <MetricCard
          title="Pending"
          value="378"
          icon={TrendingUp}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Referral Program Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">
            <p className="font-medium">Current Configuration:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>100% of order value credited to buyer's virtual wallet</li>
              <li>10% referral reward on first successful delivery</li>
              <li>Conversion requires sufficient virtual wallet balance</li>
              <li>Single-level referral only</li>
              <li>No carry-forward if insufficient balance</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Referral Activity</CardTitle>
            <div className="flex gap-2">
              <Input placeholder="Search referrals..." className="w-64" />
              <Button variant="outline">Filter</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Referrer</TableHead>
                <TableHead>Referee</TableHead>
                <TableHead>Order Value</TableHead>
                <TableHead>Reward Earned</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReferrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell>{referral.date}</TableCell>
                  <TableCell className="font-medium">
                    {referral.referrer}
                  </TableCell>
                  <TableCell>{referral.referee}</TableCell>
                  <TableCell>
                    {referral.orderValue > 0
                      ? `₹${referral.orderValue}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {referral.rewardEarned > 0
                      ? `₹${referral.rewardEarned}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        referral.status === "converted"
                          ? "default"
                          : referral.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {referral.status === "converted"
                        ? "Converted"
                        : referral.status === "pending"
                        ? "Pending"
                        : "Insufficient Balance"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
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
