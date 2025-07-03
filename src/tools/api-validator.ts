/**
 * API Validator Tool
 * Validates and auto-corrects API endpoints
 */

import { BaseTool, ToolSchema, ToolResult } from './base-tool.js';
import { APIEndpoint } from '../core/api-registry.js';
import { validateAndSanitizeURL } from '../security/ssrfGuard.js';
import axios from 'axios';

export interface APIValidatorArgs {
  api_endpoint: APIEndpoint;
  auto_correct?: boolean;
}

export interface ValidationResult {
  original_url: string;
  working_url?: string;
  status: 'working' | 'failed' | 'corrected';
  response_code?: number;
  error_message?: string;
  suggested_alternatives?: string[];
  documentation_link?: string;
}

/**
 * API Validator Tool
 * Tests API endpoints and suggests corrections
 */
export class APIValidatorTool extends BaseTool {
  readonly name = 'APIValidator';
  readonly description = 'Validates API endpoints and suggests corrections for failed requests';

  readonly inputSchema: ToolSchema = {
    type: 'object',
    properties: {
      api_endpoint: {
        type: 'object',
        description: 'API endpoint to validate',
      },
      auto_correct: {
        type: 'boolean',
        description: 'Attempt to auto-correct failed endpoints (default: true)',
      },
    },
    required: ['api_endpoint'],
  };

  /**
   * Handle API validation
   */
  async handle(args: APIValidatorArgs): Promise<ToolResult> {
    try {
      this.validateArgs(args);

      const endpoint = args.api_endpoint;
      const autoCorrect = args.auto_correct ?? true;

      // Test the primary endpoint
      const primaryResult = await this.testEndpoint(endpoint.url);

      if (primaryResult.working) {
        return this.createResponse(this.formatSuccessResponse(endpoint.url, primaryResult));
      }

      // If primary failed and auto-correct is enabled, try alternatives
      if (autoCorrect && endpoint.endpoint_patterns) {
        for (const pattern of endpoint.endpoint_patterns) {
          const result = await this.testEndpoint(pattern);
          if (result.working) {
            return this.createResponse(
              this.formatCorrectedResponse(
                endpoint.url,
                pattern,
                primaryResult,
                result,
                endpoint.documentation_url
              )
            );
          }
        }
      }

      // All attempts failed
      return this.createResponse(
        this.formatFailureResponse(
          endpoint.url,
          primaryResult,
          endpoint.endpoint_patterns || [],
          endpoint.documentation_url
        )
      );
    } catch (error) {
      console.error('API Validator Error:', error);
      return this.createErrorResponse(error instanceof Error ? error : String(error));
    }
  }

  /**
   * Test a single endpoint
   */
  private async testEndpoint(
    url: string
  ): Promise<{ working: boolean; code?: number; error?: string }> {
    try {
      // SSRF Protection: Validate and sanitize URL before making request
      const sanitizedUrl = validateAndSanitizeURL(url);
      if (!sanitizedUrl) {
        return {
          working: false,
          error: 'URL blocked by SSRF protection - invalid or dangerous URL',
        };
      }

      const response = await axios.get(sanitizedUrl, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Iron-Manus-API-Validator/0.2.4',
        },
      });

      return {
        working: true,
        code: response.status,
      };
    } catch (error: any) {
      return {
        working: false,
        code: error.response?.status,
        error: error.message,
      };
    }
  }

  /**
   * Format success response
   */
  private formatSuccessResponse(url: string, result: any): string {
    return `# SUCCESS API Validation Success

**Endpoint**: ${url}
**Status**: Working correctly
**Response Code**: ${result.code}

## Integration Ready
This endpoint is validated and ready for use in MultiAPIFetch.`;
  }

  /**
   * Format corrected response
   */
  private formatCorrectedResponse(
    originalUrl: string,
    workingUrl: string,
    originalResult: any,
    workingResult: any,
    docUrl?: string
  ): string {
    return `# INFO API Endpoint Auto-Corrected

**Original URL**: ${originalUrl}
**Working URL**: ${workingUrl}

## ⚠️ Issue Found
- **Original Error**: HTTP ${originalResult.code || 'Unknown'} - ${originalResult.error}
- **Corrected Status**: HTTP ${workingResult.code} - Working

## Recommendation
Use the corrected URL: \`${workingUrl}\`

${
  docUrl
    ? `## 📚 Documentation
Verify endpoint structure at: ${docUrl}`
    : ''
}

## 🔄 Auto-Update
The API registry should be updated with the working endpoint.`;
  }

  /**
   * Format failure response
   */
  private formatFailureResponse(
    originalUrl: string,
    result: any,
    patterns: string[],
    docUrl?: string
  ): string {
    const alternatives =
      patterns.length > 0
        ? `\n## 🔍 Attempted Alternatives\n${patterns.map(p => `- ${p} (failed)`).join('\n')}`
        : '';

    const documentation = docUrl ? `\n## 📚 Check Documentation\n${docUrl}` : '';

    return `# ERROR API Validation Failed

**Endpoint**: ${originalUrl}
**Error**: HTTP ${result.code || 'Unknown'} - ${result.error}

## 🚨 All Endpoints Failed
${alternatives}

## Recommended Actions
1. **Check API Status**: Service may be down or deprecated
2. **Verify Documentation**: API structure may have changed
3. **Try Manual Testing**: Test endpoints in browser or Postman
4. **Contact API Provider**: Report the issue if service should be working

${documentation}

## Fallback Strategy
Consider using alternative APIs for this functionality.`;
  }
}
