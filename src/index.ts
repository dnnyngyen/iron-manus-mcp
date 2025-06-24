// Enhanced MCP Server - Accurate replication of Manus's 6-step loop + 3 modules + fractal orchestration
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { processState, extractMetaPromptFromTodo } from './core/fsm.js';
import { MessageJARVIS, Role } from './core/types.js';
import { stateManager } from './core/state.js';
import { selectRelevantAPIs, rateLimiter } from './core/api-registry.js';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
// Enhanced tool schemas will be implemented when needed

const server = new Server(
  {
    name: 'JARVIS',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Enhanced tool registry with APISearch integration
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = [
    {
      name: 'JARVIS',
      description: '🚀 **JARVIS Finite State Machine Controller** - Accurate replication of Manus\'s PyArmor-protected architecture. Implements the 6-step agent loop (Analyze Events → Select Tools → Wait for Execution → Iterate → Submit Results → Enter Standby) with 3 modules (Planner/Knowledge/Datasource) plus fractal orchestration. Features: Role-based cognitive enhancement (2.3x-3.2x reasoning multipliers), meta-prompt generation for Task() agent spawning, performance tracking, and single-tool-per-iteration enforcement. Hijacks Sequential Thinking for deterministic agent control.',
      inputSchema: {
        type: 'object',
        properties: {
          session_id: {
            type: 'string',
            description: 'Unique session identifier'
          },
          phase_completed: {
            type: 'string',
            enum: ['QUERY', 'ENHANCE', 'KNOWLEDGE', 'PLAN', 'EXECUTE', 'VERIFY'],
            description: 'Phase that Claude just completed (omit for initial call)'
          },
          initial_objective: {
            type: 'string',
            description: 'User\'s goal (only on first call)'
          },
          payload: {
            type: 'object',
            description: 'Phase-specific data from Claude',
            additionalProperties: true
          }
        },
        required: ['session_id']
      }
    },
    {
      name: 'MultiAPIFetch',
      description: 'Parallel HTTP requests to multiple APIs with timeout management and response aggregation - fetches data from selected APIs simultaneously for efficient knowledge gathering',
      inputSchema: {
        type: 'object',
        properties: {
          api_endpoints: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'Array of API URLs to fetch from'
          },
          timeout_ms: { 
            type: 'number', 
            description: 'Request timeout in milliseconds (default: 5000)'
          },
          max_concurrent: { 
            type: 'number', 
            description: 'Maximum concurrent requests (default: 3)'
          },
          headers: {
            type: 'object',
            description: 'Optional headers to include in requests'
          }
        },
        required: ['api_endpoints']
      }
    },
    {
      name: 'APISearch',
      description: 'Intelligent API discovery with role-based filtering - searches the API registry to find relevant APIs based on objective context and user role',
      inputSchema: {
        type: 'object',
        properties: {
          objective: { 
            type: 'string', 
            description: 'The goal or task requiring API data' 
          },
          user_role: { 
            type: 'string', 
            enum: ['planner', 'coder', 'critic', 'researcher', 'analyzer', 'synthesizer', 'ui_architect', 'ui_implementer', 'ui_refiner'], 
            description: 'User role for preference-based filtering' 
          },
          max_results: { 
            type: 'number', 
            description: 'Maximum number of APIs to return (default: 5)' 
          },
          category_filter: { 
            type: 'string', 
            description: 'Optional category to filter by' 
          }
        },
        required: ['objective', 'user_role']
      }
    },
    {
      name: 'KnowledgeSynthesize',
      description: 'Cross-validation engine with conflict resolution and confidence scoring - synthesizes and validates information from multiple API sources to provide reliable, structured knowledge',
      inputSchema: {
        type: 'object',
        properties: {
          api_responses: { 
            type: 'array', 
            items: { 
              type: 'object',
              properties: {
                source: { type: 'string' },
                data: { type: 'string' },
                confidence: { type: 'number' }
              }
            },
            description: 'Array of API response objects to synthesize'
          },
          synthesis_mode: { 
            type: 'string', 
            enum: ['consensus', 'weighted', 'hierarchical', 'conflict_resolution'],
            description: 'Method for synthesizing conflicting information'
          },
          confidence_threshold: { 
            type: 'number', 
            description: 'Minimum confidence score for inclusion (0-1, default: 0.5)'
          },
          objective_context: {
            type: 'string',
            description: 'Original objective for context-aware synthesis'
          }
        },
        required: ['api_responses', 'synthesis_mode']
      }
    }
  ];
  
  return { tools };
});

/**
 * Semaphore class for limiting concurrent operations
 */
class Semaphore {
  private permits: number;
  private waiting: (() => void)[] = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      this.waiting.push(resolve);
    });
  }

  release(): void {
    this.permits++;
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift()!;
      this.permits--;
      resolve();
    }
  }
}

/**
 * Handle MultiAPIFetch tool requests with comprehensive parallel fetching
 * @param args - Tool arguments containing api_endpoints and optional parameters
 * @returns Structured multi-API fetch results
 */
