// MCP Server Integration Tests - Tests for server startup and basic functionality
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { createServer } from '../../src/index.js';
import { JARVISTool } from '../../src/tools/jarvis-tool.js';

describe('MCP Server Integration', () => {
  let server: any;
  
  beforeAll(async () => {
    // Create server instance for testing
    server = createServer();
  });

  afterAll(async () => {
    // Clean up server if needed
    if (server && typeof server.close === 'function') {
      await server.close();
    }
  });

  describe('Server Initialization', () => {
    it('should create server instance successfully', () => {
      expect(server).toBeDefined();
      expect(server).not.toBeNull();
    });

    it('should have JARVIS tool registered', () => {
      const jarvisTool = new JARVISTool();
      
      expect(jarvisTool.name).toBe('JARVIS');
      expect(jarvisTool.description).toContain('Finite State Machine Controller');
      expect(jarvisTool.inputSchema).toBeDefined();
    });

    it('should have correct server configuration', () => {
      // Test that server has proper MCP configuration
      expect(server).toHaveProperty('_serverInfo');
      expect(server._serverInfo).toHaveProperty('name', 'JARVIS');
      expect(server._serverInfo).toHaveProperty('version', '1.0.0');
    });
  });

  describe('Tool Registration', () => {
    it('should register all required tools', () => {
      const jarvisTool = new JARVISTool();
      
      // Verify tool has proper structure
      expect(jarvisTool).toHaveProperty('name');
      expect(jarvisTool).toHaveProperty('description');
      expect(jarvisTool).toHaveProperty('inputSchema');
      expect(jarvisTool).toHaveProperty('handle');
      
      // Verify handle is a function
      expect(typeof jarvisTool.handle).toBe('function');
    });

    it('should have valid tool schema structure', () => {
      const jarvisTool = new JARVISTool();
      const schema = jarvisTool.inputSchema;
      
      expect(schema).toHaveProperty('type');
      expect(schema.type).toBe('object');
      expect(schema).toHaveProperty('properties');
      
      // Check required properties exist
      expect(schema.properties).toHaveProperty('session_id');
      expect(schema.properties).toHaveProperty('phase_completed');
      expect(schema.properties).toHaveProperty('initial_objective');
      expect(schema.properties).toHaveProperty('payload');
    });
  });

  describe('Basic Tool Functionality', () => {
    it('should handle JARVIS tool calls without errors', async () => {
      const jarvisTool = new JARVISTool();
      
      const testArgs = {
        initial_objective: 'Test the MCP server integration'
      };

      // This should not throw an error
      const result = await jarvisTool.handle(testArgs);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('isError');
      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
    });

    it('should generate valid session IDs', async () => {
      const jarvisTool = new JARVISTool();
      
      const testArgs = {
        initial_objective: 'Test session ID generation'
      };

      const result = await jarvisTool.handle(testArgs);
      
      // Session ID should be generated and included in response
      expect(result.isError).toBeFalsy();
      expect(result.content[0].text).toContain('session_');
    });

    it('should handle empty arguments gracefully', async () => {
      const jarvisTool = new JARVISTool();
      
      const testArgs = {};

      const result = await jarvisTool.handle(testArgs);
      
      expect(result).toBeDefined();
      expect(result.isError).toBeFalsy();
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed arguments gracefully', async () => {
      const jarvisTool = new JARVISTool();
      
      const testArgs = {
        phase_completed: 'INVALID_PHASE' as any,
        session_id: null as any
      };

      const result = await jarvisTool.handle(testArgs);
      
      // Should not crash, should handle gracefully
      expect(result).toBeDefined();
      expect(result).toHaveProperty('isError');
      expect(result).toHaveProperty('content');
    });

    it('should provide meaningful error messages when tools fail', async () => {
      const jarvisTool = new JARVISTool();
      
      // Test with invalid arguments that should cause an error
      const testArgs = {
        session_id: null,
        invalid_field: 'invalid'
      };

      const result = await jarvisTool.handle(testArgs as any);
      
      // Should handle gracefully
      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
    });
  });

  describe('MCP Protocol Compliance', () => {
    it('should return responses in correct MCP format', async () => {
      const jarvisTool = new JARVISTool();
      
      const testArgs = {
        initial_objective: 'Test MCP protocol compliance'
      };

      const result = await jarvisTool.handle(testArgs);
      
      // MCP tool response format
      expect(result).toHaveProperty('isError');
      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      
      if (result.content.length > 0) {
        expect(result.content[0]).toHaveProperty('type');
        expect(result.content[0]).toHaveProperty('text');
        expect(result.content[0].type).toBe('text');
        expect(typeof result.content[0].text).toBe('string');
      }
    });

    it('should handle concurrent tool calls', async () => {
      const jarvisTool = new JARVISTool();
      
      const promises = Array.from({ length: 3 }, (_, i) => 
        jarvisTool.handle({
          initial_objective: `Concurrent test ${i + 1}`
        })
      );

      const results = await Promise.all(promises);
      
      // All should succeed
      results.forEach((result, index) => {
        expect(result.isError).toBeFalsy();
        expect(result.content[0].text).toContain(`test ${index + 1}`);
      });
    });
  });

  describe('Performance', () => {
    it('should respond within reasonable time limits', async () => {
      const jarvisTool = new JARVISTool();
      
      const startTime = Date.now();
      
      const result = await jarvisTool.handle({
        initial_objective: 'Performance test'
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(result.isError).toBeFalsy();
      expect(duration).toBeLessThan(5000); // Should respond within 5 seconds
    });

    it('should handle multiple sessions efficiently', async () => {
      const jarvisTool = new JARVISTool();
      
      const startTime = Date.now();
      
      // Create multiple sessions
      const sessions = await Promise.all([
        jarvisTool.handle({ session_id: 'session-1', initial_objective: 'Task 1' }),
        jarvisTool.handle({ session_id: 'session-2', initial_objective: 'Task 2' }),
        jarvisTool.handle({ session_id: 'session-3', initial_objective: 'Task 3' })
      ]);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // All sessions should succeed
      sessions.forEach(result => {
        expect(result.isError).toBeFalsy();
      });
      
      // Should handle multiple sessions efficiently
      expect(duration).toBeLessThan(10000); // Within 10 seconds for 3 sessions
    });
  });

  describe('State Management Integration', () => {
    it('should maintain session state across calls', async () => {
      const jarvisTool = new JARVISTool();
      const sessionId = 'integration-test-session';
      
      // Initialize session
      const initResult = await jarvisTool.handle({
        session_id: sessionId,
        initial_objective: 'Test state persistence'
      });
      
      expect(initResult.isError).toBeFalsy();
      
      // Continue session
      const continueResult = await jarvisTool.handle({
        session_id: sessionId,
        phase_completed: 'QUERY',
        payload: {
          interpreted_goal: 'Enhanced objective'
        }
      });
      
      expect(continueResult.isError).toBeFalsy();
      expect(continueResult.content[0].text).toContain('ENHANCE');
    });

    it('should handle session lifecycle properly', async () => {
      const jarvisTool = new JARVISTool();
      const sessionId = 'lifecycle-test-session';
      
      // Test initial session creation
      const initResult = await jarvisTool.handle({
        session_id: sessionId,
        initial_objective: 'Lifecycle test'
      });
      
      expect(initResult.isError).toBeFalsy();
      
      // Test phase completion
      const queryResult = await jarvisTool.handle({
        session_id: sessionId,
        phase_completed: 'QUERY' as const,
        payload: {
          test_data: 'Query phase completed'
        }
      });
      
      expect(queryResult.isError).toBeFalsy();
    });
  });
});