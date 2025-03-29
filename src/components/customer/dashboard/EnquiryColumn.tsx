
import { useState } from "react";
import { Enquiry } from "./EnquiryBoard";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { EnquiryCard } from "./EnquiryCard";

interface EnquiryColumnProps {
  title: string;
  enquiries: Enquiry[];
  badgeColor: string;
}

export function EnquiryColumn({ title, enquiries, badgeColor }: EnquiryColumnProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-accent/20 rounded-lg p-3">
      <div 
        className="flex items-center justify-between cursor-pointer mb-2"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center">
          <h3 className="font-medium mr-2">{title}</h3>
          <Badge className={`${badgeColor} text-xs`}>{enquiries.length}</Badge>
        </div>
        <button className="p-1 hover:bg-accent rounded-full">
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="space-y-2">
          {enquiries.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No {title.toLowerCase()} enquiries
            </div>
          ) : (
            enquiries.map(enquiry => (
              <EnquiryCard key={enquiry.id} enquiry={enquiry} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
