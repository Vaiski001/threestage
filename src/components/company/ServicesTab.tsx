
import { useState, useEffect } from "react";
import { FormLabel } from "@/components/ui/form-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash, Plus } from "lucide-react";
import { UserProfile } from "@/lib/supabase/types";
import { useToast } from "@/hooks/use-toast";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price?: string;
  image?: string;
  category?: string;
}

interface ServicesTabProps {
  profile: UserProfile | null;
  onUpdate: (values: any) => void;
}

export function ServicesTab({ profile, onUpdate }: ServicesTabProps) {
  const { toast } = useToast();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  // Initialize with profile data or defaults
  useEffect(() => {
    if (profile?.profile_services) {
      setServices(
        profile.profile_services.map((service, index) => ({
          id: `service-${index}`,
          title: service.title,
          description: service.description,
          price: service.price || "",
          image: service.image,
          category: service.category || "",
        }))
      );
    } else {
      // Add default placeholder services if none exist
      setServices([
        {
          id: "service-1",
          title: "Service 1",
          description: "Description of service 1 and what it includes.",
          price: "$99"
        },
        {
          id: "service-2",
          title: "Service 2",
          description: "Description of service 2 and what it includes.",
          price: "$149"
        },
        {
          id: "service-3",
          title: "Service 3",
          description: "Description of service 3 and what it includes.",
          price: "Contact for pricing"
        }
      ]);
    }
  }, [profile]);

  // Update parent component when services change
  useEffect(() => {
    onUpdate({
      profile_services: services.map(({ id, ...service }) => service)
    });
  }, [services, onUpdate]);

  const handleAddService = () => {
    const newId = `service-${services.length + 1}`;
    const newService = {
      id: newId,
      title: `New Service`,
      description: "Description of what this service includes",
      price: "Starting at $X",
      category: selectedCategory
    };
    
    setServices([...services, newService]);
    
    toast({
      title: "Service added",
      description: "New service has been added to your profile",
    });
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
    
    toast({
      title: "Service deleted",
      description: "The service has been removed from your profile",
    });
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
    </div>
  );
}
