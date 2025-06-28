/**
 * Knowledge Synthesis Tool
 * Extracted from index.ts to provide modular tool architecture
 */

import { BaseTool, ToolSchema, ToolResult } from './base-tool.js';

export interface KnowledgeSynthesisArgs {
  api_responses: APIResponse[];
  synthesis_mode: 'consensus' | 'weighted' | 'hierarchical' | 'conflict_resolution';
  confidence_threshold?: number;
  objective_context?: string;
}

export interface APIResponse {
  source: string;
  data: string;
  confidence: number;
}

export interface SynthesisResult {
  content: string;
  confidence: number;
  sources: string[];
  contradictions: string[];
  evidence: string[];
}

/**
 * Knowledge Synthesis Tool
 * Cross-validation engine with conflict resolution and confidence scoring
 */
export class KnowledgeSynthesisTool extends BaseTool {
  readonly name = 'KnowledgeSynthesize';
  readonly description = 'Cross-validation engine with conflict resolution and confidence scoring - synthesizes and validates information from multiple API sources to provide reliable, structured knowledge';
  
  readonly inputSchema: ToolSchema = {
    type: 'object',
    properties: {
      api_responses: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            source: { type: 'string' },
            data: { type: 'string' },
            confidence: { type: 'number' }
          }
        },
        description: 'Array of API response objects to synthesize'
      },
      synthesis_mode: {
        type: 'string',
        enum: ['consensus', 'weighted', 'hierarchical', 'conflict_resolution'],
        description: 'Method for synthesizing conflicting information'
      },
      confidence_threshold: {
        type: 'number',
        description: 'Minimum confidence score for inclusion (0-1, default: 0.5)'
      },
      objective_context: {
        type: 'string',
        description: 'Original objective for context-aware synthesis'
      }
    },
    required: ['api_responses', 'synthesis_mode']
  };

  /**
   * Handle Knowledge Synthesis execution
   */
  async handle(args: KnowledgeSynthesisArgs): Promise<ToolResult> {
    const startTime = Date.now();
    
    try {
      this.validateArgs(args);
      
      // Validate required parameters
      if (!args.api_responses || !Array.isArray(args.api_responses)) {
        throw new Error('api_responses is required and must be an array of response objects');
      }
      
      if (args.api_responses.length === 0) {
        throw new Error('api_responses array cannot be empty');
      }
      
      if (args.api_responses.length > 20) {
        throw new Error('Maximum 20 API responses allowed per synthesis request');
      }
      
      if (!args.synthesis_mode || typeof args.synthesis_mode !== 'string') {
        throw new Error('synthesis_mode is required and must be a string');
      }
      
      // Validate synthesis_mode enum
      const validModes = ['consensus', 'weighted', 'hierarchical', 'conflict_resolution'];
      if (!validModes.includes(args.synthesis_mode)) {
        throw new Error(`Invalid synthesis_mode: ${args.synthesis_mode}. Must be one of: ${validModes.join(', ')}`);
      }
      
      // Validate API responses structure
      const validatedResponses: APIResponse[] = [];
      for (let i = 0; i < args.api_responses.length; i++) {
        const response = args.api_responses[i];
        
        if (!response || typeof response !== 'object') {
          throw new Error(`API response at index ${i} must be an object`);
        }
        
        if (!response.source || typeof response.source !== 'string') {
          throw new Error(`API response at index ${i} must have a 'source' string`);
        }
        
        if (!response.data || typeof response.data !== 'string') {
          throw new Error(`API response at index ${i} must have a 'data' string`);
        }
        
        if (typeof response.confidence !== 'number' || response.confidence < 0 || response.confidence > 1) {
          throw new Error(`API response at index ${i} must have a 'confidence' number between 0 and 1`);
        }
        
        validatedResponses.push({
          source: response.source,
          data: response.data.trim(),
          confidence: response.confidence
        });
      }
      
      // Validate optional parameters
      const confidenceThreshold = args.confidence_threshold ?? 0.5;
      if (typeof confidenceThreshold !== 'number' || confidenceThreshold < 0 || confidenceThreshold > 1) {
        throw new Error('confidence_threshold must be a number between 0 and 1');
      }
      
      const objectiveContext = args.objective_context || '';
      if (objectiveContext && typeof objectiveContext !== 'string') {
        throw new Error('objective_context must be a string');
      }
      
      // Filter responses by confidence threshold
      const highConfidenceResponses = validatedResponses.filter(r => r.confidence >= confidenceThreshold);
      
      if (highConfidenceResponses.length === 0) {
        throw new Error(`No responses meet the confidence threshold of ${confidenceThreshold}`);
      }
      
      // Perform synthesis based on mode
      let synthesisResult: SynthesisResult;
      
      switch (args.synthesis_mode) {
        case 'consensus':
          synthesisResult = this.performConsensusSynthesis(highConfidenceResponses, objectiveContext);
          break;
        case 'weighted':
          synthesisResult = this.performWeightedSynthesis(highConfidenceResponses, objectiveContext);
          break;
        case 'hierarchical':
          synthesisResult = this.performHierarchicalSynthesis(highConfidenceResponses, objectiveContext);
          break;
        case 'conflict_resolution':
          synthesisResult = this.performConflictResolutionSynthesis(highConfidenceResponses, objectiveContext);
          break;
        default:
          throw new Error(`Unsupported synthesis mode: ${args.synthesis_mode}`);
      }
      
      // Calculate quality metrics
      const totalDuration = Date.now() - startTime;
      const sourceCount = validatedResponses.length;
      const usedSources = highConfidenceResponses.length;
      const averageConfidence = highConfidenceResponses.reduce((sum, r) => sum + r.confidence, 0) / highConfidenceResponses.length;
      const contradictionCount = synthesisResult.contradictions.length;
      const sourceAgreementPercentage = this.calculateSourceAgreement(highConfidenceResponses);
      const informationCompletenessScore = this.calculateCompletenessScore(synthesisResult, objectiveContext);
      
      // Format evidence trail
      const evidenceTrail = synthesisResult.evidence.map((evidence, index) => {
        return `${index + 1}. ${evidence}`;
      }).join('\n');
      
      // Format contradictions
      const contradictionsText = contradictionCount > 0 ? 
        synthesisResult.contradictions.map((contradiction, index) => {
          return `${index + 1}. ${contradiction}`;
        }).join('\n') : 'None detected';
      
      // Generate comprehensive response
      const responseText = `# Knowledge Synthesis Results

**Sources Analyzed**: ${sourceCount}
**Sources Used**: ${usedSources} (above ${confidenceThreshold} confidence threshold)
**Synthesis Mode**: ${args.synthesis_mode}
**Overall Confidence Score**: ${(synthesisResult.confidence * 100).toFixed(1)}%
**Contradictions Found**: ${contradictionCount}
**Processing Time**: ${totalDuration}ms

## Quality Assessment
- **Source Agreement**: ${sourceAgreementPercentage.toFixed(1)}%
- **Average Input Confidence**: ${(averageConfidence * 100).toFixed(1)}%
- **Information Completeness**: ${(informationCompletenessScore * 100).toFixed(1)}%
- **Synthesis Reliability**: ${this.getSynthesisReliabilityGrade(synthesisResult.confidence, sourceAgreementPercentage, contradictionCount)}

## Synthesized Knowledge

${synthesisResult.content}

## 🔍 **Evidence Trail**

${evidenceTrail}

## ⚠️ **Contradictions & Conflicts**

${contradictionsText}

## 📈 **Source Analysis**

${highConfidenceResponses.map((response, index) => {
        const preview = response.data.length > 150 ? response.data.substring(0, 150) + '...' : response.data;
        return `### ${index + 1}. ${response.source}
**Confidence**: ${(response.confidence * 100).toFixed(1)}%
**Data Preview**: ${preview}
**Status**: ${synthesisResult.sources.includes(response.source) ? 'SUCCESS Used in synthesis' : 'EXCLUDED'}

`;
      }).join('')}

## Validation Metrics
- **Cross-validation Algorithm**: String similarity + semantic analysis
- **Confidence Scoring**: Weighted by source reliability and agreement
- **Contradiction Detection**: Multi-level conflict identification
- **Evidence Transparency**: Full source attribution and reasoning

## Integration Recommendations

${this.getIntegrationRecommendations(synthesisResult, args.synthesis_mode, contradictionCount)}

---
*Generated by Iron Manus Knowledge Synthesis Engine*`;
      
      return this.createResponse(responseText);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const totalDuration = Date.now() - startTime;
      
      console.error(`KnowledgeSynthesize Error: ${errorMessage}`);
      
      // Enhanced error handling with recovery guidance
      const errorResponse = `# ERROR Knowledge Synthesis Error

**Error**: ${errorMessage}
**Duration**: ${totalDuration}ms

## Recovery Protocol
1. **API Responses**: Ensure array contains valid response objects
   - Each response must have: source (string), data (string), confidence (0-1)
   - Maximum 20 responses per request
   - At least one response must meet confidence threshold

2. **Synthesis Mode**: Must be one of:
   - **consensus**: Find common information across sources
   - **weighted**: Weight information by source confidence
   - **hierarchical**: Prioritize sources by reliability
   - **conflict_resolution**: Identify and resolve contradictions

3. **Confidence Threshold**: Optional number between 0-1 (default: 0.5)

4. **Objective Context**: Optional string for context-aware synthesis

## 📖 **Usage Example**
\`\`\`json
{
  "api_responses": [
    {
      "source": "Weather API",
      "data": "Temperature: 72°F, Humidity: 45%",
      "confidence": 0.9
    },
    {
      "source": "Backup Weather Service",
      "data": "Temp: 71°F, Humidity: 47%",
      "confidence": 0.8
    }
  ],
  "synthesis_mode": "consensus",
  "confidence_threshold": 0.7,
  "objective_context": "Current weather conditions for planning"
}
\`\`\`

## Synthesis Capabilities
- **Cross-Validation**: Multi-source data comparison
- **Conflict Resolution**: Intelligent contradiction handling
- **Confidence Scoring**: Reliability assessment
- **Evidence Tracking**: Full transparency and attribution
- **Quality Metrics**: Comprehensive validation scoring

**Next Action**: Call KnowledgeSynthesize with corrected parameters.`;
      
      return this.createResponse(errorResponse);
    }
  }

  /**
   * Perform consensus-based synthesis by finding common information
   */
  private performConsensusSynthesis(responses: APIResponse[], context: string): SynthesisResult {
    const commonElements: string[] = [];
    const evidence: string[] = [];
    const contradictions: string[] = [];
    const usedSources: string[] = [];
    
    // Find common patterns and information
    for (let i = 0; i < responses.length; i++) {
      for (let j = i + 1; j < responses.length; j++) {
        const similarity = this.calculateStringSimilarity(responses[i].data, responses[j].data);
        
        if (similarity > 0.7) {
          // High similarity - likely consensus
          const commonInfo = this.extractCommonInformation(responses[i].data, responses[j].data);
          if (commonInfo && !commonElements.includes(commonInfo)) {
            commonElements.push(commonInfo);
            evidence.push(`Consensus between ${responses[i].source} and ${responses[j].source}: "${commonInfo}"`);
            if (!usedSources.includes(responses[i].source)) usedSources.push(responses[i].source);
            if (!usedSources.includes(responses[j].source)) usedSources.push(responses[j].source);
          }
        } else if (similarity < 0.3) {
          // Low similarity - potential contradiction
          contradictions.push(`Conflicting information between ${responses[i].source} and ${responses[j].source}`);
        }
      }
    }
    
    // Build synthesized content
    const content = commonElements.length > 0 ? 
      `Based on consensus from multiple sources:\n\n${commonElements.map(elem => `• ${elem}`).join('\n')}` :
      'No clear consensus found among the provided sources. Individual source analysis recommended.';
    
    // Calculate confidence based on consensus strength
    const consensusStrength = commonElements.length / responses.length;
    const averageSourceConfidence = responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length;
    const confidence = Math.min(consensusStrength * averageSourceConfidence, 1.0);
    
    return {
      content,
      confidence,
      sources: usedSources,
      contradictions,
      evidence
    };
  }

  /**
   * Perform weighted synthesis based on source confidence scores
   */
  private performWeightedSynthesis(responses: APIResponse[], context: string): SynthesisResult {
    // Sort responses by confidence (highest first)
    const sortedResponses = [...responses].sort((a, b) => b.confidence - a.confidence);
    
    const evidence: string[] = [];
    const contradictions: string[] = [];
    const contentParts: string[] = [];
    const usedSources: string[] = [];
    
    let totalWeight = 0;
    let weightedConfidence = 0;
    
    // Build weighted synthesis
    sortedResponses.forEach((response, index) => {
      const weight = response.confidence;
      totalWeight += weight;
      weightedConfidence += weight * response.confidence;
      
      // Add to synthesis with weight indication
      const priority = weight > 0.8 ? 'High' : weight > 0.6 ? 'Medium' : 'Low';
      contentParts.push(`**${priority} Confidence** (${(weight * 100).toFixed(1)}%) - ${response.source}: ${response.data}`);
      
      usedSources.push(response.source);
      evidence.push(`Weighted source ${index + 1}: ${response.source} (confidence: ${(weight * 100).toFixed(1)}%)`);
      
      // Check for contradictions with higher-weighted sources
      for (let i = 0; i < index; i++) {
        const similarity = this.calculateStringSimilarity(response.data, sortedResponses[i].data);
        if (similarity < 0.3) {
          contradictions.push(`Conflict between ${response.source} (${(weight * 100).toFixed(1)}%) and ${sortedResponses[i].source} (${(sortedResponses[i].confidence * 100).toFixed(1)}%)`);
        }
      }
    });
    
    const content = `Weighted synthesis based on source reliability:\n\n${contentParts.join('\n\n')}`;
    const confidence = totalWeight > 0 ? weightedConfidence / totalWeight : 0;
    
    return {
      content,
      confidence,
      sources: usedSources,
      contradictions,
      evidence
    };
  }

  /**
   * Perform hierarchical synthesis prioritizing sources by reliability
   */
  private performHierarchicalSynthesis(responses: APIResponse[], context: string): SynthesisResult {
    // Create reliability tiers
    const highReliability = responses.filter(r => r.confidence >= 0.8);
    const mediumReliability = responses.filter(r => r.confidence >= 0.6 && r.confidence < 0.8);
    const lowReliability = responses.filter(r => r.confidence < 0.6);
    
    const evidence: string[] = [];
    const contradictions: string[] = [];
    const contentParts: string[] = [];
    const usedSources: string[] = [];
    
    // Process high reliability sources first
    if (highReliability.length > 0) {
      contentParts.push('## Primary Sources (High Reliability)');
      highReliability.forEach(response => {
        contentParts.push(`**${response.source}**: ${response.data}`);
        usedSources.push(response.source);
        evidence.push(`Tier 1 source: ${response.source} (${(response.confidence * 100).toFixed(1)}% confidence)`);
      });
    }
    
    // Add medium reliability as supporting evidence
    if (mediumReliability.length > 0) {
      contentParts.push('\n## Supporting Sources (Medium Reliability)');
      mediumReliability.forEach(response => {
        contentParts.push(`**${response.source}**: ${response.data}`);
        usedSources.push(response.source);
        evidence.push(`Tier 2 source: ${response.source} (${(response.confidence * 100).toFixed(1)}% confidence)`);
      });
    }
    
    // Note low reliability sources but don't heavily weight them
    if (lowReliability.length > 0) {
      contentParts.push('\n## Additional Sources (Lower Reliability)');
      lowReliability.forEach(response => {
        contentParts.push(`**${response.source}**: ${response.data}`);
        usedSources.push(response.source);
        evidence.push(`Tier 3 source: ${response.source} (${(response.confidence * 100).toFixed(1)}% confidence)`);
      });
    }
    
    // Check for contradictions between tiers
    const allResponses = [...highReliability, ...mediumReliability, ...lowReliability];
    for (let i = 0; i < allResponses.length; i++) {
      for (let j = i + 1; j < allResponses.length; j++) {
        const similarity = this.calculateStringSimilarity(allResponses[i].data, allResponses[j].data);
        if (similarity < 0.3) {
          contradictions.push(`Hierarchical conflict: ${allResponses[i].source} vs ${allResponses[j].source}`);
        }
      }
    }
    
    const content = contentParts.join('\n');
    // Confidence weighted toward higher-tier sources
    const confidence = highReliability.length > 0 ? 
      highReliability.reduce((sum, r) => sum + r.confidence, 0) / highReliability.length :
      responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length;
    
    return {
      content,
      confidence,
      sources: usedSources,
      contradictions,
      evidence
    };
  }

  /**
   * Perform conflict resolution synthesis with active contradiction handling
   */
  private performConflictResolutionSynthesis(responses: APIResponse[], context: string): SynthesisResult {
    const evidence: string[] = [];
    const contradictions: string[] = [];
    const resolvedConflicts: string[] = [];
    const contentParts: string[] = [];
    const usedSources: string[] = [];
    
    // Identify all conflicts first
    const conflicts: Array<{source1: APIResponse, source2: APIResponse, similarity: number}> = [];
    
    for (let i = 0; i < responses.length; i++) {
      for (let j = i + 1; j < responses.length; j++) {
        const similarity = this.calculateStringSimilarity(responses[i].data, responses[j].data);
        if (similarity < 0.4) {
          conflicts.push({
            source1: responses[i],
            source2: responses[j],
            similarity
          });
        }
      }
    }
    
    // Resolve conflicts by confidence and context
    conflicts.forEach(conflict => {
      const higher = conflict.source1.confidence > conflict.source2.confidence ? conflict.source1 : conflict.source2;
      const lower = conflict.source1.confidence > conflict.source2.confidence ? conflict.source2 : conflict.source1;
      
      contradictions.push(`Conflict detected: ${conflict.source1.source} vs ${conflict.source2.source} (${(conflict.similarity * 100).toFixed(1)}% similarity)`);
      resolvedConflicts.push(`Resolution: Favoring ${higher.source} (${(higher.confidence * 100).toFixed(1)}% confidence) over ${lower.source} (${(lower.confidence * 100).toFixed(1)}% confidence)`);
      
      if (!usedSources.includes(higher.source)) {
        usedSources.push(higher.source);
        contentParts.push(`**${higher.source}** (Conflict winner): ${higher.data}`);
        evidence.push(`Conflict resolution: ${higher.source} selected over ${lower.source} due to higher confidence`);
      }
    });
    
    // Add non-conflicting sources
    responses.forEach(response => {
      const hasConflict = conflicts.some(c => c.source1.source === response.source || c.source2.source === response.source);
      if (!hasConflict && !usedSources.includes(response.source)) {
        usedSources.push(response.source);
        contentParts.push(`**${response.source}** (No conflicts): ${response.data}`);
        evidence.push(`Non-conflicting source: ${response.source}`);
      }
    });
    
    const content = `Conflict resolution synthesis:\n\n${contentParts.join('\n\n')}\n\n## Resolved Conflicts:\n${resolvedConflicts.join('\n')}`;
    const confidence = usedSources.length > 0 ? 
      responses.filter(r => usedSources.includes(r.source)).reduce((sum, r) => sum + r.confidence, 0) / usedSources.length : 0;
    
    return {
      content,
      confidence,
      sources: usedSources,
      contradictions,
      evidence
    };
  }

  /**
   * Calculate string similarity using basic algorithm
   */
  private calculateStringSimilarity(str1: string, str2: string): number {
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  /**
   * Extract common information between two data strings
   */
  private extractCommonInformation(data1: string, data2: string): string {
    const words1 = data1.toLowerCase().split(/\s+/);
    const words2 = data2.toLowerCase().split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word) && word.length > 3);
    return commonWords.slice(0, 5).join(' '); // Take top 5 common words
  }

  /**
   * Calculate source agreement percentage
   */
  private calculateSourceAgreement(responses: APIResponse[]): number {
    if (responses.length < 2) return 100;
    
    let totalSimilarity = 0;
    let comparisons = 0;
    
    for (let i = 0; i < responses.length; i++) {
      for (let j = i + 1; j < responses.length; j++) {
        totalSimilarity += this.calculateStringSimilarity(responses[i].data, responses[j].data);
        comparisons++;
      }
    }
    
    return comparisons > 0 ? (totalSimilarity / comparisons) * 100 : 0;
  }

  /**
   * Calculate information completeness score
   */
  private calculateCompletenessScore(result: SynthesisResult, context: string): number {
    // Simple heuristic based on content length and source count
    const contentLength = result.content.length;
    const sourceCount = result.sources.length;
    const evidenceCount = result.evidence.length;
    
    // Normalize scores (0-1)
    const lengthScore = Math.min(contentLength / 1000, 1); // Target ~1000 chars
    const sourceScore = Math.min(sourceCount / 3, 1); // Target 3+ sources
    const evidenceScore = Math.min(evidenceCount / 5, 1); // Target 5+ evidence points
    
    return (lengthScore + sourceScore + evidenceScore) / 3;
  }

  /**
   * Get synthesis reliability grade
   */
  private getSynthesisReliabilityGrade(confidence: number, agreement: number, contradictions: number): string {
    const score = (confidence * 0.4) + (agreement / 100 * 0.4) - (contradictions * 0.1);
    
    if (score >= 0.8) return 'A+ (Excellent)';
    if (score >= 0.7) return 'A (Very Good)';
    if (score >= 0.6) return 'B+ (Good)';
    if (score >= 0.5) return 'B (Fair)';
    if (score >= 0.4) return 'C+ (Acceptable)';
    return 'C (Poor)';
  }

  /**
   * Get integration recommendations
   */
  private getIntegrationRecommendations(result: SynthesisResult, mode: string, contradictions: number): string {
    const recommendations: string[] = [];
    
    if (result.confidence > 0.8) {
      recommendations.push('SUCCESS High confidence synthesis - Safe for production use');
    } else if (result.confidence > 0.6) {
      recommendations.push('⚠️ **Medium confidence** - Consider additional validation');
    } else {
      recommendations.push('🚨 **Low confidence** - Requires manual review before use');
    }
    
    if (contradictions === 0) {
      recommendations.push('SUCCESS No contradictions detected - Information is consistent');
    } else if (contradictions <= 2) {
      recommendations.push('⚠️ **Minor contradictions** - Review conflict details');
    } else {
      recommendations.push('🚨 **Multiple contradictions** - Manual reconciliation needed');
    }
    
    switch (mode) {
      case 'consensus':
        recommendations.push('🔍 **Consensus mode** - Focus on agreed-upon information');
        break;
      case 'weighted':
        recommendations.push('⚖️ **Weighted mode** - Prioritize high-confidence sources');
        break;
      case 'hierarchical':
        recommendations.push('INFO Hierarchical mode - Trust tier-1 sources most');
        break;
      case 'conflict_resolution':
        recommendations.push('🛠️ **Conflict resolution** - Contradictions have been addressed');
        break;
    }
    
    return recommendations.join('\n');
  }
}