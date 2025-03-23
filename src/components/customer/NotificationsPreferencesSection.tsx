
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";

export const NotificationsPreferencesSection = () => {
  return (
    <Container size="full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Notifications</h1>
          <p className="text-muted-foreground">Manage your alerts and notification preferences</p>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-8">
        <h3 className="text-xl font-medium mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Email notifications</span>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Push notifications</span>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
        </div>
      </div>
    </Container>
  );
};
