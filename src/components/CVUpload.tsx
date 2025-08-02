import { useCallback, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Upload, File, AlertCircle } from "lucide-react";

interface CVUploadProps {
  onFileUpload?: (file: File) => void;
  onExtractedData?: (data: any) => void;
  className?: string;
}

export function CVUpload({ 
  onFileUpload, 
  onExtractedData, 
  className 
}: CVUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF only)
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only.');
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 5MB.');
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // File is valid, process it
    console.log('CV uploaded:', file.name, 'Size:', (file.size / 1024).toFixed(2) + 'KB');
    
    // Call the upload callback if provided
    onFileUpload?.(file);
    
    // Show success message
    alert(`CV "${file.name}" uploaded successfully! AI extraction will be available in future updates.`);
    
    // Simulate basic data extraction (you can expand this)
    const fileName = file.name.replace('.pdf', '');
    const extractedName = fileName
      .replace(/[_-]/g, ' ')
      .replace(/cv|resume|curriculum|vitae/gi, '')
      .trim();
    
    if (extractedName && onExtractedData) {
      onExtractedData({
        name: extractedName,
        fileName: file.name,
        fileSize: file.size
      });
    }

    // Reset the input for future uploads
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileUpload, onExtractedData]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          Quick Start with CV Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="flex-1">
            <p className="text-gray-600 mb-4">
              Upload your CV/Resume to quickly populate your profile. We'll help extract information to get you started faster.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload CV/Resume PDF file"
              />
              
              {/* Upload button */}
              <Button 
                onClick={handleButtonClick}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload CV/Resume
              </Button>
              
              {/* File requirements */}
              <div className="text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  PDF only • Max 5MB
                </div>
              </div>
            </div>
          </div>
          
          {/* Visual indicator */}
          <div className="text-center flex-shrink-0">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-2">
              <File className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500">AI Extraction Coming Soon</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}