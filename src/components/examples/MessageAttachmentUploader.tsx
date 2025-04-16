import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { PaperclipIcon, XIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface MessageAttachmentUploaderProps {
  messageId: string;
  onAttachmentAdded: (attachment: {
    id: string;
    url: string;
    fileName: string;
    fileSize: number;
    fileType: string;
  }) => void;
}

export function MessageAttachmentUploader({
  messageId,
  onAttachmentAdded,
}: MessageAttachmentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [attachments, setAttachments] = useState<Array<{
    id: string;
    url: string;
    fileName: string;
    fileSize: number;
    fileType: string;
  }>>([]);

  const handleUploadSuccess = (url: string, file?: File) => {
    if (!file) return;
    
    const newAttachment = {
      id: crypto.randomUUID(),
      url,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    };
    
    // Add to local state
    setAttachments(prev => [...prev, newAttachment]);
    
    // Notify parent component
    onAttachmentAdded(newAttachment);
    
    // Hide uploader after successful upload
    setShowUploader(false);
    
    toast({
      title: "File attached",
      description: `${file.name} has been attached to your message.`
    });
  };

  const handleUploadError = (error: any) => {
    toast({
      title: "Upload failed",
      description: "There was a problem uploading your file. Please try again.",
      variant: "destructive"
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
    // Note: In a real implementation, you would also delete the file from storage
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="mb-3 space-y-2">
          <p className="text-sm font-medium text-gray-700">Attachments:</p>
          <div className="space-y-2">
            {attachments.map(attachment => (
              <div 
                key={attachment.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded border text-sm"
              >
                <div className="flex items-center space-x-2 overflow-hidden">
                  <PaperclipIcon className="h-4 w-4 flex-shrink-0 text-gray-500" />
                  <span className="truncate">{attachment.fileName}</span>
                  <span className="text-gray-500">({formatFileSize(attachment.fileSize)})</span>
                </div>
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="p-1 hover:bg-gray-200 rounded-full"
                  aria-label="Remove attachment"
                >
                  <XIcon className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button or Uploader Component */}
      {showUploader ? (
        <div className="border rounded-md p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium">Add Attachment</h3>
            <button
              onClick={() => setShowUploader(false)}
              className="p-1 hover:bg-gray-200 rounded-full"
              aria-label="Close attachment uploader"
            >
              <XIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          
          <FileUpload
            bucket="message-attachments"
            path={`${messageId}/{uuid}`}
            onSuccess={(url, file) => handleUploadSuccess(url, file)}
            onError={handleUploadError}
            acceptedFileTypes="*/*" // Accept all file types
            maxSizeMB={10}
            buttonText="Select file"
            dropzoneText="or drag and drop"
            uploadingText="Uploading attachment..."
            className="mb-2"
          />
          
          <p className="text-xs text-gray-500">
            Max file size: 10MB. Supported formats: Images, PDFs, Office documents, and more.
          </p>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center text-gray-600"
          onClick={() => setShowUploader(true)}
          type="button"
        >
          <PaperclipIcon className="h-4 w-4 mr-2" />
          Add Attachment
        </Button>
      )}
    </div>
  );
} 