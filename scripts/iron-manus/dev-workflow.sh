#!/bin/bash
# Iron Manus DevEx Workflow Hook
# PostToolUse hook for Write|Edit|MultiEdit that automatically formats and lints code
# Enhances development experience with automated quality assurance

set -e

# Read JSON input from stdin
INPUT=$(cat)

# Extract file path from JSON using jq (falls back to basic parsing if jq not available)
if command -v jq >/dev/null 2>&1; then
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // ""')
else
    # Basic fallback without jq
    FILE_PATH=$(echo "$INPUT" | grep -o '"file_path":"[^"]*"' | cut -d'"' -f4)
fi

# Skip if no file path found
if [ -z "$FILE_PATH" ] || [ "$FILE_PATH" = "null" ]; then
    exit 0
fi

# Skip if file doesn't exist
if [ ! -f "$FILE_PATH" ]; then
    exit 0
fi

# Get file extension
EXTENSION="${FILE_PATH##*.}"

# Change to project root (where package.json should be)
PROJECT_ROOT="/Users/dannynguyen/iron-manus-mcp"
if [ -d "$PROJECT_ROOT" ]; then
    cd "$PROJECT_ROOT"
fi

echo "🔧 Iron Manus DevEx: Processing $FILE_PATH"

# Process TypeScript files
if [ "$EXTENSION" = "ts" ] || [ "$EXTENSION" = "js" ] || [ "$EXTENSION" = "tsx" ] || [ "$EXTENSION" = "jsx" ]; then
    echo "📝 Running Prettier formatting..."
    if command -v npm >/dev/null 2>&1; then
        # Format the specific file
        npm run format --silent 2>/dev/null || {
            echo "⚠️  Format command failed, trying direct prettier..."
            npx prettier --write "$FILE_PATH" 2>/dev/null || true
        }
        
        echo "🔍 Running ESLint..."
        # Lint the specific file with auto-fix
        npm run lint -- --fix "$FILE_PATH" --silent 2>/dev/null || {
            echo "⚠️  ESLint failed, trying without auto-fix..."
            npm run lint -- "$FILE_PATH" --silent 2>/dev/null || true
        }
        
        echo "✅ Code quality checks completed"
    else
        echo "⚠️  npm not found, skipping formatting"
    fi

# Process JSON files
elif [ "$EXTENSION" = "json" ]; then
    echo "📝 Formatting JSON file..."
    if command -v jq >/dev/null 2>&1; then
        # Format JSON with jq
        TMP_FILE=$(mktemp)
        jq '.' "$FILE_PATH" > "$TMP_FILE" 2>/dev/null && mv "$TMP_FILE" "$FILE_PATH" || rm -f "$TMP_FILE"
        echo "✅ JSON formatting completed"
    fi

# Process Markdown files
elif [ "$EXTENSION" = "md" ]; then
    echo "📝 Checking Markdown formatting..."
    if command -v npx >/dev/null 2>&1; then
        npx markdownlint --fix "$FILE_PATH" 2>/dev/null || true
        echo "✅ Markdown formatting completed"
    fi

else
    echo "ℹ️  File type .$EXTENSION - no specific formatting applied"
fi

# Run type checking for TypeScript files in the project
if [ "$EXTENSION" = "ts" ] && [ -f "tsconfig.json" ]; then
    echo "🔍 Running TypeScript type checking..."
    npm run build --silent 2>/dev/null || {
        echo "⚠️  Type checking found issues (build will show details)"
    }
fi

echo "🎯 DevEx workflow completed for $FILE_PATH"
exit 0