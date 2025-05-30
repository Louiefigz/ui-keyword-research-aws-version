'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/data-display/card';
import { Tabs } from '@/components/ui/data-display/tabs-custom';
import { Button } from '@/components/ui/base/button';
import { Download, AlertTriangle } from 'lucide-react';
import { useStrategicAdvice, useExportStrategicAdvice } from '@/lib/hooks/use-strategic-advice';
import { ErrorState } from '@/components/ui/feedback';
import {
  ExecutiveSummary,
  EnhancedOpportunitiesTab,
  ContentStrategyTab,
  CompetitiveAnalysisTab,
  CurrentPerformanceTab
} from '@/components/features/strategic';
import { StrategicAdviceSkeleton } from '@/components/features/strategic/StrategicAdviceSkeleton';
import { 
  AIProcessingIndicator, 
  BusinessContextBanner 
} from '@/components/features/strategic/ai';
import { useProjects } from '@/lib/hooks/use-projects';

interface StrategicAdvicePageProps {
  params: { projectId: string };
}

export default function StrategicAdvicePage({ params }: StrategicAdvicePageProps) {
  const { data: advice, isLoading, error, isRefetching } = useStrategicAdvice(params.projectId);
  const { data: projects } = useProjects();
  const project = projects?.find(p => p.id === params.projectId);
  const exportMutation = useExportStrategicAdvice();
  const [activeTab, setActiveTab] = useState('opportunities');
  const [processingStage, setProcessingStage] = useState('Analyzing keyword data...');
  const [processingStep, setProcessingStep] = useState(1);
  
  // Simulate AI processing stages during loading
  useEffect(() => {
    if (!isLoading && !isRefetching) return;
    
    const stages = [
      'Analyzing keyword data...',
      'Generating AI insights...',
      'Creating recommendations...',
      'Calculating impact metrics...',
      'Finalizing strategic advice...'
    ];
    
    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length - 1) {
        currentStage++;
        setProcessingStage(stages[currentStage]);
        setProcessingStep(currentStage + 1);
      }
    }, 3000); // Change stage every 3 seconds
    
    return () => clearInterval(interval);
  }, [isLoading, isRefetching]);

  const handleExport = (format: 'pdf' | 'excel') => {
    exportMutation.mutate({ projectId: params.projectId, format });
  };

  // Enhanced error handling for AI service failures
  if (error) {
    const isAIFailure = error?.message?.includes('timeout') || 
                       error?.message?.includes('AI service') ||
                       error?.code === 'ECONNABORTED';
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Strategic SEO Advice</h1>
            <p className="text-gray-600">
              AI-enhanced recommendations and strategic insights
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
                  Our AI-enhanced strategic advice service is currently experiencing high demand. 
                  This can happen when processing complex keyword analysis.
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => window.location.reload()}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    Retry AI Analysis
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // TODO: Implement fallback to basic recommendations
                      window.location.reload();
                    }}
                  >
                    Use Basic Recommendations
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
  if (isLoading || isRefetching) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Strategic SEO Advice</h1>
            <p className="text-gray-600">
              AI-enhanced recommendations and strategic insights
            </p>
          </div>
        </div>
        
        <AIProcessingIndicator
          stage={processingStage}
          estimatedTime={15}
          currentStep={processingStep}
          totalSteps={5}
          isVisible={true}
        />
        
        <StrategicAdviceSkeleton />
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

  // Count AI-enhanced opportunities
  const aiInsightsCount = advice.immediate_opportunities?.filter(
    opp => 'ai_recommendations' in opp && 'insight_type' in opp
  ).length || 0;
  
  const tabs = [
    {
      id: 'current-performance',
      label: 'Current Performance',
      content: <CurrentPerformanceTab data={advice.current_performance} />
    },
    { 
      id: 'opportunities',
      label: 'Opportunities', 
      content: (
        <EnhancedOpportunitiesTab 
          opportunities={advice.immediate_opportunities}
          businessContext={project?.business_description}
        />
      )
    },
    { 
      id: 'content',
      label: 'Content Strategy', 
      content: <ContentStrategyTab strategy={advice.content_strategy} />
    },
    {
      id: 'competitive',
      label: 'Competitive Analysis',
      content: <CompetitiveAnalysisTab data={advice.competitive_analysis} />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Strategic SEO Advice</h1>
          <p className="text-gray-600">
            Data-driven recommendations and strategic insights
          </p>
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
            onClick={() => handleExport('excel')}
            disabled={exportMutation.isPending}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Business Context Banner - Show if we have AI insights */}
      {aiInsightsCount > 0 && project?.business_description && (
        <BusinessContextBanner
          businessDescription={project.business_description}
          aiInsightsCount={aiInsightsCount}
        />
      )}

      {/* Executive Summary */}
      <ExecutiveSummary 
        data={advice.executive_summary} 
        currentPerformance={advice.current_performance}
      />

      {/* Tabbed Content */}
      <Tabs
        defaultTab="opportunities"
        value={activeTab}
        onChange={setActiveTab}
        tabs={tabs}
        className="mt-6"
      />
    </div>
  );
}