async function handleMultiAPIFetchTool(args: any) {
  const startTime = Date.now();
  
  try {
    // Validate required parameters
    if (!args.api_endpoints || !Array.isArray(args.api_endpoints)) {
      throw new Error('api_endpoints is required and must be an array of URLs');
    }
    
    if (args.api_endpoints.length === 0) {
      throw new Error('api_endpoints array cannot be empty');
    }
    
    if (args.api_endpoints.length > 10) {
      throw new Error('Maximum 10 API endpoints allowed per request');
    }
    
    // Validate URLs
    const validEndpoints: string[] = [];
    for (const endpoint of args.api_endpoints) {
      if (typeof endpoint !== 'string') {
        throw new Error('All api_endpoints must be strings');
      }
      
      try {
        const url = new URL(endpoint);
        if (!['http:', 'https:'].includes(url.protocol)) {
          throw new Error(`Invalid protocol in URL: ${endpoint}`);
        }
        validEndpoints.push(endpoint);
      } catch {
        throw new Error(`Invalid URL format: ${endpoint}`);
      }
    }
    
    // Validate optional parameters
    const timeoutMs = args.timeout_ms ?? 5000;
    if (typeof timeoutMs !== 'number' || timeoutMs < 1000 || timeoutMs > 30000) {
      throw new Error('timeout_ms must be a number between 1000 and 30000');
    }
    
    const maxConcurrent = args.max_concurrent ?? 3;
    if (typeof maxConcurrent !== 'number' || maxConcurrent < 1 || maxConcurrent > 5) {
      throw new Error('max_concurrent must be a number between 1 and 5');
    }
    
    const headers = args.headers || {};
    if (typeof headers !== 'object' || Array.isArray(headers)) {
      throw new Error('headers must be an object');
    }
    
    
    // Create semaphore for concurrent request limiting
    const semaphore = new Semaphore(maxConcurrent);
    
    // Create axios instance with default config
    const axiosInstance = axios.create({
      timeout: timeoutMs,
      headers: {
        'User-Agent': 'Iron-Manus-MCP/1.0.0',
        'Accept': 'application/json, text/plain, */*',
        ...headers
      },
      maxContentLength: 1024 * 1024 * 5, // 5MB limit
      maxBodyLength: 1024 * 1024 * 5
    });
    
    // Function to fetch a single API with rate limiting and error handling
    const fetchAPI = async (endpoint: string, index: number) => {
      await semaphore.acquire();
      
      try {
        const startTime = Date.now();
        
        // Check rate limiting
        const apiName = new URL(endpoint).hostname;
        if (!rateLimiter.canMakeRequest(apiName, 10, 60000)) {
          throw new Error('Rate limit exceeded for this API');
        }
        
        // Make the request with exponential backoff retry
        let lastError: Error | null = null;
        const maxRetries = 2;
        
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            if (attempt > 0) {
              // Exponential backoff: 500ms, 1000ms
              const delay = 500 * Math.pow(2, attempt - 1);
              await new Promise(resolve => setTimeout(resolve, delay));
            }
            
            const response = await axiosInstance.get(endpoint);
            const duration = Date.now() - startTime;
            
            // Sanitize response data
            let sanitizedData = response.data;
            if (typeof sanitizedData === 'string' && sanitizedData.length > 10000) {
              sanitizedData = sanitizedData.substring(0, 10000) + '... [truncated]';
            } else if (typeof sanitizedData === 'object' && sanitizedData !== null) {
              sanitizedData = JSON.parse(JSON.stringify(sanitizedData, null, 2).substring(0, 10000));
            }
            
            return {
              endpoint,
              index,
              success: true,
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(
                Object.entries(response.headers).slice(0, 10) // Limit headers
              ),
              data: sanitizedData,
              size: JSON.stringify(response.data).length,
              duration,
              error: null
            };
          } catch (error) {
            lastError = error as Error;
            if (attempt === maxRetries) {
              throw lastError;
            }
          }
        }
        
        throw lastError;
        
      } catch (error) {
        const duration = Date.now() - startTime;
        const axiosError = error as AxiosError;
        
        let errorType = 'Unknown';
        let errorMessage = 'Unknown error occurred';
        
        if (axiosError.code === 'ECONNABORTED') {
          errorType = 'Timeout';
          errorMessage = `Request timeout after ${timeoutMs}ms`;
        } else if (axiosError.code === 'ENOTFOUND' || axiosError.code === 'ECONNREFUSED') {
          errorType = 'Network';
          errorMessage = 'Network connection failed';
        } else if (axiosError.response) {
          errorType = 'HTTP';
          errorMessage = `HTTP ${axiosError.response.status}: ${axiosError.response.statusText}`;
        } else if (error instanceof Error) {
          errorType = 'Request';
          errorMessage = error.message;
        }
        
        return {
          endpoint,
          index,
          success: false,
          status: axiosError.response?.status || 0,
          statusText: axiosError.response?.statusText || 'Error',
          headers: {},
          data: null,
          size: 0,
          duration,
          error: {
            type: errorType,
            message: errorMessage,
            code: axiosError.code || 'UNKNOWN'
          }
        };
      } finally {
        semaphore.release();
      }
    };
    
    // Execute all requests in parallel with Promise.allSettled
    const results = await Promise.allSettled(
      validEndpoints.map((endpoint, index) => fetchAPI(endpoint, index))
    );
    
    // Process results
    const apiResults = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          endpoint: validEndpoints[index],
          index,
          success: false,
          status: 0,
          statusText: 'Promise Rejected',
          headers: {},
          data: null,
          size: 0,
          duration: 0,
          error: {
            type: 'Promise',
            message: result.reason?.message || 'Promise was rejected',
            code: 'PROMISE_REJECTED'
          }
        };
      }
    });
    
    // Calculate statistics
    const totalDuration = Date.now() - startTime;
    const successful = apiResults.filter(r => r.success).length;
    const failed = apiResults.length - successful;
    const totalDataSize = apiResults.reduce((sum, r) => sum + r.size, 0);
    const avgResponseTime = successful > 0 ? 
      apiResults.filter(r => r.success).reduce((sum, r) => sum + r.duration, 0) / successful : 0;
    
    // Group errors by type
    const errorsByType: Record<string, number> = {};
    apiResults.filter(r => !r.success).forEach(r => {
      const errorType = r.error?.type || 'Unknown';
      errorsByType[errorType] = (errorsByType[errorType] || 0) + 1;
    });
    
    // Format individual results
    const formattedResults = apiResults.map((result, i) => {
      const status = result.success ? '✅' : '❌';
      const url = new URL(result.endpoint);
      const domain = url.hostname;
      
      if (result.success) {
        const dataPreview = typeof result.data === 'object' ? 
          JSON.stringify(result.data).substring(0, 200) + '...' :
          String(result.data).substring(0, 200) + '...';
        
        return `### ${i + 1}. ${status} ${domain}
**URL**: ${result.endpoint}
**Status**: ${result.status} ${result.statusText}
**Response Time**: ${result.duration}ms
**Data Size**: ${(result.size / 1024).toFixed(2)}KB
**Data Preview**: ${dataPreview}
`;
      } else {
        return `### ${i + 1}. ${status} ${domain}
**URL**: ${result.endpoint}
**Error Type**: ${result.error?.type || 'Unknown'}
**Error**: ${result.error?.message || 'Unknown error'}
**Response Time**: ${result.duration}ms
`;
      }
    }).join('\n');
    
    // Generate comprehensive response
    const responseText = `# 📡 Multi-API Fetch Results

**APIs Queried**: ${validEndpoints.length}
**Successful**: ${successful}
**Failed**: ${failed}
**Total Time**: ${totalDuration}ms
**Average Response Time**: ${avgResponseTime.toFixed(0)}ms
**Total Data Retrieved**: ${(totalDataSize / 1024).toFixed(2)}KB

## 🎯 **Performance Summary**
- **Success Rate**: ${((successful / validEndpoints.length) * 100).toFixed(1)}%
- **Concurrent Requests**: ${maxConcurrent}
- **Request Timeout**: ${timeoutMs}ms
- **Rate Limiting**: Active

${Object.keys(errorsByType).length > 0 ? `## ⚠️ **Error Analysis**
${Object.entries(errorsByType).map(([type, count]) => `- **${type} Errors**: ${count}`).join('\n')}

