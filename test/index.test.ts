import {
  getApiKeyFromCredentialChain,
  setApiKey,
  unsetApiKey,
  validateNumber,
  sendMessageToNumber
} from '../src/index';
import { InvalidApiKeyError, InvalidNumberError } from '../src/errors';

// Mock axios
jest.mock('axios');
const axios = require('axios');

describe('ACM Module', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset the module state
    jest.resetModules();
    // Set up test environment variable
    process.env.ALERTY_ACM_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    // Clean up environment variable
    delete process.env.ALERTY_ACM_API_KEY;
  });

  describe('getApiKeyFromCredentialChain', () => {
    it('should return API key from environment variable', () => {
      const result = getApiKeyFromCredentialChain();
      expect(result).toBe('test-api-key');
    });

    it('should throw InvalidApiKeyError when no API key is set', () => {
      // Temporarily unset the environment variable
      delete process.env.ALERTY_ACM_API_KEY;
      
      expect(() => getApiKeyFromCredentialChain()).toThrow(InvalidApiKeyError);
      expect(() => getApiKeyFromCredentialChain()).toThrow('ALERTY_ACM_API_KEY is not set');
    });
  });

  describe('setApiKey and unsetApiKey', () => {
    it('should set and unset API key correctly', async () => {
      // Test setting API key
      await setApiKey('custom-api-key');
      expect(getApiKeyFromCredentialChain()).toBe('custom-api-key');
      
      // Test unsetting API key
      await unsetApiKey();
      expect(getApiKeyFromCredentialChain()).toBe('test-api-key');
    });
  });

  describe('validateNumber', () => {
    it('should throw InvalidNumberError for non-11-digit numbers', () => {
      expect(() => validateNumber('1234567890')).toThrow(InvalidNumberError);
      expect(() => validateNumber('123456789012')).toThrow(InvalidNumberError);
      expect(() => validateNumber('1234567890')).toThrow('Invalid number: 1234567890');
    });

    it('should not throw for valid 11-digit numbers', () => {
      expect(() => validateNumber('12345678901')).not.toThrow();
    });
  });

  describe('sendMessageToNumber', () => {
    it('should send message successfully', async () => {
      const mockResponse = { data: { success: true, messageId: '123' } };
      axios.post.mockResolvedValue(mockResponse);

      const result = await sendMessageToNumber('12345678901', 'Test message');
      
      expect(axios.post).toHaveBeenCalledWith(
        'https://mw.alerty.com.br/rest/instance/sendMessage',
        {
          to: {
            type: 'contact',
            id: '12345678901'
          },
          message: 'Test message'
        },
        {
          headers: {
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json'
          }
        }
      );
      
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when API call fails', async () => {
      const mockError = new Error('API Error');
      axios.post.mockRejectedValue(mockError);

      await expect(sendMessageToNumber('12345678901', 'Test message')).rejects.toThrow('API Error');
    });

    it('should throw InvalidNumberError for invalid number', async () => {
      await expect(sendMessageToNumber('1234567890', 'Test message')).rejects.toThrow(InvalidNumberError);
    });
  });
});