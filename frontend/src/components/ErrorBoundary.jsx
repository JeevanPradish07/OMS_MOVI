import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can log the error to an external service here
    // console.error('ErrorBoundary caught', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
          <div className="max-w-md text-center bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#0F172A] mb-2">Something went wrong</h2>
            <p className="text-sm text-[#64748B] mb-4">An unexpected error occurred while rendering this page.</p>
            <details className="text-xs text-[#94A3B8] text-left whitespace-pre-wrap">
              {String(this.state.error)}
            </details>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
