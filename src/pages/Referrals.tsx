import { useState } from "react";
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
import { ReferralDetailDialog } from "@/components/ReferralDetailDialog";
import { useReferrals } from "@/hooks/useReferrals";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Referrals() {
  const { referrals, isLoading } = useReferrals();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedReferral, setSelectedReferral] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const filteredReferrals = referrals.filter((referral) => {
    const referrerName = referral.referrer?.name || "";
    const refereeName = referral.referee?.name || "";
    const matchesSearch = referrerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refereeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || (filterStatus === "converted" ? referral.converted : !referral.converted);
    return matchesSearch && matchesFilter;
  });

  const handleExportData = () => {
    toast.success("Exporting referral data...");
  };

  const handleViewDetails = (id: string) => {
    const referral = referrals.find(r => r.id === id);
    if (referral) {
      setSelectedReferral(referral);
      setDetailDialogOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
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
          <h1 className="text-3xl font-bold">Referral Management</h1>
          <p className="text-muted-foreground mt-1">
            Track referrals and reward conversions
          </p>
        </div>
        <Button variant="outline" onClick={handleExportData}>Export Data</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Total Referrals"
          value={referrals.length.toString()}
          icon={Users}
        />
        <MetricCard
          title="Conversions"
          value={referrals.filter(r => r.converted).length.toString()}
          icon={CheckCircle}
        />
        <MetricCard
          title="Rewards Paid"
          value={`₹${referrals.filter(r => r.converted).reduce((sum, r) => sum + (r.reward_amount || 0), 0).toFixed(0)}`}
          icon={Wallet}
        />
        <MetricCard
          title="Pending"
          value={referrals.filter(r => !r.converted).length.toString()}
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
              <Input 
                placeholder="Search referrals..." 
                className="w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                variant="outline"
                onClick={() => setFilterStatus(filterStatus === "all" ? "converted" : "all")}
              >
                {filterStatus === "all" ? "Show Converted" : "Show All"}
              </Button>
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
              {filteredReferrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell>{new Date(referral.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">
                    {referral.referrer?.name || "N/A"}
                  </TableCell>
                  <TableCell>{referral.referee?.name || "N/A"}</TableCell>
                  <TableCell>
                    {referral.order_value > 0
                      ? `₹${referral.order_value}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {referral.reward_amount > 0 && referral.converted
                      ? `₹${referral.reward_amount}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        referral.converted
                          ? "default"
                          : referral.failure_reason
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {referral.converted
                        ? "Converted"
                        : referral.failure_reason
                        ? "Failed"
                        : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => handleViewDetails(referral.id)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ReferralDetailDialog
        referral={selectedReferral}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </div>
  );
}
