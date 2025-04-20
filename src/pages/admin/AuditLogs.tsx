import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { adminService, ActivityData } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";
import { Search, FileDown, RefreshCcw, Filter, Info, Loader2, Clock } from "lucide-react";

const AuditLogs: React.FC = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<ActivityData[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("");
  const [entityFilter, setEntityFilter] = useState<string>("");
  const [logDetails, setLogDetails] = useState<ActivityData | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const loadAuditLogs = async () => {
      try {
        setIsLoading(true);
        const logsData = await adminService.getAuditLogs();
        setLogs(logsData);
        setFilteredLogs(logsData);
      } catch (error) {
        console.error("Failed to load audit logs:", error);
        toast({
          title: "Error",
          description: "Failed to load audit logs. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAuditLogs();
  }, [toast]);

  useEffect(() => {
    // Filter logs based on search term and filters
    const filteredResults = logs.filter(log => {
      // Check if log matches search term (case insensitive)
      const matchesSearch = searchTerm === "" || 
        Object.values(log).some(value => 
          typeof value === 'string' && 
          value.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      // Check if log matches action filter
      const matchesAction = actionFilter === "" || log.action === actionFilter;
      
      // Check if log matches entity filter
      const matchesEntity = entityFilter === "" || log.entity === entityFilter;
      
      return matchesSearch && matchesAction && matchesEntity;
    });
    
    setFilteredLogs(filteredResults);
  }, [logs, searchTerm, actionFilter, entityFilter]);

  const handleExportLogs = async () => {
    try {
      setIsExporting(true);
      
      // In a real implementation, this would call a service method to generate
      // a CSV or JSON file with the filtered logs
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Convert filtered logs to CSV string
      const headers = "ID,Action,Entity,EntityID,PerformedBy,PerformedAt";
      const csvRows = filteredLogs.map(log => 
        `${log.id},${log.action},${log.entity},${log.entity_id},${log.performed_by},${log.performed_at}`
      );
      const csvContent = [headers, ...csvRows].join('\n');
      
      // Create a blob and download it
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Audit logs have been exported to CSV.",
      });
    } catch (error) {
      console.error("Failed to export logs:", error);
      toast({
        title: "Export Failed",
        description: "Could not export audit logs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewDetails = (log: ActivityData) => {
    setLogDetails(log);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActionFilter("");
    setEntityFilter("");
  };

  const getUniqueValues = (key: keyof ActivityData) => {
    return Array.from(new Set(logs.map(log => String(log[key]))));
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-green-100 text-green-800';
      case 'updated':
        return 'bg-blue-100 text-blue-800';
      case 'deleted':
        return 'bg-red-100 text-red-800';
      case 'logged_in':
        return 'bg-purple-100 text-purple-800';
      case 'logged_out':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getEntityColor = (entity: string) => {
    switch (entity) {
      case 'user':
        return 'bg-yellow-100 text-yellow-800';
      case 'inquiry':
        return 'bg-indigo-100 text-indigo-800';
      case 'message':
        return 'bg-pink-100 text-pink-800';
      case 'system':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Loading audit logs...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
            <p className="text-muted-foreground">
              Track all system activities and changes
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

        <Card>
          <CardHeader>
            <CardTitle>Log Filters</CardTitle>
            <CardDescription>Filter audit logs by various criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <Select
                  value={actionFilter}
                  onValueChange={setActionFilter}
                >
                  <SelectTrigger>
                    <span className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      {actionFilter || "Filter by action"}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Actions</SelectItem>
                    {getUniqueValues('action').map(action => (
                      <SelectItem key={action} value={action}>
                        {action}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-48">
                <Select
                  value={entityFilter}
                  onValueChange={setEntityFilter}
                >
                  <SelectTrigger>
                    <span className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      {entityFilter || "Filter by entity"}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Entities</SelectItem>
                    {getUniqueValues('entity').map(entity => (
                      <SelectItem key={entity} value={entity}>
                        {entity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
                <Button 
                  onClick={handleExportLogs}
                  disabled={isExporting}
                  className="flex items-center gap-2"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileDown className="h-4 w-4" />
                  )}
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>System Activity Logs</CardTitle>
              <p className="text-sm text-muted-foreground">
                {filteredLogs.length} logs found
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Entity ID</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatDateTime(log.performed_at)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getActionColor(log.action)}
                        >
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getEntityColor(log.entity)}
                        >
                          {log.entity}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.entity_id}
                      </TableCell>
                      <TableCell>{log.performed_by}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(log)}
                        >
                          <Info className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 italic text-muted-foreground">
                      No audit logs found matching the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={logDetails !== null} onOpenChange={(open) => !open && setLogDetails(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Detailed information about this activity
            </DialogDescription>
          </DialogHeader>
          {logDetails && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Action</p>
                  <p>{logDetails.action}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entity</p>
                  <p>{logDetails.entity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entity ID</p>
                  <p className="font-mono text-xs">{logDetails.entity_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                  <p>{formatDateTime(logDetails.performed_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Performed By</p>
                  <p>{logDetails.performed_by}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Log ID</p>
                  <p className="font-mono text-xs">{logDetails.id}</p>
                </div>
              </div>
              
              {logDetails.details && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Additional Details</p>
                  <pre className="bg-slate-100 p-3 rounded-md text-xs overflow-auto max-h-48">
                    {JSON.stringify(logDetails.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AuditLogs; 