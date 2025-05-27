'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { useJob } from '@/lib/providers/job-provider';
import { Loader2 } from 'lucide-react';

interface JobAwareLayoutProps {
  children: ReactNode;
  projectId: string;
}

export function JobAwareLayout({ children, projectId }: JobAwareLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { activeJob, isProcessing } = useJob();

  useEffect(() => {
    // If there's an active job and we're not on the processing page, redirect
    if (isProcessing && activeJob && !pathname.includes('/processing/')) {
      router.replace(`/projects/${projectId}/processing/${activeJob.id}`);
    }
  }, [isProcessing, activeJob, pathname, projectId, router]);

  // If processing and not on processing page, show loading state
  if (isProcessing && !pathname.includes('/processing/')) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-lg font-semibold">Processing in progress...</p>
          <p className="text-sm text-gray-600 mt-2">Redirecting to status page...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}