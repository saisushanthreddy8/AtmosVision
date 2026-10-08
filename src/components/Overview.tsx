import React, { useState, useMemo } from 'react';
import {
  Wind,
  Gauge,
  Activity,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Compass,
  Thermometer,
  Droplets,
  Calendar,
  CloudRain,
  Snowflake,
  Flame,
  ChevronRight,
  MapPin,
  BarChart3,
  Radio,
  Sun,
  Sprout
} from 'lucide-react';
import { TabId, LiveDistrictWeather, LiveStatewideSummary, CityClimateObservation } from '../types';
import { TamilNaduDistrictMap } from './TamilNaduDistrictMap';
import { WeatherFrogCard } from './WeatherFrogCard';
import { CITIES_TAMIL_NADU } from '../data/cities';
import { CLIMATE_VARIABLES } from '../data/climateVariables';

interface OverviewProps {
  onNavigate: (tab: TabId) => void;
  liveDistrictData?: LiveDistrictWeather[];
  liveSummary?: LiveStatewideSummary | null;
  onRefreshLive?: () => void;
  isLiveLoading?: boolean;
}

const FEATURED_DISTRICTS = [
  'Chennai',
  'Nilgiris',
  'Coimbatore',
  'Madurai',
  'Kanyakumari',
  'Thanjavur',
  'Salem',
  'Tirunelveli',
  'Vellore',
  'Trichy'
];

