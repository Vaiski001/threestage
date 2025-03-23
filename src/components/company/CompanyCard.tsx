
import React from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from "@/lib/supabase/types";
import { Building, MapPin, Link as LinkIcon, ArrowRight, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CompanyCardProps {
  company: UserProfile;
  compact?: boolean;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company, compact = false }) => {
  return (
    <Card className={`h-full flex flex-col ${compact ? 'p-2' : ''}`}>
      <CardHeader className={compact ? 'p-3' : undefined}>
        <CardTitle>{company.company_name || "Unnamed Company"}</CardTitle>
        <CardDescription>
          {company.industry ? (
            <div className="flex items-center gap-1 mt-1">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{company.industry}</span>
            </div>
          ) : null}
        </CardDescription>
      </CardHeader>
      
      <CardContent className={`flex-1 ${compact ? 'p-3 pt-0' : ''}`}>
        <div className="space-y-3">
          {company.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground truncate">{company.address}</span>
            </div>
          )}
          
          {company.website && (
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <a 
                href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm hover:underline text-blue-500 truncate"
              >
                {typeof company.website === 'string' ? company.website.replace(/^https?:\/\//, '') : ''}
              </a>
            </div>
          )}
          
          {company.email && !compact && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <a 
                href={`mailto:${company.email}`}
                className="text-sm hover:underline text-blue-500 truncate"
              >
                {company.email}
              </a>
            </div>
          )}
          
          {company.phone && !compact && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <a 
                href={`tel:${company.phone}`}
                className="text-sm hover:underline text-blue-500"
              >
                {company.phone}
              </a>
            </div>
          )}

          {company.services && !compact && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Services</p>
              <div className="flex flex-wrap gap-2">
                {typeof company.services === 'string' ? company.services.split(',').map((service, index) => (
                  <Badge key={index} variant="secondary">
                    {service.trim()}
                  </Badge>
                )) : null}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className={compact ? 'p-3 pt-0' : undefined}>
        <Link to={`/companies/${company.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Company
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
