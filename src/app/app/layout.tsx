'use client';

import { useAuth } from '../providers/AuthProvider';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading, hasRole, signOut } = useAuth();
  const pathname = usePathname();

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="flex min-h-screen">
        {/* Sidebar loading skeleton */}
        <div className="w-64 bg-card border-r border-border p-4 space-y-6">
          <Skeleton className="h-8 w-40" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        
        {/* Main content loading skeleton */}
        <div className="flex-1 p-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const isCustomer = hasRole('customer');
  const isCompany = hasRole('company');

  // Detect which portal we're in based on the path
  const inCustomerPortal = pathname.includes('/app/customer');
  const inCompanyPortal = pathname.includes('/app/company');
  
  // Sidebar navigation links based on role
  const customerLinks = [
    { label: 'Dashboard', href: '/app/customer/dashboard' },
    { label: 'Enquiries', href: '/app/customer/enquiries' },
    { label: 'Messages', href: '/app/customer/messages' },
    { label: 'Profile', href: '/app/customer/profile' },
    { label: 'Settings', href: '/app/customer/settings' },
  ];
  
  const companyLinks = [
    { label: 'Dashboard', href: '/app/company/dashboard' },
    { label: 'Customers', href: '/app/company/customers' },
    { label: 'Enquiries', href: '/app/company/enquiries' },
    { label: 'Team', href: '/app/company/team' },
    { label: 'Reports', href: '/app/company/reports' },
    { label: 'Settings', href: '/app/company/settings' },
  ];
  
  // Use appropriate links based on user role and current portal
  const navLinks = isCustomer || inCustomerPortal ? customerLinks : companyLinks;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
        {/* Logo and portal name */}
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-semibold">
            {isCustomer || inCustomerPortal ? 'Customer Portal' : 'Company Portal'}
          </h1>
          <p className="text-sm text-muted-foreground">Threestage</p>
        </div>
        
        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`block px-3 py-2 rounded-md text-sm ${
                pathname === link.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* User info and logout */}
        <div className="p-4 border-t border-border">
          <div className="mb-2">
            <p className="font-medium">{user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.user_metadata?.role || 'User'}
            </p>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
} 