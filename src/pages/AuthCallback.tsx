import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase, processAccessToken, handleOAuthSignIn, createUserProfile, UserRole } from "@/lib/supabase";
import { Container } from "@/components/ui/Container";
import { useToast } from "@/hooks/use-toast";
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
        
        // IMPORTANT: Check user metadata for role if coming from email confirmation
        let roleFromMetadata = null;
        if (data.session.user.user_metadata && data.session.user.user_metadata.role) {
          roleFromMetadata = data.session.user.user_metadata.role;
          console.log("Found role in user metadata:", roleFromMetadata);
        }
        
        // Check account_type parameter for explicit redirection handling
        const accountTypeParam = searchParams.get('account_type');
        if (accountTypeParam) {
          console.log("Found account_type in URL params:", accountTypeParam);
        }
        
        // Create a profile if it doesn't exist already
        try {
          setAuthStage("creating_profile");
          
          // Check if a profile exists first
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = not found
            console.error("Error checking profile:", profileError);
            throw profileError;
          }
          
          let userRoleToUse = roleFromMetadata || userRole;
          console.log("Using role for profile creation:", userRoleToUse);
          
          if (!profileData) {
            // Create a new profile record
            const newProfileData: Record<string, any> = {
              id: data.session.user.id,
              email: data.session.user.email || '',
              name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || '',
              role: userRoleToUse, // Use role from metadata if available
              created_at: new Date().toISOString()
            };
            
            // Add company-specific fields if applicable
            if (userRoleToUse === 'company') {
              newProfileData.company_name = data.session.user.user_metadata?.company_name || '';
              if (data.session.user.user_metadata?.industry) {
                newProfileData.industry = data.session.user.user_metadata.industry;
              }
              if (data.session.user.user_metadata?.website) {
                newProfileData.website = data.session.user.user_metadata.website;
              }
              if (data.session.user.user_metadata?.phone) {
                newProfileData.phone = data.session.user.user_metadata.phone;
              }
            }
            
            console.log("Creating new profile with data:", newProfileData);
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert(newProfileData);
              
            if (insertError) {
              console.error("Error creating profile:", insertError);
              throw insertError;
            }
            
            console.log("Profile created successfully with role:", userRoleToUse);
          } else {
            console.log("Existing profile found with role:", profileData.role);
            userRoleToUse = profileData.role; // Use existing profile role
          }
        } catch (profileCreateError) {
          console.error("Error handling profile creation:", profileCreateError);
          setAuthError("Failed to set up your user profile. Please try again.");
          return;
        }
        
        setAuthStage("authentication_complete");
        setAuthSuccess(true);
        
        // Clean up the OAuth data
        localStorage.removeItem('oauth_role');
        localStorage.removeItem('oauth_provider');
        localStorage.removeItem('oauth_timestamp');
        
        // Determine if this was an email confirmation or OAuth callback
        const isEmailConfirmation = !searchParams.get('provider') && searchParams.get('role');
        
        if (isEmailConfirmation) {
          toast({
            title: "Email verified",
            description: `Your account has been successfully verified!`,
          });
        } else {
          toast({
            title: "Login successful",
            description: `Welcome back!`,
          });
        }
        
        // IMPORTANT: Improved redirect logic that prioritizes different sources of role information
        setTimeout(() => {
          // 1. First priority: accountType from URL (most explicit)
          if (accountType === 'company') {
            console.log("Company account confirmed, redirecting to company dashboard");
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
  }, [navigate, searchParams, toast, userRole, needsAdditionalInfo, accountType]);
  
  // Function to parse hash and redirect
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
