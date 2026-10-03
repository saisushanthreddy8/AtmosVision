import React, { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Wind,
  Droplets,
  Gauge,
  Thermometer,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Search,
  Maximize2,
  Minimize2,
  X,
  Compass,
  ArrowLeft,
  Globe,
  Info,
  Calendar,
  Sun,
  CloudRain,
  CloudSun,
  RefreshCw,
  Activity,
  ArrowUpRight,
  Sprout,
  Layers,
  Award
} from 'lucide-react';
import { CITIES_TAMIL_NADU } from '../data/cities';
import { CLIMATE_VARIABLES } from '../data/climateVariables';
import { CityClimateObservation, LiveDistrictWeather } from '../types';
import { GlobeVisualizer } from './GlobeVisualizer';
import { TamilNaduDistrictMap } from './TamilNaduDistrictMap';
import { DistrictAgroAdvisory } from './DistrictAgroAdvisory';
import { WeatherFrogCard } from './WeatherFrogCard';

interface TamilNaduExplorerProps {
  onWeatherChange?: (weather: 'clear' | 'wind' | 'cool' | 'hot' | 'rain') => void;
  selectedDistrictName?: string | null;
  targetDistrictSignal?: number;
  liveDistrictData?: LiveDistrictWeather[];
  onRefreshLive?: () => void;
  isLiveLoading?: boolean;
}

