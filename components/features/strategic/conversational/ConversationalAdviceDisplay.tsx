'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/data-display/card';
import { Button } from '@/components/ui/base/button';
import { 
  ChevronDown, 
  ChevronUp, 
  Target, 
  TrendingUp, 
  AlertCircle,
  Filter,
  BarChart3,
  Table as TableIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/base/badge';
import { Progress } from '@/components/ui/base/progress';
import type { 
  ConversationalAdviceResponse,
  ConversationalActionItem
} from '@/types/api.types';

interface ConversationalAdviceDisplayProps {
  advice: ConversationalAdviceResponse;
  onFocusAreaChange?: (focusArea: string) => void;
  className?: string;
}

export function ConversationalAdviceDisplay({ 
  advice, 
  onFocusAreaChange,
  className = '' 
}: ConversationalAdviceDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  // Early return if advice structure is invalid
  if (!advice || !advice.advice) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <p className="text-red-600">Invalid advice data structure. Please try refreshing.</p>
        </CardContent>
      </Card>
    );
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Filter sections by priority if selected
  const sections = advice.advice.sections || [];
  const filteredSections = selectedPriority 
    ? sections.filter(s => s.priority === selectedPriority)
    : sections;

  // Group action items by priority
  const actionItems = advice.advice.action_items || [];
  const groupedActions = actionItems.reduce((acc, item) => {
    if (!acc[item.priority]) acc[item.priority] = [];
    acc[item.priority].push(item);
    return acc;
  }, {} as Record<string, ConversationalActionItem[]>);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getActionPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate': return 'bg-red-100 text-red-800';
      case 'short-term': return 'bg-orange-100 text-orange-800';
      case 'long-term': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Data Quality Indicator */}
      {advice.data_quality && (
        <Card className={advice.data_quality.has_sufficient_data ? 'border-green-200' : 'border-yellow-200'}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Data Quality Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Quality Score</span>
                <div className="flex items-center gap-2">
                  <Progress value={advice.data_quality.quality_score} className="w-32" />
                  <span className="text-sm font-medium">{advice.data_quality.quality_score}%</span>
                </div>
              </div>
              {advice.data_quality.recommendations && advice.data_quality.recommendations.length > 0 && (
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Recommendations:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {advice.data_quality.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Executive Summary */}
      {advice.advice.executive_summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {advice.advice.executive_summary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      {advice.advice.key_metrics && advice.advice.key_metrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {advice.advice.key_metrics.map((metric, idx) => (
            <Card key={idx} className="border-gray-200">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{metric.name}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {typeof metric.current_value === 'number' 
                        ? metric.current_value.toLocaleString() 
                        : metric.current_value}
                    </span>
                    {metric.trend && (
                      <TrendingUp 
                        className={`h-4 w-4 ${
                          metric.trend === 'up' ? 'text-green-600' : 
                          metric.trend === 'down' ? 'text-red-600' : 
                          'text-gray-600'
                        }`}
                      />
                    )}
                  </div>
                  {metric.target_value && (
                    <p className="text-xs text-gray-500">
                      Target: {metric.target_value}
                    </p>
                  )}
                  {metric.context && (
                    <p className="text-xs text-gray-600 mt-1">{metric.context}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Priority Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-600" />
        <span className="text-sm text-gray-600 mr-2">Filter by priority:</span>
        <div className="flex gap-2">
          <Button
            variant={selectedPriority === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPriority(null)}
          >
            All
          </Button>
          {['critical', 'high', 'medium', 'low'].map(priority => (
            <Button
              key={priority}
              variant={selectedPriority === priority ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPriority(priority)}
              className={selectedPriority === priority ? '' : getPriorityColor(priority)}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {filteredSections.map((section) => (
          <Card key={section.id} className={`border ${getPriorityColor(section.priority)}`}>
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                  <Badge className={getPriorityColor(section.priority)}>
                    {section.priority}
                  </Badge>
                </div>
                {expandedSections.has(section.id) ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </div>
            </CardHeader>
            
            {expandedSections.has(section.id) && (
              <CardContent>
                <div className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{section.content}</p>
                  </div>

                  {/* Subsections */}
                  {section.subsections && section.subsections.length > 0 && (
                    <div className="space-y-3 mt-4">
                      {section.subsections.map((subsection) => (
                        <div key={subsection.id} className="pl-4 border-l-2 border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {subsection.title}
                          </h4>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {subsection.content}
                          </p>
                          {subsection.bulletPoints && subsection.bulletPoints.length > 0 && (
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              {subsection.bulletPoints.map((point, idx) => (
                                <li key={idx} className="text-sm text-gray-600">{point}</li>
                              ))}
                            </ul>
                          )}
                          {subsection.callouts && subsection.callouts.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {subsection.callouts.map((callout, idx) => (
                                <div key={idx} className="bg-blue-50 p-3 rounded-md">
                                  <p className="text-sm text-blue-900">{callout}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Supporting Data */}
                  {section.supporting_data && (
                    <div className="mt-4 space-y-3">
                      {section.supporting_data.charts && section.supporting_data.charts.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BarChart3 className="h-4 w-4" />
                          <span>{section.supporting_data.charts.length} charts available</span>
                        </div>
                      )}
                      {section.supporting_data.tables && section.supporting_data.tables.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <TableIcon className="h-4 w-4" />
                          <span>{section.supporting_data.tables.length} data tables available</span>
                        </div>
                      )}
                      {section.supporting_data.metrics && section.supporting_data.metrics.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                          {section.supporting_data.metrics.map((metric, idx) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded-md">
                              <p className="text-xs text-gray-600">{metric.label}</p>
                              <p className="text-lg font-semibold">
                                {metric.value}{metric.unit && ` ${metric.unit}`}
                              </p>
                              {metric.change && (
                                <p className={`text-xs ${
                                  metric.change.direction === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {metric.change.direction === 'up' ? '↑' : '↓'} 
                                  {Math.abs(metric.change.percentage)}%
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Action Items */}
      {actionItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recommended Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {['immediate', 'short-term', 'long-term'].map(priority => {
                const items = groupedActions[priority];
                if (!items || items.length === 0) return null;

                return (
                  <div key={priority}>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Badge className={getActionPriorityColor(priority)}>
                        {priority.replace('-', ' ').charAt(0).toUpperCase() + priority.slice(1)}
                      </Badge>
                      <span className="text-sm text-gray-600">({items.length} actions)</span>
                    </h4>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="border-l-2 border-gray-200 pl-4 py-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{item.title}</h5>
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              <div className="flex gap-4 mt-2">
                                <span className="text-xs text-gray-500">
                                  Effort: <Badge variant="outline" className="ml-1">{item.effort}</Badge>
                                </span>
                                <span className="text-xs text-gray-500">
                                  Impact: <Badge variant="outline" className="ml-1">{item.impact}</Badge>
                                </span>
                                <span className="text-xs text-gray-500">
                                  Category: <Badge variant="outline" className="ml-1">{item.category}</Badge>
                                </span>
                              </div>
                              {item.timeline && (
                                <p className="text-xs text-gray-500 mt-1">Timeline: {item.timeline}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      {advice.metadata && (
        <div className="text-xs text-gray-500 text-center">
          Generated in {advice.metadata.generation_time_ms}ms 
          {advice.metadata.model_version && ` • Model: ${advice.metadata.model_version}`}
          {advice.metadata.focus_area && ` • Focus: ${advice.metadata.focus_area}`}
        </div>
      )}
    </div>
  );
}