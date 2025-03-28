
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AnalyticsTab() {
  const [timeRange, setTimeRange] = useState("7d");
  
  // Example data - in a real app, this would come from an API
  const formSubmissionData = [
    { name: "Form A", value: 42 },
    { name: "Form B", value: 28 },
    { name: "Form C", value: 15 },
    { name: "Form D", value: 7 }
  ];
  
  // Placeholder data for chart
  const conversionData = [
    { name: "Mon", value: 15 },
    { name: "Tue", value: 22 },
    { name: "Wed", value: 18 },
    { name: "Thu", value: 27 },
    { name: "Fri", value: 34 },
    { name: "Sat", value: 25 },
    { name: "Sun", value: 19 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Form Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">157</CardTitle>
            <CardDescription>Total Submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+12.3%</span> from last period
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">24.8%</CardTitle>
            <CardDescription>Conversion Rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-red-500 font-medium">-2.5%</span> from last period
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">4.2 min</CardTitle>
            <CardDescription>Avg. Completion Time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">-0.8 min</span> from last period
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <AnalyticsChart 
          title="Form Submissions" 
          description="Submissions by form"
          data={formSubmissionData}
          barColor="#8b5cf6"
        />
        
        <AnalyticsChart 
          title="Conversion Rate" 
          description="Daily conversion trend"
          data={conversionData}
          barColor="#10b981"
        />
      </div>
    </div>
  );
}
