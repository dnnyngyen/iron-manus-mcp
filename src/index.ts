// Enhanced MCP Server - Accurate replication of Manus's 6-step loop + 3 modules + fractal orchestration
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { toolRegistry } from './tools/index.js';

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

// Enhanced tool registry with modular tool system
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = toolRegistry.getToolDefinitions();
  return { tools };
});

// Request handler using modular tool system
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    // Execute tool through registry
    const result = await toolRegistry.executeTool(name, args);
    return result;
  } catch (error) {
    console.error(`Tool execution error for ${name}:`, error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [{
        type: 'text',
        text: `ERROR Tool Error: ${errorMessage}`
      }],
      isError: true
    };
  }
});

// Export server creation function for testing
export function createServer() {
  return server;
}

// Start server (only when not in test environment)
if (process.env.NODE_ENV !== 'test') {
  const transport = new StdioServerTransport();
  server.connect(transport);
}