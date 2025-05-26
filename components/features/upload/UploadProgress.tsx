'use client';

import { useEffect } from 'react';
import { FileDown, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/data-display/card';
import { Button } from '@/components/ui/base/button';
import { LoadingSpinner } from '@/components/ui/feedback/loading-spinner';
import { ProgressBar } from '@/components/ui/feedback/progress-bar';
import { formatNumber } from '@/utils/format';

interface UploadProgressProps {
  job: {
    id: string;
    status: 'processing' | 'completed' | 'failed';
    progress: number;
    progress_details?: {
      rows_processed: number;
      total_rows: number;
      keywords_created: number;
      keywords_updated: number;
      errors: number;
    };
    error?: string;
    result?: {
      keywords_created: number;
      keywords_updated: number;
      total_processed: number;
      errors: number;
    };
  };
  onComplete: () => void;
  onCancel: () => void;
}

export function UploadProgress({ job, onComplete, onCancel }: UploadProgressProps) {
  useEffect(() => {
    if (job?.status === 'completed') {
      onComplete();
    }
  }, [job?.status, onComplete]);

  if (!job) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center">
            <LoadingSpinner className="h-8 w-8 mb-4" />
            <p className="text-muted-foreground">Initializing upload...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    switch (job.status) {
      case 'completed':
        return <CheckCircle2 className="h-12 w-12 text-green-600" />;
      case 'failed':
        return <XCircle className="h-12 w-12 text-destructive" />;
      case 'processing':
        return <FileDown className="h-12 w-12 text-primary animate-pulse" />;
      default:
        return <AlertCircle className="h-12 w-12 text-warning" />;
    }
  };

  const getStatusMessage = () => {
    switch (job.status) {
      case 'completed':
        return 'Upload completed successfully!';
      case 'failed':
        return 'Upload failed';
      case 'processing':
        return 'Processing your CSV file...';
      case 'pending':
        return 'Upload queued...';
      default:
        return 'Processing...';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Icon and Message */}
        <div className="flex flex-col items-center text-center">
          {getStatusIcon()}
          <h3 className="text-lg font-semibold mt-4 mb-2">{getStatusMessage()}</h3>
          <p className="text-sm text-muted-foreground">
            Processing {job.file_name}
          </p>
        </div>

        {/* Progress Bar */}
        {job.status === 'processing' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{job.progress_percentage}%</span>
            </div>
            <ProgressBar value={job.progress_percentage} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatNumber(job.processed_rows)} processed</span>
              <span>{formatNumber(job.total_rows)} total rows</span>
            </div>
          </div>
        )}

        {/* Processing Stats */}
        {(job.status === 'processing' || job.status === 'completed') && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Rows Processed</p>
              <p className="text-2xl font-semibold">{formatNumber(job.processed_rows)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Keywords Created</p>
              <p className="text-2xl font-semibold">{formatNumber(job.created_rows)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Keywords Updated</p>
              <p className="text-2xl font-semibold">{formatNumber(job.updated_rows)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Rows Failed</p>
              <p className="text-2xl font-semibold text-destructive">
                {formatNumber(job.failed_rows)}
              </p>
            </div>
          </div>
        )}

        {/* Errors */}
        {job.errors && job.errors.length > 0 && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <h4 className="font-medium text-sm mb-2">Errors encountered:</h4>
            <ul className="text-sm text-destructive space-y-1">
              {job.errors.slice(0, 5).map((error: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  {error}
                </li>
              ))}
            </ul>
            {job.errors.length > 5 && (
              <p className="text-xs text-muted-foreground mt-2">
                And {job.errors.length - 5} more errors...
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          {job.status === 'processing' && (
            <Button variant="outline" onClick={onCancel}>
              Cancel Upload
            </Button>
          )}
          {job.status === 'failed' && (
            <Button variant="outline" onClick={onCancel}>
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}