import { Component } from "react";
import { AlertTriangle } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Slipways Auto crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen flex-col items-center justify-center gap-3 bg-surface px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-soft text-red">
            <AlertTriangle size={22} />
          </div>
          <div className="text-base font-semibold text-ink">Something went wrong</div>
          <p className="max-w-sm text-sm text-ink-muted">
            Slipways Auto hit an unexpected error. Reloading usually fixes it — your data is saved locally.
          </p>
          <button
            className="rounded-lg border border-accent bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark"
            onClick={() => window.location.reload()}
          >
            Reload app
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
