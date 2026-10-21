/**
 * AtmosVision Multi-Language Translation System
 * Supports English and Tamil (தமிழ்)
 */

export type Language = 'en' | 'ta';

export interface TranslationMap {
  [key: string]: { en: string; ta: string };
}

export const translations: TranslationMap = {
  // App & Branding
  appName: { en: 'AtmosVision AI', ta: 'அட்மாஸ்விஷன் AI' },
  appTagline: { en: 'Tamil Nadu Live Weather', ta: 'தமிழ்நாடு நேரடி வானிலை' },
  
  // Navigation Tabs
  liveDashboard: { en: 'Live Dashboard', ta: 'நேரடி டாஷ்போர்டு' },
  districts38Map: { en: '38 Districts Map', ta: '38 மாவட்ட வரைபடம்' },
  aiWeatherForecast: { en: 'AI Weather Forecast', ta: 'AI வானிலை கணிப்பு' },
  cropSuggestions: { en: 'Crop Suggestions', ta: 'பயிர் பரிந்துரைகள்' },
  weatherAnalytics: { en: 'Weather Analytics', ta: 'வானிலை பகுப்பாய்வு' },
  weatherAlerts: { en: 'Weather Alerts', ta: 'வானிலை எச்சரிக்கைகள்' },
  airQuality: { en: 'Air Quality', ta: 'காற்றின் தரம்' },
  pestRisk: { en: 'Pest Risk', ta: 'பூச்சி ஆபத்து' },

  // Navigation Sublabels
  realTimeTNWeather: { en: 'Real-Time Tamil Nadu Weather', ta: 'நிகழ்நேர தமிழ்நாடு வானிலை' },
  interactiveGIS: { en: 'Interactive Weather & GIS Radar', ta: 'ஊடாடும் வானிலை & GIS ரேடார்' },
  futureForcast: { en: '7-Day Future Forecast', ta: '7 நாள் எதிர்கால கணிப்பு' },
  gpsCoordinates: { en: 'GPS Coordinates & 12-Month Sowing', ta: 'GPS ஆயங்கள் & 12 மாத விதைப்பு' },
  rankingsStats: { en: 'Rankings & District Stats', ta: 'தரவரிசை & மாவட்ட புள்ளிவிவரங்கள்' },
  disasterWarnings: { en: 'Disaster & Cyclone Warnings', ta: 'பேரிடர் & புயல் எச்சரிக்கைகள்' },
  aqiMonitor: { en: 'AQI & Pollution Monitor', ta: 'AQI & மாசு கண்காணிப்பு' },
  cropPestPredictor: { en: 'Crop Pest & Disease Predictor', ta: 'பயிர் பூச்சி & நோய் கணிப்பு' },

  // Common Labels
  temperature: { en: 'Temperature', ta: 'வெப்பநிலை' },
  humidity: { en: 'Humidity', ta: 'ஈரப்பதம்' },
  windSpeed: { en: 'Wind Speed', ta: 'காற்றின் வேகம்' },
  pressure: { en: 'Pressure', ta: 'அழுத்தம்' },
  rainfall: { en: 'Rainfall', ta: 'மழையளவு' },
  feelsLike: { en: 'Feels Like', ta: 'உணரும் வெப்பம்' },
  
  // Overview
  avgTemperature: { en: 'Avg Temperature', ta: 'சராசரி வெப்பநிலை' },
  stateHumidity: { en: 'State Humidity', ta: 'மாநில ஈரப்பதம்' },
  windVelocity: { en: 'Wind Velocity', ta: 'காற்றின் வேகம்' },
  telemetryStations: { en: 'Telemetry Stations', ta: 'தொலைமானி நிலையங்கள்' },
  liveTelemetry: { en: 'Live Telemetry', ta: 'நேரடி தொலைமானி' },
  syncStations: { en: 'Sync Stations', ta: 'நிலையங்களை ஒத்திசை' },
  aiPredictor: { en: 'AI Predictor', ta: 'AI கணிப்பான்' },
  
  tnWeatherRadar: { en: 'Tamil Nadu Weather Radar & Telemetry', ta: 'தமிழ்நாடு வானிலை ரேடார் & தொலைமானி' },
  meteorologicalNetwork: { en: 'Real-Time 38-District Meteorological Station Network · Synoptic Observations & AI Forecasting', ta: 'நிகழ்நேர 38 மாவட்ட வானிலை நிலைய வலையமைப்பு · சினாப்டிக் கண்காணிப்பு & AI கணிப்பு' },
  
  districtExplorer: { en: 'District Explorer', ta: 'மாவட்ட ஆராய்ச்சி' },
  cropCalculator: { en: 'Crop Suggestions & Calculator', ta: 'பயிர் பரிந்துரைகள் & கால்குலேட்டர்' },

  // Alerts
  noActiveAlerts: { en: 'No Active Alerts', ta: 'செயலில் உள்ள எச்சரிக்கைகள் இல்லை' },
  alertSeverityCritical: { en: 'Critical', ta: 'தீவிரம்' },
  alertSeverityHigh: { en: 'High', ta: 'உயர்' },
  alertSeverityModerate: { en: 'Moderate', ta: 'மிதமான' },
  alertSeverityLow: { en: 'Low', ta: 'குறைவு' },
  cycloneWarning: { en: 'Cyclone Warning', ta: 'புயல் எச்சரிக்கை' },
  heatWave: { en: 'Heat Wave Alert', ta: 'வெப்ப அலை எச்சரிக்கை' },
  heavyRainfall: { en: 'Heavy Rainfall', ta: 'கனமழை' },
  floodWarning: { en: 'Flood Warning', ta: 'வெள்ள எச்சரிக்கை' },
  thunderstormAlert: { en: 'Thunderstorm Alert', ta: 'இடியுடன் கூடிய மழை எச்சரிக்கை' },
  
  // AQI
  aqiGood: { en: 'Good', ta: 'நல்ல' },
  aqiSatisfactory: { en: 'Satisfactory', ta: 'திருப்திகரமான' },
  aqiModerate: { en: 'Moderate', ta: 'மிதமான' },
  aqiPoor: { en: 'Poor', ta: 'மோசமான' },
  aqiVeryPoor: { en: 'Very Poor', ta: 'மிக மோசமான' },
  aqiSevere: { en: 'Severe', ta: 'தீவிரமான' },
  
  // Pest Risk
  riskLow: { en: 'Low Risk', ta: 'குறைந்த ஆபத்து' },
  riskModerate: { en: 'Moderate Risk', ta: 'மிதமான ஆபத்து' },
  riskHigh: { en: 'High Risk', ta: 'அதிக ஆபத்து' },
  riskCritical: { en: 'Critical Risk', ta: 'தீவிர ஆபத்து' },

  // Settings
  workstationSettings: { en: 'Workstation Settings', ta: 'பணிநிலைய அமைப்புகள்' },
  darkMode: { en: 'Dark Mode', ta: 'இருண்ட பயன்முறை' },
  language: { en: 'Language', ta: 'மொழி' },
  savePreferences: { en: 'Save Preferences', ta: 'விருப்பங்களைச் சேமி' },

  // Charts
  temperatureTrend: { en: 'Temperature Trend', ta: 'வெப்பநிலை போக்கு' },
  humidityTrend: { en: 'Humidity Trend', ta: 'ஈரப்பதம் போக்கு' },
  windTrend: { en: 'Wind Speed Trend', ta: 'காற்றின் வேகம் போக்கு' },
  last24h: { en: 'Last 24 Hours', ta: 'கடந்த 24 மணி நேரம்' },
  next7Days: { en: 'Next 7 Days', ta: 'அடுத்த 7 நாட்கள்' },
  
  // General
  select: { en: 'Select', ta: 'தேர்வு' },
  loading: { en: 'Loading...', ta: 'ஏற்றுகிறது...' },
  refresh: { en: 'Refresh', ta: 'புதுப்பி' },
  close: { en: 'Close', ta: 'மூடு' },
  today: { en: 'Today', ta: 'இன்று' },
  tomorrow: { en: 'Tomorrow', ta: 'நாளை' },
  online: { en: 'Online', ta: 'ஆன்லைன்' },
  allDistricts: { en: 'All 38 Districts', ta: 'அனைத்து 38 மாவட்டங்கள்' },
  askAgriAI: { en: 'Ask Agri-AI', ta: 'வேளாண் AI கேள்' },
  installWebApp: { en: 'Install Web App', ta: 'வலை பயன்பாட்டை நிறுவு' },
  syncRefreshAll: { en: 'Sync & Refresh All', ta: 'ஒத்திசை & அனைத்தையும் புதுப்பி' },
};

/**
 * Translation helper — returns the string for the given key and language
 */
export function t(key: string, lang: Language): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] || entry.en || key;
}
