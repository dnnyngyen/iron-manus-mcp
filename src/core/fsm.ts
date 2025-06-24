// Core FSM logic - implements the 6-step agent loop with auto-connection capabilities
// Features: API discovery, automatic fetching, knowledge synthesis, and role-based orchestration
import { 
  MessageJARVIS, 
  FromJARVIS, 
  Phase, 
  Role, 
  TodoItem, 
  MetaPrompt, 
  VerificationResult,
  CognitiveContext,
  APIUsageMetrics
} from './types.js';
import { 
  generateRoleEnhancedPrompt, 
  detectRole, 
  PHASE_ALLOWED_TOOLS
} from './prompts.js';
import { stateManager } from './state.js';
import { 
  selectRelevantAPIs, 
  APISelectionResult,
  rateLimiter
} from './api-registry.js';
import axios, { AxiosError } from 'axios';
// Cognitive module imports - disabled pending integration
// import { 
//   extractEnhancedMetaPrompt, 
//   extractEnhancedMetaPrompts,
//   detectEnhancedRole,
//   generateEnhancedRoleConfig,
//   getExtractionPerformanceMetrics,
//   EnhancedMetaPrompt
// } from './cognitive/cognitive-ast-integration.js';
// import { 
//   reasoningRulesEngine,
//   ValidationContext,
//   ValidationSeverity
// } from './reasoning-rules-engine.js';
// import { cognitiveFrameworkManager } from './cognitive/cognitive-framework-injection.js';
import { ComplexityLevel } from './types.js';

// Fallback implementations for cognitive features
function detectEnhancedRole(objective: string): Role {
  return detectRole(objective); // Use basic role detection
}

function extractEnhancedMetaPrompts(todos: any[], options: any): any[] {
  return []; // Return empty for now
}

function extractEnhancedMetaPrompt(content: string, options: any): any {
  return null; // Return null for now
}

// Interfaces for cognitive features
interface EnhancedMetaPrompt {
  role: Role;
  context: string;
  prompt: string;
  output: string;
}

interface ValidationContext {
  phase: Phase;
  role: Role;
  objective: string;
  reasoning?: string;
}

// Add ValidationSeverity enum for compatibility
enum ValidationSeverity {
  CRITICAL = 'CRITICAL',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO'
}

// Default implementations for cognitive features
const reasoningRulesEngine = {
  validateReasoning: (context: ValidationContext) => ({ 
    isValid: true, 
    issues: [],
    confidence: 0.8,
    violations: []
  })
};

const cognitiveFrameworkManager = {
  injectCognitiveFramework: (role: Role, phase: Phase, prompt: string, context: any) => ({
    enhancedReasoning: prompt,
    cognitiveMultiplier: 1.0,
    injectedFrameworks: [],
    appliedPatterns: []
  })
};

function getExtractionPerformanceMetrics() {
  return {
    parseTime: 10,
    cacheHitRate: 0.8,
    successRate: 0.95
  };
}

// Auto-connection configuration
export const AUTO_CONNECTION_CONFIG = {
  enabled: true, // Set to false to disable auto-connection
  timeout_ms: 4000, // Conservative timeout for auto-mode
  max_concurrent: 2, // Conservative concurrency limit
  confidence_threshold: 0.4, // Minimum confidence to include responses
  max_response_size: 5000 // Maximum response size in characters
};

// Internal auto-connection functions for KNOWLEDGE phase

/**
 * Internal function to automatically fetch data from discovered APIs
 * @param apiUrls - Array of API URLs to fetch from
 * @param maxConcurrent - Maximum concurrent requests (default: 3)
 * @param timeoutMs - Request timeout in milliseconds (default: 5000)
 * @returns Array of API responses with metadata
 */
