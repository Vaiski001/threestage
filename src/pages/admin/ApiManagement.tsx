import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminService } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";
import { Clipboard, Copy, Plus, RefreshCcw, Key, Trash2, Edit, Eye, EyeOff, RotateCw, Loader2, CheckCircle, XCircle, Link } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  scopes: string[];
  expiresAt: string | null;
  lastUsed: string | null;
  createdAt: string;
  isActive: boolean;
}

interface ApiIntegration {
  id: string;
  name: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string | null;
  config: Record<string, any>;
}

const ApiManagement: React.FC = () => {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [integrations, setIntegrations] = useState<ApiIntegration[]>([]);
  const [activeTab, setActiveTab] = useState("keys");
  const [isLoading, setIsLoading] = useState(true);
  const [newKeyDialog, setNewKeyDialog] = useState(false);
  const [newIntegrationDialog, setNewIntegrationDialog] = useState(false);
  const [newKey, setNewKey] = useState<Partial<ApiKey>>({
    name: "",
    scopes: ["read"],
    expiresAt: null,
    isActive: true
  });
  const [newIntegration, setNewIntegration] = useState<Partial<ApiIntegration>>({
    name: "",
    provider: "",
    status: "disconnected",
    config: {}
  });
  const [regeneratingKey, setRegeneratingKey] = useState<string | null>(null);
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());
  const [isCreating, setIsCreating] = useState(false);

  // Load API keys and integrations
  useEffect(() => {
    const loadApiData = async () => {
      try {
        setIsLoading(true);
        const keysData = await adminService.getApiKeys();
        const integrationsData = await adminService.getApiIntegrations();
        
        setApiKeys(keysData);
        setIntegrations(integrationsData);
        
        // Hide all keys by default
        setHiddenKeys(new Set(keysData.map(key => key.id)));
      } catch (error) {
        console.error("Failed to load API data:", error);
        toast({
          title: "Error",
          description: "Failed to load API keys and integrations.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadApiData();
  }, [toast]);

  const handleCreateKey = async () => {
    try {
      setIsCreating(true);
      const createdKey = await adminService.createApiKey({
        name: newKey.name || "Unnamed Key",
        scopes: newKey.scopes || ["read"],
        expiresAt: newKey.expiresAt,
        isActive: newKey.isActive !== false
      });
      
      setApiKeys([createdKey, ...apiKeys]);
      setNewKeyDialog(false);
      setNewKey({
        name: "",
        scopes: ["read"],
        expiresAt: null,
        isActive: true
      });
      
      toast({
        title: "API Key Created",
        description: "Your new API key has been created. Make sure to copy it now.",
      });
      
      // Show the new key
      setHiddenKeys(prev => {
        const updated = new Set(prev);
        updated.delete(createdKey.id);
        return updated;
      });
    } catch (error) {
      console.error("Failed to create API key:", error);
      toast({
        title: "Creation Failed",
        description: "Could not create the API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      toast({
        title: "Copied",
        description: "API key copied to clipboard",
      });
    }).catch(err => {
      console.error("Could not copy key:", err);
      toast({
        title: "Copy Failed",
        description: "Failed to copy API key to clipboard",
        variant: "destructive",
      });
    });
  };

  const handleToggleKeyVisibility = (id: string) => {
    setHiddenKeys(prev => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const handleToggleKeyStatus = async (id: string, isActive: boolean) => {
    try {
      await adminService.updateApiKey(id, { isActive });
      
      // Update local state
      setApiKeys(apiKeys.map(key => 
        key.id === id ? { ...key, isActive } : key
      ));
      
      toast({
        title: isActive ? "Key Enabled" : "Key Disabled",
        description: `API key "${apiKeys.find(k => k.id === id)?.name}" has been ${isActive ? "enabled" : "disabled"}.`,
      });
    } catch (error) {
      console.error("Failed to update API key:", error);
      toast({
        title: "Update Failed",
        description: "Could not update the API key status.",
        variant: "destructive",
      });
    }
  };

  const handleRegenerateKey = async (id: string) => {
    try {
      setRegeneratingKey(id);
      const updatedKey = await adminService.regenerateApiKey(id);
      
      // Update local state
      setApiKeys(apiKeys.map(key => 
        key.id === id ? updatedKey : key
      ));
      
      // Show the regenerated key
      setHiddenKeys(prev => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
      
      toast({
        title: "Key Regenerated",
        description: "Your API key has been regenerated. Make sure to copy the new key.",
      });
    } catch (error) {
      console.error("Failed to regenerate API key:", error);
      toast({
        title: "Regeneration Failed",
        description: "Could not regenerate the API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRegeneratingKey(null);
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      await adminService.deleteApiKey(id);
      
      // Update local state
      setApiKeys(apiKeys.filter(key => key.id !== id));
      
      toast({
        title: "Key Deleted",
        description: "The API key has been permanently deleted.",
      });
    } catch (error) {
      console.error("Failed to delete API key:", error);
      toast({
        title: "Deletion Failed",
        description: "Could not delete the API key. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateIntegration = async () => {
    try {
      setIsCreating(true);
      const createdIntegration = await adminService.createApiIntegration({
        name: newIntegration.name || "Unnamed Integration",
        provider: newIntegration.provider || "",
        config: newIntegration.config || {}
      });
      
      setIntegrations([createdIntegration, ...integrations]);
      setNewIntegrationDialog(false);
      setNewIntegration({
        name: "",
        provider: "",
        status: "disconnected",
        config: {}
      });
      
      toast({
        title: "Integration Created",
        description: "Your new API integration has been created.",
      });
    } catch (error) {
      console.error("Failed to create API integration:", error);
      toast({
        title: "Creation Failed",
        description: "Could not create the API integration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Loading API data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Management</h1>
            <p className="text-muted-foreground">
              Manage API keys and external service integrations
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
            <TabsTrigger value="keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Integrations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="keys" className="space-y-4">
            <div className="flex justify-end">
              <Button 
                onClick={() => setNewKeyDialog(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create API Key
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage access keys for the Threestage API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Scopes</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.length > 0 ? (
                      apiKeys.map(apiKey => (
                        <TableRow key={apiKey.id}>
                          <TableCell className="font-medium">{apiKey.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <code className="bg-slate-100 px-2 py-1 rounded text-xs">
                                {hiddenKeys.has(apiKey.id) 
                                  ? `${apiKey.prefix}...` 
                                  : apiKey.key
                                }
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleKeyVisibility(apiKey.id)}
                              >
                                {hiddenKeys.has(apiKey.id) 
                                  ? <Eye className="h-4 w-4" /> 
                                  : <EyeOff className="h-4 w-4" />
                                }
                                <span className="sr-only">
                                  {hiddenKeys.has(apiKey.id) ? "Show" : "Hide"}
                                </span>
                              </Button>
                              {!hiddenKeys.has(apiKey.id) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopyKey(apiKey.key)}
                                >
                                  <Copy className="h-4 w-4" />
                                  <span className="sr-only">Copy</span>
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {apiKey.scopes.map(scope => (
                                <Badge key={scope} variant="outline">
                                  {scope}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(apiKey.createdAt)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {apiKey.expiresAt 
                              ? <span className={isExpired(apiKey.expiresAt) ? "text-red-600" : ""}>
                                  {formatDate(apiKey.expiresAt)}
                                </span>
                              : "Never"
                            }
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`key-status-${apiKey.id}`}
                                checked={apiKey.isActive}
                                onCheckedChange={(checked) => handleToggleKeyStatus(apiKey.id, checked)}
                                disabled={isExpired(apiKey.expiresAt)}
                              />
                              <Label htmlFor={`key-status-${apiKey.id}`}>
                                {apiKey.isActive ? (
                                  <span className="text-green-600 flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4" />
                                    Active
                                  </span>
                                ) : (
                                  <span className="text-slate-500 flex items-center gap-1">
                                    <XCircle className="h-4 w-4" />
                                    Inactive
                                  </span>
                                )}
                              </Label>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRegenerateKey(apiKey.id)}
                                disabled={regeneratingKey === apiKey.id}
                                className="flex items-center gap-1"
                              >
                                {regeneratingKey === apiKey.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <RotateCw className="h-4 w-4" />
                                )}
                                Regenerate
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteKey(apiKey.id)}
                                className="flex items-center gap-1"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 italic text-muted-foreground">
                          No API keys found. Create a key to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-4">
            <div className="flex justify-end">
              <Button 
                onClick={() => setNewIntegrationDialog(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Integration
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>External Integrations</CardTitle>
                <CardDescription>
                  Manage connections to third-party services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Sync</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {integrations.length > 0 ? (
                      integrations.map(integration => (
                        <TableRow key={integration.id}>
                          <TableCell className="font-medium">{integration.name}</TableCell>
                          <TableCell className="capitalize">{integration.provider}</TableCell>
                          <TableCell>
                            <Badge variant={
                              integration.status === 'connected' ? 'default' :
                              integration.status === 'disconnected' ? 'outline' :
                              'destructive'
                            }>
                              {integration.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(integration.lastSync)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // In a real app, this would trigger a sync
                                  toast({
                                    title: "Sync triggered",
                                    description: `Syncing with ${integration.provider} integration`,
                                  });
                                }}
                              >
                                <RefreshCcw className="h-4 w-4" />
                                <span className="sr-only">Sync</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 italic text-muted-foreground">
                          No integrations found. Add an integration to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-center py-4 text-xs text-muted-foreground border-t">
                <p>
                  Supported integrations: Zapier, Make (Integromat), Slack, Google, Microsoft, and more
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create API Key Dialog */}
      <Dialog open={newKeyDialog} onOpenChange={setNewKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>
              Generate a new API key for secure access to the Threestage API.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="col-span-1">
                Name
              </Label>
              <Input
                id="name"
                placeholder="My API Key"
                className="col-span-3"
                value={newKey.name || ""}
                onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="scopes" className="col-span-1">
                Scopes
              </Label>
              <Select
                value={newKey.scopes?.length ? newKey.scopes[0] : "read"}
                onValueChange={(value) => setNewKey({ ...newKey, scopes: [value] })}
              >
                <SelectTrigger id="scopes" className="col-span-3">
                  <SelectValue placeholder="Select permission scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">Read Only</SelectItem>
                  <SelectItem value="write">Read & Write</SelectItem>
                  <SelectItem value="admin">Admin (Full Access)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="col-span-1">
                Status
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="status"
                  checked={newKey.isActive !== false}
                  onCheckedChange={(checked) => setNewKey({ ...newKey, isActive: checked })}
                />
                <Label htmlFor="status">
                  {newKey.isActive !== false ? "Active" : "Inactive"}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setNewKeyDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleCreateKey}
              disabled={isCreating}
              className="flex items-center gap-2"
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Key className="h-4 w-4" />
              )}
              {isCreating ? "Creating..." : "Create Key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Integration Dialog */}
      <Dialog open={newIntegrationDialog} onOpenChange={setNewIntegrationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add API Integration</DialogTitle>
            <DialogDescription>
              Connect Threestage to an external service or API.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="integration-name" className="col-span-1">
                Name
              </Label>
              <Input
                id="integration-name"
                placeholder="My Integration"
                className="col-span-3"
                value={newIntegration.name || ""}
                onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="provider" className="col-span-1">
                Provider
              </Label>
              <Select
                value={newIntegration.provider || ""}
                onValueChange={(value) => setNewIntegration({ ...newIntegration, provider: value })}
              >
                <SelectTrigger id="provider" className="col-span-3">
                  <SelectValue placeholder="Select service provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zapier">Zapier</SelectItem>
                  <SelectItem value="make">Make (Integromat)</SelectItem>
                  <SelectItem value="slack">Slack</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="microsoft">Microsoft</SelectItem>
                  <SelectItem value="mailchimp">Mailchimp</SelectItem>
                  <SelectItem value="custom">Custom API</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setNewIntegrationDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleCreateIntegration}
              disabled={isCreating || !newIntegration.provider}
              className="flex items-center gap-2"
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Link className="h-4 w-4" />
              )}
              {isCreating ? "Adding..." : "Add Integration"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ApiManagement; 