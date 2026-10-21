/**
 * Pest & Disease Risk Data for Tamil Nadu Crops
 * Weather-correlated agricultural pest/disease prediction engine
 */

export interface PestDiseaseEntry {
  id: string;
  name: string;
  tamilName: string;
  type: 'pest' | 'disease' | 'fungal' | 'viral' | 'bacterial';
  affectedCrops: string[];
  triggerConditions: {
    tempMinC: number;
    tempMaxC: number;
    humidityMinPct: number;
    humidityMaxPct: number;
    rainfallTriggerMm: number;
    windSpeedMaxKmh: number;
  };
  symptoms: string;
  preventionTamil: string;
  prevention: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  seasonMonths: number[]; // 0-indexed months
  iconEmoji: string;
}

export const PEST_DISEASE_DATABASE: PestDiseaseEntry[] = [
  {
    id: 'rice-blast',
    name: 'Rice Blast (Pyricularia oryzae)',
    tamilName: 'நெல் வெடிப்பு நோய்',
    type: 'fungal',
    affectedCrops: ['Rice (Paddy)', 'Samba Rice'],
    triggerConditions: { tempMinC: 22, tempMaxC: 30, humidityMinPct: 80, humidityMaxPct: 100, rainfallTriggerMm: 5, windSpeedMaxKmh: 30 },
    symptoms: 'Diamond-shaped lesions on leaves with grey center. Neck rot causing white panicles.',
    prevention: 'Use blast-resistant varieties (ADT 43, CO 51). Apply Tricyclazole 75% WP at 0.6g/L. Maintain balanced NPK fertilization.',
    preventionTamil: 'வெடிப்பு எதிர்ப்பு ரகங்களை பயன்படுத்தவும். ட்ரைசைக்ளாசோல் 75% தெளிக்கவும்.',
    severity: 'critical',
    seasonMonths: [5, 6, 7, 8, 9, 10],
    iconEmoji: '🍚'
  },
  {
    id: 'fall-armyworm',
    name: 'Fall Armyworm (Spodoptera frugiperda)',
    tamilName: 'படைப்புழு',
    type: 'pest',
    affectedCrops: ['Maize (Corn)', 'Sorghum', 'Sugarcane'],
    triggerConditions: { tempMinC: 25, tempMaxC: 38, humidityMinPct: 50, humidityMaxPct: 90, rainfallTriggerMm: 3, windSpeedMaxKmh: 40 },
    symptoms: 'Ragged holes in leaves with frass (excrement). Larvae feed inside whorl causing window-pane damage.',
    prevention: 'Install pheromone traps (5/acre). Spray Emamectin Benzoate 5% SG at 0.4g/L. Release Trichogramma egg parasitoids.',
    preventionTamil: 'ஃபெரோமோன் பொறிகள் நிறுவவும். எமாமெக்டின் பென்சோயேட் தெளிக்கவும்.',
    severity: 'high',
    seasonMonths: [3, 4, 5, 6, 7, 8, 9],
    iconEmoji: '🐛'
  },
  {
    id: 'cotton-bollworm',
    name: 'Cotton Bollworm (Helicoverpa armigera)',
    tamilName: 'பருத்தி காய்ப்புழு',
    type: 'pest',
    affectedCrops: ['Cotton', 'Chickpea', 'Tomato', 'Chili'],
    triggerConditions: { tempMinC: 25, tempMaxC: 35, humidityMinPct: 60, humidityMaxPct: 85, rainfallTriggerMm: 2, windSpeedMaxKmh: 25 },
    symptoms: 'Bore holes in bolls/fruits. Larvae feed inside causing premature fruit drop.',
    prevention: 'Use Bt cotton varieties. Apply Spinosad 45% SC at 0.3ml/L. Install HaNPV spray at 250 LE/ha.',
    preventionTamil: 'Bt பருத்தி ரகங்களை பயன்படுத்தவும். ஸ்பினோசாட் தெளிக்கவும்.',
    severity: 'high',
    seasonMonths: [6, 7, 8, 9, 10, 11],
    iconEmoji: '🌿'
  },
  {
    id: 'bacterial-leaf-blight',
    name: 'Bacterial Leaf Blight (Xanthomonas oryzae)',
    tamilName: 'நெல் இலை கருகல் நோய்',
    type: 'bacterial',
    affectedCrops: ['Rice (Paddy)'],
    triggerConditions: { tempMinC: 26, tempMaxC: 34, humidityMinPct: 70, humidityMaxPct: 100, rainfallTriggerMm: 10, windSpeedMaxKmh: 35 },
    symptoms: 'Yellow to white lesions along leaf margins. Leaves dry from tip downward.',
    prevention: 'Avoid excessive nitrogen. Use resistant varieties (ADT 39). Spray Streptomycin sulphate + Tetracycline at 300ppm.',
    preventionTamil: 'அதிக தழை உரம் தவிர்க்கவும். எதிர்ப்பு ரகங்களை பயன்படுத்தவும்.',
    severity: 'moderate',
    seasonMonths: [7, 8, 9, 10],
    iconEmoji: '🌾'
  },
  {
    id: 'coconut-rhinoceros-beetle',
    name: 'Coconut Rhinoceros Beetle (Oryctes rhinoceros)',
    tamilName: 'தென்னை காண்டாமிரு வண்டு',
    type: 'pest',
    affectedCrops: ['Coconut', 'Oil Palm'],
    triggerConditions: { tempMinC: 26, tempMaxC: 36, humidityMinPct: 60, humidityMaxPct: 95, rainfallTriggerMm: 8, windSpeedMaxKmh: 20 },
    symptoms: 'V-shaped cuts on fronds. Bore holes in crown. Reduced nut yield.',
    prevention: 'Fill leaf axils with Naphthalene balls + sand (3:1). Set up Rhinolure pheromone traps. Apply Metarhizium anisopliae to manure pits.',
    preventionTamil: 'இலை அச்சில் நாப்தலீன் உருண்டைகள் வைக்கவும். ஃபெரோமோன் பொறிகள் நிறுவவும்.',
    severity: 'moderate',
    seasonMonths: [3, 4, 5, 6, 7, 8],
    iconEmoji: '🥥'
  },
  {
    id: 'tomato-leaf-curl',
    name: 'Tomato Leaf Curl Virus (ToLCV)',
    tamilName: 'தக்காளி இலை சுருட்டு நோய்',
    type: 'viral',
    affectedCrops: ['Tomato', 'Chili', 'Brinjal'],
    triggerConditions: { tempMinC: 28, tempMaxC: 38, humidityMinPct: 40, humidityMaxPct: 75, rainfallTriggerMm: 0, windSpeedMaxKmh: 20 },
    symptoms: 'Upward curling and puckering of leaves. Stunted growth. Yellow mosaic patterns.',
    prevention: 'Use ToLCV-resistant varieties (Arka Rakshak). Control whitefly vector with yellow sticky traps (12/acre). Spray Imidacloprid 17.8% SL at 0.3ml/L.',
    preventionTamil: 'எதிர்ப்பு ரகங்களை பயன்படுத்தவும். மஞ்சள் ஒட்டு பொறிகள் நிறுவவும்.',
    severity: 'high',
    seasonMonths: [2, 3, 4, 5, 9, 10, 11],
    iconEmoji: '🍅'
  },
  {
    id: 'sugarcane-early-shoot-borer',
    name: 'Sugarcane Early Shoot Borer (Chilo infuscatellus)',
    tamilName: 'கரும்பு முளை துளைப்பான்',
    type: 'pest',
    affectedCrops: ['Sugarcane'],
    triggerConditions: { tempMinC: 28, tempMaxC: 36, humidityMinPct: 70, humidityMaxPct: 95, rainfallTriggerMm: 5, windSpeedMaxKmh: 25 },
    symptoms: 'Dead hearts in young shoots. Bore holes at base of shoots with frass.',
    prevention: 'Release Trichogramma chilonis (50,000/ha). Apply Carbofuran 3G in leaf whorl. Remove and destroy dead hearts.',
    preventionTamil: 'ட்ரைகோகிராம்மா விடுவிக்கவும். கார்போஃபுரான் இடவும்.',
    severity: 'moderate',
    seasonMonths: [1, 2, 3, 4, 5],
    iconEmoji: '🎋'
  },
  {
    id: 'groundnut-rust',
    name: 'Groundnut Rust (Puccinia arachidis)',
    tamilName: 'நிலக்கடலை துரு நோய்',
    type: 'fungal',
    affectedCrops: ['Groundnut (Peanut)'],
    triggerConditions: { tempMinC: 22, tempMaxC: 28, humidityMinPct: 80, humidityMaxPct: 100, rainfallTriggerMm: 5, windSpeedMaxKmh: 20 },
    symptoms: 'Orange-brown pustules on lower leaf surface. Premature defoliation and yield loss up to 50%.',
    prevention: 'Spray Mancozeb 75% WP at 2.5g/L or Chlorothalonil at 2g/L. Use resistant varieties (VRI 2, TMV 7).',
    preventionTamil: 'மான்கோசெப் தெளிக்கவும். எதிர்ப்பு ரகங்களை பயன்படுத்தவும்.',
    severity: 'moderate',
    seasonMonths: [6, 7, 8, 9, 10],
    iconEmoji: '🥜'
  },
  {
    id: 'mango-hopper',
    name: 'Mango Hopper (Idioscopus clypealis)',
    tamilName: 'மாம்பழ தத்துப்பூச்சி',
    type: 'pest',
    affectedCrops: ['Mango'],
    triggerConditions: { tempMinC: 20, tempMaxC: 33, humidityMinPct: 60, humidityMaxPct: 90, rainfallTriggerMm: 2, windSpeedMaxKmh: 15 },
    symptoms: 'Hoppers suck sap from inflorescence. Honeydew secretion causes sooty mold. Flower and fruit drop.',
    prevention: 'Spray Thiamethoxam 25% WG at 0.2g/L during flowering. Avoid dense canopy by pruning.',
    preventionTamil: 'பூக்கும் நேரத்தில் தியாமெத்தாக்சாம் தெளிக்கவும். கிளைகளை கத்தரிக்கவும்.',
    severity: 'moderate',
    seasonMonths: [0, 1, 2, 3],
    iconEmoji: '🥭'
  },
  {
    id: 'banana-sigatoka',
    name: 'Banana Sigatoka Leaf Spot (Mycosphaerella musicola)',
    tamilName: 'வாழை சிகடோகா இலைப்புள்ளி நோய்',
    type: 'fungal',
    affectedCrops: ['Banana'],
    triggerConditions: { tempMinC: 24, tempMaxC: 32, humidityMinPct: 85, humidityMaxPct: 100, rainfallTriggerMm: 10, windSpeedMaxKmh: 25 },
    symptoms: 'Yellow streaks on leaves turning brown/black. Leaf necrosis reduces fruit size.',
    prevention: 'Remove and destroy affected leaves. Spray Propiconazole 25% EC at 1ml/L. Ensure good drainage.',
    preventionTamil: 'பாதிக்கப்பட்ட இலைகளை அகற்றவும். புரோபிகோனசோல் தெளிக்கவும்.',
    severity: 'moderate',
    seasonMonths: [5, 6, 7, 8, 9, 10],
    iconEmoji: '🍌'
  },
  {
    id: 'chili-thrips',
    name: 'Chili Thrips (Scirtothrips dorsalis)',
    tamilName: 'மிளகாய் இலை சுருட்டு பூச்சி',
    type: 'pest',
    affectedCrops: ['Chili', 'Capsicum'],
    triggerConditions: { tempMinC: 28, tempMaxC: 38, humidityMinPct: 30, humidityMaxPct: 60, rainfallTriggerMm: 0, windSpeedMaxKmh: 15 },
    symptoms: 'Leaf curling upward. Silvery sheen on leaves. Stunted growth and reduced fruit set.',
    prevention: 'Blue sticky traps (8/acre). Spray Fipronil 5% SC at 1.5ml/L. Conserve predatory thrips.',
    preventionTamil: 'நீல ஒட்டு பொறிகள் நிறுவவும். ஃபிப்ரோநில் தெளிக்கவும்.',
    severity: 'high',
    seasonMonths: [1, 2, 3, 4, 5, 10, 11],
    iconEmoji: '🌶️'
  },
  {
    id: 'brown-plant-hopper',
    name: 'Brown Plant Hopper (Nilaparvata lugens)',
    tamilName: 'நெல் பழுப்பு தத்துப்பூச்சி',
    type: 'pest',
    affectedCrops: ['Rice (Paddy)'],
    triggerConditions: { tempMinC: 25, tempMaxC: 32, humidityMinPct: 80, humidityMaxPct: 100, rainfallTriggerMm: 5, windSpeedMaxKmh: 20 },
    symptoms: 'Hopper burn — circular patches of dried plants. Plants turn yellow-brown and wilt.',
    prevention: 'Avoid excess nitrogen. Drain fields periodically. Apply Pymetrozine 50% WG at 0.3g/L.',
    preventionTamil: 'அதிக தழை உர பயன்பாடு தவிர்க்கவும். வயலை வடிகட்டவும்.',
    severity: 'critical',
    seasonMonths: [7, 8, 9, 10, 11],
    iconEmoji: '🦗'
  },
];

