// API Registry Tests - Tests for role-based API selection and registry functionality
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { 
  selectRelevantAPIs, 
  getAPIByName, 
  getAPIsByCategory, 
  getPublicAPIs,
  getHighReliabilityAPIs,
  canUseAPI,
  RateLimiter,
  SAMPLE_API_REGISTRY,
  ROLE_API_MAPPING,
  parseMarkdownAPITable,
  generateAPISelectionPrompt,
  parseClaudeAPISelection,
  getAPIRegistryStats
} from '../../src/core/api-registry.js';
import { Role } from '../../src/core/types.js';
import { APIEndpoint } from '../../src/core/api-registry.js';

describe('API Registry Functionality', () => {
  describe('Role-Based API Selection', () => {
    it('should select relevant APIs for researcher role', () => {
      const objective = 'Research quantum computing advancements';
      const role: Role = 'researcher';
      
      const results = selectRelevantAPIs(objective, role);
      
      expect(results).toHaveLength(5); // Returns top 5
      expect(results[0].relevance_score).toBeGreaterThan(0);
      expect(results[0].api).toHaveProperty('name');
      expect(results[0].api).toHaveProperty('category');
    });

    it('should select relevant APIs for analyzer role', () => {
      const objective = 'Analyze cryptocurrency market trends';
      const role: Role = 'analyzer';
      
      const results = selectRelevantAPIs(objective, role);
      
      expect(results).toHaveLength(5);
      // Should prefer financial/data APIs for analyzer role
      const hasFinancialAPI = results.some(r => 
        r.api.category.includes('finance') || 
        r.api.category.includes('cryptocurrency') ||
        r.api.keywords.includes('bitcoin')
      );
      expect(hasFinancialAPI).toBe(true);
    });

    it('should select relevant APIs for coder role', () => {
      const objective = 'Implement REST API with database integration';
      const role: Role = 'coder';
      
      const results = selectRelevantAPIs(objective, role);
      
      expect(results).toHaveLength(5);
      // Should prefer development/tools APIs for coder role
      const hasDevelopmentAPI = results.some(r => 
        r.api.category.includes('development') ||
        r.api.keywords.includes('programming') ||
        r.api.keywords.includes('documentation')
      );
      expect(hasDevelopmentAPI).toBe(true);
    });

    it('should select UI-focused APIs for ui_architect role', () => {
      const objective = 'Design responsive dashboard layout';
      const role: Role = 'ui_architect';
      
      const results = selectRelevantAPIs(objective, role);
      
      expect(results).toHaveLength(5);
      // Should prefer art/design APIs for ui_architect role
      const hasDesignAPI = results.some(r => 
        r.api.category.includes('art') ||
        r.api.keywords.includes('design') ||
        r.api.keywords.includes('color')
      );
      expect(hasDesignAPI).toBe(true);
    });

    it('should return APIs sorted by relevance score', () => {
      const objective = 'Build authentication system';
      const role: Role = 'coder';
      
      const results = selectRelevantAPIs(objective, role);
      
      // Verify sorting by relevance score (descending)
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].relevance_score).toBeGreaterThanOrEqual(results[i + 1].relevance_score);
      }
    });

    it('should include role preference bonus in scoring', () => {
      const objective = 'Analyze data patterns';
      const role: Role = 'analyzer';
      
      const results = selectRelevantAPIs(objective, role);
      
      // Should have positive role preference bonus for relevant APIs
      const rolePreferredAPI = results.find(r => 
        ROLE_API_MAPPING[role].some(category => r.api.category === category)
      );
      
      if (rolePreferredAPI) {
        expect(rolePreferredAPI.role_preference_bonus).toBeGreaterThan(0);
      }
    });
  });

  describe('API Lookup Functions', () => {
    it('should find API by exact name', () => {
      const apiName = 'Cat Facts API';
      const api = getAPIByName(apiName);
      
      expect(api).not.toBeNull();
      expect(api?.name).toBe(apiName);
    });

    it('should return null for non-existent API', () => {
      const apiName = 'Non Existent API';
      const api = getAPIByName(apiName);
      
      expect(api).toBeNull();
    });

    it('should find APIs by category', () => {
      const category = 'animals';
      const apis = getAPIsByCategory(category);
      
      expect(apis.length).toBeGreaterThan(0);
      apis.forEach(api => {
        expect(api.category).toBe(category);
      });
    });

    it('should return empty array for non-existent category', () => {
      const category = 'non-existent-category';
      const apis = getAPIsByCategory(category);
      
      expect(apis).toHaveLength(0);
    });

    it('should filter public APIs (no auth required)', () => {
      const publicAPIs = getPublicAPIs();
      
      expect(publicAPIs.length).toBeGreaterThan(0);
      publicAPIs.forEach(api => {
        expect(api.auth_type).toBe('None');
      });
    });

    it('should filter high reliability APIs', () => {
      const minReliability = 0.9;
      const reliableAPIs = getHighReliabilityAPIs(minReliability);
      
      expect(reliableAPIs.length).toBeGreaterThan(0);
      reliableAPIs.forEach(api => {
        expect(api.reliability_score).toBeGreaterThanOrEqual(minReliability);
      });
    });
  });

  describe('Rate Limiting', () => {
    let rateLimiter: RateLimiter;

    beforeEach(() => {
      rateLimiter = new RateLimiter();
    });

    it('should allow requests within rate limit', () => {
      const apiName = 'test-api';
      const maxRequests = 5;
      const timeWindow = 60000; // 1 minute

      for (let i = 0; i < maxRequests; i++) {
        expect(rateLimiter.canMakeRequest(apiName, maxRequests, timeWindow)).toBe(true);
      }
    });

    it('should deny requests exceeding rate limit', () => {
      const apiName = 'test-api';
      const maxRequests = 3;
      const timeWindow = 60000;

      // Use up the limit
      for (let i = 0; i < maxRequests; i++) {
        rateLimiter.canMakeRequest(apiName, maxRequests, timeWindow);
      }

      // Next request should be denied
      expect(rateLimiter.canMakeRequest(apiName, maxRequests, timeWindow)).toBe(false);
    });

    it('should reset rate limit state', () => {
      const apiName = 'test-api';
      const maxRequests = 1;
      const timeWindow = 60000;

      // Use up the limit
      rateLimiter.canMakeRequest(apiName, maxRequests, timeWindow);
      expect(rateLimiter.canMakeRequest(apiName, maxRequests, timeWindow)).toBe(false);

      // Reset and try again
      rateLimiter.resetRateLimit(apiName);
      expect(rateLimiter.canMakeRequest(apiName, maxRequests, timeWindow)).toBe(true);
    });

    it('should provide rate limit status', () => {
      const apiName = 'test-api';
      const maxRequests = 5;
      const timeWindow = 60000;

      // Make some requests
      rateLimiter.canMakeRequest(apiName, maxRequests, timeWindow);
      rateLimiter.canMakeRequest(apiName, maxRequests, timeWindow);

      const status = rateLimiter.getRateLimitStatus(apiName);
      expect(status.tokens).toBe(3); // 5 - 2 = 3 remaining
      expect(status.requestCount).toBe(2);
    });

    it('should handle canUseAPI with rate limiting', () => {
      const apiName = 'Cat Facts API'; // Known API from registry
      
      // Should be able to use API initially
      expect(canUseAPI(apiName)).toBe(true);
    });
  });

  describe('API Registry Statistics', () => {
    it('should calculate correct registry statistics', () => {
      const stats = getAPIRegistryStats();
      
      expect(stats.total).toBeGreaterThan(0);
      expect(typeof stats.avgReliability).toBe('number');
      expect(stats.avgReliability).toBeGreaterThan(0);
      expect(stats.avgReliability).toBeLessThanOrEqual(1);
      
      expect(typeof stats.httpsPercentage).toBe('number');
      expect(stats.httpsPercentage).toBeGreaterThanOrEqual(0);
      expect(stats.httpsPercentage).toBeLessThanOrEqual(100);
      
      expect(typeof stats.corsPercentage).toBe('number');
      expect(stats.corsPercentage).toBeGreaterThanOrEqual(0);
      expect(stats.corsPercentage).toBeLessThanOrEqual(100);
      
      expect(typeof stats.byCategory).toBe('object');
      expect(typeof stats.byAuthType).toBe('object');
    });

    it('should count APIs by category correctly', () => {
      const stats = getAPIRegistryStats();
      
      // Should have animals category with multiple APIs
      expect(stats.byCategory.animals).toBeGreaterThan(0);
      
      // Verify total count matches sum of categories
      const categorySum = Object.values(stats.byCategory).reduce((sum, count) => sum + count, 0);
      expect(categorySum).toBe(stats.total);
    });

    it('should count APIs by auth type correctly', () => {
      const stats = getAPIRegistryStats();
      
      // Should have 'None' auth type (no-auth APIs)
      expect(stats.byAuthType.None).toBeGreaterThan(0);
      
      // Verify total count matches sum of auth types
      const authSum = Object.values(stats.byAuthType).reduce((sum, count) => sum + count, 0);
      expect(authSum).toBe(stats.total);
    });
  });

  describe('Claude API Selection Integration', () => {
    it('should generate valid API selection prompt', () => {
      const objective = 'Build weather dashboard';
      const role: Role = 'ui_architect';
      
      const prompt = generateAPISelectionPrompt(objective, role);
      
      expect(prompt).toContain(objective);
      expect(prompt).toContain(role);
      expect(prompt).toContain('JSON');
      expect(prompt).toContain('api_name');
      expect(prompt).toContain('relevance_score');
      expect(prompt).toContain('selection_reason');
    });

    it('should parse valid Claude API selection response', () => {
      const claudeResponse = `Here's my analysis:

\`\`\`json
[
  {
    "api_name": "Cat Facts API",
    "relevance_score": 0.95,
    "selection_reason": "Perfect for testing and demonstration"
  },
  {
    "api_name": "Dog API",
    "relevance_score": 0.90,
    "selection_reason": "Great for animal-related content"
  }
]
\`\`\`

These APIs are most relevant.`;

      const results = parseClaudeAPISelection(claudeResponse);
      
      expect(results).toHaveLength(2);
      expect(results[0].api.name).toBe('Cat Facts API');
      expect(results[0].relevance_score).toBe(0.95);
      expect(results[1].api.name).toBe('Dog API');
      expect(results[1].relevance_score).toBe(0.90);
    });

    it('should handle invalid Claude response gracefully', () => {
      const claudeResponse = 'This is not a valid JSON response';
      
      const results = parseClaudeAPISelection(claudeResponse);
      
      expect(results).toHaveLength(0);
    });

    it('should handle malformed JSON in Claude response', () => {
      const claudeResponse = `
\`\`\`json
[
  {
    api_name: "Missing quotes",
    "relevance_score": 0.95
  }
]
\`\`\``;

      const results = parseClaudeAPISelection(claudeResponse);
      
      expect(results).toHaveLength(0);
    });
  });

  describe('Markdown API Table Parsing', () => {
    it('should parse markdown table format', () => {
      const markdownContent = `
# APIs

| API | Description | URL | Category | Auth | HTTPS | CORS |
|-----|-------------|-----|----------|------|-------|------|
| Test API | Test description | https://test.com | testing | None | Yes | Yes |
| Another API | Another description | https://another.com | data | API Key | Yes | No |
`;

      const apis = parseMarkdownAPITable(markdownContent);
      
      expect(apis.length).toBeGreaterThanOrEqual(1);
      if (apis.length > 0) {
        expect(apis[0]).toHaveProperty('name');
        expect(apis[0]).toHaveProperty('description');
        expect(apis[0]).toHaveProperty('url');
        expect(apis[0]).toHaveProperty('category');
        expect(apis[0]).toHaveProperty('auth_type');
        expect(apis[0]).toHaveProperty('https');
        expect(apis[0]).toHaveProperty('cors');
        expect(apis[0]).toHaveProperty('reliability_score');
      }
    });

    it('should handle empty markdown content', () => {
      const markdownContent = '';
      
      const apis = parseMarkdownAPITable(markdownContent);
      
      expect(apis).toHaveLength(0);
    });

    it('should handle malformed markdown table', () => {
      const markdownContent = `
This is not a table format
Just some text
`;

      const apis = parseMarkdownAPITable(markdownContent);
      
      expect(apis).toHaveLength(0);
    });
  });

  describe('Sample API Registry Validation', () => {
    it('should have valid API registry structure', () => {
      expect(SAMPLE_API_REGISTRY).toBeDefined();
      expect(Array.isArray(SAMPLE_API_REGISTRY)).toBe(true);
      expect(SAMPLE_API_REGISTRY.length).toBeGreaterThan(0);
    });

    it('should have valid API endpoint structure', () => {
      SAMPLE_API_REGISTRY.forEach((api, index) => {
        expect(api).toHaveProperty('name');
        expect(api).toHaveProperty('description');
        expect(api).toHaveProperty('url');
        expect(api).toHaveProperty('category');
        expect(api).toHaveProperty('keywords');
        expect(api).toHaveProperty('auth_type');
        expect(api).toHaveProperty('https');
        expect(api).toHaveProperty('cors');
        expect(api).toHaveProperty('reliability_score');
        
        expect(typeof api.name).toBe('string');
        expect(typeof api.description).toBe('string');
        expect(typeof api.url).toBe('string');
        expect(typeof api.category).toBe('string');
        expect(Array.isArray(api.keywords)).toBe(true);
        expect(['None', 'API Key', 'OAuth']).toContain(api.auth_type);
        expect(typeof api.https).toBe('boolean');
        expect(typeof api.cors).toBe('boolean');
        expect(typeof api.reliability_score).toBe('number');
        expect(api.reliability_score).toBeGreaterThanOrEqual(0);
        expect(api.reliability_score).toBeLessThanOrEqual(1);
      });
    });

    it('should have role API mapping for all roles', () => {
      const validRoles: Role[] = ['planner', 'coder', 'critic', 'researcher', 'analyzer', 'synthesizer', 'ui_architect', 'ui_implementer', 'ui_refiner'];
      
      validRoles.forEach(role => {
        expect(ROLE_API_MAPPING).toHaveProperty(role);
        expect(Array.isArray(ROLE_API_MAPPING[role])).toBe(true);
      });
    });

    it('should have APIs covering multiple categories', () => {
      const categories = [...new Set(SAMPLE_API_REGISTRY.map(api => api.category))];
      
      expect(categories.length).toBeGreaterThan(5); // Should have diverse categories
      expect(categories).toContain('animals'); // Known category
      expect(categories).toContain('entertainment'); // Known category
    });
  });
});