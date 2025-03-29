
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getCompanyForms, 
  createForm, 
  updateForm, 
  deleteForm, 
  toggleFormActive,
  ensureFormsTableExists 
} from "@/lib/supabase/forms";
import { FormTemplate } from "@/lib/supabase/types";
import { useAuth } from "@/context/AuthContext";
import { isSupabaseAvailable } from "@/lib/supabase/client";

export function useFormManagement(userId?: string) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [supabaseAvailable, setSupabaseAvailable] = useState<boolean | null>(null);
  const [tableChecked, setTableChecked] = useState(false);
  
  // Check if in preview mode to use demo data
  const isPreviewMode = window.location.hostname.includes('preview') || 
                        window.location.hostname.includes('lovable.app');
  const isDevelopment = import.meta.env.DEV;
  const bypassAuth = (isDevelopment && process.env.NODE_ENV !== 'production') || isPreviewMode;
  
  // Get the most reliable user ID
  const effectiveUserId = userId || user?.id || profile?.id || (bypassAuth ? "preview-user-id" : "");
  
  // Check Supabase connection and table existence on mount
  useEffect(() => {
    const checkSupabase = async () => {
      try {
        // Skip Supabase checks in preview mode if requested
        if (userId === "preview-user-id" || (bypassAuth && !userId)) {
          console.log("Preview mode: Skipping Supabase connection checks");
          setSupabaseAvailable(true);
          setTableChecked(true);
          return;
        }

        const available = await isSupabaseAvailable();
        console.log("Supabase connection check:", available ? "AVAILABLE" : "NOT AVAILABLE");
        setSupabaseAvailable(available);
        
        if (available) {
          // If Supabase is available, check for the forms table
          try {
            await ensureFormsTableExists();
            setTableChecked(true);
          } catch (err) {
            console.error("Error checking/creating forms table:", err);
            // We still continue as the table might be created later
          }
        } else if (!bypassAuth) {
          toast({
            title: "Database Connection Issue",
            description: "There seems to be a problem connecting to the database. Form saving may not work properly.",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error("Error checking Supabase availability:", err);
        setSupabaseAvailable(false);
      }
    };
    
    checkSupabase();
  }, [toast, userId, bypassAuth]);
  
  // For debugging purposes
  useEffect(() => {
    console.log("useFormManagement hook initialized with:");
    console.log("- Provided userId:", userId);
    console.log("- Auth user ID:", user?.id);
    console.log("- Profile ID:", profile?.id);
    console.log("- Effective userId being used:", effectiveUserId);
    console.log("- Preview mode:", isPreviewMode);
    console.log("- Development mode:", isDevelopment);
    console.log("- Bypass auth:", bypassAuth);
    console.log("- Supabase available:", supabaseAvailable);
    console.log("- Forms table checked:", tableChecked);
  }, [userId, user?.id, profile?.id, effectiveUserId, supabaseAvailable, tableChecked, isPreviewMode, isDevelopment, bypassAuth]);

  // Sample demo forms for preview mode
  const demoForms: FormTemplate[] = [
    {
      id: "demo-form-1",
      name: "Contact Form",
      description: "A simple contact form for customer inquiries",
      company_id: "preview-user-id",
      is_public: true,
      created_at: "2023-04-15T10:00:00Z",
      updated_at: "2023-04-15T10:00:00Z",
      fields: [
        { id: "name", label: "Full Name", type: "text", required: true, placeholder: "Enter your full name" },
        { id: "email", label: "Email", type: "email", required: true, placeholder: "Enter your email" },
        { id: "message", label: "Message", type: "textarea", required: true, placeholder: "How can we help you?" }
      ],
      branding: { primaryColor: "#0070f3", fontFamily: "Inter" }
    },
    {
      id: "demo-form-2",
      name: "Service Request",
      description: "Request a service quote",
      company_id: "preview-user-id",
      is_public: false,
      created_at: "2023-05-20T14:30:00Z",
      updated_at: "2023-06-01T09:15:00Z",
      fields: [
        { id: "name", label: "Name", type: "text", required: true, placeholder: "Your name" },
        { id: "email", label: "Email", type: "email", required: true, placeholder: "Your email" },
        { id: "phone", label: "Phone", type: "tel", required: false, placeholder: "Your phone number" },
        { id: "service", label: "Service Type", type: "select", required: true, options: ["Consultation", "Installation", "Repair", "Maintenance"] },
        { id: "details", label: "Details", type: "textarea", required: false, placeholder: "Additional details about your request" }
      ],
      branding: { primaryColor: "#10b981", fontFamily: "Poppins" }
    }
  ];

  // Fetch all forms for the current company
  const { data: forms = [], isLoading } = useQuery({
    queryKey: ['forms', effectiveUserId],
    queryFn: async () => {
      if (!effectiveUserId) {
        console.log("No userId provided, returning empty forms array");
        return [];
      }
      
      // Return demo forms in preview mode
      if (effectiveUserId === "preview-user-id" || (bypassAuth && userId === "preview-user-id")) {
        console.log("Preview mode: Returning demo forms");
        return demoForms;
      }
      
      if (supabaseAvailable === false) {
        console.warn("Supabase unavailable, skipping form fetch");
        return [];
      }
      
      console.log("Fetching forms for userId:", effectiveUserId);
      try {
        return await getCompanyForms(effectiveUserId);
      } catch (error) {
        console.error("Error in query fetching forms:", error);
        toast({
          title: "Error Fetching Forms",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: !!effectiveUserId && (supabaseAvailable !== false || effectiveUserId === "preview-user-id" || bypassAuth),
  });

  // Create a new form mutation
  const createFormMutation = useMutation({
    mutationFn: (formData: Partial<FormTemplate>) => {
      // Ensure the company_id is set
      if (!effectiveUserId) {
        console.error("Error: No user ID available when creating form");
        throw new Error("User ID is required to create a form");
      }
      
      // For preview mode, just simulate success
      if (effectiveUserId === "preview-user-id" || bypassAuth) {
        console.log("Preview mode: Simulating form creation");
        return Promise.resolve({
          ...formData,
          id: `demo-form-${Date.now()}`,
          company_id: "preview-user-id",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as FormTemplate);
      }
      
      if (supabaseAvailable === false) {
        throw new Error("Cannot create form: Database connection unavailable");
      }
      
      // Always ensure company_id is set to the current user's ID
      const formWithCompanyId = { 
        ...formData,
        company_id: effectiveUserId
      };
      
      console.log("Creating form with company_id:", formWithCompanyId.company_id);
      return createForm(formWithCompanyId);
    },
    onSuccess: (data) => {
      console.log("Form created successfully, invalidating queries", data);
      queryClient.invalidateQueries({ queryKey: ['forms', effectiveUserId] });
      toast({
        title: "Form Created",
        description: "Your new form has been created successfully.",
      });
    },
    onError: (error: any) => {
      console.error("Error creating form:", error);
      toast({
        title: "Error Creating Form",
        description: error.message || "Failed to create form. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update an existing form mutation
  const updateFormMutation = useMutation({
    mutationFn: ({ formId, updates }: { formId: string; updates: Partial<FormTemplate> }) => {
      // For preview mode, just simulate success
      if (effectiveUserId === "preview-user-id" || bypassAuth) {
        console.log("Preview mode: Simulating form update");
        return Promise.resolve({
          ...updates,
          id: formId,
          company_id: "preview-user-id",
          updated_at: new Date().toISOString()
        } as FormTemplate);
      }
      
      if (supabaseAvailable === false) {
        throw new Error("Cannot update form: Database connection unavailable");
      }
      
      // Ensure the company_id is maintained
      const updatesWithCompanyId = {
        ...updates,
        company_id: effectiveUserId
      };
      return updateForm(formId, updatesWithCompanyId);
    },
    onSuccess: (data) => {
      console.log("Form updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: ['forms', effectiveUserId] });
      toast({
        title: "Form Updated",
        description: "Your form has been updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error("Error updating form:", error);
      toast({
        title: "Error Updating Form",
        description: error.message || "Failed to update form. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete a form mutation
  const deleteFormMutation = useMutation({
    mutationFn: (formId: string) => {
      // For preview mode, just simulate success
      if (effectiveUserId === "preview-user-id" || bypassAuth) {
        console.log("Preview mode: Simulating form deletion");
        return Promise.resolve(true);
      }
      
      if (supabaseAvailable === false) {
        throw new Error("Cannot delete form: Database connection unavailable");
      }
      return deleteForm(formId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms', effectiveUserId] });
      toast({
        title: "Form Deleted",
        description: "The form has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      console.error("Error deleting form:", error);
      toast({
        title: "Error Deleting Form",
        description: error.message || "Failed to delete form. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Toggle form active status mutation
  const toggleFormMutation = useMutation({
    mutationFn: ({ formId, isActive }: { formId: string; isActive: boolean }) => {
      // For preview mode, just simulate success
      if (effectiveUserId === "preview-user-id" || bypassAuth) {
        console.log("Preview mode: Simulating form toggle");
        // Find the form in our demo forms
        const demoForm = demoForms.find(f => f.id === formId);
        return Promise.resolve({
          ...demoForm,
          is_public: isActive,
          updated_at: new Date().toISOString()
        } as FormTemplate);
      }
      
      if (supabaseAvailable === false) {
        throw new Error("Cannot toggle form status: Database connection unavailable");
      }
      return toggleFormActive(formId, isActive);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['forms', effectiveUserId] });
      toast({
        title: data.is_public ? "Form Activated" : "Form Deactivated",
        description: `${data.name} is now ${data.is_public ? 'active' : 'inactive'}.`,
      });
    },
    onError: (error: any) => {
      console.error("Error toggling form status:", error);
      toast({
        title: "Error Toggling Form Status",
        description: error.message || "Failed to update form status. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter forms based on search query
  const filteredForms = forms.filter(form => 
    form.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    form.description?.toLowerCase().includes(searchQuery.toLowerCase() || '')
  );

  return {
    forms,
    filteredForms,
    isLoading,
    searchQuery,
    setSearchQuery,
    createFormMutation,
    updateFormMutation,
    deleteFormMutation,
    toggleFormMutation,
    supabaseAvailable,
    tableChecked
  };
}