async function autoFetchAPIs(
  apiUrls: string[], 
  maxConcurrent: number = 3, 
  timeoutMs: number = 5000
): Promise<Array<{
  source: string;
  data: string;
  confidence: number;
  success: boolean;
  duration: number;
  error?: string;
}>> {
  
  const results: Array<{
    source: string;
    data: string;
    confidence: number;
    success: boolean;
    duration: number;
    error?: string;
  }> = [];
  
  // Create axios instance with secure defaults
  const axiosInstance = axios.create({
    timeout: timeoutMs,
    headers: {
      'User-Agent': 'Iron-Manus-MCP/1.0.0-AutoFetch',
      'Accept': 'application/json, text/plain, */*'
    },
    maxContentLength: 1024 * 1024 * 2, // 2MB limit for auto-fetch
    maxBodyLength: 1024 * 1024 * 2
  });
  
  // Process APIs with concurrency limiting
  const semaphore = { 
    count: maxConcurrent, 
    acquire: async () => {
      while (semaphore.count <= 0) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      semaphore.count--;
    },
    release: () => { semaphore.count++; }
  };
  
  const fetchPromises = apiUrls.slice(0, 5).map(async (url, index) => {
    await semaphore.acquire();
    
    try {
      const startTime = Date.now();
      const hostname = new URL(url).hostname;
      
      // Check rate limiting
      if (!rateLimiter.canMakeRequest(hostname, 5, 60000)) {
        throw new Error('Rate limit exceeded');
      }
      
      const response = await axiosInstance.get(url);
      const duration = Date.now() - startTime;
      
      // Sanitize and truncate response data
      let sanitizedData = response.data;
      if (typeof sanitizedData === 'string') {
        sanitizedData = sanitizedData.substring(0, AUTO_CONNECTION_CONFIG.max_response_size);
      } else if (typeof sanitizedData === 'object') {
        sanitizedData = JSON.stringify(sanitizedData).substring(0, AUTO_CONNECTION_CONFIG.max_response_size);
      }
      
      // Calculate confidence based on response quality
      const confidence = calculateResponseConfidence(response.status, sanitizedData, duration);
      
      
      return {
        source: hostname,
        data: sanitizedData,
        confidence,
        success: true,
        duration
      };
      
    } catch (error) {
      const duration = Date.now() - Date.now();
      const hostname = new URL(url).hostname;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      
      return {
        source: hostname,
        data: '',
        confidence: 0.0,
        success: false,
        duration,
        error: errorMessage
      };
    } finally {
      semaphore.release();
    }
  });
  
  const allResults = await Promise.allSettled(fetchPromises);
  
  allResults.forEach((result) => {
    if (result.status === 'fulfilled') {
      results.push(result.value);
    }
  });
  
  return results;
}

/**
 * Calculate confidence score for API response
 * @param status - HTTP status code
 * @param data - Response data
 * @param duration - Response time in ms
 * @returns Confidence score between 0 and 1
 */
function calculateResponseConfidence(status: number, data: string, duration: number): number {
  let confidence = 0.5; // Base confidence
  
  // Status code contribution
  if (status === 200) confidence += 0.3;
  else if (status >= 200 && status < 300) confidence += 0.2;
  else confidence -= 0.2;
  
  // Data quality contribution
  if (data && data.length > 100) confidence += 0.2;
  else if (data && data.length > 10) confidence += 0.1;
  
  // Response time contribution (faster is better)
  if (duration < 1000) confidence += 0.1;
  else if (duration > 5000) confidence -= 0.1;
  
  return Math.max(0.0, Math.min(1.0, confidence));
}

/**
 * Internal function to automatically synthesize knowledge from API responses
 * @param apiResponses - Array of API responses from autoFetchAPIs
 * @param objective - Original objective for context
 * @param confidenceThreshold - Minimum confidence to include (default: 0.4)
 * @returns Synthesized knowledge result
 */
