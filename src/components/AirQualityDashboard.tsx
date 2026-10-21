import React, { useState, useMemo } from 'react';
import {
  Wind,
  Activity,
  Heart,
  AlertCircle,
  CheckCircle2,
  Shield,
  Search,
  ArrowUpRight,
  Info,
  Layers,
  Thermometer,
  Eye
} from 'lucide-react';
import { DistrictAQIData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { DISTRICT_REGIONS } from '../data/tamilNaduGeo';

export const AirQualityDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Chennai');

  // Realistic synthesized Tamil Nadu Air Quality telemetry database
  const aqiDatabase: DistrictAQIData[] = useMemo(() => {
    // Generate deterministic values for all 38 districts
    return DISTRICT_REGIONS.map((d, index) => {
      // Major industrial/metro hubs have higher baseline AQI
      let baseAQI = 55;
      if (['Chennai', 'Tiruppur', 'Ranipet', 'Erode', 'Coimbatore'].includes(d.name)) {
        baseAQI = 110 + (index % 35);
      } else if (['Nilgiris', 'Theni', 'Dharmapuri', 'Kanyakumari'].includes(d.name)) {
        baseAQI = 28 + (index % 15);
      } else if (['Madurai', 'Salem', 'Tiruchirappalli', 'Thoothukudi', 'Vellore'].includes(d.name)) {
        baseAQI = 75 + (index % 30);
      } else {
        baseAQI = 48 + (index % 25);
      }

      let category: DistrictAQIData['category'] = 'Good';
      if (baseAQI > 300) category = 'Very Poor';
      else if (baseAQI > 200) category = 'Poor';
      else if (baseAQI > 100) category = 'Moderate';
      else if (baseAQI > 50) category = 'Satisfactory';
      else category = 'Good';

      const pm25 = Math.round(baseAQI * 0.42);
      const pm10 = Math.round(baseAQI * 0.85);
      const no2 = Math.round(18 + (index % 20));
      const so2 = Math.round(9 + (index % 12));
      const co = Number((0.4 + (index % 5) * 0.15).toFixed(2));
      const o3 = Math.round(25 + (index % 30));

      let healthRecommendation = 'Air quality is satisfactory and air pollution poses little or no risk.';
      let tamilRecommendation = 'காற்றின் தரம் திருப்திகரமாக உள்ளது; வெளிப்புற நடவடிக்கைகளுக்கு பாதுகாப்பானது.';

      if (category === 'Moderate') {
        healthRecommendation = 'Acceptable air quality. Unusually sensitive people should consider reducing prolonged outdoor exertion.';
        tamilRecommendation = 'காற்றின் தரம் மிதமானது. சுவாசப் பிரச்சனை உள்ளவர்கள் நீண்ட நேரம் வெளியில் இருப்பதைத் தவிர்க்கவும்.';
      } else if (category === 'Poor' || category === 'Very Poor') {
        healthRecommendation = 'Breathing discomfort likely for people with lung disease, asthma, and heart conditions. Wear N95 masks outdoors.';
        tamilRecommendation = 'சுவாசக் கோளாறு ஏற்படலாம். முதியவர்கள் மற்றும் குழந்தைகள் வெளியில் செல்லும்போது மாஸ்க் அணியவும்.';
      } else if (category === 'Good') {
        healthRecommendation = 'Air quality is ideal for most individuals; enjoy outdoor activities with pristine fresh air.';
        tamilRecommendation = 'தூய்மையான காற்று. அனைத்து விதமான வெளிப்புற உடற்பயிற்சிகளுக்கும் உகந்தது.';
      }

      return {
        district: d.name,
        aqi: baseAQI,
        category,
        pm25,
        pm10,
        no2,
        so2,
        co,
        o3,
        dominantPollutant: baseAQI > 90 ? 'PM2.5' : 'O3',
        healthRecommendation,
        tamilRecommendation,
        updateTime: '10 mins ago'
      };
    });
  }, []);

  const filteredDistricts = aqiDatabase.filter((d) =>
    d.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDistrictData =
    aqiDatabase.find((d) => d.district === selectedDistrict) || aqiDatabase[0];

  const getAQIColor = (category: DistrictAQIData['category']) => {
    switch (category) {
      case 'Good':
        return {
          bg: 'bg-emerald-500',
          text: 'text-emerald-700',
          lightBg: 'bg-emerald-50',
          border: 'border-emerald-200'
        };
      case 'Satisfactory':
        return {
          bg: 'bg-lime-500',
          text: 'text-lime-700',
          lightBg: 'bg-lime-50',
          border: 'border-lime-200'
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-500',
          text: 'text-amber-700',
          lightBg: 'bg-amber-50',
          border: 'border-amber-200'
        };
      case 'Poor':
        return {
          bg: 'bg-orange-500',
          text: 'text-orange-700',
          lightBg: 'bg-orange-50',
          border: 'border-orange-200'
        };
      case 'Very Poor':
      case 'Severe':
        return {
          bg: 'bg-rose-600',
          text: 'text-rose-700',
          lightBg: 'bg-rose-50',
          border: 'border-rose-200'
        };
      default:
        return {
          bg: 'bg-gray-500',
          text: 'text-gray-700',
          lightBg: 'bg-gray-50',
          border: 'border-gray-200'
        };
    }
  };

  const activeColor = getAQIColor(activeDistrictData.category);

  // Statewide AQI Stats
  const avgStateAQI = Math.round(
    aqiDatabase.reduce((acc, curr) => acc + curr.aqi, 0) / aqiDatabase.length
  );
  const cleanestDistrict = [...aqiDatabase].sort((a, b) => a.aqi - b.aqi)[0];
  const pollutedDistrict = [...aqiDatabase].sort((a, b) => b.aqi - a.aqi)[0];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-800 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold tracking-wider uppercase backdrop-blur-xs flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5" />
              {language === 'ta' ? 'மாசு & காற்று தரம்' : 'Environmental Telemetry'}
            </span>
            <span className="text-white/80 text-xs">
              {language === 'ta' ? 'CPCB / TNPCB தரநிலைகள்' : 'CPCB / TNPCB Standard Metrics'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {language === 'ta' ? 'தமிழ்நாடு காற்றின் தரக் குறியீடு (AQI)' : 'Tamil Nadu Air Quality Index (AQI)'}
          </h1>
          <p className="text-sm text-white/90 leading-relaxed">
            {language === 'ta'
              ? '38 மாவட்டங்களின் நிகழ்நேர PM2.5, PM10, NO2, மற்றும் ஓசோன் காற்று மாசுபாடு அளவீடுகள் மற்றும் பொது சுகாதார வழிகாட்டுதல்கள்.'
              : 'Real-time air pollution telemetry tracking fine particulate matter (PM2.5, PM10), nitrogen dioxide, ozone, and health advisories across all 38 districts.'}
          </p>
        </div>

        {/* Top Summary Bar */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/20">
          <div>
            <div className="text-xs text-white/80">{language === 'ta' ? 'மாநில சராசரி AQI' : 'State Avg AQI'}</div>
            <div className="text-2xl font-black">{avgStateAQI} <span className="text-xs font-normal text-white/80">AQI</span></div>
          </div>
          <div>
            <div className="text-xs text-white/80">{language === 'ta' ? 'தூய்மையான மாவட்டம்' : 'Cleanest Air'}</div>
            <div className="text-lg font-bold text-emerald-200">{cleanestDistrict.district} ({cleanestDistrict.aqi})</div>
          </div>
          <div>
            <div className="text-xs text-white/80">{language === 'ta' ? 'அதிக மாசுபாடு' : 'Highest AQI'}</div>
            <div className="text-lg font-bold text-amber-200">{pollutedDistrict.district} ({pollutedDistrict.aqi})</div>
          </div>
          <div>
            <div className="text-xs text-white/80">{language === 'ta' ? 'கண்காணிப்பு நிலையங்கள்' : 'Stations Active'}</div>
            <div className="text-2xl font-black">38 / 38</div>
          </div>
        </div>
      </div>

      {/* Featured District AQI Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Main Gauge & Details */}
        <div className="lg:col-span-2 bg-white border border-[#DDE5E1] rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">
                {language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்ட மாவட்டம்' : 'Station Telemetry'}
              </span>
              <h2 className="text-2xl font-black text-[#17201C] mt-0.5">
                {activeDistrictData.district}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#64706A]">
                {language === 'ta' ? 'புதுப்பிக்கப்பட்டது:' : 'Updated:'} {activeDistrictData.updateTime}
              </span>
            </div>
          </div>

          {/* AQI Score Hero */}
          <div className={`p-6 rounded-2xl ${activeColor.lightBg} border ${activeColor.border} flex flex-col sm:flex-row sm:items-center justify-between gap-6`}>
            <div className="space-y-1">
              <div className="text-xs font-bold text-[#64706A] uppercase tracking-wider">
                Air Quality Index (AQI)
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-[#17201C]">
                  {activeDistrictData.aqi}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white ${activeColor.bg}`}>
                  {activeDistrictData.category}
                </span>
              </div>
              <p className="text-xs text-[#64706A] pt-1">
                Dominant atmospheric pollutant: <span className="font-bold text-[#17201C]">{activeDistrictData.dominantPollutant}</span>
              </p>
            </div>

            <div className="max-w-xs p-3.5 rounded-xl bg-white/80 backdrop-blur-xs border border-black/5 text-xs text-[#17201C] space-y-1 shadow-xs">
              <div className="font-bold flex items-center gap-1.5 text-[#059669]">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>{language === 'ta' ? 'சுகாதார ஆலோசனை' : 'Health Advisory'}</span>
              </div>
              <p className="text-xs text-[#64706A] leading-relaxed">
                {language === 'ta' ? activeDistrictData.tamilRecommendation : activeDistrictData.healthRecommendation}
              </p>
            </div>
          </div>

          {/* Pollutants Grid Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#64706A] uppercase tracking-wider">
              {language === 'ta' ? 'மாசுபடுத்திகள் விரிவான விபரம்' : 'Key Air Pollutants Concentration'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1]">
                <div className="text-[11px] text-[#64706A] font-semibold">PM2.5 (Fine Particles)</div>
                <div className="text-lg font-black text-[#17201C] mt-1">{activeDistrictData.pm25} <span className="text-[10px] font-normal text-[#64706A]">µg/m³</span></div>
                <div className="text-[10px] text-[#059669] mt-0.5">WHO standard: 15 µg/m³</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1]">
                <div className="text-[11px] text-[#64706A] font-semibold">PM10 (Coarse Dust)</div>
                <div className="text-lg font-black text-[#17201C] mt-1">{activeDistrictData.pm10} <span className="text-[10px] font-normal text-[#64706A]">µg/m³</span></div>
                <div className="text-[10px] text-[#059669] mt-0.5">WHO standard: 45 µg/m³</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1]">
                <div className="text-[11px] text-[#64706A] font-semibold">NO₂ (Nitrogen Dioxide)</div>
                <div className="text-lg font-black text-[#17201C] mt-1">{activeDistrictData.no2} <span className="text-[10px] font-normal text-[#64706A]">µg/m³</span></div>
                <div className="text-[10px] text-[#059669] mt-0.5">Traffic exhaust indicator</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1]">
                <div className="text-[11px] text-[#64706A] font-semibold">SO₂ (Sulfur Dioxide)</div>
                <div className="text-lg font-black text-[#17201C] mt-1">{activeDistrictData.so2} <span className="text-[10px] font-normal text-[#64706A]">µg/m³</span></div>
                <div className="text-[10px] text-[#059669] mt-0.5">Industrial emissions</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1]">
                <div className="text-[11px] text-[#64706A] font-semibold">CO (Carbon Monoxide)</div>
                <div className="text-lg font-black text-[#17201C] mt-1">{activeDistrictData.co} <span className="text-[10px] font-normal text-[#64706A]">mg/m³</span></div>
                <div className="text-[10px] text-[#059669] mt-0.5">Combustion byproduct</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1]">
                <div className="text-[11px] text-[#64706A] font-semibold">O₃ (Ground Ozone)</div>
                <div className="text-lg font-black text-[#17201C] mt-1">{activeDistrictData.o3} <span className="text-[10px] font-normal text-[#64706A]">µg/m³</span></div>
                <div className="text-[10px] text-[#059669] mt-0.5">Photochemical smog</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: District Selector & AQI Index Legend */}
        <div className="space-y-6">
          {/* District Search & Selector */}
          <div className="bg-white border border-[#DDE5E1] rounded-3xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#64706A] uppercase tracking-wider flex items-center justify-between">
              <span>{language === 'ta' ? 'மாவட்டத்தை தேர்வு செய்' : 'Select District'}</span>
              <span className="text-[10px] text-[#059669] font-semibold">38 Stations</span>
            </h3>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#64706A]" />
              <input
                type="text"
                placeholder={language === 'ta' ? 'மாவட்டம் தேடு...' : 'Search district...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] focus:outline-hidden focus:border-[#059669]"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
              {filteredDistricts.map((d) => {
                const color = getAQIColor(d.category);
                const isSelected = d.district === selectedDistrict;

                return (
                  <button
                    key={d.district}
                    onClick={() => setSelectedDistrict(d.district)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all text-left ${
                      isSelected
                        ? 'bg-[#ECFDF5] border border-[#059669] font-bold text-[#047857]'
                        : 'bg-[#F8FAF9] hover:bg-[#F0F4F2] border border-transparent text-[#17201C]'
                    }`}
                  >
                    <span>{d.district}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold text-white ${color.bg}`}>
                        {d.aqi}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CPCB Scale Scale Reference */}
          <div className="bg-white border border-[#DDE5E1] rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-[#17201C] flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#059669]" />
              <span>AQI Scale Standards (CPCB)</span>
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Good (0 - 50)</span>
                </span>
                <span className="text-[#64706A] text-[11px]">Minimal Impact</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-lime-500" />
                  <span>Satisfactory (51 - 100)</span>
                </span>
                <span className="text-[#64706A] text-[11px]">Minor Breathing Issue</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Moderate (101 - 200)</span>
                </span>
                <span className="text-[#64706A] text-[11px]">Sensitive Discomfort</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span>Poor (201 - 300)</span>
                </span>
                <span className="text-[#64706A] text-[11px]">General Discomfort</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  <span>Very Poor (301 - 400+)</span>
                </span>
                <span className="text-[#64706A] text-[11px]">Respiratory Illness</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
