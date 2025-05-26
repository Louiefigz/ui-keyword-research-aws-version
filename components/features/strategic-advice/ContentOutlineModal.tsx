import { ArrowRight, Download, Circle, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/overlays/dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/data-display/card';
import { Button } from '@/components/ui/base/button';
import { Badge } from '@/components/ui/base/badge';
import { Label } from '@/components/ui/forms/label';

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

interface ContentOutlineModalProps {
  template: ContentTemplate | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContentOutlineModal({ 
  template, 
  isOpen, 
  onClose 
}: ContentOutlineModalProps) {
  if (!template) return null;

  const handleExport = () => {
    const content = generateOutlineDocument(template);
    downloadAsFile(content, `${template.cluster_name}-outline.md`, 'text/markdown');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Content Outline: {template.cluster_name}</DialogTitle>
          <DialogDescription>
            Complete content structure and SEO guidelines for optimized content creation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title and Meta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Title & Meta Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Title Tag</Label>
                <p className="font-medium mt-1">{template.content_outline.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Meta Description</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {template.content_outline.meta_description}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">H1 Heading</Label>
                <p className="font-medium mt-1">{template.content_outline.h1}</p>
              </div>
            </CardContent>
          </Card>

          {/* Content Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Introduction */}
                <div>
                  <h4 className="font-medium mb-2">Introduction</h4>
                  <p className="text-sm text-muted-foreground pl-4 border-l-2 border-primary">
                    {template.cluster_analysis.content_structure.introduction}
                  </p>
                </div>

                {/* Main Sections */}
                <div>
                  <h4 className="font-medium mb-2">Main Sections</h4>
                  <div className="space-y-3 pl-4">
                    {template.content_outline.sections.map((section, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="mt-0.5">
                            {idx + 1}
                          </Badge>
                          <div className="flex-1">
                            <p className="font-medium">{section}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Target 300-500 words. Include relevant keywords naturally and provide actionable insights.
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calls to Action */}
                <div>
                  <h4 className="font-medium mb-2">Calls to Action</h4>
                  <div className="space-y-2 pl-4">
                    {template.cluster_analysis.content_structure.calls_to_action.map((cta, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-primary" />
                        <span className="text-sm">{cta}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">SEO Optimization Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <SEOChecklist 
                primaryKeyword={template.primary_keyword}
                supportingKeywords={template.supporting_keywords}
                guidelines={template.seo_guidelines}
              />
            </CardContent>
          </Card>

          {/* Keyword Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Keyword Integration Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium text-green-800">Primary Keyword</p>
                  </div>
                  <p className="text-sm text-green-700">
                    <span className="font-medium">{template.primary_keyword}</span> - Use in title, H1, first paragraph, and 2-3 times throughout the content
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Supporting Keywords</p>
                  <div className="grid gap-2">
                    {template.supporting_keywords.map((keyword, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm p-2 rounded bg-muted">
                        <Circle className="h-2 w-2 text-muted-foreground" />
                        <span className="font-medium">{keyword}</span>
                        <span className="text-muted-foreground">- Use naturally 1-2 times</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Production Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Production Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Word Count Target</Label>
                    <p className="text-sm">
                      {template.production_estimates.word_count_range[0].toLocaleString()} - {template.production_estimates.word_count_range[1].toLocaleString()} words
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Estimated Time</Label>
                    <p className="text-sm">
                      {template.production_estimates.estimated_hours[0]}-{template.production_estimates.estimated_hours[1]} hours
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Content Type</Label>
                    <p className="text-sm">{template.production_estimates.content_type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Difficulty Level</Label>
                    <Badge variant={template.production_estimates.difficulty_level === 'easy' ? 'success' : 
                                  template.production_estimates.difficulty_level === 'medium' ? 'warning' : 'destructive'}>
                      {template.production_estimates.difficulty_level}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Outline
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface SEOChecklistProps {
  primaryKeyword: string;
  supportingKeywords: string[];
  guidelines: {
    keyword_density: number;
    readability_target: string;
    internal_links: number;
    external_links: number;
  };
}

function SEOChecklist({ primaryKeyword, guidelines }: Omit<SEOChecklistProps, 'supportingKeywords'>) {
  const checklistItems = [
    { text: `Include "${primaryKeyword}" in title tag`, completed: true },
    { text: `Use "${primaryKeyword}" in H1 heading`, completed: true },
    { text: `Target ${guidelines.keyword_density}% keyword density`, completed: false },
    { text: `Aim for ${guidelines.readability_target} readability score`, completed: false },
    { text: `Include ${guidelines.internal_links} internal links`, completed: false },
    { text: `Add ${guidelines.external_links} authoritative external links`, completed: false },
    { text: `Optimize meta description (150-160 characters)`, completed: true },
    { text: `Use supporting keywords naturally throughout content`, completed: false },
    { text: `Add relevant images with alt text`, completed: false },
    { text: `Structure content with proper headings (H2, H3)`, completed: false },
  ];

  return (
    <div className="space-y-2">
      {checklistItems.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2 text-sm">
          <CheckCircle2 
            className={`h-4 w-4 ${item.completed ? 'text-green-600' : 'text-muted-foreground'}`} 
          />
          <span className={item.completed ? 'text-muted-foreground line-through' : ''}>
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );
}

function generateOutlineDocument(template: ContentTemplate): string {
  return `# ${template.content_outline.title}

## Meta Information
- **Title**: ${template.content_outline.title}
- **Meta Description**: ${template.content_outline.meta_description}
- **H1**: ${template.content_outline.h1}
- **Primary Keyword**: ${template.primary_keyword}
- **Supporting Keywords**: ${template.supporting_keywords.join(', ')}

## Content Structure

### Introduction
${template.cluster_analysis.content_structure.introduction}

### Main Sections
${template.content_outline.sections.map((section, idx) => `${idx + 1}. ${section}`).join('\n')}

### Calls to Action
${template.cluster_analysis.content_structure.calls_to_action.map(cta => `- ${cta}`).join('\n')}

## SEO Guidelines
- **Keyword Density**: ${template.seo_guidelines.keyword_density}%
- **Readability**: ${template.seo_guidelines.readability_target}
- **Internal Links**: ${template.seo_guidelines.internal_links}
- **External Links**: ${template.seo_guidelines.external_links}

## Production Estimates
- **Word Count**: ${template.production_estimates.word_count_range[0]}-${template.production_estimates.word_count_range[1]} words
- **Estimated Time**: ${template.production_estimates.estimated_hours[0]}-${template.production_estimates.estimated_hours[1]} hours
- **Content Type**: ${template.production_estimates.content_type}
- **Difficulty**: ${template.production_estimates.difficulty_level}
`;
}

function downloadAsFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
} 