/**
 * API Search Tool
 * Extracted from index.ts to provide modular tool architecture
 */

import { BaseTool, ToolSchema, ToolResult } from './base-tool.js';
import { selectRelevantAPIs } from '../core/api-registry.js';
import { Role } from '../core/types.js';

export interface APISearchArgs {
  objective: string;
  user_role: Role;
  max_results?: number;
  category_filter?: string;
}

/**
 * API Search Tool
 * Intelligent API discovery with role-based filtering
 */
export class APISearchTool extends BaseTool {
  readonly name = 'APISearch';
  readonly description =
    'Intelligent API discovery with role-based filtering - searches the API registry to find relevant APIs based on objective context and user role';

  readonly inputSchema: ToolSchema = {
    type: 'object',
    properties: {
      objective: {
        type: 'string',
        description: 'The goal or task requiring API data',
      },
      user_role: {
        type: 'string',
        enum: [
          'planner',
          'coder',
          'critic',
          'researcher',
          'analyzer',
          'synthesizer',
          'ui_architect',
          'ui_implementer',
          'ui_refiner',
        ],
        description: 'User role for preference-based filtering',
      },
      max_results: {
        type: 'number',
        description: 'Maximum number of APIs to return (default: 5)',
      },
      category_filter: {
        type: 'string',
        description: 'Optional category to filter by',
      },
    },
    required: ['objective', 'user_role'],
  };

  /**
   * Handle API Search execution
   */
  async handle(args: APISearchArgs): Promise<ToolResult> {
    try {
      this.validateArgs(args);

      // Validate required parameters
      if (!args.objective || typeof args.objective !== 'string') {
        throw new Error('objective is required and must be a non-empty string');
      }

      if (!args.user_role || typeof args.user_role !== 'string') {
        throw new Error('user_role is required and must be a valid role');
      }

      // Validate user_role enum
      const validRoles: Role[] = [
        'planner',
        'coder',
        'critic',
        'researcher',
        'analyzer',
        'synthesizer',
        'ui_architect',
        'ui_implementer',
        'ui_refiner',
      ];
      if (!validRoles.includes(args.user_role as Role)) {
        throw new Error(
          `Invalid user_role: ${args.user_role}. Must be one of: ${validRoles.join(', ')}`
        );
      }

      // Validate optional parameters
      const maxResults = args.max_results ?? 5;
      if (typeof maxResults !== 'number' || maxResults < 1 || maxResults > 20) {
        throw new Error('max_results must be a number between 1 and 20');
      }

      const categoryFilter = args.category_filter;
      if (categoryFilter && typeof categoryFilter !== 'string') {
        throw new Error('category_filter must be a string');
      }

      // Call the API registry function
      const apiResults = selectRelevantAPIs(args.objective, args.user_role as Role);

      // Apply filters
      let filteredResults = apiResults;

      // Apply category filter if provided
      if (categoryFilter) {
        filteredResults = apiResults.filter(result =>
          result.api.category.toLowerCase().includes(categoryFilter.toLowerCase())
        );
      }

      // Apply max_results limit
      filteredResults = filteredResults.slice(0, maxResults);

      // Format API list for response
      const apiList = filteredResults
        .map((result, index) => {
          const api = result.api;
          const relevancePercent = (result.relevance_score * 100).toFixed(1);
          const keywords =
            result.matching_keywords.length > 0 ? result.matching_keywords.join(', ') : 'none';
          const rateLimit = api.rate_limits
            ? `${api.rate_limits.requests}/${api.rate_limits.timeWindow}`
            : 'unlimited';

          return `### ${index + 1}. ${api.name}
**Category**: ${api.category}
**Description**: ${api.description}
**URL**: ${api.url}
**Auth**: ${api.auth_type}
**HTTPS**: ${api.https ? '✓' : '✗'} | **CORS**: ${api.cors ? '✓' : '✗'}
**Reliability**: ${(api.reliability_score * 100).toFixed(1)}%
**Rate Limits**: ${rateLimit}
**Relevance Score**: ${relevancePercent}%
**Matching Keywords**: ${keywords}
**Role Preference Bonus**: ${result.role_preference_bonus > 0 ? '+' + (result.role_preference_bonus * 100).toFixed(1) + '%' : 'none'}

`;
        })
        .join('');

      // Generate response text
      const responseText = `# 🔍 API Discovery Results

**Objective**: ${args.objective}
**Role**: ${args.user_role}
**APIs Found**: ${filteredResults.length}${categoryFilter ? ` (filtered by category: ${categoryFilter})` : ''}

## Recommended APIs:

${apiList}

## Discovery Summary
- **Total APIs analyzed**: ${apiResults.length}
- **Results after filtering**: ${filteredResults.length}
- **Average relevance score**: ${filteredResults.length > 0 ? ((filteredResults.reduce((sum, r) => sum + r.relevance_score, 0) / filteredResults.length) * 100).toFixed(1) + '%' : 'N/A'}
- **Role-based matches**: ${filteredResults.filter(r => r.role_preference_bonus > 0).length}

## Integration Guidance
The APIs above are ranked by relevance to your objective and role preferences. Consider:
1. **Reliability scores** for production use
2. **Authentication requirements** for implementation complexity
3. **Rate limits** for usage planning
4. **CORS support** for browser-based applications

---
*Generated by Iron Manus API Registry System*`;

      return this.createResponse(responseText);
    } catch (error) {
      console.error('APISearch Error:', error);

      const errorResponse = `# ERROR API Search Error

**Error**: ${error instanceof Error ? error.message : 'Unknown error'}

## Recovery Protocol
1. **Objective**: Provide a clear, descriptive goal or task requiring API data
2. **User Role**: Must be one of: planner, coder, critic, researcher, analyzer, synthesizer, ui_architect, ui_implementer, ui_refiner
3. **Max Results**: Optional number between 1-20 (default: 5)
4. **Category Filter**: Optional string to filter APIs by category

## 📖 **Usage Example**
\`\`\`json
{
  "objective": "Get real-time cryptocurrency prices for trading dashboard",
  "user_role": "coder",
  "max_results": 10,
  "category_filter": "cryptocurrency"
}
\`\`\`

**Next Action**: Call APISearch with corrected parameters.`;

      return this.createResponse(errorResponse);
    }
  }
}
