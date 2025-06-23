// Role-Specific Validators - Specialized constraint validation for each role type
// Implements domain-specific reasoning pattern enforcement with V0-inspired deterministic validation

import { 
  RoleSpecificValidator, 
  ValidationContext, 
  ConstraintValidationResult, 
  ConstraintViolation, 
  OptimizationSuggestion, 
  ValidationSeverity 
} from '../core/reasoning-rules-engine.js';
import { ComplexityLevel } from '../core/types.js';

// =====================================================
// PLANNER ROLE VALIDATOR - Strategic thinking and planning
// =====================================================

export class PlannerValidator extends RoleSpecificValidator {
  validate(context: ValidationContext): ConstraintValidationResult {
    const violations: ConstraintViolation[] = [];
    const suggestions: OptimizationSuggestion[] = [];

    // Validate systematic planning approach
    this.validatePlanningStructure(context, violations, suggestions);
    this.validateGoalDecomposition(context, violations, suggestions);
    this.validateRiskAssessment(context, violations, suggestions);
    this.validateResourceConsideration(context, violations, suggestions);
    this.validateTimelineRealism(context, violations, suggestions);

    return {
      isValid: !violations.some(v => v.severity === ValidationSeverity.CRITICAL),
      violations,
      suggestions,
      confidence: this.calculatePlannerConfidence(violations, suggestions, context)
    };
  }

  private validatePlanningStructure(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const requiredElements = [
      { pattern: /\b(step|phase|stage|milestone)\b/g, name: 'Sequential Structure' },
      { pattern: /\b(goal|objective|target|outcome)\b/g, name: 'Goal Definition' },
      { pattern: /\b(approach|method|strategy|plan)\b/g, name: 'Methodology' }
    ];

    const missingElements = requiredElements.filter(element => {
      const matches = reasoning.match(element.pattern);
      return !matches || matches.length < 2;
    });

    if (missingElements.length > 0) {
      violations.push({
        constraintId: 'planner-structure',
        severity: ValidationSeverity.ERROR,
        message: `Planning structure missing: ${missingElements.map(e => e.name).join(', ')}`,
        context: 'Planner role requires systematic breakdown of tasks and clear goal definition',
        suggestedFix: 'Include clear steps, defined goals, and explicit methodology in planning approach',
        autoFixable: true
      });
    }

    // Check for hierarchical thinking
    if (!reasoning.match(/\b(sub-?task|sub-?goal|component|module|part)\b/g)) {
      suggestions.push({
        type: 'STRUCTURE',
        description: 'Consider breaking down complex tasks into smaller components',
        expectedImprovement: 25,
        implementationCost: 'LOW'
      });
    }
  }

  private validateGoalDecomposition(context: ValidationContext, violations: ConstraintViolation[], _suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning;
    
    // Check for SMART goal elements
    const smartElements = {
      specific: /\b(specific|exact|precise|clear|definite)\b/gi,
      measurable: /\b(measure|metric|quantity|number|percentage|count)\b/gi,
      achievable: /\b(achievable|realistic|feasible|possible|practical)\b/gi,
      relevant: /\b(relevant|important|aligned|appropriate|suitable)\b/gi,
      timeBound: /\b(deadline|timeline|schedule|date|time|duration)\b/gi
    };

    const presentElements = Object.entries(smartElements).filter(([_, pattern]) => 
      pattern.test(reasoning)
    ).length;

    if (presentElements < 3) {
      violations.push({
        constraintId: 'goal-decomposition',
        severity: ValidationSeverity.WARNING,
        message: 'Goals could be more SMART (Specific, Measurable, Achievable, Relevant, Time-bound)',
        context: 'Effective planning requires well-defined goals with clear success criteria',
        suggestedFix: 'Define specific, measurable outcomes with realistic timelines',
        autoFixable: false
      });
    }
  }

  private validateRiskAssessment(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const riskIndicators = [
      /\b(risk|challenge|problem|issue|difficulty|obstacle)\b/g,
      /\b(contingency|backup|alternative|fallback|mitigation)\b/g,
      /\b(assumption|dependency|constraint|limitation)\b/g
    ];

    const hasRiskConsideration = riskIndicators.some(pattern => pattern.test(reasoning));

    if (!hasRiskConsideration && context.sessionContext.objectiveComplexity !== ComplexityLevel.SIMPLE) {
      violations.push({
        constraintId: 'risk-assessment',
        severity: ValidationSeverity.WARNING,
        message: 'Complex planning should include risk assessment and contingency considerations',
        context: 'Planner role should anticipate potential challenges and prepare mitigation strategies',
        suggestedFix: 'Identify potential risks, dependencies, and prepare contingency plans',
        autoFixable: false
      });
    }
  }

