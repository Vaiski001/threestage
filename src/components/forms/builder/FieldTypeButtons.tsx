
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormFieldType } from "@/lib/supabase/types";

interface FieldTypeButtonsProps {
  onAddField: (type: FormFieldType) => void;
}

export function FieldTypeButtons({ onAddField }: FieldTypeButtonsProps) {
  const fieldTypes: { type: FormFieldType; label: string }[] = [
    { type: 'text', label: 'Text' },
    { type: 'email', label: 'Email' },
    { type: 'phone', label: 'Phone' },
    { type: 'textarea', label: 'Textarea' },
    { type: 'dropdown', label: 'Dropdown' },
    { type: 'checkbox', label: 'Checkbox' },
    { type: 'radio', label: 'Radio' },
    { type: 'file', label: 'File Upload' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {fieldTypes.map(({ type, label }) => (
        <Button 
          key={type} 
          variant="outline" 
          size="sm" 
          onClick={() => onAddField(type)}
        >
          <Plus className="mr-1 h-3 w-3" />
          {label}
        </Button>
      ))}
    </div>
  );
}
