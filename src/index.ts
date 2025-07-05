/**
 * Iron Manus MCP Server - Main Entry Point
 *
 * This is the primary MCP (Model Context Protocol) server implementation for the Iron Manus system.
 * It provides an FSM-driven 8-phase agent loop with comprehensive tool orchestration capabilities.
 *
 * The server implements:
 * - 8-phase FSM state machine (INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE)
 * - Modular tool registry system with 65+ API integrations
 * - Role-based cognitive enhancement and intelligent orchestration
 * - Fractal task decomposition and parallel execution capabilities
 *
 * MCP Protocol Integration:
 * - Handles ListTools requests via the tool registry
 * - Processes CallTool requests with comprehensive error handling
 * - Supports stdio transport for Claude integration
 * - Provides testable server creation function
 *
 * @version 0.2.4
 * @author Iron Manus Team
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { toolRegistry } from './tools/index.js';
import { validateConfig } from './config.js';

/**
 * MCP Server Instance
 *
 * Creates the main MCP server instance with JARVIS identity and tool capabilities.
 * The server is configured to support the Model Context Protocol standard
 * with comprehensive tool orchestration capabilities.
 *
 * Server Configuration:
 * - Name: JARVIS (Just A Rather Very Intelligent System)
 * - Version: 0.2.4 (current stable release)
 * - Capabilities: Tools support for agent orchestration
 */
const server = new Server(
  {
    name: 'JARVIS',
    version: '0.2.4',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * List Tools Request Handler
 *
 * Handles MCP ListTools requests by retrieving all available tool definitions
 * from the centralized tool registry. This allows Claude to discover and understand
 * all available tools in the Iron Manus system.
 *
 * The tool registry includes:
 * - JARVIS FSM controller for 8-phase orchestration
 * - Multi-API fetch capabilities with 65+ API integrations
 * - Python data analysis and execution tools
 * - API search and validation utilities
 * - State graph management for session persistence
 *
 * @returns Promise resolving to tools array with definitions
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = toolRegistry.getToolDefinitions();
  return { tools };
});

/**
 * Call Tool Request Handler
 *
 * Handles MCP CallTool requests by executing the specified tool through the
 * centralized tool registry. This is the primary execution pathway for all
 * Iron Manus tool interactions.
 *
 * Request Processing:
 * 1. Extracts tool name and arguments from MCP request
 * 2. Delegates execution to the tool registry
 * 3. Returns formatted response or error information
 *
 * Error Handling:
 * - Comprehensive error logging for debugging
 * - Standardized error response format
 * - Graceful handling of unknown tools and invalid arguments
 *
 * @param request - MCP CallTool request containing tool name and arguments
 * @returns Promise resolving to tool result or error response
 */
server.setRequestHandler(CallToolRequestSchema, async request => {
  const { name, arguments: args } = request.params;

  try {
    // Execute tool through registry
    const result = await toolRegistry.executeTool(name, args);
    return result as any; // TODO: Fix typing
  } catch (error) {
    console.error(`Tool execution error for ${name}:`, error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text',
          text: `ERROR Tool Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Create Server Function
 *
 * Factory function that returns the configured MCP server instance.
 * This function is primarily used for testing purposes to allow
 * test suites to create isolated server instances.
 *
 * @returns Configured MCP server instance
 * @see {@link server} The main server instance
 */
export function createServer() {
  return server;
}

/**
 * Server Startup Logic
 *
 * Automatically starts the MCP server when not in test environment.
 * Uses stdio transport for communication with Claude via the MCP protocol.
 *
 * Transport Configuration:
 * - Uses StdioServerTransport for standard input/output communication
 * - Enables seamless integration with Claude's MCP client
 * - Supports real-time bidirectional communication
 *
 * Environment Handling:
 * - Skips startup during testing (NODE_ENV === 'test')
 * - Allows test suites to create isolated server instances
 * - Prevents conflicts during automated testing
 *
 * Security Validation:
 * - Validates configuration before server startup
 * - Prevents insecure configurations in production
 * - Logs configuration errors for debugging
 */
if (process.env.NODE_ENV !== 'test') {
  // Validate configuration before starting server
  const configValidation = validateConfig();
  if (!configValidation.valid) {
    console.error('❌ Configuration validation failed:');
    configValidation.errors.forEach(error => {
      if (error.includes('CRITICAL')) {
        console.error(`🚨 ${error}`);
        process.exit(1); // Exit for critical security errors
      } else if (error.includes('WARNING')) {
        console.warn(`⚠️  ${error}`);
      } else {
        console.error(`❌ ${error}`);
      }
    });

    // Exit if any critical errors (already handled above) or non-warning errors exist
    const hasNonWarningErrors = configValidation.errors.some(error => !error.includes('WARNING'));
    if (hasNonWarningErrors) {
      process.exit(1);
    }
  } else {
    console.log('✅ Configuration validation passed');
  }

  const transport = new StdioServerTransport();
  server.connect(transport);
}
