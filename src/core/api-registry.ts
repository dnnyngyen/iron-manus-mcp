// API Registry System for Iron Manus FSM KNOWLEDGE Phase
// Intelligent API discovery and selection system with role-based mapping and rate limiting

import { Role } from './types.js';

/**
 * API Endpoint Interface
 * Defines the structure of API endpoints in the registry
 */
export interface APIEndpoint {
  name: string;
  description: string;
  url: string;
  category: string;
  keywords: string[];
  auth_type: 'None' | 'API Key' | 'OAuth';
  https: boolean;
  cors: boolean;
  reliability_score: number; // 0-1 scale
  rate_limits?: {
    requests: number;
    timeWindow: string;
  };
}

/**
 * API Selection Result
 * Contains ranked APIs with relevance scores
 */
export interface APISelectionResult {
  api: APIEndpoint;
  relevance_score: number;
  matching_keywords: string[];
  role_preference_bonus: number;
}

/**
 * Rate Limiter State
 * Tracks API usage for rate limiting
 */
interface RateLimiterState {
  tokens: number;
  lastRefill: number;
  requestCount: number;
}

/**
 * Role-based API category preferences mapping
 * Maps user roles to preferred API categories for intelligent selection
 */
export const ROLE_API_MAPPING: Record<Role, string[]> = {
  // Research and knowledge-focused roles
  researcher: ['books', 'calendar', 'science', 'education', 'news', 'reference', 'academic'],
  
  // Analysis and data-focused roles
  analyzer: ['data', 'finance', 'cryptocurrency', 'business', 'statistics', 'market', 'analytics'],
  
  // Design and creative roles
  ui_architect: ['art', 'design', 'color', 'inspiration', 'fonts', 'graphics', 'visual'],
  ui_implementer: ['design', 'color', 'fonts', 'css', 'components', 'frameworks'],
  ui_refiner: ['design', 'color', 'accessibility', 'optimization', 'user-experience'],
  
  // Development-focused roles
  coder: ['development', 'documentation', 'tools', 'programming', 'testing', 'deployment'],
  
  // Planning and strategic roles
  planner: ['project', 'management', 'calendar', 'productivity', 'scheduling', 'organization'],
  
  // Quality and validation roles  
  critic: ['testing', 'validation', 'security', 'quality', 'monitoring', 'analysis'],
  
  // Integration and optimization roles
  synthesizer: ['integration', 'optimization', 'data', 'transformation', 'workflow', 'automation']
};

/**
 * Sample API Registry Data
 * Real-world APIs for testing and demonstration
 */
