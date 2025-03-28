
import { useState, useEffect } from "react";
import { FormLabel } from "@/components/ui/form-label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash, Plus, Link } from "lucide-react";
import { UserProfile } from "@/lib/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormServiceLink } from "@/components/forms/FormServiceLink";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price?: string;
  image?: string;
  category?: string;
  linkedForms?: string[];
}

interface ServicesTabProps {
  profile: UserProfile | null;
  onUpdate: (values: any) => void;
}

export function ServicesTab({ profile, onUpdate }: ServicesTabProps) {
  const { toast } = useToast();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("services");
  const [hasUpdated, setHasUpdated] = useState(false);
  
  // Initialize with profile data or empty array
  useEffect(() => {
    try {
      if (profile?.profile_services_json) {
        try {
          // Safely parse the JSON string with error handling
          let parsedServices = [];
          
          if (typeof profile.profile_services_json === 'string') {
            parsedServices = JSON.parse(profile.profile_services_json);
          } else if (Array.isArray(profile.profile_services_json)) {
            parsedServices = profile.profile_services_json;
          }
            
          if (Array.isArray(parsedServices)) {
            setServices(
              parsedServices.map((service, index) => ({
                id: service.id || `service-${index}`,
                title: service.title || "",
                description: service.description || "",
                price: service.price || "",
                image: service.image || "",
                category: service.category || "",
                linkedForms: service.linkedForms || [],
              }))
            );
          } else {
            setServices([]);
          }
        } catch (e) {
          console.error("Error parsing services JSON:", e);
          setServices([]);
        }
      } else {
        // Initialize with empty array
        setServices([]);
      }
    } catch (error) {
      console.error("Error processing services:", error);
      setServices([]);
    }
  }, [profile]);

  // Only update when explicitly requested (not on every services change)
  const handleUpdateServices = () => {
    try {
      const servicesData = services.map(({ id, ...service }) => ({ id, ...service }));
      
      // Store services as a JSON string to work with any database schema
      onUpdate({
        profile_services_json: JSON.stringify(servicesData)
      });
      
      setHasUpdated(true);
      
      toast({
        title: "Services updated",
        description: "Your service offerings have been saved.",
      });
    } catch (error) {
      console.error("Error updating services:", error);
      toast({
        title: "Update failed",
        description: "There was a problem saving your services.",
        variant: "destructive"
      });
    }
  };

  const handleAddService = () => {
    const newId = `service-${Date.now()}`;
    const newService = {
      id: newId,
      title: `New Service`,
      description: "Description of what this service includes",
      price: "$0",
      category: selectedCategory,
      linkedForms: []
    };
    
    setServices([...services, newService]);
    setHasUpdated(false);
  };

  const handleEditService = (id: string) => {
    toast({
      title: "Edit service",
      description: "Service editing functionality will be implemented in a future update",
    });
    // In a real implementation, you'd open a modal or form to edit the service
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
    setHasUpdated(false);
    
    toast({
      title: "Service deleted",
      description: "The service has been removed from your profile",
    });
  };

  // Update form links for services
  const handleUpdateFormLinks = (updatedServices: ServiceItem[]) => {
    setServices(updatedServices);
    setHasUpdated(false);
  };

  const categories = [
    "Consulting",
    "Development",
    "Design",
    "Marketing",
    "Support",
    "Training",
    "Other"
  ];

  return (
    <div className="p-6 bg-white rounded-lg border">
      <h2 className="text-2xl font-bold mb-6">Services & Offerings</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="forms">Form Integration</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <TabsContent value="services" className="mt-0">
        <div className="mb-6">
          <FormLabel htmlFor="service-category">Service Categories</FormLabel>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="service-category" className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Services</h3>
          <Button onClick={handleAddService} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
        
        <div className="space-y-4">
          {services.map(service => (
            <div key={service.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg">{service.title}</h4>
                  <p className="text-gray-600 my-1">{service.description}</p>
                  <p className="font-medium">{service.price}</p>
                  {service.category && (
                    <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs mt-2">
                      {service.category}
                    </span>
                  )}
                  {service.linkedForms && service.linkedForms.length > 0 && (
                    <div className="mt-2 flex items-center text-xs text-blue-600">
                      <Link className="h-3 w-3 mr-1" />
                      {service.linkedForms.length} form(s) linked
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEditService(service.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {services.length === 0 && (
          <div className="p-8 text-center border border-dashed rounded-lg bg-gray-50">
            <p className="text-gray-500">You haven't added any services yet.</p>
            <p className="text-gray-500 mb-4">Add services to showcase what your company offers.</p>
            <Button onClick={handleAddService} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Service
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="forms" className="mt-0">
        {services.length === 0 ? (
          <div className="p-8 text-center border border-dashed rounded-lg bg-gray-50">
            <p className="text-gray-500">You need to add services before linking forms.</p>
            <Button onClick={() => setActiveTab("services")} size="sm">
              Go to Services
            </Button>
          </div>
        ) : (
          <FormServiceLink 
            services={services}
            onUpdate={handleUpdateFormLinks}
          />
        )}
      </TabsContent>
      
      <div className="mt-6">
        <Button 
          onClick={handleUpdateServices}
          disabled={hasUpdated && services.length === 0}
          className="w-full md:w-auto"
        >
          Save Services
        </Button>
      </div>
    </div>
  );
}