  private validateResourceConsideration(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const resourceIndicators = [
      /\b(resource|time|budget|capacity|bandwidth|skill)\b/g,
      /\b(effort|cost|investment|requirement|need)\b/g,
      /\b(tool|technology|system|platform|infrastructure)\b/g
    ];

    const hasResourceConsideration = resourceIndicators.some(pattern => pattern.test(reasoning));

    if (!hasResourceConsideration) {
      suggestions.push({
        type: 'CONTENT',
        description: 'Consider resource requirements and constraints in planning',
        expectedImprovement: 20,
        implementationCost: 'LOW'
      });
    }
  }

  private validateTimelineRealism(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning;
    const timeIndicators = reasoning.match(/\b(\d+)\s*(hour|day|week|month|minute)\b/gi);
    
    if (timeIndicators && timeIndicators.length > 0) {
      // Check for overly optimistic timelines (this is a simplified heuristic)
      const hasRealisticBuffers = reasoning.match(/\b(buffer|extra|additional|contingency)\s+(time|duration)\b/gi);
      
      if (!hasRealisticBuffers) {
        suggestions.push({
          type: 'CONTENT',
          description: 'Consider adding time buffers for unexpected delays',
          expectedImprovement: 15,
          implementationCost: 'LOW'
        });
      }
    }
  }

  private calculatePlannerConfidence(violations: ConstraintViolation[], suggestions: OptimizationSuggestion[], context: ValidationContext): number {
    let confidence = 0.9;
    
    // Reduce confidence based on violations
    const criticalViolations = violations.filter(v => v.severity === ValidationSeverity.CRITICAL).length;
    const errorViolations = violations.filter(v => v.severity === ValidationSeverity.ERROR).length;
    
    confidence -= criticalViolations * 0.3;
    confidence -= errorViolations * 0.1;
    confidence -= suggestions.length * 0.05;

    // Increase confidence for complex reasoning in planning contexts
    if (context.reasoning.length > 500 && context.phase === 'PLAN') {
      confidence += 0.1;
    }

    return Math.max(0.1, Math.min(1.0, confidence));
  }
}

// =====================================================
// CODER ROLE VALIDATOR - Technical implementation and development
// =====================================================

export class CoderValidator extends RoleSpecificValidator {
  validate(context: ValidationContext): ConstraintValidationResult {
    const violations: ConstraintViolation[] = [];
    const suggestions: OptimizationSuggestion[] = [];

    this.validateTechnicalApproach(context, violations, suggestions);
    this.validateImplementationDetails(context, violations, suggestions);
    this.validateCodeQuality(context, violations, suggestions);
    this.validateTestingConsiderations(context, violations, suggestions);
    this.validateSecurityAwareness(context, violations, suggestions);

    return {
      isValid: !violations.some(v => v.severity === ValidationSeverity.CRITICAL),
      violations,
      suggestions,
      confidence: this.calculateCoderConfidence(violations, suggestions, context)
    };
  }

  private validateTechnicalApproach(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const technicalTerms = [
      /\b(function|method|class|module|component|service)\b/g,
      /\b(algorithm|logic|implementation|architecture|design)\b/g,
      /\b(framework|library|api|interface|protocol)\b/g
    ];

    const hasTechnicalContent = technicalTerms.some(pattern => {
      const matches = reasoning.match(pattern);
      return matches && matches.length >= 1;
    });

    if (!hasTechnicalContent && context.phase === 'EXECUTE') {
      violations.push({
        constraintId: 'technical-approach',
        severity: ValidationSeverity.ERROR,
        message: 'Coder role requires technical implementation details',
        context: 'Execution phase should include specific technical approaches and implementation strategies',
        suggestedFix: 'Include specific technical details, implementation approaches, and architectural considerations',
        autoFixable: true
      });
    }
  }

