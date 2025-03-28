
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { FormTemplate } from "@/lib/supabase/types";
import { getCompanyForms } from "@/lib/supabase/forms";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price?: string;
  category?: string;
  linkedForms?: string[];
}

interface FormServiceLinkProps {
  services: ServiceItem[];
  onUpdate: (services: ServiceItem[]) => void;
}

export function FormServiceLink({ services, onUpdate }: FormServiceLinkProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [updatedServices, setUpdatedServices] = useState<ServiceItem[]>(services);
  
  // Fetch company's forms
  const { data: forms = [], isLoading } = useQuery({
    queryKey: ['forms', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await getCompanyForms(user.id);
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    setUpdatedServices(services);
  }, [services]);

  // Toggle a form link for a service
  const toggleFormLink = (serviceId: string, formId: string) => {
    setUpdatedServices(prevServices => 
      prevServices.map(service => {
        if (service.id === serviceId) {
          const linkedForms = service.linkedForms || [];
          const updatedForms = linkedForms.includes(formId)
            ? linkedForms.filter(id => id !== formId)
            : [...linkedForms, formId];
          
          return { ...service, linkedForms: updatedForms };
        }
        return service;
      })
    );
  };

  // Save the updated services
  const handleSave = () => {
    onUpdate(updatedServices);
    
    // Also update form-service links in the database for easier queries
    updatedServices.forEach(service => {
      const formIds = service.linkedForms || [];
      
      formIds.forEach(async formId => {
        try {
          // Update forms with service information
          await supabase
            .from('forms')
            .update({ 
              service_id: service.id,
              service_name: service.title
            })
            .eq('id', formId);
        } catch (error) {
          console.error(`Error updating form ${formId} with service info:`, error);
        }
      });
    });
    
    toast({
      title: "Form Links Updated",
      description: "Service and form connections have been updated."
    });
  };

  if (isLoading) {
    return <div>Loading forms...</div>;
  }

  if (!forms.length) {
    return (
      <div className="text-center p-4 border rounded-md">
        <p className="mb-4">You don't have any forms to link to your services yet.</p>
        <Button variant="outline" onClick={() => window.location.href = '/company/forms'}>
          Create Forms
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Link Forms to Services</h3>
      <p className="text-sm text-muted-foreground">
        Connect forms to specific services to organize incoming enquiries.
      </p>
      
      <div className="space-y-4">
        {updatedServices.map(service => (
          <div key={service.id} className="border rounded-md p-4">
            <h4 className="font-medium mb-2">{service.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Available Forms:</p>
              {forms.map(form => (
                <div key={form.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${service.id}-${form.id}`}
                    checked={(service.linkedForms || []).includes(form.id)}
                    onCheckedChange={() => toggleFormLink(service.id, form.id)}
                  />
                  <label
                    htmlFor={`${service.id}-${form.id}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {form.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <Button onClick={handleSave}>Save Form Links</Button>
    </div>
  );
}
