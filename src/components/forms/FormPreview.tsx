
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormTemplate, FormFieldType } from "./FormManagement";
import { FormField } from "./FormField";
import { X, ArrowLeft } from "lucide-react";

interface FormPreviewProps {
  form: FormTemplate;
  onClose: () => void;
  isEmbedded?: boolean;
}

export function FormPreview({ form, onClose, isEmbedded = false }: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  // Update form field values
  const updateField = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear error for this field if value is provided
    if (value) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: false
      }));
    }
  };

  // Validate form and submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: Record<string, boolean> = {};
    let hasError = false;
    
    form.fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = true;
        hasError = true;
      }
    });
    
    setErrors(newErrors);
    
    if (hasError) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Submit form
    setIsSubmitting(true);
    
    // Simulate API call for form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      toast({
        title: "Form Submitted",
        description: "Your form has been submitted successfully.",
        variant: "default"
      });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({});
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
  };

  // Style based on branding
  const formStyle = {
    fontFamily: form.branding.fontFamily || 'inherit',
    "--form-primary-color": form.branding.primaryColor || '#0070f3'
  } as React.CSSProperties;

  return (
    <div className={isEmbedded ? "" : "p-4"}>
      {!isEmbedded && (
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-xl font-bold">Form Preview</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div 
        className={`rounded-lg overflow-hidden border p-6 ${isEmbedded ? "max-w-2xl mx-auto" : "shadow-md"}`}
        style={formStyle}
      >
        {form.branding.logo && (
          <div className="mb-6 flex justify-center">
            <img 
              src={form.branding.logo} 
              alt="Form Logo" 
              className="max-h-12 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">{form.name}</h3>
          {form.description && (
            <p className="text-muted-foreground">{form.description}</p>
          )}
        </div>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold mb-2">Thank You!</h4>
            <p className="text-muted-foreground">Your submission has been received.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields.map((field) => (
              <FormField
                key={field.id}
                field={field}
                value={formData[field.id]}
                onChange={(value) => updateField(field.id, value)}
                showError={errors[field.id]}
                branding={form.branding}
              />
            ))}
            
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full"
                style={{
                  backgroundColor: form.branding.primaryColor || '#0070f3',
                  borderColor: form.branding.primaryColor || '#0070f3'
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
