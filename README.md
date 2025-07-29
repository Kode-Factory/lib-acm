# ACM - Alerty Core Messaging

Kode Factory's Alerty Core Messaging library for sending messages via the Alerty API.

## Installation

```bash
yarn install
```

## Build

This package is built using tsup for optimal bundle size and compatibility:

```bash
yarn build        # Build for production
yarn dev          # Build in watch mode
yarn clean        # Clean build artifacts
```

### Build Output

The build generates:
- **CommonJS**: `dist/index.js` (for Node.js require)
- **ES Modules**: `dist/index.mjs` (for modern bundlers)
- **TypeScript**: `dist/index.d.ts` (type definitions)
- **Source Maps**: For debugging

## Publishing

### Prerequisites

1. **npm account**: Make sure you're logged in to npm
   ```bash
   npm login
   ```

2. **Git setup**: Ensure you're on the main branch with clean working directory

### Publishing Workflow

#### 1. Dry Run (Recommended)
Test the package before publishing:
```bash
./scripts/dry-run.sh
```

#### 2. Publish
Publish a new version:
```bash
# Patch version (0.0.1 -> 0.0.2)
./scripts/publish.sh patch

# Minor version (0.0.1 -> 0.1.0)
./scripts/publish.sh minor

# Major version (0.0.1 -> 1.0.0)
./scripts/publish.sh major
```

#### 3. Manual Publishing
Or use npm directly:
```bash
yarn build
npm publish
```

### What Gets Published

The package includes:
- ✅ Built files (`dist/`)
- ✅ TypeScript declarations
- ✅ Package.json
- ✅ README.md
- ✅ LICENSE

Excludes:
- ❌ Source files (`src/`)
- ❌ Test files (`test/`)
- ❌ Configuration files
- ❌ Development dependencies

## Jest Testing Setup ✅

This project is configured with Jest for testing. The setup includes:

- **Jest Configuration**: `jest.config.js` with TypeScript support via `ts-jest`
- **Test Files**: Comprehensive test suites in `test/` directory
- **Coverage Reporting**: 100% code coverage for all functions
- **TypeScript Support**: Full TypeScript testing with proper type checking

### Dependencies Installed:
- `jest` - Testing framework
- `@types/jest` - TypeScript definitions for Jest
- `ts-jest` - TypeScript preprocessor for Jest

## Available Scripts

- `yarn build` - Build the package for distribution
- `yarn dev` - Build in watch mode for development
- `yarn clean` - Clean build artifacts
- `yarn test` - Run tests once
- `yarn test:watch` - Run tests in watch mode
- `yarn test:coverage` - Run tests with coverage report
- `yarn test:ci` - Run tests for CI environment
- `./scripts/dry-run.sh` - Test package before publishing
- `./scripts/publish.sh [version]` - Publish new version

## Test Results

✅ **All tests passing**: 15/15 tests pass  
✅ **100% Code Coverage**: All functions and branches covered  
✅ **TypeScript Support**: Full type checking in tests  

## Project Structure

```
acm/
├── src/
│   ├── index.ts      # Main module exports
│   └── errors.ts     # Custom error classes
├── test/
│   ├── setup.ts      # Jest setup configuration
│   ├── index.test.ts # Main module tests
│   └── integration.test.ts # Integration tests
├── scripts/
│   ├── publish.sh    # Publishing script
│   └── dry-run.sh    # Dry-run script
├── dist/             # Built files (generated)
├── jest.config.js    # Jest configuration
├── tsup.config.ts    # Build configuration
├── tsconfig.test.json # TypeScript config for tests
├── .npmignore        # Files excluded from npm package
└── package.json
```

## Testing

The project includes comprehensive tests for all exported functions:

- **API Key Management**: `getApiKeyFromCredentialChain`, `setApiKey`, `unsetApiKey`
- **Number Validation**: `validateNumber` with proper 11-digit validation
- **Message Sending**: `sendMessageToNumber` with axios mocking
- **Error Handling**: Custom error classes (`InvalidApiKeyError`, `InvalidNumberError`)

## Environment Variables

- `ALERTY_ACM_API_KEY` - Your Alerty API key (required for production use)

## Usage

### Basic Usage

```typescript
import { sendMessageToNumber, setApiKey } from '@kodefactory/acm';

// Set your API key
await setApiKey('your-api-key');

// Send a message (number must be exactly 11 digits)
const result = await sendMessageToNumber('12345678901', 'Hello World!');
```

### Error Handling

```typescript
import { 
  sendMessageToNumber, 
  setApiKey, 
  InvalidApiKeyError, 
  InvalidNumberError 
} from '@kodefactory/acm';

try {
  await setApiKey('your-api-key');
  const result = await sendMessageToNumber('12345678901', 'Hello World!');
  console.log('Message sent:', result);
} catch (error) {
  if (error instanceof InvalidApiKeyError) {
    console.error('Invalid API key');
  } else if (error instanceof InvalidNumberError) {
    console.error('Invalid phone number format');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Environment Variable Usage

```typescript
import { sendMessageToNumber } from '@kodefactory/acm';

// Set environment variable
process.env.ALERTY_ACM_API_KEY = 'your-api-key';

// Send message (uses environment variable automatically)
const result = await sendMessageToNumber('12345678901', 'Hello World!');
```