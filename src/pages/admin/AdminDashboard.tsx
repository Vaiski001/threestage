import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  UsersIcon, 
  Building2Icon, 
  MessagesSquareIcon, 
  FileTextIcon, 
  BarChart4Icon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClipboardIcon
} from "lucide-react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface DashboardStat {
  name: string;
  value: number;
  change: number;
  icon: React.ReactNode;
}

interface RecentActivity {
  id: string;
  type: 'company_signup' | 'customer_signup' | 'inquiry_created' | 'form_submitted';
  title: string;
  description: string;
  timestamp: string;
}

const AdminDashboard = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for the dashboard
  useEffect(() => {
    // In production, this would fetch actual data from Supabase
    setStats([
      {
        name: "Total Companies",
        value: 124,
        change: 12,
        icon: <Building2Icon className="h-5 w-5 text-blue-500" />
      },
      {
        name: "Total Customers",
        value: 2456,
        change: 18,
        icon: <UsersIcon className="h-5 w-5 text-green-500" />
      },
      {
        name: "Active Inquiries",
        value: 347,
        change: -5,
        icon: <MessagesSquareIcon className="h-5 w-5 text-amber-500" />
      },
      {
        name: "Forms Submitted",
        value: 892,
        change: 24,
        icon: <FileTextIcon className="h-5 w-5 text-purple-500" />
      }
    ]);

    setRecentActivity([
      {
        id: "1",
        type: "company_signup",
        title: "New Company Registration",
        description: "TechSolutions Inc. signed up as a service provider",
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
      },
      {
        id: "2",
        type: "inquiry_created",
        title: "New Inquiry",
        description: "An inquiry was submitted to DesignMasters Ltd.",
        timestamp: new Date(Date.now() - 58 * 60 * 1000).toISOString()
      },
      {
        id: "3",
        type: "form_submitted",
        title: "Form Submission",
        description: "A customer submitted the 'Website Design Request' form",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "4",
        type: "customer_signup",
        title: "New Customer",
        description: "John Doe created a new customer account",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "5",
        type: "inquiry_created",
        title: "New Inquiry",
        description: "An inquiry was submitted to CreativeHub Agency",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      }
    ]);

    setLoading(false);
  }, []);

  // Format relative time
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor platform activity and perform administrative tasks
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <div className="flex items-center pt-1 text-xs">
                {stat.change > 0 ? (
                  <ArrowUpIcon className="w-3 h-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-3 h-3 text-red-500 mr-1" />
                )}
                <span className={stat.change > 0 ? "text-green-500" : "text-red-500"}>
                  {Math.abs(stat.change)}%
                </span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-7">
        {/* Activity Feed */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest platform events and actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-muted">
                    {activity.type === 'company_signup' && <Building2Icon className="h-4 w-4" />}
                    {activity.type === 'customer_signup' && <UsersIcon className="h-4 w-4" />}
                    {activity.type === 'inquiry_created' && <MessagesSquareIcon className="h-4 w-4" />}
                    {activity.type === 'form_submitted' && <ClipboardIcon className="h-4 w-4" />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Health */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
            <CardDescription>
              System status and current performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="storage">Storage</TabsTrigger>
                <TabsTrigger value="database">Database</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">API Status</p>
                      <p className="text-xs text-muted-foreground">All systems operational</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Healthy</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Authentication Service</p>
                      <p className="text-xs text-muted-foreground">User login and registration</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Healthy</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Messaging Service</p>
                      <p className="text-xs text-muted-foreground">Email and in-app messaging</p>
                    </div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Degraded</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Content Delivery</p>
                      <p className="text-xs text-muted-foreground">File storage and delivery</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Healthy</Badge>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="storage">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Total Storage Used</p>
                      <p className="text-xs text-muted-foreground">24.5 GB of 50 GB</p>
                    </div>
                    <div className="w-24 bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '49%' }}></div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="database">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Query Performance</p>
                      <p className="text-xs text-muted-foreground">Average response time</p>
                    </div>
                    <p className="text-sm font-medium">124ms</p>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Row Count</p>
                      <p className="text-xs text-muted-foreground">Total records</p>
                    </div>
                    <p className="text-sm font-medium">512,489</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex gap-4">
        <Button variant="outline" className="flex gap-2">
          <BarChart4Icon className="h-4 w-4" />
          View Detailed Reports
        </Button>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 