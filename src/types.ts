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

export type TabId = 'overview' | 'explorer' | 'ai_predict' | 'crops' | 'analytics' | 'alerts' | 'air_quality' | 'pest_risk' | 'charts';

export interface MonthlyCropItem {
  name: string;
  tamilName: string;
  category: 'Food Grain' | 'Commercial / Cash Crop' | 'Plantation & Hill' | 'Horticulture & Fruits' | 'Spices' | 'Pulses & Oilseeds' | 'Vegetables';
  waterNeed: 'Low' | 'Moderate' | 'High' | 'Very High';
  idealSoil: string;
  durationDays: string;
  description: string;
  idealTempRangeC: [number, number];
  idealHumidityRange: [number, number];
  suitableAgroZones: string[];
}

export interface MonthlyCropSchedule {
  monthIndex: number;
  monthName: string;
  tamilMonth: string;
  seasonName: string;
  seasonTamil: string;
  agroClimateOverview: string;
  recommendedSowingCrops: MonthlyCropItem[];
  harvestingCrops: string[];
  irrigationStrategy: string;
  pestAndDiseaseAdvisory: string;
}

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

export interface WeatherAlertItem {
  id: string;
  district: string;
  title: string;
  tamilTitle: string;
  type: 'cyclone' | 'heavy_rain' | 'heatwave' | 'thunderstorm' | 'flood' | 'wind' | 'fog';
  severity: 'critical' | 'high' | 'moderate' | 'low';
  issuedAt: string;
  validUntil: string;
  description: string;
  tamilDescription: string;
  precautions: string[];
  tamilPrecautions: string[];
  affectedZones: string[];
}

export interface DistrictAQIData {
  district: string;
  aqi: number;
  category: 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
  dominantPollutant: string;
  healthRecommendation: string;
  tamilRecommendation: string;
  updateTime: string;
}

export interface TensorDimensions {
  timeSteps: number;
  latPoints: number;
  lonPoints: number;
  variables: number;
  totalElements: number;
  spatialResolutionDeg: number;
  latRange: [number, number];
  lonRange: [number, number];
}

export interface SingularSpectrum {
  mode: number;
  modeName: string;
  dimension: number;
  singularValues: number[];
  cumulativeEnergyPct: number[];
}

export interface HOSVDRankConfig {
  r1: number;
  r2: number;
  r3: number;
  r4: number;
}

export interface ReconstructionMetrics {
  rankConfig?: HOSVDRankConfig;
  originalParams?: number;
  compressedParams?: number;
  compressionRatio: number;
  reductionFactor?: number;
  frobeniusRelativeError?: number;
  rmse: number;
  psnrDb?: number;
  varianceExplained?: number;
  snrDb?: number;
  relativeErrorPct?: number;
  energyRetainedPct?: number;
  coreElements?: number;
  totalElements?: number;
}

export interface ReconstructionResult {
  ranks?: HOSVDRankConfig;
  metrics?: ReconstructionMetrics;
  timeIndex?: number;
  variableIndex?: number;
  variable?: ClimateVariable;
  timestamp?: string;
  originalGrid?: number[][];
  reconstructedGrid?: number[][];
  differenceGrid?: number[][];
  maxDiff?: number;
  meanDiff?: number;
  [key: string]: any;
}

export interface GridSliceData {
  timeIndex: number;
  variableIndex: number;
  variable: ClimateVariable;
  ranks: HOSVDRankConfig;
  originalGrid: number[][];
  reconstructedGrid: number[][];
  errorGrid: number[][];
  lats: number[];
  lons: number[];
  stats: {
    origMin: number;
    origMax: number;
    origMean: number;
    reconMin: number;
    reconMax: number;
    reconMean: number;
    maxAbsError: number;
    meanAbsError: number;
  };
}


