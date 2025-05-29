'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/data-display/card';
import { Progress } from '@/components/ui/base/progress';
import { Badge } from '@/components/ui/base/badge';
import { Brain, Clock, CheckCircle2 } from 'lucide-react';

interface AIProcessingIndicatorProps {
  stage: string;
  estimatedTime: number; // in seconds
  currentStep?: number;
  totalSteps?: number;
  isVisible?: boolean;
}

export function AIProcessingIndicator({ 
  stage, 
  estimatedTime, 
  currentStep = 1, 
  totalSteps = 5,
  isVisible = true 
}: AIProcessingIndicatorProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        // Calculate progress based on elapsed time vs estimated time
        const timeProgress = Math.min((newTime / estimatedTime) * 100, 95);
        // Calculate step progress
        const stepProgress = (currentStep / totalSteps) * 100;
        // Use the higher of the two for more accurate representation
        setProgressPercent(Math.max(timeProgress, stepProgress));
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, estimatedTime, currentStep, totalSteps]);

  if (!isVisible) return null;

  const remainingTime = Math.max(0, estimatedTime - elapsedTime);
  const isOvertime = elapsedTime > estimatedTime;

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600 animate-pulse" />
            AI Analysis in Progress
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Step {currentStep} of {totalSteps}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">{stage}</span>
            <span className="text-gray-500">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Time Information */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              {elapsedTime}s elapsed
            </span>
          </div>
          
          <div className="text-gray-500">
            {isOvertime ? (
              <span className="text-amber-600">
                Processing longer than expected...
              </span>
            ) : (
              <span>
                ~{remainingTime}s remaining
              </span>
            )}
          </div>
        </div>

        {/* Processing Steps */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 mb-2">Processing Steps:</div>
          <div className="grid grid-cols-1 gap-1">
            {[
              'Analyzing keyword data',
              'Generating AI insights',
              'Creating recommendations',
              'Calculating impact metrics',
              'Finalizing strategic advice'
            ].map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;
              
              return (
                <div 
                  key={index}
                  className={`flex items-center gap-2 text-sm ${
                    isCompleted 
                      ? 'text-green-600' 
                      : isCurrent 
                        ? 'text-blue-600 font-medium' 
                        : 'text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : isCurrent ? (
                    <div className="h-4 w-4 border-2 border-blue-600 rounded-full animate-spin border-t-transparent" />
                  ) : (
                    <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                  )}
                  <span>{step}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-100 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>AI Enhancement:</strong> We&apos;re using advanced AI to generate business-specific, 
            actionable recommendations tailored to your industry and current performance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}