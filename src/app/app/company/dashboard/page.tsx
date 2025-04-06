'use client';

import { useAuth } from '@/app/providers/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CompanyDashboard() {
  const { user } = useAuth();

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
            <div className="text-3xl font-bold">24</div>
            <p className="text-sm text-muted-foreground">8 require attention</p>
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
            <div className="text-3xl font-bold">156</div>
            <p className="text-sm text-muted-foreground">12 new this month</p>
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
            <div className="text-3xl font-bold">38</div>
            <p className="text-sm text-muted-foreground">5 unread messages</p>
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
            <div className="text-3xl font-bold">92%</div>
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
                {[
                  { id: '#EN5423', customer: 'Jane Cooper', subject: 'Product information request', status: 'New', date: '2 hours ago' },
                  { id: '#EN5419', customer: 'Robert Fox', subject: 'Service cancellation', status: 'Pending', date: '5 hours ago' },
                  { id: '#EN5412', customer: 'Leslie Alexander', subject: 'Billing inquiry', status: 'In Progress', date: '1 day ago' },
                  { id: '#EN5410', customer: 'Kristin Watson', subject: 'Technical support', status: 'New', date: '1 day ago' },
                  { id: '#EN5405', customer: 'Guy Hawkins', subject: 'Custom integration', status: 'Completed', date: '2 days ago' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.id}</span>
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
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">Recent Customers</h2>
          {/* Customer table content */}
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">Team Performance</h2>
          {/* Team performance metrics */}
        </TabsContent>
      </Tabs>
    </div>
  );
} 