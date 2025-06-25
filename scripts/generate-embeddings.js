#!/usr/bin/env node

// Embedding generation script for Iron Manus MCP
// Run this script with your OpenAI API key to generate pre-computed embeddings
// Usage: OPENAI_API_KEY=your_key node scripts/generate-embeddings.js

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock API registry for demonstration (in real use, import from compiled JS)
const SAMPLE_API_REGISTRY = [
  {
    name: 'OpenWeather API',
    description: 'Get current weather, forecasts, and historical weather data for any location',
    url: 'https://openweathermap.org/api',
    category: 'weather',
    keywords: ['weather', 'forecast', 'temperature', 'climate', 'meteorology'],
    auth_type: 'API Key',
    https: true,
    cors: true,
    reliability_score: 0.9
  },
  {
    name: 'CoinGecko API',
    description: 'Cryptocurrency prices, market data, and trading information',
    url: 'https://api.coingecko.com/api/v3',
    category: 'cryptocurrency',
    keywords: ['crypto', 'bitcoin', 'ethereum', 'trading', 'blockchain'],
    auth_type: 'None',
    https: true,
    cors: true,
    reliability_score: 0.85
  },
  {
    name: 'GitHub API',
    description: 'Access repositories, issues, pull requests, and user data',
    url: 'https://api.github.com',
    category: 'development',
    keywords: ['git', 'code', 'repository', 'development', 'version-control'],
    auth_type: 'API Key',
    https: true,
    cors: true,
    reliability_score: 0.95
  }
  // Add more APIs as needed...
];

/**
 * Generate embeddings using OpenAI API
 */
async function generateOpenAIEmbeddings(texts, apiKey) {
  console.log(`Generating embeddings for ${texts.length} texts...`);
  
  const embeddings = [];
  const batchSize = 100; // OpenAI batch limit
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(texts.length/batchSize)}`);
    
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: batch,
          model: 'text-embedding-3-small'
        })
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      embeddings.push(...data.data.map(item => item.embedding));
      
      // Rate limiting - wait between batches
      if (i + batchSize < texts.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } catch (error) {
      console.error(`Error processing batch ${Math.floor(i/batchSize) + 1}:`, error);
      throw error;
    }
  }
  
  return embeddings;
}

/**
 * Generate local embeddings (fallback method)
 */
function generateLocalEmbeddings(texts) {
  console.log('Generating local embeddings...');
  
  const dimensions = 384;
  const embeddings = [];
  
  // Build vocabulary
  const vocabulary = new Map();
  const docFreq = new Map();
  
  // First pass: build vocabulary
  texts.forEach(text => {
    const words = tokenize(text);
    const uniqueWords = new Set(words);
    
    uniqueWords.forEach(word => {
      docFreq.set(word, (docFreq.get(word) || 0) + 1);
    });
  });
  
  // Select top words for vocabulary
  const sortedWords = Array.from(docFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5000);
  
  sortedWords.forEach(([word, freq], index) => {
    vocabulary.set(word, index);
  });
  
  // Second pass: generate embeddings
  texts.forEach(text => {
    const embedding = generateLocalEmbedding(text, vocabulary, docFreq, texts.length, dimensions);
    embeddings.push(embedding);
  });
  
  return embeddings;
}

function tokenize(text) {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
}

function generateLocalEmbedding(text, vocabulary, docFreq, totalDocs, dimensions) {
  const embedding = new Array(dimensions).fill(0);
  const words = tokenize(text);
  const termFreq = new Map();
  
  // Count term frequencies
  words.forEach(word => {
    termFreq.set(word, (termFreq.get(word) || 0) + 1);
  });
  
  // Generate TF-IDF features
  termFreq.forEach((tf, term) => {
    if (vocabulary.has(term)) {
      const df = docFreq.get(term) || 1;
      const idf = Math.log(totalDocs / df);
      const tfidf = tf * idf;
      
      const hash1 = hashString(term) % dimensions;
      const hash2 = hashString(term + '_2') % dimensions;
      
      embedding[hash1] += tfidf;
      embedding[hash2] += tfidf * 0.5;
    }
  });
  
  // Normalize
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (norm > 0) {
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= norm;
    }
  }
  
  return embedding;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0x7fffffff;
  }
  return hash;
}

/**
 * Main generation function
 */
async function generateEmbeddings() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  console.log('🚀 Iron Manus Embedding Generation Script');
  console.log('=========================================\n');
  
  // Prepare API data for embedding
  const apiTexts = SAMPLE_API_REGISTRY.map(api => 
    `${api.name}: ${api.description}. Categories: ${api.keywords.join(', ')}. Type: ${api.category}`
  );
  
  let embeddings;
  let embeddingType;
  
  if (apiKey) {
    console.log('✅ OpenAI API key found - generating high-quality embeddings');
    try {
      embeddings = await generateOpenAIEmbeddings(apiTexts, apiKey);
      embeddingType = 'openai_text_embedding_3_small';
    } catch (error) {
      console.log('❌ OpenAI embedding failed, falling back to local embeddings');
      console.error('Error:', error.message);
      embeddings = generateLocalEmbeddings(apiTexts);
      embeddingType = 'local_tfidf';
    }
  } else {
    console.log('⚠️  No OpenAI API key found - generating local embeddings');
    embeddings = generateLocalEmbeddings(apiTexts);
    embeddingType = 'local_tfidf';
  }
  
  // Create embedding objects
  const embeddingObjects = SAMPLE_API_REGISTRY.map((api, index) => ({
    id: crypto.createHash('sha256').update(apiTexts[index]).digest('hex').substring(0, 16),
    vector: embeddings[index],
    metadata: {
      text: apiTexts[index],
      source: api.name,
      type: 'api',
      created_at: Date.now(),
      api_data: api,
      category: api.category,
      keywords: api.keywords
    }
  }));
  
  // Prepare output data
  const outputData = {
    version: '1.0',
    embedding_type: embeddingType,
    dimensions: embeddings[0].length,
    generated_at: new Date().toISOString(),
    total_embeddings: embeddingObjects.length,
    embeddings: embeddingObjects
  };
  
  // Ensure data directory exists
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  // Write embeddings to file
  const outputPath = path.join(dataDir, 'precomputed-embeddings.json');
  await fs.writeFile(outputPath, JSON.stringify(outputData, null, 2));
  
  // Calculate file size
  const stats = await fs.stat(outputPath);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log('\n✅ Embedding generation complete!');
  console.log(`📄 Output file: ${outputPath}`);
  console.log(`📊 Total embeddings: ${embeddingObjects.length}`);
  console.log(`📐 Dimensions: ${embeddings[0].length}`);
  console.log(`💾 File size: ${fileSizeMB} MB`);
  console.log(`🔧 Embedding type: ${embeddingType}`);
  
  if (embeddingType.includes('openai')) {
    console.log('\n🎉 High-quality OpenAI embeddings generated!');
    console.log('These will provide excellent semantic search capabilities.');
  } else {
    console.log('\n📝 Local embeddings generated.');
    console.log('For better quality, run with OPENAI_API_KEY environment variable.');
  }
  
  console.log('\n🚀 Ready to package with your MCP server!');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  generateEmbeddings().catch(error => {
    console.error('❌ Generation failed:', error);
    process.exit(1);
  });
}