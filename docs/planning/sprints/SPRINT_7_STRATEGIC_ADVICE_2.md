# Sprint 7: Strategic Advice - Part 2
**Duration**: Weeks 13-14 (48 hours)
**Goal**: Complete content strategy, build competitive analysis, and implement ROI projections

## Epic: Advanced Strategic Insights
Complete the strategic advice feature with detailed content templates, competitive analysis, ROI projections, and implementation roadmap.

---

## User Stories

### 7.1 Content Strategy Completion (12 hours)
**As a** content creator  
**I want** detailed content templates and outlines  
**So that** I can create optimized content efficiently

#### Acceptance Criteria
- [ ] Content templates show full structure
- [ ] Outlines include all key sections
- [ ] Keywords are mapped to content pieces
- [ ] Production time estimates are shown
- [ ] SEO guidelines are included
- [ ] Templates can be exported
- [ ] Mobile view works properly

#### Components to Build
1. **Template Components**
   - `ContentTemplates.tsx` - Template listing
   - `ContentOutlineModal.tsx` - Detailed outline view
   - `SEOGuidelines.tsx` - Optimization tips
   - `ProductionEstimates.tsx` - Time/effort estimates

#### Implementation
```typescript
// components/features/strategic-advice/ContentTemplates.tsx
interface ContentTemplatesProps {
  templates: ContentTemplate[];
  onViewOutline: (template: ContentTemplate) => void;
}

export function ContentTemplates({ templates, onViewOutline }: ContentTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Content Templates</h3>
          <Button variant="outline" size="sm">
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

// components/features/strategic-advice/ContentTemplateCard.tsx
interface ContentTemplateCardProps {
  template: ContentTemplate;
  onViewDetails: () => void;
}

export function ContentTemplateCard({ template, onViewDetails }: ContentTemplateCardProps) {
  const wordCountRange = template.cluster_analysis.content_structure.main_sections.length * 300;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-lg">{template.cluster_name}</h4>
            <p className="text-sm text-muted-foreground">
              Primary: {template.primary_keyword}
            </p>
          </div>
          <Badge variant="secondary">
            {template.supporting_keywords.length + 1} keywords
          </Badge>
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
                <div className="text-sm text-muted-foreground">
                  +{template.content_outline.sections.length - 3} more sections
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Meta Information */}
        <div className="p-3 bg-muted rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Est. Word Count</span>
            <span className="font-medium">{wordCountRange} - {wordCountRange + 500} words</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Production Time</span>
            <span className="font-medium">8-12 hours</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Content Type</span>
            <span className="font-medium">Comprehensive Guide</span>
          </div>
        </div>

        {/* Keywords */}
        <div>
          <p className="text-sm font-medium mb-2">Target Keywords</p>
          <div className="flex flex-wrap gap-1">
            <Badge variant="default" className="text-xs">
              {template.primary_keyword}
            </Badge>
            {template.supporting_keywords.slice(0, 3).map((keyword, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {template.supporting_keywords.length > 3 && (
              <Badge variant="ghost" className="text-xs">
                +{template.supporting_keywords.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={onViewDetails} className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            View Full Outline
          </Button>
          <Button variant="outline" size="icon">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// components/features/strategic-advice/ContentOutlineModal.tsx
export function ContentOutlineModal({ 
  template, 
  isOpen, 
  onClose 
}: ContentOutlineModalProps) {
  if (!template) return null;

  const handleExport = () => {
    const content = generateOutlineDocument(template);
    downloadAsFile(content, `${template.cluster_name}-outline.md`, 'text/markdown');
    toast.success('Outline exported successfully');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Content Outline: {template.cluster_name}</DialogTitle>
          <DialogDescription>
            Complete content structure and SEO guidelines
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Title and Meta */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Title & Meta Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm">Title Tag</Label>
                  <p className="font-medium">{template.content_outline.title}</p>
                </div>
                <div>
                  <Label className="text-sm">Meta Description</Label>
                  <p className="text-sm text-muted-foreground">
                    {template.content_outline.meta_description}
                  </p>
                </div>
                <div>
                  <Label className="text-sm">H1 Heading</Label>
                  <p className="font-medium">{template.content_outline.h1}</p>
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
                    <p className="text-sm text-muted-foreground pl-4">
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
                            <span className="text-sm font-medium text-muted-foreground">
                              {idx + 1}.
                            </span>
                            <div className="flex-1">
                              <p className="font-medium">{section}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Target 300-500 words. Include relevant keywords naturally.
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
                />
              </CardContent>
            </Card>

            {/* Keyword Mapping */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Keyword Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Primary Keyword</p>
                    <p className="text-sm text-green-700">
                      {template.primary_keyword} - Use in title, H1, first paragraph, and 2-3 times throughout
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Supporting Keywords</p>
                    {template.supporting_keywords.map((keyword, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm pl-4">
                        <Circle className="h-2 w-2 text-muted-foreground" />
                        <span>{keyword} - Use naturally 1-2 times</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

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
```

