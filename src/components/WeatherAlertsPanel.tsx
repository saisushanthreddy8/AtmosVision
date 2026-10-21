import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Flame,
  CloudRain,
  Wind,
  Waves,
  CloudLightning,
  ShieldAlert,
  PhoneCall,
  CheckCircle,
  Filter,
  Info,
  MapPin,
  ChevronRight,
  ExternalLink,
  Volume2
} from 'lucide-react';
import { LiveDistrictWeather, WeatherAlertItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface WeatherAlertsPanelProps {
  liveDistrictData: LiveDistrictWeather[];
  onSelectDistrict?: (districtName: string) => void;
}

export const WeatherAlertsPanel: React.FC<WeatherAlertsPanelProps> = ({
  liveDistrictData,
  onSelectDistrict
}) => {
  const { language, t } = useLanguage();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Dynamically synthesize realistic & active meteorological alerts based on live data
  const alerts: WeatherAlertItem[] = useMemo(() => {
    const list: WeatherAlertItem[] = [];

    // Check for high temperatures (> 36°C) -> Heatwave alert
    liveDistrictData.forEach((d) => {
      if (d.current.temperatureC >= 36) {
        list.push({
          id: `heat-${d.district}`,
          district: d.district,
          title: `Severe Heatwave Advisory · ${d.district}`,
          tamilTitle: `கடுமையான வெப்ப அலை எச்சரிக்கை · ${d.district}`,
          type: 'heatwave',
          severity: d.current.temperatureC >= 38 ? 'critical' : 'high',
          issuedAt: 'Today, 06:00 AM IST',
          validUntil: 'Today, 06:00 PM IST',
          description: `Surface telemetry records ${d.current.temperatureC}°C (Feels like ${(d.current.temperatureC + 2.5).toFixed(1)}°C). Prolonged solar exposure poses high risk of dehydration and heat stress.`,
          tamilDescription: `நிலப்பரப்பு வெப்பநிலை ${d.current.temperatureC}°C ஆக பதிவாகியுள்ளது. கடுமையான வெயில் காரணமாக நீரிழப்பு மற்றும் வெப்ப மயக்கம் ஏற்படும் வாய்ப்பு அதிகம்.`,
          precautions: [
            'Avoid direct sunlight between 11:30 AM and 03:30 PM',
            'Hydrate frequently with ORS, tender coconut water, and buttermilk',
            'Provide shade and ample hydration for livestock and outdoor poultry',
            'Schedule field irrigation during late evening or early dawn hours'
          ],
          tamilPrecautions: [
            'காலை 11:30 முதல் மாலை 03:30 வரை நேரடி வெயிலைத் தவிர்க்கவும்',
            'தண்ணீர், இளநீர், மோர் போன்றவற்றை அதிகம் அருந்தவும்',
            'கால்நடைகளுக்கு நிழல் மற்றும் குடிநீர் வசதி ஏற்படுத்தவும்',
            'பயிர்களுக்கு மாலை அல்லது அதிகாலை வேளையில் நீர் பாய்ச்சவும்'
          ],
          affectedZones: [d.district, 'Adjacent Taluks']
        });
      }

      // Check for high rainfall or rain conditions
      if (d.current.precipitationMm > 2.0 || d.current.weatherType === 'rain') {
        list.push({
          id: `rain-${d.district}`,
          district: d.district,
          title: `Intense Precipitation & Thunderstorm Warning · ${d.district}`,
          tamilTitle: `கனமழை மற்றும் இடியுடன் கூடிய மழை எச்சரிக்கை · ${d.district}`,
          type: 'heavy_rain',
          severity: d.current.precipitationMm > 15 ? 'critical' : 'high',
          issuedAt: 'Today, 08:30 AM IST',
          validUntil: 'Tomorrow, 08:30 AM IST',
          description: `Synoptic radar tracks heavy squalls with current rainfall intensity of ${d.current.precipitationMm} mm/h and high relative humidity (${d.current.humidityPct}%). Risk of localized waterlogging in low-lying croplands.`,
          tamilDescription: `ரேடார் கண்காணிப்பில் ${d.current.precipitationMm} மிமீ/மணி கனமழை பதிவாகியுள்ளது. தாழ்வான விவசாய நிலங்களில் தண்ணீர் தேங்கும் அபாயம் உள்ளது.`,
          precautions: [
            'Clear drainage channels in paddy and banana fields immediately',
            'Stay clear of electric poles, transformers, and dilapidated structures',
            'Postpone pesticide and fertilizer foliar sprays until rain subsides',
            'Keep harvested produce elevated on tarpaulins under covered sheds'
          ],
          tamilPrecautions: [
            'நெல் மற்றும் வாழை வயல்களில் வடிகால் வசதிகளை உடனடியாக சரிசெய்யவும்',
            'மின்கம்பங்கள் மற்றும் மின் கம்பிகளுக்கு அருகில் செல்ல வேண்டாம்',
            'மழை நிற்கும் வரை பூச்சிக்கொல்லி மருந்து தெளிப்பதைத் தவிர்க்கவும்',
            'அறுவடை செய்த தானியங்களை தார்பாலின் கொண்டு பாதுகாப்பாக மூடவும்'
          ],
          affectedZones: [d.district, 'Coastal & River Delta Belts']
        });
      }

      // High winds (> 25 km/h)
      if (d.current.windSpeedKmh >= 24) {
        list.push({
          id: `wind-${d.district}`,
          district: d.district,
          title: `Squally Gale Winds & Gusts · ${d.district}`,
          tamilTitle: `பலத்த தரைக்காற்று எச்சரிக்கை · ${d.district}`,
          type: 'wind',
          severity: d.current.windSpeedKmh > 35 ? 'critical' : 'moderate',
          issuedAt: 'Today, 05:00 AM IST',
          validUntil: 'Tonight, 11:00 PM IST',
          description: `Strong surface wind gusts recorded at ${d.current.windSpeedKmh} km/h along the corridor. Fisherfolk advised caution along sea and backwaters.`,
          tamilDescription: `${d.current.windSpeedKmh} கி.மீ/மணி வேகத்தில் பலத்த காற்று வீசக்கூடும் என்பதால் மீனவர்கள் கடலுக்கு செல்லும்போது எச்சரிக்கையுடன் இருக்கவும்.`,
          precautions: [
            'Provide bamboo propping for standing banana and sugarcane crops',
            'Avoid parking vehicles beneath aged trees or temporary hoardings',
            'Secure rooftop tin sheets and solar panel frames'
          ],
          tamilPrecautions: [
            'வாழை மற்றும் கரும்பு பயிர்களுக்கு மூங்கில் முட்டுக் கொடுக்கவும்',
            'பழைய மரங்கள் மற்றும் விளம்பர பலகைகள் அருகில் வாகனங்களை நிறுத்த வேண்டாம்',
            'கூரைத் தகடுகளைப் பலமாகப் பிணைக்கவும்'
          ],
          affectedZones: [d.district, 'Palk Strait / Coastal Corridor']
        });
      }
    });

    // Ensure at least 3 state-level baseline advisories if live weather is calm
    if (list.length < 3) {
      list.push({
        id: 'cyclone-coastal-watch',
        district: 'Cuddalore & Nagapattinam',
        title: 'Northeast Monsoon Coastal Trough Watch',
        tamilTitle: 'வடகிழக்கு பருவமழை கடலோர காற்றழுத்த தாழ்வு நிலை கண்காணிப்பு',
        type: 'cyclone',
        severity: 'moderate',
        issuedAt: 'Today, 06:30 AM IST',
        validUntil: 'Next 48 Hours',
        description: 'Atmospheric pressure gradient indicates steady onshore moisture influx. Squally surface winds with periodic coastal drizzles likely.',
        tamilDescription: 'வங்கக்கடலில் நிலவும் வளிமண்டல மேலடுக்கு சுழற்சி காரணமாக கடலோர மாவட்டங்களில் மிதமான மழை மற்றும் காற்று வீசக்கூடும்.',
        precautions: [
          'Fishermen venturing into deep sea advised to carry VHF radios',
          'Keep backup battery lights and essential emergency food stocked'
        ],
        tamilPrecautions: [
          'ஆழ்கடல் செல்லும் மீனவர்கள் வானொலி மற்றும் பாதுகாப்பு கருவிகளை உடன் எடுத்துச் செல்லவும்',
          'அவசர தேவைகளுக்கான பேட்டரி விளக்குகள் மற்றும் உணவுப் பொருட்களை தயார் நிலையில் வைக்கவும்'
        ],
        affectedZones: ['Nagapattinam', 'Cuddalore', 'Mayiladuthurai', 'Ramanathapuram']
      });

      list.push({
        id: 'ghats-mist-alert',
        district: 'Nilgiris & Coimbatore (Valparai)',
        title: 'Dense Fog & Mountain Road Visibility Warning',
        tamilTitle: 'அடர்ந்த பனிமூட்டம் மற்றும் மலைப்பாதை பார்வைக்குறைவு எச்சரிக்கை',
        type: 'fog',
        severity: 'low',
        issuedAt: 'Today, 04:00 AM IST',
        validUntil: 'Today, 10:00 AM IST',
        description: 'Saturated air in high-altitude tea plateau creates visibility drop below 100 meters along ghat road hair-pin bends.',
        tamilDescription: 'மலைப்பகுதிகளில் அடர்ந்த பனிமூட்டம் நிலவுவதால் வாகன ஓட்டிகள் மெதுவாக செல்லுமாறு அறிவுறுத்தப்படுகிறார்கள்.',
        precautions: [
          'Use fog headlamps and maintain safe headway on ghat passes',
          'Protect young horticultural saplings from morning frost'
        ],
        tamilPrecautions: [
          'மலைப்பாதைகளில் முகப்பு விளக்குகளைப் பயன்படுத்தி மெதுவாக செல்லவும்',
          'இளம் தோட்டக்கலை செடிகளை பனி தாக்காமல் பாதுகாக்கவும்'
        ],
        affectedZones: ['Ooty', 'Coonoor', 'Kotagiri', 'Valparai Ghats']
      });
    }

    return list;
  }, [liveDistrictData]);

  const filteredAlerts = alerts.filter((a) => {
    if (selectedSeverity !== 'all' && a.severity !== selectedSeverity) return false;
    if (selectedType !== 'all' && a.type !== selectedType) return false;
    return true;
  });

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const highCount = alerts.filter((a) => a.severity === 'high').length;

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-200 flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            {language === 'ta' ? 'தீவிரம் (Red Alert)' : 'Critical (Red Alert)'}
          </span>
        );
      case 'high':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            {language === 'ta' ? 'உயர் (Orange Alert)' : 'High (Orange Alert)'}
          </span>
        );
      case 'moderate':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800 border border-yellow-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            {language === 'ta' ? 'மிதமான (Yellow Alert)' : 'Moderate (Yellow Alert)'}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {language === 'ta' ? 'கண்காணிப்பு' : 'Advisory'}
          </span>
        );
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'heatwave':
        return <Flame className="w-5 h-5 text-amber-600" />;
      case 'heavy_rain':
        return <CloudRain className="w-5 h-5 text-blue-600" />;
      case 'cyclone':
        return <Waves className="w-5 h-5 text-indigo-600" />;
      case 'thunderstorm':
        return <CloudLightning className="w-5 h-5 text-purple-600" />;
      case 'wind':
        return <Wind className="w-5 h-5 text-teal-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none">
          <ShieldAlert className="w-56 h-56" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold tracking-wider uppercase backdrop-blur-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              {language === 'ta' ? 'நேரடி எச்சரிக்கை மையம்' : 'Live Warning Center'}
            </span>
            <span className="text-white/80 text-xs">
              {language === 'ta' ? 'தமிழ்நாடு பேரிடர் மேலாண்மை ஒருங்கிணைப்பு' : 'TN SDMA Meteorological Early Warning'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {language === 'ta' ? 'வானிலை & பேரிடர் எச்சரிக்கைகள்' : 'Weather Alerts & Disaster Warnings'}
          </h1>
          <p className="text-sm text-white/90 leading-relaxed">
            {language === 'ta'
              ? '38 மாவட்டங்களில் நிலவும் வானிலை மாறுபாடுகள், புயல் சின்னங்கள், கனமழை மற்றும் தீவிர வெப்ப அலைகளின் நிகழ்நேர எச்சரிக்கைகள் மற்றும் விவசாய வழிகாட்டுதல்கள்.'
              : 'Automated meteorological warning engine tracking cyclones, heavy monsoonal rain, heatwaves, and severe squalls across all 38 Tamil Nadu districts.'}
          </p>
        </div>

        {/* Quick Stats Banner */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/20">
          <div>
            <div className="text-xs text-white/80">{language === 'ta' ? 'மொத்த எச்சரிக்கைகள்' : 'Total Alerts'}</div>
            <div className="text-2xl font-black">{alerts.length}</div>
          </div>
          <div>
            <div className="text-xs text-white/80">{language === 'ta' ? 'தீவிர நிலை (Red)' : 'Critical (Red)'}</div>
            <div className="text-2xl font-black text-white flex items-center gap-1.5">
              <span>{criticalCount}</span>
              {criticalCount > 0 && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
            </div>
          </div>
          <div>
            <div className="text-xs text-white/80">{language === 'ta' ? 'உயர் நிலை (Orange)' : 'High (Orange)'}</div>
            <div className="text-2xl font-black">{highCount}</div>
          </div>
          <div>
            <div className="text-xs text-white/80">{language === 'ta' ? 'அவசர உதவி எண்' : 'Helpline'}</div>
            <div className="text-xl font-bold flex items-center gap-1">
              <PhoneCall className="w-4 h-4" /> 1070
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Helplines Pill Ribbon */}
      <div className="bg-white border border-[#DDE5E1] rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#17201C]">
          <PhoneCall className="w-4 h-4 text-[#059669]" />
          <span>{language === 'ta' ? 'அவசர உதவி எண்கள்:' : 'Emergency Helplines:'}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="px-3 py-1 rounded-lg bg-[#F8FAF9] border border-[#DDE5E1] font-semibold text-[#17201C]">
            <span className="text-[#64706A] mr-1">{language === 'ta' ? 'மாநில பேரிடர்:' : 'State Disaster:'}</span> 1070
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#F8FAF9] border border-[#DDE5E1] font-semibold text-[#17201C]">
            <span className="text-[#64706A] mr-1">{language === 'ta' ? 'மாவட்ட பேரிடர்:' : 'District Control:'}</span> 1077
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#F8FAF9] border border-[#DDE5E1] font-semibold text-[#17201C]">
            <span className="text-[#64706A] mr-1">{language === 'ta' ? 'மின்வாரியம் (TNEB):' : 'Electricity:'}</span> 1912
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#F8FAF9] border border-[#DDE5E1] font-semibold text-[#17201C]">
            <span className="text-[#64706A] mr-1">{language === 'ta' ? 'மருத்துவ உதவி:' : 'Health:'}</span> 104 / 108
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#DDE5E1] rounded-2xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#64706A] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            {language === 'ta' ? 'வடிகட்டு:' : 'Severity:'}
          </span>
          {['all', 'critical', 'high', 'moderate'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedSeverity === sev
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'bg-[#F8FAF9] text-[#64706A] hover:bg-[#F0F4F2] border border-[#DDE5E1]'
              }`}
            >
              {sev === 'all' ? (language === 'ta' ? 'அனைத்தும்' : 'All Severities') : sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#64706A]">
            {language === 'ta' ? 'வகை:' : 'Type:'}
          </span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F8FAF9] border border-[#DDE5E1] text-[#17201C] focus:outline-hidden focus:border-[#059669]"
          >
            <option value="all">{language === 'ta' ? 'அனைத்து வகைகள்' : 'All Types'}</option>
            <option value="heatwave">{language === 'ta' ? 'வெப்ப அலை' : 'Heatwave'}</option>
            <option value="heavy_rain">{language === 'ta' ? 'கனமழை' : 'Heavy Rain'}</option>
            <option value="wind">{language === 'ta' ? 'சூறாவளி காற்று' : 'High Wind'}</option>
            <option value="cyclone">{language === 'ta' ? 'புயல்' : 'Cyclone Watch'}</option>
            <option value="fog">{language === 'ta' ? 'பனிமூட்டம்' : 'Fog & Mist'}</option>
          </select>
        </div>
      </div>

      {/* Alert Cards Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center bg-white border border-[#DDE5E1] rounded-3xl shadow-xs space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#059669] flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[#17201C]">
              {language === 'ta' ? 'தற்போது தீவிர எச்சரிக்கைகள் ஏதுமில்லை' : 'No Critical Alerts In This Category'}
            </h3>
            <p className="text-xs text-[#64706A] max-w-md mx-auto">
              {language === 'ta'
                ? 'தேர்ந்தெடுக்கப்பட்ட வடிகட்டியில் எச்சரிக்கைகள் எதுவும் இல்லை. அனைத்து நிலையங்களும் இயல்பு நிலையில் இயங்குகின்றன.'
                : 'All synoptic telemetry stations report normal atmospheric levels for this filter criteria.'}
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-3xl bg-white border transition-all duration-200 shadow-xs hover:shadow-md space-y-4 ${
                alert.severity === 'critical'
                  ? 'border-red-300 ring-1 ring-red-200'
                  : alert.severity === 'high'
                  ? 'border-orange-300'
                  : 'border-[#DDE5E1]'
              }`}
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#F0F4F2]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1] flex items-center justify-center shadow-xs">
                    {getTypeIcon(alert.type)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#17201C] flex items-center gap-2">
                      <span>{language === 'ta' ? alert.tamilTitle : alert.title}</span>
                    </h3>
                    <div className="text-xs text-[#64706A] flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#059669]" />
                        {alert.district}
                      </span>
                      <span>·</span>
                      <span>{alert.issuedAt}</span>
                      <span>·</span>
                      <span className="text-[#059669] font-medium">
                        {language === 'ta' ? `செல்லுபடியாகும்: ${alert.validUntil}` : `Valid: ${alert.validUntil}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getSeverityBadge(alert.severity)}
                  {onSelectDistrict && (
                    <button
                      onClick={() => onSelectDistrict(alert.district.split('&')[0].trim())}
                      className="px-3 py-1.5 rounded-xl bg-[#F8FAF9] hover:bg-[#ECFDF5] border border-[#DDE5E1] hover:border-[#059669] text-xs font-semibold text-[#17201C] hover:text-[#059669] transition-all flex items-center gap-1"
                    >
                      <span>{language === 'ta' ? 'வரைபடம்' : 'Inspect GIS'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#17201C] leading-relaxed">
                {language === 'ta' ? alert.tamilDescription : alert.description}
              </p>

              {/* Precautionary Checklist for Farmers & Citizens */}
              <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1] space-y-2">
                <div className="text-xs font-bold text-[#059669] flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>
                    {language === 'ta'
                      ? 'விவசாயிகள் மற்றும் பொதுமக்களுக்கான பாதுகாப்பு வழிகாட்டுதல்கள்'
                      : 'Recommended Safety & Agricultural Protocols'}
                  </span>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#17201C]">
                  {(language === 'ta' ? alert.tamilPrecautions : alert.precautions).map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mt-1.5 flex-shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Affected Zones Footer */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#64706A]">
                <span className="font-semibold text-[#17201C]">
                  {language === 'ta' ? 'பாதிக்கப்படும் பகுதிகள்:' : 'Target Zones:'}
                </span>
                {alert.affectedZones.map((zone, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-[#F0F4F2] border border-[#DDE5E1] text-[#17201C] font-medium"
                  >
                    {zone}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
