
import { AppLayout } from "@/components/layout/AppLayout";
import { Container } from "@/components/ui/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const CustomerSettings = () => {
  return (
    <AppLayout>
      <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="relative hidden sm:block">
            <Search className="h-4 w-4 absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 text-sm rounded-md bg-secondary/50 focus:bg-secondary border-0 focus:ring-1 focus:ring-primary/30 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <Container>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-1">Customer Settings</h1>
            <p className="text-muted-foreground">Manage your profile and preferences</p>
          </div>
          
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <Tabs defaultValue="profile">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Profile Information</h3>
                  <p className="text-muted-foreground">Coming soon: Ability to update your profile information</p>
                </div>
              </TabsContent>
              
              <TabsContent value="account">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Account Settings</h3>
                  <p className="text-muted-foreground">Coming soon: Ability to manage your account settings</p>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
                  <p className="text-muted-foreground">Coming soon: Ability to manage notification preferences</p>
                </div>
              </TabsContent>
              
              <TabsContent value="privacy">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Privacy Settings</h3>
                  <p className="text-muted-foreground">Coming soon: Ability to manage privacy settings</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Container>
      </main>
    </AppLayout>
  );
};

export default CustomerSettings;
