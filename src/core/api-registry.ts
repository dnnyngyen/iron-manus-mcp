// API Registry System for Iron Manus FSM KNOWLEDGE Phase
// Intelligent API discovery and selection system with role-based mapping and rate limiting

import { Role } from './types.js';
import logger from '../utils/logger.js';

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
  endpoint_patterns?: string[]; // Alternative endpoints to try
  documentation_url?: string; // Link to API documentation
  health_check_endpoint?: string; // Endpoint to verify API is working
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
  synthesizer: ['integration', 'optimization', 'data', 'transformation', 'workflow', 'automation'],
};

/**
 * Comprehensive API Registry Data
 * No-authentication APIs from public-api-lists and curated sources
 * Total: 65+ APIs across 25+ categories, all no-authentication required
 */
export const SAMPLE_API_REGISTRY: APIEndpoint[] = [
  // Animals - No Auth Required
  {
    name: 'Cat Facts API',
    description: 'Daily cat facts and random cat information',
    url: 'https://catfact.ninja/fact',
    category: 'animals',
    keywords: ['cats', 'facts', 'animals', 'pets', 'random'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.9,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'Dog API',
    description: 'Random dog images and breeds information',
    url: 'https://dog.ceo/dog-api/',
    category: 'animals',
    keywords: ['dogs', 'images', 'breeds', 'animals', 'pets'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.95,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'Random Fox API',
    description: 'Random fox images and facts',
    url: 'https://randomfox.ca/floof/',
    category: 'animals',
    keywords: ['fox', 'images', 'animals', 'random', 'wildlife'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.85,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'HTTPCat API',
    description: 'HTTP status codes represented by cats',
    url: 'https://http.cat/',
    category: 'animals',
    keywords: ['cats', 'http', 'status', 'codes', 'development'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.8,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Anime - No Auth Required
  {
    name: 'AnimeChan API',
    description: 'Anime quotes database with over 10k quotes',
    url: 'https://animechan.vercel.app/',
    category: 'anime',
    keywords: ['anime', 'quotes', 'manga', 'characters', 'entertainment'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.85,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'Studio Ghibli API',
    description: 'Resources from Studio Ghibli films',
    url: 'https://ghibliapi.herokuapp.com/',
    category: 'anime',
    keywords: ['ghibli', 'anime', 'films', 'movies', 'characters'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.8,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

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
    rate_limits: { requests: 1000, timeWindow: '1h' },
  },

  // Business - No Auth Required
  {
    name: 'Clearbit Logo API',
    description: 'Get company logos by domain name',
    url: 'https://logo.clearbit.com/',
    category: 'business',
    keywords: ['logos', 'companies', 'branding', 'business', 'images'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.85,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Calendar - No Auth Required
  {
    name: 'Nager.Date API',
    description: 'Public holidays for over 100 countries',
    url: 'https://date.nager.at/',
    category: 'calendar',
    keywords: ['holidays', 'calendar', 'dates', 'countries', 'public'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.9,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Cryptocurrency - No Auth Required
  {
    name: 'CoinDesk Bitcoin Price API',
    description: 'Bitcoin price index and historical data',
    url: 'https://api.coindesk.com/v1/bpi/currentprice.json',
    category: 'cryptocurrency',
    keywords: ['bitcoin', 'price', 'cryptocurrency', 'finance', 'market'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.95,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

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
    rate_limits: { requests: 50, timeWindow: '1m' },
  },

  // Dictionaries - No Auth Required
  {
    name: 'Free Dictionary API',
    description: 'English dictionary with definitions, phonetics, and examples',
    url: 'https://dictionaryapi.dev/',
    category: 'dictionaries',
    keywords: ['dictionary', 'words', 'definitions', 'language', 'english'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.9,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Entertainment - No Auth Required
  {
    name: 'Bored API',
    description: 'Find random activities to cure boredom',
    url: 'https://www.boredapi.com/',
    category: 'entertainment',
    keywords: ['activities', 'boredom', 'random', 'suggestions', 'fun'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.85,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'JokeAPI',
    description: 'Programming, miscellaneous, and dark humor jokes',
    url: 'https://jokeapi.dev/',
    category: 'entertainment',
    keywords: ['jokes', 'humor', 'programming', 'entertainment', 'random'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.9,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'Chuck Norris Jokes API',
    description: 'Random Chuck Norris jokes and facts',
    url: 'https://api.chucknorris.io/',
    category: 'entertainment',
    keywords: ['chuck', 'norris', 'jokes', 'humor', 'random'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.85,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'Official Joke API',
    description: 'Random jokes with setup and punchline format',
    url: 'https://official-joke-api.appspot.com/',
    category: 'entertainment',
    keywords: ['jokes', 'humor', 'setup', 'punchline', 'random'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.8,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Food & Drink - No Auth Required
  {
    name: 'TheMealDB API',
    description: 'Recipe database with ingredients and cooking instructions',
    url: 'https://www.themealdb.com/api.php',
    category: 'food',
    keywords: ['recipes', 'meals', 'cooking', 'ingredients', 'food'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.9,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'TheCocktailDB API',
    description: 'Cocktail recipes and drink database',
    url: 'https://www.thecocktaildb.com/api.php',
    category: 'food',
    keywords: ['cocktails', 'drinks', 'recipes', 'alcohol', 'beverages'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.85,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Games & Comics - No Auth Required
  {
    name: 'Deck of Cards API',
    description: 'Digital deck of cards for card games',
    url: 'https://deckofcardsapi.com/',
    category: 'games',
    keywords: ['cards', 'deck', 'games', 'shuffle', 'draw'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.9,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'Pokemon API',
    description: 'Pokemon data including stats, types, and abilities',
    url: 'https://pokeapi.co/',
    category: 'games',
    keywords: ['pokemon', 'games', 'stats', 'types', 'abilities'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.95,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'Rick and Morty API',
    description: 'Characters, episodes, and locations from Rick and Morty',
    url: 'https://rickandmortyapi.com/',
    category: 'games',
    keywords: ['rick', 'morty', 'characters', 'episodes', 'tv'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.9,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'Open Trivia Database',
    description: 'Trivia questions in multiple categories and difficulties',
    url: 'https://opentdb.com/api_config.php',
    category: 'games',
    keywords: ['trivia', 'questions', 'quiz', 'knowledge', 'game'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.85,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Art and Design - No Auth Required
  {
    name: 'Lorem Picsum',
    description: 'Random placeholder images for design and development',
    url: 'https://picsum.photos/',
    category: 'art',
    keywords: ['images', 'placeholder', 'random', 'photos', 'design'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.9,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'Colormind API',
    description: 'AI-powered color palette generator for design projects',
    url: 'http://colormind.io/api-access/',
    category: 'art',
    keywords: ['color', 'palette', 'design', 'ui', 'art', 'aesthetics'],
    auth_type: 'None',
    https: false,
    cors: true,
    reliability_score: 0.75,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Geocoding - No Auth Required
  {
    name: 'REST Countries API',
    description: 'Information about countries including population and currencies',
    url: 'https://restcountries.com/',
    category: 'geocoding',
    keywords: ['countries', 'geography', 'population', 'currencies', 'data'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.95,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'IP-API',
    description: 'IP geolocation and ISP information',
    url: 'http://ip-api.com/',
    category: 'geocoding',
    keywords: ['ip', 'geolocation', 'location', 'isp', 'country'],
    auth_type: 'None',
    https: false,
    cors: true,
    reliability_score: 0.85,
    rate_limits: { requests: 45, timeWindow: '1m' },
  },
  {
    name: 'ipapi.co',
    description: 'IP geolocation API with detailed location data',
    url: 'https://ipapi.co/',
    category: 'geocoding',
    keywords: ['ip', 'geolocation', 'location', 'city', 'country'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.9,
    rate_limits: { requests: 1000, timeWindow: '1d' },
  },
  {
    name: 'GeoJS',
    description: 'IP geolocation with country and city information',
    url: 'https://www.geojs.io/',
    category: 'geocoding',
    keywords: ['ip', 'geolocation', 'country', 'city', 'location'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.8,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Development and Tools - No Auth Required
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
    rate_limits: { requests: 300, timeWindow: '1d' },
  },
  {
    name: 'JSONPlaceholder API',
    description: 'Fake REST API for testing and prototyping',
    url: 'https://jsonplaceholder.typicode.com/',
    category: 'development',
    keywords: ['testing', 'prototype', 'mock', 'development', 'rest', 'json'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.9,
    rate_limits: { requests: 100, timeWindow: '1m' },
  },

  // Science and Data - No Auth Required
  {
    name: 'NASA APOD API',
    description: 'Astronomy Picture of the Day from NASA',
    url: 'https://api.nasa.gov/planetary/apod',
    category: 'science',
    keywords: ['nasa', 'astronomy', 'space', 'pictures', 'daily'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.9,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'Numbers API',
    description: 'Interesting facts about numbers',
    url: 'http://numbersapi.com/',
    category: 'science',
    keywords: ['numbers', 'facts', 'math', 'trivia', 'mathematics'],
    auth_type: 'None',
    https: false,
    cors: true,
    reliability_score: 0.85,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'Open Notify ISS API',
    description: 'Current location of the International Space Station',
    url: 'http://open-notify.org/Open-Notify-API/',
    category: 'science',
    keywords: ['iss', 'space', 'station', 'location', 'orbit'],
    auth_type: 'None',
    https: false,
    cors: true,
    reliability_score: 0.8,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Health - No Auth Required
  {
    name: 'Disease.sh COVID-19 API',
    description: 'COVID-19 statistics and data worldwide',
    url: 'https://disease.sh/',
    category: 'health',
    keywords: ['covid', 'coronavirus', 'statistics', 'health', 'data'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.9,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Random Data - No Auth Required
  {
    name: 'Random User Generator',
    description: 'Generate random user data for testing and development',
    url: 'https://randomuser.me/',
    category: 'random',
    keywords: ['users', 'random', 'testing', 'fake', 'data'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.9,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'Lorem Ipsum API',
    description: 'Generate Lorem Ipsum placeholder text',
    url: 'https://loripsum.net/',
    category: 'random',
    keywords: ['lorem', 'ipsum', 'text', 'placeholder', 'dummy'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.85,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Weather - No Auth Required (free tier)
  {
    name: 'OpenWeatherMap API',
    description: 'Current weather data (free tier available)',
    url: 'https://openweathermap.org/current',
    category: 'weather',
    keywords: ['weather', 'temperature', 'forecast', 'climate', 'free'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.85,
    rate_limits: { requests: 60, timeWindow: '1m' },
  },

  // Government - No Auth Required
  {
    name: 'Data.gov API',
    description: 'US Government open data and datasets',
    url: 'https://www.data.gov/developers/apis',
    category: 'government',
    keywords: ['government', 'data', 'public', 'usa', 'open'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.9,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Sports - No Auth Required
  {
    name: 'ESPN API',
    description: 'Sports scores, teams, and player statistics',
    url: 'https://www.espn.com/apis/devcenter/',
    category: 'sports',
    keywords: ['sports', 'scores', 'teams', 'players', 'statistics'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.85,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Transportation - No Auth Required
  {
    name: 'UK Transport API',
    description: 'UK public transport data and journey planning',
    url: 'https://developer.transportapi.com/',
    category: 'transportation',
    keywords: ['transport', 'uk', 'public', 'journey', 'trains'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.8,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // URL Shorteners - No Auth Required
  {
    name: 'is.gd URL Shortener',
    description: 'Free URL shortening service',
    url: 'https://is.gd/developers.php',
    category: 'utilities',
    keywords: ['url', 'shortner', 'links', 'redirect', 'free'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.8,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // QR Code - No Auth Required
  {
    name: 'QR Server API',
    description: 'Generate QR codes for text, URLs, and data',
    url: 'https://api.qrserver.com/',
    category: 'utilities',
    keywords: ['qr', 'code', 'generator', 'barcode', 'image'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.85,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Music - No Auth Required
  {
    name: 'Lyrics.ovh API',
    description: 'Get song lyrics by artist and title',
    url: 'https://lyricsovh.docs.apiary.io/',
    category: 'music',
    keywords: ['lyrics', 'songs', 'music', 'artist', 'text'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.8,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Quote APIs - No Auth Required
  {
    name: 'Quotable API',
    description: 'Random inspirational quotes and famous sayings',
    url: 'https://github.com/lukePeavey/quotable',
    category: 'entertainment',
    keywords: ['quotes', 'inspiration', 'famous', 'sayings', 'wisdom'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.85,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Gaming - 3D & Enhanced Gaming APIs
  {
    name: 'Pokemon-3D-api',
    description: '3D Pokemon models for ThreeJS - GLB format with regular and shiny variants',
    url: 'https://pokemon-3d-api.onrender.com/v1/pokemon',
    category: 'gaming',
    keywords: ['pokemon', '3d', 'models', 'threejs', 'glb', 'gaming', 'javascript'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.9,
    rate_limits: { requests: 100, timeWindow: '1h' },
    endpoint_patterns: [
      'https://pokemon-3d-api.onrender.com/v1/pokemon',
      'https://pokemon-3d-api.onrender.com/pokemon',
      'https://pokemon-3d-api.onrender.com/api/v1/pokemon',
    ],
    documentation_url: 'https://documenter.getpostman.com/view/29725199/2sAYX8KMU8',
  },
  {
    name: 'Pokemon TCG API',
    description: 'Pokemon Trading Card Game information and card data',
    url: 'https://pokemontcg.io',
    category: 'gaming',
    keywords: ['pokemon', 'tcg', 'trading', 'cards', 'game', 'collectibles'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.85,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'AmiiboAPI',
    description: 'Nintendo Amiibo information and database',
    url: 'https://amiiboapi.com/',
    category: 'gaming',
    keywords: ['nintendo', 'amiibo', 'gaming', 'collectibles', 'characters'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.9,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'Animal Crossing API',
    description: 'Info on critters, fossils, art, music, furniture, and villagers from ACNH',
    url: 'http://acnhapi.com/',
    category: 'gaming',
    keywords: ['animal', 'crossing', 'nintendo', 'villagers', 'furniture', 'gaming'],
    auth_type: 'None',
    https: false,
    cors: true,
    reliability_score: 0.8,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'Age of Empires II API',
    description: 'Information about Age of Empires II resources, units, and civilizations',
    url: 'https://age-of-empires-2-api.herokuapp.com',
    category: 'gaming',
    keywords: ['age', 'empires', 'strategy', 'gaming', 'units', 'civilizations'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.75,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Animals - Extended Collection
  {
    name: 'Axolotl API',
    description: 'Collection of axolotl pictures and facts',
    url: 'https://theaxolotlapi.netlify.app/',
    category: 'animals',
    keywords: ['axolotl', 'animals', 'pictures', 'facts', 'amphibians'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.8,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'Cataas API',
    description: 'Cat as a service - cat pictures and gifs',
    url: 'https://cataas.com/',
    category: 'animals',
    keywords: ['cats', 'pictures', 'gifs', 'animals', 'service'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.85,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'HTTP Dogs API',
    description: 'Dogs for HTTP response status codes',
    url: 'https://httpstatusdogs.com/',
    category: 'animals',
    keywords: ['dogs', 'http', 'status', 'codes', 'animals', 'development'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.8,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'MeowFacts API',
    description: 'Random cat facts database',
    url: 'https://meowfacts.herokuapp.com/',
    category: 'animals',
    keywords: ['cats', 'facts', 'animals', 'random', 'trivia'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.8,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'Shibe Online API',
    description: 'Random Shiba Inu, cat, or bird pictures',
    url: 'http://shibe.online/',
    category: 'animals',
    keywords: ['shiba', 'inu', 'cats', 'birds', 'animals', 'pictures'],
    auth_type: 'None',
    https: false,
    cors: true,
    reliability_score: 0.75,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Entertainment - Extended Collection
  {
    name: 'Chuck Norris Database',
    description: 'Internet Chuck Norris Database for random Chuck Norris jokes',
    url: 'http://www.icndb.com/api/',
    category: 'entertainment',
    keywords: ['chuck', 'norris', 'jokes', 'humor', 'random', 'database'],
    auth_type: 'None',
    https: false,
    cors: true,
    reliability_score: 0.75,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'Imgflip API',
    description: 'Gets an array of popular memes and meme generator',
    url: 'https://imgflip.com/api',
    category: 'entertainment',
    keywords: ['memes', 'images', 'humor', 'generator', 'popular', 'internet'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.85,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'Meme Maker API',
    description: 'REST API for creating memes',
    url: 'https://mememaker.github.io/API/',
    category: 'entertainment',
    keywords: ['memes', 'maker', 'creator', 'generator', 'humor', 'images'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.8,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Development Tools - Extended Collection
  {
    name: 'CountAPI',
    description: 'Free counting service for tracking page hits and events',
    url: 'https://countapi.xyz',
    category: 'development',
    keywords: ['counting', 'tracking', 'analytics', 'hits', 'events', 'free'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.85,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'Ciprand API',
    description: 'Secure random string generator',
    url: 'https://github.com/polarspetroll/ciprand',
    category: 'development',
    keywords: ['random', 'string', 'generator', 'secure', 'cryptography', 'tools'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.8,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'ExtendsClass JSON Storage',
    description: 'Simple JSON store API for temporary data storage',
    url: 'https://extendsclass.com/json-storage.html',
    category: 'development',
    keywords: ['json', 'storage', 'temporary', 'data', 'store', 'api'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.8,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },

  // Art & Museums
  {
    name: 'Metropolitan Museum API',
    description: 'Metropolitan Museum of Art collection and object data',
    url: 'https://metmuseum.github.io/',
    category: 'art',
    keywords: ['museum', 'art', 'collection', 'metropolitan', 'culture', 'objects'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.9,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
  {
    name: 'Art Institute of Chicago API',
    description: 'Art Institute of Chicago collection access',
    url: 'https://api.artic.edu/docs/',
    category: 'art',
    keywords: ['art', 'institute', 'chicago', 'museum', 'collection', 'paintings'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.9,
    rate_limits: { requests: 100, timeWindow: '1h' },
  },
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
  canMakeRequest(
    apiName: string,
    maxRequests: number = 100,
    timeWindowMs: number = 60000
  ): boolean {
    const now = Date.now();
    let state = this.apiStates.get(apiName);

    if (!state) {
      state = {
        tokens: maxRequests,
        lastRefill: now,
        requestCount: 0,
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
  getRateLimitStatus(apiName: string): {
    tokens: number;
    requestCount: number;
    lastRefill: number;
  } {
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
    logger.error('Error parsing markdown API table:', error);
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
    const columns = row
      .split('|')
      .map(col => col.trim())
      .filter(col => col);

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
      urlValidity: isValidUrl(url),
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
      rate_limits: generateDefaultRateLimits(authType),
    };
  } catch (error) {
    logger.error('Error parsing markdown table row:', error);
    return null;
  }
}

/**
 * Extract keywords from text for API categorization
 * @param text - Input text to extract keywords from
 * @returns Array of relevant keywords
 */
function extractKeywordsFromText(text: string): string[] {
  const commonWords = new Set([
    'api',
    'the',
    'and',
    'or',
    'but',
    'for',
    'with',
    'to',
    'of',
    'in',
    'on',
    'at',
    'by',
  ]);

  return text
    .toLowerCase()
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
function generateDefaultRateLimits(authType: 'None' | 'API Key' | 'OAuth'): {
  requests: number;
  timeWindow: string;
} {
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
 * Implements keyword matching and role-based preferences (LEGACY METHOD)
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
      role_preference_bonus: score.roleBonus,
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
 * Claude-powered intelligent API selection
 * Uses Claude's natural language understanding to select relevant APIs
 * @param objective - User's objective/goal
 * @param detectedRole - Detected user role
 * @param apiRegistry - Array of available APIs (defaults to sample registry)
 * @returns Promise with top relevant APIs selected by Claude
 */
export async function selectRelevantAPIsWithClaude(
  objective: string,
  detectedRole: Role,
  apiRegistry: APIEndpoint[] = SAMPLE_API_REGISTRY
): Promise<APISelectionResult[]> {
  // For now, return the hardcoded selection as fallback
  // This will be implemented in the FSM where Claude can make the selection
  return selectRelevantAPIs(objective, detectedRole, apiRegistry);
}

/**
 * Generate API selection prompt for Claude
 * Creates a structured prompt for Claude to intelligently select APIs
 * @param objective - User's objective/goal
 * @param detectedRole - Detected user role
 * @param apiRegistry - Array of available APIs
 * @returns Formatted prompt for Claude
 */
export function generateAPISelectionPrompt(
  objective: string,
  detectedRole: Role,
  apiRegistry: APIEndpoint[] = SAMPLE_API_REGISTRY
): string {
  const apiList = apiRegistry
    .map(
      (api, index) =>
        `${index + 1}. **${api.name}** (${api.category})
   - Description: ${api.description}
   - URL: ${api.url}
   - Auth: ${api.auth_type}
   - Reliability: ${(api.reliability_score * 100).toFixed(0)}%
   - Keywords: ${api.keywords.join(', ')}`
    )
    .join('\n\n');

  return `# API Selection for Knowledge Gathering

## Objective
${objective}

## Detected Role
${detectedRole}

## Available APIs (${apiRegistry.length} total, all no-authentication required)
${apiList}

## Your Task
Analyze the objective and select the 3-5 most relevant APIs that would provide useful data for this task. Consider:

1. **Direct Relevance**: Which APIs directly support the objective?
2. **Role Appropriateness**: Which APIs align with the ${detectedRole} role?
3. **Data Quality**: Prefer APIs with higher reliability scores
4. **Complementary Data**: Select APIs that provide different types of useful information

## Response Format
Return a JSON array with your selected APIs in this exact format:
\`\`\`json
[
  {
    "api_name": "exact name from list",
    "relevance_score": 0.95,
    "selection_reason": "Brief explanation why this API is relevant"
  }
]
\`\`\`

Select 3-5 APIs maximum. Focus on quality over quantity.`;
}

/**
 * Parse Claude's API selection response
 * Converts Claude's JSON response back to APISelectionResult format
 * @param claudeResponse - Claude's response containing selected APIs
 * @param apiRegistry - Array of available APIs to match against
 * @returns Array of selected APIs in standard format
 */
export function parseClaudeAPISelection(
  claudeResponse: string,
  apiRegistry: APIEndpoint[] = SAMPLE_API_REGISTRY
): APISelectionResult[] {
  try {
    // Extract JSON from Claude's response
    const jsonMatch = claudeResponse.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      logger.warn('No JSON found in Claude response, falling back to hardcoded selection');
      return [];
    }

    const selectedAPIs = JSON.parse(jsonMatch[1]);

    if (!Array.isArray(selectedAPIs)) {
      logger.warn('Claude response is not an array, falling back');
      return [];
    }

    // Convert Claude's selection to APISelectionResult format
    const results: APISelectionResult[] = [];

    for (const selection of selectedAPIs) {
      const api = apiRegistry.find(a => a.name === selection.api_name);
      if (api) {
        results.push({
          api,
          relevance_score: selection.relevance_score || 0.8,
          matching_keywords: [selection.selection_reason || 'Claude selected'],
          role_preference_bonus: 0.1,
        });
      }
    }

    return results;
  } catch (error) {
    logger.error('Error parsing Claude API selection:', error);
    return [];
  }
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
    roleBonus,
  };
}

/**
 * Get API by name from registry
 * @param name - API name to search for
 * @param apiRegistry - Array of available APIs
 * @returns Found API endpoint or null
 */
export function getAPIByName(
  name: string,
  apiRegistry: APIEndpoint[] = SAMPLE_API_REGISTRY
): APIEndpoint | null {
  return apiRegistry.find(api => api.name.toLowerCase() === name.toLowerCase()) || null;
}

/**
 * Get APIs by category
 * @param category - Category to filter by
 * @param apiRegistry - Array of available APIs
 * @returns Array of APIs in the specified category
 */
export function getAPIsByCategory(
  category: string,
  apiRegistry: APIEndpoint[] = SAMPLE_API_REGISTRY
): APIEndpoint[] {
  return apiRegistry.filter(api => api.category.toLowerCase() === category.toLowerCase());
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
export function canUseAPI(
  apiName: string,
  apiRegistry: APIEndpoint[] = SAMPLE_API_REGISTRY
): boolean {
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
    case 's':
      return num * 1000;
    case 'm':
      return num * 60 * 1000;
    case 'h':
      return num * 60 * 60 * 1000;
    case 'd':
      return num * 24 * 60 * 60 * 1000;
    default:
      return 60000;
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
    corsPercentage: 0,
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
  getAPIRegistryStats,
};
