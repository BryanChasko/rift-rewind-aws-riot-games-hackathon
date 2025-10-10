import React from 'react';
import { Alert } from '@cloudscape-design/components';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert
          statusIconAriaLabel="Error"
          type="error"
          header="Something went wrong"
          action={
            <button onClick={() => window.location.reload()}>
              Reload page
            </button>
          }
        >
          An unexpected error occurred. Please reload the page to continue.
        </Alert>
      );
    }

    return this.props.children;
  }
}