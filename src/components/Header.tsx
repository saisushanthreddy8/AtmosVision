import React, { useState, useEffect } from 'react';
import { Activity, Database, Radio, Layers, Server } from 'lucide-react';
import { TensorDimensions } from '../types';

interface HeaderProps {
  tensorDims: TensorDimensions;
  backendConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({ tensorDims, backendConnected }) => {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DDE5E1] px-4 lg:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Title and Scientific Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-md bg-[#ECFDF5] border border-[#D1FAE5] text-[#059669]">
            <Layers className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#059669] animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#059669]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-wider text-[#17201C] uppercase">
                ATMOSVISION <span className="text-[#059669]">AI</span>
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ECFDF5] border border-[#D1FAE5] text-[#047857]">
                PHASE 1
              </span>
            </div>
            <p className="text-[11px] text-[#64706A] hidden sm:block tracking-tight">
              Atmospheric Tensor Analysis & HOSVD-Based Climate Data Exploration · Tamil Nadu
            </p>
          </div>
        </div>

        {/* Scientific Telemetry & Status Badges */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
          
          {/* Dataset Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F8FAF9] border border-[#DDE5E1] text-[#17201C]">
            <Database className="w-3.5 h-3.5 text-[#059669]" />
            <span className="font-semibold">ERA5 JAN 2023</span>
          </div>

          {/* Tensor Dimension Tag */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F8FAF9] border border-[#DDE5E1] text-[#17201C]">
            <Activity className="w-3.5 h-3.5 text-[#059669]" />
            <span className="text-[#047857] font-bold">
              ℝ^(744 × 23 × 19 × 6)
            </span>
          </div>

          {/* UTC Clock */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F8FAF9] border border-[#DDE5E1] text-[#64706A] text-[11px]">
            <Radio className="w-3 h-3 text-[#059669] animate-pulse" />
            <span>{utcTime || '2023-01-15 12:00:00 UTC'}</span>
          </div>

          {/* Server Connection Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F8FAF9] border border-[#DDE5E1]">
            <Server className={`w-3.5 h-3.5 ${backendConnected ? 'text-[#059669]' : 'text-amber-500'}`} />
            <span className={backendConnected ? 'text-[#047857] text-[11px] font-bold' : 'text-amber-700 text-[11px] font-bold'}>
              {backendConnected ? 'ENGINE CONNECTED' : 'LOCAL WORKSTATION'}
            </span>
          </div>

        </div>

      </div>
    </header>
  );
};
