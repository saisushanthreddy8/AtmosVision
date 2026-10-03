import React, { useState, useMemo } from 'react';
import {
  Sprout,
  Layers,
  Droplets,
  Thermometer,
  Sun,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Search,
  MapPin,
  CheckCircle2,
  Calendar,
  Compass,
  Info,
  Beaker,
  Award,
  TrendingUp,
  CloudRain
} from 'lucide-react';
import { CITIES_TAMIL_NADU } from '../data/cities';
import { getDistrictAgroProfile, DistrictAgroProfile, CropSuggestion } from '../data/districtAgroData';
import { LiveDistrictWeather } from '../types';

interface DistrictAgroAdvisoryProps {
  selectedDistrictName: string;
  onSelectDistrict?: (districtName: string) => void;
  liveDistrictData?: LiveDistrictWeather[];
}

export const DistrictAgroAdvisory: React.FC<DistrictAgroAdvisoryProps> = ({
  selectedDistrictName,
  onSelectDistrict,
  liveDistrictData = []
}) => {
  const [activeTab, setActiveTab] = useState<'crops' | 'soil' | 'advisory'>('crops');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Find active city
  const activeCity = useMemo(() => {
    const q = selectedDistrictName.toLowerCase();
    return (
      CITIES_TAMIL_NADU.find(
        (c) =>
          c.district.toLowerCase() === q ||
          c.name.toLowerCase().includes(q) ||
          q.includes(c.district.toLowerCase())
      ) || CITIES_TAMIL_NADU[0]
    );
  }, [selectedDistrictName]);

  // Live weather for active district
  const liveWeather = useMemo(() => {
    if (!liveDistrictData || liveDistrictData.length === 0) return null;
    const q = activeCity.district.toLowerCase();
    return (
      liveDistrictData.find(
        (d) =>
          (d.district && d.district.toLowerCase() === q) ||
          (d.cityName && d.cityName.toLowerCase().includes(q))
      ) || null
    );
  }, [liveDistrictData, activeCity]);

  // Agro profile for active district
  const agroProfile: DistrictAgroProfile = useMemo(() => {
    return getDistrictAgroProfile(activeCity.district);
  }, [activeCity]);

  // Filtered districts for quick switcher
  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return CITIES_TAMIL_NADU;
    const q = searchQuery.toLowerCase();
    return CITIES_TAMIL_NADU.filter(
      (c) => c.name.toLowerCase().includes(q) || c.district.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Current live temperature and humidity
  const liveTemp = liveWeather ? liveWeather.temperatureC : 28.5;
  const liveRh = liveWeather ? liveWeather.relativeHumidityPct : 60;

  // Water need badge color helper
  const getWaterBadgeColor = (need: string) => {
    switch (need) {
      case 'Very High':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'High':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Moderate':
        return 'bg-emerald-100 text-[#047857] border-emerald-200';
      case 'Low':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  // Weather Suitability evaluator for crop
  const evaluateCropSuitability = (crop: CropSuggestion) => {
    const [minT, maxT] = crop.idealTempRangeC;
    const isTempIdeal = liveTemp >= minT - 2 && liveTemp <= maxT + 2;
    const isTempPerfect = liveTemp >= minT && liveTemp <= maxT;

    if (isTempPerfect) {
      return { status: 'Optimal Conditions', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    } else if (isTempIdeal) {
      return { status: 'Favorable Growth', color: 'text-sky-700 bg-sky-50 border-sky-200' };
    } else {
      return { status: 'Requires Microclimate Care', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    }
  };

  return (
    <div className="space-y-5 font-sans">
      
      {/* Agro-Meteorological Header Box */}
      <div className="bg-gradient-to-r from-[#ECFDF5] via-white to-[#F0FDF4] border border-[#A7F3D0] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D1FAE5] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#059669] text-white flex items-center justify-center shadow-md shadow-[#059669]/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black text-[#17201C] tracking-tight">
                  {agroProfile.district} Agricultural Soil & Crop Advisory
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] text-[10px] font-bold">
                  TNAU Calibrated
                </span>
              </div>
              <p className="text-xs text-[#64706A] mt-0.5">
                Agro-Climatic Zone: <strong className="text-[#17201C]">{agroProfile.agroZone}</strong>
              </p>
            </div>
          </div>

          {/* Real-time Live Weather Chip */}
          <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-2xl border border-[#DDE5E1] shadow-xs text-xs">
            <div className="flex items-center gap-1.5 text-[#059669] font-bold">
              <Thermometer className="w-4 h-4 text-red-500" />
              <span>{liveTemp.toFixed(1)}°C Live</span>
            </div>
            <div className="h-4 w-px bg-[#DDE5E1]" />
            <div className="flex items-center gap-1.5 text-[#64706A] font-semibold">
              <Droplets className="w-3.5 h-3.5 text-sky-500" />
              <span>{liveRh}% Humidity</span>
            </div>
          </div>
        </div>

        {/* Primary Soil Type Highlight Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
          
          <div className="md:col-span-8 p-4 rounded-2xl bg-white border border-[#DDE5E1] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold text-[#059669] uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Primary Soil Classification
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#F8FAF9] text-[#17201C] font-mono text-[10px] border border-[#DDE5E1]">
                pH {agroProfile.soilPh}
              </span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-[#17201C]">
              {agroProfile.soilType}
            </div>
            <p className="text-xs text-[#64706A] leading-relaxed">
              <strong>Texture & Aeration:</strong> {agroProfile.soilTexture}. Water retention is <strong>{agroProfile.waterRetention}</strong> with <strong>{agroProfile.organicCarbon}</strong> organic carbon.
            </p>
          </div>

          <div className="md:col-span-4 p-4 rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] shadow-xs flex flex-col justify-between space-y-2">
            <div>
              <div className="text-[10px] font-bold text-[#047857] uppercase tracking-wider flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> Irrigation & Water Source
              </div>
              <div className="text-xs font-bold text-[#17201C] mt-1">
                {agroProfile.irrigationProfile}
              </div>
            </div>
            <div className="text-[10px] text-[#065F46] pt-1 border-t border-[#D1FAE5]">
              Deficiencies: {agroProfile.majorNutrientDeficiencies.join(', ')}
            </div>
          </div>

        </div>

      </div>

      {/* Suggested Crops Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#059669]" />
            <h4 className="text-sm font-extrabold text-[#17201C] uppercase tracking-wider">
              Recommended Crops for {agroProfile.district} ({agroProfile.crops.length} Selected)
            </h4>
          </div>
          <span className="text-xs text-[#64706A] hidden sm:inline">
            Matched with Live Atmospheric Temperatures & Soil Chemistry
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agroProfile.crops.map((crop, idx) => {
            const suit = evaluateCropSuitability(crop);
            return (
              <div
                key={crop.name}
                className="bg-white border border-[#DDE5E1] hover:border-[#059669] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-3.5 group"
              >
                
                {/* Crop Title Bar */}
                <div className="flex items-start justify-between gap-2 border-b border-[#DDE5E1] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-base font-extrabold text-[#17201C] group-hover:text-[#047857] transition">
                        {crop.name}
                      </h5>
                      <span className="text-xs font-bold text-[#059669] px-2 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0]">
                        {crop.tamilName}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#64706A] mt-0.5">
                      {crop.category} · Season: <strong className="text-[#17201C]">{crop.season}</strong>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${suit.color} flex-shrink-0`}>
                    {suit.status}
                  </span>
                </div>

                {/* Key Metric Pills */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1]">
                    <div className="text-[9px] text-[#64706A] font-semibold">Water Need</div>
                    <div className="font-extrabold text-[#17201C] mt-0.5">{crop.waterNeed}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1]">
                    <div className="text-[9px] text-[#64706A] font-semibold">Ideal Temp</div>
                    <div className="font-extrabold text-[#059669] mt-0.5">{crop.idealTempRangeC[0]}-{crop.idealTempRangeC[1]}°C</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1]">
                    <div className="text-[9px] text-[#64706A] font-semibold">Harvest Cycle</div>
                    <div className="font-extrabold text-[#17201C] mt-0.5 truncate">{crop.yieldDurationDays.split(' ')[0]}</div>
                  </div>
                </div>

                {/* Soil Suitability & Agronomic Advice */}
                <div className="space-y-1.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#F0FDF4] border border-[#D1FAE5] text-[#047857] text-[11px] leading-relaxed">
                    <strong>Soil Affinity:</strong> {crop.soilSuitability}
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] text-[#17201C] text-[11px] leading-relaxed">
                    <strong>TNAU Farming Tip:</strong> {crop.agronomicTip}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Seasonal Agro-Advisory Note */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#059669]/10 to-sky-500/10 border border-amber-200 shadow-xs flex items-start gap-3 text-xs">
        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="font-extrabold text-[#17201C]">
            Live Seasonal Agricultural Advisory for {agroProfile.district}
          </div>
          <p className="text-[#64706A] mt-0.5 leading-relaxed">
            {agroProfile.currentSeasonAdvisory} Current surface observation: <strong>{liveTemp.toFixed(1)}°C</strong> with <strong>{liveRh}%</strong> ambient moisture.
          </p>
        </div>
      </div>

    </div>
  );
};
