
import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  company: string;
  message: string;
  date: string;
  status: "new" | "read";
}

interface NotificationsSectionProps {
  notifications?: Notification[];
}

export const NotificationsSection = ({ notifications = [] }: NotificationsSectionProps) => {
  const isEmpty = notifications.length === 0;

  return (
    <Container size="full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Notifications</h2>
        {!isEmpty && (
          <Button variant="ghost" size="sm" className="text-primary">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>

      {isEmpty ? (
        <div className="glass-card rounded-lg p-6 text-center">
          <p className="text-muted-foreground">You don't have any notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card key={notification.id} className="overflow-hidden">
              <div className="flex items-start p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{notification.company}</span>
                    {notification.status === "new" && (
                      <Badge variant="default" className="bg-primary text-xs">New</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};