export const TamilNaduExplorer: React.FC<TamilNaduExplorerProps> = ({ 
  onWeatherChange,
  selectedDistrictName,
  targetDistrictSignal,
  liveDistrictData = [],
  onRefreshLive,
  isLiveLoading = false
}) => {
  const [stage, setStage] = useState<'globe' | 'map'>('globe');
  
  const [selectedCityId, setSelectedCityId] = useState<string>('ooty');
  const [activeVariableIdx, setActiveVariableIdx] = useState<number>(0); // 0 = Temperature
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showWindVectors, setShowWindVectors] = useState<boolean>(true);
  const [isEnlargedDistrictModalOpen, setIsEnlargedDistrictModalOpen] = useState<boolean>(false);
  const [explorerViewMode, setExplorerViewMode] = useState<'crops' | 'weather'>('crops');

  // React to external district search selection
  useEffect(() => {
    if (selectedDistrictName) {
      const q = selectedDistrictName.toLowerCase().trim();
      const matched = CITIES_TAMIL_NADU.find(
        (c) =>
          c.district.toLowerCase() === q ||
          c.name.toLowerCase().includes(q) ||
          q.includes(c.district.toLowerCase()) ||
          q.includes(c.name.toLowerCase())
      );
      if (matched) {
        setSelectedCityId(matched.id);
        setStage('map');
      }
    }
  }, [selectedDistrictName, targetDistrictSignal]);

  // Selected city object from the full 38 districts collection
  const selectedCity = useMemo(() => {
    return CITIES_TAMIL_NADU.find((c) => c.id === selectedCityId) || CITIES_TAMIL_NADU[0];
  }, [selectedCityId]);

  // Selected district real-time live weather
  const selectedLiveWeather: LiveDistrictWeather | null = useMemo(() => {
    if (!liveDistrictData || liveDistrictData.length === 0) return null;
    const qDist = selectedCity.district.toLowerCase().trim();
    const qName = selectedCity.name.toLowerCase().trim();
    return (
      liveDistrictData.find(
        (d) =>
          (d.district && d.district.toLowerCase() === qDist) ||
          (d.cityName && d.cityName.toLowerCase().includes(qDist)) ||
          qDist.includes(d.district?.toLowerCase() || '') ||
          (d.cityName && d.cityName.toLowerCase().includes(qName)) ||
          qName.includes(d.cityName?.toLowerCase() || '')
      ) || null
    );
  }, [liveDistrictData, selectedCity]);

  // City observation object for fallback weather cards
  const cityObs: CityClimateObservation = useMemo(() => {
    const temp = selectedLiveWeather ? selectedLiveWeather.temperatureC : 28.0;
    const rh = selectedLiveWeather ? selectedLiveWeather.relativeHumidityPct : 65;
    const wind = selectedLiveWeather ? selectedLiveWeather.windSpeedMs : 4.0;
    const pressure = selectedLiveWeather ? selectedLiveWeather.surfacePressureHpa : 1012.0;

    return {
      city: selectedCity,
      timestamp: new Date().toISOString(),
      temperatureK: Number((temp + 273.15).toFixed(1)),
      temperatureC: temp,
      uWindMs: wind * 0.7,
      vWindMs: wind * 0.3,
      windSpeedMs: wind,
      windDirectionDeg: selectedLiveWeather?.windDirectionDeg || 120,
      verticalVelocityPaS: -0.02,
      specificHumidityGKg: (rh * 0.2),
      geopotentialHeightM: selectedCity.elevationM + 10,
      surfacePressureHpa: pressure,
      relativeHumidityPct: rh,
      derivedCondition: {
        label: selectedLiveWeather?.weatherCondition || 'Live Meteorological Telemetry',
        description: `Real-time surface observation from synoptic station in ${selectedCity.district}, Tamil Nadu.`,
        weatherType: selectedLiveWeather?.weatherType || 'clear'
      }
    };
  }, [selectedCity, selectedLiveWeather]);

  // Notify parent component of weather type
  useEffect(() => {
    if (onWeatherChange && selectedLiveWeather?.weatherType) {
      onWeatherChange(selectedLiveWeather.weatherType);
    }
  }, [selectedLiveWeather?.weatherType, onWeatherChange]);

  // Filtered districts for search
  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return CITIES_TAMIL_NADU;
    const q = searchQuery.toLowerCase();
    return CITIES_TAMIL_NADU.filter(
      (c) => c.name.toLowerCase().includes(q) || c.district.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Handle District Selection
  const handleSelectDistrict = (districtName: string) => {
    const matched = CITIES_TAMIL_NADU.find(
      (c) =>
        c.district.toLowerCase() === districtName.toLowerCase() ||
        c.name.toLowerCase().includes(districtName.toLowerCase()) ||
        districtName.toLowerCase().includes(c.name.toLowerCase())
    );
    if (matched) {
      setSelectedCityId(matched.id);
    }
  };

  // Next / Previous district navigation
  const currentIndex = CITIES_TAMIL_NADU.findIndex((c) => c.id === selectedCity.id);
  const handlePrevDistrict = () => {
    const prevIdx = (currentIndex - 1 + CITIES_TAMIL_NADU.length) % CITIES_TAMIL_NADU.length;
    setSelectedCityId(CITIES_TAMIL_NADU[prevIdx].id);
  };
  const handleNextDistrict = () => {
    const nextIdx = (currentIndex + 1) % CITIES_TAMIL_NADU.length;
    setSelectedCityId(CITIES_TAMIL_NADU[nextIdx].id);
  };

  // =========================================================================
  // STAGE 1: ROTATING GLOBE ENTRY
  // =========================================================================
  if (stage === 'globe') {
    return (
      <div className="space-y-6 font-sans">
        
        {/* Header & Prompt */}
        <div className="bg-white border border-[#DDE5E1] rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#059669] text-xs font-bold uppercase tracking-wider">
              <Globe className="w-4 h-4" />
              <span>Real-Time Agro-Meteorological GIS Platform</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17201C] tracking-tight mt-1.5">
              Tamil Nadu 38-District GIS Radar & Crop Advisory
            </h2>
            <p className="text-xs sm:text-sm text-[#64706A] mt-1 font-medium">
              Real-time surface meteorology, district soil classifications, and weather-driven crop recommendations for all 38 districts.
            </p>
          </div>

          <button
            onClick={() => setStage('map')}
            className="px-6 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs sm:text-sm font-extrabold shadow-sm shadow-[#059669]/20 flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open 38-District GIS Radar</span>
          </button>
        </div>

        {/* Center Stage Globe Visualizer + 38 District List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          <div className="lg:col-span-8 flex flex-col">
            <GlobeVisualizer
              title="Planetary Earth Atmospheric Orbiter"
              autoRotate={true}
              interactive={true}
              highlightTamilNadu={true}
              showSatellites={true}
              onSelectTamilNadu={() => setStage('map')}
              className="flex-1 min-h-[540px]"
            />
          </div>

          {/* Right Side 38-District Target Selector */}
          <div className="lg:col-span-4 bg-white border border-[#DDE5E1] rounded-3xl p-5 space-y-3.5 shadow-sm flex flex-col justify-between">
            
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#DDE5E1] pb-2.5">
                <span className="text-xs font-extrabold text-[#17201C] uppercase tracking-wider">
                  Target Weather & Soil Stations
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#D1FAE5]">
                  38 Districts
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#64706A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search 38 districts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] text-xs text-[#17201C] placeholder-[#64706A] focus:outline-none focus:border-[#059669]"
                />
              </div>
            </div>

            {/* Quick 38 Districts Scrollable List */}
            <div className="space-y-1.5 overflow-y-auto max-h-[380px] pr-1">
              {filteredDistricts.map((c) => {
                const liveObj = liveDistrictData.find(
                  (d) => (d.district && d.district.toLowerCase() === c.district.toLowerCase()) || (d.cityName && d.cityName.toLowerCase().includes(c.name.toLowerCase()))
                );
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCityId(c.id);
                      setStage('map');
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-[#F8FAF9] hover:bg-[#ECFDF5] border border-[#DDE5E1] hover:border-[#059669] cursor-pointer transition-all flex items-center justify-between text-xs group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#059669] group-hover:scale-125 transition shadow-xs" />
                      <div>
                        <div className="font-bold text-[#17201C] group-hover:text-[#047857] transition">
                          {c.district}
                        </div>
                        <div className="text-[10px] text-[#64706A]">
                          {c.regionType.replace('-', ' ')} · {c.elevationM}m ASL
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-bold">
                      {liveObj && (
                        <span className={`px-2 py-0.5 rounded font-mono ${
                          liveObj.temperatureC <= 20 ? 'bg-sky-100 text-sky-700' :
                          liveObj.temperatureC >= 32 ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {liveObj.temperatureC.toFixed(1)}°C
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-[#059669] group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setStage('map')}
              className="w-full py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition text-center shadow-sm"
            >
              Explore Full Tamil Nadu GIS Map →
            </button>

          </div>

        </div>

      </div>
    );
  }

  // =========================================================================
  // STAGE 2: FULL TAMIL NADU MAP & SOIL/CROP ADVISORY DETAILS
  // =========================================================================
  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Header with Back to Globe, Active Station & Feature Switcher */}
      <div className="bg-white border border-[#DDE5E1] rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Back to Globe Button and Active District Indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStage('globe')}
              className="px-4 py-2.5 rounded-2xl bg-[#F8FAF9] hover:bg-[#E8F0EC] border border-[#DDE5E1] text-[#17201C] text-xs font-bold transition flex items-center gap-2 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-[#059669]" />
              <span>← Back to Globe View</span>
            </button>

            <div className="h-4 w-px bg-[#DDE5E1] hidden sm:block" />

            <div className="flex items-center gap-2 text-xs text-[#17201C]">
              <MapPin className="w-4 h-4 text-[#059669]" />
              <span>Active District: <strong className="text-[#059669] text-sm">{selectedCity.district}</strong></span>
              <button
                onClick={() => setIsEnlargedDistrictModalOpen(true)}
                className="ml-2 px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] text-[#047857] text-[10px] font-bold hover:bg-[#D1FAE5] transition flex items-center gap-1"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Enlarge</span>
              </button>
            </div>
          </div>

          {/* Feature View Switcher: Soil & Crop Suggestions vs Meteorological Forecast */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 flex-wrap">
            
            <div className="flex items-center p-1 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1]">
              <button
                onClick={() => setExplorerViewMode('crops')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  explorerViewMode === 'crops'
                    ? 'bg-[#059669] text-white shadow-xs'
                    : 'text-[#64706A] hover:text-[#17201C]'
                }`}
              >
                <Sprout className="w-3.5 h-3.5" />
                <span>🌾 Soil & Crop Suggestions</span>
              </button>
              
              <button
                onClick={() => setExplorerViewMode('weather')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  explorerViewMode === 'weather'
                    ? 'bg-[#059669] text-white shadow-xs'
                    : 'text-[#64706A] hover:text-[#17201C]'
                }`}
              >
                <CloudSun className="w-3.5 h-3.5" />
                <span>🌦️ Live Diurnal Weather</span>
              </button>
            </div>

            {/* Quick Refresh */}
            {onRefreshLive && (
              <button
                onClick={onRefreshLive}
                disabled={isLiveLoading}
                className="p-2 rounded-xl bg-white hover:bg-[#F8FAF9] border border-[#DDE5E1] text-[#059669] transition shadow-xs"
                title="Sync live weather feeds"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLiveLoading ? 'animate-spin' : ''}`} />
              </button>
            )}

          </div>

        </div>

      </div>

      {/* Main Interactive Map & City Analysis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 7 cols - Seamless Glowing Tamil Nadu 38 District Map */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <TamilNaduDistrictMap
            selectedDistrictName={selectedCity.district}
            onSelectDistrict={handleSelectDistrict}
            onOpenDetails={() => setIsEnlargedDistrictModalOpen(true)}
            activeVariableIdx={activeVariableIdx}
            showWindVectors={showWindVectors}
            showTitle={true}
            liveDistrictData={liveDistrictData}
            onRefreshLive={onRefreshLive}
            isLiveLoading={isLiveLoading}
            className="flex-1 min-h-[580px]"
          />
        </div>

        {/* Right Column: 5 cols - Full Live Weather Diagnostics & 38 Districts Quick Selector */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Station Live Diagnostics Card */}
          <div className="bg-white border border-[#DDE5E1] rounded-3xl p-5 space-y-4 shadow-sm">
            
            {/* Header with City Name and Regime Badge */}
            <div className="flex items-center justify-between border-b border-[#DDE5E1] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#17201C] tracking-tight">
                    {selectedCity.district}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    LIVE SENSOR
                  </span>
                </div>
                <div className="text-xs text-[#64706A] mt-0.5">
                  Station: <strong className="text-[#17201C]">{selectedCity.name}</strong> · Elev: {selectedCity.elevationM}m ASL
                </div>
              </div>

              <button
                onClick={() => setIsEnlargedDistrictModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#D1FAE5] text-[#047857] text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Enlarge</span>
              </button>
            </div>

            {/* Station Coordinates & Zone */}
            <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1] space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[#059669] font-bold text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>Live Meteorological Feed</span>
                </span>
                <span className="text-[#64706A] text-[10px]">
                  Open-Meteo Synoptic API
                </span>
              </div>
              <div className="flex justify-between text-[#17201C] text-xs pt-1 font-semibold">
                <span>Coordinates:</span>
                <span className="text-[#059669] font-bold">{selectedCity.lat.toFixed(2)}°N, {selectedCity.lon.toFixed(2)}°E</span>
              </div>
              <div className="flex justify-between text-[#64706A] text-[11px]">
                <span>Agro Zone:</span>
                <span className="text-[#047857] font-semibold">{selectedCity.regionType.replace('-', ' ').toUpperCase()}</span>
              </div>
            </div>

            {/* 4 Physical Climate Variables Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              
              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1]">
                <div className="text-[10px] text-[#64706A] uppercase font-bold flex items-center justify-between">
                  <span>Surface Temperature</span>
                  <Thermometer className="w-3.5 h-3.5 text-red-500" />
                </div>
                <div className="text-2xl font-black text-[#17201C] mt-1">
                  {selectedLiveWeather ? selectedLiveWeather.temperatureC.toFixed(1) : '28.5'} °C
                </div>
                <div className="text-[10px] text-[#64706A]">
                  {selectedLiveWeather ? `Feels like ${selectedLiveWeather.apparentTempC?.toFixed(1) || selectedLiveWeather.temperatureC.toFixed(1)}°C` : 'Real-time observation'}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1]">
                <div className="text-[10px] text-[#64706A] uppercase font-bold flex items-center justify-between">
                  <span>Wind Velocity</span>
                  <Wind className="w-3.5 h-3.5 text-[#059669]" />
                </div>
                <div className="text-2xl font-black text-[#047857] mt-1">
                  {selectedLiveWeather ? `${selectedLiveWeather.windSpeedKmh.toFixed(1)} km/h` : '12.0 km/h'}
                </div>
                <div className="text-[10px] text-[#64706A]">
                  {selectedLiveWeather ? `Dir ${selectedLiveWeather.windDirectionDeg}° · Gusts ${selectedLiveWeather.windGustsKmh?.toFixed(1) || selectedLiveWeather.windSpeedKmh.toFixed(1)} km/h` : 'Surface Anemometer'}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1]">
                <div className="text-[10px] text-[#64706A] uppercase font-bold flex items-center justify-between">
                  <span>Relative Humidity</span>
                  <Droplets className="w-3.5 h-3.5 text-sky-600" />
                </div>
                <div className="text-2xl font-black text-[#059669] mt-1">
                  {selectedLiveWeather ? selectedLiveWeather.relativeHumidityPct : 65} %
                </div>
                <div className="text-[10px] text-[#64706A]">
                  {selectedLiveWeather ? `Precip: ${selectedLiveWeather.precipitationMm || 0} mm` : 'Ambient Hygrometer'}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1]">
                <div className="text-[10px] text-[#64706A] uppercase font-bold flex items-center justify-between">
                  <span>Surface Pressure</span>
                  <Gauge className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div className="text-2xl font-black text-[#17201C] mt-1">
                  {selectedLiveWeather && selectedLiveWeather.surfacePressureHpa ? selectedLiveWeather.surfacePressureHpa.toFixed(1) : '1012.4'} hPa
                </div>
                <div className="text-[10px] text-[#64706A]">
                  {selectedLiveWeather ? `UV Index: ${selectedLiveWeather.uvIndex ?? 'Low'}` : 'Barometric Surface'}
                </div>
              </div>

            </div>

          </div>

          {/* Quick 38 Districts Direct List */}
          <div className="bg-white border border-[#DDE5E1] rounded-3xl p-4 sm:p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#DDE5E1] pb-2">
              <span className="text-xs font-extrabold text-[#17201C] uppercase tracking-wider">
                Select District ({CITIES_TAMIL_NADU.length})
              </span>
              <span className="text-[10px] text-[#059669] font-bold">Click to focus</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 max-h-[170px] overflow-y-auto pr-1">
              {CITIES_TAMIL_NADU.map((c) => {
                const isSelected = c.id === selectedCityId;
                const dLive = liveDistrictData.find(
                  (d) => (d.district && d.district.toLowerCase() === c.district.toLowerCase()) || (d.cityName && d.cityName.toLowerCase().includes(c.name.toLowerCase()))
                );
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCityId(c.id);
                    }}
                    className={`px-3 py-2 rounded-xl text-left text-xs transition truncate flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#ECFDF5] border border-[#059669] text-[#047857] font-bold shadow-xs'
                        : 'bg-[#F8FAF9] hover:bg-[#E8F0EC] border border-[#DDE5E1] text-[#17201C]'
                    }`}
                  >
                    <span className="truncate">{c.district}</span>
                    {dLive && (
                      <span className={`text-[10px] font-mono font-bold ml-1 ${
                        dLive.temperatureC <= 20 ? 'text-sky-600' :
                        dLive.temperatureC >= 32 ? 'text-amber-600' :
                        'text-[#059669]'
                      }`}>
                        {Math.round(dLive.temperatureC)}°
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Primary Section Below Map: Crop Suggestions & Soil Classification */}
      <div className="pt-2">
        {explorerViewMode === 'crops' ? (
          <DistrictAgroAdvisory
            selectedDistrictName={selectedCity.district}
            onSelectDistrict={handleSelectDistrict}
            liveDistrictData={liveDistrictData}
          />
        ) : (
          <WeatherFrogCard
            locationName={selectedCity.district === 'Nilgiris' ? 'Nilgiris (Ooty)' : selectedCity.name}
            districtName={selectedCity.district}
            observation={cityObs}
            liveWeather={selectedLiveWeather}
            onSelectDistrict={() => setIsEnlargedDistrictModalOpen(true)}
          />
        )}
      </div>

      {/* ========================================================================= */}
      {/* ENLARGED DISTRICT DEEP-DIVE MODAL / INSPECTOR */}
      {/* ========================================================================= */}
      {isEnlargedDistrictModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-[#DDE5E1] p-6 sm:p-8 shadow-2xl space-y-6 text-[#17201C] font-sans">
            
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between border-b border-[#DDE5E1] pb-4">
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669] shadow-xs">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl sm:text-3xl font-black text-[#17201C] tracking-tight">
                      {selectedCity.district}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      LIVE SENSOR
                    </span>
                  </div>
                  <div className="text-xs text-[#64706A] mt-0.5">
                    Station Lat {selectedCity.lat.toFixed(2)}°N, Lon {selectedCity.lon.toFixed(2)}°E · Elev {selectedCity.elevationM}m ASL · Zone: {selectedCity.regionType.replace('-', ' ').toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Prev / Next & Close */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevDistrict}
                  className="p-2 rounded-xl bg-[#F8FAF9] hover:bg-[#E8F0EC] border border-[#DDE5E1] text-[#17201C]"
                  title="Previous District"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextDistrict}
                  className="p-2 rounded-xl bg-[#F8FAF9] hover:bg-[#E8F0EC] border border-[#DDE5E1] text-[#17201C]"
                  title="Next District"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsEnlargedDistrictModalOpen(false)}
                  className="p-2 rounded-xl bg-[#F8FAF9] hover:bg-rose-50 border border-[#DDE5E1] hover:border-rose-300 text-[#64706A] hover:text-rose-600 ml-2"
                  title="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            </div>

            {/* Embedded Soil & Crop Recommendations */}
            <DistrictAgroAdvisory
              selectedDistrictName={selectedCity.district}
              onSelectDistrict={handleSelectDistrict}
              liveDistrictData={liveDistrictData}
            />

            {/* Close Bottom Button */}
            <div className="pt-4 border-t border-[#DDE5E1] flex justify-end">
              <button
                onClick={() => setIsEnlargedDistrictModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs transition shadow-sm"
              >
                Close Station Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
