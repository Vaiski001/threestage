
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/lib/supabase/types";
import { FormTemplate } from "@/components/forms/FormManagement";
import { FormPreview } from "@/components/forms/FormPreview";
import { Building, Link as LinkIcon, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const CompanyProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);
  
  // Fetch company profile
  const { data: company, isLoading: isLoadingCompany } = useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('role', 'company')
        .single();
      
      if (error) {
        console.error("Error fetching company:", error);
        throw error;
      }
      
      return data as UserProfile;
    },
    enabled: !!id
  });
  
  // Fetch company's forms
  const { data: forms, isLoading: isLoadingForms } = useQuery({
    queryKey: ['companyForms', id],
    queryFn: async () => {
      // For now, we'll use mock data since we don't have a forms table in Supabase yet
      // In a real implementation, you would fetch from Supabase
      const mockForms: FormTemplate[] = [
        {
          id: '1',
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
        },
        {
          id: '2',
          name: 'Quote Request',
          description: 'Request a quote for our services',
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
              id: 'service',
              type: 'select',
              label: 'Service Interested In',
              options: ['Consulting', 'Development', 'Support'],
              required: true,
            },
            {
              id: 'budget',
              type: 'select',
              label: 'Budget Range',
              options: ['$1,000 - $5,000', '$5,000 - $10,000', '$10,000+'],
              required: false,
            },
            {
              id: 'details',
              type: 'textarea',
              label: 'Project Details',
              placeholder: 'Tell us about your project requirements',
              required: true,
            }
          ],
          branding: {
            primaryColor: '#0070f3',
            fontFamily: 'Inter, sans-serif',
          }
        }
      ];
      
      // In the future, this will be a real Supabase query
      return mockForms;
    },
    enabled: !!id
  });
  
  // Handle back to form list
  const handleBackToList = () => {
    setSelectedForm(null);
  };
  
  // Show specific form or list of forms
  const renderContent = () => {
    if (selectedForm) {
      return (
        <div className="container mx-auto px-4 py-6">
          <FormPreview 
            form={selectedForm} 
            onClose={handleBackToList} 
            isEmbedded={true} 
          />
        </div>
      );
    }
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/companies" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Link>
          
          {isLoadingCompany ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          ) : company ? (
            <div>
              <h1 className="text-3xl font-bold">{company.company_name || "Unnamed Company"}</h1>
              <div className="flex flex-wrap gap-4 mt-3">
                {company.industry && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span>{company.industry}</span>
                  </div>
                )}
                
                {company.website && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <LinkIcon className="h-4 w-4" />
                    <a 
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline text-blue-500"
                    >
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                
                {company.email && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${company.email}`} className="hover:underline text-blue-500">
                      {company.email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <h2 className="text-xl font-medium mb-2">Company not found</h2>
              <p className="text-muted-foreground">
                The company you're looking for doesn't exist or may have been removed.
              </p>
              <Link to="/companies" className="mt-4 inline-block">
                <Button>Browse All Companies</Button>
              </Link>
            </div>
          )}
        </div>
        
        {company && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6">Enquiry Forms</h2>
            
            {isLoadingForms ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4 mt-2" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : forms && forms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {forms.map((form) => (
                  <Card key={form.id}>
                    <CardHeader>
                      <CardTitle>{form.name}</CardTitle>
                      <CardDescription>{form.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {form.fields.length} fields
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={() => setSelectedForm(form)}
                      >
                        Fill Out Form
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg bg-muted/30">
                <h3 className="text-lg font-medium mb-2">No forms available</h3>
                <p className="text-muted-foreground mb-4">
                  This company hasn't published any enquiry forms yet.
                </p>
                <Link to="/companies">
                  <Button variant="outline">Browse Other Companies</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  return renderContent();
};

export default CompanyProfile;