  private validateImplementationDetails(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning;
    
    // Check for specific implementation considerations
    const implementationPatterns = [
      /\b(error handling|exception|try-catch|validation)\b/gi,
      /\b(performance|optimization|efficiency|scalability)\b/gi,
      /\b(data structure|database|storage|persistence)\b/gi,
      /\b(integration|dependency|connection|interface)\b/gi
    ];

    const presentPatterns = implementationPatterns.filter(pattern => pattern.test(reasoning)).length;

    if (presentPatterns < 2 && context.sessionContext.objectiveComplexity !== ComplexityLevel.SIMPLE) {
      suggestions.push({
        type: 'CONTENT',
        description: 'Consider error handling, performance, data management, and integration aspects',
        expectedImprovement: 30,
        implementationCost: 'MEDIUM'
      });
    }
  }

  private validateCodeQuality(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const qualityIndicators = [
      /\b(clean code|readable|maintainable|modular|reusable)\b/g,
      /\b(documentation|comment|naming|convention)\b/g,
      /\b(refactor|optimize|improve|enhance)\b/g
    ];

    const hasQualityFocus = qualityIndicators.some(pattern => pattern.test(reasoning));

    if (!hasQualityFocus) {
      suggestions.push({
        type: 'PATTERN',
        description: 'Consider code quality aspects like readability, maintainability, and documentation',
        expectedImprovement: 25,
        implementationCost: 'LOW'
      });
    }
  }

  private validateTestingConsiderations(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const testingTerms = [
      /\b(test|testing|unit test|integration test|validation)\b/g,
      /\b(debug|debugging|troubleshoot|verify|validate)\b/g,
      /\b(edge case|boundary|corner case|scenario)\b/g
    ];

    const hasTestingConsideration = testingTerms.some(pattern => pattern.test(reasoning));

    if (!hasTestingConsideration && context.phase === 'EXECUTE') {
      suggestions.push({
        type: 'CONTENT',
        description: 'Include testing strategy and validation approaches',
        expectedImprovement: 35,
        implementationCost: 'MEDIUM'
      });
    }
  }

  private validateSecurityAwareness(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const securityTerms = [
      /\b(security|secure|authentication|authorization|validation)\b/g,
      /\b(sanitize|escape|injection|xss|csrf)\b/g,
      /\b(encryption|hash|token|permission|access control)\b/g
    ];

    const hasSecurityConsideration = securityTerms.some(pattern => pattern.test(reasoning));

    // Check if the context involves user input, data handling, or web interfaces
    const securityRelevant = reasoning.match(/\b(user input|database|web|api|form|upload|download)\b/g);

    if (securityRelevant && !hasSecurityConsideration) {
      violations.push({
        constraintId: 'security-awareness',
        severity: ValidationSeverity.WARNING,
        message: 'Security considerations should be addressed when handling user data or web interfaces',
        context: 'Coder role should be aware of security implications in implementation',
        suggestedFix: 'Include input validation, output encoding, and appropriate security measures',
        autoFixable: false
      });
    }
  }

  private calculateCoderConfidence(violations: ConstraintViolation[], suggestions: OptimizationSuggestion[], context: ValidationContext): number {
    let confidence = 0.85;
    
    violations.forEach(v => {
      switch (v.severity) {
        case ValidationSeverity.CRITICAL: confidence -= 0.4; break;
        case ValidationSeverity.ERROR: confidence -= 0.15; break;
        case ValidationSeverity.WARNING: confidence -= 0.05; break;
      }
    });

    // Technical detail bonus
    const technicalTermCount = (context.reasoning.match(/\b(function|class|method|algorithm|implementation)\b/gi) || []).length;
    confidence += Math.min(0.2, technicalTermCount * 0.02);

    return Math.max(0.1, Math.min(1.0, confidence));
  }
}

// =====================================================
// CRITIC ROLE VALIDATOR - Quality assessment and review
// =====================================================

export class CriticValidator extends RoleSpecificValidator {
  validate(context: ValidationContext): ConstraintValidationResult {
    const violations: ConstraintViolation[] = [];
    const suggestions: OptimizationSuggestion[] = [];

    this.validateCriticalAnalysis(context, violations, suggestions);
    this.validateObjectivity(context, violations, suggestions);
    this.validateComprehensiveness(context, violations, suggestions);
    this.validateConstructiveFeedback(context, violations, suggestions);
    this.validateEvidenceBase(context, violations, suggestions);

    return {
      isValid: !violations.some(v => v.severity === ValidationSeverity.CRITICAL),
      violations,
      suggestions,
      confidence: this.calculateCriticConfidence(violations, suggestions, context)
    };
  }

