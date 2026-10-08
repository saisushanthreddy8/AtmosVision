import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Sprout,
  Droplets,
  Scale,
  Clock,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Calendar,
  DollarSign,
  TrendingUp,
  Leaf,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export type LandUnit = 'acres' | 'hectares' | 'cents';
export type FarmingMethod = 'integrated' | 'organic';
export type IrrigationMethod = 'drip' | 'flood';

export interface CropAgronomyProfile {
  id: string;
  name: string;
  tamilName: string;
  category: 'Cereal / Grain' | 'Pulse' | 'Commercial / Cash' | 'Oilseed' | 'Horticulture' | 'Plantation' | 'Floriculture';
  icon: string;
  durationDays: number;
  season: string;
  // Per acre baseline values
  seedRateKgPerAcre: { min: number; max: number; unit: string; description: string };
  seedTreatment: string;
  fertilizerPlanPerAcre: {
    basal: { ureaKg: number; dapKg: number; mopKg: number; neemCakeKg: number; microKg?: number; notes: string };
    stage1: { stageName: string; daysAfterSowing: number; ureaKg: number; mopKg: number; foliarSpray?: string };
    stage2?: { stageName: string; daysAfterSowing: number; ureaKg: number; mopKg: number; foliarSpray?: string };
    stage3?: { stageName: string; daysAfterSowing: number; ureaKg: number; mopKg: number; foliarSpray?: string };
  };
  organicAlternativesPerAcre: {
    fymTonnes: number;
    vermicompostKg: number;
    biofertilizers: string[];
    neemCakeKg: number;
    panchagavyaSprays: string;
  };
  waterPerAcreLitresPerWeek: number; // Litres
  dripHoursPerDayPerAcre: number;    // Hours at standard 4 lph emitters
  expectedYieldPerAcre: { min: number; max: number; unit: string };
  soilSuitability: string;
}

