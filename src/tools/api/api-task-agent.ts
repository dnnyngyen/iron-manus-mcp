/**
 * API Task Agent
 *
 * Specialized agent for comprehensive API research workflows that integrates
 * discovery, validation, and fetching into a single, intelligent interface.
 *
 * This agent eliminates the need to manually orchestrate APISearch, APIValidator,
 * and MultiAPIFetch tools by providing a unified workflow that:
 * - Discovers relevant APIs based on objectives and role
 * - Validates discovered endpoints for reliability
 * - Fetches data with intelligent retry and error handling
 * - Provides strategic guidance for data interpretation
 *
 * @fileoverview Unified API research agent for Iron Manus MCP
 * @author Iron Manus MCP Team
 * @version 2.0.0
 */

import { BaseTool, ToolResult, ToolSchema } from '../base-tool.js';
import { selectRelevantAPIs } from '../../core/api-registry.js';
import { Role } from '../../core/types.js';
import { createAPIFetcher, APIFetcher, FetchResult } from '../../utils/api-fetcher.js';
import { API_SEARCH_CONFIG } from '../../config/tool-constants.js';
import logger from '../../utils/logger.js';

export interface APITaskAgentArgs {
  objective: string; // Strategic research intent
  user_role: Role; // Cognitive perspective for API selection
  research_depth?: 'light' | 'standard' | 'comprehensive'; // Research thoroughness
  validation_required?: boolean; // Whether to validate discovered APIs
  max_sources?: number; // Maximum number of API sources to use
  category_filter?: string; // Domain focus for API discovery
  timeout_ms?: number; // Request timeout per API
  headers?: Record<string, string>; // Authentication headers
}

/**
 * API Task Agent
 *
 * Intelligent agent that handles complete API research workflows by integrating
 * discovery, validation, and fetching capabilities into a single, streamlined interface.
 *
 * This agent embodies the metaprompting-first design philosophy by prompting strategic
 * thinking about data needs while handling the technical complexity of API orchestration.
 *
 * Key Capabilities:
 * - Role-based API discovery using cognitive filtering
 * - Automatic endpoint validation for reliability assurance
 * - Parallel data fetching with intelligent error handling
 * - Strategic guidance for data interpretation and synthesis
 * - Fallback workflows when primary APIs fail
 *
 * Usage Patterns:
 * - Light research: Quick data gathering from known reliable sources
 * - Standard research: Balanced discovery and validation for most use cases
 * - Comprehensive research: Deep validation and alternative source exploration
 *
 * @class APITaskAgent
 * @extends BaseTool
 * @implements Metaprompting-first cognitive enhancement
 */
export class APITaskAgent extends BaseTool {
  name = 'APITaskAgent';
  description =
    'Specialized API research agent that orchestrates discovery, validation, and data fetching workflows. When you need structured data from external sources, ask: What type of evidence does my current research objective require? How can I ensure data reliability while maintaining research efficiency? This agent guides you through strategic API selection based on your cognitive role, automatically validates sources, and provides comprehensive data synthesis with actionable insights.';

  inputSchema: ToolSchema = {
    type: 'object',
    properties: {
      objective: {
        type: 'string',
        description:
          'Strategic research intent - What specific data or insights are you seeking? Frame this as a precise research question that guides intelligent API selection.',
      },
      user_role: {
        type: 'string',
        enum: [
          'planner',
          'coder',
          'critic',
          'researcher',
          'analyzer',
          'synthesizer',
          'ui_architect',
          'ui_implementer',
          'ui_refiner',
        ],
        description:
          'Cognitive perspective - What type of thinking are you applying to this research? Each role influences API selection and data interpretation strategies.',
      },
      research_depth: {
        type: 'string',
        enum: ['light', 'standard', 'comprehensive'],
        description:
          'Research thoroughness level - How deep should the investigation go? Light for quick answers, standard for balanced research, comprehensive for deep analysis.',
      },
      validation_required: {
        type: 'boolean',
        description:
          'Endpoint validation requirement - Should discovered APIs be tested for reliability before fetching? Recommended for critical research.',
      },
      max_sources: {
        type: 'number',
        description:
          'Maximum API sources - How many different data perspectives do you need for triangulation and cross-validation?',
      },
      category_filter: {
        type: 'string',
        description:
          'Domain focus constraint - Which specific data domain should guide API selection (e.g., "financial", "social", "technical")?',
      },
      timeout_ms: {
        type: 'number',
        description:
          'Request patience threshold - How long should each API call wait before timing out? Balance speed vs. completeness.',
      },
      headers: {
        type: 'object',
        description:
          'Authentication context - What credentials or headers are needed to access premium data sources?',
      },
    },
    required: ['objective', 'user_role'],
  };

