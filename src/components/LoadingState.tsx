import React from 'react';
import { Activity, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'LOADING ATMOSPHERIC TENSOR STREAM…',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 rounded-2xl bg-white border border-[#DDE5E1] text-center font-mono shadow-xs">
      <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] text-[#059669]">
        <Activity className="w-6 h-6 animate-pulse" />
        <span className="absolute inset-0 rounded-full border-2 border-[#059669] border-t-transparent animate-spin" />
      </div>
      <div className="space-y-1">
        <div className="text-sm font-bold text-[#17201C] tracking-wider">
          {message}
        </div>
        <div className="text-xs text-[#64706A]">
          INITIALIZING ERA5 MATRIX BUFFER · TAMIL NADU DOMAIN
        </div>
      </div>
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  error?: string;
  onRetry?: () => void;
}

export const ErrorBanner: React.FC<ErrorStateProps> = ({
  title = 'ENGINE TELEMETRY NOTICE',
  error = 'Backend stream running in local high-performance scientific client mode.',
  onRetry,
}) => {
  return (
    <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] text-xs font-mono flex items-center justify-between gap-3 text-[#17201C] shadow-xs">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
        <div>
          <span className="font-bold text-amber-700">{title}: </span>
          <span className="text-[#64706A]">{error}</span>
        </div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#E8F0EC] text-[#17201C] border border-[#DDE5E1] flex items-center gap-1 text-[11px] whitespace-nowrap font-bold transition"
        >
          <RefreshCw className="w-3 h-3 text-[#059669]" />
          <span>RECONNECT</span>
        </button>
      )}
    </div>
  );
};
