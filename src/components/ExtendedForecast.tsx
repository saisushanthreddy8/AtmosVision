import React, { useState, useMemo } from 'react';
import {
  Calendar,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Search,
  MapPin,
  RefreshCw,
  Eye,
  ShieldAlert,
  CloudSun,
  CloudLightning,
  CloudFog
} from 'lucide-react';
import { CITIES_TAMIL_NADU } from '../data/cities';
import { LiveDistrictWeather, LiveStatewideSummary } from '../types';

interface ExtendedForecastProps {
  liveDistrictData: LiveDistrictWeather[];
  liveSummary: LiveStatewideSummary | null;
  onRefreshLive?: () => void;
  isLiveLoading?: boolean;
  onSelectDistrict?: (districtName: string) => void;
}

export const ExtendedForecast: React.FC<ExtendedForecastProps> = ({
  liveDistrictData,
  liveSummary,
  onRefreshLive,
  isLiveLoading = false,
  onSelectDistrict
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('chennai');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Selected district live object
  const activeDistrictLive = useMemo(() => {
    if (!liveDistrictData || liveDistrictData.length === 0) return null;
    return (
      liveDistrictData.find((d) => d.cityId === selectedCityId) ||
      liveDistrictData[0]
    );
  }, [liveDistrictData, selectedCityId]);

  // Selected city static info
  const activeCityInfo = useMemo(() => {
    return CITIES_TAMIL_NADU.find((c) => c.id === selectedCityId) || CITIES_TAMIL_NADU[0];
  }, [selectedCityId]);

  // Filtered districts for quick selector
  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return liveDistrictData;
    const q = searchQuery.toLowerCase();
    return liveDistrictData.filter(
      (d) =>
        d.district.toLowerCase().includes(q) ||
        d.cityName.toLowerCase().includes(q)
    );
  }, [liveDistrictData, searchQuery]);

  // Key synoptic hubs for comparative outlook
  const SYNOPTIC_HUBS = useMemo(() => {
    const hubIds = ['chennai', 'coimbatore', 'madurai', 'ooty', 'salem', 'kanyakumari', 'thanjavur', 'tirunelveli'];
    return liveDistrictData.filter((d) => hubIds.includes(d.cityId));
  }, [liveDistrictData]);

  // Weather icon helper
  const getWeatherIcon = (code: number, size: string = 'w-6 h-6') => {
    if (code === 0) return <Sun className={`${size} text-amber-500`} />;
    if (code <= 3) return <CloudSun className={`${size} text-amber-400`} />;
    if (code >= 45 && code <= 48) return <CloudFog className={`${size} text-slate-400`} />;
    if (code >= 51 && code <= 67) return <CloudRain className={`${size} text-emerald-500`} />;
    if (code >= 80 && code <= 82) return <CloudRain className={`${size} text-teal-600`} />;
    if (code >= 95) return <CloudLightning className={`${size} text-purple-600`} />;
    return <Sun className={`${size} text-amber-500`} />;
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner: Synoptic Meteorological Outlook */}
      <div className="bg-white border border-[#DDE5E1] rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#059669] text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>Open-Meteo High-Resolution Numerical Model · 7-Day Synoptic Run</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17201C] tracking-tight mt-1.5">
            Tamil Nadu 7-Day Synoptic Weather Forecast
          </h2>
          <p className="text-xs sm:text-sm text-[#64706A] mt-1 font-medium">
            Multi-model numerical weather predictions, diurnal temperature envelopes, and precipitation probabilities across all 38 districts.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {onRefreshLive && (
            <button
              onClick={onRefreshLive}
              disabled={isLiveLoading}
              className="px-4 py-2.5 rounded-2xl bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#D1FAE5] text-[#047857] text-xs font-bold transition flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLiveLoading ? 'animate-spin' : ''}`} />
              <span>Sync Forecast Feeds</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Focus District 7-Day Forecast Center */}
      {activeDistrictLive && (
        <div className="bg-white border border-[#DDE5E1] rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
          
          {/* District Header & Metric Chips */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDE5E1] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669] shadow-xs">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-extrabold text-[#17201C] tracking-tight">
                    {activeDistrictLive.district}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#D1FAE5] text-[10px] font-bold">
                    {activeDistrictLive.regionType.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-[#64706A] mt-0.5">
                  Station Lat {activeDistrictLive.lat.toFixed(2)}°N, Lon {activeDistrictLive.lon.toFixed(2)}°E · Elev {activeDistrictLive.elevationM}m ASL
                </div>
              </div>
            </div>

            {/* Quick Live Snapshot Bar */}
            <div className="flex items-center gap-3 bg-[#F8FAF9] p-2.5 rounded-2xl border border-[#DDE5E1] text-xs">
              <div className="px-2">
                <div className="text-[10px] text-[#64706A] font-semibold">Now Temp</div>
                <div className="font-extrabold text-sm text-[#17201C]">{activeDistrictLive.temperatureC.toFixed(1)}°C</div>
              </div>
              <div className="h-6 w-px bg-[#DDE5E1]" />
              <div className="px-2">
                <div className="text-[10px] text-[#64706A] font-semibold">Humidity</div>
                <div className="font-extrabold text-sm text-[#059669]">{activeDistrictLive.relativeHumidityPct}%</div>
              </div>
              <div className="h-6 w-px bg-[#DDE5E1]" />
              <div className="px-2">
                <div className="text-[10px] text-[#64706A] font-semibold">Wind</div>
                <div className="font-extrabold text-sm text-[#17201C]">{activeDistrictLive.windSpeedKmh.toFixed(1)} km/h</div>
              </div>
            </div>
          </div>

          {/* 7-Day Interactive Forecast Cards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#17201C] uppercase tracking-wider">
                7-Day Daily Synoptic Timeline
              </span>
              <span className="text-[11px] text-[#059669] font-semibold">
                Click day to inspect diurnal details
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {(activeDistrictLive.daily7d || []).map((day, idx) => {
                const isSelected = selectedDayIndex === idx;
                return (
                  <div
                    key={day.date}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-between text-center gap-3 ${
                      isSelected
                        ? 'bg-[#ECFDF5] border-[#059669] shadow-md scale-102 ring-2 ring-[#059669]/20'
                        : 'bg-[#F8FAF9] hover:bg-white border-[#DDE5E1] hover:border-[#059669]'
                    }`}
                  >
                    <div>
                      <div className={`text-xs font-extrabold ${isSelected ? 'text-[#047857]' : 'text-[#17201C]'}`}>
                        {idx === 0 ? 'Today' : day.dayLabel}
                      </div>
                      <div className="text-[10px] text-[#64706A] font-mono mt-0.5">
                        {day.date.split('-').slice(1).join('/')}
                      </div>
                    </div>

                    <div className="my-1">
                      {getWeatherIcon(day.weatherCode, 'w-8 h-8')}
                    </div>

                    <div className="text-[11px] font-bold text-[#17201C] line-clamp-1">
                      {day.weatherCondition}
                    </div>

                    {/* Temperature High / Low */}
                    <div className="w-full pt-2 border-t border-[#DDE5E1] flex items-center justify-between text-xs">
                      <span className="font-extrabold text-rose-700">{Math.round(day.maxTempC)}°</span>
                      <span className="text-[10px] text-[#64706A]">/</span>
                      <span className="font-bold text-sky-700">{Math.round(day.minTempC)}°</span>
                    </div>

                    {/* Rain Probability Pill */}
                    <div className={`w-full py-1 px-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 ${
                      day.precipitationProbMax > 40
                        ? 'bg-emerald-100 text-[#047857]'
                        : 'bg-[#E8F0EC] text-[#64706A]'
                    }`}>
                      <CloudRain className="w-3 h-3" />
                      <span>{day.precipitationProbMax}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 24-Hour Diurnal Forecast Slider & Graph */}
          {activeDistrictLive.hourly24h && activeDistrictLive.hourly24h.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#17201C]">
                  <Thermometer className="w-4 h-4 text-[#059669]" />
                  <span>Next 24-Hour High-Resolution Diurnal Forecast Curve</span>
                </div>
                <span className="text-[11px] text-[#64706A]">1-Hour Temporal Resolution</span>
              </div>

              {/* 24-Hour Scrollable Hourly Ribbons */}
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {activeDistrictLive.hourly24h.map((h, hIdx) => (
                  <div
                    key={h.time}
                    className="flex-shrink-0 w-20 p-2.5 rounded-xl bg-white border border-[#DDE5E1] flex flex-col items-center gap-1.5 text-center shadow-2xs"
                  >
                    <span className="text-[11px] font-bold text-[#17201C]">{h.hourLabel}</span>
                    {getWeatherIcon(h.weatherCode, 'w-5 h-5')}
                    <span className="text-xs font-extrabold text-[#17201C]">{Math.round(h.temperatureC)}°C</span>
                    <div className="w-full bg-[#ECFDF5] rounded text-[9px] text-[#047857] font-semibold py-0.5">
                      {h.precipitationProbability}% 🌧
                    </div>
                    <span className="text-[9px] text-[#64706A]">{Math.round(h.windSpeedKmh)} km/h</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* 38-District Forecast Navigator Strip & Search */}
      <div className="bg-white border border-[#DDE5E1] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE5E1] pb-3">
          <div>
            <h4 className="text-base font-extrabold text-[#17201C]">
              Select District for Synoptic Forecast ({filteredDistricts.length} Districts)
            </h4>
            <p className="text-xs text-[#64706A]">
              Switch focus station to view detailed 7-day numerical projections
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#64706A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] text-xs text-[#17201C] focus:outline-none focus:border-[#059669]"
            />
          </div>
        </div>

        {/* 38 Districts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-60 overflow-y-auto pr-1">
          {filteredDistricts.map((d) => {
            const isSelected = d.cityId === selectedCityId;
            return (
              <button
                key={d.cityId}
                onClick={() => {
                  setSelectedCityId(d.cityId);
                  if (onSelectDistrict) onSelectDistrict(d.district);
                }}
                className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#ECFDF5] border-[#059669] text-[#047857] font-bold shadow-xs'
                    : 'bg-[#F8FAF9] hover:bg-white border-[#DDE5E1] text-[#17201C]'
                }`}
              >
                <div className="truncate">
                  <div className="text-xs truncate font-bold">{d.district}</div>
                  <div className="text-[10px] text-[#64706A] truncate">{d.weatherCondition}</div>
                </div>
                <div className="text-xs font-black text-right ml-1">
                  {Math.round(d.temperatureC)}°
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparative Outlook for Major Regional Synoptic Hubs */}
      <div className="bg-white border border-[#DDE5E1] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#DDE5E1] pb-3">
          <div>
            <h4 className="text-base font-extrabold text-[#17201C]">
              Statewide Regional Meteorological Hubs — 7-Day Comparison
            </h4>
            <p className="text-xs text-[#64706A]">
              Synoptic overview across Coastal, Interior, Hill Stations, and Southern corridors
            </p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#D1FAE5]">
            Key 8 Hubs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {SYNOPTIC_HUBS.map((hub) => {
            const nextDay = hub.daily7d && hub.daily7d.length > 1 ? hub.daily7d[1] : null;
            return (
              <div
                key={hub.cityId}
                onClick={() => setSelectedCityId(hub.cityId)}
                className="p-4 rounded-2xl bg-[#F8FAF9] hover:bg-[#ECFDF5] border border-[#DDE5E1] hover:border-[#059669] transition cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-sm text-[#17201C] group-hover:text-[#047857]">
                    {hub.district}
                  </div>
                  <span className="text-xs font-mono font-black text-[#059669]">
                    {hub.temperatureC.toFixed(1)}°C
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#64706A]">
                  <span>Condition:</span>
                  <span className="font-semibold text-[#17201C]">{hub.weatherCondition}</span>
                </div>

                {nextDay && (
                  <div className="pt-2 border-t border-[#DDE5E1] flex items-center justify-between text-xs">
                    <span className="text-[#64706A]">Tomorrow:</span>
                    <span className="font-bold text-[#17201C]">
                      {Math.round(nextDay.minTempC)}° / {Math.round(nextDay.maxTempC)}°C ({nextDay.precipitationProbMax}% rain)
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
