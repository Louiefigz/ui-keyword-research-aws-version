# Sprint 6: Strategic Advice - Part 1
**Duration**: Weeks 11-12 (48 hours)
**Goal**: Build strategic advice interface with executive summary and opportunities analysis

## Epic: AI-Driven Strategic Insights
Provide users with comprehensive, data-driven strategic advice based on their keyword analysis, starting with executive summary and opportunity identification.

---

## User Stories

### 6.1 Strategic Advice Layout (12 hours)
**As a** user  
**I want** to see comprehensive strategic advice for my project  
**So that** I can make informed decisions about SEO priorities

#### Acceptance Criteria
- [ ] Main strategic advice page loads with tabs
- [ ] Executive summary shows key insights
- [ ] Current performance metrics are displayed
- [ ] Strategic priorities are listed clearly
- [ ] Expected results timeline is visible
- [ ] Loading states handle async data
- [ ] Mobile layout works properly

#### API Endpoints
```typescript
GET /strategic-advice/projects/{id}
```

#### Components to Build
1. **Page Structure**
   - `app/(dashboard)/projects/[projectId]/strategic-advice/page.tsx`
   - `StrategicAdviceLayout.tsx` - Main container
   - `AdviceTabs.tsx` - Tab navigation
   - `ExecutiveSummary.tsx` - Top-level insights

#### Implementation
```typescript
// app/(dashboard)/projects/[projectId]/strategic-advice/page.tsx
export default function StrategicAdvicePage({ 
  params 
}: { 
  params: { projectId: string } 
}) {
  const { data: advice, isLoading, error } = useStrategicAdvice(params.projectId);

  if (error) {
    return <AdviceErrorState error={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Strategic Advice</h1>
          <p className="text-muted-foreground">
            AI-powered insights and recommendations for your SEO strategy
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {isLoading ? (
        <StrategicAdviceSkeleton />
      ) : advice ? (
        <div className="space-y-6">
          <ExecutiveSummary data={advice.executive_summary} />
          
          <Tabs defaultValue="opportunities" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="opportunities">
                Opportunities
              </TabsTrigger>
              <TabsTrigger value="content">
                Content Strategy
              </TabsTrigger>
              <TabsTrigger value="competitive">
                Competitive Analysis
              </TabsTrigger>
              <TabsTrigger value="roi">
                ROI Projections
              </TabsTrigger>
            </TabsList>

            <TabsContent value="opportunities">
              <OpportunitiesTab projectId={params.projectId} />
            </TabsContent>
            
            <TabsContent value="content">
              <ContentStrategyTab projectId={params.projectId} />
            </TabsContent>
            
            <TabsContent value="competitive">
              <CompetitiveAnalysisTab projectId={params.projectId} />
            </TabsContent>
            
            <TabsContent value="roi">
              <ROIProjectionsTab projectId={params.projectId} />
            </TabsContent>
          </Tabs>
        </div>
      ) : null}
    </div>
  );
}

// components/features/strategic-advice/ExecutiveSummary.tsx
interface ExecutiveSummaryProps {
  data: ExecutiveSummaryData;
}

export function ExecutiveSummary({ data }: ExecutiveSummaryProps) {
  return (
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
            <MetricCard
              title="Keywords Tracked"
              value={data.current_state.total_keywords_tracked}
              icon={<Hash className="h-4 w-4" />}
            />
            <MetricCard
              title="Organic Traffic"
              value={data.current_state.current_organic_traffic}
              format="number"
              icon={<Users className="h-4 w-4" />}
            />
            <MetricCard
              title="Traffic Value"
              value={data.current_state.current_traffic_value}
              format="currency"
              icon={<DollarSign className="h-4 w-4" />}
            />
            <MetricCard
              title="Top 10 Rankings"
              value={data.current_state.top_ranking_keywords}
              icon={<Trophy className="h-4 w-4" />}
              className="border-green-200 bg-green-50"
            />
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
                <Badge variant="secondary" className="bg-green-100">
                  {data.opportunity_summary.immediate_opportunities}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Content Gaps Identified</span>
                <Badge variant="secondary" className="bg-orange-100">
                  {data.opportunity_summary.content_gaps_identified}
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Potential Traffic Gain</span>
                <span className="font-semibold text-green-600">
                  +{data.opportunity_summary.potential_traffic_gain}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Potential Monthly Value</span>
                <span className="font-semibold text-green-600">
                  {data.opportunity_summary.potential_monthly_value}
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
            Recommended actions in order of impact and effort
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.strategic_priorities.map((priority, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                </div>
                <p className="text-sm flex-1">{priority}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expected Results Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Expected Results Timeline</CardTitle>
          <CardDescription>
            Projected impact of implementing recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(data.expected_results).map(([timeframe, result]) => (
              <div key={timeframe} className="flex items-center gap-4">
                <div className="w-20 text-sm font-medium text-muted-foreground">
                  {timeframe.replace('_', ' ')}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${getProgressWidth(result)}%`
                    }}
                  />
                </div>
                <div className="text-sm font-semibold text-green-600 w-32 text-right">
                  {result}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### 6.2 Opportunities Tab (20 hours)
