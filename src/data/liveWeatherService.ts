import { CITIES_TAMIL_NADU } from './cities';
import { CityLocation, LiveDistrictWeather, LiveStatewideSummary } from '../types';
import { getCityObservation } from './hosvdEngine';

/**
 * WMO Weather Code to Human-Readable Condition & Category Mapping
 */
export function interpretWmoWeatherCode(code: number, tempC: number, windSpeedKmh: number): {
  label: string;
  weatherType: 'clear' | 'wind' | 'cool' | 'hot' | 'rain';
  icon: string;
} {
  if (tempC < 18.0) {
    return { label: 'Cool Highland Weather', weatherType: 'cool', icon: '❄️' };
  }

  switch (code) {
    case 0:
      return {
        label: tempC > 34 ? 'Hot & Sunny' : 'Clear Sky',
        weatherType: tempC > 34 ? 'hot' : 'clear',
        icon: '☀️'
      };
    case 1:
      return {
        label: 'Mainly Clear',
        weatherType: tempC > 34 ? 'hot' : 'clear',
        icon: '🌤️'
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        weatherType: windSpeedKmh > 22 ? 'wind' : 'clear',
        icon: '⛅'
      };
    case 3:
      return {
        label: 'Overcast Skies',
        weatherType: windSpeedKmh > 22 ? 'wind' : 'clear',
        icon: '☁️'
      };
    case 45:
    case 48:
      return {
        label: 'Fog / Mist Inversion',
        weatherType: 'cool',
        icon: '🌫️'
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Light Drizzle',
        weatherType: 'rain',
        icon: '🌦️'
      };
    case 61:
    case 63:
    case 65:
      return {
        label: 'Monsoonal Rain',
        weatherType: 'rain',
        icon: '🌧️'
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        weatherType: 'rain',
        icon: '🌧️'
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Convective Thunderstorm',
        weatherType: 'rain',
        icon: '⛈️'
      };
    default:
      if (windSpeedKmh > 25) {
        return { label: 'Gusty Trade Winds', weatherType: 'wind', icon: '💨' };
      }
      return {
        label: tempC > 34 ? 'High Sensible Heat' : 'Fair Weather',
        weatherType: tempC > 34 ? 'hot' : 'clear',
        icon: '☀️'
      };
  }
}

// In-memory cache for live weather data (3-minute TTL)
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

let stateWeatherCache: CacheEntry<LiveDistrictWeather[]> | null = null;
const districtForecastCache = new Map<string, CacheEntry<LiveDistrictWeather>>();
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

/**
 * Generates fallback LiveDistrictWeather object from ERA5 climatology if network fails
 */
function createFallbackDistrictWeather(city: CityLocation, currentMonthIdx: number = 9): LiveDistrictWeather {
  const timeIdx = 340; // Climatological baseline
  const obs = getCityObservation(city, timeIdx, currentMonthIdx);
  const tempC = Number(obs.temperatureC.toFixed(1));
  const apparentTempC = Number((tempC + (obs.relativeHumidityPct > 70 ? 2.5 : -1.0)).toFixed(1));
  const windKmh = Number((obs.windSpeedMs * 3.6).toFixed(1));
  const condition = interpretWmoWeatherCode(0, tempC, windKmh);

  return {
    cityId: city.id,
    cityName: city.name,
    district: city.district,
    lat: city.lat,
    lon: city.lon,
    elevationM: city.elevationM,
    regionType: city.regionType,
    temperatureC: tempC,
    apparentTempC: apparentTempC,
    relativeHumidityPct: obs.relativeHumidityPct,
    windSpeedKmh: windKmh,
    windSpeedMs: obs.windSpeedMs,
    windDirectionDeg: obs.windDirectionDeg,
    surfacePressureHpa: obs.surfacePressureHpa,
    weatherCode: 0,
    weatherCondition: condition.label,
    weatherType: condition.weatherType,
    isDay: true,
    precipitationMm: 0,
    era5BaselineTempC: tempC,
    tempAnomalyC: 0.0,
    updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' (Estimated)'
  };
}

/**
 * Fetches real-time live weather for ALL 38 districts across Tamil Nadu in a single batch request
 */
