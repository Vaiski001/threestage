
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Container } from "@/components/ui/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { FormManagement } from "@/components/forms/FormManagement";
import { FormBuilder as FormBuilderComponent } from "@/components/forms/FormBuilder";
import { FormIntegration } from "@/components/forms/FormIntegration";
import { Bell, Search } from "lucide-react";
import { FormTemplate } from "@/lib/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { createForm } from "@/lib/supabase/forms";
import { isSupabaseAvailable } from "@/lib/supabase/client";

const FormBuilder = () => {
  const [activeTab, setActiveTab] = useState("manage");
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [supabaseStatus, setSupabaseStatus] = useState<boolean>(true);

  useEffect(() => {
    console.log("FormBuilder component mounted, current user:", user);
    console.log("User profile:", profile);
    
    // Check Supabase connection status
    const checkSupabaseStatus = async () => {
      try {
        const isAvailable = await isSupabaseAvailable();
        setSupabaseStatus(isAvailable);
        if (!isAvailable) {
          toast({
            title: "Connection Issue",
            description: "We're having trouble connecting to the database. Some features may be limited.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error checking Supabase status:", error);
        setSupabaseStatus(false);
      }
    };
    
    checkSupabaseStatus();
  }, [user, profile, toast]);

  // Empty form template for creating a new form
  const getEmptyForm = (): FormTemplate => {
    const userId = user?.id || profile?.id || "";
    console.log("Creating empty form with user ID:", userId);
    
    return {
      id: `form-${Date.now()}`,
      name: "New Form",
      description: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      fields: [],
      branding: {
        primaryColor: "#0070f3",
        fontFamily: "Inter",
      },
      company_id: userId,
      is_public: false
    };
  };

  // Event handler to create a new form
  const handleCreateForm = () => {
    const userId = user?.id || profile?.id;
    if (!userId) {
      console.error("Cannot create form: No user ID available");
      toast({
        title: "Error",
        description: "You must be logged in to create a form",
        variant: "destructive"
      });
      return;
    }
    
    if (!supabaseStatus) {
      toast({
        title: "Database Connection Issue",
        description: "Cannot create a form while offline. Please check your connection and try again.",
        variant: "destructive"
      });
      return;
    }
    
    const newForm = getEmptyForm();
    console.log("Creating new form template with user ID:", userId);
    setSelectedForm(newForm);
    setActiveTab("create");
  };

  // Event handlers for form operations
  const handleSaveForm = async (form: FormTemplate) => {
    try {
      const userId = user?.id || profile?.id;
      if (!userId) {
        console.error("No user ID available");
        toast({
          title: "Error",
          description: "You need to be logged in to save forms",
          variant: "destructive"
        });
        return;
      }
      
      if (!supabaseStatus) {
        toast({
          title: "Database Connection Issue",
          description: "Cannot save the form while offline. Please check your connection and try again.",
          variant: "destructive"
        });
        return;
      }
      
      console.log("Saving form. User ID:", userId);
      
      // Create a new object to ensure we don't modify the original form
      const formToSave: FormTemplate = {
        ...form,
        company_id: userId
      };
      
      console.log("Form to save:", formToSave);
      
      // If it's a new form (id starts with "form-"), create it
      if (formToSave.id.startsWith('form-')) {
        console.log("Creating new form (temporary ID detected)");
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
      toast({
        title: "Error Saving Form",
        description: error.message || "An error occurred while saving the form",
        variant: "destructive"
      });
    }
  };

  const handleCancelForm = () => {
    setSelectedForm(null);
    setActiveTab("manage");
  };

  return (
    <AppLayout>
      <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="relative hidden sm:block">
            <Search className="h-4 w-4 absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search forms..."
              className="w-64 pl-10 pr-4 py-2 text-sm rounded-md bg-secondary/50 focus:bg-secondary border-0 focus:ring-1 focus:ring-primary/30 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="pt-8 pb-4 px-4 sm:px-6">
          <Container>
            <div className="mb-6">
              <h1 className="text-2xl font-semibold mb-1">Form Builder</h1>
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
                />
              </TabsContent>
              
              <TabsContent value="create">
                {selectedForm ? (
                  <FormBuilderComponent 
                    form={selectedForm} 
                    onSave={handleSaveForm} 
                    onCancel={handleCancelForm} 
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
    </AppLayout>
  );
};

export default FormBuilder;
