import { useState } from "react";
import { BarChart3, Download, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MetricCard } from "@/components/MetricCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const reportTypes = [
  {
    id: "sales",
    title: "Sales Report",
    description: "Detailed sales breakdown by period",
    icon: TrendingUp,
  },
  {
    id: "users",
    title: "User Report",
    description: "User growth and activity metrics",
    icon: TrendingUp,
  },
  {
    id: "products",
    title: "Product Performance",
    description: "Top selling products and inventory",
    icon: TrendingUp,
  },
  {
    id: "financial",
    title: "Financial Report",
    description: "Revenue, refunds, and wallet transactions",
    icon: TrendingUp,
  },
  {
    id: "delivery",
    title: "Delivery Report",
    description: "Delivery partner performance metrics",
    icon: TrendingUp,
  },
  {
    id: "referral",
    title: "Referral Report",
    description: "Referral conversions and rewards",
    icon: TrendingUp,
  },
];

export default function Reports() {
  const [reportType, setReportType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDownload = (format: string) => {
    if (!reportType || !startDate || !endDate) {
      toast.error("Please select report type and date range");
      return;
    }
    toast.success(`Downloading ${reportType} report as ${format}...`);
  };

  const handleGenerateReport = (type: string) => {
    toast.info(`Generating ${type} report...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Generate and export detailed reports
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value="₹2,45,680"
          icon={TrendingUp}
          trend={{ value: 12, label: "vs last month" }}
        />
        <MetricCard
          title="Total Orders"
          value="1,234"
          icon={BarChart3}
          trend={{ value: 8, label: "vs last month" }}
        />
        <MetricCard
          title="Active Users"
          value="456"
          icon={TrendingUp}
        />
        <MetricCard
          title="Avg Order Value"
          value="₹450"
          icon={TrendingUp}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="users">User Report</SelectItem>
                  <SelectItem value="products">Product Performance</SelectItem>
                  <SelectItem value="financial">Financial Report</SelectItem>
                  <SelectItem value="delivery">Delivery Report</SelectItem>
                  <SelectItem value="referral">Referral Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={() => handleDownload("CSV")}>
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
            <Button variant="outline" onClick={() => handleDownload("Excel")}>
              <Download className="h-4 w-4 mr-2" />
              Download Excel
            </Button>
            <Button variant="outline" onClick={() => handleDownload("PDF")}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {reportTypes.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <report.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {report.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => handleGenerateReport(report.title)}>
                <Calendar className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
