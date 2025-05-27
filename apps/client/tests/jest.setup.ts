// Set up DOM testing environment
import '@testing-library/jest-dom';

// Global mocks for next.js
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('ReactDOM.render is no longer supported')
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Mock next/router which might be used in components
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
  }),
}));

// Mock Material UI useMediaQuery hook if needed
jest.mock('@mui/material/useMediaQuery', () => jest.fn(() => false)); 