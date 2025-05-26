# Sprint 5: Clusters & Visualizations
**Duration**: Weeks 9-10 (48 hours)
**Goal**: Build clusters interface with detailed views and data visualizations

## Epic: Keyword Clustering Analysis
Enable users to analyze keyword clusters, understand relationships between keywords, and identify content opportunities through visual insights.

---

## User Stories

### 5.1 Clusters Main Screen (16 hours)
**As a** user  
**I want** to see all my keyword clusters  
**So that** I can identify content themes and optimization opportunities

#### Acceptance Criteria
- [ ] Clusters page shows summary statistics
- [ ] Cluster cards display key metrics
- [ ] Grid layout is responsive
- [ ] Sorting works by size, volume, opportunity
- [ ] Filtering by minimum size works
- [ ] Click on cluster opens detailed view
- [ ] Loading states are smooth

#### API Endpoints
```typescript
GET /clusters?project_id={id}&min_size={n}&sort_by={field}
```

#### Components to Build
1. **Page Components**
   - `app/(dashboard)/projects/[projectId]/clusters/page.tsx`
   - `ClustersSummary.tsx` - Top-level metrics
   - `ClustersGrid.tsx` - Grid container
   - `ClusterCard.tsx` - Individual cluster display

2. **Supporting Components**
   - `ClusterFilters.tsx` - Filter controls
   - `ClusterSortSelector.tsx` - Sort dropdown
   - `ClusterMetrics.tsx` - Metric displays

#### Implementation
```typescript
// app/(dashboard)/projects/[projectId]/clusters/page.tsx
export default function ClustersPage({ params }: { params: { projectId: string } }) {
  const [filters, setFilters] = useState<ClusterFilters>({
    minSize: 2,
    sortBy: 'size',
    sortOrder: 'desc'
  });

  const { data: clusters, isLoading } = useClusters(params.projectId, filters);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Keyword Clusters</h1>
          <p className="text-muted-foreground">
            Discover content themes and optimization opportunities
          </p>
        </div>
        <ClusterFilters 
          filters={filters} 
          onFiltersChange={setFilters} 
        />
      </div>

      <ClustersSummary clusters={clusters?.clusters || []} />
      
      {isLoading ? (
        <ClustersGridSkeleton />
      ) : (
        <ClustersGrid clusters={clusters?.clusters || []} />
      )}
    </div>
  );
}

// components/features/clusters/ClusterCard.tsx
interface ClusterCardProps {
  cluster: Cluster;
  onViewDetails: (cluster: Cluster) => void;
}

export function ClusterCard({ cluster, onViewDetails }: ClusterCardProps) {
  const priorityColor = getPriorityColor(cluster.metrics.opportunity_score);
  
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onViewDetails(cluster)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg line-clamp-1">
              {cluster.name}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {cluster.keyword_count} keywords
              </Badge>
              <Badge 
                variant="outline" 
                className={cn("border-2", priorityColor)}
              >
                Priority {Math.ceil(cluster.metrics.opportunity_score / 3)}
              </Badge>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <MetricItem
            label="Total Volume"
            value={cluster.total_volume.toLocaleString()}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <MetricItem
            label="Avg Position"
            value={cluster.avg_position.toFixed(1)}
            icon={<Hash className="h-4 w-4" />}
          />
          <MetricItem
            label="Quick Wins"
            value={cluster.metrics.quick_wins}
            icon={<Zap className="h-4 w-4" />}
            highlight={cluster.metrics.quick_wins > 0}
          />
          <MetricItem
            label="Content Gaps"
            value={cluster.metrics.content_gaps}
            icon={<FileQuestion className="h-4 w-4" />}
            highlight={cluster.metrics.content_gaps > 0}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Top Keywords
          </p>
          <div className="flex flex-wrap gap-1">
            {cluster.top_keywords.slice(0, 3).map((keyword, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {cluster.keyword_count > 3 && (
              <Badge variant="outline" className="text-xs">
                +{cluster.keyword_count - 3} more
              </Badge>
            )}
          </div>
        </div>

        {cluster.metrics.opportunity_score >= 7 && (
          <Alert className="bg-green-50 border-green-200">
            <Lightbulb className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              High opportunity cluster - Consider priority optimization
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

// components/features/clusters/ClustersSummary.tsx
export function ClustersSummary({ clusters }: { clusters: Cluster[] }) {
  const stats = useMemo(() => {
    const totalKeywords = clusters.reduce((sum, c) => sum + c.keyword_count, 0);
    const totalVolume = clusters.reduce((sum, c) => sum + c.total_volume, 0);
    const totalQuickWins = clusters.reduce((sum, c) => sum + c.metrics.quick_wins, 0);
    const highOpportunityClusters = clusters.filter(c => c.metrics.opportunity_score >= 7).length;

    return {
      totalClusters: clusters.length,
      totalKeywords,
      totalVolume,
      totalQuickWins,
      highOpportunityClusters,
      avgClusterSize: clusters.length > 0 ? totalKeywords / clusters.length : 0
    };
  }, [clusters]);

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      <MetricCard
        title="Total Clusters"
        value={stats.totalClusters}
        icon={<Network className="h-4 w-4" />}
      />
      <MetricCard
        title="Clustered Keywords"
        value={stats.totalKeywords}
        icon={<Hash className="h-4 w-4" />}
      />
      <MetricCard
        title="Total Volume"
        value={stats.totalVolume}
        format="number"
        icon={<TrendingUp className="h-4 w-4" />}
      />
      <MetricCard
        title="Avg Cluster Size"
        value={stats.avgClusterSize}
        format="decimal"
        icon={<Calculator className="h-4 w-4" />}
      />
      <MetricCard
        title="Total Quick Wins"
        value={stats.totalQuickWins}
        icon={<Zap className="h-4 w-4" />}
        className="border-green-200 bg-green-50"
      />
      <MetricCard
        title="High Opportunity"
        value={stats.highOpportunityClusters}
        icon={<Target className="h-4 w-4" />}
        className="border-purple-200 bg-purple-50"
      />
    </div>
  );
}
```

