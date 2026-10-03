import React from 'react';

interface ScientificColorbarProps {
  colormap: 'thermal' | 'coolwarm' | 'viridis' | 'spectral' | 'magma';
  minVal: number;
  maxVal: number;
  unit: string;
  label?: string;
  compact?: boolean;
}

export const ScientificColorbar: React.FC<ScientificColorbarProps> = ({
  colormap,
  minVal,
  maxVal,
  unit,
  label,
  compact = false,
}) => {
  const getGradient = () => {
    switch (colormap) {
      case 'thermal':
        return 'linear-gradient(to right, #1e3a8a, #06b6d4, #10b981, #eab308, #ef4444, #7f1d1d)';
      case 'coolwarm':
        return 'linear-gradient(to right, #1d4ed8, #60a5fa, #f8fafc, #f87171, #b91c1c)';
      case 'viridis':
        return 'linear-gradient(to right, #440154, #3b528b, #21908d, #5dc863, #fde725)';
      case 'spectral':
        return 'linear-gradient(to right, #9e0142, #d53e4f, #fee08b, #e6f598, #66c2a5, #5e4fa2)';
      case 'magma':
        return 'linear-gradient(to right, #000004, #51127c, #b73779, #fc8961, #fcfdbf)';
      default:
        return 'linear-gradient(to right, #0284c7, #38bdf8, #f8fafc)';
    }
  };

  const steps = 5;
  const tickValues = Array.from({ length: steps }, (_, i) => {
    const val = minVal + (i / (steps - 1)) * (maxVal - minVal);
    return val;
  });

  return (
    <div className={`flex flex-col gap-1.5 ${compact ? 'text-xs' : 'text-xs'}`}>
      {label && (
        <div className="flex items-center justify-between text-[#64706A] font-mono text-[11px]">
          <span>{label}</span>
          <span className="text-[#059669] font-bold">{unit}</span>
        </div>
      )}
      
      {/* Gradient Bar with border */}
      <div 
        className="h-3 w-full rounded-sm border border-[#DDE5E1] shadow-xs relative overflow-hidden"
        style={{ background: getGradient() }}
      >
        {/* Subtle grid lines across colorbar */}
        <div className="absolute inset-0 flex justify-between pointer-events-none opacity-30">
          {Array.from({ length: steps }).map((_, i) => (
            <div key={i} className="w-px h-full bg-slate-900/40" />
          ))}
        </div>
      </div>

      {/* Axis Scale Ticks */}
      <div className="flex justify-between font-mono text-[10px] text-[#64706A] px-0.5">
        {tickValues.map((val, idx) => (
          <span key={idx} className={idx === 0 || idx === steps - 1 ? 'font-bold text-[#17201C]' : ''}>
            {Math.abs(val) >= 100 ? val.toFixed(0) : Math.abs(val) >= 10 ? val.toFixed(1) : val.toFixed(2)}
          </span>
        ))}
      </div>
    </div>
  );
};
