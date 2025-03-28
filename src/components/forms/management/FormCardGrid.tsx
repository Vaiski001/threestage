
import { Card, CardContent } from "@/components/ui/card";
import { FormTemplate } from "@/lib/supabase/types";
import { FormCard } from "./FormCard";

interface FormCardGridProps {
  isLoading: boolean;
  forms: FormTemplate[];
  onEdit: (form: FormTemplate) => void;
  onPreview: (form: FormTemplate) => void;
  onDuplicate: (form: FormTemplate) => void;
  onShowIntegration: (form: FormTemplate) => void;
  onDelete: (formId: string) => void;
  onToggleActive: (formId: string, currentStatus: boolean) => void;
}

export function FormCardGrid({
  isLoading,
  forms,
  onEdit,
  onPreview,
  onDuplicate,
  onShowIntegration,
  onDelete,
  onToggleActive
}: FormCardGridProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p>Loading forms...</p>
      </div>
    );
  }

  if (forms.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p>No forms found. Create your first form to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {forms.map((form) => (
        <FormCard
          key={form.id}
          form={form}
          onEdit={onEdit}
          onPreview={onPreview}
          onDuplicate={onDuplicate}
          onShowIntegration={onShowIntegration}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
}
