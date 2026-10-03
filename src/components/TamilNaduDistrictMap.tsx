import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Thermometer,
  Info,
  ChevronRight,
  Wind,
  Droplets,
  Gauge,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  RefreshCw,
  Sun,
  CloudRain,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Maximize2
} from 'lucide-react';
import { DISTRICT_REGIONS, TAMIL_NADU_BORDER_GEOJSON, projectGeoToSvg } from '../data/tamilNaduGeo';
import { DISTRICT_VORONOI_PATHS } from '../data/districtVoronoi';
import { CITIES_TAMIL_NADU } from '../data/cities';
import { CityLocation, LiveDistrictWeather } from '../types';

interface TamilNaduDistrictMapProps {
  selectedDistrictName?: string;
  onSelectDistrict?: (districtName: string) => void;
  onOpenDetails?: () => void;
  className?: string;
  activeVariableIdx?: number;
  showTitle?: boolean;
  showWindVectors?: boolean;
  liveDistrictData?: LiveDistrictWeather[];
  onRefreshLive?: () => void;
  isLiveLoading?: boolean;
}

// Clean offset placements for crowded clusters
const DISTRICT_LABEL_OFFSETS: Record<string, { dx: number; dy: number }> = {
  'Chennai': { dx: 18, dy: -4 },
  'Tiruvallur': { dx: -16, dy: -14 },
  'Ranipet': { dx: 0, dy: -18 },
  'Vellore': { dx: -16, dy: 8 },
  'Kanchipuram': { dx: -14, dy: 14 },
  'Chengalpattu': { dx: 18, dy: 12 },
  'Tirupattur': { dx: 14, dy: 8 },
  'Ariyalur': { dx: 16, dy: -6 },
  'Perambalur': { dx: -16, dy: -8 },
  'Tiruvarur': { dx: -10, dy: 12 },
  'Nagapattinam': { dx: 18, dy: 2 },
  'Mayiladuthurai': { dx: 16, dy: -12 },
  'Tenkasi': { dx: -14, dy: -6 },
  'Tirunelveli': { dx: 12, dy: 12 },
  'Thoothukudi': { dx: 16, dy: 4 },
  'Kanyakumari': { dx: 0, dy: 16 },
  'Nilgiris': { dx: -18, dy: -10 },
  'Coimbatore': { dx: -16, dy: 12 },
  'Tiruppur': { dx: 12, dy: -8 },
  'Villupuram': { dx: 14, dy: -8 },
  'Kallakurichi': { dx: -12, dy: 10 },
  'Cuddalore': { dx: 18, dy: 6 },
  'Madurai': { dx: -8, dy: 2 },
  'Sivaganga': { dx: 14, dy: 8 },
  'Virudhunagar': { dx: -12, dy: 10 },
  'Ramanathapuram': { dx: 16, dy: 10 },
};

