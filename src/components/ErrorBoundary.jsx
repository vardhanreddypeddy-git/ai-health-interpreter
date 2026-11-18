import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error Caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-3xl p-8 border border-rose-200 shadow-md my-8 text-center max-w-xl mx-auto">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Something unexpected occurred while rendering the report
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            We caught this gracefully so you don't lose your work. Click below to reload the interpreter.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-5 py-2.5 rounded-xl bg-clinical-600 text-white font-bold text-xs hover:bg-clinical-700 transition-all cursor-pointer shadow-md inline-flex items-center space-x-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Interpreter</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
