import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { UserProfile, FormTemplate } from "@/lib/supabase/types";
import { FormPreview } from "@/components/forms/FormPreview";
import { Building, Link as LinkIcon, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowLeft, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const CompanyProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);
  const [currentTab, setCurrentTab] = useState("about");
  
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
          description: 'General contact and enquiry form', // Ensure description is provided
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
            primaryColor: company?.profile_color_scheme || '#0070f3',
            fontFamily: 'Inter, sans-serif',
          }
        },
        {
          id: '2',
          name: 'Quote Request',
          description: 'Request a quote for our services', // Ensure description is provided
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
              type: 'dropdown', // Changed from 'select' to 'dropdown'
              label: 'Service Interested In',
              options: company?.profile_services?.map(s => s.title) || ['Consulting', 'Development', 'Support'],
              required: true,
            },
            {
              id: 'budget',
              type: 'dropdown', // Changed from 'select' to 'dropdown'
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
            primaryColor: company?.profile_color_scheme || '#0070f3',
            fontFamily: 'Inter, sans-serif',
          }
        }
      ];
      
      return mockForms;
    },
    enabled: !!id && !!company
  });
  
  // Handle back to form list
  const handleBackToList = () => {
    setSelectedForm(null);
  };

  // Set a custom style based on company branding
  const companyStyle = {
    "--company-primary-color": company?.profile_color_scheme || '#0070f3'
  } as React.CSSProperties;
  
  // Show specific form or list of forms
  const renderContent = () => {
    if (selectedForm) {
      return (
        <div className="container mx-auto px-4 py-6">
          <FormPreview 
            form={selectedForm} 
            onClose={handleBackToList} 
            isEmbedded={false} 
          />
        </div>
      );
    }
    
    return (
      <div className="flex flex-col" style={companyStyle}>
        {/* Company banner */}
        <div className="w-full h-60 bg-muted relative">
          {company?.profile_banner ? (
            <img 
              src={company.profile_banner} 
              alt={`${company.company_name} banner`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/40 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white/90 px-4 text-center">
                {company?.company_name || "Company Profile"}
              </h1>
            </div>
          )}
        </div>
        
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
                      <Globe className="h-4 w-4" />
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
            <Tabs 
              value={currentTab} 
              onValueChange={setCurrentTab}
              className="mt-6"
            >
              <TabsList className="mb-6">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="forms">Enquiry Forms</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About {company.company_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {company.profile_description ? (
                      <div className="prose max-w-none">
                        <p>{company.profile_description}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">This company hasn't added a description yet.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="services" className="space-y-6">
                {company.profile_services && company.profile_services.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {company.profile_services.map((service, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>{service.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{service.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground">This company hasn't added any services yet.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="contact" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(company.profile_contact_info?.email || company.email) && (
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <h3 className="font-medium">Email</h3>
                          <a href={`mailto:${company.profile_contact_info?.email || company.email}`} className="text-blue-500 hover:underline">
                            {company.profile_contact_info?.email || company.email}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {(company.profile_contact_info?.phone || company.phone) && (
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <h3 className="font-medium">Phone</h3>
                          <a href={`tel:${company.profile_contact_info?.phone || company.phone}`} className="text-blue-500 hover:underline">
                            {company.profile_contact_info?.phone || company.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {company.profile_contact_info?.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <h3 className="font-medium">Address</h3>
                          <p>{company.profile_contact_info.address}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Social Media Links */}
                    {company.profile_social_links && Object.values(company.profile_social_links).some(link => !!link) && (
                      <>
                        <Separator className="my-4" />
                        <div className="pt-2">
                          <h3 className="font-medium mb-4">Connect With Us</h3>
                          <div className="flex gap-4">
                            {company.profile_social_links.facebook && (
                              <a 
                                href={company.profile_social_links.facebook} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                              >
                                <Facebook className="h-6 w-6" />
                              </a>
                            )}
                            {company.profile_social_links.twitter && (
                              <a 
                                href={company.profile_social_links.twitter} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                              >
                                <Twitter className="h-6 w-6" />
                              </a>
                            )}
                            {company.profile_social_links.linkedin && (
                              <a 
                                href={company.profile_social_links.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                              >
                                <Linkedin className="h-6 w-6" />
                              </a>
                            )}
                            {company.profile_social_links.instagram && (
                              <a 
                                href={company.profile_social_links.instagram} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                              >
                                <Instagram className="h-6 w-6" />
                              </a>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="forms" className="space-y-6">
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
                      <Card key={form.id} className="flex flex-col">
                        <CardHeader>
                          <CardTitle>{form.name}</CardTitle>
                          <CardDescription>{form.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <p className="text-sm text-muted-foreground">
                            {form.fields.length} fields
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="w-full" 
                            onClick={() => setSelectedForm(form)}
                            style={{ backgroundColor: company.profile_color_scheme }}
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
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    );
  };
  
  return renderContent();
};

export default CompanyProfile;
