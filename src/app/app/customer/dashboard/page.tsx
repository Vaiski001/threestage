'use client';

import { useAuth } from '@/app/providers/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CustomerDashboard() {
  const { user } = useAuth();

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
            <div className="text-3xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">2 awaiting response</p>
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
            <div className="text-3xl font-bold">5</div>
            <p className="text-sm text-muted-foreground">2 unread messages</p>
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
            <div className="text-3xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">Last completed 3 days ago</p>
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
              {[
                { action: 'Message received', date: '2 hours ago', description: 'RE: Product inquiry #1234' },
                { action: 'Status updated', date: '1 day ago', description: 'Enquiry #2345 marked as In Progress' },
                { action: 'New enquiry created', date: '3 days ago', description: 'Enquiry #3456 submitted successfully' },
                { action: 'Message sent', date: '5 days ago', description: 'RE: Support request #4567' },
              ].map((item, index) => (
                <div key={index} className="flex justify-between border-b border-border pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{item.action}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 