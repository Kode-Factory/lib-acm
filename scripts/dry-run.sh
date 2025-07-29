#!/bin/bash

# Dry-run script for @kodefactory/acm

set -e

echo "🧪 Dry-run for @kodefactory/acm..."

# Run tests
echo "🧪 Running tests..."
yarn test

# Build the package
echo "🔨 Building package..."
yarn build

# Check if build was successful
if [ ! -d "dist" ]; then
  echo "❌ Error: Build failed - dist directory not found"
  exit 1
fi

# Show what would be published
echo "📦 Package contents that would be published:"
echo "=========================================="
npm pack --dry-run

echo ""
echo "📋 Package.json contents:"
echo "========================="
cat package.json | jq 'del(.devDependencies, .scripts)' 2>/dev/null || cat package.json

echo ""
echo "📁 Dist directory contents:"
echo "==========================="
ls -la dist/

echo ""
echo "✅ Dry-run completed successfully!"
echo "📝 To publish, run: ./scripts/publish.sh [major|minor|patch]"