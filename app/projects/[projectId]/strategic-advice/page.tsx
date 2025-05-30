'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/data-display/card';
import { Button } from '@/components/ui/base/button';
import { Badge } from '@/components/ui/base/badge';
import { Select } from '@/components/ui/forms/select';
import { 
  Download, 
  AlertTriangle, 
  RefreshCw,
  FileText,
  FileCode,
  Brain,
  CheckCircle
} from 'lucide-react';
import { 
  useConversationalAdvice, 
  useDataQualityCheck,
  useExportConversationalAdvice,
  useSupportedFocusAreas
} from '@/lib/hooks/use-strategic-advice';
import { ErrorState } from '@/components/ui/feedback';
import {
  ConversationalAdviceDisplay,
  StrategicAdviceSkeleton,
  AIProcessingIndicator
} from '@/components/features/strategic';
import { useProjects } from '@/lib/hooks/use-projects';

interface StrategicAdvicePageProps {
  params: { projectId: string };
}

export default function StrategicAdvicePage({ params }: StrategicAdvicePageProps) {
  const [focusArea, setFocusArea] = useState<string>('overall');
  const [detailLevel, setDetailLevel] = useState<'summary' | 'detailed' | 'comprehensive'>('detailed');
  const [userOverride, setUserOverride] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  
  // Fetch data quality first
  const { 
    data: dataQuality, 
    refetch: refetchDataQuality,
    isLoading: isLoadingDataQuality 
  } = useDataQualityCheck(params.projectId);
  const { data: focusAreas } = useSupportedFocusAreas();
  
  // Fetch conversational advice only after data quality check or user override
  const { 
    data: advice, 
    isLoading, 
    error, 
    isRefetching,
    refetch 
  } = useConversationalAdvice(params.projectId, {
    focus_area: focusArea as 'overall' | 'content' | 'technical' | 'competitive' | 'opportunities',
    detail_level: detailLevel,
    include_projections: true
  }, {
    // Only fetch if data quality is sufficient or user has overridden
    enabled: !!params.projectId && (!dataQuality || dataQuality.has_sufficient_data || userOverride)
  });
  
  const { data: projects } = useProjects();
  const project = projects?.find(p => p.id === params.projectId);
  const exportMutation = useExportConversationalAdvice();
  
  const [processingStage, setProcessingStage] = useState('Analyzing keyword data...');
  const [processingStep, setProcessingStep] = useState(1);
  
  // Simulate AI processing stages during loading
  useEffect(() => {
    if (!isLoading && !isRefetching) return;
    
    const stages = [
      'Analyzing keyword data...',
      'Understanding business context...',
      'Generating conversational insights...',
      'Creating strategic recommendations...',
      'Personalizing advice for your project...',
      'Finalizing comprehensive report...'
    ];
    
    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length - 1) {
        currentStage++;
        setProcessingStage(stages[currentStage]);
        setProcessingStep(currentStage + 1);
      }
    }, 2500); // Change stage every 2.5 seconds
    
    return () => clearInterval(interval);
  }, [isLoading, isRefetching]);

  const handleExport = (format: 'pdf' | 'docx' | 'markdown') => {
    exportMutation.mutate({ projectId: params.projectId, format });
  };

  const handleFocusAreaChange = (newFocusArea: string) => {
    setFocusArea(newFocusArea);
    // Reset user override when changing focus area
    setUserOverride(false);
    setRetryCount(0);
    refetch();
  };

  // Enhanced error handling for AI service failures
  if (error) {
    const isAIFailure = error?.message?.includes('timeout') || 
                       error?.message?.includes('AI service') ||
                       error?.message?.includes('conversational') ||
                       error?.code === 'ECONNABORTED';
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Strategic SEO Advice</h1>
            <p className="text-gray-600">
              AI-powered conversational insights and recommendations
            </p>
          </div>
        </div>
        
        {isAIFailure ? (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-5 w-5" />
                AI Service Temporarily Unavailable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-amber-700">
                  Our conversational AI service is currently experiencing high demand. 
                  This can happen when generating comprehensive strategic advice.
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => window.location.reload()}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry AI Analysis
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // Switch to summary mode which might be faster
                      setDetailLevel('summary');
                      refetch();
                    }}
                  >
                    Try Summary Mode
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <ErrorState 
            title="Error Loading Strategic Advice"
            message="Unable to load strategic advice data. Please try refreshing the page."
            onRetry={() => window.location.reload()}
          />
        )}
      </div>
    );
  }

  // Enhanced loading state with AI processing indicator
  if (isLoadingDataQuality || isLoading || isRefetching) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Strategic SEO Advice</h1>
            <p className="text-gray-600">
              AI-powered conversational insights and recommendations
            </p>
          </div>
        </div>
        
        {isLoadingDataQuality && !isLoading && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-gray-600" />
                <p className="text-sm text-gray-600">Checking data quality...</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {(isLoading || isRefetching) && (
          <>
            <AIProcessingIndicator
              stage={processingStage}
              estimatedTime={20}
              currentStep={processingStep}
              totalSteps={6}
              isVisible={true}
            />
            
            <StrategicAdviceSkeleton />
          </>
        )}
      </div>
    );
  }

  // Show data quality warning if needed but still allow trying to generate advice
  if (dataQuality && !dataQuality.has_sufficient_data && !advice) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Strategic SEO Advice</h1>
            <p className="text-gray-600">
              AI-powered conversational insights and recommendations
            </p>
          </div>
        </div>
        
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Insufficient Data for Strategic Advice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-yellow-700">
                Your project needs more data to generate meaningful strategic advice.
              </p>
              <div className="bg-white/50 p-3 rounded-md space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-yellow-800">
                    Data Quality Score: {dataQuality.quality_score || 0}%
                  </p>
                  {dataQuality.data_summary && (
                    <p className="text-xs text-yellow-700">
                      {dataQuality.data_summary.total_keywords} keywords tracked
                    </p>
                  )}
                </div>
                {dataQuality.data_summary && (
                  <div className="text-xs text-yellow-700">
                    <p>Keywords with data: {dataQuality.data_summary.keywords_with_data}</p>
                    <p>Data completeness: {dataQuality.data_summary.data_completeness}%</p>
                  </div>
                )}
                {dataQuality.recommendations && dataQuality.recommendations.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 mt-2">
                    {dataQuality.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    if (retryCount < MAX_RETRIES) {
                      // Set user override to force advice generation
                      setUserOverride(true);
                      setRetryCount(prev => prev + 1);
                      // Refetch both data quality and advice
                      refetchDataQuality();
                      refetch();
                    }
                  }}
                  variant="outline"
                  className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
                  disabled={retryCount >= MAX_RETRIES}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {retryCount >= MAX_RETRIES ? 'Max Retries Reached' : 'Try Again Anyway'}
                  {retryCount > 0 && retryCount < MAX_RETRIES && ` (${retryCount}/${MAX_RETRIES})`}
                </Button>
                <Button 
                  onClick={() => window.location.href = `/projects/${params.projectId}/upload`}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Upload More Data
                </Button>
              </div>
              {retryCount >= MAX_RETRIES && (
                <p className="text-xs text-yellow-700 mt-2">
                  We've attempted to generate advice multiple times. Please upload more data for better results.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!advice) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Strategic Advice Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Strategic advice data is not available for this project yet. 
              Please ensure your project has keyword data uploaded.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Strategic SEO Advice</h1>
          <p className="text-gray-600">
            AI-powered conversational insights and recommendations
          </p>
          {project?.business_description && (
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Brain className="h-3 w-3 mr-1" />
                Personalized for your business
              </Badge>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => handleExport('pdf')}
            disabled={exportMutation.isPending}
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleExport('docx')}
            disabled={exportMutation.isPending}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Word
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleExport('markdown')}
            disabled={exportMutation.isPending}
          >
            <FileCode className="h-4 w-4 mr-2" />
            Export Markdown
          </Button>
        </div>
      </div>

      {/* Data Quality Warning Banner */}
      {dataQuality && !dataQuality.has_sufficient_data && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">Limited Data Quality:</span> Strategic advice may be less accurate. 
                  Data Quality Score: {dataQuality.quality_score || 0}%
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.location.href = `/projects/${params.projectId}/upload`}
                className="text-xs border-yellow-600 text-yellow-700 hover:bg-yellow-100"
              >
                Upload More Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Focus Area
              </label>
              <Select
                value={focusArea}
                onValueChange={handleFocusAreaChange}
              >
                <option value="overall">Overall Strategy</option>
                {focusAreas?.focus_areas
                  ?.filter(fa => fa.available)
                  .map(fa => (
                    <option key={fa.id} value={fa.id}>
                      {fa.name}
                    </option>
                  ))}
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Detail Level
              </label>
              <Select
                value={detailLevel}
                onValueChange={(value) => setDetailLevel(value as 'summary' | 'detailed' | 'comprehensive')}
              >
                <option value="summary">Summary</option>
                <option value="detailed">Detailed</option>
                <option value="comprehensive">Comprehensive</option>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={() => refetch()}
                disabled={isRefetching}
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Status */}
      {advice && advice.status === 'success' && (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">
            Strategic advice generated successfully
          </span>
        </div>
      )}

      {/* Conversational Advice Display */}
      {advice && (
        <ConversationalAdviceDisplay 
          advice={advice}
          onFocusAreaChange={handleFocusAreaChange}
        />
      )}
    </div>
  );
}