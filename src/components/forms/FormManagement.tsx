
import { useState } from "react";
import { 
  Plus, List, Eye, Copy, Trash2, Edit, ToggleLeft, 
  ToggleRight, Code, ExternalLink, BarChart2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { FormBuilder } from "./FormBuilder";
import { FormPreview } from "./FormPreview";
import { FormIntegration } from "./FormIntegration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Define the form template interface
export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  active?: boolean;
  fields: FormFieldType[];
  submissions?: number;
  dateCreated?: string;
  lastModified?: string;
  createdAt?: string;
  updatedAt?: string;
  branding: {
    logo?: string;
    primaryColor?: string;
    fontFamily?: string;
  };
}

// Define the form field type
export interface FormFieldType {
  id: string;
  type: 'text' | 'email' | 'phone' | 'dropdown' | 'checkbox' | 'textarea' | 'file' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For dropdown, radio, or checkbox options
  defaultValue?: string;
}

// Mock data for demonstration purposes
const mockForms: FormTemplate[] = [
  {
    id: "form-1",
    name: "Contact Us Form",
    description: "General contact form for customer inquiries",
    active: true,
    fields: [
      { id: "field-1", type: "text", label: "Name", placeholder: "Enter your name", required: true },
      { id: "field-2", type: "email", label: "Email", placeholder: "Enter your email", required: true },
      { id: "field-3", type: "textarea", label: "Message", placeholder: "How can we help you?", required: true }
    ],
    submissions: 12,
    dateCreated: "2023-06-15",
    lastModified: "2023-06-20",
    branding: {
      primaryColor: "#0070f3"
    }
  },
  {
    id: "form-2",
    name: "Product Inquiry Form",
    description: "Form for specific product inquiries",
    active: false,
    fields: [
      { id: "field-1", type: "text", label: "Name", placeholder: "Enter your name", required: true },
      { id: "field-2", type: "email", label: "Email", placeholder: "Enter your email", required: true },
      { id: "field-3", type: "dropdown", label: "Product Interest", options: ["Product A", "Product B", "Product C"], required: true },
      { id: "field-4", type: "textarea", label: "Questions", placeholder: "Your questions about our products", required: false }
    ],
    submissions: 5,
    dateCreated: "2023-06-10",
    lastModified: "2023-06-12",
    branding: {
      primaryColor: "#22c55e"
    }
  }
];

export function FormManagement() {
  const [forms, setForms] = useState<FormTemplate[]>(mockForms);
  const [activeTab, setActiveTab] = useState("forms");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showIntegration, setShowIntegration] = useState(false);
  const { toast } = useToast();

  // Filter forms based on search query
  const filteredForms = forms.filter(form => 
    form.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    form.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle form active status
  const toggleFormActive = (formId: string) => {
    setForms(prevForms => 
      prevForms.map(form => 
        form.id === formId ? { ...form, active: !form.active } : form
      )
    );
    
    const form = forms.find(f => f.id === formId);
    toast({
      title: `Form ${form?.active ? 'Deactivated' : 'Activated'}`,
      description: `${form?.name} is now ${form?.active ? 'inactive' : 'active'}.`
    });
  };

  // Delete a form
  const deleteForm = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    
    setForms(prevForms => prevForms.filter(form => form.id !== formId));
    
    toast({
      title: "Form Deleted",
      description: `${form?.name} has been deleted.`
    });
  };

  // Duplicate a form
  const duplicateForm = (formId: string) => {
    const formToDuplicate = forms.find(f => f.id === formId);
    
    if (formToDuplicate) {
      const newForm: FormTemplate = {
        ...formToDuplicate,
        id: `form-${Date.now()}`,
        name: `${formToDuplicate.name} (Copy)`,
        active: false,
        dateCreated: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        submissions: 0
      };
      
      setForms(prevForms => [...prevForms, newForm]);
      
      toast({
        title: "Form Duplicated",
        description: `A copy of ${formToDuplicate.name} has been created.`
      });
    }
  };

  // Edit a form
  const editForm = (form: FormTemplate) => {
    setSelectedForm(form);
    setIsCreatingForm(true);
  };

  // Preview a form
  const previewForm = (form: FormTemplate) => {
    setSelectedForm(form);
    setShowPreview(true);
  };

  // Show integration options
  const showIntegrationOptions = (form: FormTemplate) => {
    setSelectedForm(form);
    setShowIntegration(true);
  };

  // Create a new form
  const createNewForm = () => {
    const newForm: FormTemplate = {
      id: `form-${Date.now()}`,
      name: "New Form",
      description: "Form description",
      active: false,
      fields: [],
      submissions: 0,
      dateCreated: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      branding: {}
    };
    
    setSelectedForm(newForm);
    setIsCreatingForm(true);
  };

  // Save form after creation or editing
  const saveForm = (form: FormTemplate) => {
    if (forms.some(f => f.id === form.id)) {
      // Update existing form
      setForms(prevForms => 
        prevForms.map(f => f.id === form.id ? { ...form, lastModified: new Date().toISOString().split('T')[0] } : f)
      );
      
      toast({
        title: "Form Updated",
        description: `${form.name} has been updated successfully.`
      });
    } else {
      // Add new form
      setForms(prevForms => [...prevForms, { ...form, lastModified: new Date().toISOString().split('T')[0] }]);
      
      toast({
        title: "Form Created",
        description: `${form.name} has been created successfully.`
      });
    }
    
    setIsCreatingForm(false);
    setSelectedForm(null);
  };

  // Cancel form creation or editing
  const cancelFormEdit = () => {
    setIsCreatingForm(false);
    setSelectedForm(null);
  };

  // Close the preview
  const closePreview = () => {
    setShowPreview(false);
    setSelectedForm(null);
  };

  // Close the integration panel
  const closeIntegration = () => {
    setShowIntegration(false);
    setSelectedForm(null);
  };

  if (isCreatingForm && selectedForm) {
    return (
      <FormBuilder 
        form={selectedForm} 
        onSave={saveForm} 
        onCancel={cancelFormEdit} 
      />
    );
  }

  if (showPreview && selectedForm) {
    return (
      <FormPreview 
        form={selectedForm} 
        onClose={closePreview} 
      />
    );
  }

  if (showIntegration && selectedForm) {
    return (
      <FormIntegration 
        form={selectedForm} 
        onClose={closeIntegration} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold">Form Management</h1>
        <Button onClick={createNewForm}>
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

          {filteredForms.length === 0 ? (
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
                        <Button variant="ghost" size="icon" onClick={() => toggleFormActive(form.id)}>
                          {form.active ? (
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
                      <div>Created: {form.dateCreated}</div>
                      <div>Submissions: {form.submissions}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 pb-2 border-t">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => editForm(form)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => previewForm(form)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => duplicateForm(form.id)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => showIntegrationOptions(form)}>
                        <Code className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteForm(form.id)}>
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
