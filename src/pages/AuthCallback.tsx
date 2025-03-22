import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, handleOAuthSignIn, getUserProfile } from "@/lib/supabase";
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
import { User } from "@supabase/supabase-js";

// Schema for the additional info form for companies
const companyFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  phone: z.string().optional(),
  industry: z.string().min(1, "Please select an industry"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  integrations: z.array(z.string()).optional(),
});

// Schema for the additional info form for customers
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

  // Company form setup
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

  // Customer form setup
  const customerForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
    },
  });

  // Handle company form submission
  const handleCompanySubmit = async (values: CompanyFormValues) => {
    if (!currentUser) return;
    
    setIsProcessing(true);
    try {
      // Update the user's profile with the additional info
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

  // Handle customer form submission
  const handleCustomerSubmit = async (values: CustomerFormValues) => {
    if (!currentUser) return;
    
    setIsProcessing(true);
    try {
      // Update the user's profile with the additional info
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

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback started");
        setIsProcessing(true);
        
        // Get role from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get('role') === 'company' ? 'company' : 'customer';
        setUserRole(role);
        console.log(`User role from URL: ${role}`);
        
        // Check if we have hash fragments from OAuth provider
        if (window.location.hash) {
          console.log("Hash fragment detected", window.location.hash);
          
          // Parse hash fragment for access token
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (accessToken) {
            console.log("Access token found in hash");
            
            // Set the session using the access token
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });
            
            if (error) {
              console.error("Error setting session:", error);
              throw error;
            }
            
            if (data.session) {
              // Clear the hash to avoid issues with reload
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
              
              const user = data.session.user;
              setCurrentUser(user);
              console.log("User set from hash token:", user.id);
              
              // Check if user has a profile
              await processUserProfile(user, role);
              return;
            }
          }
        }
        
        // No hash fragments, try to get session normally
        console.log("Getting session from supabase");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }
        
        if (data.session) {
          const user = data.session.user;
          setCurrentUser(user);
          console.log("User set from session:", user.id);
          
          // Process user profile
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
    
    // Helper function to process user profile
    const processUserProfile = async (user: User, role: string) => {
      try {
        // Check if the user has a profile
        const profile = await getUserProfile(user.id);
        
        if (!profile) {
          // No profile yet, we need to collect additional information
          console.log("No profile found, creating basic profile");
          await handleOAuthSignIn(user, role as 'customer' | 'company');
          setNeedsAdditionalInfo(true);
          setIsProcessing(false);
          return;
        } else if (!profile.name && role === 'customer') {
          // Customer profile exists but missing name
          console.log("Customer profile missing name");
          setNeedsAdditionalInfo(true);
          setIsProcessing(false);
          return;
        } else if (!profile.company_name && role === 'company') {
          // Company profile exists but missing company details
          console.log("Company profile missing company_name");
          setNeedsAdditionalInfo(true);
          setIsProcessing(false);
          return;
        }
        
        // Profile exists and has required info
        console.log("Complete profile found, redirecting");
        toast({
          title: "Authentication successful",
          description: "You have been successfully logged in.",
        });

        // Redirect based on user role
        if (profile.role === "company") {
          navigate("/dashboard");
        } else {
          navigate("/enquiries");
        }
      } catch (error) {
        console.error("Error processing user profile:", error);
        throw error;
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  // Render the additional info collection form if needed
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
          </Card>
        </Container>
      </div>
    );
  }

  // Default loading or error UI
  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md p-8 rounded-lg shadow-sm border bg-card">
        {isProcessing ? (
          <>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Completing authentication...</h2>
            <p className="text-muted-foreground">Please wait while we log you in.</p>
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
            <p className="text-sm text-muted-foreground">Redirecting you to the login page...</p>
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
          </>
        )}
      </div>
    </div>
  );
}
