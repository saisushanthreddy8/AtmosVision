import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'chart' | 'map';
  width?: string;
  height?: string;
  lines?: number;
}

const shimmerBase = 'relative overflow-hidden bg-gradient-to-r from-gray-200/60 via-gray-100/40 to-gray-200/60 dark:from-gray-700/60 dark:via-gray-600/40 dark:to-gray-700/60 animate-shimmer';

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'text', width, height, lines = 1 }) => {
  const style: React.CSSProperties = { width, height };

  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={`h-3 rounded-md ${shimmerBase} ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} style={style} />
        ))}
      </div>
    );
  }

  if (variant === 'circular') {
    return <div className={`rounded-full ${shimmerBase} ${className}`} style={{ width: width || '40px', height: height || '40px' }} />;
  }

  if (variant === 'rectangular') {
    return <div className={`rounded-xl ${shimmerBase} ${className}`} style={style} />;
  }

  if (variant === 'card') {
    return (
      <div className={`rounded-2xl border border-gray-200/80 dark:border-gray-700 p-4 space-y-3 ${className}`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${shimmerBase}`} />
          <div className="flex-1 space-y-1.5">
            <div className={`h-3 w-24 rounded-md ${shimmerBase}`} />
            <div className={`h-2.5 w-16 rounded-md ${shimmerBase}`} />
          </div>
        </div>
        <div className={`h-10 rounded-xl ${shimmerBase}`} />
        <div className="space-y-1.5">
          <div className={`h-2.5 w-full rounded-md ${shimmerBase}`} />
          <div className={`h-2.5 w-5/6 rounded-md ${shimmerBase}`} />
        </div>
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={`rounded-2xl border border-gray-200/80 dark:border-gray-700 p-5 space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className={`h-4 w-32 rounded-md ${shimmerBase}`} />
          <div className="flex gap-2">
            <div className={`h-6 w-16 rounded-lg ${shimmerBase}`} />
            <div className={`h-6 w-16 rounded-lg ${shimmerBase}`} />
          </div>
        </div>
        <div className="flex items-end gap-2 h-40">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t-md ${shimmerBase}`}
              style={{ height: `${30 + Math.sin(i * 0.8) * 40 + 30}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'map') {
    return (
      <div className={`rounded-2xl border border-gray-200/80 dark:border-gray-700 p-5 space-y-3 ${className}`}>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${shimmerBase}`} />
          <div className={`h-3.5 w-48 rounded-md ${shimmerBase}`} />
        </div>
        <div className={`h-[400px] rounded-2xl ${shimmerBase}`} />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`h-8 flex-1 rounded-xl ${shimmerBase}`} />
          ))}
        </div>
      </div>
    );
  }

  return <div className={`rounded-xl ${shimmerBase} ${className}`} style={style} />;
};

/* Dashboard-level skeleton for the Overview page */
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-5 animate-fade-in pb-8">
    {/* Header skeleton */}
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className={`h-6 w-72 rounded-md ${shimmerBase}`} />
        <div className={`h-3 w-96 rounded-md ${shimmerBase}`} />
      </div>
      <div className="flex gap-2">
        <div className={`h-9 w-28 rounded-xl ${shimmerBase}`} />
        <div className={`h-9 w-32 rounded-xl ${shimmerBase}`} />
      </div>
    </div>

    {/* Metrics strip skeleton */}
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>
    </div>

    {/* District chips skeleton */}
    <div className="bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 rounded-2xl p-3 flex items-center gap-2 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={`h-8 w-24 rounded-xl ${shimmerBase} flex-shrink-0`} />
      ))}
    </div>

    {/* Map skeleton */}
    <Skeleton variant="map" />

    {/* Feature cards skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} variant="card" />
      ))}
    </div>
  </div>
);

/* Inline metric card skeleton */
export const MetricSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl ${shimmerBase}`} />
        <div className="flex-1 space-y-1.5">
          <div className={`h-2.5 w-16 rounded-md ${shimmerBase}`} />
          <div className={`h-5 w-12 rounded-md ${shimmerBase}`} />
          <div className={`h-2 w-20 rounded-md ${shimmerBase}`} />
        </div>
      </div>
    ))}
  </div>
);
