import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw, Home, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught a runtime rendering error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 animate-fade-in">
          <div className="max-w-md w-full bg-white border border-[#DDE5E1] rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-xs">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#17201C]">
                {this.props.fallbackTitle || 'Temporary View Display Issue'}
              </h3>
              <p className="text-xs text-[#64706A] leading-relaxed">
                இந்த பக்கத்தை ஏற்றுவதில் ஒரு தற்காலிக சிக்கல் ஏற்பட்டது. தயவுசெய்து பக்கத்தை மீண்டும் புதுப்பிக்கவும் அல்லது நேரடி டாஷ்போர்டிற்கு திரும்பவும்.
              </p>
              <p className="text-xs text-[#64706A] leading-relaxed">
                An unexpected telemetry rendering anomaly occurred. You can safely return to the main dashboard or retry loading this module.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>மீண்டும் முயல்க / Retry Module</span>
              </button>
              <button
                onClick={() => {
                  this.handleReset();
                  window.location.hash = '';
                  window.location.reload();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#F8FAF9] hover:bg-[#F0F4F2] border border-[#DDE5E1] text-[#17201C] text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4 text-[#059669]" />
                <span>Refresh App</span>
              </button>
            </div>

            {/* Collapsible Error Debug Details */}
            {this.state.error && (
              <div className="pt-3 border-t border-[#F0F4F2] text-left">
                <button
                  onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                  className="w-full flex items-center justify-between text-[11px] font-semibold text-[#64706A] hover:text-[#17201C]"
                >
                  <span>Technical Diagnostics</span>
                  {this.state.showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {this.state.showDetails && (
                  <pre className="mt-2 p-3 rounded-xl bg-[#17201C] text-emerald-400 text-[10px] overflow-x-auto max-h-36 font-mono leading-tight">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