  private validateCriticalAnalysis(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const criticalTerms = [
      /\b(analyze|evaluate|assess|examine|review|critique)\b/g,
      /\b(strength|weakness|advantage|disadvantage|pro|con)\b/g,
      /\b(issue|problem|concern|risk|limitation|challenge)\b/g
    ];

    const hasCriticalAnalysis = criticalTerms.some(pattern => {
      const matches = reasoning.match(pattern);
      return matches && matches.length >= 2;
    });

    if (!hasCriticalAnalysis) {
      violations.push({
        constraintId: 'critical-analysis',
        severity: ValidationSeverity.ERROR,
        message: 'Critic role requires thorough analysis of strengths and weaknesses',
        context: 'Critical evaluation should identify both positive aspects and areas for improvement',
        suggestedFix: 'Include systematic analysis of strengths, weaknesses, risks, and limitations',
        autoFixable: true
      });
    }
  }

  private validateObjectivity(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning;
    
    // Check for subjective language that might indicate bias
    const subjectiveTerms = reasoning.match(/\b(obviously|clearly|definitely|certainly|everyone knows|of course)\b/gi);
    
    if (subjectiveTerms && subjectiveTerms.length > 2) {
      suggestions.push({
        type: 'CONTENT',
        description: 'Consider using more objective language and providing evidence for claims',
        expectedImprovement: 20,
        implementationCost: 'LOW'
      });
    }

    // Check for balanced perspective
    const positiveTerms = (reasoning.match(/\b(good|excellent|great|effective|successful|beneficial)\b/gi) || []).length;
    const negativeTerms = (reasoning.match(/\b(bad|poor|ineffective|problematic|concerning|risky)\b/gi) || []).length;
    
    if (positiveTerms > 0 && negativeTerms === 0) {
      suggestions.push({
        type: 'CONTENT',
        description: 'Consider including potential concerns or areas for improvement for balanced analysis',
        expectedImprovement: 25,
        implementationCost: 'LOW'
      });
    }
  }

  private validateComprehensiveness(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning;
    const aspectsToConsider = [
      { pattern: /\b(technical|technology|implementation|architecture)\b/gi, name: 'Technical' },
      { pattern: /\b(usability|user experience|interface|accessibility)\b/gi, name: 'Usability' },
      { pattern: /\b(performance|speed|efficiency|scalability)\b/gi, name: 'Performance' },
      { pattern: /\b(security|privacy|safety|compliance)\b/gi, name: 'Security' },
      { pattern: /\b(maintenance|maintainability|support|documentation)\b/gi, name: 'Maintenance' },
      { pattern: /\b(cost|budget|resource|time|effort)\b/gi, name: 'Resource' }
    ];

    const coveredAspects = aspectsToConsider.filter(aspect => aspect.pattern.test(reasoning));

    if (coveredAspects.length < 3 && context.sessionContext.objectiveComplexity !== ComplexityLevel.SIMPLE) {
      suggestions.push({
        type: 'CONTENT',
        description: `Consider additional aspects: ${aspectsToConsider.filter(a => !coveredAspects.includes(a)).map(a => a.name).join(', ')}`,
        expectedImprovement: 30,
        implementationCost: 'MEDIUM'
      });
    }
  }

  private validateConstructiveFeedback(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    
    // Check for constructive language
    const constructiveTerms = [
      /\b(suggest|recommend|propose|consider|improve|enhance)\b/g,
      /\b(alternative|option|approach|solution|modification)\b/g,
      /\b(opportunity|potential|possibility|chance)\b/g
    ];

    const hasConstructiveTone = constructiveTerms.some(pattern => pattern.test(reasoning));

    if (!hasConstructiveTone && reasoning.includes('problem')) {
      suggestions.push({
        type: 'CONTENT',
        description: 'Include constructive suggestions and alternatives alongside identified issues',
        expectedImprovement: 35,
        implementationCost: 'LOW'
      });
    }
  }

