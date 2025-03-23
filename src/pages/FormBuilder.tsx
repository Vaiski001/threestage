
import { useState } from 'react';
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormManagement } from "@/components/forms/FormManagement";
import { FormBuilder as BuilderComponent } from "@/components/forms/FormBuilder";
import { FormIntegration } from "@/components/forms/FormIntegration";

// Default empty form template to use when creating a new form
const emptyFormTemplate = {
  id: `form-${Date.now()}`,
  name: "",
  description: "",
  active: true,
  fields: [],
  branding: {
    primaryColor: "#0070f3",
    fontFamily: "Inter",
    logo: ""
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export default function FormBuilder() {
  const [activeTab, setActiveTab] = useState("manage");
  const [selectedForm, setSelectedForm] = useState(emptyFormTemplate);

  const handleCreateNew = () => {
    setSelectedForm(emptyFormTemplate);
    setActiveTab("create");
  };

  const handleSaveForm = (form: any) => {
    console.log("Form saved:", form);
    setActiveTab("manage");
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
