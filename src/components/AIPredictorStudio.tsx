import React, { useState, useMemo } from 'react';
import {
  Brain,
  Sparkles,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShieldCheck,
  Sliders,
  RotateCcw,
  Calendar,
  Clock,
  Droplets,
  Wind,
  Gauge,
  Thermometer,
  Eye,
  Search,
  ChevronRight,
  Info,
  MapPin,
  RefreshCw,
  Sun,
  CloudRain,
  Layers,
  BarChart2,
  CheckCircle2,
  Flame,
  Snowflake
} from 'lucide-react';
import { CITIES_TAMIL_NADU } from '../data/cities';
import { LiveDistrictWeather, AIPredictionResult, AIPredictionStep } from '../types';
import { generateAIPrediction, AISimulationOptions } from '../data/aiPredictorEngine';

interface AIPredictorStudioProps {
  liveDistrictData: LiveDistrictWeather[];
  onRefreshLive?: () => void;
  isLiveLoading?: boolean;
  initialDistrictName?: string;
}

export const AIPredictorStudio: React.FC<AIPredictorStudioProps> = ({
  liveDistrictData = [],
  onRefreshLive,
  isLiveLoading = false,
  initialDistrictName = 'Nilgiris'
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrictName);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [horizon, setHorizon] = useState<'24h' | '72h'>('24h');
  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(0);

  // What-If Simulation State
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [simTempOffset, setSimTempOffset] = useState<number>(0);
  const [simHumidityOffset, setSimHumidityOffset] = useState<number>(0);
  const [simPressureOffset, setSimPressureOffset] = useState<number>(0);

  // Active City Info
  const activeCity = useMemo(() => {
    const q = selectedDistrict.toLowerCase().trim();
    return (
      CITIES_TAMIL_NADU.find(
        (c) =>
          c.district.toLowerCase() === q ||
          c.name.toLowerCase().includes(q) ||
          q.includes(c.district.toLowerCase())
      ) || CITIES_TAMIL_NADU[0]
    );
  }, [selectedDistrict]);

  // Active Live Weather for starting ground truth
  const activeLiveWeather = useMemo(() => {
    if (!liveDistrictData || liveDistrictData.length === 0) return null;
    const q = activeCity.district.toLowerCase().trim();
    return (
      liveDistrictData.find(
        (d) =>
          d.district?.toLowerCase() === q ||
          d.cityName?.toLowerCase().includes(q) ||
          q.includes(d.district?.toLowerCase() || '')
      ) || null
    );
  }, [liveDistrictData, activeCity]);

  // AI Prediction Result
  const prediction: AIPredictionResult = useMemo(() => {
    const options: AISimulationOptions = {
      horizon,
      tempOffsetC: simTempOffset,
      humidityOffsetPct: simHumidityOffset,
      pressureOffsetHpa: simPressureOffset
    };
    return generateAIPrediction(activeCity, activeLiveWeather, options);
  }, [activeCity, activeLiveWeather, horizon, simTempOffset, simHumidityOffset, simPressureOffset]);

  const activeStep: AIPredictionStep = prediction.steps[selectedStepIdx] || prediction.steps[0];

  // Filtered districts for search
  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return CITIES_TAMIL_NADU;
    const q = searchQuery.toLowerCase();
    return CITIES_TAMIL_NADU.filter(
      (c) => c.name.toLowerCase().includes(q) || c.district.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Chart bounds and SVG coordinates calculation
  const temps = prediction.steps.map(s => s.predictedTempC);
  const minTemp = Math.floor(Math.min(...prediction.steps.map(s => s.lowerConfidenceTempC)) - 1);
  const maxTemp = Math.ceil(Math.max(...prediction.steps.map(s => s.upperConfidenceTempC)) + 1);
  const tempRange = Math.max(4, maxTemp - minTemp);

  const chartWidth = 720;
  const chartHeight = 180;
  const paddingX = 24;
  const paddingY = 20;
  const usableWidth = chartWidth - paddingX * 2;
  const usableHeight = chartHeight - paddingY * 2;

  // Build SVG Path strings for predicted line and confidence interval area
  const points = prediction.steps.map((step, idx) => {
    const x = paddingX + (idx / (prediction.steps.length - 1)) * usableWidth;
    const y = paddingY + usableHeight - ((step.predictedTempC - minTemp) / tempRange) * usableHeight;
    const yLower = paddingY + usableHeight - ((step.lowerConfidenceTempC - minTemp) / tempRange) * usableHeight;
    const yUpper = paddingY + usableHeight - ((step.upperConfidenceTempC - minTemp) / tempRange) * usableHeight;
    return { x, y, yLower, yUpper, step };
  });

  const linePath = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaPath = points.length > 0
    ? `${points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yUpper}`).join(' ')} ${points
        .slice()
        .reverse()
        .map((p) => `L ${p.x} ${p.yLower}`)
        .join(' ')} Z`
    : '';

  // Reset What-If simulation to baseline
  const handleResetSimulator = () => {
    setSimTempOffset(0);
    setSimHumidityOffset(0);
    setSimPressureOffset(0);
  };

  const isScenarioActive = simTempOffset !== 0 || simHumidityOffset !== 0 || simPressureOffset !== 0;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Header: AI Model Architecture & Status Banner */}
      <div className="bg-white border border-[#DDE5E1] rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#059669] text-xs font-bold uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            <span>AI Weather Forecast Studio</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#047857] text-[10px] font-mono font-bold">
              Neural AI Predictor
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17201C] tracking-tight mt-1.5 flex items-center gap-2.5 flex-wrap">
            <span>AI Weather Predictions & Future Outlook</span>
            {isScenarioActive && (
              <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-amber-700" />
                Custom Scenario Active
              </span>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-[#64706A] mt-1 font-medium">
            Hour-by-hour temperature trajectories, confidence ranges, weather alerts, and key climate drivers for Tamil Nadu.
          </p>
        </div>

        {/* Action Controls: Horizon Switcher & What-If Button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* 24h vs 72h Horizon Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1]">
            <button
              onClick={() => { setHorizon('24h'); setSelectedStepIdx(0); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                horizon === '24h'
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'text-[#64706A] hover:text-[#17201C]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Next 24 Hours</span>
            </button>
            <button
              onClick={() => { setHorizon('72h'); setSelectedStepIdx(0); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                horizon === '72h'
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'text-[#64706A] hover:text-[#17201C]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Next 3 Days (72h)</span>
            </button>
          </div>

          {/* Toggle Weather Simulator */}
          <button
            onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shadow-xs ${
              isSimulatorOpen || isScenarioActive
                ? 'bg-amber-50 text-amber-900 border-amber-300 font-extrabold'
                : 'bg-white hover:bg-[#F8FAF9] text-[#17201C] border-[#DDE5E1]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-600" />
            <span>Weather Simulator</span>
            {isScenarioActive && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}
          </button>

          {/* Sync Refresh */}
          {onRefreshLive && (
            <button
              onClick={onRefreshLive}
              disabled={isLiveLoading}
              className="p-2.5 rounded-xl bg-white hover:bg-[#F8FAF9] border border-[#DDE5E1] text-[#059669] transition shadow-xs"
              title="Sync Ground-Truth Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${isLiveLoading ? 'animate-spin' : ''}`} />
            </button>
          )}

        </div>
      </div>

      {/* "Weather Simulator" Scenario Simulation Bar */}
      {isSimulatorOpen && (
        <div className="bg-gradient-to-r from-amber-500/5 via-emerald-500/5 to-sky-500/5 border border-amber-200/80 rounded-3xl p-5 space-y-4 shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-extrabold text-[#17201C] uppercase tracking-wider">
                Interactive Weather Simulator & Scenario Testing
              </span>
            </div>
            {isScenarioActive && (
              <button
                onClick={handleResetSimulator}
                className="px-3 py-1 rounded-xl bg-white hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1 transition shadow-xs"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Current Weather</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            
            {/* Temperature Delta Slider */}
            <div className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-[#DDE5E1]">
              <div className="flex justify-between font-bold">
                <span className="text-[#64706A]">Temperature Adjustment:</span>
                <span className={simTempOffset > 0 ? 'text-rose-600' : simTempOffset < 0 ? 'text-sky-600' : 'text-[#17201C]'}>
                  {simTempOffset > 0 ? `+${simTempOffset}` : simTempOffset}°C
                </span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.5"
                value={simTempOffset}
                onChange={(e) => setSimTempOffset(parseFloat(e.target.value))}
                className="w-full accent-[#059669] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#64706A]">
                <span>-5°C (Cooler)</span>
                <span>0°C (Normal)</span>
                <span>+5°C (Warmer)</span>
              </div>
            </div>

            {/* Moisture Delta Slider */}
            <div className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-[#DDE5E1]">
              <div className="flex justify-between font-bold">
                <span className="text-[#64706A]">Humidity Adjustment:</span>
                <span className={simHumidityOffset > 0 ? 'text-[#059669]' : simHumidityOffset < 0 ? 'text-amber-600' : 'text-[#17201C]'}>
                  {simHumidityOffset > 0 ? `+${simHumidityOffset}` : simHumidityOffset}%
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="5"
                value={simHumidityOffset}
                onChange={(e) => setSimHumidityOffset(parseInt(e.target.value, 10))}
                className="w-full accent-[#059669] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#64706A]">
                <span>-30% (Drier)</span>
                <span>0% (Normal)</span>
                <span>+30% (Moister)</span>
              </div>
            </div>

            {/* Barometric Pressure Delta Slider */}
            <div className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-[#DDE5E1]">
              <div className="flex justify-between font-bold">
                <span className="text-[#64706A]">Air Pressure Adjustment:</span>
                <span className={simPressureOffset < 0 ? 'text-purple-600' : simPressureOffset > 0 ? 'text-[#059669]' : 'text-[#17201C]'}>
                  {simPressureOffset > 0 ? `+${simPressureOffset}` : simPressureOffset} hPa
                </span>
              </div>
              <input
                type="range"
                min="-15"
                max="10"
                step="1"
                value={simPressureOffset}
                onChange={(e) => setSimPressureOffset(parseInt(e.target.value, 10))}
                className="w-full accent-[#059669] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#64706A]">
                <span>-15 hPa (Low Pressure)</span>
                <span>0 hPa (Normal)</span>
                <span>+10 hPa (High Pressure)</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Main Grid: 8 Cols Core Predictive AI Studio + 4 Cols 38-District Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 cols): Interactive Trajectory Chart & AI Diagnostics */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Station & AI Model Confidence Overview */}
          <div className="bg-white border border-[#DDE5E1] rounded-3xl p-5 space-y-4 shadow-sm">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE5E1] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#059669]" />
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#17201C] tracking-tight">
                    {activeCity.district}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#047857] text-[10px] font-bold uppercase">
                    {activeCity.regionType.replace('-', ' ')}
                  </span>
                </div>
                <div className="text-xs text-[#64706A] mt-0.5">
                  Station {activeCity.name} · Altitude {activeCity.elevationM}m ASL · Lat {activeCity.lat.toFixed(2)}°N, Lon {activeCity.lon.toFixed(2)}°E
                </div>
              </div>

              {/* Model Confidence & Accuracy Metrics */}
              <div className="flex items-center gap-2 bg-[#F8FAF9] px-3.5 py-2 rounded-2xl border border-[#DDE5E1] text-xs">
                <div>
                  <div className="text-[10px] text-[#64706A] font-medium">Confidence</div>
                  <div className="font-extrabold text-[#059669]">{prediction.confidenceScore}%</div>
                </div>
                <div className="h-6 w-px bg-[#DDE5E1]" />
                <div>
                  <div className="text-[10px] text-[#64706A] font-medium">RMSE</div>
                  <div className="font-extrabold text-[#17201C]">±{prediction.rmseC}°C</div>
                </div>
                <div className="h-6 w-px bg-[#DDE5E1]" />
                <div>
                  <div className="text-[10px] text-[#64706A] font-medium">Latency</div>
                  <div className="font-extrabold text-[#17201C]">{prediction.inferenceTimeMs}ms</div>
                </div>
              </div>
            </div>

            {/* Forecast Trajectory Chart (SVG) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#17201C]">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#059669]" />
                  <span>Predicted Temperature Curve & Expected Range</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-[#64706A]">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-100 border border-emerald-300" />
                    <span>Expected Range</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-1 rounded-full bg-amber-500" />
                    <span>Forecast Path</span>
                  </span>
                </div>
              </div>

              <div className="bg-[#F8FAF9] border border-[#DDE5E1] rounded-2xl p-4 overflow-x-auto relative">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-44 sm:h-52 overflow-visible"
                >
                  <defs>
                    <linearGradient id="aiConfidenceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.30" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="aiLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="50%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[minTemp, Math.round((minTemp + maxTemp) / 2), maxTemp].map((tVal, tIdx) => {
                    const y = paddingY + usableHeight - ((tVal - minTemp) / tempRange) * usableHeight;
                    return (
                      <g key={tIdx}>
                        <line
                          x1={paddingX}
                          y1={y}
                          x2={chartWidth - paddingX}
                          y2={y}
                          stroke="#E2E8F0"
                          strokeDasharray="4 4"
                          strokeWidth="1"
                        />
                        <text
                          x={paddingX - 6}
                          y={y + 3}
                          textAnchor="end"
                          className="text-[9px] fill-[#64706A] font-mono font-bold"
                        >
                          {tVal}°
                        </text>
                      </g>
                    );
                  })}

                  {/* Shaded Confidence Interval Band */}
                  <path d={areaPath} fill="url(#aiConfidenceGradient)" />

                  {/* Main Predicted Temperature Line */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="url(#aiLineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Interactive Points on the Curve */}
                  {points.map((pt, idx) => {
                    const isSelected = selectedStepIdx === idx;
                    return (
                      <g
                        key={idx}
                        className="cursor-pointer group"
                        onClick={() => setSelectedStepIdx(idx)}
                      >
                        {/* Hover Halo */}
                        {isSelected && (
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="8"
                            fill="#059669"
                            fillOpacity="0.25"
                            className="animate-ping"
                          />
                        )}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isSelected ? '5' : '3.5'}
                          fill={isSelected ? '#047857' : '#FFFFFF'}
                          stroke={isSelected ? '#059669' : '#D97706'}
                          strokeWidth="2"
                          className="transition-all transform group-hover:scale-125"
                        />
                        {/* Temperature Label above point */}
                        <text
                          x={pt.x}
                          y={pt.y - 8}
                          textAnchor="middle"
                          className={`text-[9px] font-mono font-bold ${
                            isSelected ? 'fill-[#047857] font-black' : 'fill-[#17201C]'
                          }`}
                        >
                          {pt.step.predictedTempC}°
                        </text>
                        {/* Time Label on X axis */}
                        <text
                          x={pt.x}
                          y={chartHeight - 4}
                          textAnchor="middle"
                          className={`text-[8px] font-mono ${
                            isSelected ? 'fill-[#047857] font-bold' : 'fill-[#64706A]'
                          }`}
                        >
                          {pt.step.timeLabel}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Selected Hourly Step Inspector */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-sky-500/10 border border-emerald-200/80 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl bg-[#059669] text-white text-xs font-bold">
                    T + {activeStep.hourOffset}h ({activeStep.timeLabel})
                  </span>
                  <span className="text-xs font-bold text-[#17201C]">
                    {activeStep.conditionText}
                  </span>
                </div>
                <div className="text-xs text-[#64706A]">
                  Expected Range: <strong className="text-[#17201C]">{activeStep.lowerConfidenceTempC}°C – {activeStep.upperConfidenceTempC}°C</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                <div className="bg-white p-2.5 rounded-xl border border-[#DDE5E1]">
                  <div className="text-[10px] text-[#64706A] uppercase font-semibold">Temperature</div>
                  <div className="text-lg font-black text-[#17201C]">{activeStep.predictedTempC}°C</div>
                  <div className="text-[10px] text-[#64706A]">Feels like: {activeStep.heatIndexC}°C</div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-[#DDE5E1]">
                  <div className="text-[10px] text-[#64706A] uppercase font-semibold">Rain Chance</div>
                  <div className="text-lg font-black text-sky-700">{activeStep.precipitationProb}%</div>
                  <div className="text-[10px] text-[#64706A]">Humidity: {activeStep.predictedHumidityPct}%</div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-[#DDE5E1]">
                  <div className="text-[10px] text-[#64706A] uppercase font-semibold">Wind Speed</div>
                  <div className="text-lg font-black text-[#047857]">{activeStep.predictedWindKmh} km/h</div>
                  <div className="text-[10px] text-[#64706A]">Breeze / Airflow</div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-[#DDE5E1]">
                  <div className="text-[10px] text-[#64706A] uppercase font-semibold">Air Pressure</div>
                  <div className="text-lg font-black text-indigo-700">{activeStep.predictedPressureHpa} hPa</div>
                  <div className="text-[10px] text-[#64706A]">Barometer</div>
                </div>
              </div>
            </div>

          </div>

          {/* AI Weather Alerts & Advisories Card */}
          <div className="bg-white border border-[#DDE5E1] rounded-3xl p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#DDE5E1] pb-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-extrabold text-[#17201C] uppercase tracking-wider">
                Weather Alerts & Early Warnings
              </span>
            </div>

            <div className="space-y-2.5">
              {prediction.anomalyAlerts.map((alert, aIdx) => {
                const isCrit = alert.severity === 'critical';
                const isHigh = alert.severity === 'high';
                const isMod = alert.severity === 'moderate';

                return (
                  <div
                    key={aIdx}
                    className={`p-4 rounded-2xl border space-y-1.5 text-xs transition ${
                      isCrit
                        ? 'bg-rose-50 border-rose-200 text-rose-950'
                        : isHigh
                        ? 'bg-amber-50 border-amber-200 text-amber-950'
                        : isMod
                        ? 'bg-sky-50 border-sky-200 text-sky-950'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        {isCrit || isHigh ? (
                          <AlertTriangle className={`w-4 h-4 ${isCrit ? 'text-rose-600' : 'text-amber-600'}`} />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-[#059669]" />
                        )}
                        <span className="font-black text-sm">{alert.title}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-black/10">
                        Timing: {alert.timeWindow}
                      </span>
                    </div>

                    <p className="text-xs opacity-90">{alert.description}</p>

                    <div className="pt-1.5 border-t border-black/5 flex items-start gap-1.5 font-medium text-[11px]">
                      <span className="font-bold">Advice:</span>
                      <span>{alert.recommendation}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Weather Drivers & Influencing Factors (Explainable AI) */}
          <div className="bg-white border border-[#DDE5E1] rounded-3xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#DDE5E1] pb-2.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#059669]" />
                <span className="text-xs font-extrabold text-[#17201C] uppercase tracking-wider">
                  Key Weather Drivers & Influencing Factors
                </span>
              </div>
              <span className="text-[10px] text-[#64706A]">AI Influence Breakdown</span>
            </div>

            <div className="space-y-3">
              {prediction.xaiFactors.map((factor, fIdx) => (
                <div key={fIdx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-[#17201C]">{factor.name}</span>
                    <span className="text-[#059669] font-mono">{factor.weightPct}% Influence</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-[#E8F0EC] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#047857] transition-all duration-500"
                      style={{ width: `${factor.weightPct}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-[#64706A]">
                    {factor.impactDescription}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Quick 38-District Focus & Selector */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white border border-[#DDE5E1] rounded-3xl p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#DDE5E1] pb-2.5">
              <span className="text-xs font-extrabold text-[#17201C] uppercase tracking-wider">
                Select District
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857]">
                38 Districts
              </span>
            </div>

            {/* Search */}
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

            {/* 38 Districts Scrollable List */}
            <div className="space-y-1.5 overflow-y-auto max-h-[460px] pr-1">
              {filteredDistricts.map((c) => {
                const isSelected = selectedDistrict.toLowerCase() === c.district.toLowerCase();
                const liveObj = liveDistrictData.find(
                  (d) => d.district?.toLowerCase() === c.district.toLowerCase() || d.cityName?.toLowerCase().includes(c.name.toLowerCase())
                );
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedDistrict(c.district);
                      setSelectedStepIdx(0);
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between text-xs group cursor-pointer ${
                      isSelected
                        ? 'bg-[#ECFDF5] border-[#059669] text-[#047857] font-bold shadow-xs'
                        : 'bg-[#F8FAF9] hover:bg-white border-[#DDE5E1] text-[#17201C]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#059669]' : 'bg-[#DDE5E1]'} group-hover:scale-125 transition`} />
                      <div>
                        <div className="font-bold">{c.district}</div>
                        <div className="text-[10px] text-[#64706A] font-normal">
                          {c.regionType.replace('-', ' ')} · {c.elevationM}m
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-bold">
                      {liveObj && (
                        <span className="font-mono text-[#059669]">
                          {liveObj.temperatureC.toFixed(1)}°C
                        </span>
                      )}
                      <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#059669]' : 'text-[#64706A]'} group-hover:translate-x-0.5 transition`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Specification Footnote */}
          <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1] space-y-2 text-xs text-[#64706A]">
            <div className="flex items-center gap-1.5 font-bold text-[#17201C] text-[11px]">
              <Info className="w-3.5 h-3.5 text-[#059669]" />
              <span>About This Forecast Model</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Trained on meteorological records and real-time station telemetry across Tamil Nadu's agro-climatic zones for high-precision local forecasting.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
