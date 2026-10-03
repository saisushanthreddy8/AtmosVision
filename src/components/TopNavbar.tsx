import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Menu,
  X,
  MapPin,
  Maximize2,
  Minimize2,
  Activity,
  Radio,
  RefreshCw,
  Sparkles,
  Sun,
  Thermometer,
  Layers,
  BarChart3,
  Calendar
} from 'lucide-react';
import { TabId, LiveStatewideSummary } from '../types';
import { DISTRICT_REGIONS } from '../data/tamilNaduGeo';

interface TopNavbarProps {
  onNavigate: (tab: TabId) => void;
  onSelectCity?: (cityName: string) => void;
  onToggleMobileSidebar?: () => void;
  isMobileSidebarOpen?: boolean;
  liveSummary?: LiveStatewideSummary | null;
  onRefreshLive?: () => void;
  isLiveLoading?: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onNavigate,
  onSelectCity,
  onToggleMobileSidebar,
  isMobileSidebarOpen,
  liveSummary,
  onRefreshLive,
  isLiveLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const filteredCities = DISTRICT_REGIONS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="relative z-30 flex flex-col md:flex-row md:items-center justify-between gap-3 py-2">
      
      {/* Top Left: Mobile Toggle & Search Bar */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-white border border-[#DDE5E1] text-[#17201C] hover:bg-[#F8FAF9] shadow-sm flex-shrink-0"
          aria-label="Toggle Navigation"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-[#64706A] pointer-events-none" />
            <input
              type="text"
              placeholder="Search 38 districts (e.g. Chennai, Madurai, Ooty)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(e.target.value.trim().length > 0);
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setIsSearchOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (filteredCities.length > 0) {
                    const targetCity = filteredCities[0];
                    if (onSelectCity) onSelectCity(targetCity.name);
                    onNavigate('explorer');
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }
                }
              }}
              className="w-full bg-white border border-[#DDE5E1] rounded-xl pl-10 pr-4 py-2 text-xs text-[#17201C] placeholder-[#64706A] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 transition-all font-sans shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-3 text-[#64706A] hover:text-[#17201C] text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Live Search Quick Results Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#DDE5E1] rounded-xl shadow-xl p-2.5 z-50 text-xs font-sans space-y-2 max-h-80 overflow-y-auto">
              {filteredCities.length > 0 && (
                <div>
                  <div className="text-[10px] text-[#059669] font-bold px-2 py-1 uppercase tracking-wider flex items-center justify-between">
                    <span>Tamil Nadu Meteorological Stations ({filteredCities.length})</span>
                    <span className="text-[9px] text-[#64706A] normal-case">Press ↵ Enter to view radar</span>
                  </div>
                  {filteredCities.slice(0, 8).map((city) => (
                    <button
                      key={city.name}
                      onClick={() => {
                        if (onSelectCity) onSelectCity(city.name);
                        onNavigate('explorer');
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-[#ECFDF5] text-[#17201C] hover:text-[#047857] text-left transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#059669] group-hover:scale-110 transition" />
                        <span className="font-bold">{city.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F8FAF9] border border-[#DDE5E1] text-[#64706A] font-mono">{city.code}</span>
                      </div>
                      <span className="text-[10px] text-[#059669] font-semibold flex items-center gap-0.5">
                        <span>Open Radar</span>
                        <span className="font-mono text-[#64706A]">({city.lat.toFixed(1)}°N)</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className="border-t border-[#DDE5E1] pt-1.5">
                <div className="text-[10px] text-[#64706A] font-bold px-2 py-1 uppercase tracking-wider">
                  Quick Navigation
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => { onNavigate('explorer'); setIsSearchOpen(false); setSearchQuery(''); }}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-[#ECFDF5] text-[#17201C] text-[11px]"
                  >
                    <MapPin className="w-3 h-3 text-[#059669]" />
                    <span>38 Districts</span>
                  </button>
                  <button
                    onClick={() => { onNavigate('analytics'); setIsSearchOpen(false); setSearchQuery(''); }}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-[#ECFDF5] text-[#17201C] text-[11px]"
                  >
                    <BarChart3 className="w-3 h-3 text-[#059669]" />
                    <span>Analytics</span>
                  </button>
                  <button
                    onClick={() => { onNavigate('forecast'); setIsSearchOpen(false); setSearchQuery(''); }}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-[#ECFDF5] text-[#17201C] text-[11px]"
                  >
                    <Calendar className="w-3 h-3 text-[#059669]" />
                    <span>7-Day Run</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Live Telemetry Pill & Actions */}
      <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
        
        {/* Live Weather Quick Ticker Pill */}
        {liveSummary && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[11px] text-[#047857] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <Thermometer className="w-3.5 h-3.5 text-[#059669]" />
            <span className="font-bold">TN Avg: {liveSummary.stateAvgTempC}°C</span>
            <span className="text-[#A7F3D0]">·</span>
            <span className="text-[#065F46] hidden sm:inline">Coolest: {liveSummary.coolestDistrict.district} ({liveSummary.coolestDistrict.tempC}°C)</span>
            {onRefreshLive && (
              <button
                onClick={onRefreshLive}
                disabled={isLiveLoading}
                className="ml-1 p-1 hover:bg-[#D1FAE5] rounded-full text-[#059669] transition"
                title="Refresh Live Weather Data"
              >
                <RefreshCw className={`w-3 h-3 ${isLiveLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        )}

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-white hover:bg-[#F8FAF9] border border-[#DDE5E1] text-[#64706A] hover:text-[#17201C] transition-colors shadow-sm"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#059669]" /> : <Maximize2 className="w-4 h-4 text-[#64706A]" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-white hover:bg-[#F8FAF9] border border-[#DDE5E1] text-[#64706A] hover:text-[#17201C] transition-colors relative shadow-sm"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#059669] ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#DDE5E1] rounded-xl shadow-xl p-3 z-50 text-xs font-sans space-y-2">
              <div className="flex items-center justify-between border-b border-[#DDE5E1] pb-1.5">
                <span className="font-bold text-[#17201C]">Live Telemetry Feed</span>
                <span className="text-[10px] text-[#059669] font-bold flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Live Active
                </span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-[#ECFDF5] border border-[#D1FAE5] space-y-0.5">
                  <div className="text-[#047857] font-bold text-[11px] flex items-center justify-between">
                    <span>Open-Meteo Synoptic Telemetry</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-[#059669] font-bold">Live</span>
                  </div>
                  <div className="text-[#065F46] text-[10px]">Connected to real-time Tamil Nadu surface meteorological stations with automatic 5-minute synchronization.</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F8FAF9] border border-[#DDE5E1] space-y-0.5">
                  <div className="text-[#17201C] font-semibold text-[11px] flex items-center justify-between">
                    <span>38 Synoptic Stations</span>
                    <span className="text-[10px] text-[#059669] font-bold">100% Online</span>
                  </div>
                  <div className="text-[#64706A] text-[10px]">All 38 districts providing real-time surface temperature, relative humidity, wind vectors, and surface barometric pressure.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-white border border-[#DDE5E1] shadow-sm">
          <div className="w-7 h-7 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669] font-extrabold text-xs">
            TN
          </div>
          <span className="text-xs font-bold text-[#17201C] hidden sm:inline">
            Tamil Nadu Live
          </span>
        </div>
      </div>
    </header>
  );
};
