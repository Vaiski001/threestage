
import { useState } from 'react';
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormManagement } from "@/components/forms/FormManagement";
import { FormBuilder as BuilderComponent } from "@/components/forms/FormBuilder";
import { FormIntegration } from "@/components/forms/FormIntegration";

export default function FormBuilder() {
  const [activeTab, setActiveTab] = useState("manage");

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
              <FormManagement onCreateNew={() => setActiveTab("create")} />
            </TabsContent>
            
            <TabsContent value="create">
              <BuilderComponent onSave={() => setActiveTab("manage")} />
            </TabsContent>
            
            <TabsContent value="integration">
              <FormIntegration />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </div>
  );
}
