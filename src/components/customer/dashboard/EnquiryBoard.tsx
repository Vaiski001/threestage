
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { EnquiryColumn } from "./EnquiryColumn";
import { Link } from "react-router-dom";

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
  // Empty state for a new account
  const enquiries: Record<string, Enquiry[]> = {
    new: [],
    pending: [],
    completed: []
  };

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
        {Object.values(enquiries).some(column => column.length > 0) ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <EnquiryColumn 
              title="New" 
              enquiries={enquiries.new} 
              badgeColor="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" 
            />
            <EnquiryColumn 
              title="Pending" 
              enquiries={enquiries.pending} 
              badgeColor="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" 
            />
            <EnquiryColumn 
              title="Completed" 
              enquiries={enquiries.completed} 
              badgeColor="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No enquiries yet</p>
            <Button asChild>
              <Link to="/companies">Create Your First Enquiry</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
