// Enhanced MCP Server - Accurate replication of Manus's 6-step loop + 3 modules + fractal orchestration
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { processState, extractMetaPromptFromTodo } from './core/fsm.js';
import { MessageJARVIS } from './core/types.js';
import { stateManager } from './core/state.js';
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

// Single tool that controls the entire agent loop
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
    }
  ];
  
  console.error(`DEBUG: Returning ${tools.length} tools:`, tools.map(t => t.name));
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
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
    const output = processState(input);
    
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
  console.error('🚀 Iron Manus MCP Server started successfully');
  console.error('📋 Architecture: 6-step agent loop + 3 modules + fractal orchestration');
  console.error('🎯 Capabilities: Role-based cognitive enhancement, meta-prompt generation, performance tracking');
  console.error('⚡ Ready to hijack Sequential Thinking and provide Manus-grade agent orchestration!');
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});