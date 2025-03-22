import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { 
  supabase, 
  handleOAuthSignIn, 
  getUserProfile, 
  processAccessToken,
  hasCompleteProfile,
  forceSignOut,
  deleteUserAccount
} from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Container } from "@/components/ui/Container";
import { CompanyProfileForm, CustomerProfileForm } from "@/components/auth/ProfileForms";
import { DebugInfo, AuthLoading, AuthError, AuthSuccess } from "@/components/auth/AuthCallbackUtils";

export default function AuthCallback() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [needsAdditionalInfo, setNeedsAdditionalInfo] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'customer' | 'company'>('customer');
  const [authStage, setAuthStage] = useState<string>('initializing');
  const [processingTimeElapsed, setProcessingTimeElapsed] = useState(0);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [manualRedirect, setManualRedirect] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string>('');

  const debugInfoComponent = (
    <DebugInfo 
      authStage={authStage}
      userRole={userRole}
      needsAdditionalInfo={needsAdditionalInfo}
      currentUser={currentUser}
      redirectUrl={redirectUrl}
      processingTimeElapsed={processingTimeElapsed}
    />
  );

  const handleReset = async () => {
    setIsProcessing(true);
    setErrorMessage("Resetting authentication state...");
    try {
      await forceSignOut();
      toast({
        title: "Authentication reset",
        description: "All authentication data has been cleared.",
      });
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during reset:", error);
      setIsProcessing(false);
      setErrorMessage("Failed to reset authentication. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    setIsProcessing(true);
    setErrorMessage("Deleting account and resetting authentication state...");
    try {
      let userId = null;
      
      if (window.location.hash && window.location.hash.includes('access_token')) {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        
        if (accessToken) {
          try {
            const { data, error } = await supabase.auth.getUser(accessToken);
            if (!error && data.user) {
              userId = data.user.id;
            }
          } catch (e) {
            console.error("Error getting user from token:", e);
          }
        }
      }
      
      if (!userId) {
        const { data } = await supabase.auth.getSession();
        if (data.session && data.session.user) {
          userId = data.session.user.id;
        }
      }
      
      if (userId) {
        await deleteUserAccount(userId);
        toast({
          title: "Account deleted",
          description: "Your account has been deleted. You can now sign up again.",
        });
      } else {
        toast({
          title: "Account deletion skipped",
          description: "Could not identify your account. Auth state has been reset.",
        });
      }
      
      await forceSignOut();
      
      window.location.href = "/login";
    } catch (error: any) {
      console.error("Error during account deletion:", error);
      setIsProcessing(false);
      setErrorMessage(`Failed to delete account: ${error.message}`);
      toast({
        title: "Error",
        description: "Failed to delete account. " + error.message,
        variant: "destructive",
      });
    }
  };

  const parseHashAndRedirect = () => {
    setManualRedirect(true);
    
    try {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const expiresIn = params.get('expires_in');
      const tokenType = params.get('token_type');
      
      if (!accessToken) {
        throw new Error("No access token found in URL");
      }
      
      console.log("Found access token, attempting manual login");
      
      localStorage.setItem('supabase_manual_token', JSON.stringify({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn,
        token_type: tokenType,
        timestamp: Date.now()
      }));
      
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      
      setTimeout(() => {
        window.location.href = "/auth/manual-login";
      }, 500);
      
    } catch (error) {
      console.error("Error parsing hash for manual redirect:", error);
      setErrorMessage("Failed to process authentication data. Please try logging in again.");
      setIsProcessing(false);
    }
  };

  const handleHashFragment = useCallback(async () => {
    setAuthStage('processing_hash');
    console.log("Processing hash fragment:", window.location.hash);
    
    try {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      
      if (!accessToken) {
        console.error("No access token found in hash");
        throw new Error("Authentication failed: No access token found");
      }
      
      console.log("Access token found in hash, setting session");
      
      let session: Session;
      try {
        session = await Promise.race([
          processAccessToken(accessToken, refreshToken),
          new Promise<never>((_, reject) => 
            setTimeout(() => {
              console.log("Session setup timed out, attempting manual redirect");
              reject(new Error("Session setup timed out after 5 seconds"))
            }, 5000)
          )
        ]);
      } catch (error) {
        console.error("Timeout or error in processAccessToken:", error);
        parseHashAndRedirect();
        return;
      }
      
      console.log("Successfully set session, clearing hash");
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      
      setAuthStage('session_established');
      
      if (!session || !session.user) {
        throw new Error("Invalid session after processing token");
      }
      
      const user = session.user;
      setCurrentUser(user);
      console.log("User set from hash token:", user.id);
      
      const urlParams = new URLSearchParams(window.location.search);
      const role = urlParams.get('role') === 'company' ? 'company' : 
                  localStorage.getItem('oauth_role') === 'company' ? 'company' : 'customer';
      
      setUserRole(role);
      console.log("User role determined:", role);
      
      return await processUserProfile(user, role);
    } catch (error: any) {
      console.error("Error processing hash fragment:", error);
      throw error;
    }
  }, []);

  const processUserProfile = async (user: User, role: string) => {
    setAuthStage('processing_profile');
    console.log(`Processing profile for user ${user.id} with role ${role}`);
    
    try {
      const isProfileComplete = await hasCompleteProfile(user, role as 'customer' | 'company');
      
      if (!isProfileComplete) {
        console.log("Profile incomplete, creating or updating basic profile");
        await handleOAuthSignIn(user, role as 'customer' | 'company');
        setNeedsAdditionalInfo(true);
        setIsProcessing(false);
        return false;
      }
      
      console.log("Complete profile found, redirecting");
      toast({
        title: "Authentication successful",
        description: "You have been successfully logged in.",
      });

      const profile = await getUserProfile(user.id);
      if (profile?.role === "company") {
        console.log("Redirecting company user to dashboard");
        navigate("/dashboard");
      } else {
        console.log("Redirecting customer user to profile dashboard");
        navigate("/profile");
      }
      return true;
    } catch (error) {
      console.error("Error processing user profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    setRedirectUrl(currentUrl);
    console.log("Current URL:", currentUrl);
    console.log("Location origin:", window.location.origin);
    console.log("Location pathname:", window.location.pathname);
    console.log("Location search:", window.location.search);
    console.log("Location hash:", window.location.hash);
    
    console.log("OAuth role from localStorage:", localStorage.getItem('oauth_role'));
    console.log("OAuth provider from localStorage:", localStorage.getItem('oauth_provider'));
    console.log("OAuth timestamp from localStorage:", localStorage.getItem('oauth_timestamp'));
  }, []);

  useEffect(() => {
    if (isProcessing && authStage === 'processing_hash') {
      const timer = setInterval(() => {
        setProcessingTimeElapsed(prev => {
          if (prev >= 15 && !showDebugInfo) {
            setShowDebugInfo(true);
          }
          return prev + 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isProcessing, authStage, showDebugInfo]);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback started");
        setIsProcessing(true);
        setAuthStage('started');
        
        // First, check if we have a hash fragment with an access token
        if (window.location.hash && window.location.hash.includes('access_token')) {
          try {
            await Promise.race([
              handleHashFragment(),
              new Promise((_, reject) => 
                setTimeout(() => {
                  console.log("Authentication process timed out, switching to manual mode");
                  parseHashAndRedirect();
                  reject(new Error("Authentication process timed out, switching to manual mode"));
                }, 8000) // Reduced timeout from 15s to 8s for faster fallback
              )
            ]);
          } catch (error: any) {
            if (!error.message.includes("switching to manual mode")) {
              console.error("Timeout or error in hash processing:", error);
              setErrorMessage(`Authentication failed: ${error.message}`);
              setIsProcessing(false);
            }
            return;
          }
          return;
        }
        
        // If no hash fragment, try to get the session normally
        console.log("No hash fragment, getting session from supabase");
        setAuthStage('checking_session');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }
        
        if (data.session) {
          const user = data.session.user;
          setCurrentUser(user);
          console.log("User set from session:", user.id);
          
          const urlParams = new URLSearchParams(window.location.search);
          const role = urlParams.get('role') === 'company' ? 'company' : 'customer';
          setUserRole(role);
          
          await processUserProfile(user, role);
        } else {
          console.log("No session found");
          setErrorMessage("Authentication failed. No session was created.");
          toast({
            title: "Authentication failed",
            description: "Please try logging in again.",
            variant: "destructive",
          });
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (error: any) {
        console.error("Error in auth callback:", error);
        setErrorMessage(error.message || "There was a problem with the authentication process.");
        toast({
          title: "Authentication error",
          description: error.message || "There was a problem with the authentication process.",
          variant: "destructive",
        });
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, toast, handleHashFragment]);

  if (needsAdditionalInfo && currentUser) {
    return (
      <div className="min-h-screen bg-background py-12">
        <Container size="sm">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Complete Your {userRole === 'company' ? 'Company' : ''} Profile</CardTitle>
              <CardDescription>
                Please provide the following information to complete your sign up
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userRole === 'company' ? (
                <CompanyProfileForm 
                  currentUser={currentUser} 
                  isProcessing={isProcessing} 
                  setIsProcessing={setIsProcessing} 
                />
              ) : (
                <CustomerProfileForm 
                  currentUser={currentUser} 
                  isProcessing={isProcessing} 
                  setIsProcessing={setIsProcessing} 
                />
              )}
            </CardContent>
            {import.meta.env.DEV && <CardFooter>{debugInfoComponent}</CardFooter>}
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md p-8 rounded-lg shadow-sm border bg-card">
        {isProcessing ? (
          <AuthLoading 
            processingTimeElapsed={processingTimeElapsed}
            manualRedirect={manualRedirect}
            showDebugInfo={showDebugInfo}
            setShowDebugInfo={setShowDebugInfo}
            authStage={authStage}
            handleReset={handleReset}
            parseHashAndRedirect={parseHashAndRedirect}
            debugInfo={debugInfoComponent}
          />
        ) : errorMessage ? (
          <AuthError 
            errorMessage={errorMessage}
            handleReset={handleReset}
            handleDeleteAccount={handleDeleteAccount}
            navigateToLogin={() => navigate("/login")}
            parseHashAndRedirect={parseHashAndRedirect}
            debugInfo={debugInfoComponent}
            showDebugInfo={showDebugInfo || import.meta.env.DEV}
          />
        ) : (
          <AuthSuccess 
            debugInfo={debugInfoComponent} 
            showDebugInfo={showDebugInfo || import.meta.env.DEV} 
          />
        )}
      </div>
    </div>
  );
}
