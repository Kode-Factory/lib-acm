import { 
  setApiKey,
  sendMessageToNumber,
  validateNumber,
  getApiKeyFromCredentialChain,
  unsetApiKey
} from '../src';
import { InvalidApiKeyError, InvalidNumberError } from '../src/errors';

describe('integration', () => {

  beforeAll(() => {
    jest.mock('axios', () => ({
      post: jest.fn().mockResolvedValue({ data: { success: true } }),
      get: jest.fn().mockResolvedValue({ data: { success: true } })
    }));
  });

  describe('test credential chain', () => {
    afterAll(() => {
      delete process.env.ALERTY_ACM_API_KEY;
      unsetApiKey();
    });

    it('should throw an error as it is not set', () => {
      expect(() => getApiKeyFromCredentialChain()).toThrow(InvalidApiKeyError);
    });

    it('should return the api from process.env', () => {
      process.env.ALERTY_ACM_API_KEY = 'fromenv';
      expect(getApiKeyFromCredentialChain()).toEqual('fromenv');
      delete process.env.ALERTY_ACM_API_KEY;
    });

    it('should return the api from setApiKey', () => {
      setApiKey('frommethod');
      expect(getApiKeyFromCredentialChain()).toEqual('frommethod');
      unsetApiKey();
    });

    it('should return the api from setApiKey if process.env is not set', () => {
      process.env.ALERTY_ACM_API_KEY = 'fromenv';
      setApiKey('frommethod');
      expect(getApiKeyFromCredentialChain()).toEqual('frommethod');
      delete process.env.ALERTY_ACM_API_KEY;
      unsetApiKey();
    });
  });

  describe('validate number', () => {
    it('validates number', () => {
      expect(() => validateNumber('929292929292')).toThrow(InvalidNumberError);
      expect(() => validateNumber('9292929292929')).toThrow(InvalidNumberError);
      expect(() => validateNumber('92929292929292')).toThrow(InvalidNumberError);
      expect(() => validateNumber('929292929292929')).toThrow(InvalidNumberError);
      expect(() => validateNumber('9292929292929292')).toThrow(InvalidNumberError);
      expect(() => validateNumber('92929292929292929')).toThrow(InvalidNumberError);
      expect(() => validateNumber('929292929292929292')).toThrow(InvalidNumberError);
      expect(() => validateNumber('12345678901')).not.toThrow(InvalidNumberError);
      expect(() => validateNumber('asdasdasdasd')).toThrow(InvalidNumberError);
      expect(() => validateNumber('123456789012')).toThrow(InvalidNumberError);
      expect(() => validateNumber('1234567890123')).toThrow(InvalidNumberError);
      expect(() => validateNumber('12345678901234')).toThrow(InvalidNumberError);
      expect(() => validateNumber('123456789012345')).toThrow(InvalidNumberError);
      expect(() => validateNumber('1234567890123456')).toThrow(InvalidNumberError);
      expect(() => validateNumber('12345678901234567')).toThrow(InvalidNumberError);
      expect(() => validateNumber('123456789012345678')).toThrow(InvalidNumberError);
      expect(() => validateNumber('1234567890123456789')).toThrow(InvalidNumberError);
      expect(() => validateNumber('12345678901234567890')).toThrow(InvalidNumberError);
      expect(() => validateNumber('123456789012345678901')).toThrow(InvalidNumberError);
      expect(() => validateNumber('1234567890123456789012')).toThrow(InvalidNumberError);
      expect(() => validateNumber('12345678901234567890123')).toThrow(InvalidNumberError);
      expect(() => validateNumber('123456789012345678901234')).toThrow(InvalidNumberError);
      expect(() => validateNumber('1234567890123456789012345')).toThrow(InvalidNumberError);
      expect(() => validateNumber('!@#!%#!$!@%!25')).toThrow(InvalidNumberError);
      expect(() => validateNumber('')).toThrow(InvalidNumberError);
    }); 
  });

  describe('send message to number', () => {
    beforeAll(() => {
      setApiKey('uoSvhejRM90yhXBGAfFYkHnlBEOItcZEQ6TT0RbsOtI=');
    });

    afterAll(() => {
      unsetApiKey();
    });
    
    it('should send a message to a number', async () => {
      await sendMessageToNumber('92929292929', 'Hello, world!');
    });

    it('fail send message as the number is invalid', async () => {
      await expect(sendMessageToNumber('asdasdasdasd', 'Hello, world!')).rejects.toThrow(InvalidNumberError);
    });

  });
});
