# Browser Support

## Supported Browsers

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | Full support |
| Edge | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 14+ | Full support |
| Mobile Chrome | 90+ | Responsive design |
| Mobile Safari | 14+ | iOS 14+ |

## Not Supported

- Internet Explorer (all versions)
- Opera Mini
- UC Browser

## Feature Support

### Modern Features Used
- CSS Grid & Flexbox
- ES2020+ JavaScript features
- Web Workers (for large data processing)
- IntersectionObserver (for lazy loading)
- ResizeObserver (for responsive charts)
- Fetch API
- CSS Custom Properties (CSS Variables)

### Polyfills

No polyfills are included by default to keep bundle size small. The application assumes modern browser support.

### Progressive Enhancement

- Virtual scrolling degrades gracefully to pagination
- Chart animations can be disabled for performance
- Drag-and-drop has click-based fallback

## Testing Browsers

Recommended testing in:
1. Latest Chrome (primary)
2. Latest Safari (Mac users)
3. Latest Firefox (cross-platform)
4. Chrome on Android
5. Safari on iOS

## Performance Considerations

For optimal performance:
- Chrome/Edge: Best performance with V8 engine
- Safari: Good performance, efficient memory usage
- Firefox: Good performance, excellent dev tools

## Known Issues

- Safari: Date picker styling may differ
- Firefox: Custom scrollbar styles not supported
- All: Large datasets (50k+ rows) may require more RAM