export const CROP_AGRONOMY_DATABASE: CropAgronomyProfile[] = [
  {
    id: 'paddy',
    name: 'Paddy / Rice',
    tamilName: 'நெல்',
    category: 'Cereal / Grain',
    icon: '🌾',
    durationDays: 125,
    season: 'Kuruvai / Samba / Navarai',
    seedRateKgPerAcre: { min: 8, max: 12, unit: 'kg', description: '8-10 kg for SRI / machine planting; 25 kg for conventional nursery' },
    seedTreatment: 'Treat seeds with Pseudomonas fluorescens @ 10g/kg or Azospirillum bio-inoculant to prevent blast.',
    fertilizerPlanPerAcre: {
      basal: { ureaKg: 0, dapKg: 50, mopKg: 15, neemCakeKg: 50, microKg: 10, notes: 'Basal: 1 bag DAP (50kg) + 15kg MOP + 10kg Zinc Sulphate + 50kg Neem cake.' },
      stage1: { stageName: 'Tillering Stage (20-25 DAT)', daysAfterSowing: 25, ureaKg: 35, mopKg: 0, foliarSpray: 'Azospirillum + Phosphobacteria root dip' },
      stage2: { stageName: 'Panicle Initiation (40-45 DAT)', daysAfterSowing: 45, ureaKg: 35, mopKg: 15, foliarSpray: '1% Potassium chloride / Zinc foliar if deficiency observed' },
      stage3: { stageName: 'Heading & Grain Filling (65 DAT)', daysAfterSowing: 65, ureaKg: 15, mopKg: 10, foliarSpray: '2% DAP or TNAU Pulse/Paddy booster spray' }
    },
    organicAlternativesPerAcre: {
      fymTonnes: 5,
      vermicompostKg: 1000,
      biofertilizers: ['Azospirillum (2 kg)', 'Phosphobacteria (2 kg)', 'Blue Green Algae (10 kg)'],
      neemCakeKg: 100,
      panchagavyaSprays: '3% Panchagavya spray at 20, 40, and 60 DAT for vigorous tillering'
    },
    waterPerAcreLitresPerWeek: 42000,
    dripHoursPerDayPerAcre: 3.5,
    expectedYieldPerAcre: { min: 2.2, max: 3.2, unit: 'Tonnes (37 - 53 bags of 60kg)' },
    soilSuitability: 'Clayey loam and heavy alluvium with good water holding capacity'
  },
  {
    id: 'cotton',
    name: 'Cotton',
    tamilName: 'பருத்தி',
    category: 'Commercial / Cash',
    icon: '🌱',
    durationDays: 160,
    season: 'Aadi Pattam / Winter Irrigated',
    seedRateKgPerAcre: { min: 1.5, max: 2.0, unit: 'kg (hybrid pkts)', description: '3 to 4 packets (450g each) of Bt hybrid seeds per acre' },
    seedTreatment: 'Treat with Trichoderma viride @ 4g/kg seed + Imidacloprid for early sucking pest barrier.',
    fertilizerPlanPerAcre: {
      basal: { ureaKg: 15, dapKg: 45, mopKg: 20, neemCakeKg: 100, microKg: 5, notes: 'Basal: 45kg DAP + 20kg MOP + 5kg Borax + 100kg Neem cake.' },
      stage1: { stageName: 'Squaring Phase (40-45 DAS)', daysAfterSowing: 45, ureaKg: 35, mopKg: 10, foliarSpray: 'Planofix (1ml/4.5L) to prevent square dropping' },
      stage2: { stageName: 'Boll Development (70-75 DAS)', daysAfterSowing: 75, ureaKg: 35, mopKg: 20, foliarSpray: '2% DAP + 1% MOP foliar spray for larger bolls' },
      stage3: { stageName: 'Boll Bursting (100 DAS)', daysAfterSowing: 100, ureaKg: 15, mopKg: 10, foliarSpray: '0.5% Boron spray for lint brightness' }
    },
    organicAlternativesPerAcre: {
      fymTonnes: 4,
      vermicompostKg: 800,
      biofertilizers: ['Azospirillum (2 kg)', 'Phosphobacteria (2 kg)'],
      neemCakeKg: 150,
      panchagavyaSprays: '3% Panchagavya + Neem oil (3%) spray for bollworm and sucking pest resistance'
    },
    waterPerAcreLitresPerWeek: 18000,
    dripHoursPerDayPerAcre: 1.8,
    expectedYieldPerAcre: { min: 10, max: 16, unit: 'Quintals kapas' },
    soilSuitability: 'Deep black cotton soils (Vertisols) and fertile red loams'
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    tamilName: 'கரும்பு',
    category: 'Commercial / Cash',
    icon: '🎋',
    durationDays: 330,
    season: 'Early (Dec-Jan) / Mid (Feb-Mar)',
    seedRateKgPerAcre: { min: 30000, max: 32000, unit: 'two-budded setts (~3.5 tonnes)', description: '30,000 two-budded setts or 10,000 single bud chip seedlings' },
    seedTreatment: 'Sett treatment with Carbendazim (1g/L) + Chlorpyrifos for 15 mins to eliminate smut & mealybugs.',
    fertilizerPlanPerAcre: {
      basal: { ureaKg: 0, dapKg: 100, mopKg: 40, neemCakeKg: 150, microKg: 15, notes: 'Basal: 2 bags DAP (100kg) + 40kg MOP + 15kg Sugarcane Micronutrient + 150kg Neem cake.' },
      stage1: { stageName: 'Tillering & Formative (45 DAS)', daysAfterSowing: 45, ureaKg: 65, mopKg: 25, foliarSpray: 'Acetobacter diazotrophicus soil drench' },
      stage2: { stageName: 'Grand Growth Phase (90 DAS)', daysAfterSowing: 90, ureaKg: 75, mopKg: 35, foliarSpray: 'Ferrous sulphate (2.5kg/ha) if chlorosis appears' },
      stage3: { stageName: 'Earthing Up & Maturation (120 DAS)', daysAfterSowing: 120, ureaKg: 50, mopKg: 25, foliarSpray: 'Foliar nutrition with potassium for maximum brix sugar' }
    },
    organicAlternativesPerAcre: {
      fymTonnes: 10,
      vermicompostKg: 2000,
      biofertilizers: ['Gluconacetobacter diazotrophicus (2 kg)', 'Phosphobacteria (2 kg)'],
      neemCakeKg: 250,
      panchagavyaSprays: 'Trash mulching + 5% Panchagavya root drenches every 30 days'
    },
    waterPerAcreLitresPerWeek: 52000,
    dripHoursPerDayPerAcre: 4.2,
    expectedYieldPerAcre: { min: 45, max: 65, unit: 'Tonnes millable cane' },
    soilSuitability: 'Deep well-drained loams, clay loams with neutral pH (6.5 - 7.5)'
  },
  {
    id: 'groundnut',
    name: 'Groundnut / Peanut',
    tamilName: 'நிலக்கடலை',
    category: 'Oilseed',
    icon: '🥜',
    durationDays: 110,
    season: 'Chithirai / Aadi / Thai Pattam',
    seedRateKgPerAcre: { min: 50, max: 55, unit: 'kg kernels', description: '55 kg quality kernels (approx 70kg in-shell pods)' },
    seedTreatment: 'Treat with Rhizobium (200g/10kg) + Trichoderma viride (4g/kg) to prevent root rot & enhance nodulation.',
    fertilizerPlanPerAcre: {
      basal: { ureaKg: 10, dapKg: 40, mopKg: 25, neemCakeKg: 100, microKg: 80, notes: 'Basal: 40kg DAP + 25kg MOP + 80kg Gypsum (Crucial for calcium/shell hardening) + 100kg Neem cake.' },
      stage1: { stageName: 'Vegetative (25-30 DAS)', daysAfterSowing: 25, ureaKg: 15, mopKg: 0, foliarSpray: 'Boron (1g/L) for pollens & flowers' },
      stage2: { stageName: 'Peg Formation & Podding (45 DAS)', daysAfterSowing: 45, ureaKg: 0, mopKg: 15, foliarSpray: 'Apply 2nd dose Gypsum (80kg/acre) soil side-dressing and earth up' },
      stage3: { stageName: 'Pod Filling (70 DAS)', daysAfterSowing: 70, ureaKg: 0, mopKg: 10, foliarSpray: 'TNAU Groundnut Rich 2kg/acre in 200L water' }
    },
    organicAlternativesPerAcre: {
      fymTonnes: 4,
      vermicompostKg: 600,
      biofertilizers: ['Rhizobium (2 kg)', 'Phosphobacteria (2 kg)', 'Mycorrhiza (5 kg)'],
      neemCakeKg: 150,
      panchagavyaSprays: 'Gypsum (160kg total) + 3% Panchagavya spray at 35 and 55 DAS'
    },
    waterPerAcreLitresPerWeek: 15000,
    dripHoursPerDayPerAcre: 1.5,
    expectedYieldPerAcre: { min: 10, max: 15, unit: 'Quintals dry pods' },
    soilSuitability: 'Well drained sandy loam, light red soil with loose friable structure for easy peg penetration'
  },
  {
    id: 'maize',
    name: 'Maize / Corn',
    tamilName: 'மக்காச்சோளம்',
    category: 'Cereal / Grain',
    icon: '🌽',
    durationDays: 105,
    season: 'Purattasi / Thai Pattam',
    seedRateKgPerAcre: { min: 7.5, max: 8.5, unit: 'kg hybrid seeds', description: '7.5 to 8 kg hybrid seeds per acre (60x20 cm spacing)' },
    seedTreatment: 'Seed treatment with Thiamethoxam + Azospirillum for initial Fall Armyworm protection.',
    fertilizerPlanPerAcre: {
      basal: { ureaKg: 20, dapKg: 60, mopKg: 25, neemCakeKg: 50, microKg: 10, notes: 'Basal: 60kg DAP + 25kg MOP + 10kg Zinc Sulphate + 20kg Urea.' },
      stage1: { stageName: 'Knee-High Stage (25-30 DAS)', daysAfterSowing: 28, ureaKg: 45, mopKg: 10, foliarSpray: 'Metarhizium anisopliae or Neem oil for Fall Armyworm whorl spray' },
      stage2: { stageName: 'Tasseling & Silking (50-55 DAS)', daysAfterSowing: 52, ureaKg: 35, mopKg: 15, foliarSpray: '1% 19:19:19 foliar spray for bold cobs' }
    },
    organicAlternativesPerAcre: {
      fymTonnes: 5,
      vermicompostKg: 800,
      biofertilizers: ['Azospirillum (2 kg)', 'Phosphobacteria (2 kg)'],
      neemCakeKg: 100,
      panchagavyaSprays: 'Panchagavya 3% + Bacillus thuringiensis whorl application for pest immunity'
    },
    waterPerAcreLitresPerWeek: 20000,
    dripHoursPerDayPerAcre: 2.0,
    expectedYieldPerAcre: { min: 2.8, max: 3.8, unit: 'Tonnes grain' },
    soilSuitability: 'Deep, rich fertile loams with high organic matter and no waterlogging'
  },
  {
    id: 'banana',
    name: 'Banana (Grand Naine / G9)',
    tamilName: 'வாழை',
    category: 'Horticulture',
    icon: '🍌',
    durationDays: 330,
    season: 'All Seasons / Peak: Feb-Apr, Aug-Oct',
    seedRateKgPerAcre: { min: 1000, max: 1200, unit: 'tissue-culture suckers', description: '1,000 to 1,200 tissue-culture plantlets (6x6 ft spacing)' },
    seedTreatment: 'Sucker dip in Carbendazim (2g/L) + Monocrotophos + Pseudomonas for 20 mins.',
    fertilizerPlanPerAcre: {
      basal: { ureaKg: 25, dapKg: 75, mopKg: 50, neemCakeKg: 200, microKg: 15, notes: 'Basal: 75kg DAP + 50kg MOP + 200kg Neem cake in planting pits.' },
      stage1: { stageName: 'Vegetative Phase (Month 2-3)', daysAfterSowing: 60, ureaKg: 60, mopKg: 40, foliarSpray: 'Banana special micronutrient (5g/L)' },
      stage2: { stageName: 'Shooting & Bunch Emergence (Month 6-7)', daysAfterSowing: 190, ureaKg: 60, mopKg: 80, foliarSpray: '2,4-D (25 ppm) bunch spray for uniform finger expansion' },
      stage3: { stageName: 'Bunch Filling & Maturity (Month 9)', daysAfterSowing: 260, ureaKg: 30, mopKg: 60, foliarSpray: 'Sulphate of Potash (1%) spray on bunch' }
    },
    organicAlternativesPerAcre: {
      fymTonnes: 12,
      vermicompostKg: 2500,
      biofertilizers: ['AM Fungi (20g/pit)', 'Azospirillum (50g/pit)', 'Phosphobacteria (50g/pit)'],
      neemCakeKg: 300,
      panchagavyaSprays: '5% Panchagavya root feeding every 30 days + Banana pseudostem trap for weevil'
    },
    waterPerAcreLitresPerWeek: 58000,
    dripHoursPerDayPerAcre: 4.5,
    expectedYieldPerAcre: { min: 32, max: 48, unit: 'Tonnes bunches' },
    soilSuitability: 'Deep clay loam to sandy loam with good drainage, pH 6.0 - 7.5'
  },
  {
    id: 'turmeric',
    name: 'Turmeric',
    tamilName: 'மஞ்சள்',
    category: 'Commercial / Cash',
    icon: '✨',
    durationDays: 270,
    season: 'Vaikasi Pattam (May-June)',
    seedRateKgPerAcre: { min: 900, max: 1100, unit: 'kg rhizomes', description: '1,000 kg healthy mother/finger rhizomes with 2-3 buds' },
    seedTreatment: 'Treat rhizomes with Mancozeb (3g/L) + Trichoderma viride to prevent rhizome rot.',
    fertilizerPlanPerAcre: {
      basal: { ureaKg: 0, dapKg: 80, mopKg: 40, neemCakeKg: 200, microKg: 10, notes: 'Basal: 80kg DAP + 40kg MOP + 10kg Zinc Sulphate + 200kg Neem cake.' },
      stage1: { stageName: 'Tillering Phase (45 DAS)', daysAfterSowing: 45, ureaKg: 35, mopKg: 20, foliarSpray: 'Ferrous sulphate (0.5%) for green leaves' },
      stage2: { stageName: 'Rhizome Formation (90 DAS)', daysAfterSowing: 90, ureaKg: 35, mopKg: 30, foliarSpray: 'TNAU Turmeric Booster foliar spray' },
      stage3: { stageName: 'Rhizome Development (120-150 DAS)', daysAfterSowing: 135, ureaKg: 25, mopKg: 25, foliarSpray: 'Potassium schoenite (1%) for curcumin enrichment' }
    },
    organicAlternativesPerAcre: {
      fymTonnes: 10,
      vermicompostKg: 1500,
      biofertilizers: ['Azospirillum (2 kg)', 'Phosphobacteria (2 kg)', 'VAM (5 kg)'],
      neemCakeKg: 250,
      panchagavyaSprays: 'Panchagavya 3% spray on 30, 60, 90, 120 DAS + Coir pith mulching'
    },
    waterPerAcreLitresPerWeek: 28000,
    dripHoursPerDayPerAcre: 2.4,
    expectedYieldPerAcre: { min: 8, max: 12, unit: 'Tonnes fresh rhizomes (2 - 2.5 t cured)' },
    soilSuitability: 'Well drained rich friable loamy soil, red loam with high organic carbon'
  },
  {
    id: 'blackgram',
    name: 'Black Gram / Urad Dal',
    tamilName: 'உளுந்து',
    category: 'Pulse',
    icon: '🥣',
    durationDays: 70,
    season: 'Aadi / Purattasi / Rice Fallow (Thai)',
    seedRateKgPerAcre: { min: 8, max: 10, unit: 'kg seeds', description: '8-10 kg pure crop; 12-15 kg for rice fallow broadcasting' },
    seedTreatment: 'Treat with Rhizobium (TNAU culture) + Trichoderma viride (4g/kg) to boost atmospheric nitrogen fixation.',
    fertilizerPlanPerAcre: {
      basal: { ureaKg: 10, dapKg: 35, mopKg: 15, neemCakeKg: 50, microKg: 5, notes: 'Basal: 35kg DAP + 15kg MOP + 10kg Urea + 50kg Neem cake.' },
      stage1: { stageName: 'Flower Initiation (25-30 DAS)', daysAfterSowing: 28, ureaKg: 0, mopKg: 0, foliarSpray: '2% DAP or TNAU Pulse Wonder (2kg/acre) spray to prevent flower dropping' },
      stage2: { stageName: 'Pod Formation (40-45 DAS)', daysAfterSowing: 42, ureaKg: 0, mopKg: 0, foliarSpray: '2nd spray of TNAU Pulse Wonder for bold seeds & pod setting' }
    },
    organicAlternativesPerAcre: {
      fymTonnes: 2.5,
      vermicompostKg: 400,
      biofertilizers: ['Rhizobium (2 kg)', 'Phosphobacteria (2 kg)'],
      neemCakeKg: 100,
      panchagavyaSprays: '3% Panchagavya at flowering + 5% Neem seed kernel extract (NSKE) for pod borer prevention'
    },
    waterPerAcreLitresPerWeek: 8500,
    dripHoursPerDayPerAcre: 0.9,
    expectedYieldPerAcre: { min: 4, max: 6.5, unit: 'Quintals clean grain' },
    soilSuitability: 'Sandy loam to clay loam soils with good moisture retention and non-saline conditions'
  },
  {
    id: 'chillies',
    name: 'Chillies / Red Pepper',
    tamilName: 'மிளகாய்',
    category: 'Horticulture',
    icon: '🌶️',
    durationDays: 150,
    season: 'Aadi / Thai Pattam',
    seedRateKgPerAcre: { min: 0.35, max: 0.45, unit: 'kg (hybrid) or 1kg regular', description: '350 - 450 g hybrid seeds for pro-tray nursery raising' },
    seedTreatment: 'Seed treatment with Pseudomonas fluorescens (10g/kg) to eliminate damping off disease.',
    fertilizerPlanPerAcre: {
      basal: { ureaKg: 15, dapKg: 50, mopKg: 25, neemCakeKg: 100, microKg: 5, notes: 'Basal: 50kg DAP + 25kg MOP + 15kg Urea + 5kg Borax + 100kg Neem cake.' },
      stage1: { stageName: 'Vegetative & Branching (30 DAT)', daysAfterSowing: 30, ureaKg: 25, mopKg: 15, foliarSpray: 'Planofix (1ml/4L) to prevent flower fall' },
      stage2: { stageName: 'Peak Flowering (60 DAT)', daysAfterSowing: 60, ureaKg: 25, mopKg: 20, foliarSpray: '13:0:45 (Potassium nitrate 1%) for shiny pungent fruits' },
      stage3: { stageName: 'Continuous Picking (90-120 DAT)', daysAfterSowing: 90, ureaKg: 20, mopKg: 15, foliarSpray: 'Micronutrient cocktail (2g/L) for extended harvest' }
    },
    organicAlternativesPerAcre: {
      fymTonnes: 6,
      vermicompostKg: 1000,
      biofertilizers: ['Azospirillum (2 kg)', 'Phosphobacteria (2 kg)'],
      neemCakeKg: 200,
      panchagavyaSprays: 'Panchagavya 3% + Agni Astra / Ginger-Garlic-Chilli extract for thrips & mite repellent'
    },
    waterPerAcreLitresPerWeek: 16000,
    dripHoursPerDayPerAcre: 1.6,
    expectedYieldPerAcre: { min: 8, max: 14, unit: 'Quintals dry chillies (or 4 - 7 t green)' },
    soilSuitability: 'Deep black soil, sandy loam, or red soil with high aeration and neutral pH'
  },
  {
    id: 'tomato',
    name: 'Tomato',
    tamilName: 'தக்காளி',
    category: 'Horticulture',
    icon: '🍅',
    durationDays: 130,
    season: 'May-June / Nov-Dec',
    seedRateKgPerAcre: { min: 0.15, max: 0.20, unit: 'kg hybrid seeds', description: '150 - 200 grams hybrid seeds (75x60 cm spacing)' },
    seedTreatment: 'Treat nursery seeds with Trichoderma harzianum (5g/kg) against collar rot.',
    fertilizerPlanPerAcre: {
      basal: { ureaKg: 20, dapKg: 75, mopKg: 35, neemCakeKg: 150, microKg: 10, notes: 'Basal: 75kg DAP + 35kg MOP + 20kg Urea + 10kg Calcium Nitrate + 150kg Neem cake.' },
      stage1: { stageName: 'Vegetative Growth (25 DAT)', daysAfterSowing: 25, ureaKg: 30, mopKg: 15, foliarSpray: '19:19:19 (0.5%) + Micronutrient mixture' },
      stage2: { stageName: 'Fruit Setting (50 DAT)', daysAfterSowing: 50, ureaKg: 25, mopKg: 25, foliarSpray: 'Calcium Nitrate + Boron (1g/L) to prevent blossom end rot' },
      stage3: { stageName: 'Fruit Maturation & Harvest (75 DAT)', daysAfterSowing: 75, ureaKg: 15, mopKg: 25, foliarSpray: '0:0:50 (Potassium sulphate) for firm, red fruits' }
    },
    organicAlternativesPerAcre: {
      fymTonnes: 8,
      vermicompostKg: 1200,
      biofertilizers: ['Azospirillum (2 kg)', 'Phosphobacteria (2 kg)'],
      neemCakeKg: 200,
      panchagavyaSprays: '3% Panchagavya spray + Fish Amino Acid (FAA) every 15 days for robust flowering'
    },
    waterPerAcreLitresPerWeek: 21000,
    dripHoursPerDayPerAcre: 2.1,
    expectedYieldPerAcre: { min: 14, max: 24, unit: 'Tonnes fresh tomatoes' },
    soilSuitability: 'Well drained sandy loam, rich in humus, with pH 6.0 - 7.0'
  },
  {
    id: 'coconut',
    name: 'Coconut',
    tamilName: 'தென்னை',
    category: 'Plantation',
    icon: '🥥',
    durationDays: 365,
    season: 'Perennial (Year-round)',
    seedRateKgPerAcre: { min: 65, max: 70, unit: 'seedlings / trees', description: '65 to 70 quality hybrid/tall seedlings (25x25 ft square spacing)' },
    seedTreatment: 'Pit preparation with 50kg FYM, 1kg neem cake, and 250g Trichoderma per pit.',
    fertilizerPlanPerAcre: {
      basal: { ureaKg: 90, dapKg: 70, mopKg: 140, neemCakeKg: 150, microKg: 35, notes: 'Annual dosage: 90kg Urea + 70kg DAP + 140kg MOP + 35kg Magnesium Sulphate + 5kg Borax for 70 trees.' },
      stage1: { stageName: 'Pre-Monsoon Application (May-June)', daysAfterSowing: 150, ureaKg: 45, mopKg: 70, foliarSpray: 'TNAU Coconut Tonic (200ml/palm) root feeding' },
      stage2: { stageName: 'Post-Monsoon Application (Oct-Nov)', daysAfterSowing: 300, ureaKg: 45, mopKg: 70, foliarSpray: 'TNAU Coconut Tonic 2nd round root feeding for button shedding control' }
    },
    organicAlternativesPerAcre: {
      fymTonnes: 5,
      vermicompostKg: 1500,
      biofertilizers: ['Azospirillum (2 kg)', 'Phosphobacteria (2 kg)', 'Mycorrhiza (5 kg)'],
      neemCakeKg: 200,
      panchagavyaSprays: 'Green manuring (Sunnhemp) in palm basins + Rhinoceros beetle pheromone traps'
    },
    waterPerAcreLitresPerWeek: 32000,
    dripHoursPerDayPerAcre: 3.0,
    expectedYieldPerAcre: { min: 7000, max: 11000, unit: 'Nuts per year (100 - 160 nuts/palm)' },
    soilSuitability: 'Coastal sand, alluvial loams, deep red loams with adequate water table'
  },
  {
    id: 'jasmine',
    name: 'Jasmine / Malligai (Gundu Malli)',
    tamilName: 'குண்டு மல்லி',
    category: 'Floriculture',
    icon: '🌸',
    durationDays: 365,
    season: 'Peak Flowering: March - August',
    seedRateKgPerAcre: { min: 2400, max: 2600, unit: 'rooted cuttings / layers', description: '2,500 rooted layers per acre (4x4 ft or 5x5 ft spacing)' },
    seedTreatment: 'Dip cuttings in IBA (4000 ppm) + Pseudomonas solution for rapid root establishment.',
    fertilizerPlanPerAcre: {
      basal: { ureaKg: 50, dapKg: 80, mopKg: 60, neemCakeKg: 200, microKg: 10, notes: 'Post-Pruning Basal (Dec-Jan): 80kg DAP + 60kg MOP + 50kg Urea + 200kg Neem cake.' },
      stage1: { stageName: 'Flush Emergence (Feb-March)', daysAfterSowing: 60, ureaKg: 40, mopKg: 30, foliarSpray: 'Zinc Sulphate (0.25%) + Boric Acid (0.1%) foliar spray' },
      stage2: { stageName: 'Peak Flower Bud Formation (May-June)', daysAfterSowing: 150, ureaKg: 40, mopKg: 30, foliarSpray: 'Humic acid (0.2%) + Micronutrients for larger fragrant buds' }
    },
    organicAlternativesPerAcre: {
      fymTonnes: 8,
      vermicompostKg: 1500,
      biofertilizers: ['Azospirillum (2 kg)', 'Phosphobacteria (2 kg)'],
      neemCakeKg: 250,
      panchagavyaSprays: '3% Panchagavya spray every 15 days after defoliation for dense bud clusters'
    },
    waterPerAcreLitresPerWeek: 22000,
    dripHoursPerDayPerAcre: 2.2,
    expectedYieldPerAcre: { min: 3.2, max: 4.5, unit: 'Tonnes fresh flower buds' },
    soilSuitability: 'Well-drained red loamy soil with rich organic content and full sunlight exposure'
  }
];