---

### 7.2 Competitive Analysis Tab (16 hours)
**As a** SEO strategist  
**I want** to understand my competitive landscape  
**So that** I can identify gaps and opportunities

#### Acceptance Criteria
- [ ] Competitor gaps are clearly displayed
- [ ] Market share visualization works
- [ ] Competitive advantages are highlighted
- [ ] Priority gaps show opportunity value
- [ ] Filtering by competitor works
- [ ] Export competitive data works
- [ ] Strategy recommendations are actionable

#### API Endpoints
```typescript
GET /strategic-advice/projects/{id}/competitive-analysis
```

#### Components to Build
1. **Competitive Components**
   - `CompetitiveAnalysisTab.tsx` - Main tab
   - `CompetitorGapsTable.tsx` - Gap analysis
   - `MarketShareChart.tsx` - Share visualization
   - `CompetitiveStrategy.tsx` - Strategy display

#### Implementation
```typescript
// components/features/strategic-advice/CompetitiveAnalysisTab.tsx
export function CompetitiveAnalysisTab({ projectId }: { projectId: string }) {
  const { data: analysis, isLoading } = useCompetitiveAnalysis(projectId);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('all');

  if (isLoading) return <CompetitiveAnalysisSkeleton />;

  const competitors = analysis ? 
    [...new Set(Object.values(analysis.competitor_gaps)
      .flatMap(gap => Object.keys(gap.competitor_positions)))] : [];

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Market Share Analysis</CardTitle>
          <CardDescription>
            Your current position in the competitive landscape
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <MarketShareChart data={analysis?.market_share_analysis} />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  title="Market Share"
                  value={`${analysis?.market_share_analysis.market_share_percentage.toFixed(1)}%`}
                  icon={<PieChart className="h-4 w-4" />}
                />
                <MetricCard
                  title="Ranking Keywords"
                  value={analysis?.market_share_analysis.ranking_keywords || 0}
                  icon={<Trophy className="h-4 w-4" />}
                  className="border-green-200 bg-green-50"
                />
                <MetricCard
                  title="Non-Ranking Keywords"
                  value={analysis?.market_share_analysis.non_ranking_keywords || 0}
                  icon={<Target className="h-4 w-4" />}
                  className="border-orange-200 bg-orange-50"
                />
                <MetricCard
                  title="Total Search Volume"
                  value={analysis?.market_share_analysis.total_search_volume || 0}
                  format="number"
                  icon={<TrendingUp className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitive Strategy */}
      <Card>
        <CardHeader>
          <CardTitle>Competitive Strategy</CardTitle>
          <CardDescription>
            Recommended actions based on competitive analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <Shield className="h-5 w-5" />
                <h4 className="font-medium">Defend</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {analysis?.competitive_strategy.defend}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-orange-600">
                <Swords className="h-5 w-5" />
                <h4 className="font-medium">Attack</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {analysis?.competitive_strategy.attack}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600">
                <Maximize className="h-5 w-5" />
                <h4 className="font-medium">Expand</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {analysis?.competitive_strategy.expand}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitor Gaps */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Competitor Keyword Gaps</h3>
          <Select value={selectedCompetitor} onValueChange={setSelectedCompetitor}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Competitors</SelectItem>
              {competitors.map(comp => (
                <SelectItem key={comp} value={comp}>{comp}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <CompetitorGapsTable 
          gaps={analysis?.competitor_gaps || []}
          selectedCompetitor={selectedCompetitor}
        />
      </div>

      {/* Priority Gaps */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Gap Opportunities</CardTitle>
          <CardDescription>
            High-value keywords where competitors rank but you don't
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis?.competitive_strategy.priority_gaps.map((gap, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-200"
              >
                <div className="space-y-1">
                  <p className="font-medium">{gap.keyword}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Volume: {gap.volume.toLocaleString()}</span>
                    <span>•</span>
                    <span>{gap.opportunity}</span>
                  </div>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Target Keyword
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// components/features/strategic-advice/CompetitorGapsTable.tsx
interface CompetitorGapsTableProps {
  gaps: CompetitorGap[];
  selectedCompetitor: string;
}

export function CompetitorGapsTable({ gaps, selectedCompetitor }: CompetitorGapsTableProps) {
  const filteredGaps = selectedCompetitor === 'all' 
    ? gaps 
    : gaps.filter(gap => 
        Object.keys(gap.competitor_positions).includes(selectedCompetitor)
      );

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Keyword</TableHead>
            <TableHead className="text-right">Volume</TableHead>
            <TableHead className="text-center">Difficulty</TableHead>
            <TableHead className="text-right">CPC</TableHead>
            <TableHead>Competitor Positions</TableHead>
            <TableHead>Opportunity</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredGaps.map((gap, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{gap.keyword}</TableCell>
              <TableCell className="text-right">
                {gap.metrics.volume.toLocaleString()}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={getKDVariant(gap.metrics.difficulty)}>
                  {gap.metrics.difficulty}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                ${gap.metrics.cpc.toFixed(2)}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(gap.competitor_positions).map(([comp, pos]) => (
                    <Badge key={comp} variant="outline" className="text-xs">
                      {comp}: #{pos}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {gap.opportunity}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost">
                  <Target className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
```