**As a** user  
**I want** to see detailed opportunity analysis  
**So that** I can prioritize quick wins and high-impact improvements

#### Acceptance Criteria
- [ ] Immediate opportunities are displayed with metrics
- [ ] Quick wins are highlighted prominently
- [ ] Content gaps show potential value
- [ ] Each opportunity has clear action steps
- [ ] Effort vs impact is visualized
- [ ] Filtering by opportunity type works
- [ ] Export opportunities list works

#### API Endpoints
```typescript
GET /strategic-advice/projects/{id}/opportunities
```

#### Components to Build
1. **Opportunity Components**
   - `OpportunitiesTab.tsx` - Main tab content
   - `OpportunityCard.tsx` - Individual opportunity
   - `QuickWinsSection.tsx` - Low-hanging fruit
   - `ContentGapsSection.tsx` - Missing content
   - `EffortImpactMatrix.tsx` - 2x2 visualization

#### Implementation
```typescript
// components/features/strategic-advice/OpportunitiesTab.tsx
export function OpportunitiesTab({ projectId }: { projectId: string }) {
  const { data: opportunities, isLoading } = useOpportunities(projectId);
  const [filter, setFilter] = useState<'all' | 'quick_wins' | 'content_gaps'>('all');

  if (isLoading) return <OpportunitiesSkeleton />;

  const totalValue = opportunities ? 
    opportunities.total_opportunity_value : 0;

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Opportunity Analysis</h2>
          <p className="text-muted-foreground">
            Total opportunity value: {formatCurrency(totalValue)}
          </p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Opportunities</SelectItem>
            <SelectItem value="quick_wins">Quick Wins Only</SelectItem>
            <SelectItem value="content_gaps">Content Gaps Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Wins Section */}
      {(filter === 'all' || filter === 'quick_wins') && (
        <QuickWinsSection 
          opportunities={opportunities?.low_hanging_fruit || []} 
        />
      )}

      {/* Content Gaps Section */}
      {(filter === 'all' || filter === 'content_gaps') && (
        <ContentGapsSection 
          gaps={opportunities?.content_gaps || []} 
        />
      )}

      {/* Effort vs Impact Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Effort vs Impact Analysis</CardTitle>
          <CardDescription>
            Prioritize opportunities based on effort required and potential impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EffortImpactMatrix 
            opportunities={[
              ...(opportunities?.low_hanging_fruit || []),
              ...(opportunities?.existing_opportunities || [])
            ]} 
          />
        </CardContent>
      </Card>
    </div>
  );
}

// components/features/strategic-advice/OpportunityCard.tsx
interface OpportunityCardProps {
  opportunity: ImmediateOpportunity;
  type: 'quick_win' | 'content_gap' | 'existing';
}

export function OpportunityCard({ opportunity, type }: OpportunityCardProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'quick_win':
        return 'border-green-200 bg-green-50';
      case 'content_gap':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <Card className={cn("hover:shadow-md transition-shadow", getTypeStyles())}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">
              {opportunity.keyword}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                Volume: {opportunity.current_state.search_volume.toLocaleString()}
              </Badge>
              <Badge variant="secondary">
                KD: {opportunity.current_state.difficulty}
              </Badge>
              {opportunity.current_state.position && (
                <Badge variant="outline">
                  Position: {opportunity.current_state.position}
                </Badge>
              )}
            </div>
          </div>
          <Badge 
            variant="default" 
            className={cn(
              "text-xs",
              opportunity.implementation_priority === 'HIGH' && "bg-red-500",
              opportunity.implementation_priority === 'MEDIUM' && "bg-orange-500",
              opportunity.implementation_priority === 'LOW' && "bg-green-500"
            )}
          >
            {opportunity.implementation_priority} Priority
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Performance */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-white rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Current Traffic</p>
            <p className="font-semibold">
              {opportunity.current_state.monthly_traffic.toLocaleString()}/mo
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Current Value</p>
            <p className="font-semibold">
              {opportunity.current_state.monthly_value}
            </p>
          </div>
        </div>

        {/* Opportunity Analysis */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Opportunity Analysis</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Traffic Capture Rate:</span>
              <span>{opportunity.opportunity_analysis.traffic_capture_rate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Missed Traffic:</span>
              <span className="text-orange-600">
                {opportunity.opportunity_analysis.missed_traffic}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Revenue Opportunity:</span>
              <span className="text-green-600 font-semibold">
                {opportunity.opportunity_analysis.revenue_opportunity}
              </span>
            </div>
          </div>
        </div>

        {/* Data-Driven Insight */}
        <Alert className="bg-blue-50 border-blue-200">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            {opportunity.data_driven_insight}
          </AlertDescription>
        </Alert>

        {/* Success Metrics */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Expected Results</h4>
          <div className="grid grid-cols-2 gap-4 p-3 bg-white rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Target Position</p>
              <p className="font-semibold text-green-600">
                #{opportunity.success_metrics.target_position}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Traffic Increase</p>
              <p className="font-semibold text-green-600">
                {opportunity.success_metrics.traffic_multiplier}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Expected Traffic</p>
              <p className="font-semibold">
                {opportunity.success_metrics.expected_total_traffic.toLocaleString()}/mo
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Expected Revenue</p>
              <p className="font-semibold">
                {opportunity.success_metrics.expected_revenue}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1">
            <Zap className="h-4 w-4 mr-2" />
            View Optimization Steps
          </Button>
          <Button variant="outline">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// components/features/strategic-advice/EffortImpactMatrix.tsx
export function EffortImpactMatrix({ opportunities }: { opportunities: any[] }) {
  const chartData = opportunities.map(opp => ({
    name: opp.keyword,
    effort: getEffortScore(opp),
    impact: getImpactScore(opp),
    value: opp.potential_revenue_gain || 0
  }));

  return (
    <div className="relative h-[400px] bg-gray-50 rounded-lg p-4">
      {/* Quadrant Labels */}
      <div className="absolute top-2 left-2 text-xs font-medium text-muted-foreground">
        Low Effort / High Impact
      </div>
      <div className="absolute top-2 right-2 text-xs font-medium text-muted-foreground">
        High Effort / High Impact
      </div>
      <div className="absolute bottom-2 left-2 text-xs font-medium text-muted-foreground">
        Low Effort / Low Impact
      </div>
      <div className="absolute bottom-2 right-2 text-xs font-medium text-muted-foreground">
        High Effort / Low Impact
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="effort" 
            label={{ value: 'Effort Required →', position: 'insideBottom', offset: -10 }}
            domain={[0, 10]}
          />
          <YAxis 
            dataKey="impact" 
            label={{ value: 'Potential Impact →', angle: -90, position: 'insideLeft' }}
            domain={[0, 10]}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 shadow-lg rounded-lg border">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Effort: {data.effort}/10
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Impact: {data.impact}/10
                    </p>
                    <p className="text-sm font-medium text-green-600">
                      Value: ${data.value.toLocaleString()}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter 
            data={chartData} 
            fill="#3b82f6"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getQuadrantColor(entry.effort, entry.impact)} 
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
```

