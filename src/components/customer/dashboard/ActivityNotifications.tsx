import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface ActivityNotificationsProps {
  emptyState?: boolean;
}

export function ActivityNotifications({ emptyState = false }: ActivityNotificationsProps) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/customer/notifications" className="flex items-center">
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {emptyState ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No activity yet</h3>
            <p className="text-muted-foreground max-w-sm">
              Your recent activities and notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { id: 1, title: "Your enquiry status updated", description: "Website Redesign enquiry status changed to 'In Progress'", time: "2 hours ago" },
              { id: 2, title: "New message received", description: "TechSolutions Inc replied to your enquiry", time: "Yesterday" },
              { id: 3, title: "Invoice received", description: "You received an invoice of $500 from Acme Design", time: "2 days ago" }
            ].map(item => (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/10 transition-colors">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
