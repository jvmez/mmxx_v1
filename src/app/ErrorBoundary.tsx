"use client";

import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-sm text-gray-500 mb-4">
                The application encountered an error. This is usually caused by missing environment variables.
              </p>
              <div className="bg-gray-100 rounded-md p-3 mb-4">
                <p className="text-xs text-gray-600 font-mono break-words">
                  {this.state.error?.message || "Unknown error"}
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                <p className="text-xs font-semibold text-yellow-800 mb-2">Quick Fix:</p>
                <ol className="text-xs text-yellow-700 space-y-1 list-decimal list-inside text-left">
                  <li>Check your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file</li>
                  <li>Ensure <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_THIRDWEB_CLIENT_ID</code> is set with a valid client ID</li>
                  <li>Get your client ID from <a href="https://portal.thirdweb.com/typescript/v5/client" target="_blank" rel="noopener noreferrer" className="underline">thirdweb Portal</a></li>
                  <li>Restart your dev server after updating environment variables</li>
                </ol>
                {this.state.error?.message?.includes("ORIGIN_UNAUTHORIZED") || this.state.error?.message?.includes("Unauthorized domain") ? (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                    <p className="text-xs font-semibold text-red-800 mb-1">⚠️ Domain Authorization Error:</p>
                    <p className="text-xs text-red-700 mb-2">
                      Your localhost domain is not authorized. Add it to your thirdweb API key settings.
                    </p>
                    <a 
                      href="https://thirdweb.com/create-api-key" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 underline"
                    >
                      Fix in Thirdweb Dashboard →
                    </a>
                  </div>
                ) : null}
              </div>
              <div className="space-y-2">
                <button
                  onClick={this.resetError}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                <p className="text-xs text-gray-500">
                  If the error persists, check your environment variables in your deployment platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Application Error</h3>
          <p className="text-sm text-gray-500 mb-4">
            {error.message}
          </p>
          <button
            onClick={resetError}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
