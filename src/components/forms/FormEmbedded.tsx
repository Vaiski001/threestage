
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FormTemplate } from "@/lib/supabase/types";
import { FormPreview } from "./FormPreview";
import { Skeleton } from "@/components/ui/skeleton";
import { getFormById } from "@/lib/supabase/forms";

export function FormEmbedded() {
  const { formId } = useParams<{ formId: string }>();
  
  // Fetch form data from Supabase
  const { data: form, isLoading, error } = useQuery({
    queryKey: ['embeddedForm', formId],
    queryFn: async () => {
      if (!formId) throw new Error("Form ID is required");
      return await getFormById(formId);
    },
    enabled: !!formId,
  });
  
  if (isLoading) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full mt-4" />
        </div>
      </div>
    );
  }
  
  if (error || !form) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-medium mb-2">Form not found</h2>
        <p className="text-muted-foreground">
          The form you're looking for doesn't exist or may have been removed.
        </p>
      </div>
    );
  }
  
  return (
    <div className="max-w-xl mx-auto">
      <FormPreview form={form} onClose={() => {}} isEmbedded={true} />
    </div>
  );
}
