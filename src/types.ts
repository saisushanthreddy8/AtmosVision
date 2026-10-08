/**
 * Tamil Nadu Live Meteorological Platform Types
 * Real-time Open-Meteo Synoptic API & GIS Telemetry
 */

export interface ClimateVariable {
  id: string;
  symbol: string;
  name: string;
  unit: string;
  description: string;
  min: number;
  max: number;
  colormap: 'thermal' | 'coolwarm' | 'viridis' | 'spectral' | 'magma';
  defaultFormat: (val: number) => string;
}

export interface CityLocation {
  id: string;
  name: string;
  district: string;
  lat: number;
  lon: number;
  elevationM: number;
  nearestGridLatIdx: number;
  nearestGridLonIdx: number;
  nearestGridLat: number;
  nearestGridLon: number;
  regionType: 'coastal' | 'interior-plains' | 'western-ghats' | 'southern-tip' | 'northern-plateau';
  description: string;
}

export type TabId = 'overview' | 'explorer' | 'ai_predict' | 'analytics' | 'forecast';

export interface AIPredictionStep {
  timeLabel: string;
  hourOffset: number;
  predictedTempC: number;
  lowerConfidenceTempC: number;
  upperConfidenceTempC: number;
  precipitationProb: number;
  predictedHumidityPct: number;
  predictedWindKmh: number;
  predictedPressureHpa: number;
  heatIndexC: number;
  weatherType: 'clear' | 'wind' | 'cool' | 'hot' | 'rain';
  conditionText: string;
}

export interface XAIImportanceFactor {
  name: string;
  category: string;
  weightPct: number;
  direction: 'increase' | 'decrease' | 'neutral';
  impactDescription: string;
}

export interface AIAnomalyAlert {
  severity: 'low' | 'moderate' | 'high' | 'critical';
  title: string;
  description: string;
  timeWindow: string;
  recommendation: string;
}

export interface AIPredictionResult {
  cityId: string;
  district: string;
  modelName: string;
  inferenceTimeMs: number;
  confidenceScore: number;
  rmseC: number;
  steps: AIPredictionStep[];
  xaiFactors: XAIImportanceFactor[];
  anomalyAlerts: AIAnomalyAlert[];
  scenarioApplied?: {
    tempOffsetC: number;
    humidityOffsetPct: number;
    pressureOffsetHpa: number;
  };
}

export interface CityClimateObservation {
  city: CityLocation;
  timestamp: string;
  temperatureK: number;
  temperatureC: number;
  uWindMs: number;
  vWindMs: number;
  windSpeedMs: number;
  windDirectionDeg: number;
  verticalVelocityPaS: number;
  specificHumidityGKg: number;
  geopotentialHeightM: number;
  surfacePressureHpa: number;
  relativeHumidityPct: number;
  derivedCondition: {
    label: string;
    description: string;
    weatherType: 'clear' | 'wind' | 'cool' | 'hot' | 'rain';
  };
}

export interface LiveDistrictWeather {
  cityId: string;
  cityName: string;
  district: string;
  lat: number;
  lon: number;
  elevationM: number;
  regionType: 'coastal' | 'interior-plains' | 'western-ghats' | 'southern-tip' | 'northern-plateau';
  temperatureC: number;
  apparentTempC: number;
  relativeHumidityPct: number;
  windSpeedKmh: number;
  windSpeedMs: number;
  windDirectionDeg: number;
  surfacePressureHpa: number;
  weatherCode: number;
  weatherCondition: string;
  weatherType: 'clear' | 'wind' | 'cool' | 'hot' | 'rain';
  isDay: boolean;
  precipitationMm: number;
  era5BaselineTempC?: number;
  tempAnomalyC?: number;
  updatedAt: string;
  uvIndex?: number;
  windGustsKmh?: number;
  hourly24h?: {
    time: string;
    hourLabel: string;
    temperatureC: number;
    relativeHumidityPct: number;
    precipitationProbability: number;
    weatherCode: number;
    windSpeedKmh: number;
  }[];
  daily7d?: {
    date: string;
    dayLabel: string;
    maxTempC: number;
    minTempC: number;
    precipitationSumMm: number;
    precipitationProbMax: number;
    weatherCode: number;
    weatherCondition: string;
    weatherType: 'clear' | 'wind' | 'cool' | 'hot' | 'rain';
  }[];
}

export interface LiveStatewideSummary {
  stateAvgTempC: number;
  stateAvgHumidityPct: number;
  stateAvgWindKmh: number;
  warmestDistrict: { district: string; tempC: number };
  coolestDistrict: { district: string; tempC: number };
  rainAlertCount: number;
  lastUpdated: string;
  isLive: boolean;
  totalDistrictsCount: number;
  dominantWeather?: string;
  maxTempDistrict?: string;
  maxTempC?: number;
  minTempDistrict?: string;
  minTempC?: number;
  averageTemperatureC?: number;
  averageHumidityPct?: number;
  averageWindSpeedKmh?: number;
}