export async function fetchLiveTamilNaduWeather(forceRefresh: boolean = false): Promise<LiveDistrictWeather[]> {
  const now = Date.now();
  if (!forceRefresh && stateWeatherCache && (now - stateWeatherCache.timestamp < CACHE_TTL_MS)) {
    return stateWeatherCache.data;
  }

  try {
    const lats = CITIES_TAMIL_NADU.map((c) => c.lat.toFixed(4)).join(',');
    const lons = CITIES_TAMIL_NADU.map((c) => c.lon.toFixed(4)).join(',');
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&timezone=Asia%2FKolkata`;
    
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP error ${res.status}`);
    }

    const rawData = await res.json();
    const results: LiveDistrictWeather[] = [];
    const currentMonthIdx = new Date().getMonth(); // 0 = Jan .. 9 = Oct .. 11 = Dec

    // Check if multiple locations were returned (array or single object with array elements)
    const locationsList = Array.isArray(rawData) ? rawData : [rawData];

    CITIES_TAMIL_NADU.forEach((city, idx) => {
      const locData = locationsList[idx] || locationsList[0];
      const cur = locData?.current;

      if (!cur) {
        results.push(createFallbackDistrictWeather(city, currentMonthIdx));
        return;
      }

      const tempC = Number(cur.temperature_2m.toFixed(1));
      const apparentTempC = Number((cur.apparent_temperature ?? tempC).toFixed(1));
      const rhPct = Math.round(cur.relative_humidity_2m ?? 60);
      const windKmh = Number((cur.wind_speed_10m ?? 12).toFixed(1));
      const windMs = Number((windKmh / 3.6).toFixed(1));
      const windDir = Math.round(cur.wind_direction_10m ?? 90);
      const pressureHpa = Number((cur.surface_pressure ?? 1012).toFixed(1));
      const weatherCode = cur.weather_code ?? 0;
      const isDay = cur.is_day === 1;
      const precipMm = Number((cur.precipitation ?? 0).toFixed(1));

      // Compute climatological baseline from ERA5 engine
      const era5Obs = getCityObservation(city, 340, currentMonthIdx);
      const era5BaseTemp = Number(era5Obs.temperatureC.toFixed(1));
      const tempAnomalyC = Number((tempC - era5BaseTemp).toFixed(1));

      const condition = interpretWmoWeatherCode(weatherCode, tempC, windKmh);

      results.push({
        cityId: city.id,
        cityName: city.name,
        district: city.district,
        lat: city.lat,
        lon: city.lon,
        elevationM: city.elevationM,
        regionType: city.regionType,
        temperatureC: tempC,
        apparentTempC: apparentTempC,
        relativeHumidityPct: rhPct,
        windSpeedKmh: windKmh,
        windSpeedMs: windMs,
        windDirectionDeg: windDir,
        surfacePressureHpa: pressureHpa,
        weatherCode: weatherCode,
        weatherCondition: condition.label,
        weatherType: condition.weatherType,
        isDay: isDay,
        precipitationMm: precipMm,
        era5BaselineTempC: era5BaseTemp,
        tempAnomalyC: tempAnomalyC,
        updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      });
    });

    stateWeatherCache = {
      data: results,
      timestamp: now
    };

    return results;
  } catch (err) {
    console.warn('Live Open-Meteo weather fetch failed, using realistic physical fallback:', err);
    // Return graceful fallback for all 38 districts
    const currentMonthIdx = new Date().getMonth();
    const fallbackResults = CITIES_TAMIL_NADU.map((city) => createFallbackDistrictWeather(city, currentMonthIdx));
    return fallbackResults;
  }
}

/**
 * Fetches detailed live weather observation with 24-hour and 7-day forecasts for a single district
 */
