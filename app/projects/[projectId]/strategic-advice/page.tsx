'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/data-display/card';
import { Tabs } from '@/components/ui/data-display/tabs-custom';
import { Button } from '@/components/ui/base/button';
import { Download } from 'lucide-react';
import { useStrategicAdvice, useExportStrategicAdvice } from '@/lib/hooks/use-strategic-advice';
import { ErrorState } from '@/components/ui/feedback';
import {
  ExecutiveSummary,
  OpportunitiesTab,
  ContentStrategyTab,
  ROIProjectionsTab,
  ImplementationRoadmapTab,
  CompetitiveAnalysisTab
} from '@/components/features/strategic';
import { StrategicAdviceSkeleton } from '@/components/features/strategic/StrategicAdviceSkeleton';

interface StrategicAdvicePageProps {
  params: { projectId: string };
}

export default function StrategicAdvicePage({ params }: StrategicAdvicePageProps) {
  const { data: advice, isLoading, error } = useStrategicAdvice(params.projectId);
  const exportMutation = useExportStrategicAdvice();
  const [activeTab, setActiveTab] = useState('opportunities');

  const handleExport = (format: 'pdf' | 'excel') => {
    exportMutation.mutate({ projectId: params.projectId, format });
  };

  if (error) {
    return (
      <ErrorState 
        title="Error Loading Strategic Advice"
        message="Unable to load strategic advice data. Please try refreshing the page."
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (isLoading) {
    return <StrategicAdviceSkeleton />;
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

  const tabs = [
    { 
      id: 'opportunities',
      label: 'Opportunities', 
      content: <OpportunitiesTab opportunities={advice.immediate_opportunities} />
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
    },
    { 
      id: 'roi',
      label: 'ROI Projections', 
      content: <ROIProjectionsTab projections={advice.roi_projections} />
    },
    { 
      id: 'implementation',
      label: 'Implementation', 
      content: <ImplementationRoadmapTab roadmap={advice.implementation_roadmap} />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Strategic SEO Advice</h1>
          <p className="text-gray-600">
            Data-driven recommendations and ROI projections
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

      {/* Executive Summary */}
      <ExecutiveSummary data={advice.executive_summary} />

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