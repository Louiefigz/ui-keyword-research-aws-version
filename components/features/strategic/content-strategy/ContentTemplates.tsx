import { useState } from 'react';
import { FileText, Download, Copy, ChevronRight, Clock, Target } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/data-display/card';
import { Button } from '@/components/ui/base/button';
import { Badge } from '@/components/ui/base/badge';
import { ContentOutlineModal } from './ContentOutlineModal';

interface ContentTemplate {
  cluster_name: string;
  primary_keyword: string;
  supporting_keywords: string[];
  content_outline: {
    title: string;
    meta_description: string;
    h1: string;
    sections: string[];
  };
  cluster_analysis: {
    content_structure: {
      introduction: string;
      main_sections: string[];
      calls_to_action: string[];
    };
  };
  production_estimates: {
    word_count_range: [number, number];
    estimated_hours: [number, number];
    content_type: string;
    difficulty_level: 'easy' | 'medium' | 'hard';
  };
  seo_guidelines: {
    keyword_density: number;
    readability_target: string;
    internal_links: number;
    external_links: number;
  };
}

interface ContentTemplatesProps {
  templates: ContentTemplate[];
  onViewOutline: (template: ContentTemplate) => void;
}

export function ContentTemplates({ templates, onViewOutline }: ContentTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);

  const handleExportAll = () => {
    // Generate export for all templates
    const exportData = templates.map(template => ({
      cluster: template.cluster_name,
      primary_keyword: template.primary_keyword,
      supporting_keywords: template.supporting_keywords.join(', '),
      estimated_hours: `${template.production_estimates.estimated_hours[0]}-${template.production_estimates.estimated_hours[1]}`,
      word_count: `${template.production_estimates.word_count_range[0]}-${template.production_estimates.word_count_range[1]}`,
      content_type: template.production_estimates.content_type
    }));

    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'content-templates.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!templates || templates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Content Templates Available</h3>
          <p className="text-muted-foreground text-center">
            Content templates will be generated based on your keyword clusters and strategic analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Content Templates</h3>
            <p className="text-sm text-muted-foreground">
              AI-generated content outlines optimized for your target keywords
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportAll}>
            <Download className="h-4 w-4 mr-2" />
            Export All Templates
          </Button>
        </div>

        <div className="grid gap-4">
          {templates.map((template, index) => (
            <ContentTemplateCard
              key={index}
              template={template}
              onViewDetails={() => {
                setSelectedTemplate(template);
                onViewOutline(template);
              }}
            />
          ))}
        </div>
      </div>

      <ContentOutlineModal
        template={selectedTemplate}
        isOpen={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
      />
    </>
  );
}

interface ContentTemplateCardProps {
  template: ContentTemplate;
  onViewDetails: () => void;
}

function ContentTemplateCard({ template, onViewDetails }: ContentTemplateCardProps) {
  const handleCopyKeywords = () => {
    const keywords = [template.primary_keyword, ...template.supporting_keywords].join(', ');
    navigator.clipboard.writeText(keywords);
  };

  const getDifficultyBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'default';
      case 'medium': return 'secondary';
      case 'hard': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-lg">{template.cluster_name}</h4>
              <Badge variant={getDifficultyBadgeVariant(template.production_estimates.difficulty_level)}>
                {template.production_estimates.difficulty_level}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Primary: <span className="font-medium">{template.primary_keyword}</span>
            </p>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="mb-1">
              {template.supporting_keywords.length + 1} keywords
            </Badge>
            <p className="text-xs text-muted-foreground">
              {template.production_estimates.content_type}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Content Structure Preview */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Content Structure</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{template.content_outline.title}</span>
            </div>
            <div className="pl-6 space-y-1">
              {template.content_outline.sections.slice(0, 3).map((section, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ChevronRight className="h-3 w-3" />
                  {section}
                </div>
              ))}
              {template.content_outline.sections.length > 3 && (
                <div className="text-sm text-muted-foreground pl-5">
                  +{template.content_outline.sections.length - 3} more sections
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Production Estimates */}
        <div className="p-3 bg-muted rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Est. Word Count</span>
            <span className="font-medium">
              {template.production_estimates.word_count_range[0].toLocaleString()} - {template.production_estimates.word_count_range[1].toLocaleString()} words
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Production Time</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="font-medium">
                {template.production_estimates.estimated_hours[0]}-{template.production_estimates.estimated_hours[1]} hours
              </span>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Target Density</span>
            <span className="font-medium">{template.seo_guidelines.keyword_density}%</span>
          </div>
        </div>

        {/* Keywords */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Target Keywords</p>
            <Button variant="ghost" size="sm" onClick={handleCopyKeywords}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            <Badge variant="default" className="text-xs">
              <Target className="h-3 w-3 mr-1" />
              {template.primary_keyword}
            </Badge>
            {template.supporting_keywords.slice(0, 3).map((keyword, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {template.supporting_keywords.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{template.supporting_keywords.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button onClick={onViewDetails} className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            View Full Outline
          </Button>
          <Button variant="outline" size="icon" onClick={handleCopyKeywords}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 