  async handle(args: unknown): Promise<ToolResult> {
    const startTime = Date.now();

    try {
      // Validate and parse arguments
      this.validateArgs(args);
      const {
        objective,
        user_role,
        research_depth = 'standard',
        validation_required = true,
        max_sources = 5,
        category_filter,
        timeout_ms = 5000,
        headers = {},
      } = args as APITaskAgentArgs;

      logger.info(`APITaskAgent: Starting ${research_depth} research for role: ${user_role}`);

      // Phase 1: API Discovery
      const discoveryResult = await this.discoverAPIs(
        objective,
        user_role,
        max_sources,
        category_filter
      );

      if (discoveryResult.apis.length === 0) {
        return this.createResponse(`# 🔍 API Research Results

## Discovery Phase
**Objective**: ${objective}
**Role**: ${user_role}
**Depth**: ${research_depth}

**No relevant APIs found** for your research objective. Consider:
- Broadening your search terms or category filter
- Using WebSearch for general web research instead
- Refining your objective to match available data sources

## Strategic Recommendations
- **Alternative Approach**: Try WebSearch or WebFetch for broader research
- **Objective Refinement**: Consider what specific data types would best serve your ${user_role} perspective
- **Domain Exploration**: Explore related domains that might have relevant APIs

*Generated by Iron Manus API Task Agent*`);
      }

      // Phase 2: Validation (if required)
      let validationResults: any[] = [];
      let validAPIs = discoveryResult.apis;

      if (validation_required && research_depth !== 'light') {
        const validationResult = await this.validateAPIs(validAPIs, timeout_ms);
        validationResults = validationResult.results;
        validAPIs = validationResult.validAPIs;

        if (validAPIs.length === 0) {
          return this.createResponse(`# ⚠️ API Research Results

## Discovery Phase
Found ${discoveryResult.apis.length} potential APIs for: "${objective}"

## Validation Phase
**All discovered APIs failed validation checks**

Common issues:
${validationResults.map(r => `- ${r.endpoint}: ${r.error || 'Unknown error'}`).join('\n')}

## Strategic Recovery Framework
- **Fallback Strategy**: Consider using WebSearch for broader data gathering
- **Objective Refinement**: Your research goal might require different data sources
- **Timing Consideration**: APIs might be temporarily unavailable - try again later
- **Alternative Domains**: Explore related but different data domains

*Generated by Iron Manus API Task Agent*`);
        }
      }

      // Phase 3: Data Fetching
      const fetchingResult = await this.fetchData(validAPIs, timeout_ms, headers, research_depth);

      // Phase 4: Results Synthesis
      return this.synthesizeResults(
        objective,
        user_role,
        research_depth,
        discoveryResult,
        validationResults,
        fetchingResult,
        Date.now() - startTime
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`APITaskAgent Error: ${errorMessage}`);

      return this.createErrorResponse(`API research workflow failed: ${errorMessage}`);
    }
  }

  /**
   * Phase 1: Discover relevant APIs based on objective and role
   */
  private async discoverAPIs(
    objective: string,
    userRole: Role,
    maxResults: number,
    categoryFilter?: string
  ): Promise<{ apis: string[]; reasoning: string }> {
    try {
      const discoveredAPIs = selectRelevantAPIs(
        objective,
        userRole,
        undefined // use default registry
      );

      // Take only the requested number of results
      const limitedAPIs = discoveredAPIs.slice(0, maxResults);

      const apis = limitedAPIs.map(result => result.api.url);
      const reasoning = `Selected ${apis.length} APIs optimized for ${userRole} perspective: ${limitedAPIs.map(result => result.api.name).join(', ')}`;

      logger.info(`API Discovery: Found ${apis.length} relevant APIs`);
      return { apis, reasoning };
    } catch (error) {
      logger.error(`API Discovery failed: ${error}`);
      return { apis: [], reasoning: 'API discovery failed due to system error' };
    }
  }

  /**
   * Phase 2: Validate discovered APIs for reliability
   */
  private async validateAPIs(
    apis: string[],
    timeout: number
  ): Promise<{ validAPIs: string[]; results: any[] }> {
    const fetcher = createAPIFetcher({ timeout, maxConcurrent: 3 });
    const results = [];
    const validAPIs = [];

    logger.info(`API Validation: Testing ${apis.length} endpoints`);

    for (const api of apis) {
      try {
        const validation = await fetcher.testEndpoint(api);
        results.push({
          endpoint: api,
          isHealthy: validation.isHealthy,
          status: validation.status,
          responseTime: validation.responseTime,
          error: validation.error,
          suggestion: validation.suggestion,
        });

        if (validation.isHealthy) {
          validAPIs.push(
            validation.suggestion ? validation.suggestion.replace('Consider using: ', '') : api
          );
        }
      } catch (error) {
        results.push({
          endpoint: api,
          isHealthy: false,
          status: 0,
          responseTime: 0,
          error: error instanceof Error ? error.message : 'Validation failed',
        });
      }
    }

    logger.info(`API Validation: ${validAPIs.length}/${apis.length} APIs validated successfully`);
    return { validAPIs, results };
  }

