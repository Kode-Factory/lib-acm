export class InvalidNumberError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidNumberError';
  }
}

export class InvalidApiKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidApiKeyError';
  }
}