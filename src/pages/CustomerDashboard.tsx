import { useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { CustomerPortalLayout } from "@/components/customer/layout/CustomerPortalLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, FileText, MessageCircle, Plus, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface InquiryStats {
  total: number;
  active: number;
  pending: number;
  completed: number;
}

interface Inquiry {
  id: string;
  title: string;
  status: 'new' | 'pending' | 'completed';
  created_at: string;
  company_name: string;
  last_message?: string;
  last_message_time?: string;
}

// Custom badge component for custom variants like success
interface CustomBadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success";
  children: ReactNode;
}

const CustomBadge = ({ variant = "default", children }: CustomBadgeProps) => {
  // Handle success variant with custom styling
  if (variant === "success") {
    return (
      <span className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-100"
      )}>
        {children}
      </span>
    );
  }
  
  // Use standard Badge for other variants
  return <Badge variant={variant}>{children}</Badge>;
};

const CustomerDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<InquiryStats>({
    total: 0,
    active: 0,
    pending: 0,
    completed: 0
  });
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!profile?.id) return;
      
      try {
        // Fetch inquiry statistics
        const { data: inquiriesData, error: inquiriesError } = await supabase
          .from('inquiries')
          .select('id, status')
          .eq('customer_id', profile.id);
          
        if (inquiriesError) throw inquiriesError;
        
        // Calculate statistics
        const total = inquiriesData?.length || 0;
        const active = inquiriesData?.filter(i => i.status === 'new').length || 0;
        const pending = inquiriesData?.filter(i => i.status === 'pending').length || 0;
        const completed = inquiriesData?.filter(i => i.status === 'completed').length || 0;
        
        setStats({ total, active, pending, completed });
        
        // Fetch recent inquiries
        const { data: recentData, error: recentError } = await supabase
          .from('inquiries')
          .select(`
            id, 
            title, 
            status, 
            created_at,
            company:companies(name)
          `)
          .eq('customer_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (recentError) throw recentError;
        
        // Transform data
        const formattedInquiries: Inquiry[] = (recentData || []).map(item => ({
          id: item.id,
          title: item.title,
          status: item.status,
          company_name: item.company?.name || 'Unknown Company',
          created_at: item.created_at,
          // These would come from a messages join in a real implementation
          last_message: 'We are reviewing your inquiry.',
          last_message_time: new Date().toISOString()
        }));
        
        setRecentInquiries(formattedInquiries);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Set up realtime subscription for dashboard updates
    const inquiriesSubscription = supabase
      .channel('inquiries-changes')
      .on('postgres_changes', {
        event: '*', 
        schema: 'public',
        table: 'inquiries',
        filter: `customer_id=eq.${profile?.id}`
      }, () => {
        // Refresh data when changes occur
        fetchDashboardData();
      })
      .subscribe();
      
    return () => {
      // Clean up subscription
      supabase.removeChannel(inquiriesSubscription);
    };
  }, [profile?.id]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'new':
        return <Badge variant="default">New</Badge>;
      case 'pending':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'completed':
        return <CustomBadge variant="success">Completed</CustomBadge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Empty state component for no inquiries
  const EmptyState = () => (
    <div className="text-center py-8">
      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No inquiries yet</h3>
      <p className="text-muted-foreground mb-4">Get started by creating your first inquiry</p>
      <Button onClick={() => navigate("/customer/inquiry/new")}>
        <Plus className="h-4 w-4 mr-2" />
        Create New Inquiry
      </Button>
    </div>
  );

  return (
    <CustomerPortalLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {profile?.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your inquiries and activities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">All time inquiries</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">New Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground mt-1">Recently submitted</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently being processed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground mt-1">Successfully resolved</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Recent Inquiries - Takes 2/3 of the width on medium+ screens */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Inquiries</CardTitle>
                  <CardDescription>Your most recent inquiry submissions</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/customer/enquiries")}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : recentInquiries.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {recentInquiries.map((inquiry) => (
                      <div 
                        key={inquiry.id} 
                        className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/customer/enquiries/${inquiry.id}`)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{inquiry.title}</h3>
                            <p className="text-sm text-muted-foreground">{inquiry.company_name}</p>
                          </div>
                          <StatusBadge status={inquiry.status} />
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>Created {formatDate(inquiry.created_at)}</span>
                        </div>
                        
                        {inquiry.last_message && (
                          <div className="mt-3 pt-3 border-t text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                              <MessageCircle className="h-3.5 w-3.5" />
                              <span>Last message</span>
                              {inquiry.last_message_time && (
                                <span className="flex items-center gap-1 ml-2">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(inquiry.last_message_time)}
                                </span>
                              )}
                            </div>
                            <p className="line-clamp-1">{inquiry.last_message}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <EmptyState />
              )}
            </CardContent>
          </Card>

          {/* Quick Actions - Takes 1/3 of the width on medium+ screens */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button 
                  variant="outline" 
                  className="justify-start" 
                  onClick={() => navigate("/customer/inquiry/new")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Inquiry
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => navigate("/customer/messaging/inbox")}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Check Messages
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => navigate("/companies")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Browse Companies
                </Button>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Will be implemented with real data in a future enhancement */}
                <div className="text-sm text-muted-foreground py-3">
                  Activity logging will be available in the next update.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CustomerPortalLayout>
  );
};

export default CustomerDashboard;
