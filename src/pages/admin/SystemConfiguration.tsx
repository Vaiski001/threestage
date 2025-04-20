import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/adminService";
import { AlertCircle, Database, Download, Upload, RefreshCcw, HardDrive, Settings, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

interface DatabaseSettings {
  maxConnections: number;
  timeout: number;
  logLevel: string;
  backupFrequency: string;
  autoVacuum: boolean;
  lastBackupDate: string | null;
}

interface StorageSettings {
  maxUploadSize: number;
  allowedFileTypes: string[];
  storageQuota: number;
  currentUsage: number;
  compressUploads: boolean;
  storageProvider: string;
}

const SystemConfiguration: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("database");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  
  const [databaseSettings, setDatabaseSettings] = useState<DatabaseSettings>({
    maxConnections: 100,
    timeout: 30,
    logLevel: "info",
    backupFrequency: "daily",
    autoVacuum: true,
    lastBackupDate: null
  });

  const [storageSettings, setStorageSettings] = useState<StorageSettings>({
    maxUploadSize: 10,
    allowedFileTypes: [".jpg", ".png", ".pdf", ".docx"],
    storageQuota: 5120, // 5GB in MB
    currentUsage: 1024, // 1GB in MB
    compressUploads: true,
    storageProvider: "supabase"
  });

  // Load system configuration settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, these would be fetched from your backend
        const dbSettings = await adminService.getDatabaseSettings();
        const storageSettings = await adminService.getStorageSettings();
        
        setDatabaseSettings(dbSettings);
        setStorageSettings(storageSettings);
      } catch (error) {
        console.error("Failed to load system configuration:", error);
        toast({
          title: "Error",
          description: "Failed to load system configuration. Using defaults.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleDatabaseSettingChange = (key: keyof DatabaseSettings, value: any) => {
    setDatabaseSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleStorageSettingChange = (key: keyof StorageSettings, value: any) => {
    setStorageSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      
      if (activeTab === "database") {
        await adminService.updateDatabaseSettings(databaseSettings);
      } else {
        await adminService.updateStorageSettings(storageSettings);
      }
      
      toast({
        title: "Settings Saved",
        description: `${activeTab === "database" ? "Database" : "Storage"} settings have been updated.`,
      });
      
      await adminService.logActivity("updated", "system configuration", activeTab);
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackupDatabase = async () => {
    try {
      setIsBackingUp(true);
      await adminService.backupDatabase();
      
      // Update last backup date
      setDatabaseSettings(prev => ({
        ...prev,
        lastBackupDate: new Date().toISOString()
      }));
      
      toast({
        title: "Backup Complete",
        description: "Database has been backed up successfully.",
      });
      
      await adminService.logActivity("created", "database backup", "manual");
    } catch (error) {
      console.error("Failed to backup database:", error);
      toast({
        title: "Backup Failed",
        description: "Could not complete database backup. Please check logs.",
        variant: "destructive",
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestoreDatabase = async () => {
    // In a real app, this would show a file picker and handle restore
    try {
      setIsRestoring(true);
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Restore Complete",
        description: "Database has been restored successfully.",
      });
      
      await adminService.logActivity("restored", "database", "manual");
    } catch (error) {
      console.error("Failed to restore database:", error);
      toast({
        title: "Restore Failed",
        description: "Could not restore database. Please check logs.",
        variant: "destructive",
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const formatStorageSize = (sizeInMB: number) => {
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(2)} GB`;
    }
    return `${sizeInMB} MB`;
  };

  const usagePercentage = (storageSettings.currentUsage / storageSettings.storageQuota) * 100;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Loading configuration settings...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
          <p className="text-muted-foreground">
            Manage database, storage, and system configuration settings.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database Settings
            </TabsTrigger>
            <TabsTrigger value="storage" className="flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              Storage Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="database" className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                These settings directly affect database performance. Change with caution.
              </AlertDescription>
            </Alert>
            
            <Card>
              <CardHeader>
                <CardTitle>Database Configuration</CardTitle>
                <CardDescription>Configure database connection settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxConnections">Max Connections</Label>
                    <Input
                      id="maxConnections"
                      type="number"
                      value={databaseSettings.maxConnections}
                      onChange={(e) => handleDatabaseSettingChange("maxConnections", parseInt(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground">
                      Maximum number of concurrent database connections
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Connection Timeout (seconds)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      value={databaseSettings.timeout}
                      onChange={(e) => handleDatabaseSettingChange("timeout", parseInt(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground">
                      Idle connection timeout in seconds
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logLevel">Log Level</Label>
                    <Select
                      value={databaseSettings.logLevel}
                      onValueChange={(value) => handleDatabaseSettingChange("logLevel", value)}
                    >
                      <SelectTrigger id="logLevel">
                        <SelectValue placeholder="Select log level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warn">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Database query logging level
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select
                      value={databaseSettings.backupFrequency}
                      onValueChange={(value) => handleDatabaseSettingChange("backupFrequency", value)}
                    >
                      <SelectTrigger id="backupFrequency">
                        <SelectValue placeholder="Select backup frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="manual">Manual Only</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      How often to automatically backup the database
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoVacuum"
                    checked={databaseSettings.autoVacuum}
                    onCheckedChange={(checked) => handleDatabaseSettingChange("autoVacuum", checked)}
                  />
                  <Label htmlFor="autoVacuum">Enable Auto-Vacuum</Label>
                  <p className="text-sm text-muted-foreground ml-2">
                    Automatically reclaim storage from deleted records
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Backup & Restore</CardTitle>
                <CardDescription>
                  Backup and restore database with all system data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">Last Backup</p>
                    <p className="text-sm text-muted-foreground">
                      {databaseSettings.lastBackupDate 
                        ? new Date(databaseSettings.lastBackupDate).toLocaleString() 
                        : "No backup recorded"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleBackupDatabase}
                      disabled={isBackingUp}
                      className="flex items-center gap-2"
                    >
                      {isBackingUp ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      Backup Now
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleRestoreDatabase}
                      disabled={isRestoring}
                      className="flex items-center gap-2"
                    >
                      {isRestoring ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      Restore
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Restoring the database will replace all current data. Make sure you have a backup.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button 
                onClick={saveSettings} 
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
                Save Database Settings
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="storage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Storage Configuration</CardTitle>
                <CardDescription>Configure file storage settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storageProvider">Storage Provider</Label>
                    <Select
                      value={storageSettings.storageProvider}
                      onValueChange={(value) => handleStorageSettingChange("storageProvider", value)}
                    >
                      <SelectTrigger id="storageProvider">
                        <SelectValue placeholder="Select storage provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="supabase">Supabase Storage</SelectItem>
                        <SelectItem value="aws">AWS S3</SelectItem>
                        <SelectItem value="azure">Azure Blob Storage</SelectItem>
                        <SelectItem value="local">Local Storage</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Provider for file storage services
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
                    <Input
                      id="maxUploadSize"
                      type="number"
                      value={storageSettings.maxUploadSize}
                      onChange={(e) => handleStorageSettingChange("maxUploadSize", parseInt(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground">
                      Maximum file size for uploads in MB
                    </p>
                  </div>
                  
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label>Storage Quota Usage</Label>
                    <div className="space-y-2">
                      <Progress value={usagePercentage} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>{formatStorageSize(storageSettings.currentUsage)} used</span>
                        <span>{formatStorageSize(storageSettings.storageQuota)} total</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label htmlFor="storageQuota">Storage Quota (MB)</Label>
                    <Input
                      id="storageQuota"
                      type="number"
                      value={storageSettings.storageQuota}
                      onChange={(e) => handleStorageSettingChange("storageQuota", parseInt(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground">
                      Total storage allocation for all files
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Switch
                    id="compressUploads"
                    checked={storageSettings.compressUploads}
                    onCheckedChange={(checked) => handleStorageSettingChange("compressUploads", checked)}
                  />
                  <Label htmlFor="compressUploads">Compress Uploads</Label>
                  <p className="text-sm text-muted-foreground ml-2">
                    Automatically compress compatible file types
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Allowed File Types</CardTitle>
                <CardDescription>
                  Configure which file types can be uploaded
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {storageSettings.allowedFileTypes.map((type, index) => (
                    <div key={index} className="flex items-center border rounded-md px-3 py-1">
                      <span>{type}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1 ml-2"
                        onClick={() => {
                          const newTypes = [...storageSettings.allowedFileTypes];
                          newTypes.splice(index, 1);
                          handleStorageSettingChange("allowedFileTypes", newTypes);
                        }}
                      >
                        &times;
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    id="newFileType"
                    placeholder="Add file type (e.g., .pdf)"
                    className="max-w-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        e.preventDefault();
                        const newType = e.currentTarget.value.trim();
                        if (!newType.startsWith('.')) {
                          toast({
                            title: "Invalid Format",
                            description: "File type must start with a dot (e.g., .pdf)",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        if (!storageSettings.allowedFileTypes.includes(newType)) {
                          handleStorageSettingChange(
                            "allowedFileTypes", 
                            [...storageSettings.allowedFileTypes, newType]
                          );
                        }
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button 
                    variant="secondary"
                    onClick={(e) => {
                      const input = document.getElementById('newFileType') as HTMLInputElement;
                      if (input && input.value) {
                        const newType = input.value.trim();
                        if (!newType.startsWith('.')) {
                          toast({
                            title: "Invalid Format",
                            description: "File type must start with a dot (e.g., .pdf)",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        if (!storageSettings.allowedFileTypes.includes(newType)) {
                          handleStorageSettingChange(
                            "allowedFileTypes", 
                            [...storageSettings.allowedFileTypes, newType]
                          );
                        }
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button 
                onClick={saveSettings} 
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
                Save Storage Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SystemConfiguration; 