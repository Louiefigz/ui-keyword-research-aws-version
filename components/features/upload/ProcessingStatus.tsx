'use client';

import React from 'react';
import { AlertCircle, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/data-display/card';
import { ProgressBar } from '@/components/ui/feedback/progress-bar';
import { Button } from '@/components/ui/base/button';
import { useJob } from '@/lib/providers/job-provider';

interface ProcessingStatusProps {
  onRetry?: () => void;
}

export function ProcessingStatus({ onRetry }: ProcessingStatusProps) {
  const { activeJob, isProcessing } = useJob();

  if (!activeJob) {
    return null;
  }

  const getStatusIcon = () => {
    const status = activeJob.status; // Backend returns lowercase
    switch (status) {
      case 'pending':
      case 'in_progress':
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="h-8 w-8 text-green-500" />;
      case 'failed':
        return <XCircle className="h-8 w-8 text-red-500" />;
      case 'cancelled':
        return <XCircle className="h-8 w-8 text-orange-500" />;
      default:
        return <AlertCircle className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    const status = activeJob.status; // Backend returns lowercase
    switch (status) {
      case 'pending':
        return 'Preparing to process your CSV files...';
      case 'in_progress':
        return activeJob.progress?.message || 'Processing your keywords...';
      case 'completed':
        return 'Processing complete! Redirecting to dashboard...';
      case 'failed':
        return activeJob.error || 'Processing failed. Please try again.';
      case 'cancelled':
        return 'Processing was cancelled.';
      default:
        return `Unknown status: ${activeJob.status}`;
    }
  };

  const estimatedTimeRemaining = () => {
    if (activeJob.status !== 'in_progress' || !activeJob.progress?.percentage_complete) {
      return null;
    }

    // Simple time estimation based on progress
    const elapsedTime = new Date().getTime() - new Date(activeJob.started_at || activeJob.created_at).getTime();
    const estimatedTotal = (elapsedTime / activeJob.progress.percentage_complete) * 100;
    const remaining = estimatedTotal - elapsedTime;
    
    const minutes = Math.ceil(remaining / 60000);
    if (minutes < 1) return 'Less than a minute';
    if (minutes === 1) return '1 minute';
    return `${minutes} minutes`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className="text-2xl font-bold">
            {isProcessing ? 'Processing Your CSV Files' : 'Processing Status'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Message */}
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-2">{getStatusMessage()}</p>
            {activeJob.status === 'in_progress' && (
              <p className="text-sm text-gray-500">
                {activeJob.progress.current_step}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          {activeJob.status === 'in_progress' && (
            <div className="space-y-2">
              <ProgressBar value={activeJob.progress.percentage_complete} />
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {activeJob.progress.items_processed} / {activeJob.progress.total_items} items
                </span>
                <span>{activeJob.progress.percentage_complete}%</span>
              </div>
            </div>
          )}

          {/* Time Estimate */}
          {estimatedTimeRemaining() && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Estimated time remaining: <span className="font-semibold">{estimatedTimeRemaining()}</span>
              </p>
            </div>
          )}

          {/* Important Notice */}
          {isProcessing && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">Please wait while we process your data</p>
                  <p>
                    This may take several minutes depending on the size of your CSV files. 
                    Please do not close this window or navigate away.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {activeJob.status === 'failed' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 mb-3">{activeJob.error}</p>
              {onRetry && activeJob.retry_count < activeJob.max_retries && (
                <Button onClick={onRetry} variant="outline" size="sm">
                  Retry Processing
                </Button>
              )}
            </div>
          )}

          {/* Additional Info */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Job ID:</span>
                <span className="ml-2 font-mono text-xs">{activeJob.id}</span>
              </div>
              <div>
                <span className="text-gray-500">Started:</span>
                <span className="ml-2">
                  {new Date(activeJob.started_at || activeJob.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}