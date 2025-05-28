'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, FileText, Target } from 'lucide-react';
import { Button } from '@/components/ui/base/button';
import { FileDropzone } from '@/components/features/upload/FileDropzone';
import { UpdateStrategySelector } from '@/components/features/upload/UpdateStrategySelector';
import { useDetectSchema, useUploadCSV } from '@/lib/hooks/use-uploads';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/base/badge';
import type { UpdateStrategy } from '@/types/api.types';

type UploadStep = 'select' | 'preview' | 'strategy' | 'upload' | 'complete';

interface FileUpload {
  file: File | null;
  schema: any | null; // Using any for now since the schema structure varies
  type: 'organic' | 'content_gap';
}

export default function UploadPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [step, setStep] = useState<UploadStep>('select');
  const [organicFile, setOrganicFile] = useState<FileUpload>({ 
    file: null, 
    schema: null, 
    type: 'organic' 
  });
  const [contentGapFile, setContentGapFile] = useState<FileUpload>({ 
    file: null, 
    schema: null, 
    type: 'content_gap' 
  });
  const [updateStrategy, setUpdateStrategy] = useState<UpdateStrategy>('replace');
  const [jobId, setJobId] = useState<string | null>(null);

  const detectSchemaMutation = useDetectSchema();
  const uploadMutation = useUploadCSV();

  const handleFileSelect = async (selectedFile: File, fileType: 'organic' | 'content_gap') => {
    try {
      // Call schema detection with the file directly
      const schemaResponse = await detectSchemaMutation.mutateAsync(selectedFile);

      if (fileType === 'organic') {
        setOrganicFile({
          file: selectedFile,
          schema: schemaResponse,
          type: 'organic'
        });
      } else {
        setContentGapFile({
          file: selectedFile,
          schema: schemaResponse,
          type: 'content_gap'
        });
      }
    } catch (error) {
      console.error('Schema detection failed:', error);
      // Still save the file even if schema detection fails
      if (fileType === 'organic') {
        setOrganicFile({
          file: selectedFile,
          schema: null,
          type: 'organic'
        });
      } else {
        setContentGapFile({
          file: selectedFile,
          schema: null,
          type: 'content_gap'
        });
      }
    }
  };

  const handleSchemaConfirm = () => {
    setStep('strategy');
  };

  const handleStrategyNext = async () => {
    // At least one file must be selected
    if (!organicFile.file && !contentGapFile.file) {
      return;
    }

    try {
      const result = await uploadMutation.mutateAsync({
        organicFile: organicFile.file,
        contentGapFile: contentGapFile.file,
        projectId,
        updateStrategy,
        organicMapping: {},
        contentGapMapping: {}
      });
      
      // Check if the job was created successfully (API returns job_id, but transforms to jobId)
      if (!result.jobId) {
        throw new Error('Failed to create processing job');
      }
      
      // Get the processing job ID from the response
      const processingJobId = result.jobId;
      if (processingJobId) {
        // Show alert about processing time
        alert(
          'Your CSV files have been uploaded successfully!\n\n' +
          'Processing will take several minutes. You will be redirected to the processing status page.\n\n' +
          'Please do not close your browser or navigate away during processing.'
        );
        
        // Redirect to processing page
        router.push(`/projects/${projectId}/processing/${processingJobId}`);
      } else {
        throw new Error('No processing job ID received from server');
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error.message}`);
    }
  };

  const handleUploadComplete = () => {
    router.push(`/projects/${projectId}/dashboard`);
  };

  const handleBack = () => {
    switch (step) {
      case 'strategy':
        setStep('select');
        break;
      default:
        router.push(`/projects/${projectId}/dashboard`);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'select':
        return (
          <div className="space-y-6">
            <div className="text-center mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Upload at least one CSV file to continue. You can upload either organic keywords, content gap analysis, or both.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Organic Keywords Upload */}
              <Card className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Organic Keywords</h3>
                    <Badge variant="secondary">
                      <FileText className="mr-1 h-3 w-3" />
                      Optional
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload your organic keywords export from Ahrefs, SEMrush, or similar tools
                  </p>
                </div>
                <FileDropzone 
                  onFileSelect={(file) => handleFileSelect(file, 'organic')}
                  isLoading={detectSchemaMutation.isPending}
                  acceptedFileTypes=".csv"
                  currentFile={organicFile.file}
                />
                {organicFile.schema && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✓ Schema detected successfully
                    </p>
                  </div>
                )}
              </Card>

              {/* Content Gap Upload */}
              <Card className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Content Gap Analysis</h3>
                    <Badge variant="secondary">
                      <Target className="mr-1 h-3 w-3" />
                      Optional
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload your content gap analysis to identify missing opportunities
                  </p>
                </div>
                <FileDropzone 
                  onFileSelect={(file) => handleFileSelect(file, 'content_gap')}
                  isLoading={detectSchemaMutation.isPending}
                  acceptedFileTypes=".csv"
                  currentFile={contentGapFile.file}
                />
                {contentGapFile.schema && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✓ Schema detected successfully
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* Continue button */}
            {(organicFile.file || contentGapFile.file) && (
              <div className="flex justify-end">
                <Button 
                  onClick={() => setStep('strategy')}
                  size="lg"
                >
                  Continue to Upload Options
                </Button>
              </div>
            )}
          </div>
        );
      
      case 'strategy':
        return (
          <div className="space-y-6">
            <UpdateStrategySelector 
              value={updateStrategy}
              onChange={setUpdateStrategy}
              existingKeywords={0} // You would get this from the project stats
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('select')}>
                Back
              </Button>
              <Button 
                onClick={handleStrategyNext}
                disabled={uploadMutation.isPending}
              >
                {uploadMutation.isPending ? 'Uploading...' : 'Upload Files'}
              </Button>
            </div>
          </div>
        );
      
      case 'upload':
        // This component would need to be updated to handle job tracking
        // For now, we'll show a simple completion message
        return (
          <Card>
            <CardHeader>
              <CardTitle>Upload in Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Your CSV files are being processed. Job ID: {jobId}</p>
              <Button onClick={handleUploadComplete} className="mt-4">
                Continue to Dashboard
              </Button>
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold">Upload Keywords</h1>
        <p className="text-muted-foreground mt-2">
          Import keyword data from Ahrefs, SEMrush, or Moz
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {renderStep()}
      </div>
    </div>
  );
}