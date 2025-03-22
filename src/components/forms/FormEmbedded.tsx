
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FormTemplate } from "./FormManagement";
import { FormPreview } from "./FormPreview";
import { Skeleton } from "@/components/ui/skeleton";

export function FormEmbedded() {
  const { formId } = useParams<{ formId: string }>();
  
  // Fetch form data
  // In a real implementation, this would fetch from Supabase
  const { data: form, isLoading } = useQuery({
    queryKey: ['embeddedForm', formId],
    queryFn: async () => {
      // Mock data for now
      const mockForm: FormTemplate = {
        id: formId || '1',
        name: 'Contact Form',
        description: 'General contact and enquiry form',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fields: [
          {
            id: 'name',
            type: 'text',
            label: 'Your Name',
            placeholder: 'John Doe',
            required: true,
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email Address',
            placeholder: 'john.doe@example.com',
            required: true,
          },
          {
            id: 'message',
            type: 'textarea',
            label: 'Message',
            placeholder: 'How can we help you?',
            required: true,
          }
        ],
        branding: {
          primaryColor: '#0070f3',
          fontFamily: 'Inter, sans-serif',
        }
      };
      
      // Simulate API delay
      await new Promise(r => setTimeout(r, 500));
      
      return mockForm;
    }
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
  
  if (!form) {
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

export default FormEmbedded;
