import { User, Mail, Phone, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CustomerCardProps {
  customer: {
    id: string;
    name: string;
    company: string;
    enquiries: number;
    lastActive: string;
  };
}

export const CustomerCard = ({ customer }: CustomerCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Determine if the customer is active based on their last active status
  const isActive = 
    customer.lastActive.includes("hour") || 
    customer.lastActive === "Just now";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
              {getInitials(customer.name)}
            </div>
            <div>
              <h3 className="font-medium">{customer.name}</h3>
              <p className="text-sm text-muted-foreground">{customer.company}</p>
            </div>
          </div>
          <Badge variant={isActive ? "default" : "outline"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-2">
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{customer.name.toLowerCase().replace(" ", ".")}@example.com</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>+1 (555) 123-{Math.floor(Math.random() * 9000) + 1000}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Last active: {customer.lastActive}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="text-sm">
          <span className="font-medium">{customer.enquiries}</span> enquiries
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            View
          </Button>
          <Button variant="outline" size="sm">
            Contact
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}; 