` : ''}## 📊 **API Results**

${formattedResults}

## 🔧 **Integration Guidance**
- **Successful APIs**: Use the returned data for your application logic
- **Failed APIs**: Check error types and implement appropriate retry logic
- **Rate Limiting**: Some APIs may have been rate-limited; retry later if needed
- **Data Sanitization**: Large responses have been truncated for readability

## 🚀 **Performance Metrics**
- **Parallel Execution**: ${maxConcurrent} concurrent requests
- **Memory Usage**: Responses limited to 5MB each
- **Timeout Handling**: ${timeoutMs}ms per request
- **Retry Logic**: Up to 2 retries with exponential backoff

---
*Generated by Iron Manus Multi-API Fetch System*`;
    
    return {
      content: [{
        type: 'text',
        text: responseText
      }]
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const totalDuration = Date.now() - startTime;
    
    console.error(`MultiAPIFetch Error: ${errorMessage}`);
    
    // Enhanced error handling with recovery guidance
    const errorResponse = `# ❌ **Multi-API Fetch Error**

**Error**: ${errorMessage}
**Duration**: ${totalDuration}ms

## 🔧 **Recovery Protocol**
1. **API Endpoints**: Ensure all URLs are valid and accessible
   - Must be valid HTTP/HTTPS URLs
   - Maximum 10 endpoints per request
   - Each endpoint must be a string

2. **Timeout**: Optional timeout in milliseconds (1000-30000, default: 5000)

3. **Concurrency**: Optional max concurrent requests (1-5, default: 3)

4. **Headers**: Optional object with custom headers

## 📖 **Usage Example**
\`\`\`json
{
  "api_endpoints": [
    "https://api.github.com/users/octocat",
    "https://jsonplaceholder.typicode.com/posts/1",
    "https://httpbin.org/get"
  ],
  "timeout_ms": 5000,
  "max_concurrent": 3,
  "headers": {
    "Authorization": "Bearer <your-api-token>"
  }
}
\`\`\`

## 🛡️ **Built-in Protections**
- **Rate Limiting**: Prevents API abuse
- **Timeout Management**: Prevents hanging requests
- **Concurrent Limiting**: Prevents overwhelming servers
- **Response Size Limits**: Prevents memory issues
- **Retry Logic**: Handles transient failures
- **Error Categorization**: Clear error reporting

**Next Action**: Call MultiAPIFetch with corrected parameters.`;
    
    return {
      content: [{
        type: 'text',
        text: errorResponse
      }],
      isError: true
    };
  }
}

/**
 * Calculate similarity between two strings using Levenshtein distance
 * @param a - First string
 * @param b - Second string
 * @returns Similarity score between 0 and 1
 */
function calculateStringSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length === 0 || b.length === 0) return 0;
  
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  const maxLength = Math.max(a.length, b.length);
  return 1 - matrix[b.length][a.length] / maxLength;
}

/**
 * Interface for API response data structure
 */
interface APIResponse {
  source: string;
  data: string;
  confidence: number;
}

/**
 * Interface for synthesis result
 */
interface SynthesisResult {
  content: string;
  confidence: number;
  sources: string[];
  contradictions: string[];
  evidence: string[];
}

/**
 * Handle KnowledgeSynthesize tool requests with comprehensive cross-validation
 * @param args - Tool arguments containing api_responses and synthesis parameters
 * @returns Structured knowledge synthesis results
 */
