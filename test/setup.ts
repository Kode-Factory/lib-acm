// Jest setup file
// This file runs before each test file

// Set test environment variables
process.env.NODE_ENV = 'test';

// Global test timeout
jest.setTimeout(10000);

// Note: Individual test files should handle their own axios mocking
// to avoid conflicts with existing test setups