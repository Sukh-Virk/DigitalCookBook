require('@testing-library/jest-dom');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = jest.fn();

// Mock alert
global.alert = jest.fn();

// Add custom matchers if needed
expect.extend({
  toBeValidResponse(received) {
    return {
      pass: received && typeof received === 'object',
      message: () => 'Expected response to be a valid object'
    };
  }
});