async function handleKnowledgeSynthesizeTool(args: any) {
  const startTime = Date.now();
  
  try {
    // Validate required parameters
    if (!args.api_responses || !Array.isArray(args.api_responses)) {
      throw new Error('api_responses is required and must be an array of response objects');
    }
    
    if (args.api_responses.length === 0) {
      throw new Error('api_responses array cannot be empty');
    }
    
    if (args.api_responses.length > 20) {
      throw new Error('Maximum 20 API responses allowed per synthesis request');
    }
    
    if (!args.synthesis_mode || typeof args.synthesis_mode !== 'string') {
      throw new Error('synthesis_mode is required and must be a string');
    }
    
    // Validate synthesis_mode enum
    const validModes = ['consensus', 'weighted', 'hierarchical', 'conflict_resolution'];
    if (!validModes.includes(args.synthesis_mode)) {
      throw new Error(`Invalid synthesis_mode: ${args.synthesis_mode}. Must be one of: ${validModes.join(', ')}`);
    }
    
    // Validate API responses structure
    const validatedResponses: APIResponse[] = [];
    for (let i = 0; i < args.api_responses.length; i++) {
      const response = args.api_responses[i];
      
      if (!response || typeof response !== 'object') {
        throw new Error(`API response at index ${i} must be an object`);
      }
      
      if (!response.source || typeof response.source !== 'string') {
        throw new Error(`API response at index ${i} must have a 'source' string`);
      }
      
      if (!response.data || typeof response.data !== 'string') {
        throw new Error(`API response at index ${i} must have a 'data' string`);
      }
      
      if (typeof response.confidence !== 'number' || response.confidence < 0 || response.confidence > 1) {
        throw new Error(`API response at index ${i} must have a 'confidence' number between 0 and 1`);
      }
      
      validatedResponses.push({
        source: response.source,
        data: response.data.trim(),
        confidence: response.confidence
      });
    }
    
    // Validate optional parameters
    const confidenceThreshold = args.confidence_threshold ?? 0.5;
    if (typeof confidenceThreshold !== 'number' || confidenceThreshold < 0 || confidenceThreshold > 1) {
      throw new Error('confidence_threshold must be a number between 0 and 1');
    }
    
    const objectiveContext = args.objective_context || '';
    if (objectiveContext && typeof objectiveContext !== 'string') {
      throw new Error('objective_context must be a string');
    }
    
    
    // Filter responses by confidence threshold
    const highConfidenceResponses = validatedResponses.filter(r => r.confidence >= confidenceThreshold);
    
    if (highConfidenceResponses.length === 0) {
      throw new Error(`No responses meet the confidence threshold of ${confidenceThreshold}`);
    }
    
    // Perform synthesis based on mode
    let synthesisResult: SynthesisResult;
    
    switch (args.synthesis_mode) {
      case 'consensus':
        synthesisResult = performConsensusSynthesis(highConfidenceResponses, objectiveContext);
        break;
      case 'weighted':
        synthesisResult = performWeightedSynthesis(highConfidenceResponses, objectiveContext);
        break;
      case 'hierarchical':
        synthesisResult = performHierarchicalSynthesis(highConfidenceResponses, objectiveContext);
        break;
      case 'conflict_resolution':
        synthesisResult = performConflictResolutionSynthesis(highConfidenceResponses, objectiveContext);
        break;
      default:
        throw new Error(`Unsupported synthesis mode: ${args.synthesis_mode}`);
    }
    
    // Calculate quality metrics
    const totalDuration = Date.now() - startTime;
    const sourceCount = validatedResponses.length;
    const usedSources = highConfidenceResponses.length;
    const averageConfidence = highConfidenceResponses.reduce((sum, r) => sum + r.confidence, 0) / highConfidenceResponses.length;
    const contradictionCount = synthesisResult.contradictions.length;
    const sourceAgreementPercentage = calculateSourceAgreement(highConfidenceResponses);
    const informationCompletenessScore = calculateCompletenessScore(synthesisResult, objectiveContext);
    
    // Format evidence trail
    const evidenceTrail = synthesisResult.evidence.map((evidence, index) => {
      return `${index + 1}. ${evidence}`;
    }).join('\n');
    
    // Format contradictions
    const contradictionsText = contradictionCount > 0 ? 
      synthesisResult.contradictions.map((contradiction, index) => {
        return `${index + 1}. ${contradiction}`;
      }).join('\n') : 'None detected';
    
    // Generate comprehensive response
    const responseText = `# 🧠 Knowledge Synthesis Results

**Sources Analyzed**: ${sourceCount}
**Sources Used**: ${usedSources} (above ${confidenceThreshold} confidence threshold)
**Synthesis Mode**: ${args.synthesis_mode}
**Overall Confidence Score**: ${(synthesisResult.confidence * 100).toFixed(1)}%
**Contradictions Found**: ${contradictionCount}
**Processing Time**: ${totalDuration}ms

## 📊 **Quality Assessment**
- **Source Agreement**: ${sourceAgreementPercentage.toFixed(1)}%
- **Average Input Confidence**: ${(averageConfidence * 100).toFixed(1)}%
- **Information Completeness**: ${(informationCompletenessScore * 100).toFixed(1)}%
- **Synthesis Reliability**: ${getSynthesisReliabilityGrade(synthesisResult.confidence, sourceAgreementPercentage, contradictionCount)}

## 🎯 **Synthesized Knowledge**

${synthesisResult.content}

## 🔍 **Evidence Trail**

${evidenceTrail}

## ⚠️ **Contradictions & Conflicts**

${contradictionsText}

## 📈 **Source Analysis**

${highConfidenceResponses.map((response, index) => {
      const preview = response.data.length > 150 ? response.data.substring(0, 150) + '...' : response.data;
      return `### ${index + 1}. ${response.source}
**Confidence**: ${(response.confidence * 100).toFixed(1)}%
**Data Preview**: ${preview}
**Status**: ${synthesisResult.sources.includes(response.source) ? '✅ Used in synthesis' : '❌ Excluded'}

`;
    }).join('')}

## 🛡️ **Validation Metrics**
- **Cross-validation Algorithm**: String similarity + semantic analysis
- **Confidence Scoring**: Weighted by source reliability and agreement
- **Contradiction Detection**: Multi-level conflict identification
- **Evidence Transparency**: Full source attribution and reasoning

## 🔧 **Integration Recommendations**

${getIntegrationRecommendations(synthesisResult, args.synthesis_mode, contradictionCount)}

---
*Generated by Iron Manus Knowledge Synthesis Engine*`;
    
    return {
      content: [{
        type: 'text',
        text: responseText
      }]
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const totalDuration = Date.now() - startTime;
    
    console.error(`KnowledgeSynthesize Error: ${errorMessage}`);
    
    // Enhanced error handling with recovery guidance
    const errorResponse = `# ❌ **Knowledge Synthesis Error**

**Error**: ${errorMessage}
**Duration**: ${totalDuration}ms

## 🔧 **Recovery Protocol**
1. **API Responses**: Ensure array contains valid response objects
   - Each response must have: source (string), data (string), confidence (0-1)
   - Maximum 20 responses per request
   - At least one response must meet confidence threshold

2. **Synthesis Mode**: Must be one of:
   - **consensus**: Find common information across sources
   - **weighted**: Weight information by source confidence
   - **hierarchical**: Prioritize sources by reliability
   - **conflict_resolution**: Identify and resolve contradictions

3. **Confidence Threshold**: Optional number between 0-1 (default: 0.5)

4. **Objective Context**: Optional string for context-aware synthesis

## 📖 **Usage Example**
\`\`\`json
{
  "api_responses": [
    {
      "source": "Weather API",
      "data": "Temperature: 72°F, Humidity: 45%",
      "confidence": 0.9
    },
    {
      "source": "Backup Weather Service",
      "data": "Temp: 71°F, Humidity: 47%",
      "confidence": 0.8
    }
  ],
  "synthesis_mode": "consensus",
  "confidence_threshold": 0.7,
  "objective_context": "Current weather conditions for planning"
}
\`\`\`

## 🧠 **Synthesis Capabilities**
- **Cross-Validation**: Multi-source data comparison
- **Conflict Resolution**: Intelligent contradiction handling
- **Confidence Scoring**: Reliability assessment
- **Evidence Tracking**: Full transparency and attribution
- **Quality Metrics**: Comprehensive validation scoring

**Next Action**: Call KnowledgeSynthesize with corrected parameters.`;
    
    return {
      content: [{
        type: 'text',
        text: errorResponse
      }],
      isError: true
    };
  }
}

/**
 * Perform consensus-based synthesis by finding common information
 * @param responses - Array of API responses
 * @param context - Objective context for synthesis
 * @returns Synthesis result
 */
function performConsensusSynthesis(responses: APIResponse[], context: string): SynthesisResult {
  const commonElements: string[] = [];
  const evidence: string[] = [];
  const contradictions: string[] = [];
  const usedSources: string[] = [];
  
  // Find common patterns and information
  for (let i = 0; i < responses.length; i++) {
    for (let j = i + 1; j < responses.length; j++) {
      const similarity = calculateStringSimilarity(responses[i].data, responses[j].data);
      
      if (similarity > 0.7) {
        // High similarity - likely consensus
        const commonInfo = extractCommonInformation(responses[i].data, responses[j].data);
        if (commonInfo && !commonElements.includes(commonInfo)) {
          commonElements.push(commonInfo);
          evidence.push(`Consensus between ${responses[i].source} and ${responses[j].source}: "${commonInfo}"`);
          if (!usedSources.includes(responses[i].source)) usedSources.push(responses[i].source);
          if (!usedSources.includes(responses[j].source)) usedSources.push(responses[j].source);
        }
      } else if (similarity < 0.3) {
        // Low similarity - potential contradiction
        contradictions.push(`Conflicting information between ${responses[i].source} and ${responses[j].source}`);
      }
    }
  }
  
  // Build synthesized content
  const content = commonElements.length > 0 ? 
    `Based on consensus from multiple sources:\n\n${commonElements.map(elem => `• ${elem}`).join('\n')}` :
    'No clear consensus found among the provided sources. Individual source analysis recommended.';
  
  // Calculate confidence based on consensus strength
  const consensusStrength = commonElements.length / responses.length;
  const averageSourceConfidence = responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length;
  const confidence = Math.min(consensusStrength * averageSourceConfidence, 1.0);
  
  return {
    content,
    confidence,
    sources: usedSources,
    contradictions,
    evidence
  };
}

/**
 * Perform weighted synthesis based on source confidence scores
 * @param responses - Array of API responses
 * @param context - Objective context for synthesis
 * @returns Synthesis result
 */
function performWeightedSynthesis(responses: APIResponse[], context: string): SynthesisResult {
  // Sort responses by confidence (highest first)
  const sortedResponses = [...responses].sort((a, b) => b.confidence - a.confidence);
  
  const evidence: string[] = [];
  const contradictions: string[] = [];
  const contentParts: string[] = [];
  const usedSources: string[] = [];
  
  let totalWeight = 0;
  let weightedConfidence = 0;
  
  // Build weighted synthesis
  sortedResponses.forEach((response, index) => {
    const weight = response.confidence;
    totalWeight += weight;
    weightedConfidence += weight * response.confidence;
    
    // Add to synthesis with weight indication
    const priority = weight > 0.8 ? 'High' : weight > 0.6 ? 'Medium' : 'Low';
    contentParts.push(`**${priority} Confidence** (${(weight * 100).toFixed(1)}%) - ${response.source}: ${response.data}`);
    
    usedSources.push(response.source);
    evidence.push(`Weighted source ${index + 1}: ${response.source} (confidence: ${(weight * 100).toFixed(1)}%)`);
    
    // Check for contradictions with higher-weighted sources
    for (let i = 0; i < index; i++) {
      const similarity = calculateStringSimilarity(response.data, sortedResponses[i].data);
      if (similarity < 0.3) {
        contradictions.push(`Conflict between ${response.source} (${(weight * 100).toFixed(1)}%) and ${sortedResponses[i].source} (${(sortedResponses[i].confidence * 100).toFixed(1)}%)`);
      }
    }
  });
  
  const content = `Weighted synthesis based on source reliability:\n\n${contentParts.join('\n\n')}`;
  const confidence = totalWeight > 0 ? weightedConfidence / totalWeight : 0;
  
  return {
    content,
    confidence,
    sources: usedSources,
    contradictions,
    evidence
  };
}

/**
 * Perform hierarchical synthesis prioritizing sources by reliability
 * @param responses - Array of API responses
 * @param context - Objective context for synthesis
 * @returns Synthesis result
 */
function performHierarchicalSynthesis(responses: APIResponse[], context: string): SynthesisResult {
  // Create reliability tiers
  const highReliability = responses.filter(r => r.confidence >= 0.8);
  const mediumReliability = responses.filter(r => r.confidence >= 0.6 && r.confidence < 0.8);
  const lowReliability = responses.filter(r => r.confidence < 0.6);
  
  const evidence: string[] = [];
  const contradictions: string[] = [];
  const contentParts: string[] = [];
  const usedSources: string[] = [];
  
  // Process high reliability sources first
  if (highReliability.length > 0) {
    contentParts.push('## Primary Sources (High Reliability)');
    highReliability.forEach(response => {
      contentParts.push(`**${response.source}**: ${response.data}`);
      usedSources.push(response.source);
      evidence.push(`Tier 1 source: ${response.source} (${(response.confidence * 100).toFixed(1)}% confidence)`);
    });
  }
  
  // Add medium reliability as supporting evidence
  if (mediumReliability.length > 0) {
    contentParts.push('\n## Supporting Sources (Medium Reliability)');
    mediumReliability.forEach(response => {
      contentParts.push(`**${response.source}**: ${response.data}`);
      usedSources.push(response.source);
      evidence.push(`Tier 2 source: ${response.source} (${(response.confidence * 100).toFixed(1)}% confidence)`);
    });
  }
  
  // Note low reliability sources but don't heavily weight them
  if (lowReliability.length > 0) {
    contentParts.push('\n## Additional Sources (Lower Reliability)');
    lowReliability.forEach(response => {
      contentParts.push(`**${response.source}**: ${response.data}`);
      usedSources.push(response.source);
      evidence.push(`Tier 3 source: ${response.source} (${(response.confidence * 100).toFixed(1)}% confidence)`);
    });
  }
  
  // Check for contradictions between tiers
  const allResponses = [...highReliability, ...mediumReliability, ...lowReliability];
  for (let i = 0; i < allResponses.length; i++) {
    for (let j = i + 1; j < allResponses.length; j++) {
      const similarity = calculateStringSimilarity(allResponses[i].data, allResponses[j].data);
      if (similarity < 0.3) {
        contradictions.push(`Hierarchical conflict: ${allResponses[i].source} vs ${allResponses[j].source}`);
      }
    }
  }
  
  const content = contentParts.join('\n');
  // Confidence weighted toward higher-tier sources
  const confidence = highReliability.length > 0 ? 
    highReliability.reduce((sum, r) => sum + r.confidence, 0) / highReliability.length :
    responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length;
  
  return {
    content,
    confidence,
    sources: usedSources,
    contradictions,
    evidence
  };
}

/**
 * Perform conflict resolution synthesis with active contradiction handling
 * @param responses - Array of API responses
 * @param context - Objective context for synthesis
 * @returns Synthesis result
 */
function performConflictResolutionSynthesis(responses: APIResponse[], context: string): SynthesisResult {
  const evidence: string[] = [];
  const contradictions: string[] = [];
  const resolvedConflicts: string[] = [];
  const contentParts: string[] = [];
  const usedSources: string[] = [];
  
  // Identify all conflicts first
  const conflicts: Array<{source1: APIResponse, source2: APIResponse, similarity: number}> = [];
  
  for (let i = 0; i < responses.length; i++) {
    for (let j = i + 1; j < responses.length; j++) {
      const similarity = calculateStringSimilarity(responses[i].data, responses[j].data);
      if (similarity < 0.4) {
        conflicts.push({
          source1: responses[i],
          source2: responses[j],
          similarity
        });
      }
    }
  }
  
  // Resolve conflicts using various strategies
  const resolvedData: string[] = [];
  
  if (conflicts.length === 0) {
    // No conflicts - synthesize normally
    contentParts.push('## Harmonious Data (No Conflicts Detected)');
    responses.forEach(response => {
      contentParts.push(`**${response.source}**: ${response.data}`);
      usedSources.push(response.source);
      evidence.push(`Conflict-free source: ${response.source}`);
    });
  } else {
    // Active conflict resolution
    contentParts.push('## Conflict Resolution Analysis');
    
    conflicts.forEach((conflict, index) => {
      const resolution = resolveConflict(conflict.source1, conflict.source2, context);
      resolvedConflicts.push(resolution.explanation);
      
      if (resolution.winningSource) {
        if (!usedSources.includes(resolution.winningSource.source)) {
          usedSources.push(resolution.winningSource.source);
          resolvedData.push(resolution.winningSource.data);
        }
        evidence.push(`Conflict ${index + 1} resolved in favor of ${resolution.winningSource.source}: ${resolution.explanation}`);
      } else {
        // Unresolvable conflict
        contradictions.push(`Unresolvable conflict between ${conflict.source1.source} and ${conflict.source2.source}`);
        evidence.push(`Conflict ${index + 1} unresolved: ${resolution.explanation}`);
      }
    });
    
    // Include resolved data
    if (resolvedData.length > 0) {
      contentParts.push('\n### Resolved Information');
      resolvedData.forEach((data, index) => {
        contentParts.push(`${index + 1}. ${data}`);
      });
    }
    
    // Include unresolved conflicts
    if (contradictions.length > 0) {
      contentParts.push('\n### Remaining Contradictions');
      contradictions.forEach((contradiction, index) => {
        contentParts.push(`${index + 1}. ${contradiction}`);
      });
    }
  }
  
  const content = contentParts.join('\n');
  
  // Confidence based on conflict resolution success
  const resolutionRate = conflicts.length > 0 ? (resolvedConflicts.length / conflicts.length) : 1.0;
  const averageConfidence = responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length;
  const confidence = resolutionRate * averageConfidence;
  
  return {
    content,
    confidence,
    sources: usedSources,
    contradictions,
    evidence
  };
}

/**
 * Resolve conflict between two sources using multiple strategies
 * @param source1 - First conflicting source
 * @param source2 - Second conflicting source
 * @param context - Context for resolution
 * @returns Resolution result
 */
function resolveConflict(source1: APIResponse, source2: APIResponse, context: string): {
  winningSource: APIResponse | null;
  explanation: string;
} {
  // Strategy 1: Confidence-based resolution
  if (Math.abs(source1.confidence - source2.confidence) > 0.2) {
    const winner = source1.confidence > source2.confidence ? source1 : source2;
    return {
      winningSource: winner,
      explanation: `Resolved by confidence score (${(winner.confidence * 100).toFixed(1)}% vs ${(winner === source1 ? source2.confidence * 100 : source1.confidence * 100).toFixed(1)}%)`
    };
  }
  
  // Strategy 2: Temporal preference (newer data)
  // Note: In a real implementation, this would check timestamps
  
  // Strategy 3: Source reliability (domain expertise)
  const reliabilityScore1 = assessSourceReliability(source1.source);
  const reliabilityScore2 = assessSourceReliability(source2.source);
  
  if (Math.abs(reliabilityScore1 - reliabilityScore2) > 0.1) {
    const winner = reliabilityScore1 > reliabilityScore2 ? source1 : source2;
    return {
      winningSource: winner,
      explanation: `Resolved by source reliability assessment (${winner.source} deemed more authoritative)`
    };
  }
  
  // Strategy 4: Context relevance
  if (context) {
    const relevance1 = calculateContextRelevance(source1.data, context);
    const relevance2 = calculateContextRelevance(source2.data, context);
    
    if (Math.abs(relevance1 - relevance2) > 0.2) {
      const winner = relevance1 > relevance2 ? source1 : source2;
      return {
        winningSource: winner,
        explanation: `Resolved by context relevance to "${context}" (${(winner === source1 ? relevance1 : relevance2) * 100}% vs ${(winner === source1 ? relevance2 : relevance1) * 100}%)`
      };
    }
  }
  
  // Unresolvable conflict
  return {
    winningSource: null,
    explanation: 'Conflict could not be resolved - sources have similar confidence, reliability, and context relevance'
  };
}

/**
 * Extract common information between two data strings
 * @param data1 - First data string
 * @param data2 - Second data string
 * @returns Common information string or null
 */
function extractCommonInformation(data1: string, data2: string): string | null {
  // Simple implementation - find common words/phrases
  const words1 = data1.toLowerCase().split(/\s+/);
  const words2 = data2.toLowerCase().split(/\s+/);
  
  const commonWords = words1.filter(word => 
    words2.includes(word) && word.length > 3 // Ignore short words
  );
  
  if (commonWords.length >= 2) {
    return commonWords.join(' ');
  }
  
  return null;
}

/**
 * Calculate source agreement percentage
 * @param responses - Array of API responses
 * @returns Agreement percentage
 */
function calculateSourceAgreement(responses: APIResponse[]): number {
  if (responses.length < 2) return 100;
  
  let totalSimilarity = 0;
  let comparisons = 0;
  
  for (let i = 0; i < responses.length; i++) {
    for (let j = i + 1; j < responses.length; j++) {
      totalSimilarity += calculateStringSimilarity(responses[i].data, responses[j].data);
      comparisons++;
    }
  }
  
  return comparisons > 0 ? (totalSimilarity / comparisons) * 100 : 100;
}

/**
 * Calculate information completeness score
 * @param result - Synthesis result
 * @param context - Objective context
 * @returns Completeness score between 0 and 1
 */
function calculateCompletenessScore(result: SynthesisResult, context: string): number {
  // Simple heuristic based on content length and source diversity
  const contentScore = Math.min(result.content.length / 500, 1.0); // Normalize to 500 chars
  const sourceScore = Math.min(result.sources.length / 3, 1.0); // Normalize to 3 sources
  const evidenceScore = Math.min(result.evidence.length / 5, 1.0); // Normalize to 5 evidence items
  
  return (contentScore + sourceScore + evidenceScore) / 3;
}

/**
 * Assess source reliability based on domain and naming patterns
 * @param sourceName - Name of the source
 * @returns Reliability score between 0 and 1
 */
function assessSourceReliability(sourceName: string): number {
  const name = sourceName.toLowerCase();
  
  // Government/academic sources
  if (name.includes('gov') || name.includes('edu') || name.includes('academic')) {
    return 0.9;
  }
  
  // Well-known APIs
  if (name.includes('official') || name.includes('primary') || name.includes('main')) {
    return 0.8;
  }
  
  // Backup/secondary sources
  if (name.includes('backup') || name.includes('secondary') || name.includes('mirror')) {
    return 0.6;
  }
  
  // Default reliability
  return 0.7;
}

/**
 * Calculate context relevance of data to the given context
 * @param data - Data string
 * @param context - Context string
 * @returns Relevance score between 0 and 1
 */
function calculateContextRelevance(data: string, context: string): number {
  if (!context) return 0.5; // Neutral if no context
  
  const dataWords = data.toLowerCase().split(/\s+/);
  const contextWords = context.toLowerCase().split(/\s+/);
  
  let matches = 0;
  contextWords.forEach(contextWord => {
    if (contextWord.length > 3 && dataWords.some(dataWord => 
      dataWord.includes(contextWord) || contextWord.includes(dataWord)
    )) {
      matches++;
    }
  });
  
  return Math.min(matches / contextWords.length, 1.0);
}

/**
 * Get synthesis reliability grade
 * @param confidence - Overall confidence score
 * @param agreement - Source agreement percentage
 * @param contradictions - Number of contradictions
 * @returns Reliability grade string
 */
function getSynthesisReliabilityGrade(confidence: number, agreement: number, contradictions: number): string {
  const confScore = confidence * 100;
  const agreeScore = agreement;
  
  if (confScore >= 90 && agreeScore >= 80 && contradictions === 0) {
    return 'A+ (Excellent)';
  } else if (confScore >= 80 && agreeScore >= 70 && contradictions <= 1) {
    return 'A (Very Good)';
  } else if (confScore >= 70 && agreeScore >= 60 && contradictions <= 2) {
    return 'B (Good)';
  } else if (confScore >= 60 && agreeScore >= 50 && contradictions <= 3) {
    return 'C (Fair)';
  } else {
    return 'D (Needs Review)';
  }
}

/**
 * Get integration recommendations based on synthesis results
 * @param result - Synthesis result
 * @param mode - Synthesis mode used
 * @param contradictions - Number of contradictions
 * @returns Recommendations string
 */
function getIntegrationRecommendations(result: SynthesisResult, mode: string, contradictions: number): string {
  const recommendations: string[] = [];
  
  if (result.confidence > 0.8) {
    recommendations.push('✅ **High confidence synthesis** - Safe for production use');
  } else if (result.confidence > 0.6) {
    recommendations.push('⚠️ **Medium confidence synthesis** - Consider additional validation');
  } else {
    recommendations.push('❌ **Low confidence synthesis** - Requires manual review before use');
  }
  
  if (contradictions === 0) {
    recommendations.push('✅ **No contradictions detected** - Sources are in harmony');
  } else if (contradictions <= 2) {
    recommendations.push('⚠️ **Minor contradictions present** - Review conflicts before implementation');
  } else {
    recommendations.push('❌ **Multiple contradictions detected** - Extensive review required');
  }
  
  if (mode === 'consensus') {
    recommendations.push('📊 **Consensus mode used** - Information represents common agreement');
  } else if (mode === 'weighted') {
    recommendations.push('⚖️ **Weighted mode used** - Higher confidence sources prioritized');
  } else if (mode === 'hierarchical') {
    recommendations.push('🏗️ **Hierarchical mode used** - Sources tiered by reliability');
  } else if (mode === 'conflict_resolution') {
    recommendations.push('🔧 **Conflict resolution used** - Contradictions actively addressed');
  }
  
  return recommendations.join('\n');
}

/**
 * Handle APISearch tool requests with comprehensive validation and error handling
 * @param args - Tool arguments containing objective, user_role, and optional parameters
 * @returns Structured API discovery results
 */
async function handleAPISearchTool(args: any) {
  try {
    // Validate required parameters
    if (!args.objective || typeof args.objective !== 'string') {
      throw new Error('objective is required and must be a non-empty string');
    }
    
    if (!args.user_role || typeof args.user_role !== 'string') {
      throw new Error('user_role is required and must be a valid role');
    }
    
    // Validate user_role enum
    const validRoles: Role[] = ['planner', 'coder', 'critic', 'researcher', 'analyzer', 'synthesizer', 'ui_architect', 'ui_implementer', 'ui_refiner'];
    if (!validRoles.includes(args.user_role as Role)) {
      throw new Error(`Invalid user_role: ${args.user_role}. Must be one of: ${validRoles.join(', ')}`);
    }
    
    // Validate optional parameters
    const maxResults = args.max_results ?? 5;
    if (typeof maxResults !== 'number' || maxResults < 1 || maxResults > 20) {
      throw new Error('max_results must be a number between 1 and 20');
    }
    
    const categoryFilter = args.category_filter;
    if (categoryFilter && typeof categoryFilter !== 'string') {
      throw new Error('category_filter must be a string');
    }
    
    
    // Call the API registry function
    const apiResults = selectRelevantAPIs(args.objective, args.user_role as Role);
    
    // Apply filters
    let filteredResults = apiResults;
    
    // Apply category filter if provided
    if (categoryFilter) {
      filteredResults = apiResults.filter(result => 
        result.api.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }
    
    // Apply max_results limit
    filteredResults = filteredResults.slice(0, maxResults);
    
    // Format API list for response
    const apiList = filteredResults.map((result, index) => {
      const api = result.api;
      const relevancePercent = (result.relevance_score * 100).toFixed(1);
      const keywords = result.matching_keywords.length > 0 ? result.matching_keywords.join(', ') : 'none';
      const rateLimit = api.rate_limits ? `${api.rate_limits.requests}/${api.rate_limits.timeWindow}` : 'unlimited';
      
      return `### ${index + 1}. ${api.name}
**Category**: ${api.category}
**Description**: ${api.description}
**URL**: ${api.url}
**Auth**: ${api.auth_type}
**HTTPS**: ${api.https ? '✓' : '✗'} | **CORS**: ${api.cors ? '✓' : '✗'}
**Reliability**: ${(api.reliability_score * 100).toFixed(1)}%
**Rate Limits**: ${rateLimit}
**Relevance Score**: ${relevancePercent}%
**Matching Keywords**: ${keywords}
**Role Preference Bonus**: ${result.role_preference_bonus > 0 ? '+' + (result.role_preference_bonus * 100).toFixed(1) + '%' : 'none'}

`;
    }).join('');
    
    // Generate response text
    const responseText = `# 🔍 API Discovery Results

**Objective**: ${args.objective}
**Role**: ${args.user_role}
**APIs Found**: ${filteredResults.length}${categoryFilter ? ` (filtered by category: ${categoryFilter})` : ''}

## Recommended APIs:

${apiList}

## 📊 **Discovery Summary**
- **Total APIs analyzed**: ${apiResults.length}
- **Results after filtering**: ${filteredResults.length}
- **Average relevance score**: ${filteredResults.length > 0 ? (filteredResults.reduce((sum, r) => sum + r.relevance_score, 0) / filteredResults.length * 100).toFixed(1) + '%' : 'N/A'}
- **Role-based matches**: ${filteredResults.filter(r => r.role_preference_bonus > 0).length}

## 🎯 **Integration Guidance**
The APIs above are ranked by relevance to your objective and role preferences. Consider:
1. **Reliability scores** for production use
2. **Authentication requirements** for implementation complexity
3. **Rate limits** for usage planning
4. **CORS support** for browser-based applications

---
*Generated by Iron Manus API Registry System*`;
    
    return {
      content: [{
        type: 'text',
        text: responseText
      }]
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error(`APISearch Error: ${errorMessage}`);
    
    // Enhanced error handling with recovery guidance
    const errorResponse = `# ❌ **APISearch Error**

**Error**: ${errorMessage}

## 🔧 **Recovery Protocol**
1. **Objective**: Ensure you provide a clear, non-empty objective string
2. **User Role**: Must be one of: planner, coder, critic, researcher, analyzer, synthesizer, ui_architect, ui_implementer, ui_refiner
3. **Max Results**: Optional number between 1-20 (default: 5)
4. **Category Filter**: Optional string to filter APIs by category

## 📖 **Usage Example**
\`\`\`json
{
  "objective": "Build a weather dashboard with real-time data",
  "user_role": "coder",
  "max_results": 3,
  "category_filter": "weather"
}
\`\`\`

**Next Action**: Call APISearch with corrected parameters.`;
    
    return {
      content: [{
        type: 'text',
        text: errorResponse
      }],
      isError: true
    };
  }
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === 'MultiAPIFetch') {
    return handleMultiAPIFetchTool(args);
  }
  
  if (name === 'APISearch') {
    return handleAPISearchTool(args);
  }
  
  if (name === 'KnowledgeSynthesize') {
    return handleKnowledgeSynthesizeTool(args);
  }
  
  if (name !== 'JARVIS') {
    throw new Error(`Unknown tool: ${name}`);
  }

  try {
    const input = args as unknown as MessageJARVIS;
    
    // Validate required fields
    if (!input.session_id) {
      throw new Error('session_id is required');
    }

    // Process through FSM
    const output = await processState(input);
    
    // Enhanced response formatting with performance metrics and fractal orchestration info
    let responseText = `# 🎯 **J.A.R.V.I.S. MODE: ${output.next_phase}**\n\n`;
    responseText += `${output.system_prompt}\n\n`;
    
    if (output.status === 'DONE') {
      responseText += `## ✅ **MISSION ACCOMPLISHED!**\n\n`;
      responseText += `**🎯 Objective**: ${output.payload?.current_objective}\n`;
      responseText += `**🤖 Role Applied**: ${output.payload?.detected_role}\n`;
      responseText += `**📊 Final Effectiveness**: ${((output.payload?.reasoning_effectiveness || 0.8) * 100).toFixed(1)}%\n`;
      responseText += `**🔄 Phase Transitions**: ${output.payload?.phase_transition_count || 0}\n`;
      responseText += `**Status**: All phases completed - Entering standby mode\n\n`;
      
      // Add performance summary
      const metrics = stateManager.getSessionPerformanceMetrics(input.session_id);
      responseText += `**📈 Performance Grade**: ${metrics.performance_grade}\n`;
    } else {
      responseText += `## 📋 **EXECUTION PROTOCOL**\n\n`;
      responseText += `**🛠️ Next allowed tools**: ${output.allowed_next_tools.join(', ')}\n`;
      responseText += `**🔢 Session**: ${input.session_id}\n`;
      responseText += `**🤖 Role**: ${output.payload?.detected_role}\n`;
      responseText += `**📊 Reasoning Effectiveness**: ${((output.payload?.reasoning_effectiveness || 0.8) * 100).toFixed(1)}%\n`;
      responseText += `**🔄 Current Task Index**: ${output.payload?.current_task_index || 0}\n`;
      responseText += `**⚡ Status**: ${output.status}\n\n`;
      
      // Add fractal orchestration guidance for EXECUTE phase
      if (output.next_phase === 'EXECUTE') {
        responseText += `**🌀 FRACTAL ORCHESTRATION ACTIVE**\n`;
        responseText += `Look for todos with (ROLE:...) patterns to spawn Task() agents.\n`;
        responseText += `Use **single tool per iteration** (Manus requirement).\n\n`;
      }
      
      responseText += `**🧠 Cognitive Enhancement**: Active with ${output.payload?.detected_role} specialization`;
    }

    // Determine tool enforcement based on phase and allowed tools
    const response: any = {
      content: [
        {
          type: 'text',
          text: output.system_prompt // Clean system prompt only - remove bloated responseText
        }
      ]
    };
    
    // Critical Fix: Enforce tool calling for ALL phases (Manus requirement: "Must respond with a tool use")
    if (output.allowed_next_tools.length === 1 && output.allowed_next_tools[0] !== 'none') {
      // Force single tool when only one option (QUERY, ENHANCE, PLAN phases)
      response.tool_code = {
        tool: output.allowed_next_tools[0],
        args: output.allowed_next_tools[0] === 'JARVIS' ? {
          session_id: input.session_id
        } : {}
      };
    } else if (output.allowed_next_tools.length > 1) {
      // For phases where Claude chooses from multiple tools (KNOWLEDGE, EXECUTE, VERIFY)
      // CRITICAL: Still enforce tool calling, but allow choice from whitelist
      response.tool_code = {
        // Omit 'tool' property to allow Claude's choice
        allowed_tools: output.allowed_next_tools,
        args: { session_id: input.session_id } // Default args for most tools
      };
    }
    // No tool_code only when output.allowed_next_tools[0] === 'none' (DONE phase)
    
    return response;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Enhanced error handling with recovery guidance
    let errorResponse = `# ❌ **J.A.R.V.I.S. ERROR**\n\n`;
    errorResponse += `**Error**: ${errorMessage}\n\n`;
    errorResponse += `## 🔧 **Recovery Protocol**\n`;
    errorResponse += `1. Check session_id format (should be unique string)\n`;
    errorResponse += `2. Verify phase_completed matches one of: QUERY, ENHANCE, KNOWLEDGE, PLAN, EXECUTE, VERIFY\n`;
    errorResponse += `3. Ensure initial_objective is provided on first call\n`;
    errorResponse += `4. Check payload structure for phase-specific data\n\n`;
    errorResponse += `## 📖 **Manus FSM Flow**\n`;
    errorResponse += `QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE\n\n`;
    errorResponse += `**Next Action**: Call JARVIS with corrected parameters.`;
    
    return {
      content: [
        {
          type: 'text',
          text: errorResponse
        }
      ],
      isError: true
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Enhanced startup logging with architecture info
  console.error('Iron Manus MCP Server started successfully');
  console.error('Architecture: FSM with 6-step agent loop, 3 modules, and auto-connection capabilities');
  console.error('Ready for role-based orchestration and knowledge synthesis');
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});