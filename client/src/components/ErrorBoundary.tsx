import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, Trash2 } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private handleResetCache = () => {
    try {
      // Clear potentially corrupted application keys
      const keysToKeep = ["krivexo_lang"];
      const toRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("krivexo_") && !keysToKeep.includes(key)) {
          toRemove.push(key);
        }
      }
      toRemove.forEach(k => localStorage.removeItem(k));
    } catch {
      localStorage.clear();
    }
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#141414] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-5 text-amber-400">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <h1 className="text-2xl font-black mb-2" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              Something Went Wrong
            </h1>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              We encountered an unexpected error while loading this page. You can try refreshing the page or returning to the homepage.
            </p>

            {this.state.error && (
              <div className="bg-black/50 border border-white/10 rounded-xl p-3 text-left mb-6 overflow-x-auto">
                <p className="text-xs font-mono text-amber-400 truncate">
                  {this.state.error.name}: {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-black font-bold text-xs rounded-xl hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" /> Reload Page
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-white/10 text-white font-bold text-xs rounded-xl hover:bg-white/15 transition-colors cursor-pointer"
              >
                <Home className="h-4 w-4" /> Go to Home
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <button
                onClick={this.handleResetCache}
                className="text-xs text-gray-500 hover:text-amber-400 flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
              >
                <Trash2 className="h-3 w-3" /> Clear App Storage &amp; Reset
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
