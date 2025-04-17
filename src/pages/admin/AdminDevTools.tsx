import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { CodeIcon, DatabaseIcon, WrenchIcon, AlertCircleIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const AdminDevTools = () => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [devMode, setDevMode] = useState(true);

  // Function to clear database cache
  const clearCache = async () => {
    setLoading(true);
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Cache cleared",
      description: "Database cache has been successfully cleared",
    });
    setLoading(false);
  };

  // Function to set user role for testing
  const setUserRole = async (email: string, role: string) => {
    setLoading(true);
    
    toast({
      title: "Role updated",
      description: `User ${email} role set to ${role}`,
    });
    
    setLoading(false);
  };

  // Force reload app
  const forceReload = () => {
    window.location.reload();
  };

  // Regenerate test data
  const regenerateTestData = async () => {
    setLoading(true);
    
    toast({
      title: "Test data regenerated",
      description: "Fresh test data has been generated in the development environment",
    });
    
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Developer Tools</h1>
          <p className="text-muted-foreground">Tools for testing and debugging the application</p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="dev-mode" 
            checked={devMode} 
            onCheckedChange={setDevMode} 
          />
          <Label htmlFor="dev-mode">Development Mode</Label>
        </div>
      </div>

      <Tabs defaultValue="database" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="database" className="flex gap-2 items-center">
            <DatabaseIcon className="h-4 w-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex gap-2 items-center">
            <WrenchIcon className="h-4 w-4" />
            Testing
          </TabsTrigger>
          <TabsTrigger value="debug" className="flex gap-2 items-center">
            <AlertCircleIcon className="h-4 w-4" />
            Debugging
          </TabsTrigger>
          <TabsTrigger value="config" className="flex gap-2 items-center">
            <CodeIcon className="h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="database" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Clear Cache</CardTitle>
                <CardDescription>
                  Clear database query cache to ensure fresh data
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  variant="default" 
                  onClick={clearCache} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Clearing..." : "Clear Cache"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Database Seeding</CardTitle>
                <CardDescription>
                  Regenerate test data in development environment
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  variant="default" 
                  onClick={regenerateTestData} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Generating..." : "Regenerate Test Data"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Reset Database</CardTitle>
                <CardDescription>
                  Reset development database to initial state
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  disabled={loading}
                  className="w-full"
                >
                  Reset Database
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="testing" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Role Testing</CardTitle>
              <CardDescription>
                Temporarily change user roles for testing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-email">Email Address</Label>
                    <Input id="test-email" placeholder="user@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="test-role">Role</Label>
                    <select id="test-role" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="customer">Customer</option>
                      <option value="company">Company</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => setUserRole("user@example.com", "admin")}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update User Role"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="debug" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Debug Logging</CardTitle>
                <CardDescription>
                  Configure application logging levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="log-api">API Request Logging</Label>
                    <Switch id="log-api" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="log-auth">Authentication Logging</Label>
                    <Switch id="log-auth" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="log-errors">Error Logging</Label>
                    <Switch id="log-errors" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="log-render">Component Render Logging</Label>
                    <Switch id="log-render" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Application State</CardTitle>
                <CardDescription>
                  Application maintenance tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={forceReload}
                >
                  Force Reload Application
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  Clear LocalStorage
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  Reset Application State
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="config" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>
                Toggle features for testing and development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="flag-new-ui">New UI Components</Label>
                    <p className="text-xs text-muted-foreground">Enable new UI components in development</p>
                  </div>
                  <Switch id="flag-new-ui" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="flag-messaging">Enhanced Messaging</Label>
                    <p className="text-xs text-muted-foreground">Enable enhanced messaging features</p>
                  </div>
                  <Switch id="flag-messaging" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="flag-analytics">Advanced Analytics</Label>
                    <p className="text-xs text-muted-foreground">Enable advanced analytics dashboard</p>
                  </div>
                  <Switch id="flag-analytics" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="flag-map">Map Integration</Label>
                    <p className="text-xs text-muted-foreground">Enable map and location features</p>
                  </div>
                  <Switch id="flag-map" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminDevTools; 