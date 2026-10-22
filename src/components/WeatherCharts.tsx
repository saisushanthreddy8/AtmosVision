import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  Calendar,
  Layers,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { LiveDistrictWeather } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { DISTRICT_REGIONS } from '../data/tamilNaduGeo';

interface WeatherChartsProps {
  liveDistrictData?: LiveDistrictWeather[];
  initialDistrict?: string;
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({
  liveDistrictData = [],
  initialDistrict = 'Chennai'
}) => {
  const { language, t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict);
  const [chartMode, setChartMode] = useState<'24h' | '7day' | 'comparison'>('24h');
  const [activeMetric, setActiveMetric] = useState<'temp' | 'humidity' | 'rain' | 'wind'>('temp');

  const effectiveDistricts = useMemo(() => {
    if (liveDistrictData && liveDistrictData.length > 0) {
      return liveDistrictData;
    }
    return DISTRICT_REGIONS.map((d, i) => ({
      cityId: d.code.toLowerCase(),
      cityName: d.name,
      district: d.name,
      lat: d.lat,
      lon: d.lon,
      elevationM: d.name === 'Nilgiris' ? 2200 : 50,
      regionType: d.name === 'Nilgiris' ? 'western-ghats' : 'interior-plains',
      temperatureC: d.name === 'Nilgiris' ? 17.5 : 28.5 + (i % 5) * 0.8,
      apparentTempC: d.name === 'Nilgiris' ? 17.0 : 30.0,
      relativeHumidityPct: 62 + (i % 4) * 4,
      windSpeedKmh: 12 + (i % 3) * 2,
      windSpeedMs: 3.5,
      windDirectionDeg: 120,
      surfacePressureHpa: 1012,
      weatherCode: 1,
      weatherCondition: 'Partly Cloudy',
      weatherType: 'clear',
      isDay: true,
      precipitationMm: 0,
      updatedAt: new Date().toISOString()
    } as LiveDistrictWeather));
  }, [liveDistrictData]);

  const currentDistrict = useMemo(() => {
    return (
      effectiveDistricts.find((d) => d.district === selectedDistrict) ||
      effectiveDistricts[0]
    );
  }, [effectiveDistricts, selectedDistrict]);

  // Generate 24-hour hourly trend data based on current telemetry
  const hourlyData = useMemo(() => {
    if (!currentDistrict) return [];
    const baseTemp = typeof currentDistrict?.temperatureC === 'number' && !isNaN(currentDistrict.temperatureC) ? currentDistrict.temperatureC : 28;
    const baseHumidity = typeof currentDistrict?.relativeHumidityPct === 'number' && !isNaN(currentDistrict.relativeHumidityPct) ? currentDistrict.relativeHumidityPct : 65;
    const baseWind = typeof currentDistrict?.windSpeedKmh === 'number' && !isNaN(currentDistrict.windSpeedKmh) ? currentDistrict.windSpeedKmh : 12;
    const precipMm = typeof currentDistrict?.precipitationMm === 'number' && !isNaN(currentDistrict.precipitationMm) ? currentDistrict.precipitationMm : 0;

    const hours = [];
    const now = new Date();
    const currentHour = now.getHours();

    for (let i = 0; i < 24; i++) {
      const h = (currentHour + i) % 24;
      const timeStr = `${h.toString().padStart(2, '0')}:00`;

      // Diurnal temperature cycle: peak around 14:00 (hour 14), lowest at 05:00
      const solarFactor = Math.sin(((h - 8) / 24) * Math.PI * 2);
      const temp = Number((baseTemp + solarFactor * 4.5).toFixed(1)) || baseTemp;
      const feelsLike = Number((temp + (baseHumidity > 70 ? 2.5 : 0.5)).toFixed(1)) || temp;
      const humidity = Math.min(100, Math.max(30, Math.round(baseHumidity - solarFactor * 15))) || baseHumidity;
      const wind = Math.max(3, Number((baseWind + Math.sin(i * 0.5) * 4).toFixed(1))) || baseWind;
      const rainProb = Math.min(100, Math.max(0, Math.round(precipMm > 0 ? 60 + Math.cos(i) * 30 : 15 + Math.sin(i) * 10))) || 10;

      hours.push({
        time: timeStr,
        temperature: temp,
        feelsLike: feelsLike,
        humidity: humidity,
        windSpeed: wind,
        rainProb: rainProb
      });
    }
    return hours;
  }, [currentDistrict]);

  // 7-Day Forecast Trend
  const sevenDayData = useMemo(() => {
    if (!currentDistrict) return [];
    const baseTemp = currentDistrict.temperatureC ?? 28;
    const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
    const tamilDays = ['இன்று', 'நாளை', 'நாள் 3', 'நாள் 4', 'நாள் 5', 'நாள் 6', 'நாள் 7'];

    return days.map((day, idx) => {
      const maxTemp = Number((baseTemp + (idx % 3) * 1.2 + 2).toFixed(1));
      const minTemp = Number((baseTemp - 5 - (idx % 2) * 1.5).toFixed(1));
      const rain = Math.round(Math.max(0, (currentDistrict.precipitationMm ?? 0) * (1 + Math.sin(idx))));

      return {
        day: language === 'ta' ? tamilDays[idx] : day,
        maxTemp,
        minTemp,
        rainfall: rain,
        humidity: Math.round((currentDistrict.relativeHumidityPct ?? 65) + Math.sin(idx) * 8)
      };
    });
  }, [currentDistrict, language]);

  // Top 10 Warmest vs Coolest Districts Comparison Bar
  const districtComparisonData = useMemo(() => {
    return [...effectiveDistricts]
      .sort((a, b) => (b.temperatureC ?? 0) - (a.temperatureC ?? 0))
      .slice(0, 10)
      .map((d) => ({
        name: d.district.length > 10 ? d.district.substring(0, 9) + '..' : d.district,
        temperature: d.temperatureC ?? 28,
        humidity: d.relativeHumidityPct ?? 65,
        wind: d.windSpeedKmh ?? 10
      }));
  }, [effectiveDistricts]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold tracking-wider uppercase backdrop-blur-xs flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              {language === 'ta' ? 'ஊடாடும் விளக்கப்படங்கள்' : 'Dynamic Meteorological Curves'}
            </span>
            <span className="text-white/80 text-xs">
              {language === 'ta' ? 'அதிநவீன பகுப்பாய்வு' : 'Recharts Synoptic Visualizer'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {language === 'ta' ? 'வானிலை போக்குகள் & ஊடாடும் வரைபடங்கள்' : 'Interactive Weather Charts & Trends'}
          </h1>
          <p className="text-sm text-white/90 leading-relaxed">
            {language === 'ta'
              ? '24 மணி நேர வெப்பநிலை வளைவுகள், 7 நாள் எதிர்கால வானிலை மாதிரிகள் மற்றும் 38 மாவட்டங்களின் ஒப்பீட்டு புள்ளிவிவரங்கள்.'
              : 'High-resolution diurnal temperature variations, multi-variable humidity-rain correlation graphs, and statewide district comparisons.'}
          </p>
        </div>

        {/* Toolbar in Banner */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/20">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setChartMode('24h')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                chartMode === '24h'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {language === 'ta' ? '24 மணி நேர போக்கு' : '24-Hour Hourly Curve'}
            </button>
            <button
              onClick={() => setChartMode('7day')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                chartMode === '7day'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {language === 'ta' ? '7 நாள் முன்னறிவிப்பு' : '7-Day Future Envelope'}
            </button>
            <button
              onClick={() => setChartMode('comparison')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                chartMode === 'comparison'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {language === 'ta' ? 'மாவட்டங்கள் ஒப்பீடு' : 'Top 10 Districts Comparison'}
            </button>
          </div>

          {/* District dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/80">{language === 'ta' ? 'மாவட்டம்:' : 'Station:'}</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/20 border border-white/30 text-white focus:outline-hidden backdrop-blur-xs cursor-pointer"
            >
              {effectiveDistricts.map((d) => (
                <option key={d.district} value={d.district} className="text-gray-900">
                  {d.district} ({d.temperatureC ?? 28}°C)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white border border-[#DDE5E1] rounded-3xl p-6 shadow-xs space-y-6">
        
        {/* Metric Switcher & Chart Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0F4F2]">
          <div>
            <div className="text-xs font-bold text-[#059669] uppercase tracking-wider">
              {selectedDistrict} Meteorological Station
            </div>
            <h2 className="text-xl font-bold text-[#17201C] mt-0.5">
              {chartMode === '24h'
                ? language === 'ta' ? '24 மணி நேர வெப்பநிலை & ஈரப்பதம் வளைவு' : '24-Hour Diurnal Thermal & Moisture Progression'
                : chartMode === '7day'
                ? language === 'ta' ? '7 நாள் அதிகபட்ச / குறைந்தபட்ச வெப்பநிலை' : '7-Day High / Low Temperature Range'
                : language === 'ta' ? 'மாநிலத்தின் 10 அதிக வெப்பமான மாவட்டங்கள்' : 'Top 10 Warmest Districts in Tamil Nadu'}
            </h2>
          </div>

          {chartMode === '24h' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveMetric('temp')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeMetric === 'temp'
                    ? 'bg-[#ECFDF5] text-[#047857] border border-[#059669] font-bold shadow-xs'
                    : 'bg-[#F8FAF9] text-[#64706A] border border-[#DDE5E1]'
                }`}
              >
                <Thermometer className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'வெப்பநிலை' : 'Thermal'}</span>
              </button>
              <button
                onClick={() => setActiveMetric('humidity')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeMetric === 'humidity'
                    ? 'bg-[#ECFDF5] text-[#047857] border border-[#059669] font-bold shadow-xs'
                    : 'bg-[#F8FAF9] text-[#64706A] border border-[#DDE5E1]'
                }`}
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'ஈரப்பதம்' : 'Moisture'}</span>
              </button>
              <button
                onClick={() => setActiveMetric('wind')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeMetric === 'wind'
                    ? 'bg-[#ECFDF5] text-[#047857] border border-[#059669] font-bold shadow-xs'
                    : 'bg-[#F8FAF9] text-[#64706A] border border-[#DDE5E1]'
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'காற்று' : 'Wind Speed'}</span>
              </button>
            </div>
          )}
        </div>

        {/* The Recharts Container */}
        <div className="w-full h-80 sm:h-96 min-h-[320px] relative">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320}>
            {chartMode === '24h' ? (
              <AreaChart data={hourlyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="feelsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5EBE8" vertical={false} />
                <XAxis dataKey="time" stroke="#64706A" fontSize={11} tickLine={false} />
                <YAxis stroke="#64706A" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '1rem',
                    border: '1px solid #DDE5E1',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                    color: '#17201C'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

                {activeMetric === 'temp' && (
                  <>
                    <Area
                      type="monotone"
                      dataKey="temperature"
                      name={language === 'ta' ? 'வெப்பநிலை (°C)' : 'Observed Temp (°C)'}
                      stroke="#059669"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#tempGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="feelsLike"
                      name={language === 'ta' ? 'உணரும் வெப்பம் (°C)' : 'Feels Like (°C)'}
                      stroke="#F59E0B"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#feelsGradient)"
                    />
                  </>
                )}

                {activeMetric === 'humidity' && (
                  <Area
                    type="monotone"
                    dataKey="humidity"
                    name={language === 'ta' ? 'ஈரப்பதம் (%)' : 'Relative Humidity (%)'}
                    stroke="#3B82F6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#humidityGradient)"
                  />
                )}

                {activeMetric === 'wind' && (
                  <Area
                    type="monotone"
                    dataKey="windSpeed"
                    name={language === 'ta' ? 'காற்றின் வேகம் (km/h)' : 'Wind Velocity (km/h)'}
                    stroke="#0D9488"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#tempGradient)"
                  />
                )}
              </AreaChart>
            ) : chartMode === '7day' ? (
              <BarChart data={sevenDayData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5EBE8" vertical={false} />
                <XAxis dataKey="day" stroke="#64706A" fontSize={11} tickLine={false} />
                <YAxis stroke="#64706A" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '1rem',
                    border: '1px solid #DDE5E1',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar
                  dataKey="maxTemp"
                  name={language === 'ta' ? 'அதிகபட்ச வெப்பநிலை (°C)' : 'Max Temp (°C)'}
                  fill="#EF4444"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="minTemp"
                  name={language === 'ta' ? 'குறைந்தபட்ச வெப்பநிலை (°C)' : 'Min Temp (°C)'}
                  fill="#059669"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            ) : (
              <BarChart data={districtComparisonData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5EBE8" vertical={false} />
                <XAxis dataKey="name" stroke="#64706A" fontSize={11} tickLine={false} />
                <YAxis stroke="#64706A" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '1rem',
                    border: '1px solid #DDE5E1',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar
                  dataKey="temperature"
                  name={language === 'ta' ? 'வெப்பநிலை (°C)' : 'Surface Temp (°C)'}
                  fill="#059669"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Footer Statistics */}
        {currentDistrict && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#F0F4F2]">
            <div className="p-3 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1]">
              <div className="text-[11px] text-[#64706A] font-semibold">{language === 'ta' ? 'தற்போதைய வெப்பநிலை' : 'Current Temp'}</div>
              <div className="text-xl font-bold text-[#17201C] mt-0.5">{currentDistrict.temperatureC ?? 28}°C</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1]">
              <div className="text-[11px] text-[#64706A] font-semibold">{language === 'ta' ? 'ஈரப்பதம்' : 'Relative Humidity'}</div>
              <div className="text-xl font-bold text-[#17201C] mt-0.5">{currentDistrict.relativeHumidityPct ?? 65}%</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1]">
              <div className="text-[11px] text-[#64706A] font-semibold">{language === 'ta' ? 'காற்றின் வேகம்' : 'Wind Speed'}</div>
              <div className="text-xl font-bold text-[#17201C] mt-0.5">{currentDistrict.windSpeedKmh ?? 12} km/h</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1]">
              <div className="text-[11px] text-[#64706A] font-semibold">{language === 'ta' ? 'மழைப்பொழிவு' : 'Precipitation'}</div>
              <div className="text-xl font-bold text-[#17201C] mt-0.5">{currentDistrict.precipitationMm ?? 0} mm</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
