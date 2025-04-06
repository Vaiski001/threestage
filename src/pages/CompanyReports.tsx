import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Bell, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Download, 
  Calendar, 
  Filter, 
  Share2,
  RefreshCw
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CompanyReports() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Placeholder chart components (in a real app, would use Charts.js, Recharts, etc.)
  const LineChartPlaceholder = () => (
    <div className="aspect-[3/2] rounded-lg border border-dashed flex items-center justify-center bg-muted/50 relative overflow-hidden">
      <LineChart className="h-16 w-16 text-muted-foreground" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/30"></div>
    </div>
  );
  
  const BarChartPlaceholder = () => (
    <div className="aspect-[3/2] rounded-lg border border-dashed flex items-center justify-center bg-muted/50 relative overflow-hidden">
      <BarChart3 className="h-16 w-16 text-muted-foreground" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/30"></div>
    </div>
  );
  
  const PieChartPlaceholder = () => (
    <div className="aspect-[3/2] rounded-lg border border-dashed flex items-center justify-center bg-muted/50 relative overflow-hidden">
      <PieChart className="h-16 w-16 text-muted-foreground" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/30"></div>
    </div>
  );

  const handleExportReport = () => {
    toast({
      title: "Report export started",
      description: "Your report is being generated and will download shortly.",
    });
  };

  const handleRefreshData = () => {
    toast({
      title: "Data refreshed",
      description: "Report data has been updated to the latest available.",
    });
  };

  const handleShareReport = () => {
    toast({
      title: "Feature coming soon",
      description: "Report sharing will be available soon.",
    });
  };
  
  // Sample stats for overview
  const overviewStats = [
    { title: "Total Enquiries", value: "124", change: "+12%", changeType: "positive" },
    { title: "Conversion Rate", value: "18.2%", change: "+2.4%", changeType: "positive" },
    { title: "Avg. Response Time", value: "3.2h", change: "-8%", changeType: "positive" },
    { title: "Customer Satisfaction", value: "4.7/5", change: "+0.2", changeType: "positive" },
  ];

  // Sample reports list
  const savedReports = [
    { id: "rep-001", name: "Monthly Performance", type: "Performance", date: "Nov 15, 2023" },
    { id: "rep-002", name: "Customer Acquisition", type: "Customers", date: "Nov 10, 2023" },
    { id: "rep-003", name: "Revenue Analysis", type: "Financial", date: "Nov 5, 2023" },
    { id: "rep-004", name: "Enquiry Sources", type: "Marketing", date: "Oct 28, 2023" },
    { id: "rep-005", name: "Response Times", type: "Operations", date: "Oct 20, 2023" },
  ];

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto">
        <main className="flex-1 overflow-y-auto">
          <div className="pt-8 pb-4 px-4 sm:px-6">
            <Container>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-semibold mb-1">Analytics & Reports</h1>
                  <p className="text-muted-foreground">Track performance and generate insights</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[180px]">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="12m">Last 12 months</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" onClick={handleRefreshData}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>

                  <Button onClick={handleExportReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="saved">Saved Reports</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {overviewStats.map((stat, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{stat.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-semibold mb-2">{stat.value}</div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            stat.changeType === "positive" 
                              ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-950/30" 
                              : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950/30"
                          }`}>
                            {stat.change}
                          </span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Enquiry Trends</CardTitle>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Filter className="h-4 w-4" />
                            </Button>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-4">
                                  <h4 className="font-medium leading-none">Share Report</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Share this report with team members or export it.
                                  </p>
                                  <div className="flex gap-2">
                                    <Button className="w-full" onClick={handleShareReport}>
                                      <Share2 className="h-4 w-4 mr-2" />
                                      Share
                                    </Button>
                                    <Button variant="outline" className="w-full" onClick={handleExportReport}>
                                      <Download className="h-4 w-4 mr-2" />
                                      Export
                                    </Button>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <CardDescription>
                          New enquiries over time
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <LineChartPlaceholder />
                      </CardContent>
                      <CardFooter className="text-sm text-muted-foreground">
                        Updated 3 hours ago
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Conversion Rates</CardTitle>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Filter className="h-4 w-4" />
                            </Button>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-4">
                                  <h4 className="font-medium leading-none">Share Report</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Share this report with team members or export it.
                                  </p>
                                  <div className="flex gap-2">
                                    <Button className="w-full" onClick={handleShareReport}>
                                      <Share2 className="h-4 w-4 mr-2" />
                                      Share
                                    </Button>
                                    <Button variant="outline" className="w-full" onClick={handleExportReport}>
                                      <Download className="h-4 w-4 mr-2" />
                                      Export
                                    </Button>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <CardDescription>
                          Enquiry to customer conversion
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <BarChartPlaceholder />
                      </CardContent>
                      <CardFooter className="text-sm text-muted-foreground">
                        Updated 3 hours ago
                      </CardFooter>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Enquiry Sources</CardTitle>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Filter className="h-4 w-4" />
                            </Button>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-4">
                                  <h4 className="font-medium leading-none">Share Report</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Share this report with team members or export it.
                                  </p>
                                  <div className="flex gap-2">
                                    <Button className="w-full" onClick={handleShareReport}>
                                      <Share2 className="h-4 w-4 mr-2" />
                                      Share
                                    </Button>
                                    <Button variant="outline" className="w-full" onClick={handleExportReport}>
                                      <Download className="h-4 w-4 mr-2" />
                                      Export
                                    </Button>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <CardDescription>
                          Where your enquiries come from
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <PieChartPlaceholder />
                      </CardContent>
                      <CardFooter className="text-sm text-muted-foreground">
                        Updated 3 hours ago
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Response Time</CardTitle>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Filter className="h-4 w-4" />
                            </Button>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-4">
                                  <h4 className="font-medium leading-none">Share Report</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Share this report with team members or export it.
                                  </p>
                                  <div className="flex gap-2">
                                    <Button className="w-full" onClick={handleShareReport}>
                                      <Share2 className="h-4 w-4 mr-2" />
                                      Share
                                    </Button>
                                    <Button variant="outline" className="w-full" onClick={handleExportReport}>
                                      <Download className="h-4 w-4 mr-2" />
                                      Export
                                    </Button>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <CardDescription>
                          Average time to respond to enquiries
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <LineChartPlaceholder />
                      </CardContent>
                      <CardFooter className="text-sm text-muted-foreground">
                        Updated 3 hours ago
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="saved" className="mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Saved Reports</CardTitle>
                        <Button variant="outline" onClick={() => toast({
                          title: "Feature coming soon",
                          description: "Creating custom reports will be available soon."
                        })}>
                          Create Custom Report
                        </Button>
                      </div>
                      <CardDescription>
                        Access your previously saved reports
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px] rounded-md border p-4">
                        <div className="space-y-4">
                          {savedReports.map((report) => (
                            <div 
                              key={report.id} 
                              className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer flex justify-between items-center"
                              onClick={() => toast({
                                title: "Opening report",
                                description: `Opening ${report.name}`
                              })}
                            >
                              <div>
                                <h3 className="font-medium">{report.name}</h3>
                                <div className="flex items-center mt-1 gap-2">
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                    {report.type}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {report.date}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={(e) => {
                                  e.stopPropagation();
                                  handleExportReport();
                                }}>
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={(e) => {
                                  e.stopPropagation();
                                  handleShareReport();
                                }}>
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </Container>
          </div>
        </main>
      </div>
    </AppLayout>
  );
} 