---

### 5.2 Cluster Detail Modal (16 hours)
**As a** user  
**I want** to see detailed information about a cluster  
**So that** I can understand the keywords and create targeted content

#### Acceptance Criteria
- [ ] Modal shows comprehensive cluster metrics
- [ ] Keywords table is filterable and sortable
- [ ] Strategic recommendations are displayed
- [ ] Main keyword is highlighted
- [ ] Quick wins are easily identifiable
- [ ] Export cluster data works
- [ ] Modal is responsive on mobile

#### API Endpoints
```typescript
GET /clusters/{cluster_id}
```

#### Components to Build
1. **Modal Components**
   - `ClusterDetailModal.tsx` - Main modal container
   - `ClusterOverview.tsx` - Metrics and summary
   - `ClusterKeywordsTable.tsx` - Keywords in cluster
   - `ClusterRecommendations.tsx` - Strategic advice

#### Implementation
```typescript
// components/features/clusters/ClusterDetailModal.tsx
interface ClusterDetailModalProps {
  cluster: Cluster | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClusterDetailModal({ 
  cluster, 
  isOpen, 
  onClose 
}: ClusterDetailModalProps) {
  const { data: clusterDetails, isLoading } = useClusterDetails(
    cluster?.id,
    { enabled: !!cluster?.id && isOpen }
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {clusterDetails?.name || cluster?.name}
          </DialogTitle>
          <DialogDescription>
            Cluster analysis and optimization opportunities
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <ClusterDetailSkeleton />
          ) : clusterDetails ? (
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="keywords">
                  Keywords ({clusterDetails.keyword_count})
                </TabsTrigger>
                <TabsTrigger value="strategy">Strategy</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <ClusterOverview cluster={clusterDetails} />
              </TabsContent>

              <TabsContent value="keywords">
                <ClusterKeywordsTable keywords={clusterDetails.keywords} />
              </TabsContent>

              <TabsContent value="strategy">
                <ClusterRecommendations 
                  cluster={clusterDetails}
                  recommendations={clusterDetails.recommendations}
                />
              </TabsContent>
            </Tabs>
          ) : null}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => exportCluster(clusterDetails)}>
            <Download className="h-4 w-4 mr-2" />
            Export Cluster
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// components/features/clusters/ClusterOverview.tsx
export function ClusterOverview({ cluster }: { cluster: ClusterDetails }) {
  const mainKeyword = cluster.keywords.find(k => k.volume === Math.max(...cluster.keywords.map(kw => kw.volume)));
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Volume"
          value={cluster.metrics.total_volume}
          format="number"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <MetricCard
          title="Avg Position"
          value={cluster.metrics.avg_position}
          format="decimal"
          icon={<Hash className="h-4 w-4" />}
          inverse={true}
        />
        <MetricCard
          title="Avg Difficulty"
          value={cluster.metrics.avg_kd}
          format="decimal"
          icon={<Shield className="h-4 w-4" />}
        />
        <MetricCard
          title="Opportunity Score"
          value={cluster.metrics.opportunity_score}
          format="decimal"
          icon={<Target className="h-4 w-4" />}
          className="border-purple-200 bg-purple-50"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Main Keyword</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium text-lg">{mainKeyword?.keyword}</p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Volume: {mainKeyword?.volume.toLocaleString()}</span>
                {mainKeyword?.position && (
                  <span>Position: {mainKeyword.position}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Quick Wins</span>
                <Badge variant="secondary" className="bg-green-100">
                  {cluster.metrics.quick_wins}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Content Gaps</span>
                <Badge variant="secondary" className="bg-orange-100">
                  {cluster.metrics.content_gaps}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Ranking Keywords</span>
                <Badge variant="secondary">
                  {cluster.keywords.filter(k => k.position && k.position <= 50).length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Intent Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <IntentDistributionChart keywords={cluster.keywords} />
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### 5.3 Data Visualizations (16 hours)
**As a** user  
**I want** to see visual representations of my data  
**So that** I can quickly understand patterns and opportunities

#### Acceptance Criteria
- [ ] Recharts is properly integrated
- [ ] Charts are responsive
- [ ] Colors match design system
- [ ] Tooltips show detailed information
- [ ] Charts handle empty data gracefully
- [ ] Performance is smooth
- [ ] Accessibility is maintained

#### Visualization Components
1. **Chart Components**
   - `OpportunityDonutChart.tsx` - Opportunity distribution
   - `ClusterBarChart.tsx` - Cluster comparisons
   - `VolumeDistributionChart.tsx` - Volume analysis
   - `PositionScatterPlot.tsx` - Position vs volume
   - `TrendSparkline.tsx` - Mini trend charts

#### Implementation
```typescript
// components/features/charts/OpportunityDonutChart.tsx
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = {
  success: '#8b5cf6',
  low_hanging: '#10b981',
  existing: '#3b82f6',
  clustering_opportunity: '#f59e0b',
  untapped: '#ef4444'
};

