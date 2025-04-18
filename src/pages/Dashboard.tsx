import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { getDashboardPathForRole, validateRole } from "@/lib/supabase/roleUtils";

// Helper function to check if user has admin role in any storage location
const isAdminInStorage = () => {
  const supabaseAuthRole = localStorage.getItem('supabase.auth.user_role');
  const userRole = localStorage.getItem('userRole');
  const sessionRole = sessionStorage.getItem('userRole');
  
  const isAdmin = supabaseAuthRole === 'admin' || userRole === 'admin' || sessionRole === 'admin';
  
  console.log("🔍 Admin role check in storage:", {
    isAdmin,
    'localStorage.supabase.auth.user_role': supabaseAuthRole,
    'localStorage.userRole': userRole,
    'sessionStorage.userRole': sessionRole
  });
  
  return isAdmin;
};

// Helper function to set admin role in all storage locations
const setAdminRoleInStorage = () => {
  console.log("🔴 Setting admin role in all storage locations");
  localStorage.setItem('supabase.auth.user_role', 'admin');
  localStorage.setItem('userRole', 'admin');
  sessionStorage.setItem('userRole', 'admin');
};

const Dashboard = () => {
  const { profile, loading, isAuthenticated, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  
  // Add debug log on component mount
  useEffect(() => {
    console.log("🔍 Dashboard component mounted - Starting role detection");
  }, []);
  
  // Check for admin role in storage immediately on mount (high priority check)
  useEffect(() => {
    // If admin role is found in ANY storage location, redirect immediately
    if (isAdminInStorage()) {
      console.log("🚨 ADMIN ROLE DETECTED in storage - Performing immediate redirect");
      
      // Force admin role to be set in all locations
      setAdminRoleInStorage();
      
      // Redirect to admin dashboard with replace to prevent back navigation issues
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);
  
  // Debug effect to log the current state on mount and when profile/auth changes
  useEffect(() => {
    console.log("=== Dashboard Component State ===");
    console.log("Loading:", loading);
    console.log("isAuthenticated:", isAuthenticated);
    console.log("Profile:", profile);
    console.log("Profile Role:", profile?.role);
    
    // Check for role in localStorage
    const storedRole = localStorage.getItem('supabase.auth.user_role');
    const userRoleKey = localStorage.getItem('userRole');
    console.log("Roles in localStorage:", {
      'supabase.auth.user_role': storedRole,
      'userRole': userRoleKey
    });
    console.log("Validated stored role:", validateRole(storedRole));
    
    // Check for admin role specifically in profile
    if (profile?.role === 'admin') {
      console.log("🔴 ADMIN USER DETECTED in profile - Setting storage and redirecting");
      
      // Ensure admin role is properly set in storage
      setAdminRoleInStorage();
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard', { replace: true });
    }
  }, [profile, loading, isAuthenticated, navigate]);
  
  // Main redirection logic
  useEffect(() => {
    // Only process redirect after loading is complete
    if (loading) {
      console.log("Still loading auth state, waiting before redirect");
      return;
    }
    
    const handleRedirect = async () => {
      try {
        setRedirecting(true);
        console.log("Starting dashboard redirect process");
        
        // Try to refresh profile to ensure we have the most up-to-date data
        if (isAuthenticated && refreshProfile) {
          console.log("Refreshing profile before redirection");
          await refreshProfile();
        }
        
        // CRITICAL: Check for admin role in ALL possible storage locations
        if (isAdminInStorage()) {
          console.log("🔴 Admin role found in storage, redirecting to admin dashboard");
          
          // Force admin role in all storage
          setAdminRoleInStorage();
          
          navigate('/admin/dashboard', { replace: true });
          return;
        }
        
        // Redirect based on user role in profile
        if (profile) {
          console.log("Dashboard redirecting based on profile role:", profile.role);
          
          // Normalize role to lowercase for consistent comparison
          const normalizedRole = profile.role.toLowerCase();
          
          // Handle all valid roles with explicit logging
          if (normalizedRole === 'admin') {
            console.log("🔴 Redirecting to admin dashboard from profile role");
            setAdminRoleInStorage();
            navigate('/admin/dashboard', { replace: true });
          } else if (normalizedRole === 'company') {
            console.log("Redirecting to company dashboard");
            navigate('/company/dashboard', { replace: true });
          } else if (normalizedRole === 'customer') {
            console.log("Redirecting to customer dashboard");
            navigate('/customer/dashboard', { replace: true });
          } else {
            console.warn("Unknown role detected:", profile.role);
            // Get stored role from localStorage as fallback
            const storedRole = localStorage.getItem('supabase.auth.user_role');
            console.log("Checking stored role in localStorage:", storedRole);
            
            if (storedRole === 'admin') {
              console.log("🔴 Redirecting to admin dashboard from localStorage (fallback)");
              navigate('/admin/dashboard', { replace: true });
            } else if (storedRole === 'company') {
              navigate('/company/dashboard', { replace: true });
            } else if (storedRole === 'customer') {
              navigate('/customer/dashboard', { replace: true });
            } else {
              // If unknown role or no stored role, redirect to customer dashboard as default
              console.log("No valid role found, defaulting to customer dashboard");
              navigate('/customer/dashboard', { replace: true });
            }
          }
        } else if (!isAuthenticated) {
          // If no profile and not authenticated, redirect to login instead of demo
          console.log("Not authenticated, redirecting to login");
          navigate('/login', { replace: true });
        } else {
          // If authenticated but no profile, check localStorage for role
          console.log("Authenticated but no profile yet, checking localStorage for role...");
          const storedRole = localStorage.getItem('supabase.auth.user_role');
          const userRoleKey = localStorage.getItem('userRole');
          console.log("Stored roles in localStorage:", {
            'supabase.auth.user_role': storedRole,
            'userRole': userRoleKey
          });
          
          // Admin check first (highest priority)
          if (isAdminInStorage()) {
            console.log("🔴 Redirecting to admin dashboard from localStorage (no profile)");
            setAdminRoleInStorage(); // Ensure consistency
            navigate('/admin/dashboard', { replace: true });
            return;
          }
          
          if (storedRole === 'company') {
            navigate('/company/dashboard', { replace: true });
          } else if (storedRole === 'customer') {
            navigate('/customer/dashboard', { replace: true });
          } else {
            // If still no role information, wait briefly then try customer dashboard
            setTimeout(() => {
              if (!profile) {
                console.log("No profile or role info available, defaulting to customer dashboard");
                navigate('/customer/dashboard', { replace: true });
              }
            }, 1500);
          }
        }
      } catch (error) {
        console.error("Error during dashboard redirect:", error);
        // Fallback to login in case of errors
        navigate('/login', { replace: true });
      }
    };
    
    handleRedirect();
  }, [profile, loading, isAuthenticated, navigate, refreshProfile]);

  // Show enhanced loading state while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <h2 className="text-xl font-medium">Loading your dashboard...</h2>
        <p className="text-muted-foreground">
          {redirecting 
            ? "Redirecting you to the right place." 
            : "Checking your account information..."}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
