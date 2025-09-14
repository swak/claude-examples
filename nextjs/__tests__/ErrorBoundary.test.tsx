import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import '@testing-library/jest-dom';
import ErrorBoundary from '../app/components/ErrorBoundary';
import theme from '../app/theme';

// Test wrapper with theme
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);

// Component that throws an error
const ThrowError: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

// Suppress console.error for these tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      </TestWrapper>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when child component throws', () => {
    render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </TestWrapper>
    );

    expect(screen.getByText('Component Error')).toBeInTheDocument();
    expect(screen.getByText(/This component encountered an error/)).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Show Details')).toBeInTheDocument();
  });

  it('renders page-level error UI when level is set to page', () => {
    render(
      <TestWrapper>
        <ErrorBoundary level="page">
          <ThrowError />
        </ErrorBoundary>
      </TestWrapper>
    );

    expect(screen.getByText('Page Error')).toBeInTheDocument();
    expect(screen.getByText(/Sorry, something went wrong with this page/)).toBeInTheDocument();
  });

  it('shows and hides error details when toggle button is clicked', () => {
    render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </TestWrapper>
    );

    // Details should be hidden initially
    expect(screen.queryByText('Error Details:')).not.toBeInTheDocument();

    // Click show details
    const toggleButton = screen.getByText('Show Details');
    fireEvent.click(toggleButton);

    // Details should now be visible
    expect(screen.getByText('Error Details:')).toBeInTheDocument();
    expect(screen.getByText(/Test error message/)).toBeInTheDocument();

    // Click hide details
    const hideButton = screen.getByText('Hide Details');
    fireEvent.click(hideButton);

    // Details should be hidden again
    expect(screen.queryByText('Error Details:')).not.toBeInTheDocument();
  });

  it('resets error state when try again button is clicked', () => {
    const { rerender } = render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </TestWrapper>
    );

    // Error UI should be visible
    expect(screen.getByText('Component Error')).toBeInTheDocument();

    // Click try again
    const tryAgainButton = screen.getByText('Try Again');
    fireEvent.click(tryAgainButton);

    // Rerender with non-throwing component
    rerender(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      </TestWrapper>
    );

    // Should show normal content now
    expect(screen.getByText('No error')).toBeInTheDocument();
    expect(screen.queryByText('Component Error')).not.toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const CustomFallback = <div>Custom error fallback</div>;

    render(
      <TestWrapper>
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError />
        </ErrorBoundary>
      </TestWrapper>
    );

    expect(screen.getByText('Custom error fallback')).toBeInTheDocument();
    expect(screen.queryByText('Component Error')).not.toBeInTheDocument();
  });

  it('logs error to console in development', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </TestWrapper>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    );

    consoleSpy.mockRestore();
  });

  it('has accessible error UI with proper ARIA labels', () => {
    render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </TestWrapper>
    );

    // Check for alert role
    expect(screen.getByRole('alert')).toBeInTheDocument();
    
    // Check buttons have proper labels
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show Details' })).toBeInTheDocument();
  });

  it('handles multiple error scenarios', () => {
    const { rerender } = render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </TestWrapper>
    );

    // First error
    expect(screen.getByText(/Test error message/)).toBeInTheDocument();

    // Reset and throw different error
    const tryAgainButton = screen.getByText('Try Again');
    fireEvent.click(tryAgainButton);

    // Component that throws different error
    const ThrowDifferentError = () => {
      throw new Error('Different error message');
    };

    rerender(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowDifferentError />
        </ErrorBoundary>
      </TestWrapper>
    );

    // Show details to verify new error message
    const toggleButton = screen.getByText('Show Details');
    fireEvent.click(toggleButton);

    expect(screen.getByText(/Different error message/)).toBeInTheDocument();
  });
});