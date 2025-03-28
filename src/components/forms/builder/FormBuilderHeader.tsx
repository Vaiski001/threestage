
import { Button } from "@/components/ui/button";
import { Save, X, Eye, Edit } from "lucide-react";
import { FormTemplate } from "@/lib/supabase/types";

interface FormBuilderHeaderProps {
  isNewForm: boolean;
  onSave: () => void;
  onCancel: () => void;
  togglePreview: () => void;
  showPreview: boolean;
}

export function FormBuilderHeader({
  isNewForm,
  onSave,
  onCancel,
  togglePreview,
  showPreview
}: FormBuilderHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        {isNewForm ? 'Create New Form' : 'Edit Form'}
      </h1>
      <div className="flex gap-2">
        {showPreview ? (
          <Button onClick={togglePreview} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Back to Editor
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={togglePreview}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button onClick={onSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Form
            </Button>
            <Button variant="ghost" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
