
import { useState } from "react";
import { 
  Plus, List, Eye, Copy, Trash2, Edit, ToggleLeft, 
  ToggleRight, Code, BarChart2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { FormBuilder } from "./FormBuilder";
import { FormPreview } from "./FormPreview";
import { FormIntegration } from "./FormIntegration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getCompanyForms, 
  createForm, 
  updateForm, 
  deleteForm, 
  toggleFormActive 
} from "@/lib/supabase/forms";
import { FormTemplate } from "@/lib/supabase/types";

// Define props for FormManagement component
export interface FormManagementProps {
  onCreateNew?: () => void;
}

export function FormManagement({ onCreateNew }: FormManagementProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("forms");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showIntegration, setShowIntegration] = useState(false);
  const { toast } = useToast();

  // Fetch all forms for the current company
  const { data: forms = [], isLoading } = useQuery({
    queryKey: ['forms', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await getCompanyForms(user.id);
    },
    enabled: !!user?.id,
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

  // Toggle form active status
  const handleToggleFormActive = (formId: string, currentStatus: boolean) => {
    toggleFormMutation.mutate({ 
      formId, 
      isActive: !currentStatus 
    });
  };

  // Delete a form
  const handleDeleteForm = (formId: string) => {
    deleteFormMutation.mutate(formId);
  };

  // Duplicate a form
  const handleDuplicateForm = (formToDuplicate: FormTemplate) => {
    const newForm: Partial<FormTemplate> = {
      name: `${formToDuplicate.name} (Copy)`,
      description: formToDuplicate.description,
      fields: formToDuplicate.fields,
      branding: formToDuplicate.branding,
      is_public: false,
      company_id: user?.id,
    };
    
    createFormMutation.mutate(newForm);
  };

  // Edit a form
  const handleEditForm = (form: FormTemplate) => {
    setSelectedForm(form);
    setIsCreatingForm(true);
  };

  // Preview a form
  const handlePreviewForm = (form: FormTemplate) => {
    setSelectedForm(form);
    setShowPreview(true);
  };

  // Show integration options
  const handleShowIntegrationOptions = (form: FormTemplate) => {
    setSelectedForm(form);
    setShowIntegration(true);
  };

  // Create a new form
  const handleCreateNewForm = () => {
    if (onCreateNew) {
      onCreateNew();
      return;
    }
    
    const newForm: Partial<FormTemplate> = {
      name: "New Form",
      description: "Form description",
      fields: [],
      branding: {
        primaryColor: "#0070f3",
        fontFamily: "Inter",
      },
      is_public: false,
      company_id: user?.id,
    };
    
    setSelectedForm(newForm as FormTemplate);
    setIsCreatingForm(true);
  };

  // Save form after creation or editing
  const handleSaveForm = (form: FormTemplate) => {
    if (form.id) {
      // Update existing form
      updateFormMutation.mutate({ 
        formId: form.id, 
        updates: form 
      });
    } else {
      // Create new form
      createFormMutation.mutate(form);
    }
    
    setIsCreatingForm(false);
    setSelectedForm(null);
  };

  // Cancel form creation or editing
  const handleCancelFormEdit = () => {
    setIsCreatingForm(false);
    setSelectedForm(null);
  };

  // Close the preview
  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedForm(null);
  };

  // Close the integration panel
  const handleCloseIntegration = () => {
    setShowIntegration(false);
    setSelectedForm(null);
  };

  if (isCreatingForm && selectedForm) {
    return (
      <FormBuilder 
        form={selectedForm} 
        onSave={handleSaveForm} 
        onCancel={handleCancelFormEdit} 
      />
    );
  }

  if (showPreview && selectedForm) {
    return (
      <FormPreview 
        form={selectedForm} 
        onClose={handleClosePreview} 
      />
    );
  }

  if (showIntegration && selectedForm) {
    return (
      <FormIntegration 
        form={selectedForm} 
        onClose={handleCloseIntegration} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold">Form Management</h1>
        <Button onClick={handleCreateNewForm}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Form
        </Button>
      </div>

      <Tabs defaultValue="forms" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="forms">
            <List className="mr-2 h-4 w-4" />
            Forms
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart2 className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-4">
          <div className="flex">
            <Input
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-lg"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading forms...</p>
            </div>
          ) : filteredForms.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>No forms found. Create your first form to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredForms.map((form) => (
                <Card key={form.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{form.name}</CardTitle>
                        <CardDescription className="mt-1">{form.description}</CardDescription>
                      </div>
                      <div className="flex">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleToggleFormActive(form.id, !!form.is_public)}
                        >
                          {form.is_public ? (
                            <ToggleRight className="h-5 w-5 text-green-500" />
                          ) : (
                            <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div>Created: {new Date(form.created_at).toLocaleDateString()}</div>
                      <div>Last Updated: {new Date(form.updated_at).toLocaleDateString()}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 pb-2 border-t">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditForm(form)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handlePreviewForm(form)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDuplicateForm(form)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleShowIntegrationOptions(form)}>
                        <Code className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteForm(form.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Form Analytics</CardTitle>
              <CardDescription>View statistics about your forms and submissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">Form analytics will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
