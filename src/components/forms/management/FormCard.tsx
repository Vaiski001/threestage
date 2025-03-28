
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Copy, Code, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { FormTemplate } from "@/lib/supabase/types";

interface FormCardProps {
  form: FormTemplate;
  onEdit: (form: FormTemplate) => void;
  onPreview: (form: FormTemplate) => void;
  onDuplicate: (form: FormTemplate) => void;
  onShowIntegration: (form: FormTemplate) => void;
  onDelete: (formId: string) => void;
  onToggleActive: (formId: string, currentStatus: boolean) => void;
}

export function FormCard({
  form,
  onEdit,
  onPreview,
  onDuplicate,
  onShowIntegration,
  onDelete,
  onToggleActive
}: FormCardProps) {
  return (
    <Card key={form.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{form.name}</CardTitle>
            <CardDescription className="mt-1">{form.description}</CardDescription>
          </div>
          <div className="flex">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onToggleActive(form.id, !!form.is_public)}
            >
              {form.is_public ? (
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
          <div>Created: {new Date(form.created_at).toLocaleDateString()}</div>
          <div>Last Updated: {new Date(form.updated_at).toLocaleDateString()}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-2 border-t">
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(form)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onPreview(form)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDuplicate(form)}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onShowIntegration(form)}>
            <Code className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(form.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
