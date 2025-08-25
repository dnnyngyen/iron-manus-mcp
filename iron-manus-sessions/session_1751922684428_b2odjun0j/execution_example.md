# EXECUTE Phase - Performance Optimization Example Implementation

## Example Task: Core Web Vitals Monitoring Setup

### Implementation Overview
This is a shallow execution example demonstrating how the EXECUTE phase would implement one of the planned tasks.

### Quick Implementation: Basic Performance Monitoring Script

```javascript
// Basic Core Web Vitals monitoring implementation
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.thresholds = {
      LCP: 2500,  // 2.5 seconds
      INP: 200,   // 200ms
      CLS: 0.1    // 0.1 layout shift
    };
  }

  measureLCP() {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.LCP = lastEntry.startTime;
      this.validateMetric('LCP');
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }

  measureINP() {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        this.metrics.INP = entry.duration;
        this.validateMetric('INP');
      }
    }).observe({ entryTypes: ['event'] });
  }

  measureCLS() {
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.metrics.CLS = clsValue;
      this.validateMetric('CLS');
    }).observe({ entryTypes: ['layout-shift'] });
  }

  validateMetric(metricName) {
    const value = this.metrics[metricName];
    const threshold = this.thresholds[metricName];
    const status = value <= threshold ? 'PASS' : 'FAIL';
    
    console.log(`${metricName}: ${value} (${status})`);
    
    // Send to monitoring dashboard
    this.sendToMonitoring(metricName, value, status);
  }

  sendToMonitoring(metric, value, status) {
    // Integration point for APM tools (Datadog, New Relic, etc.)
    fetch('/api/performance-metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric,
        value,
        status,
        timestamp: Date.now(),
        url: window.location.href
      })
    });
  }

  initializeMonitoring() {
    this.measureLCP();
    this.measureINP();
    this.measureCLS();
    console.log('Performance monitoring initialized');
  }
}

// Initialize monitoring
const monitor = new PerformanceMonitor();
monitor.initializeMonitoring();
```

### Expected Output
- Real-time Core Web Vitals tracking
- Automated threshold validation
- Dashboard integration for continuous monitoring
- Foundation for more complex optimization implementations

### Next Steps (Full Implementation)
1. Integrate with comprehensive APM solution
2. Add automated alerting for threshold violations
3. Implement performance budgets
4. Connect to CI/CD pipeline for regression detection

### Task Status
✅ Shallow execution example completed  
⏭️ Ready for VERIFY phase

---
*Generated during EXECUTE phase of Iron Manus JARVIS workflow demonstration*
*Session: session_1751922684428_b2odjun0j*
*Phase: EXECUTE → VERIFY*