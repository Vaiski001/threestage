import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminService } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";
import { Bell, BellOff, Edit, Trash2, Plus, Save, Loader2, RefreshCcw } from "lucide-react";

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: string;
  isActive: boolean;
}

interface NotificationChannel {
  id: string;
  name: string;
  type: string;
  isEnabled: boolean;
  config: Record<string, any>;
}

const NotificationManagement: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("templates");
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [channels, setChannels] = useState<NotificationChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadNotificationData = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, fetch from your backend
        const templatesData = await adminService.getNotificationTemplates();
        const channelsData = await adminService.getNotificationChannels();
        
        setTemplates(templatesData);
        setChannels(channelsData);
      } catch (error) {
        console.error("Failed to load notification data:", error);
        toast({
          title: "Error",
          description: "Failed to load notification data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadNotificationData();
  }, [toast]);

  const handleEditTemplate = (template: NotificationTemplate) => {
    setEditingTemplate({...template});
    setIsEditing(true);
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;

    try {
      setIsSaving(true);
      
      // Save template changes
      const updated = await adminService.updateNotificationTemplate(editingTemplate);
      
      // Update local state
      setTemplates(templates.map(t => 
        t.id === updated.id ? updated : t
      ));
      
      toast({
        title: "Template Updated",
        description: `Successfully updated "${updated.name}" template.`,
      });
      
      // Exit edit mode
      setIsEditing(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error("Failed to save template:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save template changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateTemplate = () => {
    const newTemplate: NotificationTemplate = {
      id: `temp-${Date.now()}`,
      name: "New Template",
      subject: "Subject Line",
      content: "Template content...",
      type: "email",
      isActive: true
    };
    
    setEditingTemplate(newTemplate);
    setIsEditing(true);
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await adminService.deleteNotificationTemplate(id);
      setTemplates(templates.filter(t => t.id !== id));
      
      toast({
        title: "Template Deleted",
        description: "The notification template has been deleted.",
      });
    } catch (error) {
      console.error("Failed to delete template:", error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the template. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateChannel = async (id: string, isEnabled: boolean) => {
    try {
      await adminService.updateNotificationChannel(id, { isEnabled });
      
      // Update local state
      setChannels(channels.map(c => 
        c.id === id ? {...c, isEnabled} : c
      ));
      
      toast({
        title: "Channel Updated",
        description: `${isEnabled ? "Enabled" : "Disabled"} notification channel.`,
      });
    } catch (error) {
      console.error("Failed to update channel:", error);
      toast({
        title: "Update Failed",
        description: "Could not update the notification channel.",
        variant: "destructive",
      });
      
      // Revert UI state
      setChannels(channels);
    }
  };

  const handleTemplateInputChange = (
    key: keyof NotificationTemplate, 
    value: string | boolean
  ) => {
    if (editingTemplate) {
      setEditingTemplate({
        ...editingTemplate,
        [key]: value
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Loading notification data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notification Management</h1>
            <p className="text-muted-foreground">
              Manage notification templates and delivery channels
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Notification Templates
            </TabsTrigger>
            <TabsTrigger value="channels" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Delivery Channels
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="space-y-6">
            {isEditing ? (
              <Card>
                <CardHeader>
                  <CardTitle>{editingTemplate?.id.startsWith('temp-') ? 'Create Template' : 'Edit Template'}</CardTitle>
                  <CardDescription>Customize notification content and settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="templateName">Template Name</Label>
                      <Input
                        id="templateName"
                        value={editingTemplate?.name || ""}
                        onChange={(e) => handleTemplateInputChange("name", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="templateType">Notification Type</Label>
                      <Select
                        value={editingTemplate?.type || ""}
                        onValueChange={(value) => handleTemplateInputChange("type", value)}
                      >
                        <SelectTrigger id="templateType">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="push">Push Notification</SelectItem>
                          <SelectItem value="in_app">In-App Notification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="subject">Subject Line</Label>
                      <Input
                        id="subject"
                        value={editingTemplate?.subject || ""}
                        onChange={(e) => handleTemplateInputChange("subject", e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Used for email notifications and push notification titles
                      </p>
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        rows={8}
                        value={editingTemplate?.content || ""}
                        onChange={(e) => handleTemplateInputChange("content", e.target.value)}
                        className="min-h-[200px] font-mono"
                      />
                      <p className="text-sm text-muted-foreground">
                        Supports variables like {"{user_name}"}, {"{company_name}"}, etc.
                      </p>
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isActive"
                          checked={editingTemplate?.isActive || false}
                          onCheckedChange={(checked) => handleTemplateInputChange("isActive", checked)}
                        />
                        <Label htmlFor="isActive">Active</Label>
                      </div>
                      <p className="text-sm text-muted-foreground ml-7">
                        Inactive templates will not be sent even if triggered
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false);
                        setEditingTemplate(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSaveTemplate}
                      disabled={isSaving}
                      className="flex items-center gap-2"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-end mb-4">
                  <Button 
                    onClick={handleCreateTemplate}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Template
                  </Button>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Templates</CardTitle>
                    <CardDescription>
                      Manage templates used for system notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {templates.length > 0 ? (
                          templates.map(template => (
                            <TableRow key={template.id}>
                              <TableCell className="font-medium">{template.name}</TableCell>
                              <TableCell className="capitalize">{template.type}</TableCell>
                              <TableCell className="max-w-[200px] truncate">{template.subject}</TableCell>
                              <TableCell>
                                {template.isActive ? (
                                  <span className="flex items-center gap-1 text-green-600">
                                    <Bell className="h-4 w-4" />
                                    Active
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-muted-foreground">
                                    <BellOff className="h-4 w-4" />
                                    Inactive
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditTemplate(template)}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteTemplate(template.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-6 italic text-muted-foreground">
                              No notification templates found. Create a template to get started.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="channels" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>
                  Configure how and where notifications are delivered
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Channel Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {channels.map(channel => (
                      <TableRow key={channel.id}>
                        <TableCell className="font-medium">{channel.name}</TableCell>
                        <TableCell className="capitalize">{channel.type}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`channel-${channel.id}`}
                              checked={channel.isEnabled}
                              onCheckedChange={(checked) => handleUpdateChannel(channel.id, checked)}
                            />
                            <Label htmlFor={`channel-${channel.id}`}>
                              {channel.isEnabled ? "Enabled" : "Disabled"}
                            </Label>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // In a real implementation, this would open a modal to configure channel settings
                              toast({
                                title: "Channel Settings",
                                description: "Channel settings configuration not implemented in this demo",
                              });
                            }}
                          >
                            Configure
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default NotificationManagement; 