---

### 6.3 Content Strategy Tab - Part 1 (16 hours)
**As a** content strategist  
**I want** to see content recommendations  
**So that** I can create targeted content that drives traffic

#### Acceptance Criteria
- [ ] Priority clusters are displayed with metrics
- [ ] Content calendar shows monthly plan
- [ ] Each cluster has content recommendations
- [ ] Templates provide structure guidance
- [ ] Estimated impact is clearly shown
- [ ] Export content plan works

#### API Endpoints
```typescript
GET /strategic-advice/projects/{id}/content-strategy
```

#### Components to Build
1. **Content Strategy Components**
   - `ContentStrategyTab.tsx` - Main tab
   - `PriorityClusters.tsx` - Cluster priorities
   - `ContentCalendar.tsx` - Monthly timeline
   - `ContentTemplateCard.tsx` - Template display

#### Implementation
```typescript
// components/features/strategic-advice/ContentStrategyTab.tsx
export function ContentStrategyTab({ projectId }: { projectId: string }) {
  const { data: strategy, isLoading } = useContentStrategy(projectId);
  const [timelineMonths, setTimelineMonths] = useState(6);

  if (isLoading) return <ContentStrategySkeleton />;

  return (
    <div className="space-y-6">
      {/* Strategy Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Content Strategy Overview</CardTitle>
          <CardDescription>
            AI-generated content plan based on keyword clusters and opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              title="Keywords Targeted"
              value={strategy?.estimated_impact.total_keywords_targeted || 0}
              icon={<Target className="h-4 w-4" />}
            />
            <MetricCard
              title="Total Search Volume"
              value={strategy?.estimated_impact.total_search_volume || 0}
              format="number"
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <MetricCard
              title="Est. Monthly Traffic"
              value={strategy?.estimated_impact.estimated_monthly_traffic || 0}
              format="number"
              icon={<Users className="h-4 w-4" />}
            />
            <MetricCard
              title="Est. Monthly Value"
              value={strategy?.estimated_impact.estimated_monthly_value || 0}
              format="currency"
              icon={<DollarSign className="h-4 w-4" />}
            />
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <Clock className="inline h-4 w-4 mr-1" />
              Timeline to results: {strategy?.estimated_impact.timeline_to_results}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Priority Clusters */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Priority Content Clusters</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {strategy?.priority_clusters.map((cluster, index) => (
            <PriorityClusterCard key={index} cluster={cluster} rank={index + 1} />
          ))}
        </div>
      </div>

      {/* Content Calendar */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Content Calendar</CardTitle>
              <CardDescription>
                Recommended publishing schedule for maximum impact
              </CardDescription>
            </div>
            <Select 
              value={timelineMonths.toString()} 
              onValueChange={(v) => setTimelineMonths(parseInt(v))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 months</SelectItem>
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="12">12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ContentCalendar 
            items={strategy?.content_calendar || []} 
            months={timelineMonths}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// components/features/strategic-advice/PriorityClusterCard.tsx
interface PriorityClusterCardProps {
  cluster: PriorityCluster;
  rank: number;
}

export function PriorityClusterCard({ cluster, rank }: PriorityClusterCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">#{rank}</span>
            </div>
            <div>
              <h4 className="font-semibold">{cluster.cluster_name}</h4>
              <p className="text-sm text-muted-foreground">
                {cluster.keyword_count} keywords
              </p>
            </div>
          </div>
          <Badge variant="secondary">
            {cluster.total_volume.toLocaleString()} volume
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Strategic Metrics */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Commercial Intent</span>
            <span className="font-medium">
              {(cluster.strategic_metrics.commercial_ratio * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Avg CPC Value</span>
            <span className="font-medium">
              ${cluster.strategic_metrics.avg_cpc_value.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Competition</span>
            <span className="font-medium">
              {(cluster.strategic_metrics.competition_score * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Priority Score</span>
            <span className="font-medium text-primary">
              {cluster.strategic_metrics.priority_score.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Content Recommendation */}
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-1">Recommendation</p>
          <p className="text-sm text-muted-foreground">
            {cluster.content_recommendation}
          </p>
        </div>

        {/* Keywords Preview */}
        <div>
          <p className="text-sm font-medium mb-2">Target Keywords</p>
          <div className="flex flex-wrap gap-1">
            {cluster.keywords.slice(0, 5).map((keyword, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {cluster.keywords.length > 5 && (
              <Badge variant="ghost" className="text-xs">
                +{cluster.keywords.length - 5} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## Definition of Done
- [ ] Strategic advice page loads properly
- [ ] Executive summary displays all metrics
- [ ] Opportunities are categorized correctly
- [ ] Quick wins are highlighted
- [ ] Content strategy shows clusters
- [ ] All data visualizations work
- [ ] Export functionality works
- [ ] Mobile responsive design

## Sprint Deliverables
1. Complete strategic advice layout
2. Executive summary with all metrics
3. Opportunities analysis with filtering
4. Quick wins and content gaps sections
5. Effort vs impact visualization
6. Priority clusters display
7. Content calendar (partial)

## Technical Considerations
- Cache strategic advice data (10 min)
- Lazy load tab content
- Optimize large data visualizations
- Handle empty states gracefully
- Implement proper loading states

## Design Patterns
- Card-based layouts for opportunities
- Color coding for priority levels
- Progressive disclosure for details
- Consistent metric displays
- Interactive visualizations

## Next Sprint Preview
- Complete content strategy features
- Competitive analysis implementation
- ROI projections with charts
- Implementation roadmap

## Risks & Mitigations
- **Risk**: Complex data relationships
  - **Mitigation**: Start with simple visualizations
- **Risk**: Performance with many opportunities
  - **Mitigation**: Implement pagination/virtualization
- **Risk**: Understanding strategic advice
  - **Mitigation**: Add tooltips and explanations