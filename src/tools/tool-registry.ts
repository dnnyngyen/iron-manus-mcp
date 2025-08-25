/**
 * Tool Registry System
 * Centralized registration and management of all MCP tools
 */

import { BaseTool, ToolDefinition, ToolResult } from './base-tool.js';

// Orchestration tools
import { JARVISTool } from './orchestration/jarvis-tool.js';
import { IronManusStateGraphTool } from './orchestration/iron-manus-state-graph.js';

// API tools
import { APITaskAgent } from './api/api-task-agent.js';

// Computation tools
import { PythonComputationalTool } from './computation/python-computational-tool.js';

// Content tools
import { SlideGeneratorTool } from './content/slide-generator-tool.js';

// System tools
import { HealthCheckTool } from './system/health-check.js';

/**
 * Tool Registry Class
 * Manages all available tools and their registration
 */
export class ToolRegistry {
  private tools: Map<string, BaseTool> = new Map();

  constructor() {
    this.registerDefaultTools();
  }

  /**
   * Register default Iron Manus tools
   */
  private registerDefaultTools(): void {
    this.registerTool(new JARVISTool());
    this.registerTool(new APITaskAgent());
    this.registerTool(new PythonComputationalTool());
    this.registerTool(new IronManusStateGraphTool());
    this.registerTool(new HealthCheckTool());
    this.registerTool(new SlideGeneratorTool());
  }

  /**
   * Register a new tool
   */
  registerTool(tool: BaseTool): void {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool with name '${tool.name}' is already registered`);
    }
    this.tools.set(tool.name, tool);
  }

  /**
   * Get tool by name
   */
  getTool(name: string): BaseTool | undefined {
    return this.tools.get(name);
  }

  /**
   * Get all registered tools
   */
  getAllTools(): BaseTool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get tool definitions for MCP registration
   */
  getToolDefinitions(): ToolDefinition[] {
    return this.getAllTools().map(tool => tool.getDefinition());
  }

  /**
   * Check if tool exists
   */
  hasTool(name: string): boolean {
    return this.tools.has(name);
  }

  /**
   * Remove tool by name
   */
  unregisterTool(name: string): boolean {
    return this.tools.delete(name);
  }

  /**
   * Get tool names
   */
  getToolNames(): string[] {
    return Array.from(this.tools.keys());
  }

  /**
   * Handle tool execution by name
   */
  async executeTool(name: string, args: unknown): Promise<ToolResult> {
    const tool = this.getTool(name);
    if (!tool) {
      throw new Error(
        `Tool '${name}' not found. Available tools: ${this.getToolNames().join(', ')}`
      );
    }

    return await tool.handle(args);
  }
}

/**
 * Global tool registry instance
 */
export const toolRegistry = new ToolRegistry();
