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
const POLL_INTERVAL = 500; // 500ms as recommended in docs

export function JobProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [activeJob, setActiveJob] = useState<ProcessingJob | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load job from localStorage on mount
  useEffect(() => {
    const storedJob = localStorage.getItem(JOB_STORAGE_KEY);
    if (storedJob) {
      const { projectId, jobId } = JSON.parse(storedJob);
      startJob(projectId, jobId);
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
    console.log('Starting job tracking:', { projectId, jobId });
    
    // Store in localStorage
    localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify({ projectId, jobId }));
    setProjectId(projectId);
    
    // IMPORTANT: Clear any existing polling interval to prevent multiple intervals
    if (pollIntervalRef.current) {
      console.log('Clearing existing polling interval before starting new one');
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    // Track polling count for timeout
    let pollCount = 0;
    const maxPolls = 240; // 2 minutes max (240 * 500ms)

    // Start polling
    console.log('Creating new polling interval');
    pollIntervalRef.current = setInterval(async () => {
      pollCount++;
      console.log('Polling job status...', { intervalId: pollIntervalRef.current });
      try {
        const job = await uploadsApi.getJobStatus(projectId, jobId);
        console.log('Job status poll:', { 
          jobId, 
          status: job.status, 
          isCompleted: job.status === 'completed',
          intervalStillActive: !!pollIntervalRef.current 
        });
        setActiveJob(job);

        // Backend returns lowercase status values - this is CRITICAL!
        const status = job.status;
        
        if (status === 'completed') {
          console.log('Job completed, stopping polling and redirecting...');
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
          console.log('Job failed, stopping polling...');
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
          console.error('Job failed:', job.error);
          return; // Stop execution
        } else if (status === 'cancelled') {
          console.log('Job cancelled, stopping polling...');
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
          console.log('Job polling timeout reached');
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
        console.error('Failed to poll job status:', error);
      }
    }, POLL_INTERVAL);
  }, [router]);

  const clearJob = useCallback(() => {
    console.log('Clearing job and stopping polling...');
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
      console.error('Failed to check job status:', error);
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