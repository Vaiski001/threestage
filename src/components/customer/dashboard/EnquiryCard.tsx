
import { useState } from "react";
import { Enquiry } from "./EnquiryBoard";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Instagram, Globe, Facebook, MessageCircle } from "lucide-react";

const PriorityBadge = ({ priority }: { priority: Enquiry["priority"] }) => {
  const colorMap = {
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
  };
  
  return (
    <Badge className={`${colorMap[priority]} text-xs capitalize`}>
      {priority}
    </Badge>
  );
};

const ChannelIcon = ({ channel }: { channel: Enquiry["channel"] }) => {
  const iconMap = {
    Website: <Globe className="h-3 w-3" />,
    Instagram: <Instagram className="h-3 w-3" />,
    Facebook: <Facebook className="h-3 w-3" />,
    WhatsApp: <MessageCircle className="h-3 w-3" />
  };
  
  const colorMap = {
    Website: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    Instagram: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    Facebook: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    WhatsApp: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
  };
  
  return (
    <Badge className={`${colorMap[channel]} text-xs flex items-center gap-1`}>
      {iconMap[channel]}
      <span>{channel}</span>
    </Badge>
  );
};

export function EnquiryCard({ enquiry }: { enquiry: Enquiry }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-background rounded-lg border p-3 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm">{enquiry.title}</h4>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="p-1 hover:bg-accent rounded-full"
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>
      
      <p className={`text-xs text-muted-foreground mb-2 ${!expanded ? 'line-clamp-2' : ''}`}>
        {enquiry.description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-2">
        <PriorityBadge priority={enquiry.priority} />
        <ChannelIcon channel={enquiry.channel} />
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{enquiry.customerName}</span>
        <span>{enquiry.date}</span>
      </div>
    </div>
  );
}
