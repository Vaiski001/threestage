import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

export function FileUploadExample() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedDocumentUrl, setUploadedDocumentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleImageUploadSuccess = (url: string, file: File) => {
    setUploadedImageUrl(url);
    setSuccess("Image uploaded successfully!");
    setError(null);
  };

  const handleDocumentUploadSuccess = (url: string, file: File) => {
    setUploadedDocumentUrl(url);
    setSuccess("Document uploaded successfully!");
    setError(null);
  };

  const handleUploadError = (err: any) => {
    setError("Failed to upload file. Please try again.");
    setSuccess(null);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>File Upload Examples</CardTitle>
          <CardDescription>
            Examples of the FileUpload component with progress tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div>
            <h3 className="text-lg font-medium mb-2">Image Upload</h3>
            <FileUpload
              bucket="images"
              path="uploads/{uuid}"
              onSuccess={handleImageUploadSuccess}
              onError={handleUploadError}
              acceptedFileTypes="image/*"
              maxSizeMB={2}
              buttonText="Upload Image"
              dropzoneText="or drag and drop an image"
            />
            {uploadedImageUrl && (
              <p className="text-sm mt-2">
                Uploaded to: <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{uploadedImageUrl}</a>
              </p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Document Upload</h3>
            <FileUpload
              bucket="documents"
              path="uploads/"
              onSuccess={handleDocumentUploadSuccess}
              onError={handleUploadError}
              acceptedFileTypes=".pdf,.doc,.docx,.xlsx,.pptx"
              maxSizeMB={10}
              buttonText="Upload Document"
              dropzoneText="or drag and drop a document"
              previewType="icon"
            />
            {uploadedDocumentUrl && (
              <p className="text-sm mt-2">
                Uploaded to: <a href={uploadedDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{uploadedDocumentUrl}</a>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 