export const TamilNaduDistrictMap: React.FC<TamilNaduDistrictMapProps> = ({
  selectedDistrictName = 'Nilgiris',
  onSelectDistrict,
  onOpenDetails,
  className = '',
  activeVariableIdx = 0,
  showTitle = true,
  showWindVectors = true,
  liveDistrictData = [],
  onRefreshLive,
  isLiveLoading = false
}) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [showDenseLabels, setShowDenseLabels] = useState<boolean>(true);
  const [isHudCollapsed, setIsHudCollapsed] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const activeDistrict = hoveredDistrict || selectedDistrictName;

  // Map for fast live district lookup
  const liveMap = useMemo(() => {
    const m = new Map<string, LiveDistrictWeather>();
    (liveDistrictData || []).forEach((item) => {
      if (item.district) m.set(item.district.toLowerCase(), item);
      if (item.cityName) m.set(item.cityName.toLowerCase(), item);
    });
    return m;
  }, [liveDistrictData]);

  // Active city/district object from 38 districts list
  const activeCityMeta: CityLocation = useMemo(() => {
    const foundCity = CITIES_TAMIL_NADU.find(
      (c) =>
        c.district.toLowerCase() === activeDistrict.toLowerCase() ||
        c.name.toLowerCase() === activeDistrict.toLowerCase() ||
        c.name.toLowerCase().includes(activeDistrict.toLowerCase()) ||
        activeDistrict.toLowerCase().includes(c.district.toLowerCase())
    );
    return foundCity || CITIES_TAMIL_NADU[0];
  }, [activeDistrict]);

  // Live item for currently active district
  const activeLiveItem = useMemo(() => {
    return (
      liveMap.get(activeCityMeta.district.toLowerCase()) ||
      liveMap.get(activeCityMeta.name.toLowerCase()) ||
      null
    );
  }, [liveMap, activeCityMeta]);

  // Curated, harmonious meteorological palette
  const getDistrictFillColor = (tempC: number, isSelected: boolean, isHovered: boolean) => {
    if (isSelected) return '#059669'; // Emerald Highlight
    if (isHovered) return '#10b981';

    if (tempC < 19.0) return '#0284c7'; // Cool Highland Alpine Blue
    if (tempC < 24.0) return '#0ea5e9'; // Mild Cyan
    if (tempC < 29.0) return '#10b981'; // Fresh Emerald
    if (tempC < 32.5) return '#f59e0b'; // Warm Amber
    return '#ea580c'; // Warm Tangerine
  };

  // SVG dimensions
  const svgW = 640;
  const svgH = 700;
  const pad = 42;

  // Outer Border SVG Path
  const outerBorderPath = useMemo(() => {
    const pts = TAMIL_NADU_BORDER_GEOJSON.map(([lon, lat]) => {
      const { x, y } = projectGeoToSvg(lon, lat, svgW, svgH, pad);
      return `${x},${y}`;
    });
    return `M ${pts.join(' L ')} Z`;
  }, [svgW, svgH, pad]);

  // Sorted districts so active/selected district is rendered on top
  const sortedDistricts = useMemo(() => {
    return [...DISTRICT_REGIONS].sort((a, b) => {
      const aIsActive = a.name.toLowerCase() === activeDistrict.toLowerCase();
      const bIsActive = b.name.toLowerCase() === activeDistrict.toLowerCase();
      if (aIsActive) return 1;
      if (bIsActive) return -1;
      return 0;
    });
  }, [activeDistrict]);

  // Dynamic ViewBox for interactive zoom
  const viewBoxStr = useMemo(() => {
    if (zoomScale === 1) return `0 0 ${svgW} ${svgH}`;
    const w = svgW / zoomScale;
    const h = svgH / zoomScale;
    const activeCentroid = DISTRICT_REGIONS.find((d) => d.name.toLowerCase() === activeDistrict.toLowerCase()) || DISTRICT_REGIONS[0];
    const { x, y } = projectGeoToSvg(activeCentroid.lon, activeCentroid.lat, svgW, svgH, pad);
    const minX = Math.max(0, Math.min(svgW - w, x - w / 2));
    const minY = Math.max(0, Math.min(svgH - h, y - h / 2));
    return `${minX} ${minY} ${w} ${h}`;
  }, [zoomScale, activeDistrict, svgW, svgH, pad]);

  return (
    <div className={`relative rounded-3xl bg-white border border-[#DDE5E1] overflow-hidden flex flex-col justify-between p-4 sm:p-5 shadow-sm ${className}`}>
      
      {/* Top Header with Controls & Layer Toggles */}
      {showTitle && (
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#DDE5E1] pb-3 gap-2.5 z-10">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping"></span>
            <span className="text-xs sm:text-sm font-extrabold text-[#17201C] tracking-wider uppercase">
              TAMIL NADU 38 DISTRICTS GIS RADAR
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] text-[10px] font-bold flex items-center gap-1">
              Live Open-Meteo
            </span>
          </div>

          {/* Map Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            
            {/* Label Density Toggle */}
            <button
              onClick={() => setShowDenseLabels(!showDenseLabels)}
              className={`px-2.5 py-1 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                showDenseLabels
                  ? 'bg-[#ECFDF5] border-[#059669] text-[#047857]'
                  : 'bg-[#F8FAF9] border-[#DDE5E1] text-[#64706A]'
              }`}
              title="Toggle District Labels"
            >
              {showDenseLabels ? <Eye className="w-3.5 h-3.5 text-[#059669]" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showDenseLabels ? 'Labels ON' : 'Pins Only'}</span>
            </button>

            {/* Refresh Live Button */}
            {onRefreshLive && (
              <button
                onClick={onRefreshLive}
                disabled={isLiveLoading}
                className="p-1.5 rounded-xl bg-[#F8FAF9] hover:bg-[#ECFDF5] border border-[#DDE5E1] text-[#059669] transition shadow-xs"
                title="Refresh Real-Time Live Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLiveLoading ? 'animate-spin' : ''}`} />
              </button>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-[#F8FAF9] p-0.5 rounded-xl border border-[#DDE5E1]">
              <button
                onClick={() => setZoomScale((z) => Math.max(1, z - 0.35))}
                className="p-1 rounded-lg text-[#64706A] hover:text-[#17201C] hover:bg-[#E8F0EC] transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomScale(1)}
                className="p-1 rounded-lg text-[#64706A] hover:text-[#17201C] hover:bg-[#E8F0EC] transition"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomScale((z) => Math.min(2.5, z + 0.35))}
                className="p-1 rounded-lg text-[#64706A] hover:text-[#17201C] hover:bg-[#E8F0EC] transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Main Interactive SVG Map Canvas */}
      <div 
        className="relative w-full flex-1 min-h-[460px] flex items-center justify-center my-1 select-none overflow-hidden rounded-2xl bg-gradient-to-b from-[#F0FDF4]/40 via-white/80 to-[#ECFDF5]/50 border border-[#E8F0EC]"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
        onMouseLeave={() => setMousePos(null)}
      >
        
        <svg
          viewBox={viewBoxStr}
          className="w-full h-full max-h-[680px] object-contain filter drop-shadow-[0_8px_30px_rgba(5,150,105,0.08)] transition-all duration-300"
        >
          <defs>
            {/* Soft Glow filter */}
            <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#059669" floodOpacity="0.18" />
            </filter>

            {/* Thermal Gradient Shading */}
            <radialGradient id="oceanBg" cx="60%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#f0fdfa" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#e6f4ea" stopOpacity="0.2" />
            </radialGradient>
          </defs>

          {/* Oceanic Geographic Labels */}
          <text x={svgW - 130} y={svgH * 0.36} fill="#0d9488" fontSize="11" fontWeight="800" letterSpacing="3.5" opacity="0.45">
            BAY OF BENGAL
          </text>
          
          <g transform={`translate(${svgW - 205}, 462)`}>
            <text x="0" y="0" fill="#059669" fontSize="10" fontWeight="800" letterSpacing="2.5" opacity="0.65">
              ⚓ GULF OF MANNAR
            </text>
          </g>

          <text x={110} y={svgH - 25} fill="#0284c7" fontSize="10" fontWeight="800" letterSpacing="2.5" opacity="0.45">
            INDIAN OCEAN
          </text>

          {/* Clip path for outer state boundary */}
          <clipPath id="tnStateClip">
            <path d={outerBorderPath} />
          </clipPath>

          {/* Subtle State Landmass Shadow Underlay */}
          <path
            d={outerBorderPath}
            fill="#d1fae5"
            opacity="0.4"
            transform="translate(2, 4)"
            filter="blur(4px)"
          />

          {/* Inside Clipped Region: 38 Seamless Voronoi District Tiles */}
          <g clipPath="url(#tnStateClip)">
            
            {/* Land Base Fill */}
            <path d={outerBorderPath} fill="#f8faf9" />

            {/* 38 Seamless District Polygons */}
            {DISTRICT_REGIONS.map((d) => {
              const voronoiPath = DISTRICT_VORONOI_PATHS[d.name];
              if (!voronoiPath) return null;

              const isSelected = activeDistrict.toLowerCase() === d.name.toLowerCase();
              const isHovered = hoveredDistrict?.toLowerCase() === d.name.toLowerCase();
              const liveData = liveMap.get(d.name.toLowerCase());
              
              const temp = liveData ? liveData.temperatureC : 29.0;
              const fillColor = getDistrictFillColor(temp, isSelected, isHovered);

              return (
                <path
                  key={`voronoi-${d.name}`}
                  d={voronoiPath}
                  fill={fillColor}
                  fillOpacity={isSelected ? 0.95 : isHovered ? 0.88 : 0.72}
                  stroke={isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.75)'}
                  strokeWidth={isSelected ? '2.4' : '1.1'}
                  className="cursor-pointer transition-all duration-200 hover:brightness-110"
                  onMouseEnter={() => setHoveredDistrict(d.name)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                  onClick={() => {
                    if (onSelectDistrict) onSelectDistrict(d.name);
                  }}
                />
              );
            })}

            {/* Subtle Topographical Mountain Ridge Traces (Western Ghats) */}
            <path
              d="M 160 270 Q 180 340 185 410 Q 190 480 200 560"
              fill="none"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="3"
              strokeDasharray="4 6"
              className="pointer-events-none"
            />

          </g>

          {/* 38 District Centroid Markers & Live Temperature Tags */}
          {sortedDistricts.map((d) => {
            const { x, y } = projectGeoToSvg(d.lon, d.lat, svgW, svgH, pad);
            const isSelected = activeDistrict.toLowerCase() === d.name.toLowerCase();
            const isHovered = hoveredDistrict?.toLowerCase() === d.name.toLowerCase();
            const liveData = liveMap.get(d.name.toLowerCase());
            
            const rawName = d.name === 'Nilgiris' ? 'Nilgiris (Ooty)' : d.name;
            const offset = DISTRICT_LABEL_OFFSETS[d.name] || { dx: 0, dy: 0 };
            const tempVal = liveData ? Math.round(liveData.temperatureC) : 29;

            const isCool = tempVal <= 20;

            return (
              <g
                key={`centroid-${d.code}`}
                className="cursor-pointer group select-none"
                onMouseEnter={() => setHoveredDistrict(d.name)}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => {
                  if (onSelectDistrict) onSelectDistrict(d.name);
                }}
              >
                {/* Click Hitbox */}
                <circle cx={x} cy={y} r="20" fill="transparent" />

                {/* Pulsing Radar Ring on Selected/Hovered */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill="none"
                    stroke={isSelected ? '#059669' : '#10b981'}
                    strokeWidth="2"
                    className="animate-ping opacity-75"
                  />
                )}

                {/* Centroid Station Pin */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 6 : 4}
                  fill={isSelected ? '#ffffff' : (isCool ? '#0284c7' : '#059669')}
                  stroke={isSelected ? '#047857' : '#ffffff'}
                  strokeWidth={isSelected ? '2.5' : '1.4'}
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
                />

                {/* Minimalist Pin Temperature Chip (Visible when labels are OFF) */}
                {!showDenseLabels && (
                  <g transform={`translate(${x}, ${y - 10})`}>
                    <rect
                      x="-14"
                      y="-7"
                      width="28"
                      height="14"
                      rx="4"
                      fill={isSelected ? '#059669' : '#ffffff'}
                      stroke={isSelected ? '#ffffff' : '#DDE5E1'}
                      strokeWidth="1"
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : '#17201C'}
                      fontSize="9"
                      fontWeight="800"
                    >
                      {tempVal}°
                    </text>
                  </g>
                )}

                {/* Full District Label Pill (When labels are ON) */}
                {showDenseLabels && (
                  <g transform={`translate(${x + offset.dx}, ${y - 12 + offset.dy})`}>
                    
                    {/* Connector line for offset labels */}
                    {(Math.abs(offset.dx) > 10 || Math.abs(offset.dy) > 10) && (
                      <line
                        x1={-offset.dx}
                        y1={12 - offset.dy}
                        x2="0"
                        y2="0"
                        stroke="rgba(5, 150, 105, 0.4)"
                        strokeWidth="0.8"
                        strokeDasharray="2 2"
                      />
                    )}

                    <rect
                      x={-(rawName.length * 2.8 + 16)}
                      y="-8.5"
                      width={rawName.length * 5.6 + 32}
                      height="17"
                      rx="5"
                      fill={isSelected ? '#059669' : '#ffffff'}
                      fillOpacity={isSelected ? 0.98 : 0.94}
                      stroke={isSelected ? '#ffffff' : '#DDE5E1'}
                      strokeWidth={isSelected ? '1.8' : '0.9'}
                      filter="drop-shadow(0 2px 5px rgba(0,0,0,0.1))"
                    />
                    <text
                      x="0"
                      y="3.2"
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : '#17201C'}
                      fontSize="9"
                      fontWeight={isSelected ? '800' : '700'}
                      letterSpacing="0.1"
                      className="pointer-events-none"
                    >
                      {rawName} <tspan fill={isSelected ? '#d1fae5' : '#059669'} fontWeight="800">{tempVal}°</tspan>
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* High-Definition Outer Perimeter Border */}
          <path
            d={outerBorderPath}
            fill="none"
            stroke="#059669"
            strokeWidth="2.6"
            strokeLinejoin="round"
            className="pointer-events-none"
          />

          {/* FLOATING TELEMETRY HUD OVER GULF OF MANNAR */}
          <g
            transform="translate(365, 480)"
            className="cursor-pointer select-none"
            onClick={() => {
              if (onOpenDetails) onOpenDetails();
            }}
          >
            {/* Box Background */}
            <rect
              x="0"
              y={isHudCollapsed ? 140 : 0}
              width="260"
              height={isHudCollapsed ? 64 : 206}
              rx="16"
              fill="#ffffff"
              fillOpacity="0.96"
              stroke="#059669"
              strokeWidth="1.6"
              filter="drop-shadow(0 10px 28px rgba(0, 0, 0, 0.12))"
              className="transition-all duration-300"
            />

            {!isHudCollapsed && (
              <>
                {/* Header ribbon */}
                <path
                  d="M 0 16 Q 0 0 16 0 L 244 0 Q 260 0 260 16 L 260 34 L 0 34 Z"
                  fill="#ECFDF5"
                />

                {/* Pulsing indicator dot */}
                <circle cx="16" cy="17" r="4" fill="#059669" className="animate-pulse" />
                <circle cx="16" cy="17" r="8" fill="none" stroke="#059669" strokeWidth="1" opacity="0.6" />

                {/* Header labels */}
                <text x="30" y="21" fill="#047857" fontSize="9.5" fontWeight="800" letterSpacing="0.8">
                  LIVE STATION TELEMETRY
                </text>
                <text x="246" y="20.5" textAnchor="end" fill="#64706A" fontSize="8.5" fontWeight="600">
                  {activeCityMeta.lat.toFixed(1)}°N {activeCityMeta.lon.toFixed(1)}°E
                </text>

                {/* District Name Header */}
                <text x="16" y="58" fill="#17201C" fontSize="17" fontWeight="900" letterSpacing="0.1">
                  {activeCityMeta.district === 'Nilgiris' ? 'Nilgiris (Ooty)' : activeCityMeta.name}
                </text>

                {/* Topography & Condition */}
                <text x="16" y="74" fill="#059669" fontSize="10" fontWeight="700">
                  {activeLiveItem
                    ? `${activeLiveItem.weatherCondition.toUpperCase()} • ${activeCityMeta.elevationM}m ASL`
                    : `${activeCityMeta.regionType.replace('-', ' ').toUpperCase()} • ${activeCityMeta.elevationM}m ASL`}
                </text>

                {/* Divider */}
                <line x1="16" y1="82" x2="244" y2="82" stroke="#DDE5E1" strokeWidth="1" />

                {/* 4 Diagnostic Parameter Chips */}
                {/* 1: Temp */}
                <rect x="16" y="90" width="110" height="44" rx="8" fill="#F8FAF9" stroke="#DDE5E1" strokeWidth="0.9" />
                <text x="24" y="104" fill="#64706A" fontSize="8.5" fontWeight="600">
                  AIR TEMP
                </text>
                <text x="24" y="124" fill="#059669" fontSize="14" fontWeight="800">
                  {activeLiveItem ? `${activeLiveItem.temperatureC.toFixed(1)}°C` : '28.5°C'}
                </text>

                {/* 2: Wind */}
                <rect x="134" y="90" width="110" height="44" rx="8" fill="#F8FAF9" stroke="#DDE5E1" strokeWidth="0.9" />
                <text x="142" y="104" fill="#64706A" fontSize="8.5" fontWeight="600">
                  WIND SPEED
                </text>
                <text x="142" y="124" fill="#047857" fontSize="14" fontWeight="800">
                  {activeLiveItem ? `${activeLiveItem.windSpeedKmh.toFixed(1)} km/h` : '12.0 km/h'}
                </text>

                {/* 3: Humidity */}
                <rect x="16" y="140" width="110" height="44" rx="8" fill="#F8FAF9" stroke="#DDE5E1" strokeWidth="0.9" />
                <text x="24" y="154" fill="#64706A" fontSize="8.5" fontWeight="600">
                  HUMIDITY
                </text>
                <text x="24" y="174" fill="#059669" fontSize="13.5" fontWeight="800">
                  {activeLiveItem ? `${activeLiveItem.relativeHumidityPct}%` : '65%'}
                </text>

                {/* 4: Feels like */}
                <rect x="134" y="140" width="110" height="44" rx="8" fill="#F8FAF9" stroke="#DDE5E1" strokeWidth="0.9" />
                <text x="142" y="154" fill="#64706A" fontSize="8.5" fontWeight="600">
                  FEELS LIKE
                </text>
                <text x="142" y="174" fill="#059669" fontSize="13.5" fontWeight="800">
                  {activeLiveItem ? `${activeLiveItem.apparentTempC?.toFixed(1) || activeLiveItem.temperatureC.toFixed(1)}°C` : '28.5°C'}
                </text>

                {/* Bottom Action Hint */}
                <text x="130" y="198" textAnchor="middle" fill="#059669" fontSize="8.5" fontWeight="700">
                  ✦ Click District to view 7-Day Forecast ✦
                </text>
              </>
            )}

            {isHudCollapsed && (
              <g transform="translate(16, 156)">
                <circle cx="6" cy="14" r="4" fill="#059669" className="animate-pulse" />
                <text x="18" y="17" fill="#17201C" fontSize="13" fontWeight="900">
                  {activeCityMeta.district}: <tspan fill="#059669">{activeLiveItem ? `${activeLiveItem.temperatureC.toFixed(1)}°C` : '28°C'}</tspan>
                </text>
                <text x="18" y="32" fill="#64706A" fontSize="9">
                  Click to expand telemetry panel
                </text>
              </g>
            )}
          </g>
        </svg>

      </div>

      {/* Bottom Info Bar */}
      <div className="w-full bg-[#F8FAF9] border border-[#DDE5E1] rounded-2xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs z-10 shadow-xs">
        
        {/* District Name and Topography Tag */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669] shadow-xs flex-shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-extrabold text-[#17201C] text-base tracking-tight">
                {activeCityMeta.district === 'Nilgiris' ? 'Nilgiris (Ooty)' : activeCityMeta.name}
              </span>
              <span className="text-[#64706A] text-xs font-medium">
                ({activeCityMeta.regionType === 'western-ghats' || activeCityMeta.district === 'Nilgiris' ? 'Western Ghats' : activeCityMeta.regionType.replace('-', ' ')} • {activeCityMeta.elevationM}m ASL)
              </span>
              {activeLiveItem && (
                <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] text-[10px] font-bold">
                  Live: {activeLiveItem.weatherCondition}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Temperature Readout & Anomaly */}
        <div className="flex items-center gap-4 text-xs font-bold self-end sm:self-auto">
          {activeLiveItem && (
            <>
              <div className="text-[#64706A]">
                Live Temp: <span className="text-[#059669] text-sm font-extrabold">{activeLiveItem.temperatureC.toFixed(1)}°C</span>
              </div>
              <div className="text-[#64706A]">
                Feels Like: <span className="text-[#047857] text-sm font-extrabold">{activeLiveItem.apparentTempC?.toFixed(1) || activeLiveItem.temperatureC.toFixed(1)}°C</span>
              </div>
              <div className="text-[#64706A]">
                Humidity: <span className="text-[#059669] text-sm font-extrabold">{activeLiveItem.relativeHumidityPct}%</span>
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
};
