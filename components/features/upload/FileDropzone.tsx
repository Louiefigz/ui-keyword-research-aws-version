'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { LoadingSpinner } from '@/components/ui/feedback/loading-spinner';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  acceptedFileTypes?: string;
  maxSize?: number;
  isLoading?: boolean;
  currentFile?: File | null;
}

export function FileDropzone({ 
  onFileSelect, 
  acceptedFileTypes = '.csv',
  maxSize = 50 * 1024 * 1024, // 50MB
  isLoading = false,
  currentFile
}: FileDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'text/comma-separated-values': ['.csv'],
      'application/csv': ['.csv'],
    },
    maxSize,
    maxFiles: 1,
    onDrop,
    disabled: isLoading,
  });

  const getErrorMessage = (fileRejection: any) => {
    if (fileRejection.errors[0]?.code === 'file-too-large') {
      return `File is too large. Maximum size is ${maxSize / 1024 / 1024}MB`;
    }
    if (fileRejection.errors[0]?.code === 'file-invalid-type') {
      return 'Invalid file type. Please upload a CSV file';
    }
    return fileRejection.errors[0]?.message || 'File upload error';
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all",
          isDragActive && "border-primary bg-primary/5",
          isLoading && "opacity-50 cursor-not-allowed",
          fileRejections.length > 0 && "border-destructive",
          currentFile && "border-green-500 bg-green-50",
          !isDragActive && !isLoading && !currentFile && "hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />
        
        {isLoading ? (
          <div className="flex flex-col items-center">
            <LoadingSpinner className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">Detecting CSV format...</p>
            <p className="text-sm text-muted-foreground mt-2">
              This may take a few seconds
            </p>
          </div>
        ) : currentFile ? (
          <div className="flex flex-col items-center">
            <FileText className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <p className="text-lg font-medium text-gray-900">{currentFile.name}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {(currentFile.size / 1024 / 1024).toFixed(2)}MB • {acceptedFileTypes} file
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Click or drag to replace
            </p>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop the CSV file here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Drag & drop your {acceptedFileTypes} file here, or click to select
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports files up to {maxSize / 1024 / 1024}MB from Ahrefs, SEMrush, or Moz
                </p>
                <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <span>{acceptedFileTypes} format</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Upload className="h-3 w-3" />
                    <span>Max {maxSize / 1024 / 1024}MB</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {fileRejections.length > 0 && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-destructive">Upload Error</p>
              <p className="text-destructive/80 mt-1">
                {getErrorMessage(fileRejections[0])}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}