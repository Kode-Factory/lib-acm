import axios from 'axios';
import { InvalidApiKeyError, InvalidNumberError } from './errors';

let apiKey:string|undefined = undefined;

export function getApiKeyFromCredentialChain(){
  const credentialChain = apiKey ?? process.env.ALERTY_ACM_API_KEY;
  if(!credentialChain) {
    throw new InvalidApiKeyError('ALERTY_ACM_API_KEY is not set');
  }
  return credentialChain;
}

export async function setApiKey(key: string) {
  apiKey = key;
}

export async function unsetApiKey() {
  apiKey = undefined;
}

export function validateNumber(number: string) {
  if(!number.match(/^\d{11}$/)) {
    throw new InvalidNumberError(`Invalid number: ${number}`);
  }
}

export async function sendMessageToNumber(number: string, message: string) {
  // Validate the number first
  validateNumber(number);
  
  try {
    const response = await axios.post(
      'https://mw.alerty.com.br/rest/instance/sendMessage',
      {
        to: {
          type: "contact",
          id: number
        },
        message: message
      },
      {
        headers: {
          'x-api-key': getApiKeyFromCredentialChain(),
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { InvalidApiKeyError, InvalidNumberError };
