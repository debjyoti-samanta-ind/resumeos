import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override render() {
    if (this.state.error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle size={18} />
            <span className="font-semibold">{this.props.fallbackTitle ?? 'Rendering error'}</span>
          </div>
          <p className="text-sm text-red-600">{this.state.error.message}</p>
          <details className="text-xs text-red-400">
            <summary className="cursor-pointer">Stack trace</summary>
            <pre className="mt-2 whitespace-pre-wrap">{this.state.error.stack}</pre>
          </details>
          <button
            onClick={() => this.setState({ error: null })}
            className="text-sm text-red-600 underline hover:text-red-800"
          >
            Dismiss and try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
