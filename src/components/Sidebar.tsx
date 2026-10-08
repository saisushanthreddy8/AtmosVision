import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  BarChart3,
  Calendar,
  Settings,
  RotateCcw,
  CloudSun,
  Activity,
  Radio,
  Sprout,
  Bot,
  Smartphone
} from 'lucide-react';
import { TabId } from '../types';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onOpenSettings?: () => void;
  onReset?: () => void;
  onOpenAIAssistant?: () => void;
  onInstallPWA?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenSettings,
  onReset,
  onOpenAIAssistant,
  onInstallPWA
}) => {
  const navItems = [
    {
      id: 'overview' as TabId,
      label: 'Live Dashboard',
      icon: LayoutDashboard,
      badge: 'Live'
    },
    {
      id: 'explorer' as TabId,
      label: '38 Districts Map',
      icon: MapPin,
      badge: 'GIS'
    },
    {
      id: 'ai_predict' as TabId,
      label: 'AI Weather Forecast',
      icon: Activity,
      badge: 'Predict'
    },
    {
      id: 'crops' as TabId,
      label: 'Crop Suggestions',
      icon: Sprout,
      badge: '12-Month'
    },
    {
      id: 'analytics' as TabId,
      label: 'Weather Analytics',
      icon: BarChart3,
      badge: 'Rankings'
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border border-[#DDE5E1] rounded-2xl p-4 flex flex-col justify-between shadow-sm flex-shrink-0">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669] shadow-sm">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-extrabold text-[#17201C] tracking-tight">
              AtmosVision AI
            </div>
            <div className="text-[11px] text-[#059669] font-semibold flex items-center gap-1 -mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
              <span>Tamil Nadu Live Weather</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
                  isActive
                    ? 'text-[#047857] bg-[#ECFDF5] border border-[#D1FAE5] font-bold shadow-sm'
                    : 'text-[#64706A] hover:text-[#17201C] hover:bg-[#F8FAF9] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#059669]' : 'text-[#64706A]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white text-[#059669]' : 'bg-[#F8FAF9] text-[#64706A]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-[#DDE5E1] space-y-1.5">
        {onOpenAIAssistant && (
          <button
            onClick={onOpenAIAssistant}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#047857] border border-[#A7F3D0] transition-colors text-left font-bold"
          >
            <div className="flex items-center gap-2.5">
              <Bot className="w-4 h-4 text-[#059669]" />
              <span>Ask Atmos Agri-AI</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white text-[#059669]">AI</span>
          </button>
        )}

        {onInstallPWA && (
          <button
            onClick={onInstallPWA}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-[#059669] hover:bg-[#F8FAF9] border border-[#DDE5E1] transition-colors text-left font-semibold"
          >
            <Smartphone className="w-4 h-4 text-[#059669]" />
            <span>Install Web App</span>
          </button>
        )}

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-[#64706A] hover:text-[#17201C] hover:bg-[#F8FAF9] transition-colors text-left font-medium"
        >
          <Settings className="w-4 h-4 text-[#64706A]" />
          <span>Workstation Settings</span>
        </button>

        <button
          onClick={onReset}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-[#64706A] hover:text-[#17201C] hover:bg-[#F8FAF9] transition-colors text-left font-medium"
        >
          <RotateCcw className="w-4 h-4 text-[#64706A]" />
          <span>Sync & Refresh All</span>
        </button>
      </div>
    </aside>
  );
};
