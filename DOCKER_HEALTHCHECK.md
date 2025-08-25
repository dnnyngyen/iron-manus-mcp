# Docker Healthcheck Implementation

## Overview

The Iron Manus MCP Docker container now includes a comprehensive healthcheck that validates actual application health rather than just Node.js availability.

## What the Healthcheck Validates

The healthcheck performs the following validations:

### 1. Configuration Validation
- **Schema validation**: Ensures all configuration parameters are within valid ranges
- **Security validation**: Verifies critical security settings in production
- **Performance validation**: Checks for optimal performance configurations

### 2. Application Health
- **Server instance**: Verifies the MCP server can be created
- **Tool registry**: Ensures the tool registry is functional with expected tools
- **Health check tool**: Validates the HealthCheck tool is available and responsive

### 3. System Resources
- **Memory usage**: Monitors memory consumption with critical thresholds
- **Response time**: Validates health check response time stays reasonable
- **Process health**: Verifies Node.js process is healthy

## Healthcheck Configuration

### Docker Compose Settings
```yaml
healthcheck:
  test: ["CMD", "node", "/app/healthcheck.js"]
  interval: 30s
  timeout: 15s
  retries: 3
  start_period: 60s
```

### Parameters Explained
- **test**: Executes the custom healthcheck script
- **interval**: Runs health check every 30 seconds
- **timeout**: Allows up to 15 seconds for health check to complete
- **retries**: Allows 3 consecutive failures before marking as unhealthy
- **start_period**: Waits 60 seconds after startup before starting health checks

## Health Check Results

### Healthy Container
When the application is healthy, the healthcheck returns:
- **Exit code**: 0
- **Status**: "healthy"
- **Output**: Detailed health information including uptime, response time, and version

### Unhealthy Container
The healthcheck marks the container as unhealthy when:
- **Configuration errors**: Critical security settings are disabled
- **Application errors**: Server cannot be created or tools are missing
- **Resource issues**: Memory usage exceeds critical thresholds
- **Performance issues**: Response time exceeds reasonable limits

## Testing the Healthcheck

### Manual Testing
```bash
# Test normal operation
docker exec iron-manus-mcp node /app/healthcheck.js

# Test with configuration issues
docker exec -e KNOWLEDGE_MAX_CONCURRENCY=20 iron-manus-mcp node /app/healthcheck.js

# Test with security issues
docker exec -e NODE_ENV=production -e ENABLE_SSRF_PROTECTION=false iron-manus-mcp node /app/healthcheck.js
```

### Monitoring Container Health
```bash
# Check container status
docker-compose ps

# View health check logs
docker logs iron-manus-mcp

# Monitor health status
docker inspect iron-manus-mcp --format='{{.State.Health.Status}}'
```

## Implementation Details

### Healthcheck Script (`healthcheck.js`)
The healthcheck script:
1. Validates configuration using the existing config validation
2. Creates a server instance to ensure MCP server is functional
3. Verifies the tool registry has expected tools
4. Executes the HealthCheck tool to validate system health
5. Monitors memory usage and response times
6. Returns appropriate exit codes for Docker

### Integration with Existing Tools
The healthcheck leverages the existing `HealthCheck` tool from the Iron Manus MCP system, ensuring consistency with the application's own health monitoring capabilities.

## Benefits

### Before (Original Healthcheck)
- **Test**: `node -e "process.exit(0)"`
- **Validation**: Only Node.js availability
- **False positives**: Container marked healthy even if application crashed
- **Limited insight**: No actual application health information

### After (New Healthcheck)
- **Test**: `node /app/healthcheck.js`
- **Validation**: Comprehensive application health
- **Accurate status**: Detects actual application issues
- **Detailed insight**: Provides health metrics and diagnostic information

## Troubleshooting

### Common Issues

1. **Container shows as unhealthy**
   - Check logs: `docker logs iron-manus-mcp`
   - Run manual health check: `docker exec iron-manus-mcp node /app/healthcheck.js`
   - Verify configuration: Review environment variables

2. **Health check timeout**
   - Increase timeout in docker-compose.yml
   - Check system resources
   - Verify application is not hanging

3. **Configuration validation failures**
   - Review environment variables
   - Check for critical security settings
   - Validate parameter ranges

### Debugging Commands
```bash
# View detailed health check output
docker exec iron-manus-mcp node /app/healthcheck.js

# Check health check history
docker inspect iron-manus-mcp --format='{{range .State.Health.Log}}{{.Output}}{{end}}'

# Monitor real-time health status
watch 'docker-compose ps'
```

## Production Considerations

### Security
- Critical security settings cause health check failures
- SSRF protection must be enabled in production
- Configuration validation prevents insecure deployments

### Performance
- Memory usage monitoring prevents resource exhaustion
- Response time validation ensures acceptable performance
- Concurrency limits prevent API overload

### Reliability
- Proper health checks enable container orchestration
- Health status enables automated recovery
- Detailed diagnostics aid in troubleshooting

## Conclusion

The new Docker healthcheck provides comprehensive validation of the Iron Manus MCP application health, enabling:
- Accurate container health reporting
- Automated recovery in orchestrated environments
- Early detection of configuration and application issues
- Detailed health metrics for monitoring and debugging

This implementation ensures that Docker's health status accurately reflects the actual state of the Iron Manus MCP application, not just the Node.js runtime.