import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { runAllDatabaseTests } from '@/lib/supabase/test-connection';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export default function DatabaseTest() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
        setUserRole(data.user.user_metadata?.role || 'unknown');
      }
    };
    
    checkUser();
  }, []);

  const runTests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await runAllDatabaseTests(userId || undefined);
      setTestResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>
        <p className="mb-4">
          This page tests the connection to the Supabase database in the Vercel deployment.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Environment</CardTitle>
              <CardDescription>Information about the current environment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Deployment Target:</span>
                  <Badge>Vercel</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Supabase URL:</span>
                  <Badge variant={import.meta.env.VITE_SUPABASE_URL ? "default" : "destructive"}>
                    {import.meta.env.VITE_SUPABASE_URL ? "Configured" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Supabase Key:</span>
                  <Badge variant={import.meta.env.VITE_SUPABASE_ANON_KEY ? "default" : "destructive"}>
                    {import.meta.env.VITE_SUPABASE_ANON_KEY ? "Configured" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Environment:</span>
                  <Badge variant="outline">{import.meta.env.PROD ? "Production" : "Development"}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Current authenticated user</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">User ID:</span>
                  <span className="text-sm font-mono">{userId || "Not authenticated"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">User Role:</span>
                  <Badge variant={userRole ? "default" : "outline"}>
                    {userRole || "Unknown"}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                {userId ? "User authenticated" : "No active user session"}
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="flex justify-center mb-8">
          <Button onClick={runTests} disabled={loading}>
            {loading ? "Running Tests..." : "Run Database Tests"}
          </Button>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {testResults && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Connection Test Results</CardTitle>
                <CardDescription>Basic connectivity with Supabase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Connection Status:</span>
                    <Badge variant={testResults.connectionTest.success ? "default" : "destructive"}>
                      {testResults.connectionTest.connectionStatus || "Failed"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Profiles Table:</span>
                    <Badge variant={testResults.connectionTest.profilesAccess === "Success" ? "default" : "destructive"}>
                      {testResults.connectionTest.profilesAccess || "Failed"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Forms Table:</span>
                    <Badge variant={
                      testResults.connectionTest.formsAccess === "Success" || 
                      testResults.connectionTest.formsAccess === "Table may need to be created" 
                        ? "default" 
                        : "destructive"
                    }>
                      {testResults.connectionTest.formsAccess || "Failed"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Auth Services:</span>
                    <Badge variant={testResults.connectionTest.authStatus === "Working" ? "default" : "destructive"}>
                      {testResults.connectionTest.authStatus || "Failed"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Storage:</span>
                    <Badge variant={testResults.connectionTest.storageStatus?.success ? "default" : "destructive"}>
                      {testResults.connectionTest.storageStatus?.message || "Failed"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Form Creation Test</CardTitle>
                <CardDescription>Testing ability to create forms in the database</CardDescription>
              </CardHeader>
              <CardContent>
                {userId ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <Badge variant={testResults.formTest.success ? "default" : "destructive"}>
                        {testResults.formTest.success ? "Success" : "Failed"}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Message:</span>
                      <p className="mt-1 text-sm">{testResults.formTest.message}</p>
                    </div>
                    
                    {testResults.formTest.form && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Created Form:</h4>
                        <ScrollArea className="h-60 w-full rounded-md border p-4">
                          <pre className="text-xs">{JSON.stringify(testResults.formTest.form, null, 2)}</pre>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                ) : (
                  <Alert className="bg-yellow-50">
                    <AlertTitle>Not Authenticated</AlertTitle>
                    <AlertDescription>
                      You need to be logged in with a company account to test form creation.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
            
            <div className="text-sm text-center text-muted-foreground mt-4">
              Test completed at {new Date(testResults.timestamp).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
} 