export const SAMPLE_API_REGISTRY: APIEndpoint[] = [
  // Books and Education
  {
    name: 'Open Library API',
    description: 'Access to millions of books and bibliographic records',
    url: 'https://openlibrary.org/dev/docs/api',
    category: 'books',
    keywords: ['books', 'library', 'education', 'reading', 'literature'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.9,
    rate_limits: { requests: 1000, timeWindow: '1h' }
  },
  {
    name: 'Google Books API',
    description: 'Search and access Google Books content',
    url: 'https://developers.google.com/books/docs/v1/using',
    category: 'books',
    keywords: ['books', 'search', 'google', 'reading', 'education'],
    auth_type: 'API Key',
    https: true,
    cors: true,
    reliability_score: 0.95,
    rate_limits: { requests: 1000, timeWindow: '1d' }
  },

  // Weather and Environment
  {
    name: 'OpenWeatherMap API',
    description: 'Current weather, forecasts, and historical weather data',
    url: 'https://openweathermap.org/api',
    category: 'weather',
    keywords: ['weather', 'forecast', 'climate', 'temperature', 'meteorology'],
    auth_type: 'API Key',
    https: true,
    cors: true,
    reliability_score: 0.92,
    rate_limits: { requests: 1000, timeWindow: '1d' }
  },

  // News and Information
  {
    name: 'NewsAPI',
    description: 'Live news headlines and articles from around the world',
    url: 'https://newsapi.org/docs',
    category: 'news',
    keywords: ['news', 'headlines', 'articles', 'journalism', 'current-events'],
    auth_type: 'API Key',
    https: true,
    cors: true,
    reliability_score: 0.88,
    rate_limits: { requests: 1000, timeWindow: '1d' }
  },

  // Finance and Cryptocurrency
  {
    name: 'CoinGecko API',
    description: 'Cryptocurrency data including prices, market cap, and trading volume',
    url: 'https://www.coingecko.com/en/api/documentation',
    category: 'cryptocurrency',
    keywords: ['crypto', 'bitcoin', 'ethereum', 'finance', 'trading', 'market'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.91,
    rate_limits: { requests: 50, timeWindow: '1m' }
  },
  {
    name: 'Alpha Vantage API',
    description: 'Stock market data, forex, and cryptocurrency information',
    url: 'https://www.alphavantage.co/documentation/',
    category: 'finance',
    keywords: ['stocks', 'finance', 'market', 'trading', 'investment', 'forex'],
    auth_type: 'API Key',
    https: true,
    cors: true,
    reliability_score: 0.87,
    rate_limits: { requests: 5, timeWindow: '1m' }
  },

  // Art and Design
  {
    name: 'Unsplash API',
    description: 'High-quality photos and images from professional photographers',
    url: 'https://unsplash.com/developers',
    category: 'art',
    keywords: ['photos', 'images', 'photography', 'visual', 'design', 'inspiration'],
    auth_type: 'API Key',
    https: true,
    cors: true,
    reliability_score: 0.93,
    rate_limits: { requests: 50, timeWindow: '1h' }
  },
  {
    name: 'Colormind API',
    description: 'AI-powered color palette generator for design projects',
    url: 'http://colormind.io/api-access/',
    category: 'color',
    keywords: ['color', 'palette', 'design', 'ui', 'art', 'aesthetics'],
    auth_type: 'None',
    https: false,
    cors: true,
    reliability_score: 0.75,
    rate_limits: { requests: 100, timeWindow: '1h' }
  },

  // Development and Tools
  {
    name: 'GitHub API',
    description: 'Access to GitHub repositories, issues, pull requests, and user data',
    url: 'https://docs.github.com/en/rest',
    category: 'development',
    keywords: ['github', 'git', 'code', 'repository', 'development', 'programming'],
    auth_type: 'OAuth',
    https: true,
    cors: true,
    reliability_score: 0.96,
    rate_limits: { requests: 5000, timeWindow: '1h' }
  },
  {
    name: 'Stack Overflow API',
    description: 'Programming questions, answers, and developer community data',
    url: 'https://api.stackexchange.com/docs',
    category: 'development',
    keywords: ['programming', 'questions', 'answers', 'community', 'developers', 'help'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.89,
    rate_limits: { requests: 300, timeWindow: '1d' }
  },

  // Science and Data
  {
    name: 'NASA API',
    description: 'Access to NASA data including astronomy, earth science, and space exploration',
    url: 'https://api.nasa.gov/',
    category: 'science',
    keywords: ['nasa', 'space', 'astronomy', 'science', 'earth', 'exploration'],
    auth_type: 'API Key',
    https: true,
    cors: true,
    reliability_score: 0.94,
    rate_limits: { requests: 1000, timeWindow: '1h' }
  },

  // Business and Productivity
  {
    name: 'JSONPlaceholder API',
    description: 'Fake REST API for testing and prototyping',
    url: 'https://jsonplaceholder.typicode.com/',
    category: 'testing',
    keywords: ['testing', 'prototype', 'mock', 'development', 'rest', 'json'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.85,
    rate_limits: { requests: 100, timeWindow: '1m' }
  },

  // Location and Maps
  {
    name: 'OpenStreetMap Nominatim API',
    description: 'Geocoding and reverse geocoding service',
    url: 'https://nominatim.org/release-docs/develop/api/Overview/',
    category: 'location',
    keywords: ['maps', 'geocoding', 'location', 'coordinates', 'addresses'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.82,
    rate_limits: { requests: 1, timeWindow: '1s' }
  },

  // Entertainment and Media
  {
    name: 'The Movie Database API',
    description: 'Movie, TV show, and entertainment industry data',
    url: 'https://developers.themoviedb.org/3',
    category: 'entertainment',
    keywords: ['movies', 'tv', 'entertainment', 'actors', 'films', 'media'],
    auth_type: 'API Key',
    https: true,
    cors: true,
    reliability_score: 0.90,
    rate_limits: { requests: 40, timeWindow: '10s' }
  },

  // Language and Translation
  {
    name: 'Dictionary API',
    description: 'English dictionary with definitions, pronunciations, and examples',
    url: 'https://dictionaryapi.dev/',
    category: 'reference',
    keywords: ['dictionary', 'words', 'definitions', 'language', 'english', 'reference'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.86,
    rate_limits: { requests: 100, timeWindow: '1h' }
  },

  // Health and Fitness
  {
    name: 'Nutritionix API',
    description: 'Nutrition data for food items and branded products',
    url: 'https://developer.nutritionix.com/docs/v2',
    category: 'health',
    keywords: ['nutrition', 'food', 'health', 'calories', 'diet', 'wellness'],
    auth_type: 'API Key',
    https: true,
    cors: true,
    reliability_score: 0.84,
    rate_limits: { requests: 500, timeWindow: '1d' }
  },

  // Random and Fun
  {
    name: 'Random User API',
    description: 'Generate random user data for testing and development',
    url: 'https://randomuser.me/documentation',
    category: 'testing',
    keywords: ['random', 'users', 'testing', 'fake-data', 'development', 'mock'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.88,
    rate_limits: { requests: 5000, timeWindow: '1d' }
  },

  // Government and Public Data
  {
    name: 'REST Countries API',
    description: 'Information about countries including population, currencies, and languages',
    url: 'https://restcountries.com/',
    category: 'reference',
    keywords: ['countries', 'geography', 'population', 'government', 'reference', 'data'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.91,
    rate_limits: { requests: 100, timeWindow: '1m' }
  },

  // IoT and Sensors
  {
    name: 'OpenWeatherMap OneCall API',
    description: 'Comprehensive weather data including alerts and historical information',
    url: 'https://openweathermap.org/api/one-call-api',
    category: 'weather',
    keywords: ['weather', 'sensors', 'iot', 'data', 'monitoring', 'environment'],
    auth_type: 'API Key',
    https: true,
    cors: true,
    reliability_score: 0.93,
    rate_limits: { requests: 1000, timeWindow: '1d' }
  },

  // Machine Learning and AI
  {
    name: 'Hugging Face API',
    description: 'Access to machine learning models and AI capabilities',
    url: 'https://huggingface.co/docs/api-inference/index',
    category: 'ai',
    keywords: ['ai', 'machine-learning', 'nlp', 'models', 'inference', 'data-science'],
    auth_type: 'API Key',
    https: true,
    cors: true,
    reliability_score: 0.87,
    rate_limits: { requests: 30, timeWindow: '1m' }
  },

  // Social Media and Communication
  {
    name: 'JSONPlaceholder Comments API',
    description: 'Mock social media comments for testing',
    url: 'https://jsonplaceholder.typicode.com/comments',
    category: 'social',
    keywords: ['comments', 'social', 'communication', 'testing', 'mock', 'community'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.85,
    rate_limits: { requests: 100, timeWindow: '1m' }
  }
];

/**
 * Simple Token Bucket Rate Limiter
 * Implements rate limiting for API endpoints
 */
export class RateLimiter {
  private apiStates: Map<string, RateLimiterState> = new Map();

  /**
   * Check if a request can be made to the specified API
   * @param apiName - Name of the API endpoint
   * @param maxRequests - Maximum requests allowed
   * @param timeWindowMs - Time window in milliseconds
   * @returns Whether the request can be made
   */
  canMakeRequest(apiName: string, maxRequests: number = 100, timeWindowMs: number = 60000): boolean {
    const now = Date.now();
    let state = this.apiStates.get(apiName);

    if (!state) {
      state = {
        tokens: maxRequests,
        lastRefill: now,
        requestCount: 0
      };
      this.apiStates.set(apiName, state);
    }

    // Refill tokens based on time passed
    const timeElapsed = now - state.lastRefill;
    const tokensToAdd = Math.floor(timeElapsed / timeWindowMs) * maxRequests;
    
    if (tokensToAdd > 0) {
      state.tokens = Math.min(maxRequests, state.tokens + tokensToAdd);
      state.lastRefill = now;
      state.requestCount = 0;
    }

    // Check if we can make the request
    if (state.tokens > 0) {
      state.tokens--;
      state.requestCount++;
      return true;
    }

    return false;
  }

  /**
   * Get current rate limit status for an API
   * @param apiName - Name of the API endpoint
   * @returns Current rate limit state
   */
  getRateLimitStatus(apiName: string): { tokens: number; requestCount: number; lastRefill: number } {
    const state = this.apiStates.get(apiName);
    if (!state) {
      return { tokens: 0, requestCount: 0, lastRefill: 0 };
    }
    return { tokens: state.tokens, requestCount: state.requestCount, lastRefill: state.lastRefill };
  }

  /**
   * Reset rate limits for an API (useful for testing)
   * @param apiName - Name of the API endpoint
   */
  resetRateLimit(apiName: string): void {
    this.apiStates.delete(apiName);
  }

  /**
   * Reset all rate limits
   */
  resetAllRateLimits(): void {
    this.apiStates.clear();
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();

/**
 * Parse API endpoints from Markdown table format
 * Extracts API information from public-api-lists README.md format
 * @param markdownContent - Raw markdown content
 * @returns Array of parsed API endpoints
 */
export function parseMarkdownAPITable(markdownContent: string): APIEndpoint[] {
  const apis: APIEndpoint[] = [];
  
  try {
    // Split content into lines
    const lines = markdownContent.split('\n');
    let inTable = false;
    let headerParsed = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) continue;
      
      // Detect table start (header with pipes)
      if (trimmedLine.includes('|') && trimmedLine.includes('API')) {
        inTable = true;
        continue;
      }
      
      // Skip table separator line
      if (inTable && trimmedLine.match(/^\|[\s\-\|]+\|$/)) {
        headerParsed = true;
        continue;
      }
      
      // Parse table rows
      if (inTable && headerParsed && trimmedLine.startsWith('|')) {
        const api = parseMarkdownTableRow(trimmedLine);
        if (api) {
          apis.push(api);
        }
      }
      
      // End of table detection
      if (inTable && !trimmedLine.includes('|')) {
        inTable = false;
        headerParsed = false;
      }
    }
  } catch (error) {
    console.error('Error parsing markdown API table:', error);
  }
  
  return apis;
}

/**
 * Parse a single markdown table row into an APIEndpoint
 * @param row - Markdown table row string
 * @returns Parsed APIEndpoint or null if parsing fails
 */
function parseMarkdownTableRow(row: string): APIEndpoint | null {
  try {
    // Split by pipe and clean up
    const columns = row.split('|').map(col => col.trim()).filter(col => col);
    
    if (columns.length < 4) {
      return null;
    }
    
    // Extract basic information (adapt based on actual markdown format)
    const [name, description, url, category, auth = 'None', https = 'Yes', cors = 'Yes'] = columns;
    
    // Extract keywords from name and description
    const keywords = extractKeywordsFromText(`${name} ${description}`);
    
    // Parse auth type
    const authType = parseAuthType(auth);
    
    // Parse boolean values
    const httpsEnabled = parseBoolean(https);
    const corsEnabled = parseBoolean(cors);
    
    // Generate reliability score based on various factors
    const reliabilityScore = calculateReliabilityScore({
      hasHttps: httpsEnabled,
      hasCors: corsEnabled,
      authType,
      urlValidity: isValidUrl(url)
    });
    
    return {
      name: name.replace(/\[([^\]]+)\]\([^)]+\)/, '$1'), // Remove markdown links
      description: description.substring(0, 200), // Limit description length
      url: extractUrlFromMarkdown(url),
      category: category.toLowerCase(),
      keywords,
      auth_type: authType,
      https: httpsEnabled,
      cors: corsEnabled,
      reliability_score: reliabilityScore,
      rate_limits: generateDefaultRateLimits(authType)
    };
  } catch (error) {
    console.error('Error parsing markdown table row:', error);
    return null;
  }
}

/**
 * Extract keywords from text for API categorization
 * @param text - Input text to extract keywords from
 * @returns Array of relevant keywords
 */
function extractKeywordsFromText(text: string): string[] {
  const commonWords = new Set(['api', 'the', 'and', 'or', 'but', 'for', 'with', 'to', 'of', 'in', 'on', 'at', 'by']);
  
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word))
    .slice(0, 10); // Limit to top 10 keywords
}

/**
 * Parse authentication type from string
 * @param authString - Authentication string from markdown
 * @returns Standardized auth type
 */
function parseAuthType(authString: string): 'None' | 'API Key' | 'OAuth' {
  const auth = authString.toLowerCase();
  if (auth.includes('oauth')) return 'OAuth';
  if (auth.includes('key') || auth.includes('token')) return 'API Key';
  return 'None';
}

/**
 * Parse boolean value from various string formats
 * @param value - String value to parse
 * @returns Boolean result
 */
function parseBoolean(value: string): boolean {
  const lower = value.toLowerCase().trim();
  return lower === 'yes' || lower === 'true' || lower === '✓' || lower === '1';
}

/**
 * Validate URL format
 * @param url - URL string to validate
 * @returns Whether URL is valid
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(extractUrlFromMarkdown(url));
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract URL from markdown link format
 * @param markdownUrl - Markdown formatted URL
 * @returns Clean URL string
 */
function extractUrlFromMarkdown(markdownUrl: string): string {
  const linkMatch = markdownUrl.match(/\[([^\]]+)\]\(([^)]+)\)/);
  return linkMatch ? linkMatch[2] : markdownUrl;
}

/**
 * Calculate reliability score based on API characteristics
 * @param factors - Factors affecting reliability
 * @returns Reliability score between 0 and 1
 */
function calculateReliabilityScore(factors: {
  hasHttps: boolean;
  hasCors: boolean;
  authType: string;
  urlValidity: boolean;
}): number {
  let score = 0.5; // Base score
  
  if (factors.hasHttps) score += 0.2;
  if (factors.hasCors) score += 0.1;
  if (factors.authType !== 'None') score += 0.1;
  if (factors.urlValidity) score += 0.1;
  
  return Math.min(1.0, Math.max(0.0, score));
}

/**
 * Generate default rate limits based on auth type
 * @param authType - Authentication type
 * @returns Default rate limit configuration
 */
function generateDefaultRateLimits(authType: 'None' | 'API Key' | 'OAuth'): { requests: number; timeWindow: string } {
  switch (authType) {
    case 'OAuth':
      return { requests: 5000, timeWindow: '1h' };
    case 'API Key':
      return { requests: 1000, timeWindow: '1h' };
    default:
      return { requests: 100, timeWindow: '1h' };
  }
}

/**
 * Intelligent API selection based on objective and role
 * Implements keyword matching and role-based preferences
 * @param objective - User's objective/goal
 * @param detectedRole - Detected user role
 * @param apiRegistry - Array of available APIs (defaults to sample registry)
 * @returns Top 5 most relevant APIs with scores
 */
export function selectRelevantAPIs(
  objective: string,
  detectedRole: Role,
  apiRegistry: APIEndpoint[] = SAMPLE_API_REGISTRY
): APISelectionResult[] {
  // Extract keywords from objective
  const objectiveKeywords = extractKeywordsFromText(objective);
  
  // Get role preferences
  const rolePreferences = ROLE_API_MAPPING[detectedRole] || [];
  
  // Score each API
  const scoredAPIs = apiRegistry.map(api => {
    const score = calculateAPIRelevanceScore(api, objectiveKeywords, rolePreferences);
    return {
      api,
      relevance_score: score.total,
      matching_keywords: score.matchingKeywords,
      role_preference_bonus: score.roleBonus
    };
  });
  
  // Sort by relevance score (descending) and reliability
  scoredAPIs.sort((a, b) => {
    const scoreDiff = b.relevance_score - a.relevance_score;
    if (Math.abs(scoreDiff) < 0.1) {
      // If scores are close, prefer higher reliability
      return b.api.reliability_score - a.api.reliability_score;
    }
    return scoreDiff;
  });
  
  // Return top 5 results
  return scoredAPIs.slice(0, 5);
}

/**
 * Calculate relevance score for an API based on objective and role
 * @param api - API endpoint to score
 * @param objectiveKeywords - Keywords extracted from objective
 * @param rolePreferences - Preferred categories for the role
 * @returns Detailed scoring breakdown
 */
function calculateAPIRelevanceScore(
  api: APIEndpoint,
  objectiveKeywords: string[],
  rolePreferences: string[]
): { total: number; matchingKeywords: string[]; roleBonus: number } {
  let score = 0;
  const matchingKeywords: string[] = [];
  
  // Keyword matching score (0-0.6)
  const allApiKeywords = [...api.keywords, api.name.toLowerCase(), api.category];
  for (const objKeyword of objectiveKeywords) {
    for (const apiKeyword of allApiKeywords) {
      if (apiKeyword.includes(objKeyword) || objKeyword.includes(apiKeyword)) {
        score += 0.1;
        matchingKeywords.push(objKeyword);
        break;
      }
    }
  }
  
  // Role preference bonus (0-0.3)
  const roleBonus = rolePreferences.includes(api.category) ? 0.3 : 0;
  score += roleBonus;
  
  // Reliability factor (0-0.1)
  score += api.reliability_score * 0.1;
  
  // Auth accessibility bonus (simpler auth = higher score)
  if (api.auth_type === 'None') score += 0.05;
  
  // HTTPS and CORS bonus
  if (api.https) score += 0.025;
  if (api.cors) score += 0.025;
  
  return {
    total: Math.min(1.0, score),
    matchingKeywords: Array.from(new Set(matchingKeywords)), // Remove duplicates
    roleBonus
  };
}

/**
 * Get API by name from registry
 * @param name - API name to search for
 * @param apiRegistry - Array of available APIs
 * @returns Found API endpoint or null
 */
export function getAPIByName(name: string, apiRegistry: APIEndpoint[] = SAMPLE_API_REGISTRY): APIEndpoint | null {
  return apiRegistry.find(api => 
    api.name.toLowerCase() === name.toLowerCase()
  ) || null;
}

/**
 * Get APIs by category
 * @param category - Category to filter by
 * @param apiRegistry - Array of available APIs
 * @returns Array of APIs in the specified category
 */
export function getAPIsByCategory(category: string, apiRegistry: APIEndpoint[] = SAMPLE_API_REGISTRY): APIEndpoint[] {
  return apiRegistry.filter(api => 
    api.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get APIs that require no authentication
 * @param apiRegistry - Array of available APIs
 * @returns Array of APIs with no auth requirements
 */
export function getPublicAPIs(apiRegistry: APIEndpoint[] = SAMPLE_API_REGISTRY): APIEndpoint[] {
  return apiRegistry.filter(api => api.auth_type === 'None');
}

/**
 * Filter APIs by reliability score threshold
 * @param minReliability - Minimum reliability score (0-1)
 * @param apiRegistry - Array of available APIs
 * @returns Array of APIs meeting reliability criteria
 */
export function getHighReliabilityAPIs(
  minReliability: number = 0.8,
  apiRegistry: APIEndpoint[] = SAMPLE_API_REGISTRY
): APIEndpoint[] {
  return apiRegistry.filter(api => api.reliability_score >= minReliability);
}

/**
 * Check if an API can be used based on rate limiting
 * @param apiName - Name of the API to check
 * @param apiRegistry - Array of available APIs
 * @returns Whether the API can be used now
 */
export function canUseAPI(apiName: string, apiRegistry: APIEndpoint[] = SAMPLE_API_REGISTRY): boolean {
  const api = getAPIByName(apiName, apiRegistry);
  if (!api || !api.rate_limits) {
    return true; // No rate limits defined
  }
  
  // Parse time window to milliseconds
  const timeWindowMs = parseTimeWindow(api.rate_limits.timeWindow);
  
  return rateLimiter.canMakeRequest(apiName, api.rate_limits.requests, timeWindowMs);
}

/**
 * Parse time window string to milliseconds
 * @param timeWindow - Time window string (e.g., '1h', '30m', '1d')
 * @returns Time window in milliseconds
 */
function parseTimeWindow(timeWindow: string): number {
  const match = timeWindow.match(/^(\d+)([smhd])$/);
  if (!match) return 60000; // Default to 1 minute
  
  const [, amount, unit] = match;
  const num = parseInt(amount, 10);
  
  switch (unit) {
    case 's': return num * 1000;
    case 'm': return num * 60 * 1000;
    case 'h': return num * 60 * 60 * 1000;
    case 'd': return num * 24 * 60 * 60 * 1000;
    default: return 60000;
  }
}

/**
 * Get comprehensive API statistics
 * @param apiRegistry - Array of available APIs
 * @returns Statistical overview of the API registry
 */
export function getAPIRegistryStats(apiRegistry: APIEndpoint[] = SAMPLE_API_REGISTRY): {
  total: number;
  byCategory: Record<string, number>;
  byAuthType: Record<string, number>;
  avgReliability: number;
  httpsPercentage: number;
  corsPercentage: number;
} {
  const stats = {
    total: apiRegistry.length,
    byCategory: {} as Record<string, number>,
    byAuthType: {} as Record<string, number>,
    avgReliability: 0,
    httpsPercentage: 0,
    corsPercentage: 0
  };
  
  let totalReliability = 0;
  let httpsCount = 0;
  let corsCount = 0;
  
  for (const api of apiRegistry) {
    // Category count
    stats.byCategory[api.category] = (stats.byCategory[api.category] || 0) + 1;
    
    // Auth type count
    stats.byAuthType[api.auth_type] = (stats.byAuthType[api.auth_type] || 0) + 1;
    
    // Aggregate reliability
    totalReliability += api.reliability_score;
    
    // HTTPS and CORS counts
    if (api.https) httpsCount++;
    if (api.cors) corsCount++;
  }
  
  stats.avgReliability = stats.total > 0 ? totalReliability / stats.total : 0;
  stats.httpsPercentage = stats.total > 0 ? (httpsCount / stats.total) * 100 : 0;
  stats.corsPercentage = stats.total > 0 ? (corsCount / stats.total) * 100 : 0;
  
  return stats;
}

// Export default registry and rate limiter for easy access
export default {
  SAMPLE_API_REGISTRY,
  ROLE_API_MAPPING,
  rateLimiter,
  selectRelevantAPIs,
  parseMarkdownAPITable,
  getAPIByName,
  getAPIsByCategory,
  getPublicAPIs,
  getHighReliabilityAPIs,
  canUseAPI,
  getAPIRegistryStats
};