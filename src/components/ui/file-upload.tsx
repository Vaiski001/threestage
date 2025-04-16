import * as React from "react";
import { useState, useRef } from "react";
import { UploadIcon, XIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { uploadFile, getStorageUrl } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  bucket: string;
  path: string;
  onSuccess?: (url: string, file: File) => void;
  onError?: (error: any) => void;
  className?: string;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
  buttonText?: string;
  dropzoneText?: string;
  uploadingText?: string;
  showPreview?: boolean;
  previewType?: "image" | "icon";
  defaultValue?: string;
}

export function FileUpload({
  bucket,
  path,
  onSuccess,
  onError,
  className,
  acceptedFileTypes = "image/*",
  maxSizeMB = 5,
  buttonText = "Select File",
  dropzoneText = "or drag and drop",
  uploadingText = "Uploading...",
  showPreview = true,
  previewType = "image",
  defaultValue,
  ...props
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | undefined>(defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;
    
    // Validate file size
    if (selectedFile.size > maxSizeBytes) {
      setError(`File size exceeds the maximum limit of ${maxSizeMB}MB`);
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    
    // Create a temporary URL for preview
    const tempUrl = URL.createObjectURL(selectedFile);
    setFileUrl(tempUrl);
    
    // Auto start upload
    await handleUpload(selectedFile);
  };

  const handleUpload = async (fileToUpload: File) => {
    if (!fileToUpload) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Generate unique file path if needed
      const uniquePath = path.includes("{uuid}") 
        ? path.replace("{uuid}", crypto.randomUUID()) 
        : path;
      
      // Use the file name if path ends with a directory
      const finalPath = uniquePath.endsWith("/") 
        ? `${uniquePath}${fileToUpload.name}` 
        : uniquePath;
      
      // Upload the file with progress tracking
      const result = await uploadFile(
        bucket,
        finalPath,
        fileToUpload,
        (progress) => {
          setUploadProgress(progress);
        }
      );
      
      // Type assertion for the result
      type UploadResult = { data: { path: string } | null; error: { message: string } | null };
      const typedResult = result as UploadResult;
      
      if (typedResult.error) {
        throw typedResult.error;
      }
      
      // Get the public URL
      const publicUrl = getStorageUrl(bucket, finalPath);
      setFileUrl(publicUrl);
      
      // Call the success callback with the URL and file
      onSuccess?.(publicUrl, fileToUpload);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
      onError?.(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isUploading) return;
    
    const droppedFile = e.dataTransfer.files?.[0];
    
    if (droppedFile) {
      // Validate file size
      if (droppedFile.size > maxSizeBytes) {
        setError(`File size exceeds the maximum limit of ${maxSizeMB}MB`);
        return;
      }
      
      setFile(droppedFile);
      setError(null);
      
      // Create a temporary URL for preview
      const tempUrl = URL.createObjectURL(droppedFile);
      setFileUrl(tempUrl);
      
      // Auto start upload
      await handleUpload(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClearFile = () => {
    setFile(null);
    setFileUrl(undefined);
    setError(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const showFilePreview = showPreview && fileUrl && !isUploading;
  const isImage = file?.type.startsWith("image/") || (fileUrl && previewType === "image");

  return (
    <div className={cn("w-full", className)}>
      {error && (
        <div className="text-sm text-red-500 mb-2">{error}</div>
      )}
      
      <div 
        className={cn(
          "border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center relative",
          isUploading ? "bg-gray-50" : "bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors",
          error ? "border-red-500" : "border-gray-300"
        )}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {showFilePreview ? (
          <div className="relative max-w-full">
            {isImage ? (
              <img 
                src={fileUrl} 
                alt="File preview" 
                className="max-h-32 max-w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center">
                <UploadIcon className="h-10 w-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500 break-all">
                  {file?.name || "File uploaded"}
                </span>
              </div>
            )}
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClearFile();
              }}
              className="absolute -top-2 -right-2 bg-gray-100 rounded-full p-1 border border-gray-300 hover:bg-gray-200"
              aria-label="Remove file"
            >
              <XIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        ) : isUploading ? (
          <div className="w-full">
            <UploadIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="font-medium">{uploadingText}</p>
            <div className="mt-4 px-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <>
            <UploadIcon className="h-10 w-10 text-gray-400 mb-2" />
            <p className="font-medium">{buttonText}</p>
            <p className="text-sm text-muted-foreground">{dropzoneText}</p>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              onChange={handleFileChange}
              accept={acceptedFileTypes}
              {...props}
            />
          </>
        )}
      </div>
      
      {!isUploading && !error && (
        <p className="text-xs text-muted-foreground mt-2">
          Max file size: {maxSizeMB}MB
        </p>
      )}
    </div>
  );
} 