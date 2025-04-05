import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Container } from "@/components/ui/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FormManagement } from "@/components/forms/FormManagement";
import { FormBuilder as FormBuilderComponent } from "@/components/forms/FormBuilder";
import { FormIntegration } from "@/components/forms/FormIntegration";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle, 
  Database, 
  Bell, 
  Search,
  Eye,
  Save
} from "lucide-react";
import { FormTemplate } from "@/lib/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { createForm, ensureFormsTableExists } from "@/lib/supabase/forms";
import { isSupabaseAvailable } from "@/lib/supabase/client";
import { useNavigate } from "react-router-dom";

const FormBuilder = () => {
  const [activeTab, setActiveTab] = useState("manage");
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [supabaseStatus, setSupabaseStatus] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDatabaseReady, setIsDatabaseReady] = useState<boolean | null>(null);
  const [setupAttempted, setSetupAttempted] = useState(false);
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);

  // Check if in preview mode to bypass auth
  const isPreviewMode = window.location.hostname.includes('preview') || 
                        window.location.hostname.includes('lovable.app');
  const isDevelopment = import.meta.env.DEV;
  const bypassAuth = (isDevelopment && process.env.NODE_ENV !== 'production') || isPreviewMode;

  useEffect(() => {
    console.log("FormBuilder component mounted");
    console.log("Current user:", user);
    console.log("User profile:", profile);
    console.log("Preview mode:", isPreviewMode);
    console.log("Development mode:", isDevelopment);
    console.log("Bypassing auth:", bypassAuth);
    
    // Skip authentication check if in preview mode
    if (!bypassAuth && !user && !profile) {
      console.warn("No authenticated user found");
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to access the form builder.",
        variant: "destructive"
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }
    
    // Check Supabase connection status
    const checkSupabaseStatus = async () => {
      try {
        const isAvailable = await isSupabaseAvailable();
        console.log("Supabase availability check result:", isAvailable);
        setSupabaseStatus(isAvailable);
        
        if (isAvailable) {
          // Try to ensure the forms table exists
          try {
            await ensureFormsTableExists();
            setIsDatabaseReady(true);
            console.log("Database tables are ready");
          } catch (error) {
            console.error("Error checking/creating database tables:", error);
            setIsDatabaseReady(false);
            
            // Only show toast for database table errors if user is authenticated
            if ((user || profile) && !bypassAuth) {
              toast({
                title: "Database Setup Issue",
                description: "We're having trouble setting up the required database tables. Form functionality may be limited.",
                variant: "destructive"
              });
            }
          }
        } else {
          setIsDatabaseReady(false);
          if (!bypassAuth) {
            toast({
              title: "Connection Issue",
              description: "We're having trouble connecting to the database. Form saving will not work.",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error("Error checking Supabase status:", error);
        setSupabaseStatus(false);
        setIsDatabaseReady(false);
      }
    };
    
    checkSupabaseStatus();
  }, [user, profile, toast, navigate, bypassAuth, isPreviewMode, isDevelopment]);

  // Function to attempt database setup
  const attemptDatabaseSetup = async () => {
    setSetupAttempted(true);
    setIsLoading(true);
    
    try {
      await ensureFormsTableExists();
      setIsDatabaseReady(true);
      toast({
        title: "Database Setup Complete",
        description: "The necessary database tables have been created successfully.",
      });
    } catch (error) {
      console.error("Failed to set up database tables:", error);
      toast({
        title: "Database Setup Failed",
        description: error instanceof Error ? error.message : "Could not create the required database tables.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Empty form template for creating a new form
  const getEmptyForm = (): FormTemplate => {
    const formUserId = user?.id || profile?.id || "preview-user-id";
    console.log("Creating empty form with user ID:", formUserId);
    
    return {
      id: `temp-${Date.now()}`,
      name: "New Form",
      description: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      fields: [],
      branding: {
        primaryColor: "#0070f3",
        fontFamily: "Inter",
      },
      company_id: formUserId,
      is_public: false
    };
  };

  // Event handler to create a new form
  const handleCreateForm = () => {
    const creatorId = user?.id || profile?.id || (bypassAuth ? "preview-user-id" : undefined);
    if (!creatorId) {
      console.error("Cannot create form: No user ID available");
      toast({
        title: "Error",
        description: "You must be logged in to create a form",
        variant: "destructive"
      });
      return;
    }
    
    if (!supabaseStatus && !bypassAuth) {
      toast({
        title: "Database Connection Issue",
        description: "Cannot create a form while offline. Please check your connection and try again.",
        variant: "destructive"
      });
      return;
    }
    
    const newForm = getEmptyForm();
    console.log("Creating new form template with user ID:", creatorId);
    setSelectedForm(newForm);
    setActiveTab("create");
  };

  // Event handlers for form operations
  const handleSaveForm = async (form: FormTemplate) => {
    try {
      setIsLoading(true);
      const saveUserId = user?.id || profile?.id || (bypassAuth ? "preview-user-id" : undefined);
      
      console.log("Save form initiated with user details:");
      console.log("User ID from state:", saveUserId);
      console.log("User from context:", user);
      console.log("Profile from context:", profile);
      console.log("Bypassing auth:", bypassAuth);
      
      if (!saveUserId) {
        console.error("No user ID available");
        toast({
          title: "Error",
          description: "You need to be logged in to save forms",
          variant: "destructive"
        });
        return;
      }
      
      if (!supabaseStatus && !bypassAuth) {
        toast({
          title: "Database Connection Issue",
          description: "Cannot save the form while offline. Please check your connection and try again.",
          variant: "destructive"
        });
        return;
      }
      
      // In preview mode, just simulate success but don't actually save
      if (bypassAuth) {
        console.log("Preview mode: Simulating form save success");
        setTimeout(() => {
          toast({
            title: "Preview Mode",
            description: "In preview mode, forms are not actually saved to the database.",
          });
          setSelectedForm(null);
          setActiveTab("manage");
          setIsLoading(false);
        }, 1000);
        return;
      }
      
      // Try to ensure the database is ready before saving
      if (!isDatabaseReady) {
        try {
          await ensureFormsTableExists();
          setIsDatabaseReady(true);
        } catch (error) {
          console.error("Error creating tables before save:", error);
          toast({
            title: "Database Setup Issue",
            description: "Could not set up the required database tables. Please try again.",
            variant: "destructive"
          });
          return;
        }
      }
      
      console.log("Saving form. User ID:", saveUserId);
      console.log("Original form to save:", form);
      
      // Create a new object with the correct company_id
      const formToSave: FormTemplate = {
        ...form,
        company_id: saveUserId,
        // Ensure other required fields are present
        branding: form.branding || {
          primaryColor: "#0070f3",
          fontFamily: "Inter"
        },
        fields: Array.isArray(form.fields) ? form.fields : [],
        created_at: form.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log("Processed form to save:", formToSave);
      
      // If it's a new form (id starts with "form-" or "temp-"), create it
      if (formToSave.id.startsWith('form-') || formToSave.id.startsWith('temp-')) {
        console.log("Creating new form (temporary ID detected):", formToSave.id);
        const savedForm = await createForm(formToSave);
        console.log("Form saved successfully:", savedForm);
        
        toast({
          title: "Form Saved",
          description: "Your form has been created successfully.",
        });
      } else {
        // Update existing form handled by FormManagement component
        console.log("This would be an update to an existing form:", formToSave.id);
        toast({
          title: "Form Updated",
          description: "Your existing form would be updated here. Currently using FormManagement for updates.",
        });
      }
      
      // Reset form state and return to management view
      setSelectedForm(null);
      setActiveTab("manage");
    } catch (error: any) {
      console.error("Error saving form:", error);
      
      // Special handling for "relation does not exist" errors
      if (error.message && error.message.includes("relation") && error.message.includes("does not exist")) {
        toast({
          title: "Database Table Missing",
          description: "The forms table doesn't exist yet. Click 'Setup Database' to create it.",
          variant: "destructive"
        });
        setIsDatabaseReady(false);
      } else {
        toast({
          title: "Error Saving Form",
          description: error.message || "An error occurred while saving the form",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelForm = () => {
    setSelectedForm(null);
    setActiveTab("manage");
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Form Builder</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Form
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="pt-8 pb-4 px-4 sm:px-6">
            <Container>
              {!bypassAuth && !user && !profile && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Authentication Required</AlertTitle>
                  <AlertDescription>
                    You need to be logged in to create and manage forms.
                  </AlertDescription>
                </Alert>
              )}
              
              {bypassAuth && (
                <Alert className="mb-6">
                  <AlertTitle>Preview Mode</AlertTitle>
                  <AlertDescription>
                    You are viewing the Form Builder in preview mode. Saving forms will be simulated but not actually saved to the database.
                  </AlertDescription>
                </Alert>
              )}
              
              {!supabaseStatus && !bypassAuth && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Database Connection Issue</AlertTitle>
                  <AlertDescription>
                    There's a problem connecting to the database. Form saving will not work until this is resolved.
                  </AlertDescription>
                </Alert>
              )}
              
              {isDatabaseReady === false && !bypassAuth && (
                <Alert variant="destructive" className="mb-6">
                  <Database className="h-4 w-4" />
                  <AlertTitle>Database Setup Required</AlertTitle>
                  <AlertDescription className="flex flex-col gap-2">
                    <p>The required database tables for forms don't exist yet. This happens when you're using forms for the first time.</p>
                    <Button 
                      onClick={attemptDatabaseSetup} 
                      className="w-fit" 
                      disabled={isLoading || setupAttempted}
                    >
                      {isLoading ? "Setting up..." : setupAttempted ? "Setup Attempted" : "Setup Database Tables"}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-1">Form Builder</h2>
                <p className="text-muted-foreground">Create and manage custom forms for your business</p>
              </div>
              
              <Tabs defaultValue="manage" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="manage">Manage Forms</TabsTrigger>
                  <TabsTrigger value="create">Create Form</TabsTrigger>
                  <TabsTrigger value="integrate">Integration</TabsTrigger>
                </TabsList>
                
                <TabsContent value="manage">
                  <FormManagement 
                    onCreateNew={handleCreateForm} 
                    userId={user?.id || profile?.id || (bypassAuth ? "preview-user-id" : undefined)}
                  />
                </TabsContent>
                
                <TabsContent value="create">
                  {selectedForm ? (
                    <FormBuilderComponent 
                      form={selectedForm} 
                      onSave={handleSaveForm} 
                      onCancel={handleCancelForm}
                      isProcessing={isLoading}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <p>Please create a new form from the Manage Forms tab</p>
                      <Button 
                        className="mt-4" 
                        onClick={() => setActiveTab("manage")}
                      >
                        Go to Manage Forms
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="integrate">
                  {selectedForm ? (
                    <FormIntegration 
                      form={selectedForm} 
                      onClose={() => {
                        setSelectedForm(null);
                        setActiveTab("manage");
                      }} 
                    />
                  ) : (
                    <div className="text-center py-12">
                      <p>Please select a form from the Manage Forms tab to see integration options</p>
                      <Button 
                        className="mt-4" 
                        onClick={() => setActiveTab("manage")}
                      >
                        Go to Manage Forms
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Container>
          </div>
        </main>
      </div>
    </AppLayout>
  );
};

export default FormBuilder;
