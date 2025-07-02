/**
 * Tool Registry System
 * Centralized registration and management of all MCP tools
 */

import { BaseTool, ToolDefinition } from './base-tool.js';
import { JARVISTool } from './jarvis-tool.js';
import { MultiAPIFetchTool } from './multi-api-fetch.js';
import { APISearchTool } from './api-search.js';
import { APIValidatorTool } from './api-validator.js';
import { PythonDataAnalysisTool } from './python-data-analysis.js';
import { PythonExecutorTool, EnhancedPythonDataScienceTool } from './python-executor.js';
import { IronManusStateGraphTool } from './iron-manus-state-graph.js';

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
    this.registerTool(new MultiAPIFetchTool());
    this.registerTool(new APISearchTool());
    this.registerTool(new APIValidatorTool());
    this.registerTool(new PythonDataAnalysisTool());
    this.registerTool(new PythonExecutorTool());
    this.registerTool(new EnhancedPythonDataScienceTool());
    this.registerTool(new IronManusStateGraphTool());
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
  async executeTool(name: string, args: any): Promise<any> {
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
