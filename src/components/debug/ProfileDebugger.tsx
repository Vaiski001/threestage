import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import { checkStorageBucket } from "@/lib/supabase/setupStorage";

/**
 * This is a diagnostic component to help identify issues with profile saving
 * without modifying the existing code. Add it to any profile-related page
 * to help debug issues.
 */
export function ProfileDebugger() {
  const [results, setResults] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const runDiagnostic = async () => {
    setIsLoading(true);
    setResults("Running diagnostics...\n");
    
    try {
      // Step 1: Check auth status
      const { data: authData } = await supabase.auth.getSession();
      const userId = authData.session?.user?.id;
      const isAuthenticated = !!authData.session;
      
      setResults(prev => prev + `\n✓ Authentication check: ${isAuthenticated ? "Authenticated" : "Not authenticated"}`);
      
      if (!isAuthenticated) {
        setResults(prev => prev + "\n❌ Error: User is not authenticated. Please sign in.");
        return;
      }
      
      setResults(prev => prev + `\n✓ User ID: ${userId}`);

      // Step 2: Check storage bucket
      const bucketAvailable = await checkStorageBucket();
      setResults(prev => prev + `\n✓ Storage bucket check: ${bucketAvailable ? "Available" : "Not available"}`);
      
      if (!bucketAvailable) {
        setResults(prev => prev + "\n❌ Error: Storage bucket is not available. SQL script should be run.");
        // More details here...
      }

      // Step 3: Check user profile existence
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        setResults(prev => prev + `\n❌ Error fetching profile: ${profileError.message}`);
      } else if (!profileData) {
        setResults(prev => prev + "\n❌ Error: User profile doesn't exist");
      } else {
        setResults(prev => prev + "\n✓ Profile exists");
        setResults(prev => prev + `\n✓ Profile data: ${JSON.stringify(profileData, null, 2)}`);
      }
      
      // Step 4: Test RPC function
      if (profileData) {
        // Use current values to not change anything
        const testData = {
          company_name: profileData.company_name || "Test Company",
          industry: profileData.industry || "Technology",
          description: profileData.profile_description || "",
          branding_json: profileData.profile_branding ? 
            (typeof profileData.profile_branding === 'string' ? 
              profileData.profile_branding : 
              JSON.stringify(profileData.profile_branding)
            ) : 
            JSON.stringify({logo: null, banner: null})
        };
        
        setResults(prev => prev + `\n📝 Testing RPC with data: ${JSON.stringify(testData, null, 2)}`);
        
        const { data: rpcData, error: rpcError } = await supabase.rpc(
          'update_company_branding',
          {
            user_id: userId,
            ...testData
          }
        );
        
        if (rpcError) {
          setResults(prev => prev + `\n❌ RPC function error: ${rpcError.message}`);
          setResults(prev => prev + `\n💡 Try checking the RPC function in SQL Editor`);
        } else {
          setResults(prev => prev + `\n✓ RPC function works correctly: ${JSON.stringify(rpcData)}`);
        }
        
        // Step 5: Test direct update
        const { data: directData, error: directError } = await supabase
          .from('profiles')
          .update({
            company_name: testData.company_name
          })
          .eq('id', userId);
          
        if (directError) {
          setResults(prev => prev + `\n❌ Direct update error: ${directError.message}`);
          setResults(prev => prev + `\n💡 This could be an RLS policy issue`);
        } else {
          setResults(prev => prev + `\n✓ Direct update works correctly`);
        }
      }
      
      // Step 6: Check React Query cache
      const cachedProfile = queryClient.getQueryData(["profile"]);
      if (cachedProfile) {
        setResults(prev => prev + `\n✓ React Query cache has profile data`);
      } else {
        setResults(prev => prev + `\n⚠️ React Query cache doesn't have profile data`);
      }
      
      // Provide summary and recommendations
      setResults(prev => prev + "\n\n--- Summary ---");
      if (!bucketAvailable) {
        setResults(prev => prev + "\n1. Main issue: Storage bucket not available");
      } else if (profileError) {
        setResults(prev => prev + "\n1. Main issue: Cannot fetch profile data");
      } else if (profileData && 'profile_branding' in profileData) {
        setResults(prev => prev + "\n✓ Profile setup looks correct");
      }
      
    } catch (error: any) {
      setResults(prev => prev + `\n❌ Diagnostic error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshCache = () => {
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    setResults("Profile cache invalidated. Refresh the page to see if changes appear.");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-4">
      <CardHeader>
        <CardTitle>Profile System Diagnostics</CardTitle>
        <CardDescription>
          Diagnose issues with profile saving and storage bucket configuration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="diagnose">
          <TabsList className="mb-4">
            <TabsTrigger value="diagnose">Diagnostics</TabsTrigger>
            <TabsTrigger value="fix">Fix Attempts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="diagnose">
            <div className="flex gap-4 mb-4">
              <Button 
                onClick={runDiagnostic}
                disabled={isLoading}
                variant="default"
              >
                {isLoading ? "Running..." : "Run Diagnostics"}
              </Button>
              
              <Button 
                onClick={refreshCache}
                variant="outline"
              >
                Refresh React Query Cache
              </Button>
            </div>
            
            {results && (
              <pre className="p-4 bg-gray-100 rounded-md whitespace-pre-wrap text-xs overflow-auto max-h-96">
                {results}
              </pre>
            )}
          </TabsContent>
          
          <TabsContent value="fix">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Fix Storage Bucket</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Run this SQL in the Supabase SQL Editor:
                </p>
                <pre className="p-4 bg-gray-100 rounded-md text-xs overflow-auto">
{`-- Create a public storage bucket for company profiles
INSERT INTO storage.buckets (id, name, public)
SELECT 'public', 'public', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'public'
);

-- Enable RLS on the objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create permissive storage policies
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (true);`}
                </pre>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Fix RPC Function</h3>
                <p className="text-sm text-gray-500 mb-2">
                  If RPC errors are shown, run this SQL:
                </p>
                <pre className="p-4 bg-gray-100 rounded-md text-xs overflow-auto">
{`-- Create a simple RPC function for updating company branding
CREATE OR REPLACE FUNCTION update_company_branding(
  user_id UUID,
  company_name TEXT DEFAULT NULL,
  industry TEXT DEFAULT NULL,
  description TEXT DEFAULT NULL,
  branding_json TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Update the profile with the provided values
  UPDATE profiles
  SET
    company_name = COALESCE(update_company_branding.company_name, profiles.company_name),
    industry = COALESCE(update_company_branding.industry, profiles.industry),
    profile_description = COALESCE(update_company_branding.description, profiles.profile_description),
    profile_branding = CASE 
      WHEN update_company_branding.branding_json IS NOT NULL THEN update_company_branding.branding_json::jsonb
      ELSE profiles.profile_branding
    END
  WHERE
    id = user_id;
    
  -- Return success with updated fields
  SELECT jsonb_build_object(
    'success', TRUE,
    'updated_fields', jsonb_build_array(
      'company_name', 
      'industry', 
      'profile_description', 
      'profile_branding'
    )
  ) INTO result;
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', FALSE,
    'error', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 