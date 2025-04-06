'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

// Define types for our fetched data
interface EnquiryStats {
  active: number;
  pending: number;
  completed: number;
  lastCompletedDate: string | null;
}

interface MessageStats {
  total: number;
  unread: number;
}

interface Activity {
  id: string;
  action: string;
  date: string;
  description: string;
}

export default function CustomerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    enquiries: EnquiryStats;
    messages: MessageStats;
    activities: Activity[];
  }>({
    enquiries: { active: 0, pending: 0, completed: 0, lastCompletedDate: null },
    messages: { total: 0, unread: 0 },
    activities: []
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
            enquiries: {
              active: 3,
              pending: 2,
              completed: 12,
              lastCompletedDate: '2023-04-03T14:43:12Z'
            },
            messages: {
              total: 5,
              unread: 2
            },
            activities: [
              { id: '1', action: 'Message received', date: '2 hours ago', description: 'RE: Product inquiry #1234' },
              { id: '2', action: 'Status updated', date: '1 day ago', description: 'Enquiry #2345 marked as In Progress' },
              { id: '3', action: 'New enquiry created', date: '3 days ago', description: 'Enquiry #3456 submitted successfully' },
              { id: '4', action: 'Message sent', date: '5 days ago', description: 'RE: Support request #4567' }
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

  // Format the last completed date
  const formatLastCompletedDate = () => {
    if (!stats.enquiries.lastCompletedDate) return 'No completed enquiries';
    
    const date = new Date(stats.enquiries.lastCompletedDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    return `Last completed ${diffDays} days ago`;
  };

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

  // Loading skeletons
  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-9 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
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

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between border-b border-border pb-2">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customer Dashboard</h1>
        <Button asChild>
          <Link href="/app/customer/enquiries/new">New Enquiry</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Enquiries</CardTitle>
            <CardDescription>Your current open enquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.enquiries.active}</div>
            <p className="text-sm text-muted-foreground">{stats.enquiries.pending} awaiting response</p>
            <Button variant="link" className="px-0" asChild>
              <Link href="/app/customer/enquiries">View All Enquiries</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Latest communications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.messages.total}</div>
            <p className="text-sm text-muted-foreground">{stats.messages.unread} unread messages</p>
            <Button variant="link" className="px-0" asChild>
              <Link href="/app/customer/messages">View Messages</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed Enquiries</CardTitle>
            <CardDescription>Successfully resolved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.enquiries.completed}</div>
            <p className="text-sm text-muted-foreground">{formatLastCompletedDate()}</p>
            <Button variant="link" className="px-0" asChild>
              <Link href="/app/customer/enquiries?status=completed">View History</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.activities.length > 0 ? (
                stats.activities.map((item) => (
                  <div key={item.id} className="flex justify-between border-b border-border pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{item.action}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 