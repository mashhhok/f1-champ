# F1 Champions Frontend

A Next.js application showing Formula 1 World Champions and race results.

## Testing Strategy

This application uses Jest and React Testing Library for unit testing. The tests are designed to verify that components render correctly and behave as expected when users interact with them.

### Testing Setup

The test environment is configured in `jest.config.ts` and uses the following tools:

- **Jest**: Test runner and assertion library
- **React Testing Library**: For rendering React components and testing user interactions
- **jest-dom**: Custom matchers for DOM assertions

### Running Tests

To run all tests:

```bash
npm test
```

To run tests in watch mode (for development):

```bash
npm run test:watch
```

### Test Structure

Tests are organized in the `/specs` directory and follow this pattern:

1. **Component Tests**: Test the rendering and behavior of individual components
   - Example: `Header.spec.tsx`, `SeasonTable.spec.tsx`

2. **Integration Tests**: Test how components work together
   - Example: `SeasonsContainer.spec.tsx` tests the container and its child components

### Testing Best Practices

1. **Test Behavior, Not Implementation**: Tests focus on what the user sees and interacts with, not internal implementation details.

2. **Mock External Dependencies**: External dependencies like API calls or complex components are mocked.

3. **Avoid test-ids**: Instead of using `data-testid` attributes, we query elements in a way that reflects how users interact with the app:
   - By accessible roles (`getByRole`)
   - By text content (`getByText`)
   - By form labels (`getByLabelText`)
   - By alt text (`getByAltText`)

4. **Prioritize Accessibility**: Our tests prefer using accessibility-friendly selectors like ARIA roles and labels, which also ensures our components are accessible.

5. **Isolated Tests**: Each test is isolated and doesn't depend on other tests.

### Example Test Using Accessibility Roles

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeUpdater from '../src/components/ThemeUpdater';

describe('ThemeUpdater', () => {
  it('renders the theme switch', () => {
    render(<ThemeUpdater />);
    
    // Use role-based query instead of test-id
    expect(screen.getByRole('switch', { name: 'Toggle dark mode' })).toBeInTheDocument();
  });

  it('switches theme when clicked', () => {
    render(<ThemeUpdater />);
    
    // Query by role and name
    const themeSwitch = screen.getByRole('switch', { name: 'Toggle dark mode' });
    
    // Initial state
    expect(themeSwitch).toHaveAttribute('aria-checked', 'false');
    
    // Interact
    fireEvent.click(themeSwitch);
    
    // Verify behavior
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
```

## Testing

This project uses Jest for testing. All test files should use the `.test.tsx` or `.test.ts` file extension instead of `.spec.tsx` or `.spec.ts`. 

Tests are located in the `tests` directory and follow the same structure as the `src` directory.

To run tests:

```bash
npm run test
``` 