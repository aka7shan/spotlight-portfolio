import { useState, useRef, useCallback } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import type { CVData } from "../../types/portfolio";
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  FileCheck
} from "lucide-react";

interface CVManagerProps {
  cvData?: CVData;
  onCVUpload: (cvData: CVData) => void;
  onCVRemove: () => void;
  className?: string;
}

export function CVManager({ 
  cvData, 
  onCVUpload, 
  onCVRemove,
  className = ""
}: CVManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = useCallback((bytes?: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }, []);

  const formatDate = useCallback((dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate file type (only PDF)
    if (file.type !== 'application/pdf') {
      setUploadError('Please select a PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);

    // Create file URL for preview/download
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      
      // In a real app, you would upload to a server here
      // For now, we'll create a blob URL
      const blob = new Blob([result], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const newCVData: CVData = {
        fileName: file.name,
        fileUrl: url,
        uploadDate: new Date().toISOString(),
        fileSize: file.size,
        fileType: file.type
      };

      setTimeout(() => {
        onCVUpload(newCVData);
        setIsUploading(false);
      }, 1500);
    };
    reader.readAsArrayBuffer(file);
  }, [onCVUpload]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleDownload = useCallback(() => {
    if (cvData?.fileUrl) {
      const link = document.createElement('a');
      link.href = cvData.fileUrl;
      link.download = cvData.fileName || 'CV.pdf';
      link.click();
    }
  }, [cvData]);

  const handleRemove = useCallback(() => {
    onCVRemove();
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Cleanup blob URL
    if (cvData?.fileUrl && cvData.fileUrl.startsWith('blob:')) {
      URL.revokeObjectURL(cvData.fileUrl);
    }
  }, [onCVRemove, cvData]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          CV/Resume Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Upload Error */}
        {uploadError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        {/* CV Status */}
        {cvData ? (
          <div className="space-y-4">
            {/* CV Info */}
            <div className="flex items-start justify-between p-4 border rounded-lg bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileCheck className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-green-900">{cvData.fileName}</h4>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Uploaded
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-green-700">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Uploaded: {formatDate(cvData.uploadDate)}
                      </span>
                      <span>Size: {formatFileSize(cvData.fileSize)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={handleUploadClick} variant="outline" size="sm" disabled={isUploading}>
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Update CV'}
              </Button>
              <Button 
                onClick={handleRemove} 
                variant="outline" 
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          /* Upload Section */
          <div className="text-center py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-muted rounded-full">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium mb-2">No CV uploaded yet</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your CV/Resume to showcase your experience
                </p>
              </div>
              <Button 
                onClick={handleUploadClick} 
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload CV'}
              </Button>
            </div>
          </div>
        )}

        {/* Guidelines */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p className="font-medium mb-1">CV Upload Guidelines:</p>
          <ul className="space-y-1">
            <li>• Only PDF files are accepted</li>
            <li>• Maximum file size: 10MB</li>
            <li>• Ensure your CV is up-to-date before uploading</li>
            <li>• This will be available for download in your portfolio</li>
          </ul>
        </div>

        {/* Loading State */}
        {isUploading && (
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center gap-3 text-blue-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium">Processing your CV...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}