  private validateEvidenceBase(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const evidenceTerms = [
      /\b(because|since|due to|given that|based on)\b/g,
      /\b(evidence|data|research|study|example|case)\b/g,
      /\b(experience|practice|standard|benchmark|precedent)\b/g
    ];

    const hasEvidenceBase = evidenceTerms.some(pattern => pattern.test(reasoning));

    if (!hasEvidenceBase) {
      suggestions.push({
        type: 'CONTENT',
        description: 'Support critical assessments with evidence, examples, or reasoning',
        expectedImprovement: 40,
        implementationCost: 'MEDIUM'
      });
    }
  }

  private calculateCriticConfidence(violations: ConstraintViolation[], suggestions: OptimizationSuggestion[], context: ValidationContext): number {
    let confidence = 0.8;
    
    violations.forEach(v => {
      switch (v.severity) {
        case ValidationSeverity.CRITICAL: confidence -= 0.3; break;
        case ValidationSeverity.ERROR: confidence -= 0.12; break;
        case ValidationSeverity.WARNING: confidence -= 0.04; break;
      }
    });

    // Critical thinking bonus
    const criticalTermCount = (context.reasoning.match(/\b(analyze|evaluate|assess|critique)\b/gi) || []).length;
    confidence += Math.min(0.15, criticalTermCount * 0.03);

    return Math.max(0.1, Math.min(1.0, confidence));
  }
}

// =====================================================
// RESEARCHER ROLE VALIDATOR - Knowledge gathering and analysis
// =====================================================

export class ResearcherValidator extends RoleSpecificValidator {
  validate(context: ValidationContext): ConstraintValidationResult {
    const violations: ConstraintViolation[] = [];
    const suggestions: OptimizationSuggestion[] = [];

    this.validateResearchMethodology(context, violations, suggestions);
    this.validateSourceCredibility(context, violations, suggestions);
    this.validateInformationSynthesis(context, violations, suggestions);
    this.validateKnowledgeGaps(context, violations, suggestions);
    this.validateCitations(context, violations, suggestions);

    return {
      isValid: !violations.some(v => v.severity === ValidationSeverity.CRITICAL),
      violations,
      suggestions,
      confidence: this.calculateResearcherConfidence(violations, suggestions, context)
    };
  }

  private validateResearchMethodology(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const methodologyTerms = [
      /\b(research|investigate|explore|examine|study|analyze)\b/g,
      /\b(source|reference|documentation|literature|data)\b/g,
      /\b(method|approach|technique|strategy|process)\b/g
    ];

    const hasMethodology = methodologyTerms.some(pattern => {
      const matches = reasoning.match(pattern);
      return matches && matches.length >= 1;
    });

    if (!hasMethodology && context.phase === 'KNOWLEDGE') {
      violations.push({
        constraintId: 'research-methodology',
        severity: ValidationSeverity.ERROR,
        message: 'Researcher role requires systematic research methodology',
        context: 'Knowledge gathering should follow structured research approaches',
        suggestedFix: 'Describe research methods, information sources, and analysis approaches',
        autoFixable: true
      });
    }
  }

  private validateSourceCredibility(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const credibilityTerms = [
      /\b(authoritative|credible|reliable|trusted|verified)\b/g,
      /\b(official|academic|peer-reviewed|documented|established)\b/g,
      /\b(primary source|secondary source|expert|authority)\b/g
    ];

    const hasCredibilityConsideration = credibilityTerms.some(pattern => pattern.test(reasoning));

    if (!hasCredibilityConsideration && reasoning.includes('source')) {
      suggestions.push({
        type: 'CONTENT',
        description: 'Consider source credibility and reliability in research approach',
        expectedImprovement: 30,
        implementationCost: 'LOW'
      });
    }
  }

  private validateInformationSynthesis(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const synthesisTerms = [
      /\b(synthesize|combine|integrate|correlate|connect)\b/g,
      /\b(pattern|trend|theme|relationship|comparison)\b/g,
      /\b(summary|conclusion|insight|finding|discovery)\b/g
    ];

    const hasSynthesis = synthesisTerms.some(pattern => pattern.test(reasoning));

    if (!hasSynthesis && reasoning.length > 300) {
      suggestions.push({
        type: 'STRUCTURE',
        description: 'Include synthesis of findings and identification of patterns or insights',
        expectedImprovement: 35,
        implementationCost: 'MEDIUM'
      });
    }
  }

