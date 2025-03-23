
import { MessageSquare, Calendar, MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface Enquiry {
  id: string;
  title: string;
  customer: string;
  date: string;
  channel: string;
  content: string;
  priority: "high" | "medium" | "low";
}

interface EnquiryCardProps {
  enquiry: Enquiry;
  onDragStart?: (e: React.DragEvent) => void;
  readOnly?: boolean;
}

export function EnquiryCard({ enquiry, onDragStart, readOnly = false }: EnquiryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  const priorityColors = {
    high: "text-red-500 bg-red-50 dark:bg-red-950/30",
    medium: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
    low: "text-green-500 bg-green-50 dark:bg-green-950/30"
  };
  
  const channelColors = {
    Website: "text-purple-500 bg-purple-50 dark:bg-purple-950/30",
    WhatsApp: "text-green-500 bg-green-50 dark:bg-green-950/30",
    Facebook: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
    Instagram: "text-pink-500 bg-pink-50 dark:bg-pink-950/30"
  };

  return (
    <div
      draggable={!readOnly}
      onDragStart={onDragStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`glass-card rounded-lg p-3 ${!readOnly ? 'cursor-grab active:cursor-grabbing' : ''} transition-all-200 hover:shadow-md hover:-translate-y-1 overflow-hidden`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm">{enquiry.title}</h4>
        {!readOnly && (
          <div className="relative">
            <button className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-all-200">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      
      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{enquiry.content}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[enquiry.priority]}`}>
          {enquiry.priority.charAt(0).toUpperCase() + enquiry.priority.slice(1)}
        </span>
        
        <span className={`text-xs px-2 py-0.5 rounded-full ${channelColors[enquiry.channel as keyof typeof channelColors]}`}>
          {enquiry.channel}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-3 w-3" />
          <span>{enquiry.customer}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(enquiry.date)}</span>
        </div>
      </div>
    </div>
  );
}