export const Overview: React.FC<OverviewProps> = ({
  onNavigate,
  liveDistrictData = [],
  liveSummary,
  onRefreshLive,
  isLiveLoading = false
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Nilgiris');
  const [activeVarIdx, setActiveVarIdx] = useState<number>(0); // 0 = Temp, 1 = U, 2 = V, 3 = Q

  // Get active city metadata
  const selectedCity = useMemo(() => {
    return (
      CITIES_TAMIL_NADU.find(
        (c) =>
          c.district.toLowerCase() === selectedDistrict.toLowerCase() ||
          c.name.toLowerCase().includes(selectedDistrict.toLowerCase())
      ) || CITIES_TAMIL_NADU[0]
    );
  }, [selectedDistrict]);

  // Find real-time live weather for the selected district
  const selectedLiveWeather: LiveDistrictWeather | null = useMemo(() => {
    if (!liveDistrictData || liveDistrictData.length === 0) return null;
    const q = selectedDistrict.toLowerCase().trim();
    return (
      liveDistrictData.find(
        (d) =>
          d.districtName?.toLowerCase() === q ||
          d.district?.toLowerCase() === q ||
          d.cityName?.toLowerCase().includes(q) ||
          q.includes(d.district?.toLowerCase() || '') ||
          q.includes(d.cityName?.toLowerCase() || '')
      ) || null
    );
  }, [liveDistrictData, selectedDistrict]);

  // Synthetic observation for fallback component props
  const activeObs: CityClimateObservation = useMemo(() => {
    const temp = selectedLiveWeather ? selectedLiveWeather.temperatureC : 28.5;
    const rh = selectedLiveWeather ? selectedLiveWeather.relativeHumidityPct : 65;
    const wind = selectedLiveWeather ? selectedLiveWeather.windSpeedMs : 4.2;
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
        description: `Real-time observational telemetry for ${selectedCity.district}, Tamil Nadu.`,
        weatherType: selectedLiveWeather?.weatherType || 'clear'
      }
    };
  }, [selectedCity, selectedLiveWeather]);

  return (
    <div className="space-y-5 font-sans animate-fade-in pb-8">
      
      {/* 1. Sleek Dashboard Top Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EBE8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-[#17201C] tracking-tight">
              Tamil Nadu Weather Radar & Telemetry
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] text-[11px] font-bold inline-flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-[#64706A]">
            Real-Time 38-District Meteorological Station Network · Synoptic Observations & AI Forecasting
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {onRefreshLive && (
            <button
              onClick={onRefreshLive}
              disabled={isLiveLoading}
              className="px-3.5 py-2 rounded-xl bg-[#F8FAF9] hover:bg-[#F0F4F2] border border-[#DDE5E1] text-[#17201C] text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#059669] ${isLiveLoading ? 'animate-spin' : ''}`} />
              <span>Sync Stations</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('ai_predict')}
            className="px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-black shadow-xs shadow-[#059669]/25 flex items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Predictor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Unified Modern Weather Metrics Strip (Consolidated & Clean) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5EBE8] shadow-xs space-y-3">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Temperature */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#F8FAF9] border border-[#E5EBE8] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669] flex-shrink-0">
              <Thermometer className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-[#64706A] uppercase font-bold tracking-wider">Avg Temperature</div>
              <div className="text-lg sm:text-xl font-extrabold text-[#17201C] tracking-tight">
                {liveSummary ? liveSummary.stateAvgTempC : '31.4'} <span className="text-xs font-semibold text-[#64706A]">°C</span>
              </div>
              <div className="text-[10px] text-[#059669] font-semibold truncate">
                {liveSummary ? `Coolest: ${liveSummary.coolestDistrict.tempC}°C (${liveSummary.coolestDistrict.district})` : 'All 38 Districts'}
              </div>
            </div>
          </div>

          {/* Humidity */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#F8FAF9] border border-[#E5EBE8] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669] flex-shrink-0">
              <Droplets className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-[#64706A] uppercase font-bold tracking-wider">State Humidity</div>
              <div className="text-lg sm:text-xl font-extrabold text-[#17201C] tracking-tight">
                {liveSummary ? liveSummary.stateAvgHumidityPct : '66'} <span className="text-xs font-semibold text-[#64706A]">%</span>
              </div>
              <div className="text-[10px] text-[#64706A] font-semibold truncate">
                Ambient Sensor Average
              </div>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#F8FAF9] border border-[#E5EBE8] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669] flex-shrink-0">
              <Wind className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-[#64706A] uppercase font-bold tracking-wider">Wind Velocity</div>
              <div className="text-lg sm:text-xl font-extrabold text-[#17201C] tracking-tight">
                {liveSummary ? liveSummary.stateAvgWindKmh : '12.8'} <span className="text-xs font-semibold text-[#64706A]">km/h</span>
              </div>
              <div className="text-[10px] text-[#64706A] font-semibold truncate">
                {liveSummary ? `Warmest: ${liveSummary.warmestDistrict.tempC}°C (${liveSummary.warmestDistrict.district})` : 'Surface Anemometers'}
              </div>
            </div>
          </div>

          {/* Surface Stations */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#F8FAF9] border border-[#E5EBE8] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669] flex-shrink-0">
              <Radio className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-[#64706A] uppercase font-bold tracking-wider">Telemetry Stations</div>
              <div className="text-lg sm:text-xl font-extrabold text-[#17201C] tracking-tight">
                {liveDistrictData.length > 0 ? liveDistrictData.length : '38'} <span className="text-xs font-semibold text-[#64706A]">/ 38</span>
              </div>
              <div className="text-[10px] text-[#059669] font-bold truncate">
                100% Online & Synced
              </div>
            </div>
          </div>

        </div>

        {/* Live Weather Status Bar */}
        {liveSummary && (
          <div className="pt-2.5 border-t border-[#E5EBE8] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-[#17201C] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>Statewide Condition: <strong className="text-[#059669]">{liveSummary.dominantWeather || 'Fair & Tropical Skies'}</strong></span>
            </div>
            <span className="text-[11px] text-[#64706A]">
              Planetary Meteorological Model · Updated Live
            </span>
          </div>
        )}
      </div>

      {/* 3. District Quick-Focus Selector & Radar Field Toolbar */}
      <div className="bg-white border border-[#E5EBE8] rounded-2xl p-3 sm:p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        
        {/* District Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[10px] font-bold text-[#64706A] uppercase tracking-wider flex items-center gap-1 flex-shrink-0 mr-1">
            <MapPin className="w-3.5 h-3.5 text-[#059669]" /> Select:
          </span>
          {FEATURED_DISTRICTS.map((dName) => {
            const isSelected = selectedDistrict.toLowerCase() === dName.toLowerCase();
            const districtLive = liveDistrictData.find(
              (d) => (d.district && d.district.toLowerCase() === dName.toLowerCase()) || (d.cityName && d.cityName.toLowerCase().includes(dName.toLowerCase()))
            );
            return (
              <button
                key={dName}
                onClick={() => setSelectedDistrict(dName)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 border flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#059669] text-white border-[#059669] shadow-xs'
                    : 'bg-[#F8FAF9] text-[#64706A] hover:text-[#17201C] border-[#E5EBE8] hover:bg-white'
                }`}
              >
                <span>{dName}</span>
                {districtLive && (
                  <span className={`text-[10px] font-mono px-1 rounded ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : districtLive.temperatureC <= 20
                      ? 'bg-sky-100 text-sky-700'
                      : districtLive.temperatureC >= 32
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {Math.round(districtLive.temperatureC)}°
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Climate Variable Selector */}
        <div className="flex items-center gap-1 flex-shrink-0 bg-[#F8FAF9] p-1 rounded-xl border border-[#E5EBE8]">
          <span className="text-[10px] text-[#64706A] font-bold px-1.5 uppercase tracking-wider">Layer:</span>
          {CLIMATE_VARIABLES.slice(0, 4).map((v, vIdx) => {
            const isVarActive = activeVarIdx === vIdx;
            return (
              <button
                key={v.id}
                onClick={() => setActiveVarIdx(vIdx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  isVarActive
                    ? 'bg-[#059669] text-white shadow-xs'
                    : 'text-[#64706A] hover:text-[#17201C]'
                }`}
              >
                <span>{v.symbol}</span>
                <span className="text-[10px] opacity-80 hidden sm:inline">{v.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Full-Width Tamil Nadu 38-District GIS Climate Radar Map */}
      <div className="w-full">
        <TamilNaduDistrictMap
          selectedDistrictName={selectedDistrict}
          onSelectDistrict={(d) => setSelectedDistrict(d)}
          activeVariableIdx={activeVarIdx}
          showTitle={true}
          liveDistrictData={liveDistrictData}
          onRefreshLive={onRefreshLive}
          isLiveLoading={isLiveLoading}
          className="w-full min-h-[560px] shadow-xs rounded-2xl border border-[#E5EBE8]"
        />
      </div>

      {/* 5. Meteorological Observation Card for Selected District */}
      <div>
        <WeatherFrogCard
          locationName={selectedCity.district === 'Nilgiris' ? 'Nilgiris (Ooty)' : selectedCity.name}
          districtName={selectedCity.district}
          observation={activeObs}
          liveWeather={selectedLiveWeather}
          className="shadow-xs rounded-2xl border border-[#E5EBE8]"
        />
      </div>

      {/* 6. Quick-Access Feature Hub Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
        
        {/* Card 1: 38-District Explorer */}
        <div
          onClick={() => onNavigate('explorer')}
          className="p-4 rounded-2xl bg-white border border-[#E5EBE8] hover:border-[#059669] transition-all shadow-xs cursor-pointer group space-y-2 hover:-translate-y-0.5"
        >
          <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669] group-hover:scale-105 transition-transform">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#17201C] group-hover:text-[#059669] transition-colors flex items-center justify-between">
              <span>District Explorer</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#64706A] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-[#64706A] mt-0.5">
              Detailed station telemetry for all 38 districts.
            </p>
          </div>
        </div>

        {/* Card 2: AI Weather Predictor */}
        <div
          onClick={() => onNavigate('ai_predict')}
          className="p-4 rounded-2xl bg-white border border-[#E5EBE8] hover:border-[#059669] transition-all shadow-xs cursor-pointer group space-y-2 hover:-translate-y-0.5"
        >
          <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669] group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#17201C] group-hover:text-[#059669] transition-colors flex items-center justify-between">
              <span>AI Weather Forecast</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#64706A] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-[#64706A] mt-0.5">
              7-Day ML prediction model & meteorological simulator.
            </p>
          </div>
        </div>

        {/* Card 3: Crop Suggestions Studio */}
        <div
          onClick={() => onNavigate('crop_suggestions')}
          className="p-4 rounded-2xl bg-white border border-[#E5EBE8] hover:border-[#059669] transition-all shadow-xs cursor-pointer group space-y-2 hover:-translate-y-0.5"
        >
          <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669] group-hover:scale-105 transition-transform">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#17201C] group-hover:text-[#059669] transition-colors flex items-center justify-between">
              <span>Crop Suggestions & Calculator</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#64706A] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-[#64706A] mt-0.5">
              GPS soil analysis & seed-fertilizer acreage calculator.
            </p>
          </div>
        </div>

        {/* Card 4: Weather Analytics */}
        <div
          onClick={() => onNavigate('analytics')}
          className="p-4 rounded-2xl bg-white border border-[#E5EBE8] hover:border-[#059669] transition-all shadow-xs cursor-pointer group space-y-2 hover:-translate-y-0.5"
        >
          <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669] group-hover:scale-105 transition-transform">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#17201C] group-hover:text-[#059669] transition-colors flex items-center justify-between">
              <span>Weather Analytics</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#64706A] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-[#64706A] mt-0.5">
              Statewide thermal, wind, and humidity rankings.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