---

### 7.3 ROI Projections Tab (20 hours)
**As a** business owner  
**I want** to see potential ROI from SEO improvements  
**So that** I can justify investment in content and optimization

#### Acceptance Criteria
- [ ] ROI timeline chart displays correctly
- [ ] Revenue projections are clear
- [ ] Investment requirements are shown
- [ ] Payback period is calculated
- [ ] Scenario analysis works
- [ ] Charts are interactive
- [ ] Export ROI report works

#### API Endpoints
```typescript
GET /strategic-advice/projects/{id}/roi-projections
```

#### Components to Build
1. **ROI Components**
   - `ROIProjectionsTab.tsx` - Main tab
   - `ROITimelineChart.tsx` - Projection chart
   - `InvestmentBreakdown.tsx` - Cost analysis
   - `ScenarioSelector.tsx` - Best/expected/worst
   - `PaybackAnalysis.tsx` - Break-even display

#### Implementation
```typescript
// components/features/strategic-advice/ROIProjectionsTab.tsx
export function ROIProjectionsTab({ projectId }: { projectId: string }) {
  const [scenario, setScenario] = useState<'best' | 'expected' | 'worst'>('expected');
  const { data: projections, isLoading } = useROIProjections(projectId, scenario);

  if (isLoading) return <ROIProjectionsSkeleton />;

  const breakEvenMonth = calculateBreakEven(
    projections?.projections,
    projections?.investment_required.estimated_cost
  );

  return (
    <div className="space-y-6">
      {/* Current Metrics */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>ROI Projections</CardTitle>
              <CardDescription>
                Expected returns from implementing SEO recommendations
              </CardDescription>
            </div>
            <ScenarioSelector
              value={scenario}
              onChange={setScenario}
              scenarios={projections?.sensitivity_analysis.scenarios}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              title="Current Monthly Traffic"
              value={projections?.current_metrics.monthly_traffic || 0}
              format="number"
              icon={<Users className="h-4 w-4" />}
            />
            <MetricCard
              title="Current Monthly Revenue"
              value={projections?.current_metrics.monthly_revenue || 0}
              format="currency"
              icon={<DollarSign className="h-4 w-4" />}
            />
            <MetricCard
              title="Avg. Value per Visit"
              value={projections?.current_metrics.average_value_per_visit || 0}
              format="currency"
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <MetricCard
              title="Payback Period"
              value={projections?.payback_period || 'N/A'}
              icon={<Calendar className="h-4 w-4" />}
              className="border-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* ROI Timeline Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Growth Timeline</CardTitle>
          <CardDescription>
            Projected traffic and revenue growth over 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ROITimelineChart 
            projections={projections?.projections}
            investment={projections?.investment_required.estimated_cost}
          />
        </CardContent>
      </Card>

      {/* Investment Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Investment Required</CardTitle>
            <CardDescription>
              Estimated time and cost for implementation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InvestmentBreakdown data={projections?.investment_required} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payback Analysis</CardTitle>
            <CardDescription>
              When you'll recover your investment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaybackAnalysis
              investment={projections?.investment_required.estimated_cost}
              monthlyReturn={projections?.projections['30_days'].revenue}
              breakEvenMonth={breakEvenMonth}
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Projections */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Projections</CardTitle>
          <CardDescription>
            Month-by-month breakdown of expected results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectionsTable projections={projections?.projections} />
        </CardContent>
      </Card>
    </div>
  );
}

// components/features/strategic-advice/ROITimelineChart.tsx
interface ROITimelineChartProps {
  projections: Record<string, ProjectionData>;
  investment?: number;
}

export function ROITimelineChart({ projections, investment = 0 }: ROITimelineChartProps) {
  const chartData = Object.entries(projections || {}).map(([period, data]) => ({
    period: period.replace('_', ' '),
    traffic: data.traffic,
    revenue: data.revenue,
    cumulative: data.cumulative_revenue,
    roi: ((data.cumulative_revenue - investment) / investment * 100).toFixed(1)
  }));

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 shadow-lg rounded-lg border">
                    <p className="font-medium">{data.period}</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-blue-600">
                        Traffic: +{data.traffic.toLocaleString()}
                      </p>
                      <p className="text-green-600">
                        Revenue: ${data.revenue.toLocaleString()}
                      </p>
                      <p className="text-purple-600">
                        Cumulative: ${data.cumulative.toLocaleString()}
                      </p>
                      <p className="text-orange-600">
                        ROI: {data.roi}%
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar 
            yAxisId="left" 
            dataKey="traffic" 
            fill="#3b82f6" 
            name="Traffic Increase"
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="revenue" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Monthly Revenue"
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="cumulative" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Cumulative Revenue"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// components/features/strategic-advice/InvestmentBreakdown.tsx
export function InvestmentBreakdown({ data }: { data: InvestmentData }) {
  const hourlyRate = data.estimated_cost / data.total_hours;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
          <div className="space-y-1">
            <p className="text-sm font-medium">Optimization Work</p>
            <p className="text-xs text-muted-foreground">
              Quick wins, on-page SEO, technical fixes
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{data.optimization_hours} hours</p>
            <p className="text-sm text-muted-foreground">
              ${(data.optimization_hours * hourlyRate).toFixed(0)}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
          <div className="space-y-1">
            <p className="text-sm font-medium">Content Creation</p>
            <p className="text-xs text-muted-foreground">
              New pages, blog posts, guides
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{data.content_creation_hours} hours</p>
            <p className="text-sm text-muted-foreground">
              ${(data.content_creation_hours * hourlyRate).toFixed(0)}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">Total Investment</p>
          <p className="text-sm text-muted-foreground">
            {data.total_hours} hours @ ${hourlyRate.toFixed(0)}/hour
          </p>
        </div>
        <p className="text-2xl font-bold">
          ${data.estimated_cost.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// components/features/strategic-advice/PaybackAnalysis.tsx
export function PaybackAnalysis({ 
  investment, 
  monthlyReturn, 
  breakEvenMonth 
}: PaybackAnalysisProps) {
  const monthsToBreakEven = Math.ceil(investment / monthlyReturn);
  const totalReturn6Months = monthlyReturn * 6;
  const roi6Months = ((totalReturn6Months - investment) / investment * 100).toFixed(0);

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
            style={{ width: `${Math.min((6 / monthsToBreakEven) * 100, 100)}%` }}
          />
        </div>
        <div 
          className="absolute top-6 left-0 text-xs text-muted-foreground"
          style={{ left: `${Math.min((monthsToBreakEven / 6) * 100, 100)}%` }}
        >
          Break-even: Month {monthsToBreakEven}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="text-center p-3 rounded-lg bg-muted">
          <p className="text-2xl font-bold text-green-600">{roi6Months}%</p>
          <p className="text-sm text-muted-foreground">6-Month ROI</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted">
          <p className="text-2xl font-bold">{monthsToBreakEven}</p>
          <p className="text-sm text-muted-foreground">Months to Break Even</p>
        </div>
      </div>

      <Alert className="bg-green-50 border-green-200">
        <TrendingUp className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          After break-even, you'll generate ${monthlyReturn.toLocaleString()}/month 
          in additional revenue
        </AlertDescription>
      </Alert>
    </div>
  );
}
```

---

## Definition of Done
- [ ] Content templates are complete
- [ ] SEO guidelines are included
- [ ] Competitive analysis displays properly
- [ ] Market share visualization works
- [ ] ROI projections chart is interactive
- [ ] Scenario analysis functions
- [ ] All exports work correctly
- [ ] Mobile responsive design

## Sprint Deliverables
1. Complete content template system
2. Content outline modal with export
3. Competitive analysis with gaps
4. Market share visualization
5. ROI projection charts
6. Investment breakdown
7. Payback analysis
8. Scenario comparison

## Chart Implementations
- Market share: Donut chart
- ROI timeline: Composed chart (bar + line)
- Traffic growth: Area chart
- Competitive gaps: Data table

## Performance Considerations
- Memoize chart components
- Lazy load tab content
- Cache analysis data
- Optimize large competitor lists
- Debounce scenario changes

## Next Sprint Preview
- Implementation roadmap
- CSV update workflow
- Cache management
- Global features

## Risks & Mitigations
- **Risk**: Complex ROI calculations
  - **Mitigation**: Clear formulas and explanations
- **Risk**: Large competitor datasets
  - **Mitigation**: Pagination and filtering
- **Risk**: Chart performance
  - **Mitigation**: Limit data points, use aggregation