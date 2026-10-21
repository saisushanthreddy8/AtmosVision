import React, { useState, useMemo } from 'react';
import {
  Bug,
  AlertTriangle,
  Shield,
  Sprout,
  Droplets,
  Thermometer,
  Wind,
  Search,
  Filter,
  CheckCircle,
  ExternalLink,
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';
import { LiveDistrictWeather } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { PEST_DISEASE_DATABASE, calculatePestRisk, PestDiseaseEntry } from '../data/pestDiseaseData';

interface PestRiskPredictorProps {
  liveDistrictData: LiveDistrictWeather[];
  initialDistrict?: string;
  onSelectDistrict?: (districtName: string) => void;
}

export const PestRiskPredictor: React.FC<PestRiskPredictorProps> = ({
  liveDistrictData,
  initialDistrict = 'Thanjavur',
  onSelectDistrict
}) => {
  const { language, t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict);
  const [cropFilter, setCropFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentDistrictWeather = useMemo(() => {
    return (
      liveDistrictData.find((d) => d.district === selectedDistrict) ||
      liveDistrictData[0] ||
      null
    );
  }, [liveDistrictData, selectedDistrict]);

  // Current month (0-indexed)
  const currentMonth = new Date().getMonth();

  // Evaluate risk scores for all pests against current weather
  const evaluatedPests = useMemo(() => {
    if (!currentDistrictWeather) return [];
    const temperatureC = currentDistrictWeather.temperatureC ?? 28;
    const humidityPct = currentDistrictWeather.relativeHumidityPct ?? 65;
    const precipitationMm = currentDistrictWeather.precipitationMm ?? 0;
    const windSpeedKmh = currentDistrictWeather.windSpeedKmh ?? 12;

    return PEST_DISEASE_DATABASE.map((pest) => {
      const risk = calculatePestRisk(
        pest,
        temperatureC,
        humidityPct,
        precipitationMm,
        windSpeedKmh,
        currentMonth
      );
      return {
        ...pest,
        riskScore: risk.riskScore,
        riskLevel: risk.riskLevel,
        factors: risk.factors
      };
    }).sort((a, b) => b.riskScore - a.riskScore);
  }, [currentDistrictWeather, currentMonth]);

  // Filtered pests
  const filteredPests = useMemo(() => {
    return evaluatedPests.filter((pest) => {
      if (cropFilter !== 'all' && !pest.affectedCrops.some((c) => c.toLowerCase().includes(cropFilter.toLowerCase()))) {
        return false;
      }
      if (riskFilter !== 'all' && pest.riskLevel !== riskFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = pest.name.toLowerCase().includes(q) || pest.tamilName.toLowerCase().includes(q);
        const matchesCrop = pest.affectedCrops.some((c) => c.toLowerCase().includes(q));
        if (!matchesName && !matchesCrop) return false;
      }
      return true;
    });
  }, [evaluatedPests, cropFilter, riskFilter, searchQuery]);

  const highRiskCount = evaluatedPests.filter((p) => p.riskLevel === 'high' || p.riskLevel === 'critical').length;

  const getRiskBadge = (level: string, score: number) => {
    switch (level) {
      case 'critical':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-200 flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            {language === 'ta' ? `தீவிரம் (${score}%)` : `Critical (${score}%)`}
          </span>
        );
      case 'high':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            {language === 'ta' ? `அதிகம் (${score}%)` : `High (${score}%)`}
          </span>
        );
      case 'moderate':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800 border border-yellow-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            {language === 'ta' ? `மிதமான (${score}%)` : `Moderate (${score}%)`}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {language === 'ta' ? `குறைவு (${score}%)` : `Low (${score}%)`}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-700 via-green-700 to-teal-800 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold tracking-wider uppercase backdrop-blur-xs flex items-center gap-1.5">
              <Bug className="w-3.5 h-3.5" />
              {language === 'ta' ? 'பயிர் பாதுகாப்பு கணிப்பு' : 'Agri-Meteorological Biosecurity'}
            </span>
            <span className="text-white/80 text-xs">
              {language === 'ta' ? 'TNAU & வானிலை தொடர்பு மாதிரி' : 'TNAU Correlated Outbreak Predictor'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {language === 'ta' ? 'பயிர் பூச்சி & நோய் பாதிப்பு கணிப்பான்' : 'Crop Pest & Disease Risk Predictor'}
          </h1>
          <p className="text-sm text-white/90 leading-relaxed">
            {language === 'ta'
              ? 'நிகழ்நேர வெப்பநிலை, காற்றின் ஈரப்பதம் மற்றும் மழைப்பொழிவின் அடிப்படையில் பயிர் நோய்கள் மற்றும் பூச்சித் தாக்குதல்களை முன்கூட்டியே கண்டறிந்து தடுக்கும் நுண்ணறிவு மாதிரி.'
              : 'Empirical epidemiology engine correlating real-time synoptic temperatures, relative humidity, and rainfall to forecast pest outbreaks and fungal spread.'}
          </p>
        </div>

        {/* Station Selector Bar */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/80">{language === 'ta' ? 'கண்காணிப்பு மாவட்டம்:' : 'District Telemetry:'}</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/20 border border-white/30 text-white focus:outline-hidden backdrop-blur-xs cursor-pointer"
            >
              {liveDistrictData.map((d) => (
                <option key={d.district} value={d.district} className="text-gray-900">
                  {d.district} ({d.temperatureC ?? 28}°C · {d.relativeHumidityPct ?? 65}%)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-white/80">{language === 'ta' ? 'அதிக ஆபத்து:' : 'Elevated Risks:'} </span>
              <span className="font-bold text-amber-200">{highRiskCount} Pests</span>
            </div>
            <div>
              <span className="text-white/80">{language === 'ta' ? 'பரிசோதிக்கப்பட்ட பூச்சிகள்:' : 'Catalog Total:'} </span>
              <span className="font-bold">{PEST_DISEASE_DATABASE.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Telemetry Ribbon for Selected District */}
      {currentDistrictWeather && (
        <div className="bg-white border border-[#DDE5E1] rounded-2xl p-4 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Thermometer className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[#64706A] text-[10px] uppercase font-semibold">{language === 'ta' ? 'வெப்பநிலை' : 'Ambient Temp'}</div>
              <div className="text-sm font-bold text-[#17201C]">{currentDistrictWeather.temperatureC ?? 28}°C</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[#64706A] text-[10px] uppercase font-semibold">{language === 'ta' ? 'ஈரப்பதம்' : 'Air Moisture'}</div>
              <div className="text-sm font-bold text-[#17201C]">{currentDistrictWeather.relativeHumidityPct ?? 65}%</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-200">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[#64706A] text-[10px] uppercase font-semibold">{language === 'ta' ? 'காற்றின் வேகம்' : 'Wind Speed'}</div>
              <div className="text-sm font-bold text-[#17201C]">{currentDistrictWeather.windSpeedKmh ?? 12} km/h</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[#64706A] text-[10px] uppercase font-semibold">{language === 'ta' ? 'தெளிப்பு உகந்த நேரம்' : 'Spray Window'}</div>
              <div className="text-sm font-bold text-[#059669]">
                {(currentDistrictWeather.windSpeedKmh ?? 12) < 15 ? 'Optimal (Now)' : 'Avoid (Windy)'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#DDE5E1] rounded-2xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#64706A] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            {language === 'ta' ? 'பயிர்:' : 'Crop:'}
          </span>
          {['all', 'Rice', 'Cotton', 'Maize', 'Sugarcane', 'Banana'].map((c) => (
            <button
              key={c}
              onClick={() => setCropFilter(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                cropFilter === c
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'bg-[#F8FAF9] text-[#64706A] hover:bg-[#F0F4F2] border border-[#DDE5E1]'
              }`}
            >
              {c === 'all' ? (language === 'ta' ? 'அனைத்து பயிர்கள்' : 'All Crops') : c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#64706A]" />
            <input
              type="text"
              placeholder={language === 'ta' ? 'பூச்சி / நோய் தேடு...' : 'Search pest or disease...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] focus:outline-hidden focus:border-[#059669]"
            />
          </div>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F8FAF9] border border-[#DDE5E1] text-[#17201C] focus:outline-hidden"
          >
            <option value="all">{language === 'ta' ? 'அனைத்து ஆபத்து நிலைகள்' : 'All Risk Levels'}</option>
            <option value="critical">{language === 'ta' ? 'தீவிரம் (Critical)' : 'Critical'}</option>
            <option value="high">{language === 'ta' ? 'அதிகம் (High)' : 'High'}</option>
            <option value="moderate">{language === 'ta' ? 'மிதமான (Moderate)' : 'Moderate'}</option>
            <option value="low">{language === 'ta' ? 'குறைவு (Low)' : 'Low'}</option>
          </select>
        </div>
      </div>

      {/* Pest Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPests.map((pest) => (
          <div
            key={pest.id}
            className={`p-5 rounded-3xl bg-white border transition-all duration-200 shadow-xs hover:shadow-md space-y-4 ${
              pest.riskLevel === 'critical'
                ? 'border-red-300 ring-1 ring-red-200'
                : pest.riskLevel === 'high'
                ? 'border-orange-300'
                : 'border-[#DDE5E1]'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1]">
                  {pest.iconEmoji}
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#17201C]">
                    {language === 'ta' ? pest.tamilName : pest.name}
                  </h3>
                  <div className="text-xs text-[#64706A] flex flex-wrap items-center gap-1.5 mt-0.5">
                    <span className="capitalize font-semibold text-[#059669]">{pest.type}</span>
                    <span>·</span>
                    <span>{pest.affectedCrops.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div>{getRiskBadge(pest.riskLevel, pest.riskScore)}</div>
            </div>

            {/* Risk Factors trigger matching */}
            <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] space-y-1.5 text-xs">
              <div className="text-[11px] font-bold text-[#64706A] uppercase tracking-wider">
                {language === 'ta' ? 'வானிலை தூண்டுதல் காரணிகள்' : 'Weather Trigger Alignment'}
              </div>
              <ul className="space-y-1 text-[#17201C]">
                {pest.factors.map((factor, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Symptoms & Action */}
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-[#17201C]">
                  {language === 'ta' ? 'அறிகுறிகள்:' : 'Symptoms:'}{' '}
                </span>
                <span className="text-[#64706A]">{pest.symptoms}</span>
              </div>
              <div>
                <span className="font-bold text-[#059669]">
                  {language === 'ta' ? 'தடுப்பு & சிகிச்சை முறை:' : 'Management Advisory:'}{' '}
                </span>
                <span className="text-[#17201C]">
                  {language === 'ta' ? pest.preventionTamil : pest.prevention}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
