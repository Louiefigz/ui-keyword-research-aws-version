import { useQuery, useMutation } from '@tanstack/react-query';
import { uploadsApi } from '@/lib/api/uploads';
import { useState, useEffect } from 'react';

// Query keys
export const uploadKeys = {
  all: ['uploads'] as const,
  jobs: () => [...uploadKeys.all, 'jobs'] as const,
  job: (id: string) => [...uploadKeys.jobs(), id] as const,
  schema: (file: File) => [...uploadKeys.all, 'schema', file.name] as const,
};

// Detect CSV schema
export function useDetectSchema() {
  return useMutation({
    mutationFn: uploadsApi.detectSchema,
  });
}

// Upload CSV file
export function useUploadCSV() {
  return useMutation({
    mutationFn: ({ file, options }: { 
      file: File; 
      options: Parameters<typeof uploadsApi.uploadCSV>[1] 
    }) => uploadsApi.uploadCSV(file, options),
  });
}

// Get job status
export function useJobStatus(jobId: string | null, options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: uploadKeys.job(jobId || ''),
    queryFn: () => uploadsApi.getJobStatus(jobId || ''),
    enabled: !!jobId && (options?.enabled ?? true),
    refetchInterval: (query) => {
      // Stop polling when job is completed or failed
      if (query.state.data?.status === 'completed' || query.state.data?.status === 'failed') {
        return false;
      }
      // Otherwise poll every 2 seconds
      return options?.refetchInterval || 2000;
    },
  });
}

// Cancel job
export function useCancelJob() {
  return useMutation({
    mutationFn: uploadsApi.cancelJob,
  });
}

// Hook for managing the entire upload flow
export function useUploadFlow(projectId: string) {
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [isDetectingSchema, setIsDetectingSchema] = useState(false);
  const [schemaDetected, setSchemaDetected] = useState(false);
  
  const detectSchemaMutation = useDetectSchema();
  const uploadMutation = useUploadCSV();
  const jobQuery = useJobStatus(jobId);
  const cancelJobMutation = useCancelJob();

  // Detect schema when file is selected
  const detectSchema = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsDetectingSchema(true);
    
    try {
      const schema = await detectSchemaMutation.mutateAsync(selectedFile);
      setSchemaDetected(true);
      return schema;
    } finally {
      setIsDetectingSchema(false);
    }
  };

  // Start upload
  const startUpload = async (updateStrategy: 'append' | 'update' | 'replace') => {
    if (!file) throw new Error('No file selected');
    
    const result = await uploadMutation.mutateAsync({
      file,
      options: { projectId, updateStrategy }
    });
    
    setJobId(result.job_id);
    return result;
  };

  // Cancel current job
  const cancelJob = async () => {
    if (!jobId) return;
    
    await cancelJobMutation.mutateAsync(jobId);
    setJobId(null);
  };

  // Reset flow
  const reset = () => {
    setFile(null);
    setJobId(null);
    setSchemaDetected(false);
    detectSchemaMutation.reset();
    uploadMutation.reset();
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Cancel any ongoing job if component unmounts
      if (jobId && jobQuery.data?.status === 'processing') {
        cancelJobMutation.mutate(jobId);
      }
    };
  }, [jobId]);

  return {
    // State
    file,
    jobId,
    isDetectingSchema,
    schemaDetected,
    schema: detectSchemaMutation.data,
    job: jobQuery.data,
    
    // Actions
    detectSchema,
    startUpload,
    cancelJob,
    reset,
    
    // Loading states
    isUploading: uploadMutation.isPending,
    isProcessing: jobQuery.data?.status === 'processing',
    
    // Errors
    schemaError: detectSchemaMutation.error,
    uploadError: uploadMutation.error,
    jobError: jobQuery.error,
  };
}