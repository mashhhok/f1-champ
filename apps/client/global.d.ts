import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeChecked(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeEmpty(): R;
      toBeVisible(): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(htmlText: string): R;
      toHaveClass(...classNames: string[]): R;
      toHaveFocus(): R;
      toHaveLength(length: number): R;
      toHaveStyle(css: Record<string, any>): R;
      toHaveValue(value?: string | string[] | number): R;
    }
  }
} 