import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { CITIES_TAMIL_NADU } from './src/data/cities';
import { fetchLiveTamilNaduWeather, fetchDistrictLiveForecast, computeStatewideSummary } from './src/data/liveWeatherService';

const currentDir = typeof __dirname !== 'undefined' ? __dirname : (typeof import.meta !== 'undefined' && import.meta.url ? path.dirname(fileURLToPath(import.meta.url)) : process.cwd());

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // CORS headers for local/container dev
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'operational',
      system: 'Tamil Nadu Live Meteorological GIS Network',
      version: '2.0.0-live',
      mode: 'real-time-api',
      stationsCount: 38,
      provider: 'Open-Meteo Planetary Meteorological API',
      timestamp: new Date().toISOString()
    });
  });

  // 1. Real-time live weather telemetry from Open-Meteo API for all 38 districts
  app.get('/api/live/state', async (req, res) => {
    try {
      const force = req.query.refresh === 'true';
      const districts = await fetchLiveTamilNaduWeather(force);
      const summary = computeStatewideSummary(districts);
      res.json({ summary, districts });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch live state weather', details: err.message });
    }
  });

  // 2. Real-time live forecast for a specific district
  app.get('/api/live/district', async (req, res) => {
    try {
      const cityId = (req.query.city as string) || 'chennai';
      const force = req.query.refresh === 'true';
      const city = CITIES_TAMIL_NADU.find((c) => c.id.toLowerCase() === cityId.toLowerCase() || c.district.toLowerCase() === cityId.toLowerCase()) || CITIES_TAMIL_NADU[0];
      const liveData = await fetchDistrictLiveForecast(city, force);
      res.json(liveData);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch live district forecast', details: err.message });
    }
  });

  // Vite middleware in dev; static file serving in production
  const distDir = path.resolve(process.cwd(), 'dist');
  const hasDist = fs.existsSync(path.join(distDir, 'index.html'));

  if (process.env.NODE_ENV === 'production' || hasDist) {
    app.use(express.static(distDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      root: process.cwd(),
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tamil Nadu Live Meteorological GIS server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