export async function fetchDistrictLiveForecast(
  city: CityLocation,
  forceRefresh: boolean = false
): Promise<LiveDistrictWeather> {
  const cacheKey = city.id;
  const now = Date.now();
  const cached = districtForecastCache.get(cacheKey);

  if (!forceRefresh && cached && (now - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat.toFixed(4)}&longitude=${city.lon.toFixed(4)}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=Asia%2FKolkata&forecast_days=7`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();
    const cur = data.current;
    const currentMonthIdx = new Date().getMonth();

    const tempC = Number(cur.temperature_2m.toFixed(1));
    const apparentTempC = Number((cur.apparent_temperature ?? tempC).toFixed(1));
    const rhPct = Math.round(cur.relative_humidity_2m ?? 60);
    const windKmh = Number((cur.wind_speed_10m ?? 12).toFixed(1));
    const windMs = Number((windKmh / 3.6).toFixed(1));
    const windDir = Math.round(cur.wind_direction_10m ?? 90);
    const pressureHpa = Number((cur.surface_pressure ?? 1012).toFixed(1));
    const weatherCode = cur.weather_code ?? 0;
    const isDay = cur.is_day === 1;
    const precipMm = Number((cur.precipitation ?? 0).toFixed(1));

    const era5Obs = getCityObservation(city, 340, currentMonthIdx);
    const era5BaseTemp = Number(era5Obs.temperatureC.toFixed(1));
    const tempAnomalyC = Number((tempC - era5BaseTemp).toFixed(1));

    const condition = interpretWmoWeatherCode(weatherCode, tempC, windKmh);

    // Build 24-hour diurnal profile from hourly forecast (next 24 hours)
    const hourly24h = (data.hourly?.time || []).slice(0, 24).map((timeStr: string, idx: number) => {
      const d = new Date(timeStr);
      const hour = d.getHours();
      const hTemp = Number((data.hourly.temperature_2m[idx] ?? tempC).toFixed(1));
      const hRh = Math.round(data.hourly.relative_humidity_2m[idx] ?? rhPct);
      const hRainProb = Math.round(data.hourly.precipitation_probability[idx] ?? 0);
      const hCode = data.hourly.weather_code[idx] ?? 0;
      const hWind = Number((data.hourly.wind_speed_10m[idx] ?? windKmh).toFixed(1));

      return {
        time: timeStr,
        hourLabel: `${hour}:00`,
        temperatureC: hTemp,
        relativeHumidityPct: hRh,
        precipitationProbability: hRainProb,
        weatherCode: hCode,
        windSpeedKmh: hWind
      };
    });

    // Build 7-day daily forecast
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daily7d = (data.daily?.time || []).slice(0, 7).map((dateStr: string, idx: number) => {
      const d = new Date(dateStr);
      const dayLabel = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : dayNames[d.getDay()];
      const maxTemp = Number((data.daily.temperature_2m_max[idx] ?? tempC + 3).toFixed(1));
      const minTemp = Number((data.daily.temperature_2m_min[idx] ?? tempC - 4).toFixed(1));
      const rainSum = Number((data.daily.precipitation_sum[idx] ?? 0).toFixed(1));
      const rainProb = Math.round(data.daily.precipitation_probability_max[idx] ?? 10);
      const dCode = data.daily.weather_code[idx] ?? 0;
      const dCond = interpretWmoWeatherCode(dCode, (maxTemp + minTemp) / 2, 12);

      return {
        date: dateStr,
        dayLabel,
        maxTempC: maxTemp,
        minTempC: minTemp,
        precipitationSumMm: rainSum,
        precipitationProbMax: rainProb,
        weatherCode: dCode,
        weatherCondition: dCond.label,
        weatherType: dCond.weatherType
      };
    });

    const fullResult: LiveDistrictWeather = {
      cityId: city.id,
      cityName: city.name,
      district: city.district,
      lat: city.lat,
      lon: city.lon,
      elevationM: city.elevationM,
      regionType: city.regionType,
      temperatureC: tempC,
      apparentTempC: apparentTempC,
      relativeHumidityPct: rhPct,
      windSpeedKmh: windKmh,
      windSpeedMs: windMs,
      windDirectionDeg: windDir,
      surfacePressureHpa: pressureHpa,
      weatherCode: weatherCode,
      weatherCondition: condition.label,
      weatherType: condition.weatherType,
      isDay: isDay,
      precipitationMm: precipMm,
      era5BaselineTempC: era5BaseTemp,
      tempAnomalyC: tempAnomalyC,
      updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      hourly24h,
      daily7d
    };

    districtForecastCache.set(cacheKey, {
      data: fullResult,
      timestamp: now
    });

    return fullResult;
  } catch (err) {
    console.warn(`District live forecast failed for ${city.name}, using physical fallback:`, err);
    const fallback = createFallbackDistrictWeather(city);
    return fallback;
  }
}

/**
 * Computes statewide summary from active district weather items
 */
export function computeStatewideSummary(districtWeatherList: LiveDistrictWeather[]): LiveStatewideSummary {
  if (!districtWeatherList || districtWeatherList.length === 0) {
    return {
      stateAvgTempC: 30.2,
      stateAvgHumidityPct: 65,
      stateAvgWindKmh: 14.5,
      warmestDistrict: { district: 'Madurai', tempC: 34.2 },
      coolestDistrict: { district: 'Nilgiris (Ooty)', tempC: 16.0 },
      rainAlertCount: 0,
      lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      isLive: false,
      totalDistrictsCount: 38
    };
  }

  let sumTemp = 0;
  let sumHumidity = 0;
  let sumWind = 0;
  let warmest = districtWeatherList[0];
  let coolest = districtWeatherList[0];
  let rainCount = 0;

  districtWeatherList.forEach((d) => {
    sumTemp += d.temperatureC;
    sumHumidity += d.relativeHumidityPct;
    sumWind += d.windSpeedKmh;

    if (d.temperatureC > warmest.temperatureC) warmest = d;
    if (d.temperatureC < coolest.temperatureC) coolest = d;
    if (d.weatherType === 'rain' || d.precipitationMm > 0.5) rainCount++;
  });

  const count = districtWeatherList.length;

  return {
    stateAvgTempC: Number((sumTemp / count).toFixed(1)),
    stateAvgHumidityPct: Math.round(sumHumidity / count),
    stateAvgWindKmh: Number((sumWind / count).toFixed(1)),
    warmestDistrict: { district: warmest.district, tempC: warmest.temperatureC },
    coolestDistrict: { district: coolest.district, tempC: coolest.temperatureC },
    rainAlertCount: rainCount,
    lastUpdated: districtWeatherList[0]?.updatedAt || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    isLive: true,
    totalDistrictsCount: count
  };
}