  /**
   * Phase 3: Fetch data from validated APIs
   */
  private async fetchData(
    apis: string[],
    timeout: number,
    headers: Record<string, string>,
    researchDepth: string
  ): Promise<FetchResult[]> {
    const maxConcurrent = researchDepth === 'comprehensive' ? 5 : 3;
    const fetcher = createAPIFetcher({
      timeout,
      maxConcurrent,
      headers,
      maxRetries: researchDepth === 'light' ? 1 : 2,
    });

    logger.info(
      `Data Fetching: Retrieving from ${apis.length} APIs with ${maxConcurrent} concurrent requests`
    );

    const results = await fetcher.fetchMultiple(apis);
    const successCount = results.filter(r => r.success).length;

    logger.info(`Data Fetching: ${successCount}/${apis.length} successful retrievals`);
    return results;
  }

  /**
   * Phase 4: Synthesize all results into comprehensive response
   */
  private synthesizeResults(
    objective: string,
    userRole: Role,
    researchDepth: string,
    discovery: { apis: string[]; reasoning: string },
    validation: any[],
    fetching: FetchResult[],
    totalDuration: number
  ): ToolResult {
    const successful = fetching.filter(r => r.success);
    const failed = fetching.filter(r => !r.success);
    const totalDataSize = successful.reduce((sum, r) => sum + r.size, 0);
    const avgResponseTime =
      successful.length > 0
        ? successful.reduce((sum, r) => sum + r.duration, 0) / successful.length
        : 0;

    // Format results with strategic guidance
    const resultSections = successful
      .map((result, i) => {
        const domain = new URL(result.endpoint).hostname;
        const dataPreview =
          typeof result.data === 'object'
            ? JSON.stringify(result.data).substring(0, 300) + '...'
            : String(result.data).substring(0, 300) + '...';

        return `### ${i + 1}. ${domain}
**URL**: ${result.endpoint}
**Status**: ${result.status} ${result.statusText}
**Response Time**: ${result.duration}ms
**Data Size**: ${(result.size / 1024).toFixed(2)}KB
**Data Preview**: ${dataPreview}
${result.corrected ? `**Note**: Auto-corrected endpoint was used` : ''}`;
      })
      .join('\n\n');

    const failedSections =
      failed.length > 0
        ? failed
            .map((result, i) => {
              const domain = new URL(result.endpoint).hostname;
              return `### ${i + 1}. ${domain} (Failed)
**URL**: ${result.endpoint}
**Error**: ${result.error?.type} - ${result.error?.message}
**Response Time**: ${result.duration}ms`;
            })
            .join('\n\n')
        : '';

    const validationSummary =
      validation.length > 0
        ? `
## 🔍 Validation Summary
${validation.map(v => `- **${new URL(v.endpoint).hostname}**: ${v.isHealthy ? '✅ Healthy' : '❌ Failed'} (${v.responseTime}ms)${v.suggestion ? ' - ' + v.suggestion : ''}`).join('\n')}
`
        : '';

    const responseText = `# 🚀 API Research Results

**Research Objective**: ${objective}
**Cognitive Role**: ${userRole}
**Research Depth**: ${researchDepth}
**Total Duration**: ${totalDuration}ms

## 📊 Summary
- **APIs Discovered**: ${discovery.apis.length}
- **APIs Validated**: ${validation.length > 0 ? validation.filter(v => v.isHealthy).length : 'Skipped'}
- **Successful Retrievals**: ${successful.length}
- **Failed Retrievals**: ${failed.length}
- **Total Data Retrieved**: ${(totalDataSize / 1024).toFixed(2)}KB
- **Average Response Time**: ${avgResponseTime.toFixed(0)}ms

## 🎯 Discovery Strategy
${discovery.reasoning}
${validationSummary}
## ✅ Successful Data Retrieval

${resultSections}

${
  failed.length > 0
    ? `## ❌ Failed Retrievals

${failedSections}`
    : ''
}

## 🧠 Strategic Analysis Framework for ${userRole} Perspective

### Data Quality Assessment
- **Completeness**: How well does the retrieved data address your research objective?
- **Reliability**: Which sources demonstrated the most consistent performance?
- **Relevance**: How does each data source align with your ${userRole} analysis needs?

### Cross-Reference Opportunities  
- **Pattern Recognition**: What common themes emerge across successful data sources?
- **Contradiction Analysis**: Where do data sources diverge, and what might this reveal?
- **Gap Identification**: What critical information is missing from the current data set?

### Next Strategic Steps
Consider based on your ${userRole} perspective:
- **Data Synthesis**: How will you combine these insights into actionable intelligence?
- **Validation Needs**: Which findings require additional verification or sources?
- **Implementation Path**: How do these insights inform your next analytical or development steps?

### Quality Indicators
- **Success Rate**: ${((successful.length / fetching.length) * 100).toFixed(1)}%
- **Performance**: ${avgResponseTime < 2000 ? 'Excellent' : avgResponseTime < 5000 ? 'Good' : 'Needs Optimization'} response times
- **Data Richness**: ${totalDataSize > 50000 ? 'Comprehensive' : totalDataSize > 10000 ? 'Substantial' : 'Moderate'} data volume

---
*Generated by Iron Manus API Task Agent - Intelligent API Research Orchestration*`;

    return this.createResponse(responseText);
  }
}
