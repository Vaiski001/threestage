import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { RefreshCcw, Users, Building, MessageSquare, AlertTriangle, Loader2, Activity, Database } from "lucide-react";
import { adminService, DashboardData, ActivityData } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalCustomers: 0,
    totalCompanies: 0,
    totalInquiries: 0,
    recentInquiries: [],
    recentActivities: [],
    systemHealth: {
      storageUsage: 0,
      activeUsers: 0,
      errorRate: 0
    }
  });
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.fetchDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey, toast]);

  // Set up real-time listeners for dashboard updates
  useEffect(() => {
    // Listen for dashboard updates from various tables
    const unsubscribe = adminService.addListener("dashboard", (payload) => {
      console.log("Dashboard update received:", payload);
      // Refresh data when certain entities change
      setRefreshKey(prev => prev + 1);
      
      // Show notification about the change
      toast({
        title: `${payload.type} Updated`,
        description: `A ${payload.type} record was ${payload.data.eventType}`,
        variant: "default",
      });
    });

    return () => {
      // Clean up listener when component unmounts
      unsubscribe();
    };
  }, [toast]);

  const handleRefresh = async () => {
    setRefreshKey(prev => prev + 1);
  };

  // Format relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    return 'just now';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Loading dashboard data...</p>
          <p className="text-sm text-muted-foreground mt-2">Fetching the latest information from all portals</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="grid gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome to the Threestage admin dashboard.</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Retry
            </Button>
          </div>
          
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Data</AlertTitle>
            <AlertDescription>
              {error}. Please try refreshing the dashboard.
            </AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome to the Threestage admin dashboard.</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Total registered customers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Companies</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalCompanies}</div>
              <p className="text-xs text-muted-foreground">Total registered companies</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalInquiries}</div>
              <p className="text-xs text-muted-foreground">Total inquiries in the system</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Inquiries</CardTitle>
              <CardDescription>Recent customer inquiries across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData.recentInquiries.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.recentInquiries.map((inquiry) => (
                      <TableRow key={inquiry.id}>
                        <TableCell>{inquiry.profiles?.name || 'Unknown'}</TableCell>
                        <TableCell>{inquiry.title}</TableCell>
                        <TableCell>
                          <Badge variant={
                            inquiry.status === 'pending' ? 'outline' :
                            inquiry.status === 'in_progress' ? 'secondary' :
                            inquiry.status === 'completed' ? 'default' : 'destructive'
                          }>
                            {inquiry.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatRelativeTime(inquiry.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No recent inquiries found
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Activity</CardTitle>
              <CardDescription>Recent activities across all portals</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData.recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentActivities.map((activity: ActivityData) => (
                    <div key={activity.id} className="flex items-start space-x-3 text-sm border-b pb-3 last:border-0">
                      <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">
                          {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)} {activity.entity}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          by {activity.performed_by} • {formatRelativeTime(activity.performed_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No recent activities found
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current status of your application infrastructure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Storage Usage</span>
                      <span className="text-sm font-medium">{dashboardData.systemHealth.storageUsage}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Users</span>
                      <span className="text-sm font-medium">{dashboardData.systemHealth.activeUsers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Error Rate</span>
                      <span className="text-sm font-medium">{dashboardData.systemHealth.errorRate}%</span>
                    </div>
                    {dashboardData.systemHealth.lastBackup && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Last Backup</span>
                        <span className="text-sm font-medium">{formatRelativeTime(dashboardData.systemHealth.lastBackup)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = "/admin/audit-logs"}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Audit Logs</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm mt-2">
                    <p>Track system activities and changes</p>
                    <p className="text-xs text-muted-foreground mt-1">View detailed logs of all actions performed across portals</p>
                    <Button variant="link" className="p-0 h-auto mt-2 text-xs">View Audit Logs &rarr;</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = "/admin/api"}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">API Management</CardTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                </CardHeader>
                <CardContent>
                  <div className="text-sm mt-2">
                    <p>Manage API Keys and Integrations</p>
                    <p className="text-xs text-muted-foreground mt-1">Create, revoke and monitor API access for third-party integrations</p>
                    <Button variant="link" className="p-0 h-auto mt-2 text-xs">Access API Console &rarr;</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Button variant="outline" className="h-auto py-4 justify-start" onClick={() => window.location.href = "/admin/companies"}>
                <Building className="mr-2 h-4 w-4" />
                <div className="text-left">
                  <p className="font-medium">Manage Companies</p>
                  <p className="text-xs text-muted-foreground mt-1">Add, edit, or deactivate company accounts</p>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto py-4 justify-start" onClick={() => window.location.href = "/admin/customers"}>
                <Users className="mr-2 h-4 w-4" />
                <div className="text-left">
                  <p className="font-medium">Manage Customers</p>
                  <p className="text-xs text-muted-foreground mt-1">View and manage customer accounts</p>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto py-4 justify-start" onClick={() => window.location.href = "/admin/notifications"}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
                <div className="text-left">
                  <p className="font-medium">Notification Management</p>
                  <p className="text-xs text-muted-foreground mt-1">Configure system notifications and templates</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 