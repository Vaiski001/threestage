'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

// Define types for the dashboard data
interface EnquiryStats {
  total: number;
  needAttention: number;
}

interface CustomerStats {
  total: number;
  newThisMonth: number;
}

interface MessageStats {
  total: number;
  unread: number;
}

interface TeamStats {
  responseRate: number;
}

interface RecentEnquiry {
  id: string;
  customer: string;
  subject: string;
  status: 'New' | 'Pending' | 'In Progress' | 'Completed';
  date: string;
}

interface RecentCustomer {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  enquiryCount: number;
}

interface TeamPerformance {
  member: string;
  responseTime: string;
  resolvedCount: number;
  satisfactionRate: number;
}

export default function CompanyDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    enquiries: { total: 0, needAttention: 0 },
    customers: { total: 0, newThisMonth: 0 },
    messages: { total: 0, unread: 0 },
    team: { responseRate: 0 },
    recentEnquiries: [] as RecentEnquiry[],
    recentCustomers: [] as RecentCustomer[],
    teamPerformance: [] as TeamPerformance[]
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data from the API
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/dashboard');
        
        if (!response.ok) {
          throw new Error(`Error fetching dashboard data: ${response.status}`);
        }
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
        
        // Fall back to mock data in development
        if (process.env.NODE_ENV === 'development') {
          const mockData = {
            enquiries: { total: 24, needAttention: 8 },
            customers: { total: 156, newThisMonth: 12 },
            messages: { total: 38, unread: 5 },
            team: { responseRate: 92 },
            recentEnquiries: [
              { id: 'EN5423', customer: 'Jane Cooper', subject: 'Product information request', status: 'New' as const, date: '2 hours ago' },
              { id: 'EN5419', customer: 'Robert Fox', subject: 'Service cancellation', status: 'Pending' as const, date: '5 hours ago' },
              { id: 'EN5412', customer: 'Leslie Alexander', subject: 'Billing inquiry', status: 'In Progress' as const, date: '1 day ago' },
              { id: 'EN5410', customer: 'Kristin Watson', subject: 'Technical support', status: 'New' as const, date: '1 day ago' },
              { id: 'EN5405', customer: 'Guy Hawkins', subject: 'Custom integration', status: 'Completed' as const, date: '2 days ago' }
            ],
            recentCustomers: [
              { id: 'CUS1234', name: 'Jane Cooper', email: 'jane@example.com', joinedDate: '2 days ago', enquiryCount: 3 },
              { id: 'CUS1235', name: 'Robert Fox', email: 'robert@example.com', joinedDate: '5 days ago', enquiryCount: 1 },
              { id: 'CUS1236', name: 'Leslie Alexander', email: 'leslie@example.com', joinedDate: '1 week ago', enquiryCount: 4 }
            ],
            teamPerformance: [
              { member: 'Sarah Johnson', responseTime: '1.5 hours', resolvedCount: 45, satisfactionRate: 96 },
              { member: 'Michael Brown', responseTime: '2.1 hours', resolvedCount: 38, satisfactionRate: 94 },
              { member: 'Emily Davis', responseTime: '1.2 hours', resolvedCount: 52, satisfactionRate: 97 }
            ]
          };
          setStats(mockData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  // Error state
  if (error && !loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          <h2 className="font-semibold">Error Loading Dashboard</h2>
          <p>{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()} 
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-56" />
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-8 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Skeleton className="h-10 w-96 mb-6" />
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                      <Skeleton className="h-4 w-48 mt-1" />
                    </div>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Company Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/app/company/forms/create">Create Form</Link>
          </Button>
          <Button asChild>
            <Link href="/app/company/customers/add">Add Customer</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Enquiries</CardTitle>
            <CardDescription>All customer enquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.enquiries.total}</div>
            <p className="text-sm text-muted-foreground">{stats.enquiries.needAttention} require attention</p>
            <Button variant="link" className="px-0" asChild>
              <Link href="/app/company/enquiries">View All</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Customers</CardTitle>
            <CardDescription>Total registered customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.customers.total}</div>
            <p className="text-sm text-muted-foreground">{stats.customers.newThisMonth} new this month</p>
            <Button variant="link" className="px-0" asChild>
              <Link href="/app/company/customers">View All</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Messages</CardTitle>
            <CardDescription>Across all channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.messages.total}</div>
            <p className="text-sm text-muted-foreground">{stats.messages.unread} unread messages</p>
            <Button variant="link" className="px-0" asChild>
              <Link href="/app/company/messages">View Messages</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Team Activity</CardTitle>
            <CardDescription>Performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.team.responseRate}%</div>
            <p className="text-sm text-muted-foreground">Response rate</p>
            <Button variant="link" className="px-0" asChild>
              <Link href="/app/company/reports">View Reports</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent Enquiries</TabsTrigger>
          <TabsTrigger value="customers">Recent Customers</TabsTrigger>
          <TabsTrigger value="team">Team Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">Recent Enquiries</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {stats.recentEnquiries.length > 0 ? (
                  stats.recentEnquiries.map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">#{item.id}</span>
                          <span className="text-sm">{item.customer}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.subject}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === 'New' ? 'bg-blue-100 text-blue-800' :
                          item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          item.status === 'In Progress' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.status}
                        </span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{item.date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recent enquiries</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">Recent Customers</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {stats.recentCustomers.length > 0 ? (
                  stats.recentCustomers.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{customer.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                          {customer.enquiryCount} enquiries
                        </span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Joined {customer.joinedDate}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recent customers</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">Team Performance</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {stats.teamPerformance.length > 0 ? (
                  stats.teamPerformance.map((member, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{member.member}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Avg. response time: {member.responseTime}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                          {member.resolvedCount} resolved
                        </span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {member.satisfactionRate}% satisfaction
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No team performance data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 