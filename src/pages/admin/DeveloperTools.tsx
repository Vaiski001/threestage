import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Code,
  Database,
  Settings,
  RefreshCw,
  ShieldAlert,
  CheckCircle,
  Trash2,
  LogOut,
  Layers,
  Terminal,
  DownloadCloud,
  AlertCircle
} from "lucide-react";

const DeveloperTools = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [logsExpanded, setLogsExpanded] = useState<Record<string, boolean>>({});
  
  // Mock system logs
  const mockLogs = [
    {
      id: "log1",
      timestamp: "2023-09-15T14:32:45Z",
      level: "error",
      service: "auth-service",
      message: "Failed to authenticate user: Invalid credentials",
      details: "Error: User authentication failed with error code AUTH_INVALID_CREDENTIALS at AuthService.authenticate (auth-service.ts:127)"
    },
    {
      id: "log2",
      timestamp: "2023-09-15T14:30:12Z",
      level: "info",
      service: "inquiry-service",
      message: "New inquiry created successfully",
      details: "Inquiry #INQ-2023-0492 created by user ID: 28349"
    },
    {
      id: "log3",
      timestamp: "2023-09-15T14:28:55Z",
      level: "warn",
      service: "storage-service",
      message: "File upload retry succeeded after initial failure",
      details: "File ID: doc-492. Retry attempt: 2. Successfully uploaded after connection error."
    },
    {
      id: "log4",
      timestamp: "2023-09-15T14:25:30Z",
      level: "error",
      service: "database-service",
      message: "Database query timeout",
      details: "Query execution exceeded timeout limit of 30s. Query: SELECT * FROM inquiries WHERE status = 'pending' AND created_at > '2023-08-01' ORDER BY priority DESC"
    },
    {
      id: "log5",
      timestamp: "2023-09-15T14:22:18Z",
      level: "info",
      service: "notification-service",
      message: "Email notification sent successfully",
      details: "Notification ID: NOTIF-2023-3821. Recipient: user@example.com. Template: inquiry_response"
    }
  ];

  // Mock environment variables
  const mockEnvVars = [
    { key: "API_URL", value: "https://api.example.com/v1", isSecret: false },
    { key: "DATABASE_URL", value: "postgresql://user:******@db.example.com:5432/mydb", isSecret: true },
    { key: "JWT_SECRET", value: "****************************************", isSecret: true },
    { key: "SMTP_HOST", value: "smtp.mailservice.com", isSecret: false },
    { key: "SMTP_PASSWORD", value: "**********", isSecret: true },
    { key: "STORAGE_BUCKET", value: "app-storage-prod", isSecret: false },
    { key: "LOG_LEVEL", value: "info", isSecret: false }
  ];

  // Mock API endpoints
  const mockEndpoints = [
    { path: "/api/auth/login", method: "POST", authenticated: false, description: "User authentication" },
    { path: "/api/auth/logout", method: "POST", authenticated: true, description: "User logout" },
    { path: "/api/users", method: "GET", authenticated: true, description: "Get users list" },
    { path: "/api/inquiries", method: "GET", authenticated: true, description: "Get inquiries" },
    { path: "/api/inquiries/:id", method: "GET", authenticated: true, description: "Get inquiry by ID" },
    { path: "/api/companies", method: "GET", authenticated: true, description: "Get companies list" },
    { path: "/api/companies/:id", method: "POST", authenticated: true, description: "Update company" },
    { path: "/api/webhooks/inbound", method: "POST", authenticated: false, description: "External service webhook" }
  ];

  // Mock feature flags
  const [featureFlags, setFeatureFlags] = useState([
    { id: "new_messaging_ui", name: "New Messaging UI", enabled: true, description: "Enable the new messaging interface with improved threading" },
    { id: "advanced_analytics", name: "Advanced Analytics", enabled: false, description: "Advanced metrics and visualization in analytics dashboard" },
    { id: "multi_language", name: "Multi-language Support", enabled: true, description: "Enable multi-language support throughout the platform" },
    { id: "ai_suggestions", name: "AI Response Suggestions", enabled: false, description: "AI-powered response suggestions for customer inquiries" },
    { id: "bulk_operations", name: "Bulk Operations", enabled: true, description: "Enable bulk operations for inquiries and messages" }
  ]);

  const handleFeatureFlagToggle = (id: string) => {
    setFeatureFlags(flags => 
      flags.map(flag => 
        flag.id === id ? { ...flag, enabled: !flag.enabled } : flag
      )
    );
    
    toast({
      title: "Feature flag updated",
      description: `Feature flag state has been updated`,
    });
  };

  const clearCache = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Cache cleared successfully",
        description: "Application cache has been cleared",
      });
    }, 1500);
  };

  const executeMigration = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Database migration executed",
        description: "Database schema has been updated",
      });
    }, 2000);
  };

  const downloadLogs = () => {
    toast({
      title: "Logs download initiated",
      description: "System logs will be downloaded shortly",
    });
  };

  const toggleLogExpand = (id: string) => {
    setLogsExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getLevelStyle = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-100 text-red-800";
      case "warn":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Developer Tools</h1>
          <p className="text-muted-foreground">
            System configuration and development utilities
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-2" onClick={clearCache} disabled={loading}>
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Clear Cache
          </Button>
        </div>
      </div>

      <Tabs defaultValue="system-logs" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="system-logs" className="flex gap-1 items-center">
            <Terminal className="h-4 w-4" />
            System Logs
          </TabsTrigger>
          <TabsTrigger value="environment" className="flex gap-1 items-center">
            <Settings className="h-4 w-4" />
            Environment
          </TabsTrigger>
          <TabsTrigger value="api-explorer" className="flex gap-1 items-center">
            <Code className="h-4 w-4" />
            API Explorer
          </TabsTrigger>
          <TabsTrigger value="feature-flags" className="flex gap-1 items-center">
            <Layers className="h-4 w-4" />
            Feature Flags
          </TabsTrigger>
          <TabsTrigger value="database" className="flex gap-1 items-center">
            <Database className="h-4 w-4" />
            Database Tools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system-logs" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>
                  View system logs and error messages
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="flex gap-2" onClick={downloadLogs}>
                <DownloadCloud className="h-4 w-4" />
                Export Logs
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLogs.map((log) => (
                  <div key={log.id} className="border rounded-md overflow-hidden">
                    <div 
                      className="p-4 bg-muted/30 cursor-pointer flex justify-between items-center"
                      onClick={() => toggleLogExpand(log.id)}
                    >
                      <div className="flex gap-3 items-center">
                        <Badge className={getLevelStyle(log.level)}>
                          {log.level.toUpperCase()}
                        </Badge>
                        <span className="font-medium">{log.service}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                      {log.level === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
                    </div>
                    <div className="p-4 border-t">
                      <p className="font-medium">{log.message}</p>
                      {logsExpanded[log.id] && (
                        <div className="mt-2 p-3 bg-slate-50 rounded text-xs font-mono whitespace-pre-wrap">
                          {log.details}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>
                Manage application environment configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Add Variable
                  </Button>
                  <Button variant="outline" size="sm">
                    Reload Configuration
                  </Button>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Key
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockEnvVars.map((env, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {env.key}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                            {env.value}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {env.isSecret ? (
                              <Badge className="bg-red-50 text-red-700 border-red-200">
                                Secret
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                                Public
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-explorer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>
                Explore and test API endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="border rounded-md overflow-hidden">
                      <div className="p-3 bg-muted font-medium">Available Endpoints</div>
                      <div className="divide-y">
                        {mockEndpoints.map((endpoint, index) => (
                          <div key={index} className="p-4 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge className={
                                  endpoint.method === "GET" 
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : endpoint.method === "POST"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                }>
                                  {endpoint.method}
                                </Badge>
                                <span className="font-mono text-sm">{endpoint.path}</span>
                              </div>
                              {endpoint.authenticated && (
                                <ShieldAlert className="h-4 w-4 text-amber-500" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {endpoint.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle>API Request Tester</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <div className="w-1/3">
                              <Label htmlFor="method">Method</Label>
                              <Select>
                                <SelectTrigger id="method">
                                  <SelectValue placeholder="GET" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="get">GET</SelectItem>
                                  <SelectItem value="post">POST</SelectItem>
                                  <SelectItem value="put">PUT</SelectItem>
                                  <SelectItem value="delete">DELETE</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="w-2/3">
                              <Label htmlFor="endpoint">Endpoint</Label>
                              <Input 
                                id="endpoint" 
                                placeholder="/api/endpoint"
                                defaultValue="/api/inquiries" 
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="payload">Request Payload (JSON)</Label>
                            <Textarea 
                              id="payload" 
                              placeholder="{}" 
                              className="font-mono h-[100px]"
                            />
                          </div>

                          <div className="flex justify-end">
                            <Button className="w-full md:w-auto">
                              Send Request
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feature-flags" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>
                Manage feature flags and toggles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Button variant="outline" size="sm">
                  Add Feature Flag
                </Button>

                <div className="border rounded-md divide-y">
                  {featureFlags.map((flag) => (
                    <div key={flag.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="text-base font-semibold">{flag.name}</div>
                          <div className="text-sm text-muted-foreground">{flag.description}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            className={flag.enabled ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}
                          >
                            {flag.enabled ? "Enabled" : "Disabled"}
                          </Badge>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`flag-${flag.id}`}
                              checked={flag.enabled}
                              onCheckedChange={() => handleFeatureFlagToggle(flag.id)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>
                Database maintenance tools and operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Migrations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">
                        Execute and manage database schema migrations.
                      </p>
                      <div className="grid gap-2">
                        <Button 
                          onClick={executeMigration} 
                          className="w-full"
                          disabled={loading}
                        >
                          {loading ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Database className="h-4 w-4 mr-2" />
                          )}
                          Run Migrations
                        </Button>
                        <Button variant="outline" className="w-full">
                          View Migration History
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Backup & Restore</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">
                        Create and manage database backups.
                      </p>
                      <div className="grid gap-2">
                        <Button className="w-full">
                          <DownloadCloud className="h-4 w-4 mr-2" />
                          Create Backup
                        </Button>
                        <Button variant="outline" className="w-full">
                          View Backup History
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Maintenance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">
                        Database maintenance operations.
                      </p>
                      <div className="grid gap-2">
                        <Button className="w-full">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Run Diagnostics
                        </Button>
                        <Button variant="outline" className="w-full text-amber-600 hover:text-amber-700">
                          Vacuum Database
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Dangerous Operations</h3>
                  <p className="text-sm text-muted-foreground">
                    These operations can cause data loss. Use with caution.
                  </p>
                  
                  <div className="border border-red-200 rounded-md p-4 bg-red-50">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-medium text-red-800">Reset Database</h4>
                        <p className="text-sm text-red-700">
                          This will erase all data and reset the database to its initial state.
                        </p>
                      </div>
                      
                      <Button variant="destructive" className="ml-auto">
                        <LogOut className="h-4 w-4 mr-2" />
                        Reset Database
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default DeveloperTools; 