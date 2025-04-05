import { EnquiryCard } from "./EnquiryCard";

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
  enquiries: Enquiry[];
  onDragStart: (e: React.DragEvent, id: string, fromColumn: string) => void;
  columnId: string;
  readOnly?: boolean;
}

export function KanbanColumn({
  enquiries,
  onDragStart,
  columnId,
  readOnly = false
}: KanbanColumnProps) {
  return (
    <>
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
    </>
  );
}
