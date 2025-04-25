import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { validateRole, getDashboardPathForRole } from "@/lib/supabase/roleUtils";
import { isSupabaseAvailable } from "@/lib/supabase/client";

// Helper function to check for admin role in all possible storage locations
const checkForAdminRole = (): boolean => {
  const localStorage1 = localStorage.getItem('supabase.auth.user_role') === 'admin';
  const localStorage2 = localStorage.getItem('userRole') === 'admin';
  const sessionStorage1 = sessionStorage.getItem('userRole') === 'admin';
  
  console.log("🔍 Admin role check:", {
    'localStorage.supabase.auth.user_role': localStorage1,
    'localStorage.userRole': localStorage2,
    'sessionStorage.userRole': sessionStorage1
  });
  
  return localStorage1 || localStorage2 || sessionStorage1;
};

// Check if path is a customer or company specific path
const isCustomerPath = (path: string) => path.startsWith('/customer/');
const isCompanyPath = (path: string) => path.startsWith('/company/');
const isAdminPath = (path: string) => path.startsWith('/admin/');

// Define auth paths that should not trigger role-specific redirects
const AUTH_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password'];

// Define public paths that should always be accessible regardless of auth state
const PUBLIC_PATHS = ['/', '/demo', '/login', '/signup', '/unauthorized', '/companies'];

// Helper to check if a path is a public path
const isPublicPath = (path: string) => 
  PUBLIC_PATHS.includes(path) || 
  path.startsWith('/auth/') || 
  path.startsWith('/companies/') ||
  path.startsWith('/forms/');

interface RoleRouterProps {
  children: React.ReactNode;
}

