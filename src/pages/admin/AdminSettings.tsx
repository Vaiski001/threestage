import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { adminService } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AccountFormData {
  name: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SystemSettings {
  enableNotifications: boolean;
  enableDataSync: boolean;
  darkMode?: boolean;
  debugMode: boolean;
  maintenanceMode: boolean;
}

const AdminSettings: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    enableNotifications: true,
    enableDataSync: true,
    debugMode: false,
    maintenanceMode: false
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [accountForm, setAccountForm] = useState<AccountFormData>({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Load system settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoadingSettings(true);
        const settings = await adminService.getSystemSettings();
        setSystemSettings(settings);
      } catch (error) {
        console.error("Failed to load system settings:", error);
        toast({
          title: "Error",
          description: "Failed to load system settings. Using defaults.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingSettings(false);
      }
    };

    loadSettings();
  }, [toast]);

  // Update account form when profile changes
  useEffect(() => {
    if (profile) {
      setAccountForm(prev => ({
        ...prev,
        name: profile.name || prev.name,
        email: profile.email || prev.email,
        phone: profile.phone || prev.phone
      }));
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmPassword) {
      toast({
        title: "Password Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Password requirements check if a new password is provided
    if (accountForm.newPassword && accountForm.newPassword.length < 8) {
      toast({
        title: "Password Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // If password is being changed
      if (accountForm.currentPassword && accountForm.newPassword) {
        await adminService.updateAdminPassword(
          accountForm.currentPassword,
          accountForm.newPassword
        );
      }
      
      // Update profile information
      await updateProfile({
        name: accountForm.name,
        email: accountForm.email,
        phone: accountForm.phone
      });

      // Log this activity
      await adminService.logActivity("updated", "admin profile", profile?.id || "unknown");
      
      toast({
        title: "Success",
        description: "Your account has been updated",
      });
      
      // Clear password fields
      setAccountForm(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (error) {
      console.error("Failed to update account:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update account",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSystemSettingChange = async (setting: keyof SystemSettings, value: boolean) => {
    try {
      setSystemSettings(prev => ({
        ...prev,
        [setting]: value
      }));
      
      await adminService.updateSystemSettings({
        ...systemSettings,
        [setting]: value
      });
      
      toast({
        title: "Setting Updated",
        description: `${setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} has been ${value ? 'enabled' : 'disabled'}`,
      });
      
      await adminService.logActivity("updated", "system setting", setting);
    } catch (error) {
      console.error(`Failed to update ${setting}:`, error);
      toast({
        title: "Error",
        description: `Failed to update ${setting}`,
        variant: "destructive",
      });
      
      // Revert the UI state back
      setSystemSettings(prev => ({
        ...prev,
        [setting]: !value
      }));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and system preferences
          </p>
        </div>

        <Tabs defaultValue="account">
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure application-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingSettings ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="data-sync">
                        <div>Data Synchronization</div>
                        <p className="text-sm text-muted-foreground">
                          Keep data synchronized between company and customer portals
                        </p>
                      </Label>
                      <Switch
                        id="data-sync"
                        checked={systemSettings.enableDataSync}
                        onCheckedChange={(checked) => handleSystemSettingChange('enableDataSync', checked)}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-4">
            <Card>
              <form onSubmit={handleUpdateAccount}>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Update your account details and change your password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      name="name"
                      value={accountForm.name} 
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      value={accountForm.email} 
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      type="tel" 
                      value={accountForm.phone} 
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-4">Change Password</h3>
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword" 
                        name="currentPassword"
                        type="password" 
                        value={accountForm.currentPassword} 
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2 mt-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword" 
                        name="newPassword"
                        type="password" 
                        value={accountForm.newPassword} 
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2 mt-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword" 
                        name="confirmPassword"
                        type="password" 
                        value={accountForm.confirmPassword} 
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving
                      </>
                    ) : (
                      "Update Account"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>
                  Configure system-level settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingSettings ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="debug-mode">
                        <div>Debug Mode</div>
                        <p className="text-sm text-muted-foreground">
                          Enable detailed logging and debugging tools
                        </p>
                      </Label>
                      <Switch 
                        id="debug-mode" 
                        checked={systemSettings.debugMode}
                        onCheckedChange={(checked) => handleSystemSettingChange('debugMode', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="maintenance-mode">
                        <div>Maintenance Mode</div>
                        <p className="text-sm text-muted-foreground">
                          Put the application in maintenance mode (users will see a maintenance page)
                        </p>
                      </Label>
                      <Switch 
                        id="maintenance-mode" 
                        checked={systemSettings.maintenanceMode}
                        onCheckedChange={(checked) => handleSystemSettingChange('maintenanceMode', checked)}
                      />
                    </div>
                    
                    <Alert className="mt-6">
                      <AlertTitle>System Status</AlertTitle>
                      <AlertDescription>
                        {systemSettings.maintenanceMode ? (
                          <div className="text-amber-500">System is currently in maintenance mode</div>
                        ) : (
                          <div className="text-green-500">All systems operational</div>
                        )}
                      </AlertDescription>
                    </Alert>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingSettings ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="enable-notifications">
                        <div>Enable Notifications</div>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about system events and updates
                        </p>
                      </Label>
                      <Switch 
                        id="enable-notifications" 
                        checked={systemSettings.enableNotifications}
                        onCheckedChange={(checked) => handleSystemSettingChange('enableNotifications', checked)}
                      />
                    </div>
                    
                    <div className="pt-4 border-t mt-4">
                      <h3 className="font-medium mb-4">Notification Channels</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <Switch id="email-notifications" defaultChecked={true} disabled={!systemSettings.enableNotifications} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="browser-notifications">Browser Notifications</Label>
                          <Switch id="browser-notifications" defaultChecked={true} disabled={!systemSettings.enableNotifications} />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
    </AdminLayout>
  );
};

export default AdminSettings; 