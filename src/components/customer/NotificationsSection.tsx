
import { Container } from "@/components/ui/Container";

interface NotificationsSectionProps {
  isEmpty: boolean;
}

export const NotificationsSection = ({ isEmpty }: NotificationsSectionProps) => {
  return (
    <Container size="full" className="mt-8">
      <div className="glass-card rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
        {isEmpty ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">You don't have any notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Notification items would go here */}
          </div>
        )}
      </div>
    </Container>
  );
};
