
import { EnquiryCard } from "./EnquiryCard";
import { Plus } from "lucide-react";

interface Enquiry {
  id: string;
  title: string;
  customer_name: string;
  created_at: string;
  form_name?: string;
  content: string;
  priority?: "high" | "medium" | "low";
  status: "new" | "pending" | "completed";
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
  readOnly?: boolean;
}

export function KanbanColumn({
  title,
  count,
  color,
  enquiries,
  onDragStart,
  onDragOver,
  onDrop,
  columnId,
  readOnly = false
}: KanbanColumnProps) {
  return (
    <div
      className="flex flex-col h-full glass-card rounded-lg shadow-sm border border-gray-100 dark:border-gray-800"
      onDragOver={!readOnly ? onDragOver : undefined}
      onDrop={!readOnly ? (e) => onDrop(e, columnId) : undefined}
    >
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full bg-${color} mr-3`}></div>
          <h3 className="font-medium">{title}</h3>
          <span className="ml-2 text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-0.5">
            {count}
          </span>
        </div>
        {!readOnly && (
          <button className="text-muted-foreground hover:text-foreground transition-all-200 p-1 rounded-md hover:bg-secondary">
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="p-2 flex-1 overflow-y-auto space-y-2">
        {enquiries.map((enquiry) => (
          <EnquiryCard
            key={enquiry.id}
            enquiry={{
              id: enquiry.id,
              title: enquiry.title,
              customer: enquiry.customer_name,
              date: new Date(enquiry.created_at).toLocaleDateString(),
              channel: enquiry.form_name || "Website",
              content: enquiry.content,
              priority: enquiry.priority || "medium"
            }}
            onDragStart={!readOnly ? (e) => onDragStart(e, enquiry.id, columnId) : undefined}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  );
}
