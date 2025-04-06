import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { UploadIcon, Loader2, AlertCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { StorageBucketErrorAlert } from "./StorageBucketErrorAlert";

interface ImageUploaderProps {
  initialImage?: string;
  onImageUploaded: (url: string) => void;
  type: "logo" | "banner";
  label: string;
}

export function ImageUploaderEnhanced({ initialImage, onImageUploaded, type, label }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImage);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [showBucketError, setShowBucketError] = useState(false);
  const { toast } = useToast();
  
  const checkStorageBucket = async () => {
    try {
      const { data, error } = await supabase.storage.getBucket('public');
      if (error) {
        setDebugInfo(`Bucket error: ${error.message}`);
        setShowBucketError(true);
        return false;
      }
      setDebugInfo(`Bucket exists: ${JSON.stringify(data)}`);
      return true;
    } catch (err: any) {
      setDebugInfo(`Bucket check error: ${err.message}`);
      setShowBucketError(true);
      return false;
    }
  };

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      setError(null);
      setDebugInfo(null);
      setShowBucketError(false);

      // Check storage bucket
      const bucketExists = await checkStorageBucket();
      if (!bucketExists) {
        throw new Error("Storage bucket not available");
      }
      
      // Check file size - set 2MB for logo and 5MB for banner
      const maxSize = type === "logo" ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error(`File size exceeds ${type === "logo" ? "2MB" : "5MB"} limit`);
      }
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `company-profiles/${type}/${fileName}`;
      
      // Check user authentication
      const { data: authData } = await supabase.auth.getSession();
      if (!authData.session) {
        throw new Error("User not authenticated. Please sign in again.");
      }
      
      // Upload the file to Supabase storage with retry
      let attempts = 0;
      let uploadSuccess = false;
      let lastError = null;
      
      while (attempts < 3 && !uploadSuccess) {
        attempts++;
        try {
          const { data, error: uploadError } = await supabase.storage
            .from('public')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: attempts > 1 // Try upsert on retry
            });
          
          if (uploadError) {
            lastError = uploadError;
            setDebugInfo(`Upload attempt ${attempts} failed: ${uploadError.message}`);
            
            // Show bucket error if related to storage
            if (uploadError.message.includes("bucket") || uploadError.message.includes("storage")) {
              setShowBucketError(true);
            }
            
            // Wait briefly before retry
            if (attempts < 3) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          } else {
            uploadSuccess = true;
          }
        } catch (err: any) {
          lastError = err;
          setDebugInfo(`Upload exception on attempt ${attempts}: ${err.message}`);
          
          // Show bucket error if related to storage
          if (err.message.includes("bucket") || err.message.includes("storage")) {
            setShowBucketError(true);
          }
          
          if (attempts < 3) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      if (!uploadSuccess) {
        throw new Error(lastError?.message || "Failed to upload after multiple attempts");
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      
      if (!urlData?.publicUrl) {
        throw new Error("Failed to get public URL");
      }
      
      // Set the URL and notify parent
      const publicUrl = urlData.publicUrl;
      setImageUrl(publicUrl);
      onImageUploaded(publicUrl);
      
      toast({
        title: "Upload successful",
        description: `Your ${type} has been uploaded successfully.`
      });
      
    } catch (error: any) {
      setError(error.message || "Error uploading image");
      console.error("Error uploading image:", error);
      
      // Only show toast for non-bucket errors (bucket errors show the alert)
      if (!showBucketError) {
        toast({
          title: "Upload failed",
          description: error.message || "Failed to upload image",
          variant: "destructive"
        });
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const retryAuth = async () => {
    try {
      setError(null);
      setDebugInfo("Attempting to refresh authentication...");
      
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        setDebugInfo(`Auth refresh error: ${error.message}`);
      } else {
        setDebugInfo(`Auth refreshed: User ID ${data.user?.id}`);
        toast({
          title: "Authentication refreshed",
          description: "Please try uploading again."
        });
      }
    } catch (err: any) {
      setDebugInfo(`Auth refresh exception: ${err.message}`);
    }
  };

  return (
    <div className="w-full">
      {showBucketError && (
        <StorageBucketErrorAlert onDismiss={() => setShowBucketError(false)} />
      )}
    
      <div 
        className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center h-48 bg-gray-50 cursor-pointer relative"
        onClick={() => !uploading && document.getElementById(`${type}-upload-enhanced`)?.click()}
      >
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={label}
            className="max-h-32 max-w-full object-contain"
          />
        ) : (
          <>
            <UploadIcon className="h-10 w-10 text-gray-400 mb-2" />
            <p className="font-medium">Upload {label.toLowerCase()}</p>
            <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
          </>
        )}
        
        <input 
          type="file"
          id={`${type}-upload-enhanced`}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>
      
      {error && !showBucketError && (
        <div className="mt-2">
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
          {error.includes("authentication") && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={retryAuth}
            >
              Refresh Authentication
            </Button>
          )}
        </div>
      )}
      
      {debugInfo && !showBucketError && (
        <div className="mt-1 p-2 bg-gray-100 rounded text-xs text-gray-600 overflow-x-auto">
          <pre>{debugInfo}</pre>
        </div>
      )}
      
      {type === "logo" ? (
        <p className="text-xs text-muted-foreground mt-2">Recommended size: 400x400px. Max file size: 2MB.</p>
      ) : (
        <p className="text-xs text-muted-foreground mt-2">Recommended size: 1200x300px. Max file size: 5MB.</p>
      )}
    </div>
  );
} 