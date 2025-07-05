/**
 * API Search Tool
 * Extracted from index.ts to provide modular tool architecture
 */

import { BaseTool, ToolSchema, ToolResult } from './base-tool.js';
import { selectRelevantAPIs } from '../core/api-registry.js';
import { Role } from '../core/types.js';
import logger from '../utils/logger.js';

export interface APISearchArgs {
  objective: string; // Strategic intent - precise problem framing
  user_role: Role; // Cognitive perspective - analytical mindset
  max_results?: number; // Discovery scope - decision-making capacity
  category_filter?: string; // Domain focus - relevance constraint
}

/**
 * API Search Tool
 * Intelligent API discovery with role-based filtering
 */
export class APISearchTool extends BaseTool {
  readonly name = 'APISearch';
  readonly description =
    "Strategic API discovery through role-based cognitive filtering. When facing data needs, ask: What kind of thinker am I being right now? How does my current role (planner, coder, researcher) shape what data will be most valuable? This tool doesn't just find APIs - it helps you discover which data sources align with your cognitive approach and strategic objectives. Use it to challenge yourself: Am I seeking the right type of evidence for my current thinking mode?";

  readonly inputSchema: ToolSchema = {
    type: 'object',
    properties: {
      objective: {
        type: 'string',
        description:
          'Strategic intent - What specific problem are you trying to understand or solve? Frame this as a precise question that guides discovery of the most relevant data sources.',
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
        description:
          'Cognitive perspective - What type of thinking are you applying right now? Each role seeks different evidence and approaches problems uniquely. Choose the lens that matches your current analytical mindset.',
      },
      max_results: {
        type: 'number',
        description:
          'Discovery scope (default: 5) - How many options do you need to make an informed choice without overwhelming your decision-making capacity?',
      },
      category_filter: {
        type: 'string',
        description:
          'Domain focus - What specific knowledge domain should constrain your search to maintain relevance and depth?',
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

## Strategic Selection Framework
These APIs are ranked by cognitive alignment with your role and objective. Ask yourself:

**Role Resonance**: Which APIs naturally fit your current thinking mode? How do role-based matches reveal the type of evidence you unconsciously seek?

**Objective Alignment**: Do the highest-relevance APIs actually serve your deeper strategic intent? What assumptions about data needs might you be missing?

**Quality vs. Accessibility Trade-offs**: How do reliability scores balance against ease of implementation? What does this tension reveal about your project priorities?

**Constraint Wisdom**: How do rate limits and authentication requirements guide you toward sustainable data relationships? What do these constraints teach about responsible API usage?

**Discovery Gaps**: What's missing from these results? Should you reconsider your role choice or refine your objective to uncover different data perspectives?

---
*Generated by Iron Manus API Registry System*`;

      return this.createResponse(responseText);
    } catch (error) {
      logger.error('APISearch Error:', error);

      const errorResponse = `# ERROR API Search Error

**Error**: ${error instanceof Error ? error.message : 'Unknown error'}

## Cognitive Recalibration Framework

**Strategic Self-Reflection Questions:**

🎯 **Objective Clarity**: Is your stated objective actually what you're trying to achieve? Are you being specific enough, or too narrow? What might you be unconsciously seeking that you haven't articulated?

🧠 **Role Authenticity**: Does your chosen role genuinely reflect how you're thinking about this problem right now? What if you switched perspectives - would a different role reveal new data needs?

🔬 **Scope Wisdom**: Are you asking for the right number of options? Too few might miss opportunities, too many might overwhelm decision-making. What does your choice reveal about your comfort with ambiguity?

📚 **Domain Boundaries**: If you used a category filter, what assumptions about relevance might you be making? What adjacent domains could offer unexpected insights?

**Discovery Enhancement Prompts:**
- What would happen if you reframed your objective as a question rather than a statement?
- How might someone from a completely different field approach this data need?
- What are you afraid of finding (or not finding) in the results?
- If this search fails, what would that teach you about your actual information needs?

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
