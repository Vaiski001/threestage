
import { useState } from "react";
import { List, BarChart2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormBuilder } from "./FormBuilder";
import { FormPreview } from "./FormPreview";
import { FormIntegration } from "./FormIntegration";
import { useAuth } from "@/context/AuthContext";
import { FormTemplate } from "@/lib/supabase/types";
import { useFormManagement } from "@/hooks/useFormManagement";
import { FormHeader } from "./management/FormHeader";
import { FormsTabContent } from "./management/FormsTabContent";
import { AnalyticsTab } from "./management/AnalyticsTab";

// Define props for FormManagement component
export interface FormManagementProps {
  onCreateNew?: () => void;
  userId?: string;
}

export function FormManagement({ onCreateNew, userId }: FormManagementProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("forms");
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showIntegration, setShowIntegration] = useState(false);
  
  const {
    filteredForms,
    isLoading,
    searchQuery,
    setSearchQuery,
    createFormMutation,
    updateFormMutation,
    deleteFormMutation,
    toggleFormMutation
  } = useFormManagement(userId || user?.id);

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
      company_id: userId || user?.id,
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
      company_id: userId || user?.id,
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
      <FormHeader onCreateNew={handleCreateNewForm} />

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

        <TabsContent value="forms">
          <FormsTabContent
            isLoading={isLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredForms={filteredForms}
            onEdit={handleEditForm}
            onPreview={handlePreviewForm}
            onDuplicate={handleDuplicateForm}
            onShowIntegration={handleShowIntegrationOptions}
            onDelete={handleDeleteForm}
            onToggleActive={handleToggleFormActive}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
