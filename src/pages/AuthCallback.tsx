import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Container } from "@/components/ui/Container";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Session } from "@supabase/supabase-js";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Trash } from "lucide-react";

const companyFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  phone: z.string().optional(),
  industry: z.string().min(1, "Please select an industry"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  integrations: z.array(z.string()).optional(),
});

const customerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;
type CustomerFormValues = z.infer<typeof customerFormSchema>;

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Hospitality",
  "Construction",
  "Real Estate",
  "Other",
];

const integrationOptions = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "facebook", label: "Facebook Messenger" },
  { id: "instagram", label: "Instagram DM" },
  { id: "email", label: "Email" },
];

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

  const companyForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: "",
      phone: "",
      industry: "",
      website: "",
      integrations: [],
    },
  });

  const customerForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleCompanySubmit = async (values: CompanyFormValues) => {
    if (!currentUser) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: values.companyName,
          phone: values.phone || undefined,
          industry: values.industry,
          website: values.website || undefined,
          integrations: values.integrations,
          role: 'company',
        })
        .eq('id', currentUser.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your company account has been set up successfully.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomerSubmit = async (values: CustomerFormValues) => {
    if (!currentUser) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: values.name,
          role: 'customer',
        })
        .eq('id', currentUser.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your account has been set up successfully.",
      });
      
      navigate("/enquiries");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

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
      
      window.location.href = "/auth/manual-login";
      
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
            setTimeout(() => reject(new Error("Session setup timed out after 20 seconds")), 20000)
          )
        ]);
      } catch (error) {
        console.error("Timeout or error in processAccessToken:", error);
        throw error;
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
        navigate("/dashboard");
      } else {
        navigate("/enquiries");
      }
      return true;
    } catch (error) {
      console.error("Error processing user profile:", error);
      throw error;
    }
  };

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
        
        if (window.location.hash && window.location.hash.includes('access_token')) {
          try {
            await Promise.race([
              handleHashFragment(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Authentication process timed out after 30 seconds")), 30000)
              )
            ]);
          } catch (error: any) {
            console.error("Timeout or error in hash processing:", error);
            setErrorMessage(`Authentication failed: ${error.message}`);
            setIsProcessing(false);
            return;
          }
          return;
        }
        
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

  const DebugInfo = () => (
    <div className="mt-4 p-4 bg-slate-100 rounded-md text-xs text-slate-700">
      <p><strong>Auth Stage:</strong> {authStage}</p>
      <p><strong>Role:</strong> {userRole}</p>
      <p><strong>Needs Additional Info:</strong> {needsAdditionalInfo ? 'Yes' : 'No'}</p>
      <p><strong>Has URL Hash:</strong> {window.location.hash ? 'Yes' : 'No'}</p>
      <p><strong>User ID:</strong> {currentUser?.id || 'None'}</p>
      <p><strong>URL:</strong> {window.location.href}</p>
      <p><strong>Processing Time:</strong> {processingTimeElapsed} seconds</p>
      <p><strong>localStorage:</strong></p>
      <pre className="mt-1 p-2 bg-slate-200 rounded text-xs overflow-x-auto">
        {JSON.stringify(
          Object.keys(localStorage).reduce((acc, key) => {
            if (key.startsWith('supabase.') || key.startsWith('sb-') || key.startsWith('oauth_')) {
              acc[key] = localStorage.getItem(key);
            }
            return acc;
          }, {} as Record<string, string | null>),
          null,
          2
        )}
      </pre>
    </div>
  );

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
                <Form {...companyForm}>
                  <form onSubmit={companyForm.handleSubmit(handleCompanySubmit)} className="space-y-4">
                    <FormField
                      control={companyForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={companyForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={companyForm.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={companyForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Website (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://your-company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={companyForm.control}
                      name="integrations"
                      render={() => (
                        <FormItem>
                          <div className="mb-2">
                            <FormLabel>Messaging Integrations (Optional)</FormLabel>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {integrationOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={companyForm.control}
                                name="integrations"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value || [], option.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== option.id
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isProcessing}>
                      {isProcessing ? "Processing..." : "Complete Sign Up"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...customerForm}>
                  <form onSubmit={customerForm.handleSubmit(handleCustomerSubmit)} className="space-y-4">
                    <FormField
                      control={customerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isProcessing}>
                      {isProcessing ? "Processing..." : "Complete Sign Up"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
            {import.meta.env.DEV && <CardFooter><DebugInfo /></CardFooter>}
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md p-8 rounded-lg shadow-sm border bg-card">
        {isProcessing ? (
          <>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Completing authentication...</h2>
            <p className="text-muted-foreground mb-2">Please wait while we log you in.</p>
            <p className="text-sm text-muted-foreground">Auth stage: {authStage}</p>
            
            {processingTimeElapsed > 8 && !manualRedirect && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Taking longer than expected</AlertTitle>
                <AlertDescription>
                  Authentication is taking longer than usual. 
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2" 
                    onClick={() => setShowDebugInfo(!showDebugInfo)}
                  >
                    {showDebugInfo ? "Hide Details" : "Show Details"}
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            {processingTimeElapsed > 12 && !manualRedirect && (
              <div className="mt-4 flex flex-col gap-2">
                <Button 
                  variant="secondary" 
                  onClick={handleReset}
                  className="flex items-center"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset & Try Again
                </Button>
                
                <Button
                  variant="outline"
                  onClick={parseHashAndRedirect}
                  className="flex items-center"
                >
                  Try Manual Login
                </Button>
              </div>
            )}
            
            {(showDebugInfo || import.meta.env.DEV) && <DebugInfo />}
          </>
        ) : errorMessage ? (
          <>
            <div className="w-16 h-16 mx-auto mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-destructive">Authentication Failed</h2>
            <p className="text-muted-foreground mb-4">{errorMessage}</p>
            <div className="flex flex-col gap-2">
              <Button 
                variant="default" 
                className="w-full"
                onClick={handleReset}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset & Try Again
              </Button>
              
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleDeleteAccount}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Account & Try Again
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/login")}
              >
                Return to Login
              </Button>
              
              {window.location.hash && window.location.hash.includes('access_token') && (
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={parseHashAndRedirect}
                >
                  Try Manual Login
                </Button>
              )}
            </div>
            {(showDebugInfo || import.meta.env.DEV) && <DebugInfo />}
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-4 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-primary">Authentication Successful</h2>
            <p className="text-muted-foreground mb-4">You've been successfully authenticated.</p>
            <p className="text-sm text-muted-foreground">Redirecting you to your dashboard...</p>
            {(showDebugInfo || import.meta.env.DEV) && <DebugInfo />}
          </>
        )}
      </div>
    </div>
  );
}
