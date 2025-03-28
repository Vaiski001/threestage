
import { useState } from "react";
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

export function useFormManagement(userId?: string) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Fetch all forms for the current company
  const { data: forms = [], isLoading } = useQuery({
    queryKey: ['forms', userId],
    queryFn: async () => {
      if (!userId) return [];
      return await getCompanyForms(userId);
    },
    enabled: !!userId,
  });

  // Create a new form mutation
  const createFormMutation = useMutation({
    mutationFn: createForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      toast({
        title: "Form Created",
        description: "Your new form has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Form",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update an existing form mutation
  const updateFormMutation = useMutation({
    mutationFn: ({ formId, updates }: { formId: string; updates: Partial<FormTemplate> }) => 
      updateForm(formId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      toast({
        title: "Form Updated",
        description: "Your form has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating Form",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete a form mutation
  const deleteFormMutation = useMutation({
    mutationFn: deleteForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      toast({
        title: "Form Deleted",
        description: "The form has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Deleting Form",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle form active status mutation
  const toggleFormMutation = useMutation({
    mutationFn: ({ formId, isActive }: { formId: string; isActive: boolean }) => 
      toggleFormActive(formId, isActive),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      toast({
        title: data.is_public ? "Form Activated" : "Form Deactivated",
        description: `${data.name} is now ${data.is_public ? 'active' : 'inactive'}.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Toggling Form Status",
        description: error.message,
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
