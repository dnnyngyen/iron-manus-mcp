/**
 * Base Tool Abstract Class
 * Provides consistent interface for all MCP tools in the Iron Manus system
 */

export interface ToolSchema {
  type: 'object';
  properties: Record<string, any>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: ToolSchema;
}

export interface ToolResult {
  content: Array<{
    type: 'text';
    text: string;
  }>;
}

/**
 * Abstract base class for all MCP tools
 * Ensures consistent interface and behavior across tool implementations
 */
export abstract class BaseTool {
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly inputSchema: ToolSchema;

  /**
   * Get tool definition for MCP registration
   */
  getDefinition(): ToolDefinition {
    return {
      name: this.name,
      description: this.description,
      inputSchema: this.inputSchema
    };
  }

  /**
   * Handle tool execution - must be implemented by concrete tools
   */
  abstract handle(args: any): Promise<ToolResult>;

  /**
   * Validate tool arguments against schema
   */
  protected validateArgs(args: any): void {
    if (!args) {
      throw new Error(`Missing arguments for ${this.name} tool`);
    }

    // Check required properties
    if (this.inputSchema.required) {
      for (const prop of this.inputSchema.required) {
        if (!(prop in args)) {
          throw new Error(`Missing required property '${prop}' for ${this.name} tool`);
        }
      }
    }
  }

  /**
   * Create standardized success response
   */
  protected createResponse(text: string): ToolResult {
    return {
      content: [{
        type: 'text',
        text
      }]
    };
  }

  /**
   * Create standardized error response
   */
  protected createErrorResponse(error: string | Error): ToolResult {
    const errorMessage = error instanceof Error ? error.message : error;
    return {
      content: [{
        type: 'text',
        text: `❌ **${this.name} Error:** ${errorMessage}`
      }]
    };
  }
}