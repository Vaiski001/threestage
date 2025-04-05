import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';

export default function DatabaseTest() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>
        <p className="mb-4">
          This is a basic test page to verify routing is working correctly.
        </p>
        <div className="p-4 border rounded bg-gray-50">
          <p>If you can see this page, the route is configured correctly.</p>
          <p className="mt-2">The full database test functionality will be added once basic routing works.</p>
        </div>
      </div>
    </AppLayout>
  );
} 