'use client';

import { useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <MainLayout>
      <div className="flex h-[50vh] flex-col items-center justify-center text-center">
        <div className="rounded-full bg-destructive/10 p-3 mb-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Something went wrong!</h1>
        <p className="text-muted-foreground mb-8 max-w-sm">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </MainLayout>
  );
}