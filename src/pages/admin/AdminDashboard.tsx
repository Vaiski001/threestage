import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState({
    totalCustomers: 0,
    totalCompanies: 0,
    totalInquiries: 0,
    recentInquiries: [],
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching admin dashboard data...");
      
      // Fetch dashboard data with error handling for each query
      const customersPromise = supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer')
        .then(result => {
          if (result.error) throw new Error(`Error fetching customers: ${result.error.message}`);
          return { count: result.count || 0 };
        })
        .catch(err => {
          console.error("Customer query failed:", err);
          return { count: 0 };
        });
      
      const companiesPromise = supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'company')
        .then(result => {
          if (result.error) throw new Error(`Error fetching companies: ${result.error.message}`);
          return { count: result.count || 0 };
        })
        .catch(err => {
          console.error("Company query failed:", err);
          return { count: 0 };
        });
      
      const inquiriesCountPromise = supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })
        .then(result => {
          if (result.error) throw new Error(`Error fetching inquiry count: ${result.error.message}`);
          return { count: result.count || 0 };
        })
        .catch(err => {
          console.error("Inquiries count query failed:", err);
          return { count: 0 };
        });
      
      const recentInquiriesPromise = supabase
        .from('inquiries')
        .select('*, profiles(name)')
        .order('created_at', { ascending: false })
        .limit(5)
        .then(result => {
          if (result.error) throw new Error(`Error fetching recent inquiries: ${result.error.message}`);
          return { data: result.data || [] };
        })
        .catch(err => {
          console.error("Recent inquiries query failed:", err);
          return { data: [] };
        });

      const [
        { count: totalCustomers },
        { count: totalCompanies },
        { count: totalInquiries },
        { data: recentInquiries }
      ] = await Promise.all([
        customersPromise,
        companiesPromise,
        inquiriesCountPromise,
        recentInquiriesPromise
      ]);

      console.log("Dashboard data fetched successfully:", {
        totalCustomers,
        totalCompanies,
        totalInquiries,
        recentInquiriesCount: recentInquiries.length
      });

      setDashboardData({
        totalCustomers: totalCustomers || 0,
        totalCompanies: totalCompanies || 0,
        totalInquiries: totalInquiries || 0,
        recentInquiries: recentInquiries || [],
      });
      
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      console.log("Profile available, fetching dashboard data:", profile);
      fetchDashboardData();
    } else {
      console.log("No profile available yet, waiting...");
    }
  }, [profile]);

  // Show loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg mb-2">Loading dashboard data...</p>
          <p className="text-sm text-muted-foreground">Please wait while we fetch the latest information</p>
        </div>
      </AdminLayout>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)]">
          <Alert variant="destructive" className="mb-4 max-w-lg">
            <AlertTitle>Error loading dashboard</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            onClick={fetchDashboardData} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
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
            onClick={fetchDashboardData} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Total registered customers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalCompanies}</div>
              <p className="text-xs text-muted-foreground">Total registered companies</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalInquiries}</div>
              <p className="text-xs text-muted-foreground">Total inquiries in the system</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
            <CardDescription>The most recent inquiries across the platform.</CardDescription>
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
                  {dashboardData.recentInquiries.map((inquiry: any) => (
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
                      <TableCell>{new Date(inquiry.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Alert>
                <AlertTitle>No recent inquiries</AlertTitle>
                <AlertDescription>
                  There are no recent inquiries in the system.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 