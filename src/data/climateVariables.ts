import { ClimateVariable } from '../types';

export const CLIMATE_VARIABLES: ClimateVariable[] = [
  {
    id: 'temperature',
    symbol: 'T',
    name: 'Air Temperature',
    unit: '°C (2m / 850 hPa)',
    description: 'Dry-bulb air temperature capturing diurnal solar heating and land-sea thermal contrasts across Tamil Nadu.',
    min: 12.0,
    max: 34.0,
    colormap: 'thermal',
    defaultFormat: (val: number) => `${val.toFixed(1)} °C`
  },
  {
    id: 'u_wind',
    symbol: 'u',
    name: 'Zonal Wind Velocity',
    unit: 'm/s (East-West)',
    description: 'Zonal velocity vector component. Negative values indicate easterly winds (prevailing January Northeast Monsoon).',
    min: -14.0,
    max: 6.0,
    colormap: 'coolwarm',
    defaultFormat: (val: number) => `${val.toFixed(1)} m/s`
  },
  {
    id: 'v_wind',
    symbol: 'v',
    name: 'Meridional Wind Velocity',
    unit: 'm/s (North-South)',
    description: 'Meridional velocity vector component. Negative values represent northerly wind flow driving continental air southward.',
    min: -10.0,
    max: 8.0,
    colormap: 'coolwarm',
    defaultFormat: (val: number) => `${val.toFixed(1)} m/s`
  },
  {
    id: 'vertical_velocity',
    symbol: 'w',
    name: 'Vertical Velocity (Omega)',
    unit: 'Pa/s (850 hPa)',
    description: 'Atmospheric pressure coordinate vertical motion. Negative values denote ascending convective air; positive denotes subsidence.',
    min: -0.45,
    max: 0.40,
    colormap: 'spectral',
    defaultFormat: (val: number) => `${val.toFixed(3)} Pa/s`
  },
  {
    id: 'specific_humidity',
    symbol: 'q',
    name: 'Specific Humidity',
    unit: 'g/kg (kg/kg × 10³)',
    description: 'Mass of water vapor per unit total air mass, indicating coastal marine air infiltration versus dry interior atmosphere.',
    min: 4.5,
    max: 18.5,
    colormap: 'viridis',
    defaultFormat: (val: number) => `${val.toFixed(2)} g/kg`
  },
  {
    id: 'geopotential',
    symbol: 'z',
    name: 'Geopotential Height',
    unit: 'm (850 hPa / g₀)',
    description: 'Geopotential divided by standard gravity, identifying synoptic ridging, trough patterns, and baroclinic gradients.',
    min: 1470.0,
    max: 1540.0,
    colormap: 'magma',
    defaultFormat: (val: number) => `${val.toFixed(1)} m`
  }
];
