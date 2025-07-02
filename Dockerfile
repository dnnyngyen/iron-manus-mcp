FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code
COPY tsconfig.json ./
COPY src ./src

# Build the TypeScript project
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user (use different UID/GID if 1000 is taken)
RUN addgroup -g 1001 mcp && \
    adduser -u 1001 -G mcp -s /bin/sh -D mcp

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy any necessary configuration files
COPY --chown=mcp:mcp . .

# Switch to non-root user
USER mcp

# Environment variables with defaults
ENV NODE_ENV=production \
    # Knowledge phase configuration
    KNOWLEDGE_MAX_CONCURRENCY=2 \
    KNOWLEDGE_TIMEOUT_MS=4000 \
    KNOWLEDGE_CONFIDENCE_THRESHOLD=0.4 \
    KNOWLEDGE_MAX_RESPONSE_SIZE=5000 \
    # Auto-connection configuration
    AUTO_CONNECTION_ENABLED=true \
    # Rate limiting configuration
    RATE_LIMIT_REQUESTS_PER_MINUTE=5 \
    RATE_LIMIT_WINDOW_MS=60000 \
    # Content limits
    MAX_CONTENT_LENGTH=2097152 \
    MAX_BODY_LENGTH=2097152 \
    # Performance thresholds
    VERIFICATION_COMPLETION_THRESHOLD=95 \
    EXECUTION_SUCCESS_RATE_THRESHOLD=0.7 \
    # Reasoning effectiveness
    INITIAL_REASONING_EFFECTIVENESS=0.8 \
    MIN_REASONING_EFFECTIVENESS=0.3 \
    MAX_REASONING_EFFECTIVENESS=1.0 \
    # Security configuration
    ALLOWED_HOSTS="" \
    ENABLE_SSRF_PROTECTION=true \
    # User agent
    USER_AGENT="Iron-Manus-MCP/1.0.0-AutoFetch"

# Expose the MCP stdio interface
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Run the MCP server
CMD ["node", "dist/index.js"]