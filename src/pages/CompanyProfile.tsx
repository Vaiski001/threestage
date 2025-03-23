
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { UserProfile, FormTemplate } from "@/lib/supabase/types";
import { FormPreview } from "@/components/forms/FormPreview";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Link as LinkIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  ArrowLeft, 
  Globe, 
  Star,
  Upload
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CompanyProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);
  const [currentTab, setCurrentTab] = useState("about");
  
  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formService, setFormService] = useState("");
  const [formMessage, setFormMessage] = useState("");
  
  // Fetch company profile
  const { data: company, isLoading: isLoadingCompany } = useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      // In a real app, we would fetch from Supabase
      // For now, use mock data
      const mockCompany: UserProfile = {
        id: id || '1',
        email: 'contact@acmecorp.com',
        name: 'John Smith',
        role: 'company',
        company_name: 'Acme Corporation',
        industry: 'Technology',
        website: 'acmecorp.com',
        phone: '(123) 456-7890',
        address: '123 Tech Lane, Silicon Valley, CA',
        services: 'Web Development,Mobile Apps,Cloud Solutions,IT Consulting',
        created_at: '2023-01-15',
        profile_description: 'Acme Corporation is a leading technology company specializing in innovative solutions for businesses of all sizes. Our mission is to empower organizations through cutting-edge technology and exceptional service.',
        profile_services: [
          {
            title: 'Web Development',
            description: 'Custom websites and web applications',
            image: undefined
          },
          {
            title: 'Mobile Apps',
            description: 'iOS and Android application development',
            image: undefined
          },
          {
            title: 'Cloud Solutions',
            description: 'Scalable cloud infrastructure and migration',
            image: undefined
          },
          {
            title: 'IT Consulting',
            description: 'Strategic technology planning and advice',
            image: undefined
          }
        ]
      };
      
      return mockCompany;
    },
    enabled: !!id
  });
  
  // Handle inquiry form submission
  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would send this to an API endpoint
    console.log({
      name: formName,
      email: formEmail,
      phone: formPhone,
      service: formService,
      message: formMessage,
      companyId: id
    });
    
    // Clear the form
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormService("");
    setFormMessage("");
    
    // Show success message (in a real app, this would be a toast notification)
    alert("Your inquiry has been submitted. We'll get back to you soon!");
  };
  
  // Custom reviews section
  const reviews = [
    {
      id: '1',
      name: 'Sarah Johnson',
      date: 'March 10, 2023',
      rating: 5,
      comment: 'Acme Corporation exceeded our expectations with their web development services. The team was responsive, professional, and delivered our project ahead of schedule.'
    },
    {
      id: '2',
      name: 'Michael Chen',
      date: 'February 22, 2023',
      rating: 4,
      comment: 'Great experience working with Acme on our mobile app. The only reason for 4 stars instead of 5 is that we had a few minor design changes that took longer than expected, but the final product was excellent.'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      date: 'January 15, 2023',
      rating: 5,
      comment: 'The IT consulting services provided by Acme helped transform our business operations. Highly recommended.'
    }
  ];
  
  // Set a custom style based on company branding
  const companyStyle = {
    "--company-primary-color": company?.profile_color_scheme || '#0070f3'
  } as React.CSSProperties;
  
  return (
    <div className="flex flex-col bg-gray-50" style={companyStyle}>
      {/* Company banner */}
      <div className="w-full h-60 bg-gray-200 relative">
        {company?.profile_banner ? (
          <img 
            src={company.profile_banner} 
            alt={`${company.company_name} banner`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-gray-600/20" />
          </div>
        )}
      </div>
      
      <div className="container mx-auto px-4 -mt-16 mb-10 relative z-10">
        {/* Company logo and name section */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 mb-8">
          <div className="w-32 h-32 bg-white rounded-lg shadow-md flex items-center justify-center border-4 border-white">
            {company?.profile_banner ? (
              <img 
                src={company.profile_banner} 
                alt={`${company.company_name} logo`} 
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <Building className="w-16 h-16 text-gray-400" />
            )}
          </div>
          
          <div className="flex-1">
            {isLoadingCompany ? (
              <Skeleton className="h-10 w-64" />
            ) : (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <h1 className="text-2xl font-bold">{company?.company_name || "Unnamed Company"}</h1>
                    {company?.industry && (
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="text-xs">
                          {company.industry}
                        </Badge>
                        <div className="flex items-center ml-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              className="h-3.5 w-3.5" 
                              fill={star <= 4 ? "currentColor" : "none"}
                              color={star <= 4 ? "#FFD700" : "#D1D5DB"}
                            />
                          ))}
                          <span className="text-xs ml-1 text-gray-500">(42)</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button className="whitespace-nowrap">
                    <span className="hidden sm:inline-block mr-1">Follow</span> Company
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* About section */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                {company?.profile_description ? (
                  <p className="text-gray-700">{company.profile_description}</p>
                ) : (
                  <p className="text-muted-foreground">This company hasn't added a description yet.</p>
                )}
                
                {company && (
                  <div className="mt-6 space-y-3">
                    {company.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-500" />
                        <a href={`tel:${company.phone}`} className="text-blue-600 hover:underline">
                          {company.phone}
                        </a>
                      </div>
                    )}
                    
                    {company.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-500" />
                        <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline">
                          {company.email}
                        </a>
                      </div>
                    )}
                    
                    {company.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-gray-500" />
                        <a 
                          href={typeof company.website === 'string' ? (company.website.startsWith('http') ? company.website : `https://${company.website}`) : '#'} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline"
                        >
                          {typeof company.website === 'string' ? company.website : ''}
                        </a>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Social media links */}
                {company?.profile_social_links && (
                  <div className="flex gap-4 mt-6">
                    <a href="#" className="text-gray-500 hover:text-blue-600">
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-blue-400">
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-blue-700">
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-pink-600">
                      <Instagram className="h-5 w-5" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Services section */}
            <Card>
              <CardHeader>
                <CardTitle>Services & Offerings</CardTitle>
              </CardHeader>
              <CardContent>
                {company?.profile_services && company.profile_services.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {company.profile_services.map((service, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h3 className="font-semibold text-lg mb-1">{service.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">This company hasn't added any services yet.</p>
                )}
              </CardContent>
            </Card>
            
            {/* Customer Interactions/Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>See what others are saying</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <div className="px-3 py-1 border rounded-full text-sm cursor-pointer hover:bg-gray-100">
                    All Reviews
                  </div>
                  <div className="px-3 py-1 border rounded-full text-sm cursor-pointer hover:bg-gray-100">
                    5 Star
                  </div>
                  <div className="px-3 py-1 border rounded-full text-sm cursor-pointer hover:bg-gray-100">
                    4 Star
                  </div>
                </div>
                
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="pb-6 border-b last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 text-center flex items-center justify-center text-xs font-medium">
                          {review.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium">{review.name}</div>
                          <div className="text-xs text-gray-500">{review.date}</div>
                        </div>
                      </div>
                      
                      <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className="h-4 w-4" 
                            fill={star <= review.rating ? "currentColor" : "none"}
                            color={star <= review.rating ? "#FFD700" : "#D1D5DB"}
                          />
                        ))}
                      </div>
                      
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline">Add Review</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Inquiry form */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Send an Inquiry</CardTitle>
                <CardDescription>
                  Fill out the form below to get in touch with {company?.company_name || "this company"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      placeholder="(123) 456-7890" 
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service">Service Interested In</Label>
                    <Select value={formService} onValueChange={setFormService}>
                      <SelectTrigger id="service">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web-development">Web Development</SelectItem>
                        <SelectItem value="mobile-apps">Mobile Apps</SelectItem>
                        <SelectItem value="cloud-solutions">Cloud Solutions</SelectItem>
                        <SelectItem value="it-consulting">IT Consulting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us about your project or inquiry..." 
                      rows={4}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="attachments">Attachments (Optional)</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Upload files (5 MB max)</p>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">Submit Inquiry</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Back button */}
        <div className="mt-8">
          <Link to="/companies" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
