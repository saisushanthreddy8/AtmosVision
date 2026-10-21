import React from 'react';
import {
  Compass,
  MapPin,
  BarChart3,
  Calendar,
  CloudSun,
  Activity,
  Sprout,
  AlertTriangle,
  Wind,
  TrendingUp,
  Bug
} from 'lucide-react';
import { TabId } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { language } = useLanguage();

  const navItems = [
    {
      id: 'overview' as TabId,
      label: language === 'ta' ? 'நேரடி டாஷ்போர்டு' : 'LIVE DASHBOARD',
      sublabel: language === 'ta' ? 'நிகழ்நேர வானிலை' : 'Real-Time TN Weather',
      icon: Compass,
    },
    {
      id: 'explorer' as TabId,
      label: language === 'ta' ? '38 மாவட்ட வரைபடம்' : '38 DISTRICTS MAP',
      sublabel: language === 'ta' ? 'வானிலை & GIS ரேடார்' : 'Interactive Weather & GIS',
      icon: MapPin,
    },
    {
      id: 'ai_predict' as TabId,
      label: language === 'ta' ? 'AI வானிலை கணிப்பு' : 'AI FORECAST',
      sublabel: language === 'ta' ? '7 நாள் முன்னறிவிப்பு' : '7-Day Future Envelope',
      icon: Activity,
    },
    {
      id: 'alerts' as TabId,
      label: language === 'ta' ? 'எச்சரிக்கைகள்' : 'ALERTS & WARNINGS',
      sublabel: language === 'ta' ? 'பேரிடர் முன்னெச்சரிக்கை' : 'Cyclone & Heatwave Radar',
      icon: AlertTriangle,
    },
    {
      id: 'air_quality' as TabId,
      label: language === 'ta' ? 'காற்றின் தரம்' : 'AIR QUALITY (AQI)',
      sublabel: language === 'ta' ? 'மாசுபாட்டு அளவீடு' : 'CPCB Environmental Monitor',
      icon: Wind,
    },
    {
      id: 'charts' as TabId,
      label: language === 'ta' ? 'வரைபடங்கள்' : 'INTERACTIVE CHARTS',
      sublabel: language === 'ta' ? '24h போக்கு வளைவு' : '24h Diurnal Curves',
      icon: TrendingUp,
    },
    {
      id: 'pest_risk' as TabId,
      label: language === 'ta' ? 'பூச்சி கணிப்பு' : 'PEST RISK',
      sublabel: language === 'ta' ? 'TNAU பயிர் பாதுகாப்பு' : 'Agri-Biosecurity Outbreak',
      icon: Bug,
    },
    {
      id: 'crops' as TabId,
      label: language === 'ta' ? 'பயிர் பரிந்துரை' : 'CROP SUGGESTIONS',
      sublabel: language === 'ta' ? '12 மாத விதைப்பு முறை' : 'GPS & 12-Month Sowing',
      icon: Sprout,
    },
    {
      id: 'analytics' as TabId,
      label: language === 'ta' ? 'பகுப்பாய்வு' : 'ANALYTICS',
      sublabel: language === 'ta' ? 'மாவட்ட தரவரிசை' : 'Rankings & Stats',
      icon: BarChart3,
    },
  ];

  return (
    <nav className="bg-white border-b border-[#DDE5E1] px-4 lg:px-6 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-150 whitespace-nowrap text-left border relative ${
                isActive
                  ? 'bg-[#ECFDF5] border-[#059669] text-[#047857] shadow-xs font-semibold'
                  : 'bg-white hover:bg-[#F8FAF9] border-[#DDE5E1] text-[#64706A] hover:text-[#17201C]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#059669]' : 'text-[#64706A]'}`} />
              <div className="flex flex-col">
                <span className={`text-[11px] font-bold tracking-wider ${isActive ? 'text-[#047857]' : 'text-[#17201C]'}`}>
                  {item.label}
                </span>
                <span className="text-[9px] text-[#64706A] font-sans font-normal hidden lg:inline">
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
