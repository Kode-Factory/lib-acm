#!/bin/bash

# Publish script for @kodefactory/acm

set -e

echo "🚀 Publishing @kodefactory/acm..."

# Check if we're on main branch
if [[ $(git branch --show-current) != "main" ]]; then
  echo "❌ Error: Must be on main branch to publish"
  exit 1
fi

# Check if working directory is clean
if [[ -n $(git status --porcelain) ]]; then
  echo "❌ Error: Working directory is not clean. Please commit or stash changes."
  exit 1
fi

# Check if user is logged in to npm
if ! npm whoami > /dev/null 2>&1; then
  echo "❌ Error: Not logged in to npm. Please run 'npm login' first."
  exit 1
fi

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

# Determine version bump type
VERSION_TYPE=${1:-patch}

if [[ ! "$VERSION_TYPE" =~ ^(major|minor|patch)$ ]]; then
  echo "❌ Error: Invalid version type. Use: major, minor, or patch"
  exit 1
fi

# Bump version
echo "📦 Bumping version ($VERSION_TYPE)..."
npm version $VERSION_TYPE --no-git-tag-version

# Get the new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "📋 New version: $NEW_VERSION"

# Create git tag
git add package.json
git commit -m "chore: bump version to $NEW_VERSION"
git tag "v$NEW_VERSION"

# Publish to npm
echo "📤 Publishing to npm..."
npm publish

# Push to git
echo "📤 Pushing to git..."
git push origin main --tags

echo "✅ Successfully published @kodefactory/acm@$NEW_VERSION"
echo "🔗 Package: https://www.npmjs.com/package/@kodefactory/acm"