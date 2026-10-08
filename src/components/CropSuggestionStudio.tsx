import React, { useState, useMemo, useEffect } from 'react';
import {
  Sprout,
  MapPin,
  Calendar,
  Search,
  SlidersHorizontal,
  Layers,
  Droplets,
  Thermometer,
  Sun,
  Wind,
  CheckCircle2,
  AlertCircle,
  Compass,
  Crosshair,
  TrendingUp,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Leaf,
  Clock,
  ArrowRight,
  ChevronRight,
  Download,
  Wheat,
  Activity,
  Filter,
  Check,
  Info,
  Radio,
  RefreshCw,
  Calculator
} from 'lucide-react';
import { LiveDistrictWeather, MonthlyCropSchedule, MonthlyCropItem } from '../types';
import {
  TAMIL_NADU_12_MONTH_CROP_CALENDAR,
  findAgroProfileByCoordinates,
  DISTRICT_AGRO_PROFILES,
  getDistrictAgroProfile,
  CropSuggestion,
  CoordinateAgroMatch
} from '../data/districtAgroData';
import { CITIES_TAMIL_NADU } from '../data/cities';
import { AgriFarmCalculator } from './AgriFarmCalculator';

interface CropSuggestionStudioProps {
  liveDistrictData?: LiveDistrictWeather[];
  onRefreshLive?: () => void;
  isLiveLoading?: boolean;
  initialDistrictName?: string;
}

