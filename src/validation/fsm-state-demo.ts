// FSM State Validation Demo
// Demonstrates validation with realistic FSM state examples and edge cases

import { FSMStateValidator, createValidator } from './fsm-state-validator.js';
import { SessionState, Phase, TodoItem } from '../core/types.js';

// Demo scenarios
const demoScenarios = [
  {
    name: 'Healthy Authentication System Implementation',
    description: 'Complete auth system with all tasks completed',
    state: createAuthSystemState('healthy')
  },
  {
    name: 'Problematic E-commerce Platform',
    description: 'E-commerce platform with validation issues',
    state: createEcommerceState('problematic')
  },
  {
    name: 'Edge Case: Empty State',
    description: 'Minimal state with edge cases',
    state: createEdgeCaseState('empty')
  },
  {
    name: 'Performance Issues Detected',
    description: 'State with performance and consistency issues',
    state: createPerformanceIssueState()
  },
  {
    name: 'Complex UI System with Fractal Tasks',
    description: 'UI architecture with meta-prompt tasks',
    state: createComplexUIState()
  }
];

async function runValidationDemo(): Promise<void> {
  console.log('='.repeat(80));
  console.log('FSM STATE CONSISTENCY VALIDATION DEMO');
  console.log('='.repeat(80));
  console.log();

  const validator = createValidator({
    strictMode: true,
    enableTransitionLogging: true,
    maxTasksPerPhase: 20,
    minReasoningEffectiveness: 0.4,
    requiredCompletionThreshold: 0.9
  });

  // Test phase transitions
  console.log('PHASE TRANSITION LOGGING:');
  console.log('-'.repeat(40));
  
  const sessionId = 'demo-session-001';
  
  // Simulate valid transition sequence
  validator.logPhaseTransition(sessionId, 'INIT', 'QUERY', {}, 120);
  validator.logPhaseTransition(sessionId, 'QUERY', 'ENHANCE', { 
    interpreted_goal: 'Build secure authentication system' 
  }, 250);
  validator.logPhaseTransition(sessionId, 'ENHANCE', 'KNOWLEDGE', { 
    enhanced_goal: 'Implement JWT-based auth with comprehensive security features' 
  }, 180);
  validator.logPhaseTransition(sessionId, 'KNOWLEDGE', 'PLAN', { 
    synthesized_knowledge: 'JWT patterns, bcrypt, rate limiting, OWASP guidelines' 
  }, 320);
  validator.logPhaseTransition(sessionId, 'PLAN', 'EXECUTE', { 
    current_todos: [{ id: 'task-1', content: 'Implement JWT', status: 'pending', priority: 'high' }] 
  }, 150);
  
  // Simulate invalid transition
  validator.logPhaseTransition(sessionId, 'EXECUTE', 'QUERY', {}, 100); // Invalid rollback
  
  const transitionLog = validator.getTransitionLog(sessionId);
  if (transitionLog) {
    console.log(`Session: ${sessionId}`);
    console.log(`Total Transitions: ${transitionLog.totalTransitions}`);
    console.log(`Successful Transitions: ${transitionLog.successfulTransitions}`);
    console.log(`Success Rate: ${((transitionLog.successfulTransitions / transitionLog.totalTransitions) * 100).toFixed(1)}%`);
    console.log(`Average Transition Time: ${transitionLog.averageTransitionTime.toFixed(0)}ms`);
    console.log();
  }

  // Validate each scenario
  for (let i = 0; i < demoScenarios.length; i++) {
    const scenario = demoScenarios[i];
    console.log(`SCENARIO ${i + 1}: ${scenario.name}`);
    console.log(`Description: ${scenario.description}`);
    console.log('-'.repeat(60));
    
    const startTime = Date.now();
    const result = validator.validateState(scenario.state);
    const validationTime = Date.now() - startTime;
    
    // Display results
    console.log(`✓ Valid State: ${result.isValid ? 'YES' : 'NO'}`);
    console.log(`✓ Validation Time: ${validationTime}ms`);
    console.log(`✓ State Consistency Score: ${(result.metrics.stateConsistencyScore * 100).toFixed(1)}%`);
    console.log(`✓ Transition Integrity Score: ${(result.metrics.transitionIntegrityScore * 100).toFixed(1)}%`);
    console.log();
    
    // Display metrics
    console.log('VALIDATION METRICS:');
    console.log(`  Total Checks: ${result.metrics.totalChecks}`);
    console.log(`  Passed Checks: ${result.metrics.passedChecks}`);
    console.log(`  Failed Checks: ${result.metrics.failedChecks}`);
    console.log();
    
    // Display errors
    if (result.errors.length > 0) {
      console.log('VALIDATION ERRORS:');
      result.errors.forEach(error => {
        const severityIcon = error.severity === 'critical' ? '🚨' : 
                           error.severity === 'high' ? '⚠️' : '⚡';
        console.log(`  ${severityIcon} [${error.severity.toUpperCase()}] ${error.code}: ${error.message}`);
        if (error.context) {
          console.log(`     Context: ${JSON.stringify(error.context, null, 2).replace(/\n/g, '\n     ')}`);
        }
      });
      console.log();
    }
    
    // Display warnings
    if (result.warnings.length > 0) {
      console.log('VALIDATION WARNINGS:');
      result.warnings.forEach(warning => {
        console.log(`  💡 ${warning.code}: ${warning.message}`);
        console.log(`     Suggestion: ${warning.suggestion}`);
      });
      console.log();
    }
    
    // Display recommendations
    if (result.recommendations.length > 0) {
      console.log('RECOMMENDATIONS:');
      result.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`);
      });
      console.log();
    }
    
    console.log('='.repeat(80));
    console.log();
  }

  // Generate final report
  generateValidationReport(validator, demoScenarios);
}

function generateValidationReport(validator: FSMStateValidator, scenarios: any[]): void {
  console.log('VALIDATION SUMMARY REPORT');
  console.log('='.repeat(80));
  
  let totalScenarios = scenarios.length;
  let validScenarios = 0;
  let totalErrors = 0;
  let totalWarnings = 0;
  let totalValidationTime = 0;
  
  scenarios.forEach(scenario => {
    const startTime = Date.now();
    const result = validator.validateState(scenario.state);
    const validationTime = Date.now() - startTime;
    
    totalValidationTime += validationTime;
    if (result.isValid) validScenarios++;
    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;
  });
  
  console.log(`Total Scenarios Tested: ${totalScenarios}`);
  console.log(`Valid Scenarios: ${validScenarios} (${((validScenarios / totalScenarios) * 100).toFixed(1)}%)`);
  console.log(`Total Errors Found: ${totalErrors}`);
  console.log(`Total Warnings Found: ${totalWarnings}`);
  console.log(`Average Validation Time: ${(totalValidationTime / totalScenarios).toFixed(1)}ms`);
  console.log();
  
  console.log('KEY FINDINGS:');
  console.log('• FSM state validation successfully detects critical consistency issues');
  console.log('• Phase transition logging provides valuable debugging information');
  console.log('• Performance metrics validation helps identify system bottlenecks');
  console.log('• Task state validation ensures data integrity across phase transitions');
  console.log('• Recommendation engine provides actionable improvement suggestions');
  console.log();
  
  console.log('VALIDATION SYSTEM CAPABILITIES:');
  console.log('✓ Phase consistency validation');
  console.log('✓ Payload integrity checking');
  console.log('✓ Task state validation');
  console.log('✓ API metrics validation');
  console.log('✓ Phase transition logging');
  console.log('✓ Performance monitoring');
  console.log('✓ Error categorization (critical/high/medium)');
  console.log('✓ Automated recommendations');
  console.log('✓ Configurable validation rules');
  console.log('✓ Edge case handling');
  console.log();
}

// Scenario creation functions
function createAuthSystemState(variant: 'healthy' | 'problematic'): SessionState {
  const baseTodos: TodoItem[] = [
    { id: 'auth-1', content: 'Set up JWT token generation', status: 'completed', priority: 'high' },
    { id: 'auth-2', content: 'Implement password hashing', status: 'completed', priority: 'high' },
    { id: 'auth-3', content: 'Create login/logout endpoints', status: 'completed', priority: 'high' },
    { id: 'auth-4', content: 'Add password reset functionality', status: 'completed', priority: 'medium' },
    { id: 'auth-5', content: 'Implement rate limiting', status: 'completed', priority: 'high' }
  ];

  if (variant === 'problematic') {
    baseTodos[4].status = 'pending'; // Rate limiting not completed
    baseTodos.push({ 
      id: 'auth-6', 
      content: 'Security audit', 
      status: 'invalid_status' as any, // Invalid status
      priority: 'high' 
    });
  }

  return {
    current_phase: 'VERIFY',
    initial_objective: 'Implement secure user authentication system',
    detected_role: 'coder',
    payload: {
      current_task_index: 4,
      current_todos: baseTodos,
      phase_transition_count: 6,
      interpreted_goal: 'Build secure authentication',
      enhanced_goal: 'Implement JWT-based authentication with security features',
      synthesized_knowledge: 'JWT tokens, bcrypt hashing, rate limiting best practices',
      plan_created: true,
      execution_success: variant === 'healthy',
      api_usage_metrics: {
        apis_discovered: 4,
        apis_queried: 3,
        synthesis_confidence: variant === 'healthy' ? 0.92 : 0.65,
        processing_time: 1850,
        discovery_success_rate: 1.0,
        api_response_time: 320,
        knowledge_synthesis_quality: variant === 'healthy' ? 0.88 : 0.70
      }
    },
    reasoning_effectiveness: variant === 'healthy' ? 0.85 : 0.25, // Low for problematic
    last_activity: Date.now()
  };
}

function createEcommerceState(variant: 'problematic'): SessionState {
  const manyTodos = Array(35).fill(0).map((_, i) => ({ // Excessive task count
    id: `ecom-${i}`,
    content: `E-commerce task ${i + 1}`,
    status: i < 10 ? 'completed' : i < 15 ? 'in_progress' : 'pending', // Multiple in-progress
    priority: 'medium'
  }));

  return {
    current_phase: 'EXECUTE',
    initial_objective: '', // Missing objective
    detected_role: 'coder',
    payload: {
      current_task_index: 25, // Invalid task index
      current_todos: manyTodos,
      phase_transition_count: 8,
      api_usage_metrics: {
        apis_discovered: -1, // Invalid negative value
        apis_queried: 5,
        synthesis_confidence: 1.5, // Out of bounds
        processing_time: -100 // Invalid negative time
      }
    },
    reasoning_effectiveness: 1.2, // Out of bounds
    last_activity: Date.now()
  };
}

function createEdgeCaseState(variant: 'empty'): SessionState {
  return {
    current_phase: 'INIT',
    initial_objective: 'Minimal test case',
    detected_role: 'coder',
    payload: {
      current_task_index: 0,
      current_todos: [], // Empty todos array
      phase_transition_count: 0
    },
    reasoning_effectiveness: 0.5,
    last_activity: Date.now()
  };
}

function createPerformanceIssueState(): SessionState {
  return {
    current_phase: 'VERIFY',
    initial_objective: 'Performance optimization project',
    detected_role: 'analyzer',
    payload: {
      current_task_index: 2,
      current_todos: [
        { id: 'perf-1', content: 'Database optimization', status: 'completed', priority: 'high' },
        { id: 'perf-2', content: 'Frontend caching', status: 'in_progress', priority: 'medium' },
        { id: 'perf-3', content: 'API response optimization', status: 'pending', priority: 'low' }
      ],
      phase_transition_count: 12,
      execution_success: false,
      verification_failure_reason: 'Performance benchmarks not met',
      last_completion_percentage: 67
    },
    reasoning_effectiveness: 0.35, // Low effectiveness
    last_activity: Date.now() - 3600000 // 1 hour ago
  };
}

function createComplexUIState(): SessionState {
  return {
    current_phase: 'EXECUTE',
    initial_objective: 'Build responsive dashboard with data visualization',
    detected_role: 'ui_architect',
    payload: {
      current_task_index: 1,
      current_todos: [
        {
          id: 'ui-1',
          content: '(ROLE: ui_architect) (CONTEXT: dashboard) Design responsive layout (OUTPUT: layout_specs)',
          status: 'completed',
          priority: 'high',
          type: 'TaskAgent',
          meta_prompt: {
            role_specification: 'ui_architect',
            context_parameters: { domain: 'dashboard' },
            instruction_block: 'Design responsive layout',
            output_requirements: 'layout_specs'
          }
        },
        {
          id: 'ui-2',  
          content: '(ROLE: ui_implementer) (CONTEXT: charts) Implement D3.js charts (OUTPUT: chart_components)',
          status: 'in_progress',
          priority: 'high',
          type: 'TaskAgent',
          meta_prompt: {
            role_specification: 'ui_implementer',
            context_parameters: { domain: 'charts' },
            instruction_block: 'Implement D3.js charts',
            output_requirements: 'chart_components'
          }
        }
      ],
      phase_transition_count: 5,
      interpreted_goal: 'Create responsive dashboard',
      enhanced_goal: 'Build accessible dashboard with interactive visualizations',
      synthesized_knowledge: 'CSS Grid, D3.js patterns, accessibility guidelines',
      plan_created: true
    },
    reasoning_effectiveness: 0.78,
    last_activity: Date.now()
  };
}

// Run the demo
if (import.meta.url === `file://${process.argv[1]}`) {
  runValidationDemo().catch(console.error);
}

export { runValidationDemo };