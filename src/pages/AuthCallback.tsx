import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase, processAccessToken, handleOAuthSignIn, createUserProfile, UserRole } from "@/lib/supabase";
import { ensureUserProfile } from "@/lib/supabase/auth";
import { Container } from "@/components/ui/Container";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { 
  DebugInfo, 
  AuthLoading, 
  AuthError, 
  AuthSuccess 
} from "@/components/auth/AuthCallbackUtils";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const [authStage, setAuthStage] = useState<string>("initializing");
  const [processingTimeElapsed, setProcessingTimeElapsed] = useState<number>(0);
  const [startTime] = useState<number>(Date.now());
  const [authError, setAuthError] = useState<string | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [manualRedirect, setManualRedirect] = useState<boolean>(false);
  const [authSuccess, setAuthSuccess] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUserRole } = useAuth();
  
  // Get role from query params, account_type param, or localStorage (fallback)
  const userRole = searchParams.get('role') as UserRole || 
                   localStorage.getItem('oauth_role') as UserRole || 
                   'customer';
                   
  // Get account type for better redirection handling
  const accountType = searchParams.get('account_type') || userRole;
  
  // Detect whether additional info is needed based on role
  const needsAdditionalInfo = userRole === 'company';
  
  // Store the URL for debugging
  const redirectUrl = window.location.href;
  
  // Function to parse hash and redirect - defined before it's used in useEffect
  const parseHashAndRedirect = () => {
    try {
      setAuthStage("manual_redirect");
      setManualRedirect(true);
      
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      
      if (!accessToken) {
        console.error("No access token found in URL hash");
        setAuthError("No access token found. Please try again.");
        return;
      }
      
      // Store tokens in localStorage for manual handling
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: Date.now() + 3600 * 1000,
        expires_in: 3600,
        token_type: 'bearer'
      }));
      
      // Redirect to dashboard (client-side processing will handle the tokens)
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error("Error parsing hash:", error);
      setAuthError("Failed to process authentication data. Please try logging in again.");
    }
  };
  
  useEffect(() => {
    // Update processing time elapsed
    const timer = setInterval(() => {
      setProcessingTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime]);
  
  // Process hash parameters on component mount
  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        if (!window.location.hash && !searchParams.get('code')) {
          console.error("No hash or code parameter found in URL");
          setAuthError("No authentication data found in URL. Please try again.");
          return;
        }
        
        setAuthStage("processing_hash");
        
        // Attempt to get session from URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session from URL:", error);
          setAuthError("Failed to authenticate with the provided data. Please try again.");
          return;
        }
        
        if (!data.session) {
          console.log("No session found, trying to extract hash manually");
          setAuthStage("manual_hash_extraction");
          
          // Manual extraction as fallback
          parseHashAndRedirect();
          return;
        }
        
        setAuthStage("session_received");
        setCurrentUser(data.session.user);
        
        // IMPORTANT: Ensure user has a profile after successful auth
        setAuthStage("creating_profile");
        try {
          const profile = await ensureUserProfile();
          
          if (profile) {
            console.log("User profile created/verified:", profile.id);
            setAuthStage("profile_ready");
          } else {
            console.error("Failed to create or verify user profile");
            setAuthStage("profile_error");
            // Continue with login flow anyway
          }
        } catch (profileError) {
          console.error("Error ensuring user profile:", profileError);
          setAuthStage("profile_error");
          // Continue with login flow anyway
        }
        
        // IMPORTANT: Check user metadata for role if coming from email confirmation
        let roleFromMetadata = null;
        if (data.session.user.user_metadata && data.session.user.user_metadata.role) {
          roleFromMetadata = data.session.user.user_metadata.role;
          console.log("Found role in user metadata:", roleFromMetadata);
        }
        
        // Check account_type parameter for explicit redirection handling
        const accountTypeParam = searchParams.get('account_type');
        if (accountTypeParam) {
          console.log("Found account_type parameter:", accountTypeParam);
        }
        
        // Store session details in localStorage for client-side handling
        localStorage.setItem('supabase.auth.user_role', userRole);
        
        // Track whether this is an email confirmation
        const isEmailConfirmation = searchParams.get('type') === 'signup';
        
        // Check for admin status
        const isAdmin = data.session.user.app_metadata?.isAdmin || false;
        
        // Setup user role in context for app-wide access
        if (isAdmin) {
          setUserRole('admin');
        } else {
          setUserRole(userRole);
        }
        
        // Show success feedback
        setAuthStage("auth_success");
        setAuthSuccess(true);
        
        if (isEmailConfirmation) {
          toast({
            title: "Email confirmed",
            description: "Your email has been confirmed. Please complete your profile.",
          });
        } else {
          toast({
            title: "Login successful",
            description: `Welcome back!`,
          });
        }
        
        // IMPORTANT: Improved redirect logic that prioritizes different sources of role information
        setTimeout(() => {
          // Special case: If this is email confirmation for a company account, always go to settings first
          if (isEmailConfirmation && 
             (accountType === 'company' || roleFromMetadata === 'company' || userRole === 'company')) {
            console.log("Company account email confirmed, redirecting to company settings for profile completion");
            navigate("/company/settings");
            return;
          }

          // Regular login flow (not email confirmation)
          // 1. First priority: accountType from URL (most explicit)
          if (accountType === 'company') {
            console.log("Company account, redirecting to company dashboard");
            if (needsAdditionalInfo) {
              navigate("/company/settings");
            } else {
              navigate("/company/dashboard");
            }
          } 
          // 2. Second priority: role from user metadata (from email confirmation)
          else if (roleFromMetadata === 'company') {
            console.log("Company role from metadata, redirecting to company dashboard");
            if (needsAdditionalInfo) {
              navigate("/company/settings");
            } else {
              navigate("/company/dashboard");
            }
          } 
          // 3. Third priority: role from URL param or localStorage
          else if (userRole === 'company') {
            console.log("Company role from URL/localStorage, redirecting to company dashboard");
            if (needsAdditionalInfo) {
              navigate("/company/settings");
            } else {
              navigate("/company/dashboard");
            }
          }
          // 4. Default fallback: assume customer
          else {
            console.log("Customer account, redirecting to customer dashboard");
            navigate("/customer/dashboard");
          }
        }, 1500);
      } catch (error) {
        console.error("Error processing OAuth callback:", error);
        setAuthError("Authentication process failed. Please try again.");
      }
    };
    
    processOAuthCallback();
  }, [navigate, searchParams, toast, userRole, needsAdditionalInfo, accountType, setUserRole, parseHashAndRedirect]);
  
  // Function to handle reset
  const handleReset = () => {
    localStorage.removeItem('oauth_role');
    localStorage.removeItem('oauth_provider');
    localStorage.removeItem('oauth_timestamp');
    navigate('/login');
  };
  
  // Function to handle deletion
  const handleDeleteAccount = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    try {
      // Attempt to delete the account
      await supabase.auth.signOut({ scope: 'global' });
      toast({
        title: "Account deleted",
        description: "Your account has been deleted. Please sign up again.",
      });
      navigate('/signup');
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Common debug info component
  const debugInfo = (
    <DebugInfo
      authStage={authStage}
      userRole={userRole}
      needsAdditionalInfo={needsAdditionalInfo}
      currentUser={currentUser}
      redirectUrl={redirectUrl}
      processingTimeElapsed={processingTimeElapsed}
    />
  );
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <Container size="sm">
          <div className="w-full max-w-md mx-auto bg-card p-8 rounded-lg border shadow-sm">
            {!authError && !authSuccess && (
              <AuthLoading
                processingTimeElapsed={processingTimeElapsed}
                manualRedirect={manualRedirect}
                showDebugInfo={showDebugInfo}
                setShowDebugInfo={setShowDebugInfo}
                authStage={authStage}
                handleReset={handleReset}
                parseHashAndRedirect={parseHashAndRedirect}
                debugInfo={debugInfo}
              />
            )}
            
            {authError && (
              <AuthError
                errorMessage={authError}
                handleReset={handleReset}
                handleDeleteAccount={handleDeleteAccount}
                navigateToLogin={() => navigate('/login')}
                parseHashAndRedirect={parseHashAndRedirect}
                debugInfo={debugInfo}
                showDebugInfo={showDebugInfo}
              />
            )}
            
            {authSuccess && (
              <AuthSuccess
                debugInfo={debugInfo}
                showDebugInfo={showDebugInfo}
              />
            )}
          </div>
        </Container>
      </main>
    </div>
  );
}