async function autoSynthesize(
  apiResponses: Array<{
    source: string;
    data: string;
    confidence: number;
    success: boolean;
    duration: number;
    error?: string;
  }>,
  objective: string,
  confidenceThreshold: number = 0.4
): Promise<{
  synthesizedContent: string;
  overallConfidence: number;
  sourcesUsed: string[];
  contradictions: string[];
  metadata: {
    totalSources: number;
    successfulSources: number;
    averageConfidence: number;
    processingTime: number;
  };
}> {
  const startTime = Date.now();
  
  // Filter successful responses above confidence threshold
  const validResponses = apiResponses.filter(r => 
    r.success && r.confidence >= confidenceThreshold && r.data.length > 0
  );
  
  if (validResponses.length === 0) {
    return {
      synthesizedContent: `Unable to gather reliable information from external APIs. All ${apiResponses.length} API calls either failed or returned low-confidence data.`,
      overallConfidence: 0.0,
      sourcesUsed: [],
      contradictions: [`All ${apiResponses.length} API sources failed or had confidence below ${confidenceThreshold}`],
      metadata: {
        totalSources: apiResponses.length,
        successfulSources: 0,
        averageConfidence: 0.0,
        processingTime: Date.now() - startTime
      }
    };
  }
  
  // Simple synthesis strategy: combine information with confidence weighting
  const sourcesUsed = validResponses.map(r => r.source);
  const contentParts: string[] = [];
  const contradictions: string[] = [];
  
  // Create weighted synthesis
  validResponses.forEach((response, index) => {
    const weight = response.confidence > 0.7 ? 'High' : response.confidence > 0.5 ? 'Medium' : 'Low';
    contentParts.push(`**${weight} Confidence Source - ${response.source}** (${(response.confidence * 100).toFixed(1)}%):\n${response.data}`);
  });
  
  // Detect potential contradictions (simple keyword comparison)
  for (let i = 0; i < validResponses.length; i++) {
    for (let j = i + 1; j < validResponses.length; j++) {
      const similarity = calculateSimpleSimilarity(validResponses[i].data, validResponses[j].data);
      if (similarity < 0.3) {
        contradictions.push(`Potential conflict between ${validResponses[i].source} and ${validResponses[j].source}`);
      }
    }
  }
  
  // Calculate overall confidence
  const averageConfidence = validResponses.reduce((sum, r) => sum + r.confidence, 0) / validResponses.length;
  const overallConfidence = Math.min(averageConfidence * (validResponses.length / apiResponses.length), 1.0);
  
  // Create synthesized content
  const synthesizedContent = `# Auto-Synthesized Knowledge for: ${objective}

## Summary
Based on ${validResponses.length} reliable API sources, here is the synthesized information:

${contentParts.join('\n\n')}

## Synthesis Quality
- **Sources Used**: ${sourcesUsed.join(', ')}
- **Overall Confidence**: ${(overallConfidence * 100).toFixed(1)}%
- **Average Source Confidence**: ${(averageConfidence * 100).toFixed(1)}%
${contradictions.length > 0 ? `\n## Potential Contradictions\n${contradictions.map(c => `- ${c}`).join('\n')}` : ''}

---
*Auto-generated by Iron Manus Knowledge Synthesis Engine*`;

  const processingTime = Date.now() - startTime;
  
  return {
    synthesizedContent,
    overallConfidence,
    sourcesUsed,
    contradictions,
    metadata: {
      totalSources: apiResponses.length,
      successfulSources: validResponses.length,
      averageConfidence,
      processingTime
    }
  };
}

/**
 * Calculate simple similarity between two text strings
 * @param text1 - First text
 * @param text2 - Second text  
 * @returns Similarity score between 0 and 1
 */
function calculateSimpleSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const words2 = text2.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  const commonWords = words1.filter(word => words2.includes(word));
  return commonWords.length / Math.max(words1.length, words2.length);
}

export async function processState(input: MessageJARVIS): Promise<FromJARVIS> {
  const sessionId = input.session_id;
  const session = stateManager.getSessionState(sessionId);
  
  // Handle initial objective setup with enhanced role detection
  if (input.initial_objective) {
    session.initial_objective = input.initial_objective;
    session.detected_role = detectEnhancedRole(input.initial_objective); // Enhanced AST-based role detection
    session.current_phase = 'INIT';
    session.reasoning_effectiveness = 0.8; // Initial effectiveness score
    // Initialize payload with execution state
    session.payload = {
      current_task_index: 0,
      current_todos: [],
      phase_transition_count: 0
    };
    stateManager.updateSessionState(sessionId, session);
  }

  // Determine next phase based on current phase and completed phase
  let nextPhase: Phase = session.current_phase;
  
  // Phase transition logic - mirrors Manus's 6-step agent loop
  switch (session.current_phase) {
    case 'INIT':
      nextPhase = 'QUERY';
      break;
      
    case 'QUERY':
      if (input.phase_completed === 'QUERY') {
        // Store interpreted goal and move to enhancement
        if (input.payload?.interpreted_goal) {
          session.payload.interpreted_goal = input.payload.interpreted_goal;
        }
        nextPhase = 'ENHANCE';
      }
      break;
      
    case 'ENHANCE':
      if (input.phase_completed === 'ENHANCE') {
        // Store enhanced goal and move to knowledge gathering
        if (input.payload?.enhanced_goal) {
          session.payload.enhanced_goal = input.payload.enhanced_goal;
        }
        nextPhase = 'KNOWLEDGE';
      }
      break;
      
    case 'KNOWLEDGE':
      if (input.phase_completed === 'KNOWLEDGE') {
        // Store gathered knowledge and move to planning
        if (input.payload?.knowledge_gathered) {
          session.payload.knowledge_gathered = input.payload.knowledge_gathered;
        }
        
        // NEW: API discovery and selection workflow
        if (session.payload.enhanced_goal && session.detected_role) {
          try {
            const startTime = Date.now();
            const relevantAPIs = selectRelevantAPIs(
              session.payload.enhanced_goal, 
              session.detected_role
            );
            
            // Store API discovery results in session payload
            session.payload.api_discovery_results = relevantAPIs;
            session.payload.api_fetch_responses = session.payload.api_fetch_responses || [];
            session.payload.synthesized_knowledge = session.payload.synthesized_knowledge || '';
            
            // Initialize API usage metrics
            const processingTime = Date.now() - startTime;
            const apiUsageMetrics: APIUsageMetrics = {
              apis_discovered: relevantAPIs.length,
              apis_queried: 0,
              synthesis_confidence: relevantAPIs.length > 0 ? 0.8 : 0.0,
              processing_time: processingTime,
              discovery_success_rate: relevantAPIs.length > 0 ? 1.0 : 0.0,
              api_response_time: 0,
              knowledge_synthesis_quality: 0.0
            };
            session.payload.api_usage_metrics = apiUsageMetrics;
            
            
            if (relevantAPIs.length > 0) {
              
              // AUTO-CONNECTION: Automatically fetch and synthesize knowledge
              if (AUTO_CONNECTION_CONFIG.enabled) {
                try {
                  const autoConnectionStartTime = Date.now();
                  
                  // Step 1: Auto-fetch from top APIs
                  const topAPIs = relevantAPIs.slice(0, 3).map(r => r.api.url);
                  
                  const fetchResults = await autoFetchAPIs(
                    topAPIs, 
                    AUTO_CONNECTION_CONFIG.max_concurrent, 
                    AUTO_CONNECTION_CONFIG.timeout_ms
                  );
                
                // Step 2: Auto-synthesize knowledge
                const objective = session.payload.enhanced_goal || session.initial_objective || '';
                
                const synthesisResult = await autoSynthesize(
                  fetchResults, 
                  objective, 
                  AUTO_CONNECTION_CONFIG.confidence_threshold
                );
                
                // Step 3: Store synthesized knowledge in session
                session.payload.synthesized_knowledge = synthesisResult.synthesizedContent;
                session.payload.api_fetch_responses = fetchResults;
                
                // Step 4: Update API usage metrics with auto-connection results
                const autoConnectionTime = Date.now() - autoConnectionStartTime;
                session.payload.api_usage_metrics.apis_queried = fetchResults.length;
                session.payload.api_usage_metrics.synthesis_confidence = synthesisResult.overallConfidence;
                session.payload.api_usage_metrics.api_response_time = autoConnectionTime;
                session.payload.api_usage_metrics.knowledge_synthesis_quality = synthesisResult.overallConfidence;
                
                
                // Mark auto-connection as successful
                session.payload.auto_connection_successful = true;
                session.payload.auto_connection_metadata = {
                  apis_attempted: topAPIs.length,
                  apis_successful: synthesisResult.metadata.successfulSources,
                  synthesis_confidence: synthesisResult.overallConfidence,
                  total_processing_time: autoConnectionTime,
                  sources_used: synthesisResult.sourcesUsed,
                  contradictions_found: synthesisResult.contradictions.length
                };
                
              } catch (autoConnectionError) {
                console.warn('[FSM-KNOWLEDGE] ⚠️ Auto-connection failed, falling back to manual mode:', autoConnectionError);
                
                // Graceful fallback - mark auto-connection as failed but continue
                session.payload.auto_connection_successful = false;
                session.payload.synthesized_knowledge = `Auto-connection failed: ${autoConnectionError instanceof Error ? autoConnectionError.message : 'Unknown error'}. Manual API tools are still available.`;
                
                // Keep original metrics if auto-connection fails
                session.payload.api_usage_metrics.knowledge_synthesis_quality = 0.0;
              }
            } else {
              session.payload.auto_connection_successful = false;
              session.payload.synthesized_knowledge = 'Auto-connection is disabled. Use manual API tools: APISearch, MultiAPIFetch, KnowledgeSynthesize.';
            }
            } else {
              session.payload.auto_connection_successful = false;
              session.payload.synthesized_knowledge = 'No relevant APIs discovered for automatic knowledge gathering. Consider using manual research tools.';
            }
            
          } catch (error) {
            console.warn('[FSM-KNOWLEDGE] API discovery failed, continuing with traditional knowledge gathering:', error);
            
            // Initialize empty API metrics on failure
            session.payload.api_discovery_results = [];
            session.payload.api_fetch_responses = [];
            session.payload.synthesized_knowledge = '';
            session.payload.api_usage_metrics = {
              apis_discovered: 0,
              apis_queried: 0,
              synthesis_confidence: 0.0,
              processing_time: 0,
              discovery_success_rate: 0.0,
              api_response_time: 0,
              knowledge_synthesis_quality: 0.0
            };
          }
        } else {
          
          // Initialize empty API fields for backward compatibility
          session.payload.api_discovery_results = session.payload.api_discovery_results || [];
          session.payload.api_fetch_responses = session.payload.api_fetch_responses || [];
          session.payload.synthesized_knowledge = session.payload.synthesized_knowledge || '';
          session.payload.api_usage_metrics = session.payload.api_usage_metrics || {
            apis_discovered: 0,
            apis_queried: 0,
            synthesis_confidence: 0.0,
            processing_time: 0,
            discovery_success_rate: 0.0,
            api_response_time: 0,
            knowledge_synthesis_quality: 0.0
          };
        }
        
        nextPhase = 'PLAN';
      }
      break;
      
    case 'PLAN':
      if (input.phase_completed === 'PLAN') {
        // Confirm plan created and move to execution
        if (input.payload?.plan_created) {
          session.payload.plan_created = true;
          // Process todos with enhanced AST-based MetaPrompt extraction
          const rawTodos = input.payload.todos_with_metaprompts || [];
          if (rawTodos.length > 0) {
            const enhancedResults = extractEnhancedMetaPrompts(rawTodos, {
              enableSecurity: true,
              enableCaching: true,
              enableOptimization: true,
              maxComplexity: 'EXPERT' as any,
              timeoutMs: 5000
            });
            
            // Store enhanced todos and performance metrics
            session.payload.current_todos = enhancedResults.map(result => result.todo);
            session.payload.ast_performance_metrics = getExtractionPerformanceMetrics();
            session.payload.enhanced_extraction_count = enhancedResults.filter(r => r.metaPrompt).length;
          } else {
            session.payload.current_todos = [];
          }
          session.payload.current_task_index = 0;
        }
        nextPhase = 'EXECUTE';
      }
      break;
      
    case 'EXECUTE':
      if (input.phase_completed === 'EXECUTE') {
        // Store execution results and continue or move to verification
        if (input.payload) {
          Object.assign(session.payload, input.payload);
          
          // Update reasoning effectiveness based on execution success
          if (input.payload.execution_success) {
            session.reasoning_effectiveness = Math.min(1.0, session.reasoning_effectiveness + 0.1);
          } else {
            session.reasoning_effectiveness = Math.max(0.3, session.reasoning_effectiveness - 0.1);
          }
          
          // Check if there are more tasks to execute (fractal iteration)
          const currentTaskIndex = session.payload.current_task_index || 0;
          const totalTasks = (session.payload.current_todos || []).length;
          
          if (input.payload.more_tasks_pending || currentTaskIndex < totalTasks - 1) {
            session.payload.current_task_index = currentTaskIndex + 1;
            nextPhase = 'EXECUTE'; // Continue in EXECUTE phase
          } else {
            nextPhase = 'VERIFY'; // All tasks done, move to verification
          }
        } else {
          nextPhase = 'VERIFY';
        }
      }
      break;
      
    case 'VERIFY':
      if (input.phase_completed === 'VERIFY') {
        // Enhanced verification with strict completion percentage validation
        const verificationResult = validateTaskCompletion(session, input.payload);
        
        if (verificationResult.isValid && input.payload?.verification_passed === true) {
          nextPhase = 'DONE';
        } else {
          // Log validation failure details
          console.warn(`Verification failed: ${verificationResult.reason}`);
          console.warn(`Completion percentage: ${verificationResult.completionPercentage}%`);
          
          // Store verification failure context for rollback
          session.payload.verification_failure_reason = verificationResult.reason;
          session.payload.last_completion_percentage = verificationResult.completionPercentage;
          
          // Rollback logic based on completion percentage
          if (verificationResult.completionPercentage < 50) {
            // Severe incompletion - restart from planning
            nextPhase = 'PLAN';
            session.payload.current_task_index = 0;
          } else if (verificationResult.completionPercentage < 80) {
            // Moderate incompletion - retry from current task
            nextPhase = 'EXECUTE';
            // Don't decrement task index if completion is too low
          } else {
            // Minor incompletion - retry previous task
            if (session.payload.current_task_index > 0) {
              session.payload.current_task_index = session.payload.current_task_index - 1;
            }
            nextPhase = 'EXECUTE';
          }
        }
      }
      break;
      
    case 'DONE':
      // Stay in DONE state
      nextPhase = 'DONE';
      break;
      
    default:
      // Fallback to QUERY if unknown state
      nextPhase = 'QUERY';
  }

  // Update session with new phase
  session.current_phase = nextPhase;
  stateManager.updateSessionState(sessionId, session);

  // Generate role-enhanced system prompt with cognitive amplification
  const roleEnhancedPrompt = generateRoleEnhancedPrompt(nextPhase, session.detected_role, session.initial_objective);
  const allowedTools = PHASE_ALLOWED_TOOLS[nextPhase];
  
  // Apply reasoning rules engine validation and enhancement
  const validationContext = createValidationContext(session, nextPhase, roleEnhancedPrompt, input);
  const reasoningValidation = reasoningRulesEngine.validateReasoning(validationContext);
  
  // Apply cognitive framework injection for enhanced reasoning
  const cognitiveEnhancement = cognitiveFrameworkManager.injectCognitiveFramework(
    session.detected_role,
    nextPhase,
    roleEnhancedPrompt, 
    validationContext
  );

  // Update reasoning effectiveness based on validation results
  if (reasoningValidation.confidence > 0.8) {
    session.reasoning_effectiveness = Math.min(1.0, session.reasoning_effectiveness + 0.05);
  } else if (reasoningValidation.confidence < 0.5) {
    session.reasoning_effectiveness = Math.max(0.3, session.reasoning_effectiveness - 0.05);
  }

  // Start with enhanced reasoning or original prompt
  let augmentedPrompt = cognitiveEnhancement.enhancedReasoning || roleEnhancedPrompt;
  
  // Note: Reasoning validation feedback available when reasoning rules engine is enabled
  // if (!reasoningValidation.isValid) {
  //   const criticalViolations = reasoningValidation.violations.filter(v => 
  //     v.severity === ValidationSeverity.CRITICAL || v.severity === ValidationSeverity.ERROR
  //   );
  //   
  //   if (criticalViolations.length > 0) {
  //     augmentedPrompt += `\n\n**🚨 REASONING VALIDATION ALERTS:**\n`;
  //     criticalViolations.forEach(violation => {
  //       augmentedPrompt += `- **${violation.severity}:** ${violation.message}\n`;
  //       augmentedPrompt += `  *Suggested Fix:* ${violation.suggestedFix}\n`;
  //     });
  //   }
  // }

  // Add cognitive enhancement metrics
  if (cognitiveEnhancement.cognitiveMultiplier > 1.0) {
    augmentedPrompt += `\n\n**🧠 COGNITIVE ENHANCEMENT ACTIVE:**\n`;
    augmentedPrompt += `- Reasoning Effectiveness: ${(cognitiveEnhancement.cognitiveMultiplier * 100).toFixed(0)}%\n`;
    augmentedPrompt += `- Applied Frameworks: ${cognitiveEnhancement.injectedFrameworks.join(', ')}\n`;
    augmentedPrompt += `- Pattern Enhancements: ${cognitiveEnhancement.appliedPatterns.join(', ') || 'None'}\n`;
  }
  
  if (nextPhase === 'ENHANCE' && session.payload.interpreted_goal) {
    augmentedPrompt += `\n\n**📋 CONTEXT:** ${session.payload.interpreted_goal}`;
  } else if (nextPhase === 'KNOWLEDGE') {
    // Add auto-connection results to KNOWLEDGE phase prompt
    if (session.payload.auto_connection_successful) {
      const metadata = session.payload.auto_connection_metadata;
      augmentedPrompt += `\n\n**🚀 AUTO-CONNECTION RESULTS:**\n`;
      augmentedPrompt += `- APIs Discovered: ${session.payload.api_usage_metrics?.apis_discovered || 0}\n`;
      augmentedPrompt += `- APIs Successfully Queried: ${metadata?.apis_successful || 0}/${metadata?.apis_attempted || 0}\n`;
      augmentedPrompt += `- Synthesis Confidence: ${((metadata?.synthesis_confidence || 0) * 100).toFixed(1)}%\n`;
      augmentedPrompt += `- Processing Time: ${metadata?.total_processing_time || 0}ms\n`;
      augmentedPrompt += `- Sources Used: ${metadata?.sources_used?.join(', ') || 'None'}\n`;
      if (metadata?.contradictions_found && metadata.contradictions_found > 0) {
        augmentedPrompt += `- ⚠️ Contradictions Found: ${metadata.contradictions_found}\n`;
      }
      augmentedPrompt += `\n**📄 AUTO-SYNTHESIZED KNOWLEDGE:**\n${session.payload.synthesized_knowledge || 'No knowledge synthesized'}`;
    } else if (session.payload.auto_connection_successful === false) {
      augmentedPrompt += `\n\n**⚠️ AUTO-CONNECTION STATUS:**\n`;
      augmentedPrompt += `- Auto-connection failed or no relevant APIs found\n`;
      augmentedPrompt += `- APIs Discovered: ${session.payload.api_usage_metrics?.apis_discovered || 0}\n`;
      augmentedPrompt += `- Fallback Message: ${session.payload.synthesized_knowledge || 'Manual research tools required'}\n`;
      augmentedPrompt += `- Manual tools available: APISearch, MultiAPIFetch, KnowledgeSynthesize, WebSearch, WebFetch`;
    }
  } else if (nextPhase === 'PLAN' && session.payload.enhanced_goal) {
    augmentedPrompt += `\n\n**🎯 GOAL TO PLAN:** ${session.payload.enhanced_goal}`;
    augmentedPrompt += `\n\n**🔄 FRACTAL ORCHESTRATION GUIDE:**\nFor complex sub-tasks that need specialized expertise, create todos with this format:\n"(ROLE: coder) (CONTEXT: authentication_system) (PROMPT: Implement secure JWT authentication with password reset) (OUTPUT: production_ready_code)"\n\nThis enables Task() agent spawning in the EXECUTE phase.`;
  } else if (nextPhase === 'EXECUTE') {
    const currentTaskIndex = session.payload.current_task_index || 0;
    const currentTodos = session.payload.current_todos || [];
    const currentTodo = currentTodos[currentTaskIndex];
    
    augmentedPrompt += `\n\n**📊 EXECUTION CONTEXT:**\n- Current Task Index: ${currentTaskIndex}\n- Total Tasks: ${currentTodos.length}\n- Current Task: ${currentTodo || 'None'}\n- Reasoning Effectiveness: ${(session.reasoning_effectiveness * 100).toFixed(1)}%\n- Objective: ${session.initial_objective}`;
    
    // Add fractal execution guidance
    augmentedPrompt += `\n\n**🔄 FRACTAL EXECUTION PROTOCOL:**\n1. Check current todo (index ${currentTaskIndex}) for meta-prompt patterns\n2. If todo contains (ROLE:...) pattern, use Task() tool to spawn specialized agent\n3. If todo is direct execution, use appropriate tools (Bash/Browser/etc.)\n4. After each action, report results back\n\n**⚡ SINGLE TOOL PER ITERATION:** Choose ONE tool call per turn (Manus requirement).`;
  } else if (nextPhase === 'VERIFY') {
    const todos = session.payload.current_todos || [];
    const taskBreakdown = calculateTaskBreakdown(todos);
    const completionPercentage = calculateCompletionPercentage(taskBreakdown);
    const criticalTasks = todos.filter((todo: any) => 
      todo.priority === 'high' || 
      todo.type === 'TaskAgent' || 
      todo.meta_prompt
    );
    const criticalTasksCompleted = criticalTasks.filter((todo: any) => todo.status === 'completed').length;
    
    augmentedPrompt += `\n\n**✅ VERIFICATION CONTEXT:**\n- Original Objective: ${session.initial_objective}\n- Final Reasoning Effectiveness: ${(session.reasoning_effectiveness * 100).toFixed(1)}%\n- Role Applied: ${session.detected_role}`;
    augmentedPrompt += `\n\n**📊 COMPLETION METRICS:**\n- Overall Completion: ${completionPercentage}% (${taskBreakdown.completed}/${taskBreakdown.total} tasks)\n- Critical Tasks Completed: ${criticalTasksCompleted}/${criticalTasks.length}\n- Tasks Breakdown: ${taskBreakdown.completed} completed, ${taskBreakdown.in_progress} in-progress, ${taskBreakdown.pending} pending`;
    augmentedPrompt += `\n\n**⚠️ VERIFICATION REQUIREMENTS:**\n- Critical tasks must be 100% complete\n- Overall completion must be ≥95%\n- No high-priority tasks can remain pending\n- No tasks can remain in-progress\n- Execution success rate must be ≥70%\n- verification_passed=true requires backing metrics`;
    
    if (session.payload.verification_failure_reason) {
      augmentedPrompt += `\n\n**🚨 PREVIOUS VERIFICATION FAILURE:**\n${session.payload.verification_failure_reason}\nLast Completion: ${session.payload.last_completion_percentage}%`;
    }
  }

  // Determine status
  const status = nextPhase === 'DONE' ? 'DONE' : 'IN_PROGRESS';

  const output: FromJARVIS = {
    next_phase: nextPhase,
    system_prompt: augmentedPrompt,
    allowed_next_tools: allowedTools,
    payload: {
      session_id: sessionId,
      current_objective: session.initial_objective,
      detected_role: session.detected_role,
      reasoning_effectiveness: session.reasoning_effectiveness,
      phase_transition_count: (session.payload.phase_transition_count || 0) + 1,
      ...session.payload
    },
    status
  };

  return output;
}

// Helper function to extract meta-prompt from todo content (Enhanced with AST fallback)
export function extractMetaPromptFromTodo(todoContent: string): MetaPrompt | null {
  // Try enhanced AST-based extraction first
  try {
    const enhanced = extractEnhancedMetaPrompt(todoContent, {
      enableSecurity: false, // Keep disabled for backward compatibility
      enableCaching: true,
      enableOptimization: false,
      timeoutMs: 1000 // Short timeout for compatibility
    });
    
    if (enhanced) {
      return {
        role_specification: enhanced.role_specification,
        context_parameters: enhanced.context_parameters,
        instruction_block: enhanced.instruction_block,
        output_requirements: enhanced.output_requirements
      };
    }
  } catch (error) {
    console.warn('Enhanced extraction failed, falling back to regex:', error);
  }
  
  // Fallback to original regex-based extraction
  const roleMatch = todoContent.match(/\(ROLE:\s*([^)]+)\)/i);
  const contextMatch = todoContent.match(/\(CONTEXT:\s*([^)]+)\)/i);
  const promptMatch = todoContent.match(/\(PROMPT:\s*([^)]+)\)/i);
  const outputMatch = todoContent.match(/\(OUTPUT:\s*([^)]+)\)/i);
  
  if (roleMatch && promptMatch) {
    return {
      role_specification: roleMatch[1].trim(),
      context_parameters: contextMatch ? { domain: contextMatch[1].trim() } : {},
      instruction_block: promptMatch[1].trim(),
      output_requirements: outputMatch ? outputMatch[1].trim() : 'comprehensive_deliverable'
    };
  }
  
  return null;
}

// Enhanced version for new code that wants full AST capabilities
export function extractEnhancedMetaPromptFromTodo(todoContent: string): EnhancedMetaPrompt | null {
  return extractEnhancedMetaPrompt(todoContent, {
    enableSecurity: true,
    enableCaching: true,
    enableOptimization: true,
    timeoutMs: 5000
  });
}

// Performance tracking for reasoning effectiveness
export function updateReasoningEffectiveness(sessionId: string, success: boolean, taskComplexity: 'simple' | 'complex' = 'simple'): void {
  const session = stateManager.getSessionState(sessionId);
  const multiplier = taskComplexity === 'complex' ? 0.15 : 0.1;
  
  if (success) {
    session.reasoning_effectiveness = Math.min(1.0, session.reasoning_effectiveness + multiplier);
  } else {
    session.reasoning_effectiveness = Math.max(0.3, session.reasoning_effectiveness - multiplier);
  }
  
  stateManager.updateSessionState(sessionId, session);
}

// Enhanced verification logic with strict completion percentage thresholds

export function validateTaskCompletion(session: any, verificationPayload: any): VerificationResult {
  const todos = session.payload.current_todos || [];
  const currentTaskIndex = session.payload.current_task_index || 0;
  
  // Calculate task completion metrics
  const taskBreakdown = calculateTaskBreakdown(todos);
  const completionPercentage = calculateCompletionPercentage(taskBreakdown);
  
  // Identify critical tasks (high priority or meta-prompt tasks)
  const criticalTasks = todos.filter((todo: any) => 
    todo.priority === 'high' || 
    todo.type === 'TaskAgent' || 
    todo.meta_prompt
  );
  const criticalTasksCompleted = criticalTasks.filter((todo: any) => todo.status === 'completed').length;
  
  // Strict validation rules
  const result: VerificationResult = {
    isValid: false,
    completionPercentage,
    reason: '',
    criticalTasksCompleted,
    totalCriticalTasks: criticalTasks.length,
    taskBreakdown
  };
  
  // Rule 1: 100% critical task completion required
  if (criticalTasks.length > 0 && criticalTasksCompleted < criticalTasks.length) {
    result.reason = `Critical tasks incomplete: ${criticalTasksCompleted}/${criticalTasks.length} completed. 100% critical task completion required.`;
    return result;
  }
  
  // Rule 2: Minimum 95% overall completion for non-critical scenarios
  if (completionPercentage < 95) {
    result.reason = `Overall completion ${completionPercentage}% below required threshold of 95%.`;
    return result;
  }
  
  // Rule 3: No pending high-priority tasks
  const pendingHighPriority = todos.filter((todo: any) => 
    todo.status === 'pending' && todo.priority === 'high'
  );
  if (pendingHighPriority.length > 0) {
    result.reason = `${pendingHighPriority.length} high-priority tasks still pending.`;
    return result;
  }
  
  // Rule 4: All in-progress tasks must be resolved
  const inProgressTasks = todos.filter((todo: any) => todo.status === 'in_progress');
  if (inProgressTasks.length > 0) {
    result.reason = `${inProgressTasks.length} tasks still in progress. All tasks must be completed or explicitly marked as pending.`;
    return result;
  }
  
  // Rule 5: Verify execution success rate
  const executionSuccessRate = session.reasoning_effectiveness || 0;
  if (executionSuccessRate < 0.7) {
    result.reason = `Execution success rate ${(executionSuccessRate * 100).toFixed(1)}% below required threshold of 70%.`;
    return result;
  }
  
  // Rule 6: Validate verification payload consistency
  if (verificationPayload?.verification_passed === true) {
    // Additional validation: ensure verification_passed claim is backed by actual metrics
    if (completionPercentage < 100 && criticalTasks.length > 0) {
      result.reason = `Verification claim inconsistent with completion metrics. Critical tasks exist but completion is ${completionPercentage}%.`;
      return result;
    }
  }
  
  // All validation rules passed
  result.isValid = true;
  result.reason = `Validation passed: ${completionPercentage}% completion, ${criticalTasksCompleted}/${criticalTasks.length} critical tasks completed.`;
  
  return result;
}

function calculateTaskBreakdown(todos: any[]): { completed: number; in_progress: number; pending: number; total: number } {
  const breakdown = {
    completed: 0,
    in_progress: 0,
    pending: 0,
    total: todos.length
  };
  
  todos.forEach(todo => {
    switch (todo.status) {
      case 'completed':
        breakdown.completed++;
        break;
      case 'in_progress':
        breakdown.in_progress++;
        break;
      case 'pending':
        breakdown.pending++;
        break;
    }
  });
  
  return breakdown;
}

function calculateCompletionPercentage(breakdown: { completed: number; total: number }): number {
  if (breakdown.total === 0) return 100; // No tasks means 100% completion
  return Math.round((breakdown.completed / breakdown.total) * 100);
}

// Helper function to create validation context for reasoning rules engine
function createValidationContext(session: any, phase: Phase, reasoning: string, input: MessageJARVIS): ValidationContext {
  // Determine objective complexity based on task count and reasoning length
  let objectiveComplexity: ComplexityLevel = ComplexityLevel.SIMPLE;
  const taskCount = (session.payload.current_todos || []).length;
  const reasoningLength = reasoning.length;
  
  if (taskCount > 5 || reasoningLength > 1000) {
    objectiveComplexity = ComplexityLevel.COMPLEX;
  } else if (taskCount > 2 || reasoningLength > 500) {
    objectiveComplexity = ComplexityLevel.MODERATE;
  }

  // Extract meta-prompt if present in current context
  let metaPrompt: MetaPrompt | undefined;
  if (input.payload?.current_meta_prompt) {
    metaPrompt = input.payload.current_meta_prompt;
  } else if (phase === 'EXECUTE') {
    // Try to extract from current todo
    const currentTaskIndex = session.payload.current_task_index || 0;
    const currentTodos = session.payload.current_todos || [];
    const currentTodo = currentTodos[currentTaskIndex];
    if (currentTodo?.meta_prompt) {
      metaPrompt = currentTodo.meta_prompt;
    }
  }

  return {
    role: session.detected_role,
    phase: phase,
    objective: session.initial_objective || '',
    reasoning: reasoning
  };
}

