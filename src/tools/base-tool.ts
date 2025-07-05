/**
 * Base Tool Abstract Class
 * Provides consistent interface for all MCP tools in the Iron Manus system
 */

export interface ToolSchema {
  type: 'object';
  properties: Record<string, unknown>;
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
  isError?: boolean;
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
      inputSchema: this.inputSchema,
    };
  }

  /**
   * Handle tool execution - must be implemented by concrete tools
   */
  abstract handle(args: unknown): Promise<ToolResult>;

  /**
   * Validate tool arguments against schema
   */
  protected validateArgs(args: unknown): void {
    if (!args || typeof args !== 'object') {
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
      content: [
        {
          type: 'text',
          text,
        },
      ],
      isError: false,
    };
  }

  /**
   * Create standardized error response with metaprompting-first guidance
   */
  protected createErrorResponse(error: string | Error): ToolResult {
    const errorMessage = error instanceof Error ? error.message : error;
    const metaPromptResponse = `# 🔍 Strategic Tool Error Analysis

**Error Encountered**: ${errorMessage}

## Cognitive Recalibration Questions

🤔 **Assumption Check**: What assumptions about this tool's capabilities or your input might need revisiting?

🎯 **Intent Clarification**: Are you using the right tool for your actual objective? What alternative approaches might better serve your goal?

🔄 **Approach Refinement**: If you simplified your request or changed your perspective, what might become possible?

🧠 **Learning Opportunity**: What is this error teaching you about the problem domain or tool design? How might this inform your strategy?

## Strategic Next Steps
Consider: Should you modify your approach, try a different tool, or reframe your objective entirely? What would success look like with a refined strategy?`;

    return {
      content: [
        {
          type: 'text',
          text: metaPromptResponse,
        },
      ],
      isError: true,
    };
  }
}
