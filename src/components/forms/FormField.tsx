
import { useState } from "react";
import { FormField as FormFieldType, FormFieldType as FieldType } from "@/lib/supabase/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  field: FormFieldType;
  value: any;
  onChange: (value: any) => void;
  showError?: boolean;
  errorMessage?: string;
  branding?: {
    primaryColor?: string;
    fontFamily?: string;
  };
}

export function FormField({ 
  field, 
  value, 
  onChange, 
  showError = false, 
  errorMessage = "This field is required", 
  branding 
}: FormFieldProps) {
  const [error, setError] = useState<string | null>(null);
  
  // Custom styling based on branding
  const fieldStyle = {
    fontFamily: branding?.fontFamily || 'inherit',
    "--field-border-color": branding?.primaryColor || 'inherit'
  } as React.CSSProperties;

  // Handle validation
  const handleBlur = () => {
    if (field.required && !value) {
      setError("This field is required");
    } else {
      setError(null);
    }
  };

  // Render different field types
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <Input
            type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            onBlur={handleBlur}
            required={field.required}
            className={`w-full ${error || showError ? 'border-red-500' : ''}`}
            style={fieldStyle}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            onBlur={handleBlur}
            required={field.required}
            className={`w-full ${error || showError ? 'border-red-500' : ''}`}
            style={fieldStyle}
          />
        );
      
      case 'dropdown':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlur}
            required={field.required}
            className={`w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${error || showError ? 'border-red-500' : ''}`}
            style={fieldStyle}
          >
            <option value="" disabled>
              {field.placeholder || "Select an option"}
            </option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${index}`}
                  checked={Array.isArray(value) ? value.includes(option) : false}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange(Array.isArray(value) ? [...value, option] : [option]);
                    } else {
                      onChange(Array.isArray(value) ? value.filter(v => v !== option) : []);
                    }
                  }}
                  style={{
                    borderColor: (error || showError) ? 'red' : (branding?.primaryColor || 'inherit'),
                    ...(branding?.primaryColor ? { '--checkbox-color': branding.primaryColor } as any : {})
                  }}
                />
                <Label
                  htmlFor={`${field.id}-${index}`}
                  className="text-sm font-normal"
                  style={fieldStyle}
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );
      
      case 'radio':
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={onChange}
            className="space-y-2"
            style={fieldStyle}
          >
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  id={`${field.id}-${index}`}
                  value={option}
                  style={{
                    borderColor: (error || showError) ? 'red' : (branding?.primaryColor || 'inherit'),
                    ...(branding?.primaryColor ? { '--radio-color': branding.primaryColor } as any : {})
                  }}
                />
                <Label
                  htmlFor={`${field.id}-${index}`}
                  className="text-sm font-normal"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'file':
        return (
          <Input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              onChange(file);
            }}
            onBlur={handleBlur}
            required={field.required}
            className={`w-full ${error || showError ? 'border-red-500' : ''}`}
            style={fieldStyle}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label 
          htmlFor={field.id} 
          className={`text-sm font-medium ${field.required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}`}
          style={fieldStyle}
        >
          {field.label}
        </Label>
      </div>
      
      {renderField()}
      
      {(error || showError) && (
        <p className="text-sm text-red-500 mt-1">{errorMessage || error}</p>
      )}
    </div>
  );
}
