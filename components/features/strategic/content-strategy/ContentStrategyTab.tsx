'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/data-display/card';
import { ContentStrategyOverview } from './ContentStrategyOverview';
import { ContentClusterCard } from './ContentClusterCard';
import { ContentGapsSection } from './ContentGapsSection';
import { ContentCalendar } from './ContentCalendar';
import { OptimizationRecommendations } from './OptimizationRecommendations';
import { ContentTemplates } from './ContentTemplates';
import { ContentOutlineModal } from './ContentOutlineModal';
import type { ContentStrategyAdvice } from '@/types';
import { exportUtils } from '@/lib/utils/strategic-advice-utils';

interface ContentStrategyTabProps {
  strategy: ContentStrategyAdvice;
}

export function ContentStrategyTab({ strategy }: ContentStrategyTabProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // Provide defaults if strategy data is missing
  const contentClusters = strategy?.content_clusters || [];
  const contentGaps = strategy?.content_gaps || [];
  const contentCalendar = strategy?.content_calendar || [];
  const optimizationRecommendations = strategy?.optimization_recommendations || [];

  const handleExportPlan = () => {
    // Prepare comprehensive export data
    const exportData = {
      summary: {
        totalContentPieces: contentClusters.length,
        totalKeywordsTargeted: contentClusters.reduce((sum, cluster) => 
          sum + (cluster.target_keywords?.length || 0), 0
        ),
        estimatedMonthlyTraffic: contentCalendar.reduce((sum, month) => 
          sum + (month.estimated_traffic || 0), 0
        ),
        timelineMonths: contentCalendar.length,
      },
      contentClusters: contentClusters.map(cluster => ({
        clusterName: cluster.cluster_name,
        priority: cluster.priority,
        contentType: cluster.content_type,
        primaryKeyword: cluster.target_keywords?.[0] || '',
        totalKeywords: cluster.target_keywords?.length || 0,
        estimatedImpact: cluster.estimated_impact?.traffic_increase || 0,
      })),
      contentGaps: contentGaps.map(gap => ({
        topic: gap.topic,
        contentType: gap.content_type,
        searchVolume: gap.search_volume,
        competition: gap.competition_level,
        priorityScore: gap.priority_score,
        keywords: gap.target_keywords?.join(', ') || '',
      })),
      contentCalendar: contentCalendar.map(item => ({
        month: item.month,
        contentPieces: item.content_pieces,
        focusClusters: item.focus_clusters?.join(', ') || '',
        estimatedTraffic: item.estimated_traffic || 0,
      })),
      optimizations: optimizationRecommendations.map(rec => ({
        title: rec.title,
        type: rec.type,
        impact: rec.impact,
        effort: rec.effort,
        pagesAffected: rec.pages_affected,
        description: rec.description,
      })),
    };

    // Export as CSV - flatten the data structure
    const csvData = [
      { section: 'CONTENT CLUSTERS' },
      ...exportData.contentClusters,
      {},
      { section: 'CONTENT GAPS' },
      ...exportData.contentGaps,
      {},
      { section: 'CONTENT CALENDAR' },
      ...exportData.contentCalendar,
      {},
      { section: 'OPTIMIZATION RECOMMENDATIONS' },
      ...exportData.optimizations,
      {},
      { section: 'SUMMARY' },
      { metric: 'Total Content Pieces', value: exportData.summary.totalContentPieces },
      { metric: 'Total Keywords Targeted', value: exportData.summary.totalKeywordsTargeted },
      { metric: 'Est. Monthly Traffic', value: exportData.summary.estimatedMonthlyTraffic },
      { metric: 'Timeline (months)', value: exportData.summary.timelineMonths },
    ];

    exportUtils.exportToCSV(csvData, 'content-strategy-plan');
  };

  // Transform content clusters to templates format
  const contentTemplates = contentClusters.map(cluster => ({
    cluster_name: cluster.cluster_name,
    primary_keyword: cluster.target_keywords?.[0] || cluster.cluster_name,
    supporting_keywords: cluster.target_keywords?.slice(1, 6) || [], // Take up to 5 supporting keywords
    content_outline: {
      title: `${cluster.cluster_name}: A Comprehensive Guide`,
      meta_description: `Learn everything about ${cluster.target_keywords?.[0] || cluster.cluster_name} including best practices, tips, and expert insights.`,
      h1: cluster.cluster_name,
      sections: cluster.content_outline
    },
    cluster_analysis: {
      content_structure: {
        introduction: `Overview of ${cluster.target_keywords?.[0] || cluster.cluster_name}`,
        main_sections: cluster.content_outline || [],
        calls_to_action: ['Learn More', 'Get Started', 'Contact Us']
      }
    },
    production_estimates: {
      word_count_range: [1500, 2500] as [number, number],
      estimated_hours: [4, 8] as [number, number],
      content_type: cluster.content_type,
      difficulty_level: (cluster.priority === 'critical' ? 'hard' : cluster.priority === 'high' ? 'medium' : 'easy') as 'easy' | 'medium' | 'hard'
    },
    seo_guidelines: {
      keyword_density: 1.5,
      readability_target: 'Grade 8-10',
      internal_links: 5,
      external_links: 3
    }
  }));

  return (
    <div className="space-y-6">
      {/* Content Strategy Overview */}
      <ContentStrategyOverview 
        strategy={{
          content_clusters: contentClusters,
          content_gaps: contentGaps,
          content_calendar: contentCalendar,
          optimization_recommendations: optimizationRecommendations
        }} 
        onExport={handleExportPlan} 
      />

      {/* Content Templates Section */}
      <ContentTemplates 
        templates={contentTemplates}
        onViewOutline={setSelectedTemplate}
      />

      {/* Priority Content Clusters */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Priority Content Clusters</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {contentClusters
            .sort((a, b) => {
              const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
            .map((cluster, index) => (
              <ContentClusterCard key={cluster.cluster_id} cluster={cluster} rank={index + 1} />
            ))}
        </div>
      </div>

      {/* Content Gaps */}
      <ContentGapsSection gaps={contentGaps} />

      {/* Content Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Content Publishing Calendar</CardTitle>
          <CardDescription>
            Recommended publishing schedule for maximum impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContentCalendar items={contentCalendar} />
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      <OptimizationRecommendations recommendations={optimizationRecommendations} />

      {/* Content Outline Modal */}
      <ContentOutlineModal
        template={selectedTemplate}
        isOpen={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
      />
    </div>
  );
}