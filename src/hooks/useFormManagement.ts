
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getCompanyForms, 
  createForm, 
  updateForm, 
  deleteForm, 
  toggleFormActive 
} from "@/lib/supabase/forms";
import { FormTemplate } from "@/lib/supabase/types";
import { useAuth } from "@/context/AuthContext";

export function useFormManagement(userId?: string) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  // Get the most reliable user ID
  const effectiveUserId = userId || user?.id || profile?.id || "";
  
  // For debugging purposes
  useEffect(() => {
    console.log("useFormManagement hook initialized with provided userId:", userId);
    console.log("Using effective userId:", effectiveUserId);
  }, [userId, effectiveUserId]);

  // Fetch all forms for the current company
  const { data: forms = [], isLoading } = useQuery({
    queryKey: ['forms', effectiveUserId],
    queryFn: async () => {
      if (!effectiveUserId) {
        console.log("No userId provided, returning empty forms array");
        return [];
      }
      console.log("Fetching forms for userId:", effectiveUserId);
      return await getCompanyForms(effectiveUserId);
    },
    enabled: !!effectiveUserId,
  });

  // Create a new form mutation
  const createFormMutation = useMutation({
    mutationFn: (formData: Partial<FormTemplate>) => {
      // Ensure the company_id is set
      if (!effectiveUserId) {
        console.error("Error: No user ID available when creating form");
        throw new Error("User ID is required to create a form");
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
    mutationFn: deleteForm,
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
    mutationFn: ({ formId, isActive }: { formId: string; isActive: boolean }) => 
      toggleFormActive(formId, isActive),
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
    toggleFormMutation
  };
}
