# Strategic Features Folder Restructure Plan

## Current Issues
- 25 components all in one `/strategic` folder
- No clear separation between tabs, charts, and sub-components
- Difficult to navigate and maintain

## Proposed Structure

```
components/features/strategic/
├── index.ts                          # Main exports
├── StrategicAdviceSkeleton.tsx      # Keep at root (shared)
├── ExecutiveSummary.tsx              # Keep at root (main component)
│
├── opportunities/                    # Opportunities tab and related
│   ├── index.ts
│   ├── OpportunitiesTab.tsx
│   ├── OpportunityCard.tsx
│   └── EffortImpactMatrix.tsx
│
├── content-strategy/                 # Content strategy tab and related
│   ├── index.ts
│   ├── ContentStrategyTab.tsx
│   ├── ContentStrategyOverview.tsx
│   ├── ContentClusterCard.tsx
│   ├── ContentCalendar.tsx
│   ├── ContentGapsSection.tsx
│   ├── ContentTemplates.tsx
│   ├── ContentOutlineModal.tsx
│   └── OptimizationRecommendations.tsx
│
├── competitive-analysis/             # Competitive analysis tab and related
│   ├── index.ts
│   ├── CompetitiveAnalysisTab.tsx
│   ├── CompetitorGapsTable.tsx
│   ├── CompetitiveAdvantages.tsx
│   ├── StrategyRecommendations.tsx
│   └── MarketShareChart.tsx
│
├── roi-projections/                  # ROI projections tab and related
│   ├── index.ts
│   ├── ROIProjectionsTab.tsx
│   ├── ROITimelineChart.tsx
│   ├── ROIChart.tsx
│   ├── InvestmentBreakdown.tsx
│   ├── PaybackAnalysis.tsx
│   └── ProjectionTable.tsx
│
└── implementation/                   # Implementation tab
    ├── index.ts
    └── ImplementationRoadmapTab.tsx
```

## Benefits
1. **Clear organization** by feature/tab
2. **Easier navigation** - developers know where to find components
3. **Better scalability** - easy to add new components to each section
4. **Logical grouping** - related components stay together
5. **Cleaner imports** - can import from feature folders

## Migration Steps
1. Create subdirectories
2. Move components to appropriate folders
3. Create index.ts files for each subdirectory
4. Update imports in all affected files
5. Update main strategic/index.ts
6. Test all imports work correctly