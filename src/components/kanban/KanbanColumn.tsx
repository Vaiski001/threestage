
import { EnquiryCard } from "./EnquiryCard";
import { Plus } from "lucide-react";

interface Enquiry {
  id: string;
  title: string;
  customer: string;
  date: string;
  channel: string;
  content: string;
  priority: "high" | "medium" | "low";
}

interface KanbanColumnProps {
  title: string;
  count: number;
  color: string;
  enquiries: Enquiry[];
  onDragStart: (e: React.DragEvent, id: string, fromColumn: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, column: string) => void;
  columnId: string;
}

export function KanbanColumn({
  title,
  count,
  color,
  enquiries,
  onDragStart,
  onDragOver,
  onDrop,
  columnId
}: KanbanColumnProps) {
  return (
    <div
      className="flex flex-col h-[calc(100vh-200px)] glass-card rounded-lg shadow-sm border border-gray-100 dark:border-gray-800"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, columnId)}
    >
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full bg-${color} mr-3`}></div>
          <h3 className="font-medium">{title}</h3>
          <span className="ml-2 text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-0.5">
            {count}
          </span>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-all-200 p-1 rounded-md hover:bg-secondary">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="p-2 flex-1 overflow-y-auto space-y-2">
        {enquiries.map((enquiry) => (
          <EnquiryCard
            key={enquiry.id}
            enquiry={enquiry}
            onDragStart={(e) => onDragStart(e, enquiry.id, columnId)}
          />
        ))}
      </div>
    </div>
  );
}
