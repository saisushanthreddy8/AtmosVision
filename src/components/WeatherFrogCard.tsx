import React, { useState } from 'react';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSun, 
  CloudLightning, 
  Wind, 
  Droplets, 
  Gauge, 
  Eye, 
  Compass, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Info,
  Thermometer,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { CityClimateObservation, LiveDistrictWeather } from '../types';

interface WeatherFrogCardProps {
  locationName?: string;
  districtName?: string;
  observation?: CityClimateObservation;
  liveWeather?: LiveDistrictWeather | null;
  className?: string;
  onSelectDistrict?: () => void;
}

export const WeatherFrogCard: React.FC<WeatherFrogCardProps> = ({
  locationName = 'Chennai',
  districtName = 'Chennai',
  observation,
  liveWeather,
  className = '',
  onSelectDistrict
}) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [selectedHourIdx, setSelectedHourIdx] = useState<number>(0);

  // Base observation variables (Prioritize real-time Live Weather if provided)
  const baseTemp = liveWeather
    ? Math.round(liveWeather.temperatureC)
    : observation
    ? Math.round(observation.temperatureC)
    : 28;
  const baseRh = liveWeather
    ? liveWeather.relativeHumidityPct
    : observation
    ? observation.relativeHumidityPct
    : 68;
  const baseWind = liveWeather
    ? Math.round(liveWeather.windSpeedKmh)
    : observation
    ? Math.round(observation.windSpeedMs * 3.6)
    : 18;
  const baseWindDir = liveWeather
    ? liveWeather.windDirectionDeg
    : observation
    ? observation.windDirectionDeg
    : 65;
  const basePressure = liveWeather
    ? liveWeather.surfacePressureHpa
    : observation
    ? observation.surfacePressureHpa
    : 1012.4;
  const baseWeatherType = liveWeather
    ? liveWeather.weatherType
    : observation?.derivedCondition?.weatherType || 'clear';

  // Dynamic 7-Day Extended Meteorological Forecast based on current date
  const fullDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  
  const sevenDayForecast = liveWeather?.daily7d && liveWeather.daily7d.length >= 7
    ? liveWeather.daily7d.map((d, idx) => {
        const targetDate = new Date();
        targetDate.setDate(now.getDate() + idx);
        const dayOfWeekShort = fullDayNames[targetDate.getDay()];
        const label = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : `Day ${idx + 1}`;

        return {
          dayIndex: idx,
          label: label,
          dayShort: dayOfWeekShort,
          high: Math.round(d.maxTempC),
          low: Math.round(d.minTempC),
          type: (d.weatherType === 'rain' ? 'rain' : d.weatherType === 'hot' ? 'sunny' : d.weatherType === 'cool' ? 'partly-cloudy' : 'sunny') as 'sunny' | 'partly-cloudy' | 'cloudy' | 'rain' | 'storm',
          precipPct: d.precipitationProbMax,
          summary: d.weatherCondition,
          windKmh: baseWind,
          humidity: baseRh
        };
      })
    : Array.from({ length: 7 }).map((_, idx) => {
        const targetDate = new Date();
        targetDate.setDate(now.getDate() + idx);
        const dayOfWeekShort = fullDayNames[targetDate.getDay()];
        const label = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : `Day ${idx + 1}`;

        const offset = Math.sin(idx * 1.25) * 2.5;
        const high = Math.round(baseTemp + 4 + offset);
        const low = Math.round(Math.max(10, baseTemp - 4 + offset * 0.5));
        
        let type: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rain' | 'storm' = 'partly-cloudy';
        let precip = 15;
        let summary = 'Partly Cloudy · Pleasant';

        if (baseWeatherType === 'rain' || (idx % 3 === 1)) {
          type = idx % 2 === 0 ? 'rain' : 'storm';
          precip = 75 + (idx % 3) * 8;
          summary = type === 'storm' ? 'Convective Thunderstorms' : 'Monsoonal Rain Showers';
        } else if (baseTemp > 34 || idx % 4 === 0) {
          type = 'sunny';
          precip = 5;
          summary = 'Clear Skies · High UV';
        } else if (idx % 2 === 0) {
          type = 'cloudy';
          precip = 35;
          summary = 'Overcast · Light Sea Breeze';
        }

        return {
          dayIndex: idx,
          label,
          dayShort: dayOfWeekShort,
          high,
          low,
          type,
          precipPct: precip,
          summary,
          windKmh: Math.round(Math.max(6, baseWind + Math.sin(idx * 1.5) * 6)),
          humidity: Math.round(Math.min(95, Math.max(30, baseRh + Math.cos(idx * 1.3) * 12)))
        };
      });

  const selectedDay = sevenDayForecast[selectedDayIdx] || sevenDayForecast[0];

  // Dynamic 24-Hour Diurnal Timeline specific to the SELECTED DAY
  const hourlyData = [
    {
      hour: selectedDayIdx === 0 ? 'Now' : '00:00',
      hourDesc: 'Midnight Baseline',
      temp: Math.round(selectedDay.low + (selectedDay.high - selectedDay.low) * 0.15),
      rh: Math.min(98, selectedDay.humidity + 12),
      rainPct: selectedDay.precipPct > 40 ? Math.max(20, selectedDay.precipPct - 15) : Math.max(5, selectedDay.precipPct - 5),
      type: selectedDay.type === 'rain' || selectedDay.type === 'storm' ? 'cloudy' : (selectedDay.type === 'sunny' ? 'clear' : 'partly-cloudy'),
      wind: Math.max(5, selectedDay.windKmh - 4)
    },
    {
      hour: selectedDayIdx === 0 ? '+3h' : '03:00',
      hourDesc: 'Early Morning Low',
      temp: selectedDay.low,
      rh: Math.min(99, selectedDay.humidity + 18),
      rainPct: selectedDay.precipPct > 40 ? selectedDay.precipPct - 5 : selectedDay.precipPct,
      type: selectedDay.type === 'rain' ? 'rain' : 'cloudy',
      wind: Math.max(4, selectedDay.windKmh - 6)
    },
    {
      hour: selectedDayIdx === 0 ? '+6h' : '06:00',
      hourDesc: 'Sunrise Warming',
      temp: Math.round(selectedDay.low + (selectedDay.high - selectedDay.low) * 0.28),
      rh: Math.min(95, selectedDay.humidity + 8),
      rainPct: selectedDay.precipPct,
      type: selectedDay.type === 'sunny' ? 'sunny' : 'partly-cloudy',
      wind: Math.max(6, selectedDay.windKmh - 2)
    },
    {
      hour: selectedDayIdx === 0 ? '+9h' : '09:00',
      hourDesc: 'Mid-Morning Insolation',
      temp: Math.round(selectedDay.low + (selectedDay.high - selectedDay.low) * 0.68),
      rh: Math.max(25, selectedDay.humidity - 8),
      rainPct: selectedDay.precipPct,
      type: selectedDay.type,
      wind: selectedDay.windKmh + 2
    },
    {
      hour: selectedDayIdx === 0 ? '+12h' : '12:00',
      hourDesc: 'Solar Peak / Diurnal Max',
      temp: selectedDay.high,
      rh: Math.max(20, selectedDay.humidity - 18),
      rainPct: selectedDay.precipPct > 50 ? Math.min(95, selectedDay.precipPct + 10) : selectedDay.precipPct,
      type: selectedDay.type,
      wind: selectedDay.windKmh + 5
    },
    {
      hour: selectedDayIdx === 0 ? '+15h' : '15:00',
      hourDesc: 'Afternoon Convection',
      temp: Math.round(selectedDay.high - (selectedDay.high - selectedDay.low) * 0.12),
      rh: Math.max(24, selectedDay.humidity - 10),
      rainPct: selectedDay.type === 'storm' || selectedDay.type === 'rain' ? Math.min(95, selectedDay.precipPct + 15) : selectedDay.precipPct,
      type: selectedDay.type,
      wind: selectedDay.windKmh + 3
    },
    {
      hour: selectedDayIdx === 0 ? '+18h' : '18:00',
      hourDesc: 'Sunset Dissipation',
      temp: Math.round(selectedDay.low + (selectedDay.high - selectedDay.low) * 0.48),
      rh: Math.min(92, selectedDay.humidity + 5),
      rainPct: selectedDay.precipPct,
      type: selectedDay.type === 'sunny' ? 'clear' : 'partly-cloudy',
      wind: selectedDay.windKmh
    },
    {
      hour: selectedDayIdx === 0 ? '+21h' : '21:00',
      hourDesc: 'Nocturnal Cooling',
      temp: Math.round(selectedDay.low + (selectedDay.high - selectedDay.low) * 0.28),
      rh: Math.min(96, selectedDay.humidity + 10),
      rainPct: selectedDay.precipPct > 40 ? Math.max(15, selectedDay.precipPct - 15) : selectedDay.precipPct,
      type: selectedDay.type === 'sunny' ? 'clear' : 'cloudy',
      wind: Math.max(6, selectedDay.windKmh - 3)
    },
  ];

  const activeHour = hourlyData[selectedHourIdx] || hourlyData[0];

  // Active displayed conditions (tracks selected day and selected hour)
  const currentTemp = activeHour.temp;
  const rhPct = activeHour.rh;
  const windSpeedKmh = activeHour.wind;
  const windDirDeg = baseWindDir;
  const pressureHpa = basePressure;
  const specificHumidity = ((rhPct / 100) * 18.5 * Math.exp((17.27 * currentTemp) / (237.7 + currentTemp)) / 10).toFixed(1);
  const weatherType = activeHour.type;
  
  const rawCondition = selectedDayIdx === 0
    ? (observation?.derivedCondition?.label || 'Active Trade Wind Surge')
    : `${selectedDay.summary} (${selectedDay.label})`;

  const conditionDesc = selectedDayIdx === 0
    ? (observation?.derivedCondition?.description || 'Stable tropical marine boundary layer with steady northeasterly airflow.')
    : `${selectedDay.summary} forecasted for ${selectedDay.label} with temperatures spanning ${selectedDay.low}°C to ${selectedDay.high}°C and ${selectedDay.precipPct}% precipitation risk.`;

  // Calculate meteorological feels-like / heat index
  const feelsLike = Math.round(
    currentTemp > 26 
      ? currentTemp + (rhPct - 50) * 0.12 + (currentTemp > 32 ? 2.5 : 1.0)
      : currentTemp - (windSpeedKmh > 20 ? 1.5 : 0)
  );

  // Dew point approximation (Magnus formula)
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * currentTemp) / (b + currentTemp)) + Math.log(Math.max(0.01, rhPct / 100));
  const dewPoint = Math.round((b * alpha) / (a - alpha));

  // Wind cardinal direction
  const getWindCardinal = (deg: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(deg / 22.5) % 16];
  };
  const windCardinal = getWindCardinal(windDirDeg);

  // Clean, High-Tech Synoptic Weather Icon Renderer
  const renderSynopticIcon = (type: string, size: 'sm' | 'md' | 'lg' | 'xl' = 'md') => {
    const sizeClasses = {
      sm: 'w-5 h-5',
      md: 'w-7 h-7',
      lg: 'w-10 h-10',
      xl: 'w-14 h-14'
    };
    const s = sizeClasses[size];

    switch (type) {
      case 'rain':
        return (
          <div className="relative flex items-center justify-center text-sky-500">
            <CloudRain className={`${s} drop-shadow-xs`} />
          </div>
        );
      case 'storm':
        return (
          <div className="relative flex items-center justify-center text-amber-500">
            <CloudLightning className={`${s} drop-shadow-xs`} />
          </div>
        );
      case 'sunny':
      case 'hot':
      case 'clear':
        return (
          <div className="relative flex items-center justify-center text-amber-500">
            <Sun className={`${s} drop-shadow-xs animate-spin-slow`} />
          </div>
        );
      case 'partly-cloudy':
        return (
          <div className="relative flex items-center justify-center text-teal-600">
            <CloudSun className={`${s} drop-shadow-xs`} />
          </div>
        );
      case 'cloudy':
      default:
        return (
          <div className="relative flex items-center justify-center text-[#64706A]">
            <Cloud className={`${s} drop-shadow-xs`} />
          </div>
        );
    }
  };

  const displayName = locationName.includes('(') ? locationName.split('(')[0].trim() : locationName;

  return (
    <div className={`rounded-3xl bg-white border border-[#DDE5E1] shadow-sm overflow-hidden font-sans text-[#17201C] ${className}`}>
      
      {/* Top Telemetry Header Bar */}
      <div className="px-6 py-4 bg-[#F8FAF9] border-b border-[#DDE5E1] flex flex-wrap items-center justify-between gap-4">
        
        {/* District & Location Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669] shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#17201C] tracking-tight">
                {displayName}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] text-[#047857] text-[11px] font-bold">
                {districtName} District
              </span>
            </div>
            <div className="text-xs text-[#64706A] flex items-center gap-2 mt-0.5">
              <span>Elev: {observation?.city?.elevationM || 16}m ASL</span>
              <span>·</span>
              <span className="text-[#17201C] font-mono font-medium">
                {observation?.city?.lat.toFixed(2) || '13.08'}°N, {observation?.city?.lon.toFixed(2) || '80.27'}°E
              </span>
            </div>
          </div>
        </div>

        {/* Live Status Pill & Quick Change Action */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#DDE5E1] text-xs">
            <span className={`w-2 h-2 rounded-full ${liveWeather ? 'bg-[#10B981] animate-ping' : 'bg-[#059669] animate-pulse'} shadow-xs shadow-[#059669]`} />
            <span className="text-[#17201C] font-semibold">
              {liveWeather
                ? (selectedDayIdx === 0 ? `Live Telemetry (${liveWeather.updatedAt})` : `${selectedDay.label} Live Forecast`)
                : (selectedDayIdx === 0 ? 'ERA5 Synoptic Telemetry (Today)' : `${selectedDay.label} Forecast (${selectedDay.dayShort})`)}
            </span>
          </div>

          {selectedDayIdx !== 0 && (
            <button
              onClick={() => {
                setSelectedDayIdx(0);
                setSelectedHourIdx(0);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#D1FAE5] text-xs font-bold text-[#047857] transition flex items-center gap-1 shadow-xs"
            >
              <span>Back to Today</span>
            </button>
          )}

          {onSelectDistrict && (
            <button
              onClick={onSelectDistrict}
              className="px-3 py-1.5 rounded-xl bg-[#F8FAF9] hover:bg-[#E8F0EC] border border-[#DDE5E1] text-xs font-bold text-[#17201C] transition flex items-center gap-1"
            >
              <span>Switch Station</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Main Meteorological Dashboard Panel */}
      <div className="p-6 sm:p-7 space-y-6">
        
        {/* Core Current Weather Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Big Temperature Display & Primary Synoptic State */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1]">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-white border border-[#DDE5E1] shadow-xs">
                {renderSynopticIcon(weatherType, 'xl')}
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl sm:text-7xl font-black tracking-tight text-[#17201C] leading-none">
                    {currentTemp}°
                  </span>
                  <span className="text-2xl font-bold text-[#64706A]">C</span>
                </div>
                <div className="text-xs text-[#64706A] font-medium mt-1">
                  Feels like <strong className="text-[#17201C]">{feelsLike}°C</strong> · Dew pt: <strong className="text-[#17201C]">{dewPoint}°C</strong>
                </div>
              </div>
            </div>

            <div className="sm:border-l sm:border-[#DDE5E1] sm:pl-5 space-y-1">
              <div className="text-xs font-bold text-[#059669] uppercase tracking-wider">
                Current Condition
              </div>
              <div className="text-base sm:text-lg font-bold text-[#17201C] leading-snug">
                {rawCondition}
              </div>
              <p className="text-xs text-[#64706A] line-clamp-2">
                {conditionDesc}
              </p>
            </div>
          </div>

          {/* Right Column: 6 Physical Climate Sensors Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            
            {/* Relative Humidity */}
            <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] space-y-1">
              <div className="flex items-center justify-between text-[#64706A] text-[11px] font-medium">
                <span>Humidity</span>
                <Droplets className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <div className="text-lg font-bold text-[#17201C]">
                {rhPct} <span className="text-xs font-normal text-[#64706A]">%</span>
              </div>
              <div className="text-[10px] text-[#64706A] font-mono">
                q = {specificHumidity} g/kg
              </div>
            </div>

            {/* Wind Speed & Direction */}
            <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] space-y-1">
              <div className="flex items-center justify-between text-[#64706A] text-[11px] font-medium">
                <span>Wind Flow</span>
                <Wind className="w-3.5 h-3.5 text-[#059669]" />
              </div>
              <div className="text-lg font-bold text-[#047857]">
                {windSpeedKmh} <span className="text-xs font-normal text-[#64706A]">km/h</span>
              </div>
              <div className="text-[10px] text-[#64706A]">
                {windCardinal} ({windDirDeg}°) · {observation?.windSpeedMs.toFixed(1) || '5.1'} m/s
              </div>
            </div>

            {/* Surface Pressure */}
            <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] space-y-1">
              <div className="flex items-center justify-between text-[#64706A] text-[11px] font-medium">
                <span>Pressure</span>
                <Gauge className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <div className="text-lg font-bold text-[#17201C]">
                {pressureHpa} <span className="text-xs font-normal text-[#64706A]">hPa</span>
              </div>
              <div className="text-[10px] text-[#047857] font-semibold">
                Steady barometric field
              </div>
            </div>

            {/* UV Index / Solar Heat */}
            <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] space-y-1">
              <div className="flex items-center justify-between text-[#64706A] text-[11px] font-medium">
                <span>UV Radiation</span>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-lg font-bold text-amber-700">
                {currentTemp > 34 ? '9 Very High' : '6 Moderate'}
              </div>
              <div className="text-[10px] text-[#64706A]">
                Peak solar solar flux
              </div>
            </div>

            {/* Visibility & Cloud Cover */}
            <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] space-y-1">
              <div className="flex items-center justify-between text-[#64706A] text-[11px] font-medium">
                <span>Visibility</span>
                <Eye className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-[#17201C]">
                10 <span className="text-xs font-normal text-[#64706A]">km</span>
              </div>
              <div className="text-[10px] text-[#64706A]">
                Clear boundary layer
              </div>
            </div>

            {/* Rain Probability */}
            <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] space-y-1">
              <div className="flex items-center justify-between text-[#64706A] text-[11px] font-medium">
                <span>Precipitation</span>
                <CloudRain className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <div className="text-lg font-bold text-sky-700">
                {weatherType === 'rain' ? '85%' : '15%'}
              </div>
              <div className="text-[10px] text-[#64706A]">
                {weatherType === 'rain' ? 'High convective rain' : 'Low precipitation risk'}
              </div>
            </div>

          </div>

        </div>

        {/* 24-Hour Diurnal Timeline (Hourly Forecast) */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#17201C] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#059669]" />
              <span>24-Hour Diurnal Forecast & Wind Vector Timeline</span>
              <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] text-[#047857] text-[10px] font-extrabold normal-case tracking-normal">
                {selectedDay.label} ({selectedDay.dayShort})
              </span>
            </span>
            <span className="text-[11px] text-[#64706A] font-normal">Click any 3-hour interval to inspect hourly sensor fields</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {hourlyData.map((h, idx) => {
              const isHourSelected = selectedHourIdx === idx;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedHourIdx(idx)}
                  className={`p-3 rounded-2xl border transition-all text-center flex flex-col items-center justify-between space-y-2 cursor-pointer ${
                    isHourSelected 
                      ? 'bg-[#ECFDF5] border-[#059669] shadow-sm ring-2 ring-[#059669]/30 scale-[1.02]' 
                      : 'bg-[#F8FAF9] border-[#DDE5E1] hover:border-[#059669] hover:bg-white'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className={`text-xs font-black ${isHourSelected ? 'text-[#047857]' : 'text-[#64706A]'}`}>
                      {h.hour}
                    </span>
                    {isHourSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mt-0.5" />
                    )}
                  </div>

                  <div className="my-1">
                    {renderSynopticIcon(h.type, 'sm')}
                  </div>
                  <div className="text-base font-black text-[#17201C]">{h.temp}°</div>
                  
                  {/* Moisture / Rain indicator */}
                  <div className="w-full flex items-center justify-center gap-1 text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-100 rounded-md py-0.5">
                    <Droplets className="w-2.5 h-2.5" />
                    <span>{h.rainPct}%</span>
                  </div>

                  <div className="text-[10px] text-[#64706A] flex items-center gap-0.5">
                    <Wind className="w-2.5 h-2.5 text-[#059669]" />
                    <span>{h.wind}k</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 7-Day Extended Synoptic Forecast Matrix */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#17201C] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#059669]" />
              <span>7-Day Synoptic Extended Forecast</span>
            </span>
            <span className="text-[11px] text-[#059669] font-bold">Click any day to dynamically update 24-hour diurnal profile</span>
          </div>

          {/* 7 Day Rows */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-2.5">
            {sevenDayForecast.map((day, idx) => {
              const isSelected = selectedDayIdx === idx;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedDayIdx(idx);
                    setSelectedHourIdx(idx === 0 ? 0 : 4); // Default to noon peak on forecast days
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-[#ECFDF5] border-[#059669] shadow-sm ring-2 ring-[#059669]/40 scale-[1.01]'
                      : 'bg-[#F8FAF9] border-[#DDE5E1] hover:bg-white hover:border-[#059669]'
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-[#17201C]">{day.label}</div>
                      <div className="text-[10px] text-[#64706A]">{day.dayShort}</div>
                    </div>
                    {renderSynopticIcon(day.type, 'sm')}
                  </div>

                  {/* Weather Condition Text */}
                  <div className="text-[11px] font-semibold text-[#17201C] leading-tight">
                    {day.summary}
                  </div>

                  {/* High/Low Temperature Bar with Visual Gradient */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[#64706A]">{day.low}°</span>
                      <span className="text-[#17201C] font-extrabold">{day.high}°</span>
                    </div>

                    {/* Gradient Thermal Bar */}
                    <div className="w-full h-1.5 rounded-full bg-[#E8F0EC] overflow-hidden flex">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400"
                        style={{
                          marginLeft: `${Math.max(5, (day.low - 10) * 2.5)}%`,
                          width: `${Math.min(90, (day.high - day.low) * 7)}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Bottom Precipitation & Wind Badges */}
                  <div className="pt-1 flex items-center justify-between text-[10px] border-t border-[#DDE5E1]">
                    <span className="text-sky-600 font-bold flex items-center gap-0.5">
                      <Droplets className="w-2.5 h-2.5" />
                      {day.precipPct}%
                    </span>
                    <span className="text-[#64706A] flex items-center gap-0.5">
                      <Wind className="w-2.5 h-2.5 text-[#059669]" />
                      {day.windKmh} km/h
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Selected Day Expanded Detail Strip */}
          <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white border border-[#D1FAE5] text-[#059669]">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#17201C]">{selectedDay.label} Atmospheric Outlook:</span>{' '}
                <span className="text-[#64706A]">{selectedDay.summary} with daytime temperature reaching {selectedDay.high}°C and nocturnal low of {selectedDay.low}°C.</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[#64706A] flex-shrink-0">
              <span>Precipitation probability: <strong className="text-sky-600">{selectedDay.precipPct}%</strong></span>
              <span>·</span>
              <span>RH: <strong className="text-[#17201C] font-semibold">{selectedDay.humidity}%</strong></span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
