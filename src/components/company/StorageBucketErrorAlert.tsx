import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StorageBucketErrorAlertProps {
  onDismiss?: () => void;
}

export function StorageBucketErrorAlert({ onDismiss }: StorageBucketErrorAlertProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const sqlScript = `-- Create a public storage bucket for company profiles
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
WITH CHECK (true);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    toast({
      title: "SQL copied to clipboard",
      description: "You can now paste this in the Supabase SQL Editor"
    });
    
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Storage bucket not available</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">
          The Supabase storage bucket required for image uploads is not configured properly. 
          This is usually fixed by an administrator running the SQL script below in the Supabase dashboard.
        </p>
        
        <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs mt-2 mb-4 relative overflow-hidden">
          <pre className="whitespace-pre-wrap overflow-x-auto max-h-40">{sqlScript}</pre>
          <Button 
            size="sm" 
            variant="ghost" 
            className="absolute top-2 right-2 h-8 w-8 p-0" 
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onDismiss}
          >
            Dismiss
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
} 