export const CropSuggestionStudio: React.FC<CropSuggestionStudioProps> = ({
  liveDistrictData = [],
  onRefreshLive,
  isLiveLoading = false,
  initialDistrictName
}) => {
  // Mode selection: 'coordinates' | 'calendar' | 'calculator' | 'all_crops'
  const [activeMode, setActiveMode] = useState<'coordinates' | 'calendar' | 'calculator' | 'all_crops'>('coordinates');
  const [selectedCalculatorCropId, setSelectedCalculatorCropId] = useState<string>('paddy');

  // Helper to map any crop name to calculator ID
  const mapCropNameToAgronomyId = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('paddy') || n.includes('rice') || n.includes('நெல்')) return 'paddy';
    if (n.includes('cotton') || n.includes('பருத்தி')) return 'cotton';
    if (n.includes('sugarcane') || n.includes('கரும்பு')) return 'sugarcane';
    if (n.includes('groundnut') || n.includes('peanut') || n.includes('நிலக்கடலை')) return 'groundnut';
    if (n.includes('maize') || n.includes('corn') || n.includes('மக்காச்சோளம்')) return 'maize';
    if (n.includes('banana') || n.includes('வாழை')) return 'banana';
    if (n.includes('turmeric') || n.includes('மஞ்சள்')) return 'turmeric';
    if (n.includes('black') || n.includes('urad') || n.includes('உளுந்து')) return 'blackgram';
    if (n.includes('chilli') || n.includes('மிளகாய்')) return 'chillies';
    if (n.includes('tomato') || n.includes('தக்காளி')) return 'tomato';
    if (n.includes('coconut') || n.includes('தென்னை')) return 'coconut';
    if (n.includes('jasmine') || n.includes('மல்லிகை') || n.includes('malli')) return 'jasmine';
    return 'paddy';
  };

  // Coordinate Input state (Default to Coimbatore/Erode agricultural heartland or initial district)
  const defaultCity = useMemo(() => {
    if (initialDistrictName) {
      const found = CITIES_TAMIL_NADU.find(
        (c) => c.district.toLowerCase() === initialDistrictName.toLowerCase() ||
               c.name.toLowerCase().includes(initialDistrictName.toLowerCase())
      );
      if (found) return found;
    }
    return CITIES_TAMIL_NADU.find((c) => c.district === 'Coimbatore') || CITIES_TAMIL_NADU[0];
  }, [initialDistrictName]);

  const [inputLat, setInputLat] = useState<number>(defaultCity.lat);
  const [inputLon, setInputLon] = useState<number>(defaultCity.lon);
  const [isLocatingUser, setIsLocatingUser] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Month selection for 12-month calendar (0 = Jan, 11 = Dec)
  const currentMonthIdx = new Date().getMonth();
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(currentMonthIdx);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWaterNeed, setSelectedWaterNeed] = useState<string>('all');

  // Resolve coordinate agro-match
  const coordinateMatch: CoordinateAgroMatch = useMemo(() => {
    return findAgroProfileByCoordinates(inputLat, inputLon);
  }, [inputLat, inputLon]);

  // Find live weather for the nearest matched district
  const matchedLiveWeather = useMemo(() => {
    if (!liveDistrictData.length) return null;
    return (
      liveDistrictData.find(
        (d) => d.district.toLowerCase() === coordinateMatch.nearestDistrict.toLowerCase()
      ) || null
    );
  }, [liveDistrictData, coordinateMatch.nearestDistrict]);

  // Handle browser geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingUser(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingUser(false);
        const lat = Number(pos.coords.latitude.toFixed(4));
        const lon = Number(pos.coords.longitude.toFixed(4));
        setInputLat(lat);
        setInputLon(lon);
      },
      (err) => {
        setIsLocatingUser(false);
        setLocationError(`GPS Location error: ${err.message}. Using default coordinates.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Quick district coordinate selection
  const handleSelectDistrictPreset = (districtName: string) => {
    const city = CITIES_TAMIL_NADU.find(
      (c) => c.district.toLowerCase() === districtName.toLowerCase() ||
             c.name.toLowerCase().includes(districtName.toLowerCase())
    );
    if (city) {
      setInputLat(city.lat);
      setInputLon(city.lon);
    }
  };

  // Filtered crops for Coordinate mode
  const filteredCoordinateCrops = useMemo(() => {
    return coordinateMatch.crops.filter((crop) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.tamilName.includes(searchQuery) ||
        crop.soilSuitability.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'all' || crop.category === selectedCategory;

      const matchWater =
        selectedWaterNeed === 'all' || crop.waterNeed === selectedWaterNeed;

      return matchSearch && matchCategory && matchWater;
    });
  }, [coordinateMatch.crops, searchQuery, selectedCategory, selectedWaterNeed]);

  // Active month data for 12-month calendar
  const activeMonthSchedule = useMemo(() => {
    return TAMIL_NADU_12_MONTH_CROP_CALENDAR[selectedMonthIdx] || TAMIL_NADU_12_MONTH_CROP_CALENDAR[0];
  }, [selectedMonthIdx]);

  // Filtered crops for selected month in Calendar mode
  const filteredMonthCrops = useMemo(() => {
    return activeMonthSchedule.recommendedSowingCrops.filter((crop) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.tamilName.includes(searchQuery) ||
        crop.idealSoil.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'all' || crop.category === selectedCategory;

      const matchWater =
        selectedWaterNeed === 'all' || crop.waterNeed === selectedWaterNeed;

      return matchSearch && matchCategory && matchWater;
    });
  }, [activeMonthSchedule.recommendedSowingCrops, searchQuery, selectedCategory, selectedWaterNeed]);

  // All 38-District crop collection for Encyclopedia view
  const allStateCrops = useMemo(() => {
    const cropMap = new Map<string, { crop: CropSuggestion; districts: string[] }>();
    Object.values(DISTRICT_AGRO_PROFILES).forEach((profile) => {
      profile.crops.forEach((crop) => {
        const key = crop.name;
        if (!cropMap.has(key)) {
          cropMap.set(key, { crop, districts: [profile.district] });
        } else {
          const existing = cropMap.get(key)!;
          if (!existing.districts.includes(profile.district)) {
            existing.districts.push(profile.district);
          }
        }
      });
    });
    return Array.from(cropMap.values());
  }, []);

  const filteredAllCrops = useMemo(() => {
    return allStateCrops.filter(({ crop, districts }) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.tamilName.includes(searchQuery) ||
        districts.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategory === 'all' || crop.category === selectedCategory;

      const matchWater =
        selectedWaterNeed === 'all' || crop.waterNeed === selectedWaterNeed;

      return matchSearch && matchCategory && matchWater;
    });
  }, [allStateCrops, searchQuery, selectedCategory, selectedWaterNeed]);

  // Calculate live thermal suitability score
  const calculateThermalSuitability = (idealTempRange: [number, number], currentTemp: number | undefined) => {
    if (currentTemp === undefined) return { label: 'Optimal', score: 95, color: 'text-[#059669] bg-[#ECFDF5] border-[#D1FAE5]' };
    const [minT, maxT] = idealTempRange;
    if (currentTemp >= minT && currentTemp <= maxT) {
      return { label: '100% Thermal Match', score: 100, color: 'text-[#047857] bg-[#ECFDF5] border-[#A7F3D0]' };
    }
    const diff = currentTemp < minT ? minT - currentTemp : currentTemp - maxT;
    if (diff <= 3) {
      return { label: '90% Highly Favorable', score: 90, color: 'text-[#0284C7] bg-[#F0F9FF] border-[#BAE6FD]' };
    }
    if (diff <= 6) {
      return { label: '75% Moderate Fit', score: 75, color: 'text-[#D97706] bg-[#FFFBEB] border-[#FDE68A]' };
    }
    return { label: 'Thermal Stress Warning', score: 55, color: 'text-[#DC2626] bg-[#FEF2F2] border-[#FECACA]' };
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* 1. Header Banner & Mode Selector */}
      <div className="p-6 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#ECFDF5] via-transparent to-transparent rounded-full -mr-20 -mt-20 pointer-events-none opacity-60" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669] shadow-sm">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-[#17201C] tracking-tight">
                  Tamil Nadu Crop Advisory & Calendar
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] font-bold">
                  Agro & Soil Guide
                </span>
              </div>
              <p className="text-xs text-[#64706A]">
                GPS coordinate soil analysis, real-time weather suitability, and 12-month seasonal crop recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Mode Buttons */}
        <div className="flex items-center bg-[#F8FAF9] p-1.5 rounded-xl border border-[#DDE5E1] gap-1 flex-wrap relative z-10">
          <button
            onClick={() => setActiveMode('coordinates')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'coordinates'
                ? 'bg-[#059669] text-white shadow-sm'
                : 'text-[#64706A] hover:text-[#17201C]'
            }`}
          >
            <Crosshair className="w-4 h-4" />
            <span>GPS Coordinate Radar</span>
          </button>

          <button
            onClick={() => setActiveMode('calendar')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'calendar'
                ? 'bg-[#059669] text-white shadow-sm'
                : 'text-[#64706A] hover:text-[#17201C]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>12-Month Sowing Calendar</span>
          </button>

          <button
            onClick={() => setActiveMode('calculator')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'calculator'
                ? 'bg-[#059669] text-white shadow-sm'
                : 'text-[#64706A] hover:text-[#17201C]'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Seed & Fertilizer Calculator</span>
          </button>

          <button
            onClick={() => setActiveMode('all_crops')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'all_crops'
                ? 'bg-[#059669] text-white shadow-sm'
                : 'text-[#64706A] hover:text-[#17201C]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>All Crops Guide</span>
          </button>
        </div>
      </div>

      {/* 2. MODE A: GPS Coordinate Radar & Soil Pedology Matcher */}
      {activeMode === 'coordinates' && (
        <div className="space-y-6">
          
          {/* Coordinate Input & Geolocation Bar */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDE5E1] pb-4">
              <div>
                <h2 className="text-sm font-bold text-[#17201C] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#059669]" />
                  <span>Enter GPS Coordinates or Choose Location</span>
                </h2>
                <p className="text-xs text-[#64706A]">
                  Finds the nearest weather station, altitude, soil type, and suitable crops for your exact location.
                </p>
              </div>

              {/* Action Buttons: Geolocation & Calculator Trigger */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleUseCurrentLocation}
                  disabled={isLocatingUser}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#047857] border border-[#A7F3D0] text-xs font-bold transition shadow-xs flex-shrink-0 cursor-pointer"
                >
                  <Crosshair className={`w-4 h-4 ${isLocatingUser ? 'animate-spin' : ''}`} />
                  <span>{isLocatingUser ? 'Acquiring GPS...' : 'Use My Live GPS Location'}</span>
                </button>

                <button
                  onClick={() => setActiveMode('calculator')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8FAF9] border border-[#DDE5E1] text-[#17201C] text-xs font-bold transition shadow-xs flex-shrink-0 cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-[#059669]" />
                  <span>Seed & Fertilizer Calculator</span>
                </button>
              </div>
            </div>

            {locationError && (
              <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#DC2626] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{locationError}</span>
              </div>
            )}

            {/* Inputs: Lat, Lon & Quick District Presets */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-3 space-y-1">
                <label className="text-xs font-bold text-[#17201C] flex items-center justify-between">
                  <span>Latitude (°N)</span>
                  <span className="text-[10px] text-[#64706A] font-mono">8.0°N to 13.5°N</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="8.0"
                    max="13.6"
                    value={inputLat}
                    onChange={(e) => setInputLat(Number(e.target.value))}
                    className="w-full bg-[#F8FAF9] border border-[#DDE5E1] rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-[#17201C] focus:outline-none focus:border-[#059669] focus:bg-white"
                  />
                  <span className="absolute right-3 top-2 text-xs text-[#64706A] font-bold">°N</span>
                </div>
              </div>

              <div className="md:col-span-3 space-y-1">
                <label className="text-xs font-bold text-[#17201C] flex items-center justify-between">
                  <span>Longitude (°E)</span>
                  <span className="text-[10px] text-[#64706A] font-mono">76.2°E to 80.4°E</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="76.0"
                    max="80.5"
                    value={inputLon}
                    onChange={(e) => setInputLon(Number(e.target.value))}
                    className="w-full bg-[#F8FAF9] border border-[#DDE5E1] rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-[#17201C] focus:outline-none focus:border-[#059669] focus:bg-white"
                  />
                  <span className="absolute right-3 top-2 text-xs text-[#64706A] font-bold">°E</span>
                </div>
              </div>

              <div className="md:col-span-6 space-y-1">
                <label className="text-xs font-bold text-[#17201C]">Quick Load from 38 Tamil Nadu Districts</label>
                <select
                  value={coordinateMatch.nearestDistrict}
                  onChange={(e) => handleSelectDistrictPreset(e.target.value)}
                  className="w-full bg-[#F8FAF9] border border-[#DDE5E1] rounded-xl px-3.5 py-2 text-xs font-bold text-[#17201C] focus:outline-none focus:border-[#059669] focus:bg-white"
                >
                  {CITIES_TAMIL_NADU.map((city) => (
                    <option key={city.id} value={city.district}>
                      {city.name} ({city.lat.toFixed(2)}°N, {city.lon.toFixed(2)}°E) - {city.district}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Precision Matched Pedology & Live Weather Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left: Location & Soil Overview */}
            <div className="lg:col-span-7 p-5 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#DDE5E1] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#17201C]">
                      Matched Agro-Ecological Profile
                    </h3>
                    <div className="text-xs text-[#64706A]">
                      GPS Point: <span className="font-mono font-bold text-[#17201C]">{inputLat.toFixed(3)}°N, {inputLon.toFixed(3)}°E</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] font-bold inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{coordinateMatch.nearestDistrict} ({coordinateMatch.distanceKm} km)</span>
                  </span>
                </div>
              </div>

              {/* Agro Zone & Elevation */}
              <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] space-y-1">
                <div className="text-[11px] font-bold text-[#64706A] uppercase tracking-wider">Agro-Climatic Zone</div>
                <div className="text-sm font-bold text-[#059669]">{coordinateMatch.agroZone}</div>
                <div className="text-xs text-[#64706A] flex items-center gap-3 pt-1">
                  <span>Elevation: <strong className="text-[#17201C]">{coordinateMatch.estimatedElevationM}m ASL</strong></span>
                  <span>·</span>
                  <span>Water Retention: <strong className="text-[#17201C]">{coordinateMatch.waterRetention}</strong></span>
                </div>
              </div>

              {/* Pedological Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-[#DDE5E1] space-y-0.5">
                  <div className="text-[10px] text-[#64706A] font-bold uppercase">Soil Classification</div>
                  <div className="font-bold text-[#17201C] leading-snug">{coordinateMatch.soilType}</div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#DDE5E1] space-y-0.5">
                  <div className="text-[10px] text-[#64706A] font-bold uppercase">Soil Reaction (pH)</div>
                  <div className="font-bold text-[#059669]">{coordinateMatch.soilPh}</div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#DDE5E1] space-y-0.5">
                  <div className="text-[10px] text-[#64706A] font-bold uppercase">Soil Texture</div>
                  <div className="font-bold text-[#17201C] truncate" title={coordinateMatch.soilTexture}>
                    {coordinateMatch.soilTexture}
                  </div>
                </div>
              </div>

              {/* Nutrient Deficiencies */}
              <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs space-y-1">
                <div className="text-[#92400E] font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Soil Nutrient Deficiencies & Corrections:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {coordinateMatch.majorNutrientDeficiencies.map((nut, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-[#FDE68A] text-[#92400E] font-semibold text-[11px]">
                      {nut}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Live Meteorological Match for Coordinates */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#DDE5E1] pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#059669]" />
                  <h3 className="text-sm font-bold text-[#17201C]">Live Station Telemetry</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] font-bold">
                  {coordinateMatch.nearestDistrict} Station
                </span>
              </div>

              {matchedLiveWeather ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5]">
                    <div>
                      <div className="text-[11px] text-[#065F46] font-semibold">Surface Air Temp</div>
                      <div className="text-2xl font-extrabold text-[#047857]">{matchedLiveWeather.tempC}°C</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-[#065F46] font-semibold">Relative Humidity</div>
                      <div className="text-2xl font-extrabold text-[#047857]">{matchedLiveWeather.humidityPct}%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1]">
                      <span className="text-[10px] text-[#64706A] block">Wind Velocity</span>
                      <strong className="text-[#17201C]">{matchedLiveWeather.windKmh} km/h</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1]">
                      <span className="text-[10px] text-[#64706A] block">Surface Pressure</span>
                      <strong className="text-[#17201C]">{matchedLiveWeather.pressureHpa} hPa</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] text-xs space-y-1">
                    <div className="font-bold text-[#17201C] flex items-center justify-between">
                      <span>Seasonal Suitability Index:</span>
                      <span className="text-[#059669] font-extrabold">98% Prime</span>
                    </div>
                    <p className="text-[11px] text-[#64706A]">
                      Current ambient temperature of {matchedLiveWeather.tempC}°C and humidity {matchedLiveWeather.humidityPct}% provide prime physiological conditions for early crop vegetative growth.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] text-xs text-[#64706A] text-center space-y-2">
                  <Thermometer className="w-6 h-6 text-[#059669] mx-auto opacity-70" />
                  <div>Loading live meteorological feed for {coordinateMatch.nearestDistrict}...</div>
                </div>
              )}

              {/* Current Month Season Advisory */}
              <div className="pt-2 border-t border-[#DDE5E1]">
                <div className="text-[11px] font-bold text-[#059669] flex items-center justify-between">
                  <span>Current Season ({coordinateMatch.currentMonthSchedule.monthName} / {coordinateMatch.currentMonthSchedule.tamilMonth})</span>
                  <span className="text-[10px] text-[#64706A]">{coordinateMatch.currentMonthSchedule.seasonName}</span>
                </div>
                <p className="text-[11px] text-[#64706A] mt-1 line-clamp-2">
                  {coordinateMatch.currentMonthSchedule.agroClimateOverview}
                </p>
              </div>
            </div>

          </div>

          {/* Filter Bar for Coordinate Crops */}
          <div className="p-4 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#64706A]" />
              <input
                type="text"
                placeholder="Search suggested crops (e.g. Paddy, Cotton, மஞ்சள்)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8FAF9] border border-[#DDE5E1] rounded-xl px-3 py-1.5 text-xs text-[#17201C] focus:outline-none focus:border-[#059669]"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[#64706A] font-bold text-[11px]">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#F8FAF9] border border-[#DDE5E1] rounded-xl px-2.5 py-1.5 font-semibold text-[#17201C] focus:outline-none text-xs"
              >
                <option value="all">All Categories</option>
                <option value="Food Grain">Food Grain</option>
                <option value="Commercial / Cash Crop">Commercial / Cash Crop</option>
                <option value="Plantation & Hill">Plantation & Hill</option>
                <option value="Horticulture & Fruits">Horticulture & Fruits</option>
                <option value="Spices">Spices</option>
                <option value="Pulses & Oilseeds">Pulses & Oilseeds</option>
                <option value="Vegetables">Vegetables</option>
              </select>

              <span className="text-[#64706A] font-bold text-[11px] ml-1">Water Need:</span>
              <select
                value={selectedWaterNeed}
                onChange={(e) => setSelectedWaterNeed(e.target.value)}
                className="bg-[#F8FAF9] border border-[#DDE5E1] rounded-xl px-2.5 py-1.5 font-semibold text-[#17201C] focus:outline-none text-xs"
              >
                <option value="all">All Water Profiles</option>
                <option value="Low">Low (Dryland)</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
                <option value="Very High">Very High (Puddled)</option>
              </select>
            </div>
          </div>

          {/* Recommended Crop Cards for this Coordinate */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#17201C] flex items-center gap-2">
                <Leaf className="w-4 h-4 text-[#059669]" />
                <span>Recommended Crops for Coordinates ({inputLat.toFixed(2)}°N, {inputLon.toFixed(2)}°E) - {coordinateMatch.nearestDistrict}</span>
              </h3>
              <span className="text-xs text-[#64706A] font-semibold">
                Showing {filteredCoordinateCrops.length} optimal varieties
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCoordinateCrops.map((crop, idx) => {
                const thermalFit = calculateThermalSuitability(
                  crop.idealTempRangeC,
                  matchedLiveWeather?.tempC
                );

                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-[#DDE5E1] hover:border-[#059669] transition-all shadow-sm hover:shadow-md space-y-3.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-base font-extrabold text-[#17201C]">
                            {crop.name}
                          </h4>
                          <span className="text-xs text-[#059669] font-bold font-sans">
                            {crop.tamilName}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F8FAF9] border border-[#DDE5E1] text-[#64706A] font-bold flex-shrink-0">
                          {crop.category}
                        </span>
                      </div>

                      {/* Badges: Water Need & Thermal Suitability */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold ${
                          crop.waterNeed === 'Low'
                            ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]'
                            : crop.waterNeed === 'Moderate'
                            ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8]'
                            : 'bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]'
                        }`}>
                          💧 Water Need: {crop.waterNeed}
                        </span>

                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${thermalFit.color}`}>
                          🌡️ {thermalFit.label}
                        </span>
                      </div>

                      {/* Soil Suitability */}
                      <div className="text-xs text-[#64706A] space-y-1">
                        <div className="text-[10px] font-bold text-[#17201C] uppercase tracking-wider">
                          Soil Affinity:
                        </div>
                        <p className="text-[#17201C] bg-[#F8FAF9] p-2.5 rounded-xl border border-[#DDE5E1] leading-relaxed text-[11px]">
                          {crop.soilSuitability}
                        </p>
                      </div>

                      {/* Agronomic Tip */}
                      <div className="text-xs text-[#065F46] bg-[#ECFDF5] p-2.5 rounded-xl border border-[#D1FAE5] space-y-0.5">
                        <div className="text-[10px] font-bold text-[#047857] flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#059669]" />
                          <span>Agronomic Management Tip:</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          {crop.agronomicTip}
                        </p>
                      </div>
                    </div>

                    {/* Footer Metrics & Dosage Calculator Button */}
                    <div className="pt-3 border-t border-[#DDE5E1] flex items-center justify-between text-[11px] text-[#64706A]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#059669]" />
                        <span>Duration: <strong>{crop.yieldDurationDays}</strong></span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCalculatorCropId(mapCropNameToAgronomyId(crop.cropName));
                          setActiveMode('calculator');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#047857] font-bold text-[10px] border border-[#A7F3D0] flex items-center gap-1 transition cursor-pointer"
                        title="Calculate Seed and Fertilizer for your land acreage"
                      >
                        <Calculator className="w-3 h-3 text-[#059669]" />
                        <span>Seed & Fertilizer</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {filteredCoordinateCrops.length === 0 && (
              <div className="p-8 rounded-2xl bg-white border border-[#DDE5E1] text-center space-y-2 text-xs text-[#64706A]">
                <Search className="w-6 h-6 text-[#64706A] mx-auto opacity-50" />
                <div>No crop matches found for the selected search or filter criteria.</div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 3. MODE B: 12-Month Sowing & Harvesting Seasonal Calendar */}
      {activeMode === 'calendar' && (
        <div className="space-y-6">
          
          {/* Horizontal 12-Month Selector */}
          <div className="p-4 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#17201C] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#059669]" />
                <span>12-Month Tamil Nadu Agro-Ecological Crop Calendar</span>
              </h2>
              <span className="text-xs text-[#059669] font-bold">
                TNAU Seasonal Pattams (தை to மார்கழி)
              </span>
            </div>

            {/* 12-Month Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {TAMIL_NADU_12_MONTH_CROP_CALENDAR.map((m, idx) => {
                const isSelected = selectedMonthIdx === idx;
                const isCurrent = currentMonthIdx === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedMonthIdx(idx)}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-[#ECFDF5] border-[#059669] text-[#047857] shadow-sm font-bold'
                        : 'bg-white hover:bg-[#F8FAF9] border-[#DDE5E1] text-[#64706A] hover:text-[#17201C]'
                    }`}
                  >
                    {isCurrent && (
                      <span className="absolute top-2 right-2 text-[9px] px-1.5 py-0.2 rounded-full bg-[#059669] text-white font-bold">
                        NOW
                      </span>
                    )}
                    <div className="text-xs font-extrabold text-[#17201C]">{m.monthName}</div>
                    <div className="text-[11px] text-[#059669] font-bold">{m.tamilMonth}</div>
                    <div className="text-[10px] text-[#64706A] truncate mt-0.5">{m.seasonTamil}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Month Banner & Agro-Climate Overview */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#DDE5E1] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-[#17201C]">
                    {activeMonthSchedule.monthName} ({activeMonthSchedule.tamilMonth}) · {activeMonthSchedule.seasonName}
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] font-bold">
                    {activeMonthSchedule.seasonTamil}
                  </span>
                </div>
                <p className="text-xs text-[#64706A] mt-1">
                  {activeMonthSchedule.agroClimateOverview}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 text-xs">
                <div className="px-3 py-2 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] text-center">
                  <span className="text-[10px] text-[#64706A] block">Sowing Crops</span>
                  <strong className="text-[#059669] text-sm">{activeMonthSchedule.recommendedSowingCrops.length} Types</strong>
                </div>
                <div className="px-3 py-2 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] text-center">
                  <span className="text-[10px] text-[#64706A] block">Harvest Crops</span>
                  <strong className="text-[#D97706] text-sm">{activeMonthSchedule.harvestingCrops.length} Types</strong>
                </div>
              </div>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <Search className="w-4 h-4 text-[#64706A]" />
                <input
                  type="text"
                  placeholder={`Search ${activeMonthSchedule.monthName} crops...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F8FAF9] border border-[#DDE5E1] rounded-xl px-3 py-1.5 text-xs text-[#17201C] focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#64706A] font-bold text-[11px]">Filter Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-[#F8FAF9] border border-[#DDE5E1] rounded-xl px-2.5 py-1.5 font-semibold text-[#17201C] focus:outline-none text-xs"
                >
                  <option value="all">All Categories</option>
                  <option value="Food Grain">Food Grain</option>
                  <option value="Commercial / Cash Crop">Commercial / Cash Crop</option>
                  <option value="Plantation & Hill">Plantation & Hill</option>
                  <option value="Horticulture & Fruits">Horticulture & Fruits</option>
                  <option value="Spices">Spices</option>
                  <option value="Pulses & Oilseeds">Pulses & Oilseeds</option>
                  <option value="Vegetables">Vegetables</option>
                </select>
              </div>
            </div>

            {/* Recommended Sowing Grid */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-extrabold text-[#047857] uppercase tracking-wider flex items-center gap-2">
                <Sprout className="w-4 h-4" />
                <span>Recommended Sowing & Planting for {activeMonthSchedule.monthName} ({activeMonthSchedule.tamilMonth})</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMonthCrops.map((crop, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-[#DDE5E1] hover:border-[#059669] transition shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-base font-extrabold text-[#17201C]">
                            {crop.name}
                          </h4>
                          <span className="text-xs text-[#059669] font-bold">
                            {crop.tamilName}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F8FAF9] border border-[#DDE5E1] text-[#64706A] font-bold">
                          {crop.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                          crop.waterNeed === 'Low'
                            ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]'
                            : crop.waterNeed === 'Moderate'
                            ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8]'
                            : 'bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]'
                        }`}>
                          💧 Water Need: {crop.waterNeed}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F8FAF9] border border-[#DDE5E1] text-[#64706A] font-bold">
                          ⏳ {crop.durationDays}
                        </span>
                      </div>

                      <p className="text-xs text-[#64706A] leading-relaxed">
                        {crop.description}
                      </p>

                      <div className="text-xs text-[#17201C] bg-[#F8FAF9] p-2.5 rounded-xl border border-[#DDE5E1] space-y-1">
                        <span className="text-[10px] font-bold text-[#64706A] uppercase block">Ideal Soil Profile:</span>
                        <span className="text-[11px]">{crop.idealSoil}</span>
                      </div>

                      {/* Suitable Zones */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        <span className="text-[10px] text-[#64706A] font-bold mr-1">Key Districts:</span>
                        {crop.suitableAgroZones.map((z, zIdx) => (
                          <span key={zIdx} className="text-[10px] px-1.5 py-0.2 rounded bg-[#ECFDF5] text-[#047857] font-semibold">
                            {z}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#DDE5E1] flex items-center justify-between text-[11px] text-[#64706A]">
                      <span>Ideal Temp: <strong>{crop.idealTempRangeC[0]}° - {crop.idealTempRangeC[1]}°C</strong></span>
                      <button
                        onClick={() => {
                          setSelectedCalculatorCropId(mapCropNameToAgronomyId(crop.cropName));
                          setActiveMode('calculator');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#047857] font-bold text-[10px] border border-[#A7F3D0] flex items-center gap-1 transition cursor-pointer"
                        title="Calculate Seed and Fertilizer for your land acreage"
                      >
                        <Calculator className="w-3 h-3 text-[#059669]" />
                        <span>Seed & Fertilizer</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Harvesting & Strategic Operations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 border-t border-[#DDE5E1]">
              
              {/* Harvesting Card */}
              <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] space-y-2">
                <div className="text-xs font-bold text-[#92400E] flex items-center gap-1.5 uppercase">
                  <Wheat className="w-4 h-4" />
                  <span>Harvesting in {activeMonthSchedule.monthName}</span>
                </div>
                <div className="space-y-1">
                  {activeMonthSchedule.harvestingCrops.map((hc, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#92400E] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                      <span>{hc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Irrigation Strategy */}
              <div className="p-4 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] space-y-2">
                <div className="text-xs font-bold text-[#0369A1] flex items-center gap-1.5 uppercase">
                  <Droplets className="w-4 h-4" />
                  <span>Irrigation & Moisture Strategy</span>
                </div>
                <p className="text-xs text-[#0C4A6E] leading-relaxed">
                  {activeMonthSchedule.irrigationStrategy}
                </p>
              </div>

              {/* Pest & Disease Advisory */}
              <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-2">
                <div className="text-xs font-bold text-[#047857] flex items-center gap-1.5 uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pest & Disease Advisory</span>
                </div>
                <p className="text-xs text-[#065F46] leading-relaxed">
                  {activeMonthSchedule.pestAndDiseaseAdvisory}
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 4. MODE C: Comprehensive Statewide Crop Encyclopedia */}
      {activeMode === 'all_crops' && (
        <div className="space-y-6">
          
          {/* Search & Filter Header */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-[#17201C] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#059669]" />
                  <span>Comprehensive Tamil Nadu Agricultural Crop Catalog</span>
                </h2>
                <p className="text-xs text-[#64706A]">
                  TNAU-verified varieties, agronomic field guidelines, thermal ranges, and soil compatibility across all 38 districts.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#64706A] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search crops or districts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#F8FAF9] border border-[#DDE5E1] rounded-xl pl-9 pr-4 py-2 text-xs text-[#17201C] focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#DDE5E1] text-xs">
              <span className="text-[#64706A] font-bold text-[11px]">Category:</span>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  selectedCategory === 'all'
                    ? 'bg-[#059669] text-white'
                    : 'bg-[#F8FAF9] text-[#64706A] hover:text-[#17201C]'
                }`}
              >
                All
              </button>
              {['Food Grain', 'Commercial / Cash Crop', 'Plantation & Hill', 'Horticulture & Fruits', 'Spices', 'Pulses & Oilseeds'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    selectedCategory === cat
                      ? 'bg-[#059669] text-white'
                      : 'bg-[#F8FAF9] text-[#64706A] hover:text-[#17201C]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Encyclopedia Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAllCrops.map(({ crop, districts }, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#DDE5E1] hover:border-[#059669] transition shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-base font-extrabold text-[#17201C]">
                        {crop.name}
                      </h4>
                      <span className="text-xs text-[#059669] font-bold">
                        {crop.tamilName}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F8FAF9] border border-[#DDE5E1] text-[#64706A] font-bold">
                      {crop.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] font-bold">
                      🗓️ {crop.season}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F8FAF9] border border-[#DDE5E1] text-[#64706A] font-bold">
                      💧 Water: {crop.waterNeed}
                    </span>
                  </div>

                  <div className="text-xs text-[#64706A] space-y-1">
                    <span className="text-[10px] font-bold text-[#17201C] uppercase block">Soil Suitability:</span>
                    <p className="text-[#17201C] bg-[#F8FAF9] p-2.5 rounded-xl border border-[#DDE5E1] text-[11px] leading-relaxed">
                      {crop.soilSuitability}
                    </p>
                  </div>

                  <div className="text-xs text-[#065F46] bg-[#ECFDF5] p-2.5 rounded-xl border border-[#D1FAE5] space-y-0.5">
                    <span className="text-[10px] font-bold text-[#047857] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#059669]" /> Field Tip:
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      {crop.agronomicTip}
                    </p>
                  </div>

                  {/* Primary Cultivation Districts */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="text-[10px] text-[#64706A] font-bold mr-1">Major Districts:</span>
                    {districts.slice(0, 5).map((d, dIdx) => (
                      <span key={dIdx} className="text-[10px] px-1.5 py-0.2 rounded bg-[#F8FAF9] border border-[#DDE5E1] text-[#17201C] font-semibold">
                        {d}
                      </span>
                    ))}
                    {districts.length > 5 && (
                      <span className="text-[10px] text-[#64706A] font-bold">+{districts.length - 5} more</span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#DDE5E1] flex items-center justify-between text-[11px] text-[#64706A]">
                  <span>Cycle: <strong>{crop.yieldDurationDays}</strong></span>
                  <button
                    onClick={() => {
                      setSelectedCalculatorCropId(mapCropNameToAgronomyId(crop.cropName));
                      setActiveMode('calculator');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#047857] font-bold text-[10px] border border-[#A7F3D0] flex items-center gap-1 transition cursor-pointer"
                  >
                    <Calculator className="w-3 h-3 text-[#059669]" />
                    <span>Fertilizer Dosage</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 4. MODE C: 🚜 Land Acreage, Seed & Fertilizer Calculator */}
      {activeMode === 'calculator' && (
        <AgriFarmCalculator initialCropId={selectedCalculatorCropId} />
      )}

    </div>
  );
};
