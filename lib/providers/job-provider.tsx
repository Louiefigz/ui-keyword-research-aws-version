'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ProcessingJob, JobStatus } from '@/types/api/job.types';
import { uploadsApi } from '@/lib/api/uploads';

interface JobContextType {
  activeJob: ProcessingJob | null;
  projectId: string | null;
  isProcessing: boolean;
  startJob: (projectId: string, jobId: string) => void;
  clearJob: () => void;
  checkJobStatus: () => Promise<void>;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

const JOB_STORAGE_KEY = 'active_job';
const POLL_INTERVAL = 2000; // 2 seconds polling interval

export function JobProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [activeJob, setActiveJob] = useState<ProcessingJob | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load job from localStorage on mount
  useEffect(() => {
    const storedJob = localStorage.getItem(JOB_STORAGE_KEY);
    if (storedJob) {
      try {
        const { projectId, jobId } = JSON.parse(storedJob);
        // Only start job if both projectId and jobId are valid
        if (projectId && jobId && projectId !== 'undefined' && jobId !== 'undefined') {
          startJob(projectId, jobId);
        } else {
          localStorage.removeItem(JOB_STORAGE_KEY);
        }
      } catch (error) {
        // Failed to parse job data from localStorage
        localStorage.removeItem(JOB_STORAGE_KEY);
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, []);

  const startJob = useCallback((projectId: string, jobId: string) => {
    // Starting job tracking
    
    // Validate inputs
    if (!projectId || !jobId || projectId === 'undefined' || jobId === 'undefined') {
      // Invalid job parameters
      return;
    }
    
    // Store in localStorage
    localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify({ projectId, jobId }));
    setProjectId(projectId);
    
    // IMPORTANT: Clear any existing polling interval to prevent multiple intervals
    if (pollIntervalRef.current) {
      // Clear existing polling interval before starting new one
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    // Track polling count for timeout
    let pollCount = 0;
    let errorCount = 0;
    const maxPolls = 60; // 2 minutes max (60 * 2000ms)
    const maxErrors = 5; // Max consecutive errors before stopping

    // Start polling
    // Create new polling interval
    pollIntervalRef.current = setInterval(async () => {
      pollCount++;
      // Polling job status
      try {
        const job = await uploadsApi.getJobStatus(projectId, jobId);
        // Job status received - reset error count on success
        errorCount = 0;
        setActiveJob(job);

        // Backend returns lowercase status values - this is CRITICAL!
        const status = job.status;
        
        if (status === 'completed') {
          // Job completed, stop polling and redirect
          // Clear the interval immediately
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          // Clear job data
          localStorage.removeItem(JOB_STORAGE_KEY);
          setActiveJob(null);
          setProjectId(null);
          // Redirect to dashboard
          router.push(`/projects/${projectId}/dashboard`);
          return; // Stop execution
        } else if (status === 'failed') {
          // Job failed, stop polling
          // Clear the interval immediately
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          // Clear job data
          localStorage.removeItem(JOB_STORAGE_KEY);
          setActiveJob(null);
          setProjectId(null);
          // Show error
          alert(`Job failed: ${job.error || 'Processing failed'}`);
          // Job failed with error
          return; // Stop execution
        } else if (status === 'cancelled') {
          // Job cancelled, stop polling
          // Clear the interval immediately
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          // Clear job data
          localStorage.removeItem(JOB_STORAGE_KEY);
          setActiveJob(null);
          setProjectId(null);
          // Show cancellation message
          alert('Processing was cancelled');
          return; // Stop execution
        }
        
        // Timeout check
        if (pollCount >= maxPolls) {
          // Job polling timeout reached
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          // Clear job data
          localStorage.removeItem(JOB_STORAGE_KEY);
          setActiveJob(null);
          setProjectId(null);
          alert('Processing is taking longer than expected. Please try refreshing the page.');
          return;
        }
      } catch (error) {
        // Failed to poll job status - increment error count
        errorCount++;
        console.error('Job polling error:', error);
        
        // Check if it's a 500 error or other server error
        const isServerError = (error as any)?.response?.status >= 500;
        const isTooManyPolls = pollCount >= maxPolls;
        const isTooManyErrors = errorCount >= maxErrors;
        
        if (isServerError || isTooManyPolls || isTooManyErrors) {
          // Server error, timeout, or too many consecutive errors - stop polling
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          
          // Clear job data
          localStorage.removeItem(JOB_STORAGE_KEY);
          setActiveJob(null);
          setProjectId(null);
          
          // Show appropriate error message
          let errorMessage: string;
          if (isServerError) {
            errorMessage = 'Processing encountered a server error (500). Please check the job status manually or try again later.';
          } else if (isTooManyErrors) {
            errorMessage = `Failed to check job status after ${maxErrors} attempts. Please check your connection and try again.`;
          } else {
            errorMessage = 'Processing is taking longer than expected. Please try refreshing the page.';
          }
          
          alert(errorMessage);
          return; // Stop execution
        }
        
        // For other errors (network issues, etc.), continue polling
        // but log the error for debugging
        console.warn(`Job polling attempt ${pollCount} failed (error ${errorCount}/${maxErrors}):`, error);
      }
    }, POLL_INTERVAL);
  }, [router]);

  const clearJob = useCallback(() => {
    // Clear job and stop polling
    localStorage.removeItem(JOB_STORAGE_KEY);
    setActiveJob(null);
    setProjectId(null);
    
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const checkJobStatus = useCallback(async () => {
    if (!projectId || !activeJob?.id) return;
    
    try {
      const job = await uploadsApi.getJobStatus(projectId, activeJob.id);
      setActiveJob(job);
    } catch (error) {
      // Failed to check job status
    }
  }, [projectId, activeJob]);

  const isProcessing = ['pending', 'in_progress'].includes(activeJob?.status || '');

  return (
    <JobContext.Provider value={{
      activeJob,
      projectId,
      isProcessing,
      startJob,
      clearJob,
      checkJobStatus,
    }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJob() {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context;
}