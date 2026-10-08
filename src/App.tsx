import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { Overview } from './components/Overview';
import { TamilNaduExplorer } from './components/TamilNaduExplorer';
import { LiveAnalytics } from './components/LiveAnalytics';
import { CropSuggestionStudio } from './components/CropSuggestionStudio';
import { AIPredictorStudio } from './components/AIPredictorStudio';
import { AgriAIAssistantModal } from './components/AgriAIAssistantModal';
import { AtmosphericBackground } from './components/AtmosphericBackground';
import { Settings, X, CheckCircle2, RotateCcw, CloudSun, Radio, Bot, Smartphone, Sparkles } from 'lucide-react';
import { TabId, LiveDistrictWeather, LiveStatewideSummary } from './types';
import { fetchLiveTamilNaduWeather, computeStatewideSummary } from './data/liveWeatherService';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [weatherType, setWeatherType] = useState<'clear' | 'wind' | 'cool' | 'hot' | 'rain'>('clear');
  const [selectedDistrictForExplorer, setSelectedDistrictForExplorer] = useState<string | null>(null);
  const [districtSearchSignal, setDistrictSearchSignal] = useState<number>(0);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // PWA Install state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);

  // Live Weather API Data
  const [liveDistrictData, setLiveDistrictData] = useState<LiveDistrictWeather[]>([]);
  const [liveSummary, setLiveSummary] = useState<LiveStatewideSummary | null>(null);
  const [isLiveLoading, setIsLiveLoading] = useState<boolean>(true);

  // Settings state
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [showAtmosphericParticles, setShowAtmosphericParticles] = useState<boolean>(true);
  const [colorScheme, setColorScheme] = useState<'default' | 'high_contrast'>('default');

  // PWA BeforeInstallPrompt listener
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      alert('To install AtmosVision on your device:\n• On Android/Chrome: Tap the 3 dots menu and select "Install app" or "Add to Home screen".\n• On iOS/Safari: Tap the Share button and select "Add to Home Screen".');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
      setNotificationToast('AtmosVision installed successfully!');
      setTimeout(() => setNotificationToast(null), 4000);
    }
  };

  // Load Live Tamil Nadu Weather API data
  const loadLiveWeatherData = useCallback(async (forceRefresh: boolean = false) => {
    setIsLiveLoading(true);
    try {
      const districts = await fetchLiveTamilNaduWeather(forceRefresh);
      const summary = computeStatewideSummary(districts);
      setLiveDistrictData(districts);
      setLiveSummary(summary);
      if (forceRefresh) {
        setNotificationToast(`Synchronized 38 Stations: Statewide Avg ${summary.stateAvgTempC}°C`);
        setTimeout(() => setNotificationToast(null), 4000);
      }
    } catch (err) {
      console.error('Failed to load live Tamil Nadu weather:', err);
    } finally {
      setIsLiveLoading(false);
    }
  }, []);

  // Fetch live weather on mount and auto-refresh every 5 minutes
  useEffect(() => {
    loadLiveWeatherData();
    const interval = setInterval(() => {
      loadLiveWeatherData(false);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadLiveWeatherData]);

  const handleWeatherChange = useCallback((newWeather: 'clear' | 'wind' | 'cool' | 'hot' | 'rain') => {
    setWeatherType(newWeather);
  }, []);

  const handleSelectDistrictFromSearch = useCallback((districtName: string) => {
    setSelectedDistrictForExplorer(districtName);
    setDistrictSearchSignal(Date.now());
    setActiveTab('explorer');
  }, []);

  const handleResetSession = () => {
    setActiveTab('overview');
    setSelectedDistrictForExplorer(null);
    loadLiveWeatherData(true);
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAF9] text-[#17201C] font-sans selection:bg-[#D1FAE5] selection:text-[#047857]">
      
      {/* Subtle Atmospheric Streamlines Background */}
      {showAtmosphericParticles && <AtmosphericBackground weatherType={weatherType} />}

      {/* Notification Toast */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white border border-[#059669] text-[#047857] text-xs shadow-xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#059669] flex-shrink-0" />
          <span className="font-semibold">{notificationToast}</span>
        </div>
      )}

      {/* Main Layout Container with Left Sidebar and Right Main Panel */}
      <div className="relative z-10 w-full px-3 sm:px-5 lg:px-6 py-4 min-h-screen flex flex-col lg:flex-row gap-6">
        
        {/* Desktop Left Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onReset={handleResetSession}
            onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
            onInstallPWA={handleInstallPWA}
          />
        </div>

        {/* Mobile Slide-Over Sidebar Drawer */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs lg:hidden flex">
            <div className="w-72 bg-white h-full p-4 flex flex-col justify-between shadow-2xl">
              <Sidebar
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  setIsMobileSidebarOpen(false);
                }}
                onOpenSettings={() => {
                  setIsSettingsModalOpen(true);
                  setIsMobileSidebarOpen(false);
                }}
                onReset={() => {
                  handleResetSession();
                  setIsMobileSidebarOpen(false);
                }}
                onOpenAIAssistant={() => {
                  setIsAIAssistantOpen(true);
                  setIsMobileSidebarOpen(false);
                }}
                onInstallPWA={() => {
                  handleInstallPWA();
                  setIsMobileSidebarOpen(false);
                }}
              />
            </div>
            <div className="flex-1" onClick={() => setIsMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Main Content Area with Top Navbar & Dashboard View */}
        <div className="flex-1 flex flex-col min-w-0 space-y-5">
          
          {/* Top Navbar */}
          <TopNavbar
            onNavigate={setActiveTab}
            onSelectCity={handleSelectDistrictFromSearch}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            isMobileSidebarOpen={isMobileSidebarOpen}
            liveSummary={liveSummary}
            onRefreshLive={() => loadLiveWeatherData(true)}
            isLiveLoading={isLiveLoading}
            onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
            onInstallPWA={handleInstallPWA}
            isInstallable={isInstallable}
          />

          {/* Active View Module */}
          <main className="flex-1">
            {activeTab === 'overview' && (
              <Overview
                onNavigate={setActiveTab}
                liveDistrictData={liveDistrictData}
                liveSummary={liveSummary}
                onRefreshLive={() => loadLiveWeatherData(true)}
                isLiveLoading={isLiveLoading}
              />
            )}

            {activeTab === 'explorer' && (
              <TamilNaduExplorer
                onWeatherChange={handleWeatherChange}
                selectedDistrictName={selectedDistrictForExplorer}
                targetDistrictSignal={districtSearchSignal}
                liveDistrictData={liveDistrictData}
                onRefreshLive={() => loadLiveWeatherData(true)}
                isLiveLoading={isLiveLoading}
              />
            )}

            {activeTab === 'ai_predict' && (
              <AIPredictorStudio
                liveDistrictData={liveDistrictData}
                onRefreshLive={() => loadLiveWeatherData(true)}
                isLiveLoading={isLiveLoading}
                initialDistrictName={selectedDistrictForExplorer || 'Nilgiris'}
              />
            )}

            {activeTab === 'analytics' && (
              <LiveAnalytics
                liveDistrictData={liveDistrictData}
                liveSummary={liveSummary}
                onRefreshLive={() => loadLiveWeatherData(true)}
                isLiveLoading={isLiveLoading}
                onSelectDistrict={(d) => {
                  setSelectedDistrictForExplorer(d);
                  setActiveTab('explorer');
                }}
              />
            )}

            {activeTab === 'crops' && (
              <CropSuggestionStudio
                liveDistrictData={liveDistrictData}
                onRefreshLive={() => loadLiveWeatherData(true)}
                isLiveLoading={isLiveLoading}
                initialDistrictName={selectedDistrictForExplorer || undefined}
              />
            )}
          </main>

          {/* Clean Meteorological Platform Footer */}
          <footer className="pt-6 pb-2 border-t border-[#DDE5E1] text-xs text-[#64706A] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#059669]" />
              <span className="text-[#17201C] font-semibold">Tamil Nadu Live Meteorological GIS Network</span>
              <span>·</span>
              <span>Open-Meteo Planetary API (38 Synoptic Stations)</span>
            </div>
            <div className="flex items-center gap-3 font-medium">
              <span>Real-Time Numerical Weather Prediction</span>
              <span>·</span>
              <span className="text-[#059669] font-bold">100% Live Telemetry</span>
            </div>
          </footer>

        </div>

      </div>

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#DDE5E1] rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#DDE5E1] pb-3">
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-[#059669]" />
                <h3 className="text-base font-bold text-[#17201C]">Workstation Settings</h3>
              </div>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-1 rounded-lg text-[#64706A] hover:text-[#17201C] hover:bg-[#F8FAF9]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Temp unit */}
              <div className="space-y-1.5">
                <label className="text-[#17201C] font-bold block">Temperature Display Unit</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTemperatureUnit('celsius')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                      temperatureUnit === 'celsius'
                        ? 'bg-[#ECFDF5] border-[#059669] text-[#047857]'
                        : 'bg-white border-[#DDE5E1] text-[#64706A] hover:text-[#17201C]'
                    }`}
                  >
                    Celsius (°C)
                  </button>
                  <button
                    onClick={() => setTemperatureUnit('fahrenheit')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                      temperatureUnit === 'fahrenheit'
                        ? 'bg-[#ECFDF5] border-[#059669] text-[#047857]'
                        : 'bg-white border-[#DDE5E1] text-[#64706A] hover:text-[#17201C]'
                    }`}
                  >
                    Fahrenheit (°F)
                  </button>
                </div>
              </div>

              {/* Background particles */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1]">
                <div>
                  <div className="text-[#17201C] font-bold">Atmospheric Streamlines</div>
                  <div className="text-[#64706A] text-[11px]">Subtle ambient meteorological airflow traces</div>
                </div>
                <input
                  type="checkbox"
                  checked={showAtmosphericParticles}
                  onChange={(e) => setShowAtmosphericParticles(e.target.checked)}
                  className="w-4 h-4 accent-[#059669] rounded cursor-pointer"
                />
              </div>

              {/* Color Scheme */}
              <div className="space-y-1.5">
                <label className="text-[#17201C] font-bold block">Visual Contrast Scheme</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setColorScheme('default')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                      colorScheme === 'default'
                        ? 'bg-[#ECFDF5] border-[#059669] text-[#047857]'
                        : 'bg-white border-[#DDE5E1] text-[#64706A] hover:text-[#17201C]'
                    }`}
                  >
                    Emerald Light
                  </button>
                  <button
                    onClick={() => setColorScheme('high_contrast')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                      colorScheme === 'high_contrast'
                        ? 'bg-[#ECFDF5] border-[#059669] text-[#047857]'
                        : 'bg-white border-[#DDE5E1] text-[#64706A] hover:text-[#17201C]'
                    }`}
                  >
                    High Contrast Radar
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#DDE5E1] flex justify-end">
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs transition-colors shadow-sm"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Atmos Agri-AI Assistant Button */}
      <button
        onClick={() => setIsAIAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#059669] hover:bg-[#047857] text-white text-xs font-black shadow-2xl hover:shadow-[#059669]/40 hover:scale-105 transition-all duration-200 border-2 border-white/20 group cursor-pointer"
        title="Open Atmos Agri-AI Assistant"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-white" />
          <span className="w-2 h-2 rounded-full bg-[#34D399] absolute -top-0.5 -right-0.5 animate-ping" />
        </div>
        <span className="font-extrabold tracking-wide">Ask Agri-AI</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold hidden sm:inline">
          வேளாண் AI
        </span>
      </button>

      {/* Atmos Agri-AI Assistant Modal */}
      <AgriAIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        liveDistrictData={liveDistrictData}
      />

    </div>
  );
}
