'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/base/badge';
import { Building2, Brain, Target } from 'lucide-react';

interface BusinessContextBannerProps {
  businessDescription: string;
  aiInsightsCount: number;
  businessType?: string;
}

export function BusinessContextBanner({ 
  businessDescription, 
  aiInsightsCount,
  businessType 
}: BusinessContextBannerProps) {
  // Extract business type from description if not provided
  const extractedBusinessType = businessType || 
    extractBusinessTypeFromDescription(businessDescription);

  return (
    <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <Building2 className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-indigo-900">
                  Business-Specific AI Analysis
                </h3>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                  {extractedBusinessType}
                </Badge>
              </div>
              <p className="text-sm text-indigo-700 max-w-2xl">
                {businessDescription}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-indigo-600">
              <Brain className="h-4 w-4" />
              <span className="font-medium">{aiInsightsCount}</span>
              <span>AI Insights</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600">
              <Target className="h-4 w-4" />
              <span>Industry-Tailored</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 p-3 bg-white/60 rounded-lg border border-indigo-100">
          <div className="flex items-start gap-2">
            <Brain className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-indigo-800">
              <strong>AI Enhancement:</strong> All recommendations below are specifically 
              tailored to your business type, industry dynamics, and competitive landscape. 
              The AI considers your unique value proposition and target market when generating 
              actionable strategic advice.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to extract business type from description
function extractBusinessTypeFromDescription(description: string): string {
  const businessTypes = [
    'restoration', 'emergency services', 'legal', 'medical', 'dental',
    'plumbing', 'hvac', 'roofing', 'construction', 'landscaping',
    'cleaning', 'pest control', 'security', 'consulting', 'software',
    'ecommerce', 'retail', 'restaurant', 'real estate', 'automotive',
    'insurance', 'financial', 'education', 'healthcare', 'fitness'
  ];

  const lowerDescription = description.toLowerCase();
  
  for (const type of businessTypes) {
    if (lowerDescription.includes(type)) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
  }

  // Fallback: try to extract the first noun that might be a business type
  const words = description.split(' ');
  const potentialType = words.find(word => 
    word.length > 4 && 
    !['company', 'business', 'service', 'leading'].includes(word.toLowerCase())
  );

  return potentialType ? 
    potentialType.charAt(0).toUpperCase() + potentialType.slice(1) : 
    'Service Business';
}