interface OpportunityDonutChartProps {
  data: Record<string, number>;
  height?: number;
}

export function OpportunityDonutChart({ 
  data, 
  height = 300 
}: OpportunityDonutChartProps) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key.replace(/_/g, ' '),
    value,
    color: COLORS[key] || '#6b7280'
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-medium capitalize">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Count: {data.value.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            Percentage: {percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value) => (
            <span className="capitalize text-sm">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// components/features/charts/ClusterBarChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ClusterBarChartProps {
  clusters: Cluster[];
  metric: 'volume' | 'keywords' | 'opportunity';
}

export function ClusterBarChart({ clusters, metric }: ClusterBarChartProps) {
  const data = clusters
    .slice(0, 10) // Top 10 clusters
    .map(cluster => ({
      name: cluster.name.length > 20 
        ? cluster.name.substring(0, 20) + '...' 
        : cluster.name,
      volume: cluster.total_volume,
      keywords: cluster.keyword_count,
      opportunity: cluster.metrics.opportunity_score * 1000 // Scale for visibility
    }));

  const metricConfig = {
    volume: { 
      dataKey: 'volume', 
      fill: '#3b82f6', 
      label: 'Search Volume',
      formatter: (v: number) => v.toLocaleString()
    },
    keywords: { 
      dataKey: 'keywords', 
      fill: '#10b981', 
      label: 'Keyword Count',
      formatter: (v: number) => v.toString()
    },
    opportunity: { 
      dataKey: 'opportunity', 
      fill: '#8b5cf6', 
      label: 'Opportunity Score',
      formatter: (v: number) => (v / 1000).toFixed(1)
    }
  };

  const config = metricConfig[metric];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={100}
          className="text-xs"
        />
        <YAxis 
          tickFormatter={config.formatter}
          className="text-xs"
        />
        <Tooltip 
          formatter={config.formatter}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px'
          }}
        />
        <Bar 
          dataKey={config.dataKey} 
          fill={config.fill}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// components/features/charts/TrendSparkline.tsx
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface TrendSparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export function TrendSparkline({ 
  data, 
  color = '#3b82f6', 
  height = 40 
}: TrendSparklineProps) {
  const chartData = data.map((value, index) => ({ value, index }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

## Definition of Done
- [ ] Clusters page loads and displays data
- [ ] Cluster cards show all metrics
- [ ] Detail modal works smoothly
- [ ] Charts render correctly
- [ ] Responsive design works
- [ ] Loading states are smooth
- [ ] Error handling is in place
- [ ] Export functionality works

## Sprint Deliverables
1. Complete clusters listing page
2. Detailed cluster analysis modal
3. Interactive data visualizations
4. Cluster filtering and sorting
5. Export cluster data
6. Mobile-responsive design

## Chart Library Setup
```bash
npm install recharts
npm install -D @types/recharts
```

## Performance Considerations
- Limit initial cluster display to 20-30
- Lazy load cluster details
- Memoize chart components
- Use virtual scrolling for long keyword lists
- Optimize chart re-renders

## Accessibility Notes
- Charts must have proper ARIA labels
- Color choices should be colorblind-friendly
- Keyboard navigation for all interactions
- Screen reader descriptions for visualizations

## Next Sprint Preview
- Strategic advice main interface
- Executive summary implementation
- Opportunities analysis
- Beginning of content strategy

## Risks & Mitigations
- **Risk**: Chart performance with large datasets
  - **Mitigation**: Limit data points, use aggregation
- **Risk**: Complex cluster relationships
  - **Mitigation**: Start with simple visualizations
- **Risk**: Mobile chart experience
  - **Mitigation**: Responsive design, touch interactions