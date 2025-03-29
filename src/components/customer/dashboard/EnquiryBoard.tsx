
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";

export interface Enquiry {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  channel: "Website" | "Instagram" | "WhatsApp" | "Facebook";
  date: string;
  customerName: string;
}

export function EnquiryBoard() {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">Enquiry Board</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/customer/enquiries" className="flex items-center">
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {/* Use the KanbanBoard component with readOnly and limited height */}
        <KanbanBoard isDemo={true} readOnly={true} isCompanyView={false} height="h-[400px]" />
      </CardContent>
    </Card>
  );
}
