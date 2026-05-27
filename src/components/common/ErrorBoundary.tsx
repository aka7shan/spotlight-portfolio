import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * Minimal error boundary so a single component crash doesn't blank the page.
 *
 * React error boundaries can only be class components (React 19 still hasn't
 * shipped a hook equivalent). Kept deliberately small — no analytics, no
 * fancy retry; just a friendly fallback + a reload button. When we wire up
 * Sentry/PostHog later, add `onError` to forward to the tracker.
 */

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback. Falls back to the built-in panel when omitted. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Optional callback for telemetry. */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // console.error survives Vite's prod build (see vite.config.ts) so this is
    // visible in the browser devtools / any error-tracker bridge.
    console.error('[ErrorBoundary]', error, info.componentStack);
    this.props.onError?.(error, info);
  }

  private reset = () => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) {
      return this.props.fallback(error, this.reset);
    }

    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full border border-destructive/30 bg-destructive/5 rounded-lg p-6 text-center space-y-4">
          <h2 className="font-semibold text-lg">Something went wrong</h2>
          <p className="text-sm text-muted-foreground break-words">
            {error.message || 'An unexpected error occurred.'}
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={this.reset}
              className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-input text-sm font-medium hover:bg-accent"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
            >
              Reload page
            </button>
          </div>
        </div>
      </div>
    );
  }
}
