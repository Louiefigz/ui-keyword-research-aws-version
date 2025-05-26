'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileDropzone } from '@/components/features/upload/FileDropzone';
import { SchemaPreview } from '@/components/features/upload/SchemaPreview';
import { UpdateStrategySelector } from '@/components/features/upload/UpdateStrategySelector';
import { UploadProgress } from '@/components/features/upload/UploadProgress';
import { useDetectSchema, useUploadCSV } from '@/lib/hooks/use-uploads';
import type { SchemaDetection, UpdateStrategy } from '@/types/api.types';

type UploadStep = 'select' | 'preview' | 'strategy' | 'upload' | 'complete';

export default function UploadPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [step, setStep] = useState<UploadStep>('select');
  const [file, setFile] = useState<File | null>(null);
  const [schema, setSchema] = useState<SchemaDetection | null>(null);
  const [updateStrategy, setUpdateStrategy] = useState<UpdateStrategy>('replace');
  const [jobId, setJobId] = useState<string | null>(null);

  const detectSchemaMutation = useDetectSchema();
  const uploadMutation = useUploadCSV();

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    try {
      const detectedSchema = await detectSchemaMutation.mutateAsync(selectedFile);
      setSchema(detectedSchema);
      setStep('preview');
    } catch (error) {
      console.error('Schema detection failed:', error);
    }
  };

  const handleSchemaConfirm = () => {
    setStep('strategy');
  };

  const handleStrategyNext = async () => {
    if (!file || !schema) return;

    try {
      const result = await uploadMutation.mutateAsync({
        file,
        projectId,
        source: schema.source,
        updateStrategy,
        columnMapping: schema.columns.reduce((acc, col) => ({
          ...acc,
          [col.csv_column]: col.mapped_to
        }), {})
      });
      
      setJobId(result.job_id);
      setStep('upload');
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleUploadComplete = () => {
    router.push(`/projects/${projectId}/dashboard`);
  };

  const handleBack = () => {
    switch (step) {
      case 'preview':
        setStep('select');
        break;
      case 'strategy':
        setStep('preview');
        break;
      default:
        router.push(`/projects/${projectId}/dashboard`);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'select':
        return (
          <FileDropzone 
            onFileSelect={handleFileSelect}
            isLoading={detectSchemaMutation.isPending}
          />
        );
      
      case 'preview':
        return schema && (
          <SchemaPreview 
            schema={schema}
            onConfirm={handleSchemaConfirm}
            onBack={() => setStep('select')}
          />
        );
      
      case 'strategy':
        return (
          <UpdateStrategySelector 
            strategy={updateStrategy}
            onStrategyChange={setUpdateStrategy}
            onBack={() => setStep('preview')}
            onNext={handleStrategyNext}
            isLoading={uploadMutation.isPending}
          />
        );
      
      case 'upload':
        return jobId && (
          <UploadProgress 
            jobId={jobId}
            onComplete={handleUploadComplete}
          />
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