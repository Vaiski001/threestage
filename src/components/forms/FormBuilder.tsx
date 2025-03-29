import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { DropResult } from "@hello-pangea/dnd";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FormTemplate, FormField as FormFieldInterface, FormFieldType } from "@/lib/supabase/types";
import { FormPreview } from "./FormPreview";
import {
  FormBuilderHeader,
  FormInfoSection,
  FieldsTabContent,
  BrandingTabContent,
  DeleteFieldDialog
} from "./builder";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface FormBuilderProps {
  form: FormTemplate;
  onSave: (form: FormTemplate) => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export function FormBuilder({ form, onSave, onCancel, isProcessing = false }: FormBuilderProps) {
  const [formData, setFormData] = useState<FormTemplate>(form);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("fields");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { toast } = useToast();

  const updateFormInfo = (field: keyof FormTemplate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (saveError) setSaveError(null);
  };

  const addField = (type: FormFieldType) => {
    const newField: FormFieldInterface = {
      id: `field-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: `Enter ${type}`,
      required: false,
      options: (type === 'dropdown' || type === 'radio' || type === 'checkbox') ? ['Option 1', 'Option 2'] : undefined
    };

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));

    toast({
      title: "Field Added",
      description: `Added a new ${type} field to your form.`
    });
  };

  const updateField = (fieldId: string, property: keyof FormFieldInterface, value: any) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, [property]: value } : field
      )
    }));
  };

  const updateFieldOption = (fieldId: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => {
        if (field.id === fieldId && field.options) {
          const updatedOptions = [...field.options];
          updatedOptions[index] = value;
          return { ...field, options: updatedOptions };
        }
        return field;
      })
    }));
  };

  const addFieldOption = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => {
        if (field.id === fieldId && field.options) {
          return { ...field, options: [...field.options, `Option ${field.options.length + 1}`] };
        }
        return field;
      })
    }));
  };

  const removeFieldOption = (fieldId: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => {
        if (field.id === fieldId && field.options && field.options.length > 1) {
          const updatedOptions = [...field.options];
          updatedOptions.splice(index, 1);
          return { ...field, options: updatedOptions };
        }
        return field;
      })
    }));
  };

  const prepareDeleteField = (fieldId: string) => {
    setFieldToDelete(fieldId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteField = () => {
    if (fieldToDelete) {
      setFormData(prev => ({
        ...prev,
        fields: prev.fields.filter(field => field.id !== fieldToDelete)
      }));
      
      toast({
        title: "Field Deleted",
        description: "The field has been removed from your form."
      });
      
      setShowDeleteConfirm(false);
      setFieldToDelete(null);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(formData.fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setFormData(prev => ({
      ...prev,
      fields: items
    }));
  };

  const moveFieldUp = (index: number) => {
    if (index === 0) return;
    const fields = [...formData.fields];
    [fields[index], fields[index - 1]] = [fields[index - 1], fields[index]];
    setFormData(prev => ({ ...prev, fields }));
  };

  const moveFieldDown = (index: number) => {
    if (index === formData.fields.length - 1) return;
    const fields = [...formData.fields];
    [fields[index], fields[index + 1]] = [fields[index + 1], fields[index]];
    setFormData(prev => ({ ...prev, fields }));
  };

  const updateBranding = (field: keyof FormTemplate['branding'], value: string) => {
    setFormData(prev => ({
      ...prev,
      branding: { ...prev.branding, [field]: value }
    }));
  };

  const handleSave = () => {
    setSaveError(null);

    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Form name is required.",
        variant: "destructive"
      });
      return;
    }

    for (const field of formData.fields) {
      if (!field.label.trim()) {
        toast({
          title: "Validation Error",
          description: "All fields must have labels.",
          variant: "destructive"
        });
        return;
      }
    }

    try {
      onSave(formData);
    } catch (error) {
      console.error("Error in handleSave:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setSaveError(errorMessage);
      
      toast({
        title: "Error Saving Form",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  if (showPreview) {
    return (
      <div className="space-y-4">
        <FormBuilderHeader
          isNewForm={formData.id.includes('form-')}
          onSave={handleSave}
          onCancel={onCancel}
          togglePreview={togglePreview}
          showPreview={showPreview}
          isProcessing={isProcessing}
        />
        <FormPreview form={formData} onClose={togglePreview} isEmbedded />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FormBuilderHeader
        isNewForm={formData.id.includes('form-')}
        onSave={handleSave}
        onCancel={onCancel}
        togglePreview={togglePreview}
        showPreview={showPreview}
        isProcessing={isProcessing}
      />

      {saveError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Saving Form</AlertTitle>
          <AlertDescription>
            {saveError.includes("relation") ? 
              "Database table does not exist. This is likely the first time you're creating a form. Please try again, as the system is attempting to set up the necessary database tables." : 
              saveError
            }
          </AlertDescription>
        </Alert>
      )}

      <FormInfoSection
        formData={formData}
        updateFormInfo={updateFormInfo}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fields">Form Fields</TabsTrigger>
          <TabsTrigger value="branding">Styling & Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="fields" className="space-y-4">
          <FieldsTabContent
            fields={formData.fields}
            onAddField={addField}
            onDragEnd={handleDragEnd}
            moveFieldUp={moveFieldUp}
            moveFieldDown={moveFieldDown}
            prepareDeleteField={prepareDeleteField}
            updateField={updateField}
            updateFieldOption={updateFieldOption}
            addFieldOption={addFieldOption}
            removeFieldOption={removeFieldOption}
          />
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <BrandingTabContent 
            formData={formData}
            updateBranding={updateBranding}
          />
        </TabsContent>
      </Tabs>

      <DeleteFieldDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={confirmDeleteField}
      />
    </div>
  );
}
