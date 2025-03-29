
import { Button } from "@/components/ui/button";
import { Save, X, Eye, Edit, Loader2 } from "lucide-react";

interface FormBuilderHeaderProps {
  isNewForm: boolean;
  onSave: () => void;
  onCancel: () => void;
  togglePreview: () => void;
  showPreview: boolean;
  isProcessing?: boolean;
}

export function FormBuilderHeader({
  isNewForm,
  onSave,
  onCancel,
  togglePreview,
  showPreview,
  isProcessing = false
}: FormBuilderHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        {isNewForm ? 'Create New Form' : 'Edit Form'}
      </h1>
      <div className="flex gap-2">
        {showPreview ? (
          <Button onClick={togglePreview} variant="outline" disabled={isProcessing}>
            <Edit className="mr-2 h-4 w-4" />
            Back to Editor
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={togglePreview} disabled={isProcessing}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button onClick={onSave} disabled={isProcessing}>
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isProcessing ? 'Saving...' : 'Save Form'}
            </Button>
            <Button variant="ghost" onClick={onCancel} disabled={isProcessing}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
