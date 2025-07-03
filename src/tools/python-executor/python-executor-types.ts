/**
 * Python Executor Types and Schemas
 * 
 * This module contains all type definitions and JSON schemas for the Python Executor tools.
 * Extracted from python-executor.ts for better modularity and maintainability.
 * 
 * @fileoverview Type definitions for Python execution tools
 * @author Iron Manus MCP Team
 * @version 1.0.0
 */

import { ToolSchema } from '../base-tool.js';

/**
 * Arguments interface for Python code execution
 * 
 * @interface PythonExecutorArgs
 * @property {string} code - The Python code to execute (required)
 * @property {string[]} [setup_libraries] - Array of library names to install/import before execution
 * @property {string} [description] - Optional description of what the code does for documentation
 */
export interface PythonExecutorArgs {
  code: string;
  setup_libraries?: string[];
  description?: string;
}

/**
 * JSON Schema for PythonExecutorTool input validation
 */
export const PYTHON_EXECUTOR_INPUT_SCHEMA: ToolSchema = {
  type: 'object',
  properties: {
    code: {
      type: 'string',
      description: 'Python code to execute',
    },
    setup_libraries: {
      type: 'array',
      items: { type: 'string' },
      description: 'Libraries to install/import before execution',
    },
    description: {
      type: 'string',
      description: 'Description of what the code does',
    },
  },
  required: ['code'],
  additionalProperties: false,
};

/**
 * JSON Schema for EnhancedPythonDataScienceTool input validation
 */
export const ENHANCED_PYTHON_DATA_SCIENCE_INPUT_SCHEMA: ToolSchema = {
  type: 'object',
  properties: {
    operation: {
      type: 'string',
      enum: ['web_scraping', 'data_analysis', 'visualization', 'machine_learning', 'custom'],
      description: 'Type of data science operation',
    },
    input_data: {
      type: 'string',
      description: 'Input data (URL, CSV, JSON, HTML, etc.)',
    },
    parameters: {
      type: 'object',
      description: 'Operation-specific parameters',
    },
    custom_code: {
      type: 'string',
      description: 'Custom Python code for custom operations',
    },
  },
  required: ['operation'],
  additionalProperties: false,
};