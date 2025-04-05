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
    try {
      // Check if dateString is a valid date string
      if (!dateString || isNaN(Date.parse(dateString))) {
        return "Invalid date";
      }
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const priorityColors = {
    high: "text-red-500 bg-red-50 border-red-200",
    medium: "text-amber-500 bg-amber-50 border-amber-200",
    low: "text-green-500 bg-green-50 border-green-200"
  };
  
  const channelColors = {
    Website: "text-purple-500 bg-purple-50 border-purple-200",
    WhatsApp: "text-green-500 bg-green-50 border-green-200",
    Facebook: "text-blue-500 bg-blue-50 border-blue-200",
    Instagram: "text-pink-500 bg-pink-50 border-pink-200"
  };

  return (
    <div
      draggable={!readOnly}
      onDragStart={onDragStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg p-4 ${
        !readOnly ? 'cursor-grab active:cursor-grabbing' : ''
      } transition-all duration-200 hover:shadow-md hover:-translate-y-1 overflow-hidden`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm">{enquiry.title}</h4>
        {!readOnly && (
          <div className="relative">
            <button className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-md transition-colors duration-200">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      
      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-3">{enquiry.content}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[enquiry.priority]}`}>
          {enquiry.priority.charAt(0).toUpperCase() + enquiry.priority.slice(1)}
        </span>
        
        <span className={`text-xs px-2 py-0.5 rounded-full border ${
          channelColors[enquiry.channel as keyof typeof channelColors] || 
          "text-gray-500 bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
        }`}>
          {enquiry.channel}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
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
