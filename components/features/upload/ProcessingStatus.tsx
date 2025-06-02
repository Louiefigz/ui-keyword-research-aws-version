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
        if (activeJob.progress?.total_items) {
          return `Analyzing and scoring ${activeJob.progress.total_items} keywords...`;
        }
        return 'Processing your keyword data...';
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

  const getProgressPercentage = () => {
    if (!activeJob.progress?.total_items || activeJob.progress.total_items === 0) {
      return 0;
    }
    return Math.round((activeJob.progress.items_processed / activeJob.progress.total_items) * 100);
  };

  const estimatedTimeRemaining = () => {
    const percentage = getProgressPercentage();
    if (activeJob.status !== 'in_progress' || percentage === 0) {
      return null;
    }

    // Simple time estimation based on progress
    const elapsedTime = new Date().getTime() - new Date(activeJob.started_at || activeJob.created_at).getTime();
    const estimatedTotal = (elapsedTime / percentage) * 100;
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
            {activeJob.status === 'in_progress' && activeJob.progress?.current_step && (
              <p className="text-sm text-gray-500">
                {activeJob.progress.current_step}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          {activeJob.status === 'in_progress' && activeJob.progress?.total_items && (
            <div className="space-y-2">
              <ProgressBar value={getProgressPercentage()} />
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {activeJob.progress.items_processed || 0} / {activeJob.progress.total_items} keywords processed
                </span>
                <span>{getProgressPercentage()}%</span>
              </div>
              {activeJob.progress.total_steps > 1 && (
                <div className="text-center text-xs text-gray-500">
                  Step {(activeJob.progress.current_step_number || 1)} of {activeJob.progress.total_steps}
                </div>
              )}
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Processing your keyword data</p>
                  <p>
                    We're analyzing, scoring, and clustering your keywords using our proprietary SOP formula. 
                    This typically takes 2-5 minutes for most datasets.
                  </p>
                  <p className="mt-2 text-xs">
                    Please keep this window open - you'll be automatically redirected when complete.
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
                <span className="ml-2 font-mono text-xs">{activeJob.job_id || activeJob.id}</span>
              </div>
              <div>
                <span className="text-gray-500">Started:</span>
                <span className="ml-2">
                  {activeJob.started_at ? 
                    new Date(activeJob.started_at).toLocaleTimeString() : 
                    'Just now'
                  }
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}