interface AgriFarmCalculatorProps {
  initialCropId?: string;
  isOpenModal?: boolean;
  onClose?: () => void;
}

export const AgriFarmCalculator: React.FC<AgriFarmCalculatorProps> = ({
  initialCropId = 'paddy',
  isOpenModal = false,
  onClose
}) => {
  // Calculator States
  const [selectedCropId, setSelectedCropId] = useState<string>(initialCropId);
  const [landAreaValue, setLandAreaValue] = useState<number>(2.0);
  const [landUnit, setLandUnit] = useState<LandUnit>('acres');
  const [farmingMethod, setFarmingMethod] = useState<FarmingMethod>('integrated');
  const [irrigationMethod, setIrrigationMethod] = useState<IrrigationMethod>('drip');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Convert any land area into standard Acre equivalent
  const acresEquivalent = useMemo(() => {
    if (landUnit === 'acres') return landAreaValue;
    if (landUnit === 'hectares') return landAreaValue * 2.47105;
    if (landUnit === 'cents') return landAreaValue / 100;
    return landAreaValue;
  }, [landAreaValue, landUnit]);

  // Selected crop agronomy profile
  const selectedCrop = useMemo(() => {
    return CROP_AGRONOMY_DATABASE.find(c => c.id === selectedCropId) || CROP_AGRONOMY_DATABASE[0];
  }, [selectedCropId]);

  // Filtered crop list
  const filteredCrops = useMemo(() => {
    return CROP_AGRONOMY_DATABASE.filter(crop => {
      const matchesSearch = crop.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                            crop.tamilName.includes(searchFilter);
      const matchesCategory = categoryFilter === 'all' || crop.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchFilter, categoryFilter]);

  // Calculations
  const calculatedMetrics = useMemo(() => {
    const factor = acresEquivalent;
    const crop = selectedCrop;

    // Seeds
    const seedMin = (crop.seedRateKgPerAcre.min * factor);
    const seedMax = (crop.seedRateKgPerAcre.max * factor);

    // Fertilizers
    const basal = crop.fertilizerPlanPerAcre.basal;
    const stage1 = crop.fertilizerPlanPerAcre.stage1;
    const stage2 = crop.fertilizerPlanPerAcre.stage2;
    const stage3 = crop.fertilizerPlanPerAcre.stage3;

    const totalUreaKg = (basal.ureaKg + stage1.ureaKg + (stage2?.ureaKg || 0) + (stage3?.ureaKg || 0)) * factor;
    const totalDapKg = basal.dapKg * factor;
    const totalMopKg = (basal.mopKg + stage1.mopKg + (stage2?.mopKg || 0) + (stage3?.mopKg || 0)) * factor;
    const totalNeemCakeKg = basal.neemCakeKg * factor;

    // 50kg Bags count
    const ureaBags = (totalUreaKg / 50).toFixed(1);
    const dapBags = (totalDapKg / 50).toFixed(1);
    const mopBags = (totalMopKg / 50).toFixed(1);

    // Organic alternatives
    const org = crop.organicAlternativesPerAcre;
    const totalFymTonnes = (org.fymTonnes * factor).toFixed(1);
    const totalVermicompostKg = Math.round(org.vermicompostKg * factor);
    const totalOrgNeemKg = Math.round(org.neemCakeKg * factor);

    // Water
    const weeklyWaterLitres = Math.round(crop.waterPerAcreLitresPerWeek * factor);
    const dailyDripHours = (crop.dripHoursPerDayPerAcre * (irrigationMethod === 'drip' ? 1 : 2)).toFixed(1);

    // Yield
    const yieldMin = (crop.expectedYieldPerAcre.min * factor).toFixed(1);
    const yieldMax = (crop.expectedYieldPerAcre.max * factor).toFixed(1);

    return {
      factor,
      seedMin: seedMin < 10 ? seedMin.toFixed(1) : Math.round(seedMin),
      seedMax: seedMax < 10 ? seedMax.toFixed(1) : Math.round(seedMax),
      seedUnit: crop.seedRateKgPerAcre.unit,
      totalUreaKg: Math.round(totalUreaKg),
      totalDapKg: Math.round(totalDapKg),
      totalMopKg: Math.round(totalMopKg),
      totalNeemCakeKg: Math.round(totalNeemCakeKg),
      ureaBags,
      dapBags,
      mopBags,
      totalFymTonnes,
      totalVermicompostKg,
      totalOrgNeemKg,
      weeklyWaterLitres,
      dailyDripHours,
      yieldMin,
      yieldMax,
      yieldUnit: crop.expectedYieldPerAcre.unit
    };
  }, [selectedCrop, acresEquivalent, irrigationMethod]);

  const content = (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Tool Header */}
      <div className="p-6 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669] shadow-sm">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-[#17201C] tracking-tight">
                  Land Acreage, Seed & Fertilizer Calculator
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] font-bold">
                  TNAU Certified
                </span>
              </div>
              <p className="text-xs text-[#64706A]">
                விவசாய நில அளவு, விதை மற்றும் உர அளவீடு கால்குலேட்டர் • Instant agronomic calculation for any land size.
              </p>
            </div>
          </div>
        </div>

        {isOpenModal && onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#F8FAF9] hover:bg-[#F0F4F2] border border-[#DDE5E1] text-xs font-bold text-[#17201C] transition cursor-pointer"
          >
            Close Calculator
          </button>
        )}
      </div>

      {/* 2. Interactive Input Controls Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Land Area Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDE5E1] pb-3">
              <span className="text-xs font-bold text-[#17201C] flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#059669]" />
                <span>1. Enter Land Area & Unit</span>
              </span>
              <span className="text-[11px] text-[#059669] font-bold">
                = {acresEquivalent.toFixed(2)} Acres
              </span>
            </div>

            {/* Land Value Input & Presets */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0.1"
                    max="500"
                    step="0.1"
                    value={landAreaValue}
                    onChange={(e) => setLandAreaValue(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] text-[#17201C] font-extrabold text-base focus:outline-none focus:ring-2 focus:ring-[#059669] focus:bg-white transition"
                    placeholder="Enter area"
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs text-[#64706A] font-bold uppercase">
                    {landUnit}
                  </span>
                </div>

                {/* Unit Switcher */}
                <div className="flex rounded-xl bg-[#F8FAF9] p-1 border border-[#DDE5E1]">
                  {(['acres', 'cents', 'hectares'] as LandUnit[]).map((unit) => (
                    <button
                      key={unit}
                      onClick={() => setLandUnit(unit)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                        landUnit === unit
                          ? 'bg-[#059669] text-white shadow-xs'
                          : 'text-[#64706A] hover:text-[#17201C]'
                      }`}
                    >
                      {unit === 'acres' ? 'Acres (ஏக்கர்)' : unit === 'cents' ? 'Cents (சென்ட்)' : 'Hectares (ஹெக்)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Area Presets */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-[#64706A] font-bold mr-1">Quick Presets:</span>
                {[0.5, 1.0, 2.0, 2.5, 5.0, 10.0].map((val) => (
                  <button
                    key={val}
                    onClick={() => { setLandAreaValue(val); setLandUnit('acres'); }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-bold transition cursor-pointer ${
                      landAreaValue === val && landUnit === 'acres'
                        ? 'bg-[#ECFDF5] border-[#059669] text-[#047857]'
                        : 'bg-white border-[#DDE5E1] text-[#64706A] hover:border-[#059669]'
                    }`}
                  >
                    {val} Ac
                  </button>
                ))}
              </div>
            </div>

            {/* Method & Irrigation Selectors */}
            <div className="pt-3 border-t border-[#DDE5E1] grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#17201C] block mb-1.5">Nutrient Regimen</label>
                <div className="grid grid-cols-2 gap-1 bg-[#F8FAF9] p-1 rounded-xl border border-[#DDE5E1]">
                  <button
                    onClick={() => setFarmingMethod('integrated')}
                    className={`py-1.5 text-[10px] font-bold rounded-lg transition cursor-pointer ${
                      farmingMethod === 'integrated'
                        ? 'bg-[#059669] text-white shadow-xs'
                        : 'text-[#64706A]'
                    }`}
                  >
                    Integrated
                  </button>
                  <button
                    onClick={() => setFarmingMethod('organic')}
                    className={`py-1.5 text-[10px] font-bold rounded-lg transition cursor-pointer ${
                      farmingMethod === 'organic'
                        ? 'bg-[#059669] text-white shadow-xs'
                        : 'text-[#64706A]'
                    }`}
                  >
                    100% Organic
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#17201C] block mb-1.5">Irrigation Setup</label>
                <div className="grid grid-cols-2 gap-1 bg-[#F8FAF9] p-1 rounded-xl border border-[#DDE5E1]">
                  <button
                    onClick={() => setIrrigationMethod('drip')}
                    className={`py-1.5 text-[10px] font-bold rounded-lg transition cursor-pointer ${
                      irrigationMethod === 'drip'
                        ? 'bg-[#059669] text-white shadow-xs'
                        : 'text-[#64706A]'
                    }`}
                  >
                    Drip
                  </button>
                  <button
                    onClick={() => setIrrigationMethod('flood')}
                    className={`py-1.5 text-[10px] font-bold rounded-lg transition cursor-pointer ${
                      irrigationMethod === 'flood'
                        ? 'bg-[#059669] text-white shadow-xs'
                        : 'text-[#64706A]'
                    }`}
                  >
                    Flood / Canal
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Crop Selector Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#DDE5E1] pb-3">
              <span className="text-xs font-bold text-[#17201C] flex items-center gap-2">
                <Sprout className="w-4 h-4 text-[#059669]" />
                <span>2. Select Cultivation Crop ({filteredCrops.length})</span>
              </span>
              <span className="text-xs text-[#64706A]">
                Selected: <strong className="text-[#059669]">{selectedCrop.name}</strong>
              </span>
            </div>

            {/* Search and Category Filter */}
            <div className="space-y-2">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search crop or Tamil name (e.g. நெல், Cotton, Banana)..."
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] text-xs text-[#17201C] focus:outline-none focus:ring-1 focus:ring-[#059669] focus:bg-white"
              />

              {/* Category Pills */}
              <div className="flex gap-1 overflow-x-auto pb-1 text-[10px]">
                {['all', 'Cereal / Grain', 'Pulse', 'Commercial / Cash', 'Oilseed', 'Horticulture'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-full border whitespace-nowrap font-bold transition cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-[#ECFDF5] border-[#059669] text-[#047857]'
                        : 'bg-white border-[#DDE5E1] text-[#64706A]'
                    }`}
                  >
                    {cat === 'all' ? 'All Crops' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Crop Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {filteredCrops.map((crop) => {
                const isSelected = crop.id === selectedCropId;
                return (
                  <button
                    key={crop.id}
                    onClick={() => setSelectedCropId(crop.id)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#ECFDF5] border-[#059669] shadow-xs'
                        : 'bg-white border-[#DDE5E1] hover:border-[#CBD7D2]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{crop.icon}</span>
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? 'text-[#047857]' : 'text-[#17201C]'}`}>
                          {crop.name}
                        </div>
                        <div className="text-[10px] text-[#64706A] font-semibold">
                          {crop.tamilName}
                        </div>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#059669] flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Calculated Agronomic Output (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Summary Hero Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#064E3B] to-[#047857] text-white shadow-md space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold inline-block">
                  Field Agronomic Prescription
                </span>
                <h3 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                  <span>{selectedCrop.icon}</span>
                  <span>{selectedCrop.name}</span>
                  <span className="text-emerald-200 font-normal">({selectedCrop.tamilName})</span>
                </h3>
                <div className="text-xs text-emerald-100 flex items-center gap-3">
                  <span>📐 Area: <strong>{landAreaValue} {landUnit} ({acresEquivalent.toFixed(2)} Ac)</strong></span>
                  <span>🗓️ Cycle: <strong>{selectedCrop.durationDays} Days</strong></span>
                  <span>🌱 {selectedCrop.season}</span>
                </div>
              </div>

              <div className="text-right bg-white/10 p-3 rounded-xl border border-white/20">
                <div className="text-[10px] text-emerald-200 font-bold uppercase">Expected Harvest</div>
                <div className="text-lg font-black text-white">
                  {calculatedMetrics.yieldMin} - {calculatedMetrics.yieldMax}
                </div>
                <div className="text-[10px] text-emerald-200">{calculatedMetrics.yieldUnit}</div>
              </div>
            </div>

            {/* 4 Quick Metric Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10">
              <div className="bg-white/10 p-2.5 rounded-xl text-center">
                <div className="text-[10px] text-emerald-200 font-bold">Total Seed Need</div>
                <div className="text-sm font-black text-white">
                  {calculatedMetrics.seedMin} - {calculatedMetrics.seedMax} {calculatedMetrics.seedUnit}
                </div>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl text-center">
                <div className="text-[10px] text-emerald-200 font-bold">Urea Required</div>
                <div className="text-sm font-black text-white">
                  {calculatedMetrics.totalUreaKg} kg <span className="text-[10px] opacity-80">({calculatedMetrics.ureaBags} bags)</span>
                </div>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl text-center">
                <div className="text-[10px] text-emerald-200 font-bold">DAP Required</div>
                <div className="text-sm font-black text-white">
                  {calculatedMetrics.totalDapKg} kg <span className="text-[10px] opacity-80">({calculatedMetrics.dapBags} bags)</span>
                </div>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl text-center">
                <div className="text-[10px] text-emerald-200 font-bold">Water Requirement</div>
                <div className="text-sm font-black text-white">
                  {(calculatedMetrics.weeklyWaterLitres / 1000).toFixed(0)}k L / wk
                </div>
              </div>
            </div>
          </div>

          {/* Seed Requirement & Treatment Guidance */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-[#17201C] uppercase tracking-wider flex items-center gap-2">
              <Sprout className="w-4 h-4 text-[#059669]" />
              <span>1. Seed / Planting Material Quantity & Pre-Treatment</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] space-y-1">
                <div className="text-[11px] font-bold text-[#17201C]">Recommended Seed Quantity:</div>
                <div className="text-base font-extrabold text-[#059669]">
                  {calculatedMetrics.seedMin} to {calculatedMetrics.seedMax} {calculatedMetrics.seedUnit}
                </div>
                <p className="text-[10px] text-[#64706A]">
                  {selectedCrop.seedRateKgPerAcre.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] space-y-1">
                <div className="text-[11px] font-bold text-[#047857] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Mandatory Seed Treatment (விதை நேர்த்தி):</span>
                </div>
                <p className="text-[11px] text-[#065F46] leading-relaxed">
                  {selectedCrop.seedTreatment}
                </p>
              </div>
            </div>
          </div>

          {/* Fertilizer Dosage & Stage-wise Schedule */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#DDE5E1] pb-2">
              <h4 className="text-xs font-bold text-[#17201C] uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#059669]" />
                <span>2. {farmingMethod === 'integrated' ? 'NPK Fertilizer Schedule (உர அட்டவணை)' : 'Organic Manure Schedule (இயற்கை உரம்)'}</span>
              </h4>
              <span className="text-[11px] text-[#059669] font-bold">
                TNAU Precision Dosage
              </span>
            </div>

            {farmingMethod === 'integrated' ? (
              <div className="space-y-3">
                {/* Total Bags Breakdown Bar */}
                <div className="grid grid-cols-4 gap-2 p-3 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] text-center text-xs">
                  <div>
                    <span className="text-[10px] text-[#64706A] block">Urea (46% N)</span>
                    <strong className="text-[#17201C] font-bold">{calculatedMetrics.totalUreaKg} kg</strong>
                    <span className="text-[10px] text-[#059669] block">({calculatedMetrics.ureaBags} bags)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64706A] block">DAP (18-46-0)</span>
                    <strong className="text-[#17201C] font-bold">{calculatedMetrics.totalDapKg} kg</strong>
                    <span className="text-[10px] text-[#059669] block">({calculatedMetrics.dapBags} bags)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64706A] block">MOP Potash</span>
                    <strong className="text-[#17201C] font-bold">{calculatedMetrics.totalMopKg} kg</strong>
                    <span className="text-[10px] text-[#059669] block">({calculatedMetrics.mopBags} bags)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64706A] block">Neem Cake</span>
                    <strong className="text-[#17201C] font-bold">{calculatedMetrics.totalNeemCakeKg} kg</strong>
                    <span className="text-[10px] text-[#64706A] block">Organic basal</span>
                  </div>
                </div>

                {/* Stage by stage table */}
                <div className="space-y-2 text-xs">
                  {/* Basal Application */}
                  <div className="p-3 rounded-xl bg-white border border-[#DDE5E1] space-y-1">
                    <div className="flex items-center justify-between font-bold text-[#17201C]">
                      <span className="flex items-center gap-1.5 text-[#059669]">
                        <span className="w-2 h-2 rounded-full bg-[#059669]" />
                        1. Basal Application (அடி உரம் - At Sowing / Transplanting)
                      </span>
                      <span className="text-[11px] text-[#64706A]">Day 0</span>
                    </div>
                    <p className="text-[11px] text-[#64706A]">
                      {selectedCrop.fertilizerPlanPerAcre.basal.notes}
                    </p>
                  </div>

                  {/* Stage 1 */}
                  {selectedCrop.fertilizerPlanPerAcre.stage1 && (
                    <div className="p-3 rounded-xl bg-white border border-[#DDE5E1] space-y-1">
                      <div className="flex items-center justify-between font-bold text-[#17201C]">
                        <span className="flex items-center gap-1.5 text-[#0284C7]">
                          <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                          2. {selectedCrop.fertilizerPlanPerAcre.stage1.stageName}
                        </span>
                        <span className="text-[11px] text-[#64706A]">{selectedCrop.fertilizerPlanPerAcre.stage1.daysAfterSowing} DAS</span>
                      </div>
                      <div className="text-[11px] text-[#64706A] flex items-center gap-4 flex-wrap">
                        {selectedCrop.fertilizerPlanPerAcre.stage1.ureaKg > 0 && (
                          <span>Urea: <strong>{Math.round(selectedCrop.fertilizerPlanPerAcre.stage1.ureaKg * acresEquivalent)} kg</strong></span>
                        )}
                        {selectedCrop.fertilizerPlanPerAcre.stage1.mopKg > 0 && (
                          <span>Potash (MOP): <strong>{Math.round(selectedCrop.fertilizerPlanPerAcre.stage1.mopKg * acresEquivalent)} kg</strong></span>
                        )}
                        {selectedCrop.fertilizerPlanPerAcre.stage1.foliarSpray && (
                          <span className="text-[#047857]">Spray: {selectedCrop.fertilizerPlanPerAcre.stage1.foliarSpray}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stage 2 */}
                  {selectedCrop.fertilizerPlanPerAcre.stage2 && (
                    <div className="p-3 rounded-xl bg-white border border-[#DDE5E1] space-y-1">
                      <div className="flex items-center justify-between font-bold text-[#17201C]">
                        <span className="flex items-center gap-1.5 text-[#D97706]">
                          <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                          3. {selectedCrop.fertilizerPlanPerAcre.stage2.stageName}
                        </span>
                        <span className="text-[11px] text-[#64706A]">{selectedCrop.fertilizerPlanPerAcre.stage2.daysAfterSowing} DAS</span>
                      </div>
                      <div className="text-[11px] text-[#64706A] flex items-center gap-4 flex-wrap">
                        {selectedCrop.fertilizerPlanPerAcre.stage2.ureaKg > 0 && (
                          <span>Urea: <strong>{Math.round(selectedCrop.fertilizerPlanPerAcre.stage2.ureaKg * acresEquivalent)} kg</strong></span>
                        )}
                        {selectedCrop.fertilizerPlanPerAcre.stage2.mopKg > 0 && (
                          <span>Potash (MOP): <strong>{Math.round(selectedCrop.fertilizerPlanPerAcre.stage2.mopKg * acresEquivalent)} kg</strong></span>
                        )}
                        {selectedCrop.fertilizerPlanPerAcre.stage2.foliarSpray && (
                          <span className="text-[#047857]">Spray: {selectedCrop.fertilizerPlanPerAcre.stage2.foliarSpray}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stage 3 */}
                  {selectedCrop.fertilizerPlanPerAcre.stage3 && (
                    <div className="p-3 rounded-xl bg-white border border-[#DDE5E1] space-y-1">
                      <div className="flex items-center justify-between font-bold text-[#17201C]">
                        <span className="flex items-center gap-1.5 text-[#7C3AED]">
                          <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                          4. {selectedCrop.fertilizerPlanPerAcre.stage3.stageName}
                        </span>
                        <span className="text-[11px] text-[#64706A]">{selectedCrop.fertilizerPlanPerAcre.stage3.daysAfterSowing} DAS</span>
                      </div>
                      <div className="text-[11px] text-[#64706A] flex items-center gap-4 flex-wrap">
                        {selectedCrop.fertilizerPlanPerAcre.stage3.ureaKg > 0 && (
                          <span>Urea: <strong>{Math.round(selectedCrop.fertilizerPlanPerAcre.stage3.ureaKg * acresEquivalent)} kg</strong></span>
                        )}
                        {selectedCrop.fertilizerPlanPerAcre.stage3.mopKg > 0 && (
                          <span>Potash (MOP): <strong>{Math.round(selectedCrop.fertilizerPlanPerAcre.stage3.mopKg * acresEquivalent)} kg</strong></span>
                        )}
                        {selectedCrop.fertilizerPlanPerAcre.stage3.foliarSpray && (
                          <span className="text-[#047857]">Spray: {selectedCrop.fertilizerPlanPerAcre.stage3.foliarSpray}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Organic Alternative Plan */
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-center text-xs">
                  <div>
                    <span className="text-[10px] text-[#065F46] block">FYM / Cow Manure</span>
                    <strong className="text-[#047857] font-bold">{calculatedMetrics.totalFymTonnes} Tonnes</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#065F46] block">Vermicompost</span>
                    <strong className="text-[#047857] font-bold">{calculatedMetrics.totalVermicompostKg} kg</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#065F46] block">Neem Cake</span>
                    <strong className="text-[#047857] font-bold">{calculatedMetrics.totalOrgNeemKg} kg</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#DDE5E1] space-y-1.5 text-xs">
                  <div className="font-bold text-[#17201C] flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-[#059669]" />
                    <span>Bio-fertilizer Inoculation & Panchagavya Protocol:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCrop.organicAlternativesPerAcre.biofertilizers.map((bio, bIdx) => (
                      <span key={bIdx} className="text-[10px] px-2 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] font-bold">
                        {bio}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#64706A] pt-1">
                    🌿 {selectedCrop.organicAlternativesPerAcre.panchagavyaSprays}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Water & Irrigation Schedule */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDE5E1] shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-[#17201C] uppercase tracking-wider flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#0284C7]" />
              <span>3. Irrigation Budget & Drip Run-Time</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] space-y-1">
                <span className="text-[11px] text-[#0369A1] font-bold">Weekly Water Requirement:</span>
                <div className="text-lg font-black text-[#0284C7]">
                  {calculatedMetrics.weeklyWaterLitres.toLocaleString()} Liters / week
                </div>
                <p className="text-[10px] text-[#64706A]">
                  Equivalent to approx {Math.round(calculatedMetrics.weeklyWaterLitres / 7 / (acresEquivalent || 1)).toLocaleString()} L / acre / day.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#DDE5E1] space-y-1">
                <span className="text-[11px] text-[#17201C] font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Drip Operating Schedule:</span>
                </span>
                <div className="text-lg font-black text-[#17201C]">
                  {calculatedMetrics.dailyDripHours} Hours / day
                </div>
                <p className="text-[10px] text-[#64706A]">
                  Calculated for standard 4 LPH inline drippers in two split cycles (morning & evening).
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );

  if (isOpenModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
        <div className="bg-white rounded-3xl border border-[#DDE5E1] shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-6">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
