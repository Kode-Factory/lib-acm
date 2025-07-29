# @kodefactory/acm

A TypeScript library for sending messages via the Alerty API. This library provides a simple and type-safe way to integrate Alerty messaging services into your applications.

## Installation

```bash
npm install @kodefactory/acm
# or
yarn add @kodefactory/acm
```

## Quick Start

```typescript
import { sendMessageToNumber, setApiKey } from '@kodefactory/acm';

// Set your API key
await setApiKey('your-alerty-api-key');

// Send a message
const result = await sendMessageToNumber('12345678901', 'Hello from Alerty!');
console.log('Message sent:', result);
```

## API Reference

### Authentication

#### `setApiKey(key: string): Promise<void>`
Set your Alerty API key programmatically.

```typescript
import { setApiKey } from '@kodefactory/acm';

await setApiKey('your-api-key-here');
```

#### `unsetApiKey(): Promise<void>`
Clear the programmatically set API key (will fall back to environment variable).

```typescript
import { unsetApiKey } from '@kodefactory/acm';

await unsetApiKey();
```

#### Environment Variable
You can also set your API key using an environment variable:

```bash
export ALERTY_ACM_API_KEY="your-api-key-here"
```

```typescript
import { sendMessageToNumber } from '@kodefactory/acm';

// Will automatically use ALERTY_ACM_API_KEY environment variable
const result = await sendMessageToNumber('12345678901', 'Hello!');
```

### Sending Messages

#### `sendMessageToNumber(number: string, message: string): Promise<any>`
Send a message to a specific phone number.

**Parameters:**
- `number` (string): Phone number in 11-digit format (e.g., "12345678901")
- `message` (string): The message content to send

**Returns:** Promise with the API response

```typescript
import { sendMessageToNumber } from '@kodefactory/acm';

try {
  const result = await sendMessageToNumber('12345678901', 'Hello World!');
  console.log('Message sent successfully:', result);
} catch (error) {
  console.error('Failed to send message:', error);
}
```

### Validation

#### `validateNumber(number: string): void`
Validate a phone number format. Throws an error if the number is not exactly 11 digits.

```typescript
import { validateNumber } from '@kodefactory/acm';

try {
  validateNumber('12345678901'); // ✅ Valid
  validateNumber('1234567890');  // ❌ Throws InvalidNumberError
} catch (error) {
  console.error('Invalid number:', error.message);
}
```

### Error Handling

The library provides specific error classes for better error handling:

```typescript
import { 
  sendMessageToNumber, 
  InvalidApiKeyError, 
  InvalidNumberError 
} from '@kodefactory/acm';

try {
  const result = await sendMessageToNumber('12345678901', 'Hello!');
  console.log('Success:', result);
} catch (error) {
  if (error instanceof InvalidApiKeyError) {
    console.error('API key is missing or invalid');
  } else if (error instanceof InvalidNumberError) {
    console.error('Phone number format is invalid');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Examples

### Basic Usage with Error Handling

```typescript
import { 
  sendMessageToNumber, 
  setApiKey, 
  InvalidApiKeyError, 
  InvalidNumberError 
} from '@kodefactory/acm';

async function sendAlert(message: string, phoneNumber: string) {
  try {
    // Set API key
    await setApiKey(process.env.ALERTY_API_KEY);
    
    // Send message
    const result = await sendMessageToNumber(phoneNumber, message);
    
    console.log('Alert sent successfully:', result);
    return result;
  } catch (error) {
    if (error instanceof InvalidApiKeyError) {
      console.error('❌ Invalid API key. Please check your configuration.');
    } else if (error instanceof InvalidNumberError) {
      console.error('❌ Invalid phone number format. Must be exactly 11 digits.');
    } else {
      console.error('❌ Failed to send alert:', error.message);
    }
    throw error;
  }
}

// Usage
sendAlert('Server is down!', '12345678901');
```

### Using Environment Variables

```typescript
import { sendMessageToNumber } from '@kodefactory/acm';

// Set environment variable
process.env.ALERTY_ACM_API_KEY = 'your-api-key';

// Send message (uses environment variable automatically)
const sendNotification = async (phoneNumber: string, message: string) => {
  try {
    const result = await sendMessageToNumber(phoneNumber, message);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Usage
sendNotification('12345678901', 'Your order has been shipped!');
```

### Validation Before Sending

```typescript
import { validateNumber, sendMessageToNumber } from '@kodefactory/acm';

async function sendValidatedMessage(phoneNumber: string, message: string) {
  // Validate number first
  try {
    validateNumber(phoneNumber);
  } catch (error) {
    throw new Error(`Invalid phone number: ${phoneNumber}. Must be exactly 11 digits.`);
  }
  
  // Send message if validation passes
  return await sendMessageToNumber(phoneNumber, message);
}

// Usage
sendValidatedMessage('12345678901', 'Valid message!');
```

### Express.js Integration

```typescript
import express from 'express';
import { sendMessageToNumber, setApiKey, InvalidApiKeyError, InvalidNumberError } from '@kodefactory/acm';

const app = express();
app.use(express.json());

// Set API key once when app starts
setApiKey(process.env.ALERTY_ACM_API_KEY);

app.post('/send-message', async (req, res) => {
  const { phoneNumber, message } = req.body;
  
  try {
    const result = await sendMessageToNumber(phoneNumber, message);
    res.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof InvalidApiKeyError) {
      res.status(401).json({ error: 'Invalid API key' });
    } else if (error instanceof InvalidNumberError) {
      res.status(400).json({ error: 'Invalid phone number format' });
    } else {
      res.status(500).json({ error: 'Failed to send message' });
    }
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### React/Next.js Hook

```typescript
import { useState } from 'react';
import { sendMessageToNumber, setApiKey } from '@kodefactory/acm';

export function useAlertyMessaging() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (phoneNumber: string, message: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Set API key (you might want to do this once in your app initialization)
      await setApiKey(process.env.NEXT_PUBLIC_ALERTY_API_KEY);
      
      const result = await sendMessageToNumber(phoneNumber, message);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
}

// Usage in component
function MessageForm() {
  const { sendMessage, loading, error } = useAlertyMessaging();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendMessage(phoneNumber, message);
      alert('Message sent successfully!');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone number (11 digits)"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
```

## Phone Number Format

The library requires phone numbers to be in **exactly 11 digits** format:

- ✅ `"12345678901"` - Valid
- ❌ `"1234567890"` - Too short (10 digits)
- ❌ `"123456789012"` - Too long (12 digits)
- ❌ `"123-456-7890"` - Contains non-digits
- ❌ `"abc123def45"` - Contains letters

## Error Types

| Error Class | Description | When Thrown |
|-------------|-------------|-------------|
| `InvalidApiKeyError` | API key is missing or invalid | When `ALERTY_ACM_API_KEY` is not set or invalid |
| `InvalidNumberError` | Phone number format is invalid | When number is not exactly 11 digits |

## TypeScript Support

This library is written in TypeScript and provides full type definitions:

```typescript
import { sendMessageToNumber } from '@kodefactory/acm';

// TypeScript will provide full IntelliSense and type checking
const result: Promise<any> = sendMessageToNumber('12345678901', 'Hello!');
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ALERTY_ACM_API_KEY` | Your Alerty API key | Yes (if not set programmatically) |

## License

MIT License - see [LICENSE](LICENSE) file for details.