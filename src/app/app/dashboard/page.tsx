'use client';

import { useAuth } from '@/app/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const { user, hasRole, loading } = useAuth();
  const router = useRouter();

  // Redirect to appropriate portal dashboard
  useEffect(() => {
    if (!loading && user) {
      if (hasRole('customer')) {
        router.push('/app/customer/dashboard');
      } else if (hasRole('company')) {
        router.push('/app/company/dashboard');
      }
    }
  }, [user, hasRole, loading, router]);

  // Show loading state if authentication is still initializing
  if (loading || !user) {
    return (
      <div className="container mx-auto py-10 space-y-6">
        <h1 className="text-3xl font-bold">Loading dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">Redirecting to your dashboard...</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Portal</CardTitle>
            <CardDescription>Access your customer dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push('/app/customer/dashboard')}
              className="w-full"
            >
              Go to Customer Dashboard
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Company Portal</CardTitle>
            <CardDescription>Access your company dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push('/app/company/dashboard')}
              variant="outline"
              className="w-full"
            >
              Go to Company Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 