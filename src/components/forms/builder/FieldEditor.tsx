
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form-label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FormField } from "@/lib/supabase/types";
import { Plus, X } from "lucide-react";

interface FieldEditorProps {
  field: FormField;
  updateField: (fieldId: string, property: keyof FormField, value: any) => void;
  updateFieldOption: (fieldId: string, index: number, value: string) => void;
  addFieldOption: (fieldId: string) => void;
  removeFieldOption: (fieldId: string, index: number) => void;
}

export function FieldEditor({ 
  field, 
  updateField, 
  updateFieldOption, 
  addFieldOption, 
  removeFieldOption 
}: FieldEditorProps) {
  return (
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
  );
}
