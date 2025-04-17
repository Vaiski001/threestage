import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart,
  LineChart,
  PieChart,
  Download,
  Calendar,
  Users,
  Building,
  MessageSquare,
  BarChart3,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AnalyticsData {
  userGrowth: number[];
  inquiryVolume: number[];
  conversionRate: number[];
  responseTime: number[];
  platformUsage: { label: string; value: number }[];
  inquiryByCategory: { label: string; value: number }[];
  companyPerformance: { company: string; inquiries: number; responses: number; avgTime: number }[];
}

const AnalyticsReports = () => {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState("30d");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for analytics
    const mockData: AnalyticsData = {
      userGrowth: [120, 140, 180, 210, 250, 320, 350, 410, 450, 520, 550, 620],
      inquiryVolume: [45, 52, 68, 74, 83, 90, 110, 132, 145, 160, 178, 195],
      conversionRate: [12, 14, 13, 15, 18, 17.5, 19, 21, 20.5, 22, 24, 25],
      responseTime: [8, 7.5, 7, 6.8, 6.5, 6.2, 6, 5.8, 5.5, 5.2, 5, 4.8],
      platformUsage: [
        { label: "Web App", value: 62 },
        { label: "Mobile", value: 28 },
        { label: "API", value: 10 }
      ],
      inquiryByCategory: [
        { label: "Services", value: 40 },
        { label: "Products", value: 25 },
        { label: "Support", value: 20 },
        { label: "Pricing", value: 15 }
      ],
      companyPerformance: [
        { company: "TechSolutions Inc.", inquiries: 145, responses: 142, avgTime: 3.2 },
        { company: "Creative Agency", inquiries: 98, responses: 92, avgTime: 5.7 },
        { company: "Global Manufacturing", inquiries: 76, responses: 70, avgTime: 8.1 },
        { company: "Retail Partners", inquiries: 120, responses: 118, avgTime: 2.4 },
        { company: "Financial Services", inquiries: 65, responses: 60, avgTime: 6.3 }
      ]
    };

    setTimeout(() => {
      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  }, [timeframe]);

  const downloadReport = (reportType: string) => {
    toast({
      title: "Report download started",
      description: `Your ${reportType} report is being generated and will download shortly`
    });
  };

  // Placeholder for chart components - in a real implementation these would be actual chart components
  const renderLineChart = (data: number[], label: string, color: string = "blue") => (
    <div className="h-[300px] w-full bg-slate-50 border rounded-md p-4 flex items-center justify-center">
      <div className="flex items-center gap-2">
        <LineChart className="h-5 w-5 text-primary" />
        <span className="font-medium">Simulated {label} Chart</span>
      </div>
    </div>
  );

  const renderBarChart = (data: number[], label: string) => (
    <div className="h-[300px] w-full bg-slate-50 border rounded-md p-4 flex items-center justify-center">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <span className="font-medium">Simulated {label} Chart</span>
      </div>
    </div>
  );

  const renderPieChart = (data: { label: string; value: number }[], label: string) => (
    <div className="h-[300px] w-full bg-slate-50 border rounded-md p-4 flex items-center justify-center">
      <div className="flex items-center gap-2">
        <PieChart className="h-5 w-5 text-primary" />
        <span className="font-medium">Simulated {label} Chart</span>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Analyze platform performance and generate reports
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="timeframe">Timeframe:</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[120px]" id="timeframe">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" className="flex gap-2" onClick={() => downloadReport("full")}>
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="h-[400px] w-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Activity className="h-8 w-8 text-primary animate-pulse mb-2" />
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        </div>
      ) : analyticsData ? (
        <div className="space-y-6">
          {/* Overview Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {analyticsData.userGrowth[analyticsData.userGrowth.length - 1]}
                  </div>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-xs text-green-600 mt-1 flex items-center">
                  <span>↑ 12.5% from previous period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Inquiries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {analyticsData.inquiryVolume[analyticsData.inquiryVolume.length - 1]}
                  </div>
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-xs text-green-600 mt-1 flex items-center">
                  <span>↑ 9.6% from previous period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {analyticsData.conversionRate[analyticsData.conversionRate.length - 1]}%
                  </div>
                  <BarChart className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-xs text-green-600 mt-1 flex items-center">
                  <span>↑ 4.2% from previous period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg. Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {analyticsData.responseTime[analyticsData.responseTime.length - 1]} hr
                  </div>
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-xs text-green-600 mt-1 flex items-center">
                  <span>↓ 3.8% from previous period</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs for different reports */}
          <Tabs defaultValue="user-growth" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="user-growth" className="flex gap-1 items-center">
                <Users className="h-4 w-4" />
                User Growth
              </TabsTrigger>
              <TabsTrigger value="inquiry-analysis" className="flex gap-1 items-center">
                <MessageSquare className="h-4 w-4" />
                Inquiry Analysis
              </TabsTrigger>
              <TabsTrigger value="company-performance" className="flex gap-1 items-center">
                <Building className="h-4 w-4" />
                Company Performance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user-growth" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth Trend</CardTitle>
                  <CardDescription>Monthly user signups over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderLineChart(analyticsData.userGrowth, "User Growth", "blue")}
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Usage Distribution</CardTitle>
                    <CardDescription>User access by platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderPieChart(analyticsData.platformUsage, "Platform Usage")}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>User Retention</CardTitle>
                    <CardDescription>Monthly active users vs. new signups</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderBarChart(analyticsData.userGrowth, "User Retention")}
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="flex gap-2"
                  onClick={() => downloadReport("user-growth")}
                >
                  <Download className="h-4 w-4" />
                  Download User Report
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="inquiry-analysis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inquiry Volume Trend</CardTitle>
                  <CardDescription>Monthly inquiry submissions over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderLineChart(analyticsData.inquiryVolume, "Inquiry Volume", "green")}
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Inquiries by Category</CardTitle>
                    <CardDescription>Distribution of inquiries by type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderPieChart(analyticsData.inquiryByCategory, "Inquiry Categories")}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Response Time Trend</CardTitle>
                    <CardDescription>Average response time in hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderLineChart(analyticsData.responseTime, "Response Time", "orange")}
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="flex gap-2"
                  onClick={() => downloadReport("inquiry-analysis")}
                >
                  <Download className="h-4 w-4" />
                  Download Inquiry Report
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="company-performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Performance Overview</CardTitle>
                  <CardDescription>Inquiry handling metrics by company</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Company
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Inquiries Received
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Responses Sent
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Avg. Response Time (hrs)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Response Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analyticsData.companyPerformance.map((company, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {company.company}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {company.inquiries}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {company.responses}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {company.avgTime}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {Math.round((company.responses / company.inquiries) * 100)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Response Time Comparison</CardTitle>
                    <CardDescription>Average response time by company</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderBarChart(analyticsData.companyPerformance.map(c => c.avgTime), "Response Time")}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Inquiry Volume Comparison</CardTitle>
                    <CardDescription>Number of inquiries received by company</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderBarChart(analyticsData.companyPerformance.map(c => c.inquiries), "Inquiry Volume")}
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="flex gap-2"
                  onClick={() => downloadReport("company-performance")}
                >
                  <Download className="h-4 w-4" />
                  Download Company Report
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="text-center py-12">
          <p>No analytics data available</p>
        </div>
      )}
    </AdminLayout>
  );
};

export default AnalyticsReports; 