  private validateKnowledgeGaps(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const gapTerms = [
      /\b(unknown|unclear|need to find|further research|investigate)\b/g,
      /\b(gap|missing|incomplete|limited|insufficient)\b/g,
      /\b(assumption|hypothesis|theory|speculation)\b/g
    ];

    const acknowledgesGaps = gapTerms.some(pattern => pattern.test(reasoning));

    if (!acknowledgesGaps && context.sessionContext.objectiveComplexity !== ComplexityLevel.SIMPLE) {
      suggestions.push({
        type: 'CONTENT',
        description: 'Acknowledge knowledge gaps and areas requiring further investigation',
        expectedImprovement: 20,
        implementationCost: 'LOW'
      });
    }
  }

  private validateCitations(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning;
    
    // Check for citation-like patterns (URLs, references, quotes)
    const citationPatterns = [
      /https?:\/\/[^\s]+/g,
      /\[[^\]]+\]/g,
      /"[^"]+"/g,
      /according to|as stated by|as noted in|from the/gi
    ];

    const hasCitations = citationPatterns.some(pattern => pattern.test(reasoning));

    if (!hasCitations && reasoning.toLowerCase().includes('research')) {
      suggestions.push({
        type: 'CONTENT',
        description: 'Include references or citations for research claims and findings',
        expectedImprovement: 25,
        implementationCost: 'LOW'
      });
    }
  }

  private calculateResearcherConfidence(violations: ConstraintViolation[], suggestions: OptimizationSuggestion[], context: ValidationContext): number {
    let confidence = 0.85;
    
    violations.forEach(v => {
      switch (v.severity) {
        case ValidationSeverity.CRITICAL: confidence -= 0.35; break;
        case ValidationSeverity.ERROR: confidence -= 0.12; break;
        case ValidationSeverity.WARNING: confidence -= 0.04; break;
      }
    });

    // Research depth bonus
    const researchTermCount = (context.reasoning.match(/\b(research|investigate|analyze|study)\b/gi) || []).length;
    confidence += Math.min(0.2, researchTermCount * 0.025);

    return Math.max(0.1, Math.min(1.0, confidence));
  }
}

// =====================================================
// ANALYZER ROLE VALIDATOR - Data analysis and insights
// =====================================================

export class AnalyzerValidator extends RoleSpecificValidator {
  validate(context: ValidationContext): ConstraintValidationResult {
    const violations: ConstraintViolation[] = [];
    const suggestions: OptimizationSuggestion[] = [];

    this.validateAnalyticalApproach(context, violations, suggestions);
    this.validateDataConsiderations(context, violations, suggestions);
    this.validateInsightGeneration(context, violations, suggestions);
    this.validateQuantitativeElements(context, violations, suggestions);
    this.validateConclusions(context, violations, suggestions);

    return {
      isValid: !violations.some(v => v.severity === ValidationSeverity.CRITICAL),
      violations,
      suggestions,
      confidence: this.calculateAnalyzerConfidence(violations, suggestions, context)
    };
  }

  private validateAnalyticalApproach(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const analyticalTerms = [
      /\b(analyze|examine|investigate|evaluate|assess|interpret)\b/g,
      /\b(data|information|metrics|statistics|measurement|observation)\b/g,
      /\b(pattern|trend|correlation|relationship|comparison|contrast)\b/g
    ];

    const hasAnalyticalApproach = analyticalTerms.some(pattern => {
      const matches = reasoning.match(pattern);
      return matches && matches.length >= 2;
    });

    if (!hasAnalyticalApproach) {
      violations.push({
        constraintId: 'analytical-approach',
        severity: ValidationSeverity.ERROR,
        message: 'Analyzer role requires systematic analytical methodology',
        context: 'Analysis should be data-driven with clear examination of patterns and relationships',
        suggestedFix: 'Include systematic analysis of data, patterns, and relationships with clear methodology',
        autoFixable: true
      });
    }
  }

  private validateDataConsiderations(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const dataTerms = [
      /\b(data quality|data source|sample size|reliability|validity)\b/g,
      /\b(bias|limitation|accuracy|precision|completeness)\b/g,
      /\b(baseline|benchmark|control|comparison group)\b/g
    ];

    const hasDataConsiderations = dataTerms.some(pattern => pattern.test(reasoning));

    if (!hasDataConsiderations && reasoning.includes('data')) {
      suggestions.push({
        type: 'CONTENT',
        description: 'Consider data quality, sources, limitations, and potential biases in analysis',
        expectedImprovement: 30,
        implementationCost: 'MEDIUM'
      });
    }
  }

