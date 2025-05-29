'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProcessingStatus } from '@/components/features/upload/ProcessingStatus';
import { useJob } from '@/lib/providers/job-provider';

export default function ProcessingPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const jobId = params.jobId as string;
  const { startJob, activeJob } = useJob();

  useEffect(() => {
    // Only start tracking if we're not already tracking this job
    if (!activeJob || activeJob.id !== jobId) {
      // Start job tracking
      startJob(projectId, jobId);
    }
  }, [projectId, jobId, startJob, activeJob]);

  return <ProcessingStatus />;
}