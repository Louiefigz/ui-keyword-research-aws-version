# Performance Targets

## Core Web Vitals

### Target Metrics (Data-Heavy Application)

| Metric | Target | Maximum | Notes |
|--------|--------|---------|-------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 4.0s | Main content visible |
| **FID** (First Input Delay) | < 100ms | 300ms | Responsive to clicks |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.25 | Stable layout |
| **FCP** (First Contentful Paint) | < 2.0s | 3.0s | First content visible |
| **TTI** (Time to Interactive) | < 3.5s | 5.0s | Fully interactive |

## Application-Specific Metrics

### Bundle Size
- **Initial JS**: < 500KB gzipped
- **Total JS**: < 1MB gzipped
- **CSS**: < 50KB gzipped
- **Per-route chunks**: < 200KB gzipped

### API Performance
- **Keyword list load**: < 500ms for 100 items
- **Filter application**: < 100ms UI response
- **Search debounce**: 300ms
- **Export generation**: Progress within 1s

### Large Dataset Handling
- **10k keywords**: Smooth scrolling (60fps)
- **50k keywords**: Virtual scroll enabled
- **100k keywords**: Pagination required
- **Memory usage**: < 500MB for 50k rows

### User Interactions
- **Button click feedback**: < 50ms
- **Modal open**: < 100ms
- **Tab switch**: < 200ms
- **Page navigation**: < 500ms

## Monitoring Strategy

### Development
```javascript
// Web Vitals monitoring
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

### Production
- Vercel Analytics (automatic with Vercel hosting)
- Custom performance marks for critical paths
- Real User Monitoring (RUM) data

## Optimization Techniques

### Code Splitting
- Route-based splitting (automatic with Next.js)
- Component lazy loading for heavy features
- Dynamic imports for charts and visualizations

### Resource Loading
- Preload critical fonts
- Lazy load images
- Defer non-critical scripts
- Progressive data loading

### Caching Strategy
- Static assets: 1 year cache
- API responses: 5 minute cache
- User preferences: LocalStorage
- Search results: Session-based

## Performance Budget

### JavaScript Budget
```json
{
  "main": 200000,        // 200KB
  "vendor": 300000,      // 300KB  
  "total": 500000        // 500KB
}
```

### Asset Budget
- Images: < 200KB each
- Fonts: < 100KB total
- Icons: SVG only

## Testing Performance

### Local Testing
```bash
# Lighthouse CLI
npm install -g lighthouse
lighthouse http://localhost:3000 --view

# Bundle analysis
npm run analyze
```

### CI Performance Tests
- Lighthouse CI on every PR
- Bundle size tracking
- Performance regression alerts

## Red Flags

These indicate performance problems:
- Bundle size increases > 10% in one PR
- LCP > 4 seconds
- Memory usage > 1GB
- Frame rate < 30fps during scroll
- API calls > 2 seconds

## Performance Checklist

Before each release:
- [ ] Run Lighthouse audit
- [ ] Check bundle size
- [ ] Test with throttled network
- [ ] Verify lazy loading works
- [ ] Test with 10k+ keywords
- [ ] Monitor memory usage
- [ ] Check for memory leaks