  private validateInsightGeneration(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const insightTerms = [
      /\b(insight|finding|discovery|observation|conclusion)\b/g,
      /\b(implication|significance|meaning|interpretation)\b/g,
      /\b(reveal|indicate|suggest|demonstrate|show)\b/g
    ];

    const hasInsights = insightTerms.some(pattern => {
      const matches = reasoning.match(pattern);
      return matches && matches.length >= 1;
    });

    if (!hasInsights) {
      suggestions.push({
        type: 'CONTENT',
        description: 'Generate clear insights and interpretations from analytical findings',
        expectedImprovement: 40,
        implementationCost: 'MEDIUM'
      });
    }
  }

  private validateQuantitativeElements(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning;
    const quantitativePatterns = [
      /\b\d+(\.\d+)?%/g,  // Percentages
      /\b\d+(\.\d+)?\s*(times|fold|factor)/gi,  // Multipliers
      /\b(average|mean|median|standard deviation|correlation|p-value)/gi,  // Statistical terms
      /\b\d+(\.\d+)?\s*(increase|decrease|improvement|reduction)/gi  // Quantified changes
    ];

    const hasQuantitativeElements = quantitativePatterns.some(pattern => pattern.test(reasoning));

    if (!hasQuantitativeElements && context.sessionContext.objectiveComplexity !== ComplexityLevel.SIMPLE) {
      suggestions.push({
        type: 'CONTENT',
        description: 'Include quantitative measures and statistical analysis where appropriate',
        expectedImprovement: 25,
        implementationCost: 'MEDIUM'
      });
    }
  }

  private validateConclusions(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const conclusionIndicators = [
      /\b(therefore|thus|hence|consequently|as a result)\b/g,
      /\b(conclusion|summary|key findings|main points)\b/g,
      /\b(recommendation|next steps|action items|implications)\b/g
    ];

    const hasConclusions = conclusionIndicators.some(pattern => pattern.test(reasoning));

    if (!hasConclusions && reasoning.length > 400) {
      suggestions.push({
        type: 'STRUCTURE',
        description: 'Include clear conclusions and actionable recommendations based on analysis',
        expectedImprovement: 35,
        implementationCost: 'LOW'
      });
    }
  }

  private calculateAnalyzerConfidence(violations: ConstraintViolation[], suggestions: OptimizationSuggestion[], context: ValidationContext): number {
    let confidence = 0.82;
    
    violations.forEach(v => {
      switch (v.severity) {
        case ValidationSeverity.CRITICAL: confidence -= 0.4; break;
        case ValidationSeverity.ERROR: confidence -= 0.15; break;
        case ValidationSeverity.WARNING: confidence -= 0.05; break;
      }
    });

    // Analytical rigor bonus
    const analyticalTermCount = (context.reasoning.match(/\b(analyze|data|pattern|correlation|insight)\b/gi) || []).length;
    confidence += Math.min(0.18, analyticalTermCount * 0.02);

    return Math.max(0.1, Math.min(1.0, confidence));
  }
}

// =====================================================
// SYNTHESIZER ROLE VALIDATOR - Integration and optimization
// =====================================================

export class SynthesizerValidator extends RoleSpecificValidator {
  validate(context: ValidationContext): ConstraintValidationResult {
    const violations: ConstraintViolation[] = [];
    const suggestions: OptimizationSuggestion[] = [];

    this.validateIntegrationApproach(context, violations, suggestions);
    this.validateSystemicThinking(context, violations, suggestions);
    this.validateOptimizationConsiderations(context, violations, suggestions);
    this.validateHolisticPerspective(context, violations, suggestions);
    this.validateSynergies(context, violations, suggestions);

    return {
      isValid: !violations.some(v => v.severity === ValidationSeverity.CRITICAL),
      violations,
      suggestions,
      confidence: this.calculateSynthesizerConfidence(violations, suggestions, context)
    };
  }

