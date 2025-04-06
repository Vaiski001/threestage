import { AppLayout } from "@/components/layout/AppLayout";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell } from "lucide-react";

export default function CustomerSettings() {
  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Settings</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
            </Button>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <Container>
            <div className="mb-6">
              <h1 className="text-2xl font-semibold mb-1">Account Settings</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full max-w-3xl mb-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Profile Information</h3>
                  <p className="text-muted-foreground">Manage your profile information and preferences</p>
                </div>
              </TabsContent>
              <TabsContent value="security">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Security Settings</h3>
                  <p className="text-muted-foreground">Update your security preferences</p>
                </div>
              </TabsContent>
              <TabsContent value="notifications">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
                  <p className="text-muted-foreground">Manage your notification preferences</p>
                </div>
              </TabsContent>
              <TabsContent value="billing">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Billing Information</h3>
                  <p className="text-muted-foreground">Manage your billing details and subscription</p>
                </div>
              </TabsContent>
            </Tabs>
          </Container>
        </main>
      </div>
    </AppLayout>
  );
}
