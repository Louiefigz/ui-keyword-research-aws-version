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

// Upload CSV files (both organic and content gap)
export function useUploadCSV() {
  return useMutation({
    mutationFn: ({ 
      organicFile, 
      contentGapFile, 
      projectId, 
      updateStrategy,
      organicMapping,
      contentGapMapping
    }: { 
      organicFile: File | null;
      contentGapFile: File | null;
      projectId: string;
      updateStrategy: 'append' | 'update' | 'replace';
      organicMapping: Record<string, string>;
      contentGapMapping: Record<string, string>;
    }) => uploadsApi.uploadDualCSV({
      organicFile,
      contentGapFile,
      projectId,
      updateStrategy,
      organicMapping,
      contentGapMapping
    }),
  });
}

// Get job status
export function useJobStatus(projectId: string, jobId: string | null, options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: uploadKeys.job(jobId || ''),
    queryFn: () => uploadsApi.getJobStatus(projectId, jobId || ''),
    enabled: !!projectId && !!jobId && (options?.enabled ?? true),
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

// Cancel job - Not available in API
// export function useCancelJob() {
//   return useMutation({
//     mutationFn: uploadsApi.cancelJob,
//   });
// }

// Hook for managing the entire upload flow
export function useUploadFlow(projectId: string) {
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [isDetectingSchema, setIsDetectingSchema] = useState(false);
  const [schemaDetected, setSchemaDetected] = useState(false);
  
  const detectSchemaMutation = useDetectSchema();
  const uploadMutation = useUploadCSV();
  const jobQuery = useJobStatus(projectId, jobId);
  // const cancelJobMutation = useCancelJob(); // Not available in API

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
    
    // This function needs to be updated to handle dual file upload
    // For now, keeping single file upload for backward compatibility
    throw new Error('useUploadFlow needs to be updated for dual file upload');
  };

  // Cancel current job - Not available in API
  const cancelJob = async () => {
    // Job cancellation is not supported by the API
    // Job cancellation is not supported by the API
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
      // Note: Job cancellation is not supported by the API
      if (jobId && jobQuery.data?.status === 'processing') {
        // Job is still processing but cancellation is not supported
      }
    };
  }, [jobId, jobQuery.data?.status]);

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