/**
 * Calculate pest/disease risk score based on current weather conditions
 */
export function calculatePestRisk(
  pest: PestDiseaseEntry,
  tempC: number,
  humidityPct: number,
  rainfallMm: number,
  windSpeedKmh: number,
  currentMonth: number
): { riskScore: number; riskLevel: 'low' | 'moderate' | 'high' | 'critical'; factors: string[] } {
  const tc = pest.triggerConditions;
  let score = 0;
  const factors: string[] = [];

  // Season match (0-30 points)
  if (pest.seasonMonths.includes(currentMonth)) {
    score += 30;
    factors.push('Active season for this pest/disease');
  }

  // Temperature match (0-25 points)
  if (tempC >= tc.tempMinC && tempC <= tc.tempMaxC) {
    const midpoint = (tc.tempMinC + tc.tempMaxC) / 2;
    const closeness = 1 - Math.abs(tempC - midpoint) / ((tc.tempMaxC - tc.tempMinC) / 2);
    score += Math.round(25 * closeness);
    factors.push(`Temperature ${tempC.toFixed(1)}°C is in optimal range (${tc.tempMinC}-${tc.tempMaxC}°C)`);
  }

  // Humidity match (0-25 points)
  if (humidityPct >= tc.humidityMinPct && humidityPct <= tc.humidityMaxPct) {
    const midpoint = (tc.humidityMinPct + tc.humidityMaxPct) / 2;
    const closeness = 1 - Math.abs(humidityPct - midpoint) / ((tc.humidityMaxPct - tc.humidityMinPct) / 2);
    score += Math.round(25 * closeness);
    factors.push(`Humidity ${humidityPct}% favors outbreak (${tc.humidityMinPct}-${tc.humidityMaxPct}%)`);
  }

  // Rainfall match (0-10 points)
  if (rainfallMm >= tc.rainfallTriggerMm) {
    score += 10;
    factors.push(`Recent rainfall ${rainfallMm.toFixed(1)}mm exceeds trigger (${tc.rainfallTriggerMm}mm)`);
  }

  // Wind match (0-10 points — lower wind generally favors pests)
  if (windSpeedKmh <= tc.windSpeedMaxKmh) {
    score += 10;
    factors.push(`Wind ${windSpeedKmh.toFixed(0)} km/h within favorable range`);
  }

  let riskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  if (score >= 75) riskLevel = 'critical';
  else if (score >= 55) riskLevel = 'high';
  else if (score >= 35) riskLevel = 'moderate';

  return { riskScore: Math.min(100, score), riskLevel, factors };
}
