import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Thermometer,
  Wind,
  Droplets,
  Gauge,
  MapPin,
  ArrowUpDown,
  Search,
  ShieldAlert,
  Sun,
  CloudRain,
  Mountain,
  Waves,
  Flame,
  Snowflake,
  Info,
  ChevronRight,
  Filter
} from 'lucide-react';
import { LiveDistrictWeather, LiveStatewideSummary } from '../types';
import { CITIES_TAMIL_NADU } from '../data/cities';

interface LiveAnalyticsProps {
  liveDistrictData: LiveDistrictWeather[];
  liveSummary: LiveStatewideSummary | null;
  onSelectDistrict?: (districtName: string) => void;
}

type SortField = 'temperatureC' | 'apparentTempC' | 'relativeHumidityPct' | 'windSpeedKmh' | 'surfacePressureHpa' | 'district';

export const LiveAnalytics: React.FC<LiveAnalyticsProps> = ({
  liveDistrictData,
  liveSummary,
  onSelectDistrict
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<'all' | 'western-ghats' | 'coastal' | 'interior-plains' | 'northern-plateau' | 'southern-tip'>('all');
  const [sortField, setSortField] = useState<SortField>('temperatureC');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort districts
  const processedDistricts = useMemo(() => {
    let list = [...liveDistrictData];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.district.toLowerCase().includes(q) ||
          d.cityName.toLowerCase().includes(q) ||
          d.weatherCondition.toLowerCase().includes(q)
      );
    }

    if (regionFilter !== 'all') {
      list = list.filter((d) => d.regionType === regionFilter);
    }

    list.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return list;
  }, [liveDistrictData, searchQuery, regionFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder(field === 'district' ? 'asc' : 'desc');
    }
  };

  // Microclimate clusters stats
  const microclimateStats = useMemo(() => {
    const clusters: { [key: string]: { count: number; avgTemp: number; avgRh: number; avgWind: number; minTemp: number; maxTemp: number } } = {
      'western-ghats': { count: 0, avgTemp: 0, avgRh: 0, avgWind: 0, minTemp: 99, maxTemp: -99 },
      'coastal': { count: 0, avgTemp: 0, avgRh: 0, avgWind: 0, minTemp: 99, maxTemp: -99 },
      'interior-plains': { count: 0, avgTemp: 0, avgRh: 0, avgWind: 0, minTemp: 99, maxTemp: -99 },
      'northern-plateau': { count: 0, avgTemp: 0, avgRh: 0, avgWind: 0, minTemp: 99, maxTemp: -99 },
      'southern-tip': { count: 0, avgTemp: 0, avgRh: 0, avgWind: 0, minTemp: 99, maxTemp: -99 }
    };

    liveDistrictData.forEach((d) => {
      const c = clusters[d.regionType];
      if (c) {
        c.count++;
        c.avgTemp += d.temperatureC;
        c.avgRh += d.relativeHumidityPct;
        c.avgWind += d.windSpeedKmh;
        if (d.temperatureC < c.minTemp) c.minTemp = d.temperatureC;
        if (d.temperatureC > c.maxTemp) c.maxTemp = d.temperatureC;
      }
    });

    Object.keys(clusters).forEach((k) => {
      const c = clusters[k];
      if (c.count > 0) {
        c.avgTemp = Number((c.avgTemp / c.count).toFixed(1));
        c.avgRh = Math.round(c.avgRh / c.count);
        c.avgWind = Number((c.avgWind / c.count).toFixed(1));
      }
    });

    return clusters;
  }, [liveDistrictData]);

  // Extreme Weather & Heat Index Alerts
  const extremeDistricts = useMemo(() => {
    const hottest = [...liveDistrictData].sort((a, b) => b.temperatureC - a.temperatureC).slice(0, 3);
    const coolest = [...liveDistrictData].sort((a, b) => a.temperatureC - b.temperatureC).slice(0, 3);
    const windiest = [...liveDistrictData].sort((a, b) => b.windSpeedKmh - a.windSpeedKmh).slice(0, 3);
    const rainAlerts = liveDistrictData.filter((d) => d.weatherType === 'rain' || d.precipitationMm > 0.1);
    return { hottest, coolest, windiest, rainAlerts };
  }, [liveDistrictData]);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17201C] tracking-tight">
              Live Statewide Weather Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              38 Live Synoptic Stations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64706A] mt-1 font-medium">
            Real-Time Meteorological Distribution, Elevation Gradients & District Comparative Matrix
          </p>
        </div>

        <div className="text-right text-xs text-[#64706A]">
          <div>State Average: <strong className="text-[#059669] text-sm">{liveSummary?.stateAvgTempC ?? 31.4}°C</strong></div>
          <div className="text-[11px]">Synced: {liveSummary?.lastUpdated || 'Just now'} IST</div>
        </div>
      </div>

      {/* 4 Regional Microclimate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Western Ghats */}
        <div className="p-4 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase">
              <Mountain className="w-4 h-4 text-sky-600" />
              <span>Western Ghats (Highlands)</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[10px] font-bold">
              {microclimateStats['western-ghats'].count} Districts
            </span>
          </div>
          <div className="text-2xl font-black text-[#17201C]">
            {microclimateStats['western-ghats'].avgTemp}°C
            <span className="text-xs font-normal text-[#64706A] ml-1">avg</span>
          </div>
          <div className="text-xs text-[#64706A] flex justify-between">
            <span>Range: {microclimateStats['western-ghats'].minTemp}° – {microclimateStats['western-ghats'].maxTemp}°C</span>
            <span>RH: {microclimateStats['western-ghats'].avgRh}%</span>
          </div>
        </div>

        {/* Card 2: Coromandel Coast */}
        <div className="p-4 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase">
              <Waves className="w-4 h-4 text-teal-600" />
              <span>Coromandel Maritime Coast</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-bold">
              {microclimateStats['coastal'].count} Districts
            </span>
          </div>
          <div className="text-2xl font-black text-[#17201C]">
            {microclimateStats['coastal'].avgTemp}°C
            <span className="text-xs font-normal text-[#64706A] ml-1">avg</span>
          </div>
          <div className="text-xs text-[#64706A] flex justify-between">
            <span>Maritime Winds: {microclimateStats['coastal'].avgWind} km/h</span>
            <span>RH: {microclimateStats['coastal'].avgRh}%</span>
          </div>
        </div>

        {/* Card 3: Interior Plains */}
        <div className="p-4 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase">
              <Flame className="w-4 h-4 text-amber-600" />
              <span>Interior Thermal Plains</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
              {microclimateStats['interior-plains'].count} Districts
            </span>
          </div>
          <div className="text-2xl font-black text-[#17201C]">
            {microclimateStats['interior-plains'].avgTemp}°C
            <span className="text-xs font-normal text-[#64706A] ml-1">avg</span>
          </div>
          <div className="text-xs text-[#64706A] flex justify-between">
            <span>Peak: {microclimateStats['interior-plains'].maxTemp}°C</span>
            <span>RH: {microclimateStats['interior-plains'].avgRh}%</span>
          </div>
        </div>

        {/* Card 4: Northern Plateau */}
        <div className="p-4 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#059669] font-bold text-xs uppercase">
              <Sun className="w-4 h-4 text-[#059669]" />
              <span>Northern Plateau Belt</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] text-[10px] font-bold">
              {microclimateStats['northern-plateau'].count} Districts
            </span>
          </div>
          <div className="text-2xl font-black text-[#17201C]">
            {microclimateStats['northern-plateau'].avgTemp}°C
            <span className="text-xs font-normal text-[#64706A] ml-1">avg</span>
          </div>
          <div className="text-xs text-[#64706A] flex justify-between">
            <span>Winds: {microclimateStats['northern-plateau'].avgWind} km/h</span>
            <span>RH: {microclimateStats['northern-plateau'].avgRh}%</span>
          </div>
        </div>

      </div>

      {/* Live Extreme Leaders & Alerts Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Warmest Districts */}
        <div className="p-4 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm space-y-2.5">
          <div className="text-xs font-extrabold text-[#17201C] flex items-center gap-1.5 uppercase">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Top Warmest Districts</span>
          </div>
          <div className="space-y-1.5">
            {extremeDistricts.hottest.map((d, idx) => (
              <div
                key={d.cityId}
                onClick={() => onSelectDistrict && onSelectDistrict(d.district)}
                className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAF9] hover:bg-amber-50/60 border border-[#DDE5E1] cursor-pointer text-xs transition"
              >
                <div className="flex items-center gap-2 font-bold text-[#17201C]">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] flex items-center justify-center font-black">
                    {idx + 1}
                  </span>
                  <span>{d.district}</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-amber-600">{d.temperatureC.toFixed(1)}°C</span>
                  <span className="text-[10px] text-[#64706A] ml-1.5">Feels {d.apparentTempC.toFixed(1)}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coolest Districts */}
        <div className="p-4 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm space-y-2.5">
          <div className="text-xs font-extrabold text-[#17201C] flex items-center gap-1.5 uppercase">
            <Snowflake className="w-4 h-4 text-sky-500" />
            <span>Top Coolest Districts</span>
          </div>
          <div className="space-y-1.5">
            {extremeDistricts.coolest.map((d, idx) => (
              <div
                key={d.cityId}
                onClick={() => onSelectDistrict && onSelectDistrict(d.district)}
                className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAF9] hover:bg-sky-50/60 border border-[#DDE5E1] cursor-pointer text-xs transition"
              >
                <div className="flex items-center gap-2 font-bold text-[#17201C]">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 text-[10px] flex items-center justify-center font-black">
                    {idx + 1}
                  </span>
                  <span>{d.district}</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-sky-600">{d.temperatureC.toFixed(1)}°C</span>
                  <span className="text-[10px] text-[#64706A] ml-1.5">Elev {d.elevationM}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Windiest & Rainfall Alerts */}
        <div className="p-4 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm space-y-2.5">
          <div className="text-xs font-extrabold text-[#17201C] flex items-center gap-1.5 uppercase">
            <Wind className="w-4 h-4 text-[#059669]" />
            <span>High Wind & Precip Stations</span>
          </div>
          <div className="space-y-1.5">
            {extremeDistricts.windiest.map((d, idx) => (
              <div
                key={d.cityId}
                onClick={() => onSelectDistrict && onSelectDistrict(d.district)}
                className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAF9] hover:bg-emerald-50/60 border border-[#DDE5E1] cursor-pointer text-xs transition"
              >
                <div className="flex items-center gap-2 font-bold text-[#17201C]">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-black">
                    {idx + 1}
                  </span>
                  <span>{d.district}</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-[#047857]">{d.windSpeedKmh.toFixed(1)} km/h</span>
                  <span className="text-[10px] text-[#64706A] ml-1.5">{d.windDirectionDeg}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Complete 38-District Live Telemetry Table */}
      <div className="bg-white border border-[#DDE5E1] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#059669]" />
            <h2 className="text-lg sm:text-xl font-extrabold text-[#17201C] tracking-tight">
              38-District Real-Time Telemetry Matrix
            </h2>
            <span className="text-xs text-[#64706A] font-semibold">({processedDistricts.length} reporting)</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#64706A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] text-xs text-[#17201C] placeholder-[#64706A] focus:outline-none focus:border-[#059669]"
              />
            </div>

            {/* Region Filter */}
            <div className="flex items-center bg-[#F8FAF9] p-0.5 rounded-xl border border-[#DDE5E1] text-xs">
              <button
                onClick={() => setRegionFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${regionFilter === 'all' ? 'bg-white text-[#059669] shadow-xs' : 'text-[#64706A]'}`}
              >
                All 38
              </button>
              <button
                onClick={() => setRegionFilter('western-ghats')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${regionFilter === 'western-ghats' ? 'bg-white text-sky-700 shadow-xs' : 'text-[#64706A]'}`}
              >
                Highlands
              </button>
              <button
                onClick={() => setRegionFilter('coastal')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${regionFilter === 'coastal' ? 'bg-white text-teal-700 shadow-xs' : 'text-[#64706A]'}`}
              >
                Coast
              </button>
              <button
                onClick={() => setRegionFilter('interior-plains')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${regionFilter === 'interior-plains' ? 'bg-white text-amber-700 shadow-xs' : 'text-[#64706A]'}`}
              >
                Plains
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#DDE5E1]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAF9] border-b border-[#DDE5E1] text-[#64706A] font-bold uppercase text-[10px]">
                <th onClick={() => handleSort('district')} className="p-3.5 cursor-pointer hover:text-[#17201C]">
                  <div className="flex items-center gap-1.5">
                    <span>District / Station</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('temperatureC')} className="p-3.5 cursor-pointer hover:text-[#17201C]">
                  <div className="flex items-center gap-1.5">
                    <span>Live Temp</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('apparentTempC')} className="p-3.5 cursor-pointer hover:text-[#17201C] hidden sm:table-cell">
                  <div className="flex items-center gap-1.5">
                    <span>Feels Like</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('relativeHumidityPct')} className="p-3.5 cursor-pointer hover:text-[#17201C]">
                  <div className="flex items-center gap-1.5">
                    <span>Humidity</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('windSpeedKmh')} className="p-3.5 cursor-pointer hover:text-[#17201C]">
                  <div className="flex items-center gap-1.5">
                    <span>Wind Speed</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('surfacePressureHpa')} className="p-3.5 cursor-pointer hover:text-[#17201C] hidden md:table-cell">
                  <div className="flex items-center gap-1.5">
                    <span>Pressure</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5">Condition</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE5E1]">
              {processedDistricts.map((d) => (
                <tr
                  key={d.cityId}
                  className="hover:bg-[#ECFDF5]/50 transition cursor-pointer group"
                  onClick={() => onSelectDistrict && onSelectDistrict(d.district)}
                >
                  <td className="p-3.5 font-bold text-[#17201C]">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        d.temperatureC <= 20 ? 'bg-sky-500' :
                        d.temperatureC >= 33 ? 'bg-amber-500' :
                        'bg-[#059669]'
                      }`} />
                      <div>
                        <div>{d.district}</div>
                        <div className="text-[10px] text-[#64706A] font-normal">
                          {d.regionType.replace('-', ' ')} · {d.elevationM}m ASL
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 font-extrabold text-sm text-[#17201C]">
                    <span className={
                      d.temperatureC <= 20 ? 'text-sky-700' :
                      d.temperatureC >= 33 ? 'text-amber-700' :
                      'text-[#17201C]'
                    }>
                      {d.temperatureC.toFixed(1)}°C
                    </span>
                  </td>

                  <td className="p-3.5 text-[#64706A] hidden sm:table-cell">
                    {d.apparentTempC.toFixed(1)}°C
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-sky-600" />
                      <span className="font-bold text-[#17201C]">{d.relativeHumidityPct}%</span>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-[#059669]" />
                      <span className="font-bold text-[#17201C]">{d.windSpeedKmh.toFixed(1)} km/h</span>
                    </div>
                  </td>

                  <td className="p-3.5 font-mono text-[11px] text-[#64706A] hidden md:table-cell">
                    {d.surfacePressureHpa.toFixed(0)} hPa
                  </td>

                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-[#F8FAF9] border border-[#DDE5E1] text-[11px] font-bold text-[#17201C] whitespace-nowrap">
                      {d.weatherCondition}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectDistrict) onSelectDistrict(d.district);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#047857] text-[11px] font-bold transition inline-flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
