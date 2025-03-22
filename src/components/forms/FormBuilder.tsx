
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from "@hello-pangea/dnd";
import { 
  ArrowUp, ArrowDown, Plus, Save, X, Eye, Trash2, 
  Settings, Edit, Grip, AlertCircle, Check
} from "lucide-react";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormTemplate, FormFieldType } from "./FormManagement";
import { FormField as CustomFormField } from "./FormField";
import { FormPreview } from "./FormPreview";

interface FormBuilderProps {
  form: FormTemplate;
  onSave: (form: FormTemplate) => void;
  onCancel: () => void;
}

export function FormBuilder({ form, onSave, onCancel }: FormBuilderProps) {
  const [formData, setFormData] = useState<FormTemplate>(form);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("fields");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Update form basic information
  const updateFormInfo = (field: keyof FormTemplate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle adding a new form field
  const addField = (type: FormFieldType['type']) => {
    const newField: FormFieldType = {
      id: `field-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: `Enter ${type}`,
      required: false,
      options: type === 'dropdown' || type === 'radio' || type === 'checkbox' ? ['Option 1', 'Option 2'] : undefined
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

  // Update a field property
  const updateField = (fieldId: string, property: keyof FormFieldType, value: any) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, [property]: value } : field
      )
    }));
  };

  // Handle field option management (for dropdowns, radios, etc.)
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

  // Add a new option to a field
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

  // Remove an option from a field
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

  // Prepare to delete a field
  const prepareDeleteField = (fieldId: string) => {
    setFieldToDelete(fieldId);
    setShowDeleteConfirm(true);
  };

  // Confirm field deletion
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

  // Handle drag and drop reordering
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

  // Move a field up in the order
  const moveFieldUp = (index: number) => {
    if (index === 0) return;
    const fields = [...formData.fields];
    [fields[index], fields[index - 1]] = [fields[index - 1], fields[index]];
    setFormData(prev => ({ ...prev, fields }));
  };

  // Move a field down in the order
  const moveFieldDown = (index: number) => {
    if (index === formData.fields.length - 1) return;
    const fields = [...formData.fields];
    [fields[index], fields[index + 1]] = [fields[index + 1], fields[index]];
    setFormData(prev => ({ ...prev, fields }));
  };

  // Handle form save
  const handleSave = () => {
    // Validate the form before saving
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Form name is required.",
        variant: "destructive"
      });
      return;
    }

    // Ensure all required fields have labels
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

    onSave(formData);
    toast({
      title: "Form Saved",
      description: "Your form has been saved successfully."
    });
  };

  // Toggle preview mode
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Update branding settings
  const updateBranding = (field: keyof FormTemplate['branding'], value: string) => {
    setFormData(prev => ({
      ...prev,
      branding: { ...prev.branding, [field]: value }
    }));
  };

  if (showPreview) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Form Preview</h2>
          <Button onClick={togglePreview} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Back to Editor
          </Button>
        </div>
        <FormPreview form={formData} onClose={togglePreview} isEmbedded />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {formData.id.includes('form-') ? 'Create New Form' : 'Edit Form'}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={togglePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Form
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Information</CardTitle>
          <CardDescription>Basic details about your form</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <FormLabel htmlFor="form-name">Form Name</FormLabel>
            <Input
              id="form-name"
              value={formData.name}
              onChange={(e) => updateFormInfo('name', e.target.value)}
              placeholder="Enter form name"
              className="mt-1"
            />
          </div>
          <div>
            <FormLabel htmlFor="form-description">Description</FormLabel>
            <Textarea
              id="form-description"
              value={formData.description}
              onChange={(e) => updateFormInfo('description', e.target.value)}
              placeholder="Enter form description"
              className="mt-1"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="form-active"
              checked={formData.active}
              onCheckedChange={(checked) => updateFormInfo('active', checked)}
            />
            <label
              htmlFor="form-active"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Active (form will be available to receive submissions)
            </label>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fields">Form Fields</TabsTrigger>
          <TabsTrigger value="branding">Styling & Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="fields" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Form Fields</CardTitle>
              <CardDescription>Drag and drop fields to build your form</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-6">
                <Button variant="outline" size="sm" onClick={() => addField('text')}>
                  <Plus className="mr-1 h-3 w-3" />
                  Text
                </Button>
                <Button variant="outline" size="sm" onClick={() => addField('email')}>
                  <Plus className="mr-1 h-3 w-3" />
                  Email
                </Button>
                <Button variant="outline" size="sm" onClick={() => addField('phone')}>
                  <Plus className="mr-1 h-3 w-3" />
                  Phone
                </Button>
                <Button variant="outline" size="sm" onClick={() => addField('textarea')}>
                  <Plus className="mr-1 h-3 w-3" />
                  Textarea
                </Button>
                <Button variant="outline" size="sm" onClick={() => addField('dropdown')}>
                  <Plus className="mr-1 h-3 w-3" />
                  Dropdown
                </Button>
                <Button variant="outline" size="sm" onClick={() => addField('checkbox')}>
                  <Plus className="mr-1 h-3 w-3" />
                  Checkbox
                </Button>
                <Button variant="outline" size="sm" onClick={() => addField('radio')}>
                  <Plus className="mr-1 h-3 w-3" />
                  Radio
                </Button>
                <Button variant="outline" size="sm" onClick={() => addField('file')}>
                  <Plus className="mr-1 h-3 w-3" />
                  File Upload
                </Button>
              </div>

              {formData.fields.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded-md">
                  <p className="text-muted-foreground">Add fields to your form by clicking the buttons above</p>
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="fields">
                    {(provided) => (
                      <div 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
                      >
                        {formData.fields.map((field, index) => (
                          <Draggable key={field.id} draggableId={field.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="border rounded-md p-4 relative"
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <div 
                                    {...provided.dragHandleProps}
                                    className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                                  >
                                    <Grip className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <div className="flex gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => moveFieldUp(index)}
                                      disabled={index === 0}
                                    >
                                      <ArrowUp className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => moveFieldDown(index)}
                                      disabled={index === formData.fields.length - 1}
                                    >
                                      <ArrowDown className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => prepareDeleteField(field.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>

                                <Accordion type="single" collapsible className="w-full">
                                  <AccordionItem value={`field-${field.id}`}>
                                    <AccordionTrigger>
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">{field.label || 'Untitled Field'}</span>
                                        <span className="text-xs bg-secondary text-secondary-foreground rounded px-2 py-0.5">
                                          {field.type}
                                        </span>
                                        {field.required && (
                                          <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded px-2 py-0.5">
                                            Required
                                          </span>
                                        )}
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <div className="space-y-4 pt-2">
                                        <div>
                                          <FormLabel htmlFor={`field-label-${field.id}`}>Field Label</FormLabel>
                                          <Input
                                            id={`field-label-${field.id}`}
                                            value={field.label}
                                            onChange={(e) => updateField(field.id, 'label', e.target.value)}
                                            className="mt-1"
                                          />
                                        </div>
                                        
                                        {(field.type === 'text' || field.type === 'email' || field.type === 'phone' || field.type === 'textarea') && (
                                          <div>
                                            <FormLabel htmlFor={`field-placeholder-${field.id}`}>Placeholder</FormLabel>
                                            <Input
                                              id={`field-placeholder-${field.id}`}
                                              value={field.placeholder || ''}
                                              onChange={(e) => updateField(field.id, 'placeholder', e.target.value)}
                                              className="mt-1"
                                            />
                                          </div>
                                        )}
                                        
                                        {(field.type === 'dropdown' || field.type === 'radio' || field.type === 'checkbox') && field.options && (
                                          <div className="space-y-2">
                                            <FormLabel>Options</FormLabel>
                                            {field.options.map((option, optionIndex) => (
                                              <div key={optionIndex} className="flex items-center gap-2">
                                                <Input
                                                  value={option}
                                                  onChange={(e) => updateFieldOption(field.id, optionIndex, e.target.value)}
                                                />
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  disabled={field.options?.length === 1}
                                                  onClick={() => removeFieldOption(field.id, optionIndex)}
                                                >
                                                  <X className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            ))}
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => addFieldOption(field.id)}
                                              className="mt-1"
                                            >
                                              <Plus className="mr-1 h-3 w-3" />
                                              Add Option
                                            </Button>
                                          </div>
                                        )}

                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`field-required-${field.id}`}
                                            checked={field.required}
                                            onCheckedChange={(checked) => updateField(field.id, 'required', checked)}
                                          />
                                          <label
                                            htmlFor={`field-required-${field.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                          >
                                            Required field
                                          </label>
                                        </div>
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Styling & Branding</CardTitle>
              <CardDescription>Customize the appearance of your form</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <FormLabel htmlFor="primary-color">Primary Color</FormLabel>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="primary-color"
                    type="color"
                    value={formData.branding.primaryColor || '#0070f3'}
                    onChange={(e) => updateBranding('primaryColor', e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.branding.primaryColor || '#0070f3'}
                    onChange={(e) => updateBranding('primaryColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <FormLabel htmlFor="font-family">Font Family</FormLabel>
                <select
                  id="font-family"
                  value={formData.branding.fontFamily || 'Inter'}
                  onChange={(e) => updateBranding('fontFamily', e.target.value)}
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
                >
                  <option value="Inter">Inter</option>
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Roboto">Roboto</option>
                </select>
              </div>

              <div>
                <FormLabel htmlFor="form-logo">Logo URL (optional)</FormLabel>
                <Input
                  id="form-logo"
                  value={formData.branding.logo || ''}
                  onChange={(e) => updateBranding('logo', e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Enter the URL of your company logo</p>
              </div>
              
              <div className="pt-4">
                <p className="text-sm font-medium mb-2">Preview (Sample Field):</p>
                <div 
                  className="border rounded-md p-6 shadow-sm" 
                  style={{
                    fontFamily: formData.branding.fontFamily || 'Inter',
                    "--primary-color": formData.branding.primaryColor || '#0070f3'
                  } as React.CSSProperties}
                >
                  {formData.branding.logo && (
                    <div className="mb-6">
                      <img 
                        src={formData.branding.logo} 
                        alt="Form Logo" 
                        className="max-h-12 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Sample Text Input</label>
                      <input 
                        type="text" 
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        placeholder="Sample placeholder text"
                        style={{
                          borderColor: formData.branding.primaryColor || '#0070f3',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Sample Dropdown</label>
                      <select 
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        style={{
                          borderColor: formData.branding.primaryColor || '#0070f3',
                          outline: 'none'
                        }}
                      >
                        <option>Option 1</option>
                        <option>Option 2</option>
                        <option>Option 3</option>
                      </select>
                    </div>
                    <button 
                      className="px-4 py-2 rounded-md text-white"
                      style={{
                        backgroundColor: formData.branding.primaryColor || '#0070f3'
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Field</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this field? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteField}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
