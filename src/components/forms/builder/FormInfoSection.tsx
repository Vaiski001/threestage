
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FormLabel } from "@/components/ui/form-label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FormTemplate } from "@/lib/supabase/types";

interface FormInfoSectionProps {
  formData: FormTemplate;
  updateFormInfo: (field: keyof FormTemplate, value: any) => void;
}

export function FormInfoSection({ formData, updateFormInfo }: FormInfoSectionProps) {
  return (
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
  );
}
