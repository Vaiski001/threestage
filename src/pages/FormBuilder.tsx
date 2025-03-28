
import { useState } from 'react';
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormManagement } from "@/components/forms/FormManagement";
import { FormBuilder as BuilderComponent } from "@/components/forms/FormBuilder";
import { FormIntegration } from "@/components/forms/FormIntegration";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { createForm, updateForm } from "@/lib/supabase/forms";
import { FormTemplate } from "@/lib/supabase/types";

// Default empty form template to use when creating a new form
const createEmptyFormTemplate = (userId?: string): FormTemplate => ({
  id: '',
  name: "",
  description: "",
  fields: [],
  branding: {
    primaryColor: "#0070f3",
    fontFamily: "Inter",
    logo: ""
  },
  company_id: userId,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
});

export default function FormBuilder() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("manage");
  const [selectedForm, setSelectedForm] = useState(createEmptyFormTemplate(user?.id));

  // Create form mutation
  const createFormMutation = useMutation({
    mutationFn: createForm,
    onSuccess: () => {
      toast({
        title: "Form Created",
        description: "Your form has been created successfully."
      });
      setActiveTab("manage");
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Form",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Update form mutation
  const updateFormMutation = useMutation({
    mutationFn: ({ formId, updates }: { formId: string; updates: Partial<FormTemplate> }) => 
      updateForm(formId, updates),
    onSuccess: () => {
      toast({
        title: "Form Updated",
        description: "Your form has been updated successfully."
      });
      setActiveTab("manage");
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating Form",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleCreateNew = () => {
    setSelectedForm(createEmptyFormTemplate(user?.id));
    setActiveTab("create");
  };

  const handleSaveForm = (form: FormTemplate) => {
    if (form.id) {
      // Update existing form
      updateFormMutation.mutate({
        formId: form.id,
        updates: form
      });
    } else {
      // Create new form
      createFormMutation.mutate({
        ...form,
        company_id: user?.id
      });
    }
  };

  const handleCloseForm = () => {
    setActiveTab("manage");
  };

  return (
    <div className="min-h-screen">
      <Header />
      <Container>
        <div className="pt-8 pb-20">
          <h1 className="text-3xl font-bold mb-8">Form Builder</h1>
          
          <Tabs 
            defaultValue="manage" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-8">
              <TabsTrigger value="manage">Manage Forms</TabsTrigger>
              <TabsTrigger value="create">Create Form</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manage">
              <FormManagement onCreateNew={handleCreateNew} />
            </TabsContent>
            
            <TabsContent value="create">
              <BuilderComponent 
                form={selectedForm}
                onSave={handleSaveForm} 
                onCancel={handleCloseForm}
              />
            </TabsContent>
            
            <TabsContent value="integration">
              <FormIntegration 
                form={selectedForm}
                onClose={() => setActiveTab("manage")} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </div>
  );
}
