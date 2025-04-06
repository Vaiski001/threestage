import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { UploadIcon, Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface ImageUploaderProps {
  initialImage?: string;
  onImageUploaded: (url: string) => void;
  type: "logo" | "banner";
  label: string;
}

export function ImageUploader({ initialImage, onImageUploaded, type, label }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImage);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      setError(null);
      
      // Check file size only (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size exceeds 5MB limit");
      }
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `company-profiles/${type}/${fileName}`;
      
      // Upload the file to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      
      // Set the URL and notify parent
      const publicUrl = urlData.publicUrl;
      setImageUrl(publicUrl);
      onImageUploaded(publicUrl);
      
    } catch (error: any) {
      setError(error.message || "Error uploading image");
      console.error("Error uploading image:", error);
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

  return (
    <div className="w-full">
      <div 
        className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center h-48 bg-gray-50 cursor-pointer relative"
        onClick={() => !uploading && document.getElementById(`${type}-upload`)?.click()}
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
          id={`${type}-upload`}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      
      {type === "logo" ? (
        <p className="text-xs text-muted-foreground mt-2">Recommended size: 400x400px. Max file size: 2MB.</p>
      ) : (
        <p className="text-xs text-muted-foreground mt-2">Recommended size: 1200x300px. Max file size: 5MB.</p>
      )}
    </div>
  );
} 