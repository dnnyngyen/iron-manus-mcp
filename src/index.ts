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
import { ToolResult } from './tools/base-tool.js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Legacy File Protection System
 *
 * Prevents legacy JSON files from being created by immediately detecting and removing them.
 * This system runs continuously to protect against any legacy processes or code that might
 * try to create iron_manus_*.json files.
 */
const LEGACY_FILE_PATTERNS = [
  'iron_manus_component_cognitive_duality.json',
  'iron_manus_state.json',
  'iron_manus_unified_constraints.json',
  'iron_manus_performance_archive.json',
];

function isLegacyFile(filename: string): boolean {
  return LEGACY_FILE_PATTERNS.includes(filename) || /^iron_manus_.*\.json$/.test(filename);
}

async function removeLegacyFile(filePath: string): Promise<void> {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.warn(`🗑️  [RUNTIME PROTECTION] Removed legacy file: ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`❌ [RUNTIME PROTECTION] Could not remove legacy file ${filePath}:`, error);
  }
}

async function startLegacyFileProtection(): Promise<void> {
  const projectRoot = process.cwd();

  // Initial cleanup
  try {
    const files = await fs.promises.readdir(projectRoot);
    await Promise.all(
      files.map(async file => {
        if (isLegacyFile(file)) {
          await removeLegacyFile(path.join(projectRoot, file));
        }
      })
    );
  } catch (error) {
    console.error('❌ [RUNTIME PROTECTION] Error during initial cleanup:', error);
  }

  // Start filesystem watcher
  try {
    fs.watch(projectRoot, { persistent: false }, (eventType, filename) => {
      if (filename && isLegacyFile(filename)) {
        console.warn(`🚨 [RUNTIME PROTECTION] Legacy file detected: ${filename}`);
        setTimeout(() => {
          removeLegacyFile(path.join(projectRoot, filename));
        }, 100);
      }
    });

    console.log('🛡️  [RUNTIME PROTECTION] Legacy file protection active');
  } catch (error) {
    console.error('❌ [RUNTIME PROTECTION] Could not start filesystem watcher:', error);
  }

  // Periodic cleanup every 30 seconds
  setInterval(async () => {
    try {
      const files = await fs.promises.readdir(projectRoot);
      await Promise.all(
        files.map(async file => {
          if (isLegacyFile(file)) {
            await removeLegacyFile(path.join(projectRoot, file));
          }
        })
      );
    } catch (error) {
      // Silent fail for periodic cleanup
    }
  }, 30000);
}

/**
 * Converts ToolResult to MCP CallToolResult format
 *
 * The MCP protocol expects a specific response format that matches our ToolResult interface.
 * This function ensures type safety while maintaining protocol compliance.
 *
 * @param toolResult - The result from tool execution
 * @returns MCP-compliant response object
 */
function convertToolResultToMCPResponse(toolResult: ToolResult) {
  return {
    content: toolResult.content,
    isError: toolResult.isError,
  };
}

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
    return convertToolResultToMCPResponse(result);
  } catch (error) {
    console.error(`Tool execution error for ${name}:`, error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorResult: ToolResult = {
      content: [
        {
          type: 'text',
          text: `ERROR Tool Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
    return convertToolResultToMCPResponse(errorResult);
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
  // Start legacy file protection immediately
  startLegacyFileProtection().catch(console.error);

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