export const RoleRouter = ({ children }: RoleRouterProps) => {
  const { profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [hasCheckedRole, setHasCheckedRole] = useState(false);

  // Development mode and preview bypass
  const isDevelopment = import.meta.env.DEV;
  const isPreview = window.location.hostname.includes('preview') || 
                   window.location.hostname.includes('lovable.app');
  // Also bypass if Supabase credentials are missing
  const supabaseCredentialsMissing = !isSupabaseAvailable();
  const bypassRoleCheck = (isDevelopment && process.env.NODE_ENV !== 'production') || 
                         isPreview || 
                         supabaseCredentialsMissing;

  // Enhanced logging for profile data on mount
  useEffect(() => {
    console.log("=== RoleRouter Initial State ===");
    console.log("Current path:", location.pathname);
    console.log("Profile:", profile);
    console.log("Loading state:", loading);
    console.log("Bypass Role Check:", bypassRoleCheck);
    
    // Check for admin role in all storage locations
    const isAdmin = checkForAdminRole();
    
    if (isAdmin) {
      console.log("🔴 ADMIN ROLE found in storage - RoleRouter initial check");
      
      // If on a non-admin path and has admin role, redirect immediately
      // BUT don't redirect from the home page
      if (!isAdminPath(location.pathname) && !isPublicPath(location.pathname)) {
        console.log("🔴 Immediate redirect needed: Admin not on admin path or allowed public path");
        navigate('/admin/dashboard', { replace: true });
      } else {
        console.log("🔴 Admin user on allowed path, no redirection needed");
      }
    }
    
    // If profile has admin role, log it
    if (profile && profile.role === 'admin') {
      console.log("🔴 ADMIN USER DETECTED in profile object");
      
      // Set all storage locations to admin role for consistency
      localStorage.setItem('supabase.auth.user_role', 'admin');
      localStorage.setItem('userRole', 'admin');
      sessionStorage.setItem('userRole', 'admin');
    }
  }, [profile, loading, location.pathname, bypassRoleCheck, navigate]);

  // Show a warning toast if Supabase credentials are missing
  useEffect(() => {
    if (supabaseCredentialsMissing) {
      toast({
        title: "Demo Mode Active",
        description: "Supabase credentials are missing. App is running in demo mode with limited functionality.",
        variant: "warning",
        duration: 5000,
      });
    }
  }, [supabaseCredentialsMissing, toast]);

  // Refresh profile on mount only, not on path change
  useEffect(() => {
    if (!bypassRoleCheck && !loading) {
      console.log("Initial profile refresh on RoleRouter mount");
      refreshProfile();
    }
  }, [refreshProfile, bypassRoleCheck, loading]);

  useEffect(() => {
    // Skip in development/preview bypass mode
    if (bypassRoleCheck) return;
    
    if (loading) {
      console.log("Still loading profile, skipping role check");
      return;
    }

    // Skip redirection for public paths
    if (isPublicPath(location.pathname)) {
      console.log("Public path detected, skipping role check:", location.pathname);
      return;
    }
    
    const currentPath = location.pathname;
    
    // Check for admin role in all storage locations before even checking profile
    const hasAdminRoleInStorage = checkForAdminRole();
    
    // If admin role found in storage, handle admin redirection first
    if (hasAdminRoleInStorage) {
      console.log("🔴 ADMIN ROLE found in storage during main path check");
      
      // If not on admin path or home page, redirect to admin dashboard
      if (!currentPath.startsWith('/admin/') && !isPublicPath(currentPath)) {
        console.log("🔴 Admin user not on admin path or allowed public path, redirecting to admin dashboard");
        navigate('/admin/dashboard', { replace: true });
        return;
      } else {
        console.log("🔴 Admin user already on admin path or allowed public path, no redirection needed");
        return;
      }
    }
    
    // Now check profile and handling for all roles
    if (profile) {
      console.log("RoleRouter checking path access for role:", profile.role, "Current path:", currentPath);
      
      // Force admin role if found in profile, regardless of storage
      if (profile.role === 'admin') {
        console.log("🔴 ADMIN USER detected in profile - ensuring storage consistency");
        localStorage.setItem('supabase.auth.user_role', 'admin');
        localStorage.setItem('userRole', 'admin');
        sessionStorage.setItem('userRole', 'admin');
        
        // If not on admin path or allowed public path, redirect
        if (!currentPath.startsWith('/admin/') && !isPublicPath(currentPath)) {
          console.log("🔴 Admin user not on admin path or allowed public path, redirecting to admin dashboard");
          navigate('/admin/dashboard', { replace: true });
          return;
        }
      }
      
      const pathIsCompany = currentPath.startsWith('/company/');
      const pathIsCustomer = currentPath.startsWith('/customer/');
      const pathIsAdmin = currentPath.startsWith('/admin/');
      
      // If user is on the wrong path type for their role, redirect them
      if ((profile.role === 'company' && (pathIsCustomer || pathIsAdmin)) || 
          (profile.role === 'customer' && (pathIsCompany || pathIsAdmin)) ||
          (profile.role === 'admin' && (pathIsCustomer || pathIsCompany))) {
        console.log("User on incorrect path for their role, redirecting");
        
        toast({
          title: "Access Restricted",
          description: "You don't have permission to access this area.",
          variant: "destructive",
        });
        
        if (profile.role === 'company') {
          console.log("Company user detected, redirecting to company dashboard");
          navigate('/company/dashboard', { replace: true });
        } else if (profile.role === 'customer') {
          console.log("Customer user detected, redirecting to customer dashboard");
          navigate('/customer/dashboard', { replace: true });
        } else if (profile.role === 'admin') {
          console.log("🔴 Admin user detected, redirecting to admin dashboard");
          navigate('/admin/dashboard', { replace: true });
        }
      } 
      // If not on a role-specific path or public path, redirect to appropriate dashboard
      else if (!pathIsCompany && !pathIsCustomer && !pathIsAdmin && !isPublicPath(currentPath)) {
        console.log("User not on role-specific path, redirecting to appropriate dashboard");
        
        if (profile.role === 'company') {
          console.log("Company user detected, redirecting to company dashboard");
          navigate('/company/dashboard', { replace: true });
        } else if (profile.role === 'customer') {
          console.log("Customer user detected, redirecting to customer dashboard");
          navigate('/customer/dashboard', { replace: true });
        } else if (profile.role === 'admin') {
          console.log("🔴 Admin user detected, redirecting to admin dashboard");
          navigate('/admin/dashboard', { replace: true });
        } else {
          console.warn("Invalid role detected:", profile.role);
          toast({
            title: "Unknown user role",
            description: "Your account has an invalid role. Please contact support.",
            variant: "destructive",
          });
          // Redirect to login if role is invalid
          navigate('/login', { replace: true });
        }
      } else {
        console.log("User is on correct path for their role, no redirection needed");
      }
    } else if (!loading) {
      // No profile but not loading - check localStorage for role
      console.log("No profile found but not loading, checking storage for role");
      
      // Final check for admin role in all storage locations
      const hasAdminRole = checkForAdminRole();
      
      if (hasAdminRole) {
        console.log("🔴 ADMIN ROLE found in storage (no profile) - handling admin redirection");
        
        // Ensure consistency across all storage
        localStorage.setItem('supabase.auth.user_role', 'admin');
        localStorage.setItem('userRole', 'admin');
        sessionStorage.setItem('userRole', 'admin');
        
        // Redirect if not on admin path or public path
        if (!currentPath.startsWith('/admin/') && !isPublicPath(currentPath)) {
          console.log("🔴 Admin role in storage, redirecting to admin dashboard");
          navigate('/admin/dashboard', { replace: true });
          return;
        }
      } else {
        // Not admin - check for other roles in localStorage
        const storedRole = localStorage.getItem('supabase.auth.user_role') || localStorage.getItem('userRole');
        console.log("Checking localStorage for non-admin role:", storedRole);
        const validRole = validateRole(storedRole);
        
        if (validRole) {
          console.log("Found valid role in localStorage:", validRole);
          const pathIsCompany = currentPath.startsWith('/company/');
          const pathIsCustomer = currentPath.startsWith('/customer/');
          
          // If on a path that doesn't match role from localStorage, redirect
          if ((validRole === 'company' && pathIsCustomer) || 
              (validRole === 'customer' && pathIsCompany) ||
              (!pathIsCompany && !pathIsCustomer && !isPublicPath(currentPath))) {
            console.log("User on incorrect path for their stored role, redirecting");
            navigate(getDashboardPathForRole(validRole), { replace: true });
          }
        } else if (!isPublicPath(currentPath)) {
          // No valid role and not on a public path - redirect to login
          console.log("No valid role found and not on public path, redirecting to login");
          navigate('/login', { state: { from: currentPath } });
        }
      }
    }
  }, [profile, loading, location.pathname, navigate, toast, bypassRoleCheck, refreshProfile]);

  return <>{children}</>;
};
