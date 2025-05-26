'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/data-display/card';
import { Button } from '@/components/ui/base/button';
import { Download, Hash, Users, DollarSign, Trophy, Target, TrendingUp } from 'lucide-react';

interface StrategicAdvicePageProps {
  params: { projectId: string };
}

export default function StrategicAdvicePage({ params }: StrategicAdvicePageProps) {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [isLoading] = useState(false); // TODO: Replace with actual hook
  
  // Mock data for now - TODO: Replace with actual API call
  const mockAdvice = {
    executive_summary: {
      current_state: {
        total_keywords_tracked: 1500,
        current_organic_traffic: 12500,
        current_traffic_value: '$43,750',
        top_ranking_keywords: 125
      },
      opportunity_summary: {
        immediate_opportunities: 45,
        content_gaps_identified: 320,
        potential_traffic_gain: '8,500',
        potential_monthly_value: '$29,750'
      },
      strategic_priorities: [
        'Capture 45 quick wins through optimization (2-4 week impact)',
        'Develop content for top 3 keyword clusters (3-6 month impact)',
        'Fill 10 high-value content gaps',
        'Implement systematic tracking and measurement'
      ]
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Strategic Advice</h1>
            <p className="text-gray-600">
              AI-powered insights and recommendations for your SEO strategy
            </p>
          </div>
          <Button variant="outline" disabled>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
        
        {/* Loading skeleton */}
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'opportunities', label: 'Immediate Opportunities', icon: Target },
    { id: 'content', label: 'Content Strategy', icon: Hash },
    { id: 'roi', label: 'ROI Projections', icon: TrendingUp },
    { id: 'implementation', label: 'Implementation', icon: Trophy }
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
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Executive Summary */}
      <div className="space-y-6">
        {/* Current State Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Current Performance</CardTitle>
            <CardDescription>
              Your website's current SEO performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Keywords Tracked</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {mockAdvice.executive_summary.current_state.total_keywords_tracked.toLocaleString()}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Organic Traffic</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {mockAdvice.executive_summary.current_state.current_organic_traffic.toLocaleString()}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Traffic Value</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {mockAdvice.executive_summary.current_state.current_traffic_value}
                </div>
              </div>
              
              <div className="space-y-2 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Top 10 Rankings</span>
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {mockAdvice.executive_summary.current_state.top_ranking_keywords}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opportunity Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Opportunity Summary</CardTitle>
            <CardDescription>
              Identified opportunities for growth and optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Immediate Opportunities</span>
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                    {mockAdvice.executive_summary.opportunity_summary.immediate_opportunities}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Content Gaps Identified</span>
                  <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded-full">
                    {mockAdvice.executive_summary.opportunity_summary.content_gaps_identified}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Potential Traffic Gain</span>
                  <span className="font-semibold text-green-600">
                    +{mockAdvice.executive_summary.opportunity_summary.potential_traffic_gain}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Potential Monthly Value</span>
                  <span className="font-semibold text-green-600">
                    {mockAdvice.executive_summary.opportunity_summary.potential_monthly_value}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategic Priorities */}
        <Card>
          <CardHeader>
            <CardTitle>Strategic Priorities</CardTitle>
            <CardDescription>
              Recommended focus areas for maximum impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {mockAdvice.executive_summary.strategic_priorities.map((priority, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{priority}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="border-b">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'opportunities' && (
            <Card>
              <CardHeader>
                <CardTitle>Immediate Opportunities</CardTitle>
                <CardDescription>Quick wins you can implement in 2-4 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Opportunities functionality coming soon...</p>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'content' && (
            <Card>
              <CardHeader>
                <CardTitle>Content Strategy</CardTitle>
                <CardDescription>Strategic content recommendations and cluster analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Content strategy functionality coming soon...</p>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'roi' && (
            <Card>
              <CardHeader>
                <CardTitle>ROI Projections</CardTitle>
                <CardDescription>Traffic and revenue projections over time</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">ROI projections functionality coming soon...</p>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'implementation' && (
            <Card>
              <CardHeader>
                <CardTitle>Implementation Roadmap</CardTitle>
                <CardDescription>Step-by-step implementation timeline</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Implementation roadmap functionality coming soon...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}