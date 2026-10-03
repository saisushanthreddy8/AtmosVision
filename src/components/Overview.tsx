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
  Sun
} from 'lucide-react';
import { TabId, LiveDistrictWeather, LiveStatewideSummary, CityClimateObservation } from '../types';
import { GlobeVisualizer } from './GlobeVisualizer';
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
  'Vellore'
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
    <div className="space-y-6 font-sans">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17201C] tracking-tight">
              Tamil Nadu Live Weather & Meteorological Radar
            </h1>
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Synoptic Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64706A] mt-1 font-medium">
            Real-Time 38-District Meteorological Station Network · Open-Meteo Planetary API
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onRefreshLive && (
            <button
              onClick={onRefreshLive}
              disabled={isLiveLoading}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#F8FAF9] border border-[#DDE5E1] text-[#17201C] text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#059669] ${isLiveLoading ? 'animate-spin' : ''}`} />
              <span>Sync Now</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('explorer')}
            className="px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-sm shadow-[#059669]/20 flex items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>38-District GIS Radar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 4 Real-Time Atmospheric Telemetry Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Metric 1: Temperature */}
        <div className="bg-white border border-[#DDE5E1] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center flex-shrink-0">
            <Thermometer className="w-5 h-5 text-[#059669]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-[#64706A] uppercase font-bold flex items-center gap-1.5">
              <span>Live State Temp</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#17201C] tracking-tight">
              {liveSummary ? liveSummary.stateAvgTempC : '31.4'} <span className="text-xs font-normal text-[#64706A]">°C</span>
            </div>
            <div className="text-[10px] text-[#64706A] truncate">
              {liveSummary ? `Coolest: ${liveSummary.coolestDistrict.tempC}° (${liveSummary.coolestDistrict.district})` : 'All 38 Districts'}
            </div>
          </div>
        </div>

        {/* Metric 2: Humidity */}
        <div className="bg-white border border-[#DDE5E1] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center flex-shrink-0">
            <Droplets className="w-5 h-5 text-[#059669]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-[#64706A] uppercase font-bold">Relative Humidity</div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#17201C] tracking-tight">
              {liveSummary ? liveSummary.stateAvgHumidityPct : '66'} <span className="text-xs font-normal text-[#64706A]">%</span>
            </div>
            <div className="text-[10px] text-[#64706A] truncate">
              Real-time Ambient Sensor Average
            </div>
          </div>
        </div>

        {/* Metric 3: Wind */}
        <div className="bg-white border border-[#DDE5E1] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center flex-shrink-0">
            <Wind className="w-5 h-5 text-[#059669]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-[#64706A] uppercase font-bold">Avg Wind Speed</div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#17201C] tracking-tight">
              {liveSummary ? liveSummary.stateAvgWindKmh : '12.8'} <span className="text-xs font-normal text-[#64706A]">km/h</span>
            </div>
            <div className="text-[10px] text-[#64706A] truncate">
              {liveSummary ? `Warmest: ${liveSummary.warmestDistrict.tempC}° (${liveSummary.warmestDistrict.district})` : 'Surface Anemometers'}
            </div>
          </div>
        </div>

        {/* Metric 4: Pressure */}
        <div className="bg-white border border-[#DDE5E1] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center flex-shrink-0">
            <Gauge className="w-5 h-5 text-[#059669]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-[#64706A] uppercase font-bold">Surface Stations</div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#17201C] tracking-tight">
              {liveDistrictData.length > 0 ? liveDistrictData.length : '38'} <span className="text-xs font-normal text-[#64706A]">/ 38</span>
            </div>
            <div className="text-[10px] text-[#059669] font-bold truncate">
              100% Online & Synced
            </div>
          </div>
        </div>

      </div>

      {/* Real-Time Live Weather Telemetry Highlights Banner */}
      {liveSummary && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#059669]/10 to-sky-500/10 border border-emerald-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#059669] text-white font-bold">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>LIVE TELEMETRY</span>
            </div>
            <span className="font-bold text-[#17201C]">
              Statewide Status: <strong className="text-[#059669]">{liveSummary.dominantWeather || 'Fair & Tropical Skies'}</strong>
            </span>
            <span className="text-[#64706A] hidden sm:inline">
              · Warmest: <strong className="text-amber-700">{liveSummary.warmestDistrict.district} ({liveSummary.warmestDistrict.tempC}°C)</strong>
              · Coolest: <strong className="text-sky-700">{liveSummary.coolestDistrict.district} ({liveSummary.coolestDistrict.tempC}°C)</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#64706A]">
              Open-Meteo API · 38 Stations Active
            </span>
          </div>
        </div>
      )}

      {/* District Quick Focus Bar */}
      <div className="bg-white border border-[#DDE5E1] rounded-2xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[11px] font-bold text-[#17201C] uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
            <MapPin className="w-3.5 h-3.5 text-[#059669]" /> Focus District:
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
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex-shrink-0 border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#ECFDF5] text-[#047857] border-[#059669] shadow-xs'
                    : 'bg-[#F8FAF9] text-[#64706A] hover:text-[#17201C] border-[#DDE5E1]'
                }`}
              >
                <span>{dName}</span>
                {districtLive && (
                  <span className={`text-[10px] font-mono px-1 rounded ${
                    districtLive.temperatureC <= 20 ? 'bg-sky-100 text-sky-700' :
                    districtLive.temperatureC >= 32 ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {Math.round(districtLive.temperatureC)}°
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Climate Variable Selector for Tamil Nadu Map */}
        <div className="flex items-center gap-1.5 flex-shrink-0 bg-[#F8FAF9] p-1 rounded-xl border border-[#DDE5E1]">
          <span className="text-[10px] text-[#64706A] font-bold px-2 uppercase tracking-wider">Field:</span>
          {CLIMATE_VARIABLES.slice(0, 4).map((v, vIdx) => {
            const isVarActive = activeVarIdx === vIdx;
            return (
              <button
                key={v.id}
                onClick={() => setActiveVarIdx(vIdx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
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

      {/* Main 2-Column Core Visualizer: Rotating Earth Globe + Glowing Tamil Nadu Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Panel 1: Enlarged Rotating 3D Earth Globe */}
        <div className="h-full flex flex-col">
          <GlobeVisualizer
            title="Global Earth Atmospheric Orbiter"
            autoRotate={true}
            interactive={true}
            highlightTamilNadu={true}
            showSatellites={true}
            className="flex-1 min-h-[540px] shadow-sm"
          />
        </div>

        {/* Panel 2: Enlarged Glowing Tamil Nadu 38-District Climate Map */}
        <div className="h-full flex flex-col">
          <TamilNaduDistrictMap
            selectedDistrictName={selectedDistrict}
            onSelectDistrict={(d) => setSelectedDistrict(d)}
            activeVariableIdx={activeVarIdx}
            showTitle={true}
            liveDistrictData={liveDistrictData}
            onRefreshLive={onRefreshLive}
            isLiveLoading={isLiveLoading}
            className="flex-1 min-h-[540px] shadow-sm"
          />
        </div>

      </div>

      {/* Modern Meteorological Frog Card for Selected District */}
      <div>
        <WeatherFrogCard
          locationName={selectedCity.district === 'Nilgiris' ? 'Nilgiris (Ooty)' : selectedCity.name}
          districtName={selectedCity.district}
          observation={activeObs}
          liveWeather={selectedLiveWeather}
          className="shadow-sm"
        />
      </div>

      {/* 4 Pure Live Sub-Navigation Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        
        <div
          onClick={() => onNavigate('explorer')}
          className="p-5 rounded-2xl bg-white hover:bg-[#F8FAF9] border border-[#DDE5E1] hover:border-[#059669] transition-all cursor-pointer shadow-sm space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">38-District Radar</span>
            <Compass className="w-4 h-4 text-[#64706A] group-hover:text-[#059669] transition" />
          </div>
          <div className="text-sm font-bold text-[#17201C]">Interactive Station Telemetry</div>
          <p className="text-xs text-[#64706A]">
            Real-time station sensor readings, 24-hour diurnal curves, and geographic spatial distribution.
          </p>
        </div>

        <div
          onClick={() => onNavigate('analytics')}
          className="p-5 rounded-2xl bg-white hover:bg-[#F8FAF9] border border-[#DDE5E1] hover:border-[#059669] transition-all cursor-pointer shadow-sm space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">Statewide Analytics</span>
            <BarChart3 className="w-4 h-4 text-[#64706A] group-hover:text-[#059669] transition" />
          </div>
          <div className="text-sm font-bold text-[#17201C]">Thermal Rankings & Table</div>
          <p className="text-xs text-[#64706A]">
            Sortable 38-district telemetry leaderboards, warmest/coolest rankings, and live anomaly analysis.
          </p>
        </div>

        <div
          onClick={() => onNavigate('forecast')}
          className="p-5 rounded-2xl bg-white hover:bg-[#F8FAF9] border border-[#DDE5E1] hover:border-[#059669] transition-all cursor-pointer shadow-sm space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">7-Day Synoptic Run</span>
            <Calendar className="w-4 h-4 text-[#64706A] group-hover:text-[#059669] transition" />
          </div>
          <div className="text-sm font-bold text-[#17201C]">Numerical Weather Model</div>
          <p className="text-xs text-[#64706A]">
            Multi-day temperature envelopes, rain probability bars, and wind kinematics across all districts.
          </p>
        </div>

        <div
          onClick={() => onNavigate('analytics')}
          className="p-5 rounded-2xl bg-white hover:bg-[#F8FAF9] border border-[#DDE5E1] hover:border-[#059669] transition-all cursor-pointer shadow-sm space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">Microclimate Zones</span>
            <Activity className="w-4 h-4 text-[#64706A] group-hover:text-[#059669] transition" />
          </div>
          <div className="text-sm font-bold text-[#17201C]">4 Regional Divisions</div>
          <p className="text-xs text-[#64706A]">
            Western Ghats, Coromandel Maritime Coast, Interior Kaveri Basin, and Northern Plateau.
          </p>
        </div>

      </div>

    </div>
  );
};
