FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# SECURITY FIX: Create clean package.json to avoid platform-specific dependency issues
# The original package-lock.json contains Darwin-specific rollup binaries that fail on Linux
RUN echo '{"name": "iron-manus-mcp", "version": "0.2.4", "type": "module", "engines": {"node": ">=20.0.0"}}' > package.json

# Install only essential runtime dependencies for building
# Avoids all dev dependencies that cause platform compatibility issues
RUN npm install typescript @types/node @modelcontextprotocol/sdk axios bcrypt dotenv express express-rate-limit jsonwebtoken p-limit zod

# Copy source code
COPY tsconfig.json ./
COPY src ./src

# SECURITY FIX: Remove test files to avoid compilation errors and reduce image size
# Test files contain development-only imports that would fail in production build
RUN find src -name "*.test.ts" -delete

# Build the TypeScript project directly with tsc
RUN npx tsc

# Stage 2: Runtime
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user (use different UID/GID if 1000 is taken)
RUN addgroup -g 1001 mcp && \
    adduser -u 1001 -G mcp -s /bin/sh -D mcp

# Set working directory
WORKDIR /app

# Copy original package.json for runtime metadata
COPY package.json ./

# EFFICIENCY: Copy clean node_modules from builder (production deps only)
# This avoids installing dependencies again and excludes dev/test packages
COPY --from=builder /app/node_modules ./node_modules

# Copy compiled application from builder stage
COPY --from=builder /app/dist ./dist

# Copy essential runtime files (LICENSE required for legal compliance)
COPY README.md LICENSE ./

# Copy health check script for Docker health monitoring
COPY healthcheck.js ./

# SECURITY: Change ownership to non-root user
RUN chown -R mcp:mcp /app

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
    USER_AGENT="Iron-Manus-MCP/0.2.4-AutoFetch"

# Expose the MCP stdio interface
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Run the MCP server
CMD ["node", "dist/index.js"]