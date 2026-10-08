import React from 'react';
import {
  Compass,
  MapPin,
  BarChart3,
  Calendar,
  CloudSun,
  Activity,
  Sprout
} from 'lucide-react';
import { TabId } from '../types';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

interface NavItem {
  id: TabId;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'overview',
    label: 'LIVE DASHBOARD',
    sublabel: 'Real-Time Tamil Nadu Weather',
    icon: Compass,
  },
  {
    id: 'explorer',
    label: '38 DISTRICTS MAP',
    sublabel: 'Interactive Weather & GIS Radar',
    icon: MapPin,
  },
  {
    id: 'ai_predict',
    label: 'AI WEATHER PREDICTOR',
    sublabel: '24h & 3-Day Future Forecast',
    icon: Activity,
  },
  {
    id: 'crops',
    label: 'CROP SUGGESTIONS',
    sublabel: 'GPS Coordinates & 12-Month Sowing',
    icon: Sprout,
  },
  {
    id: 'analytics',
    label: 'WEATHER ANALYTICS',
    sublabel: 'Rankings & District Stats',
    icon: BarChart3,
  },
];

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-white border-b border-[#DDE5E1] px-4 lg:px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl transition-all duration-150 whitespace-nowrap text-left border relative ${
                isActive
                  ? 'bg-[#ECFDF5] border-[#059669] text-[#047857] shadow-sm font-semibold'
                  : 'bg-white hover:bg-[#F8FAF9] border-[#DDE5E1] text-[#64706A] hover:text-[#17201C]'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#059669]' : 'text-[#64706A]'}`} />
              <div className="flex flex-col">
                <span className={`text-xs font-bold tracking-wider ${isActive ? 'text-[#047857]' : 'text-[#17201C]'}`}>
                  {item.label}
                </span>
                <span className="text-[10px] text-[#64706A] font-sans font-normal hidden md:inline">
                  {item.sublabel}
                </span>
              </div>

              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#059669] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
