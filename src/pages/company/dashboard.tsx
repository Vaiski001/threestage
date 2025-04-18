import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Admin detection helper function
const checkForAdminRole = (): boolean => {
  const localStorage1 = localStorage.getItem('supabase.auth.user_role') === 'admin';
  const localStorage2 = localStorage.getItem('userRole') === 'admin';
  const sessionStorage1 = sessionStorage.getItem('userRole') === 'admin';
  
  console.log("🚨 ADMIN CHECK in CompanyDashboard:", {
    'localStorage.supabase.auth.user_role': localStorage1,
    'localStorage.userRole': localStorage2,
    'sessionStorage.userRole': sessionStorage1
  });
  
  return localStorage1 || localStorage2 || sessionStorage1;
};

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  // CRITICAL: Immediate admin check on component mount - highest priority
  useEffect(() => {
    console.log("🔍 CompanyDashboard mounted - checking for admin role");
    
    // Force consistent admin role check
    const isAdmin = checkForAdminRole();
    
    // Also check profile directly if available
    const hasAdminProfile = profile?.role === 'admin';
    
    if (isAdmin || hasAdminProfile) {
      console.log("🚨 ADMIN USER DETECTED IN COMPANY DASHBOARD - FORCE REDIRECTING");
      
      // Ensure admin role is set in all storage locations
      localStorage.setItem('supabase.auth.user_role', 'admin');
      localStorage.setItem('userRole', 'admin');
      sessionStorage.setItem('userRole', 'admin');
      
      // Use replace: true to prevent back navigation issues
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate, profile]);
  
  // Continuous admin check on profile changes
  useEffect(() => {
    if (profile?.role === 'admin') {
      console.log("🚨 ADMIN PROFILE DETECTED IN COMPANY DASHBOARD - REDIRECTING");
      
      // Ensure admin role is set in all storage locations
      localStorage.setItem('supabase.auth.user_role', 'admin');
      localStorage.setItem('userRole', 'admin');
      sessionStorage.setItem('userRole', 'admin');
      
      navigate('/admin/dashboard', { replace: true });
    }
  }, [profile, navigate]);
  
  // Rest of the component...
  return (
    <div>
      {/* Company Dashboard Content */}
    </div>
  );
}

export default CompanyDashboard; 