  private validateIntegrationApproach(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const integrationTerms = [
      /\b(integrate|combine|merge|unify|consolidate|synthesize)\b/g,
      /\b(connect|link|bridge|coordinate|align|harmonize)\b/g,
      /\b(interface|interaction|interoperability|compatibility)\b/g
    ];

    const hasIntegrationFocus = integrationTerms.some(pattern => {
      const matches = reasoning.match(pattern);
      return matches && matches.length >= 2;
    });

    if (!hasIntegrationFocus) {
      violations.push({
        constraintId: 'integration-approach',
        severity: ValidationSeverity.ERROR,
        message: 'Synthesizer role requires focus on integration and unification',
        context: 'Synthesis should demonstrate how different elements work together cohesively',
        suggestedFix: 'Include explicit integration strategies and connection points between components',
        autoFixable: true
      });
    }
  }

  private validateSystemicThinking(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const systemicTerms = [
      /\b(system|architecture|framework|ecosystem|environment)\b/g,
      /\b(holistic|comprehensive|end-to-end|overall|complete)\b/g,
      /\b(dependency|relationship|interaction|impact|effect)\b/g
    ];

    const hasSystemicThinking = systemicTerms.some(pattern => {
      const matches = reasoning.match(pattern);
      return matches && matches.length >= 1;
    });

    if (!hasSystemicThinking) {
      suggestions.push({
        type: 'PATTERN',
        description: 'Consider systemic implications and architectural perspectives',
        expectedImprovement: 30,
        implementationCost: 'MEDIUM'
      });
    }
  }

  private validateOptimizationConsiderations(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const optimizationTerms = [
      /\b(optimize|improve|enhance|streamline|efficient|effective)\b/g,
      /\b(performance|speed|resource|cost|time|quality)\b/g,
      /\b(bottleneck|constraint|limitation|trade-off|balance)\b/g
    ];

    const hasOptimizationFocus = optimizationTerms.some(pattern => pattern.test(reasoning));

    if (!hasOptimizationFocus) {
      suggestions.push({
        type: 'CONTENT',
        description: 'Include optimization considerations and performance improvements',
        expectedImprovement: 25,
        implementationCost: 'MEDIUM'
      });
    }
  }

  private validateHolisticPerspective(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning;
    
    // Check for consideration of multiple perspectives/domains
    const domainTerms = [
      /\b(technical|business|user|operational|strategic)\b/gi,
      /\b(short-term|long-term|immediate|future|sustainable)\b/gi,
      /\b(stakeholder|user|customer|team|organization)\b/gi
    ];

    const coveredDomains = domainTerms.filter(pattern => pattern.test(reasoning)).length;

    if (coveredDomains < 2) {
      suggestions.push({
        type: 'CONTENT',
        description: 'Consider multiple perspectives: technical, business, user, and temporal dimensions',
        expectedImprovement: 35,
        implementationCost: 'MEDIUM'
      });
    }
  }

  private validateSynergies(context: ValidationContext, violations: ConstraintViolation[], suggestions: OptimizationSuggestion[]): void {
    const reasoning = context.reasoning.toLowerCase();
    const synergyTerms = [
      /\b(synergy|synergistic|complementary|mutual|collaborative)\b/g,
      /\b(leverage|amplify|multiply|compound|reinforce)\b/g,
      /\b(emergent|emergent property|whole greater than|sum of parts)\b/g
    ];

    const hasSynergyConsideration = synergyTerms.some(pattern => pattern.test(reasoning));

    if (!hasSynergyConsideration && context.sessionContext.currentTasks.length > 1) {
      suggestions.push({
        type: 'CONTENT',
        description: 'Identify synergies and emergent properties from component integration',
        expectedImprovement: 30,
        implementationCost: 'LOW'
      });
    }
  }

  private calculateSynthesizerConfidence(violations: ConstraintViolation[], suggestions: OptimizationSuggestion[], context: ValidationContext): number {
    let confidence = 0.8;
    
    violations.forEach(v => {
      switch (v.severity) {
        case ValidationSeverity.CRITICAL: confidence -= 0.35; break;
        case ValidationSeverity.ERROR: confidence -= 0.12; break;
        case ValidationSeverity.WARNING: confidence -= 0.04; break;
      }
    });

    // Integration complexity bonus
    const integrationTermCount = (context.reasoning.match(/\b(integrate|synthesize|combine|unify)\b/gi) || []).length;
    confidence += Math.min(0.2, integrationTermCount * 0.03);

    return Math.max(0.1, Math.min(1.0, confidence));
  }
}