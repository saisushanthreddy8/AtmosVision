import { MonthlyCropSchedule, MonthlyCropItem } from '../types';
import { CITIES_TAMIL_NADU } from './cities';

export interface CropSuggestion {
  name: string;
  tamilName: string;
  category: 'Food Grain' | 'Commercial / Cash Crop' | 'Plantation & Hill' | 'Horticulture & Fruits' | 'Spices' | 'Pulses & Oilseeds' | 'Vegetables';
  season: string;
  waterNeed: 'Low' | 'Moderate' | 'High' | 'Very High';
  idealTempRangeC: [number, number];
  idealHumidityRange: [number, number];
  soilSuitability: string;
  agronomicTip: string;
  yieldDurationDays: string;
}

export interface DistrictAgroProfile {
  district: string;
  agroZone: string;
  soilType: string;
  soilSubtypes: string[];
  soilPh: string;
  soilTexture: string;
  waterRetention: 'Low' | 'Moderate' | 'High' | 'Very High';
  organicCarbon: 'Low (<0.5%)' | 'Medium (0.5-0.75%)' | 'High (>0.75%)';
  majorNutrientDeficiencies: string[];
  irrigationProfile: string;
  crops: CropSuggestion[];
  currentSeasonAdvisory: string;
}

export const DISTRICT_AGRO_PROFILES: Record<string, DistrictAgroProfile> = {
  'Nilgiris': {
    district: 'Nilgiris',
    agroZone: 'High Altitude & Hill Zone (Western Ghats)',
    soilType: 'Highland Laterite & Humus-Rich Acidic Mountain Loam',
    soilSubtypes: ['Lateritic Soil', 'Red Sandy Hill Loam', 'Forest Humus Soil'],
    soilPh: '4.5 - 5.8 (Strongly Acidic)',
    soilTexture: 'Deep, Friable, Well-drained Loam with high organic matter',
    waterRetention: 'Moderate',
    organicCarbon: 'High (>0.75%)',
    majorNutrientDeficiencies: ['Phosphorus (fixation in acid soil)', 'Calcium', 'Magnesium'],
    irrigationProfile: 'High rainfall runoff & perennial mountain streams (Sprinkler / Natural mist)',
    currentSeasonAdvisory: 'Ideal temperature window for temperate horticulture. Apply rock phosphate and dolomite lime to correct subsoil acidity.',
    crops: [
      {
        name: 'Nilgiri Tea (Camellia sinensis)',
        tamilName: 'தேயிலை',
        category: 'Plantation & Hill',
        season: 'Year-Round (Best flush in Sep-Jan)',
        waterNeed: 'High',
        idealTempRangeC: [12, 22],
        idealHumidityRange: [70, 95],
        soilSuitability: 'Thrives in well-drained acidic forest loam (pH 4.8-5.5) with rich humus.',
        agronomicTip: 'Maintain contour planting across tea slopes to prevent monsoon topsoil erosion.',
        yieldDurationDays: 'Perennial (Plucking every 7-10 days)'
      },
      {
        name: 'Hill Potato (Solanum tuberosum)',
        tamilName: 'உருளைக்கிழங்கு',
        category: 'Vegetables',
        season: 'Autumn / Winter crop (Aug - Jan)',
        waterNeed: 'Moderate',
        idealTempRangeC: [14, 20],
        idealHumidityRange: [60, 85],
        soilSuitability: 'Loose, well-aerated laterite loam facilitates rapid tuber enlargement without rotting.',
        agronomicTip: 'Watch for Late Blight when atmospheric humidity exceeds 85%. Use certified Kufri Jyoti seeds.',
        yieldDurationDays: '90 - 110 days'
      },
      {
        name: 'Ooty Exotic Carrot (Daucus carota)',
        tamilName: 'கேரட்',
        category: 'Vegetables',
        season: 'Main crop (Aug - Dec) & Summer (Feb - May)',
        waterNeed: 'Moderate',
        idealTempRangeC: [12, 19],
        idealHumidityRange: [55, 80],
        soilSuitability: 'Deep, stone-free sandy hill loam produces uniform, sweet, deep-orange roots.',
        agronomicTip: 'Raised bed farming with drip fertigation prevents root branching and splitting.',
        yieldDurationDays: '85 - 100 days'
      },
      {
        name: 'Hill Garlic & Cabbage',
        tamilName: 'பூண்டு / முட்டைக்கோஸ்',
        category: 'Spices',
        season: 'Winter planting (Oct - Feb)',
        waterNeed: 'Moderate',
        idealTempRangeC: [11, 18],
        idealHumidityRange: [50, 75],
        soilSuitability: 'Acidic mountain soil with high sulfur and organic carbon enhances pungent essential oil content.',
        agronomicTip: 'Apply bio-fertilizers (Azospirillum & Phosphobacteria) to boost bulb diameter.',
        yieldDurationDays: '120 - 140 days'
      }
    ]
  },

  'Thanjavur': {
    district: 'Thanjavur',
    agroZone: 'Cauvery Delta Zone (Rice Bowl of Tamil Nadu)',
    soilType: 'Deep Deltaic Alluvial Clay & River Silt (Cauvery Basin)',
    soilSubtypes: ['Old Deltaic Alluvium', 'Fine Montmorillonitic Clay', 'Coastal Deltaic Silt'],
    soilPh: '6.8 - 7.8 (Neutral to Slightly Alkaline)',
    soilTexture: 'Deep Heavy Clay to Silty Clay Loam with excellent fertility',
    waterRetention: 'Very High',
    organicCarbon: 'Medium (0.5-0.75%)',
    majorNutrientDeficiencies: ['Zinc', 'Nitrogen', 'Sulfur'],
    irrigationProfile: 'Grand Anicut & Cauvery Canal Network with supplemental filter-point tube wells',
    currentSeasonAdvisory: 'Maintain 2-3 cm standing water during panicle initiation. Apply Zinc Sulfate (25 kg/ha) basal to avoid Khaira disease.',
    crops: [
      {
        name: 'Samba / Thaladi Paddy (Oryza sativa)',
        tamilName: 'சாம்பா நெல் (CR 1009 / BPT 5204)',
        category: 'Food Grain',
        season: 'Samba / Thaladi (Aug - Jan)',
        waterNeed: 'Very High',
        idealTempRangeC: [22, 33],
        idealHumidityRange: [65, 90],
        soilSuitability: 'Heavy deltaic clay prevents percolation losses and sustains deep standing water puddling.',
        agronomicTip: 'System of Rice Intensification (SRI) with cono-weeding saves 30% water and boosts tillers.',
        yieldDurationDays: '135 - 150 days'
      },
      {
        name: 'Rice Fallow Blackgram / Urad (Vigna mungo)',
        tamilName: 'உளுந்து (VBN 8 / ADT 5)',
        category: 'Pulses & Oilseeds',
        season: 'Rice Fallow (Jan - Apr)',
        waterNeed: 'Low',
        idealTempRangeC: [25, 35],
        idealHumidityRange: [45, 70],
        soilSuitability: 'Grows purely on residual clay moisture immediately following paddy harvest without tillage.',
        agronomicTip: 'Broadcast seeds 4-6 days before paddy harvest when moisture in the soil forms a ball in hand.',
        yieldDurationDays: '65 - 75 days'
      },
      {
        name: 'Poovan & Grand Naine Banana',
        tamilName: 'வாழை (பூவன் / ஜி9)',
        category: 'Horticulture & Fruits',
        season: 'Planting (Feb - May / Oct - Dec)',
        waterNeed: 'High',
        idealTempRangeC: [24, 34],
        idealHumidityRange: [60, 85],
        soilSuitability: 'Rich alluvial delta silt supports heavy nutrient uptake and deep pseudostem anchorage.',
        agronomicTip: 'Provide de-suckering and prop with bamboo poles during coastal monsoon winds.',
        yieldDurationDays: '11 - 12 months'
      },
      {
        name: 'Chewing Sugarcane (CoC 24)',
        tamilName: 'கரும்பு',
        category: 'Commercial / Cash Crop',
        season: 'Special season (Dec - Apr)',
        waterNeed: 'High',
        idealTempRangeC: [24, 36],
        idealHumidityRange: [55, 80],
        soilSuitability: 'Deep clayey silt holds high water-table nutrients, maximizing cane tonnage and sucrose brix.',
        agronomicTip: 'Trash mulching (10 cm) retains soil moisture and minimizes weed growth.',
        yieldDurationDays: '10 - 12 months'
      }
    ]
  },

  'Coimbatore': {
    district: 'Coimbatore',
    agroZone: 'Western Agro-Climatic Zone',
    soilType: 'Deep Black Cotton Soil (Vertisol) & Red Gravelly Loam',
    soilSubtypes: ['Deep Black Clay (Vertisols)', 'Red Calcareous Sandy Loam', 'Gravelly Hill Foothill Soil'],
    soilPh: '7.5 - 8.4 (Moderately Alkaline)',
    soilTexture: 'Heavy Swelling-Shrinking Clay in plains, Gravelly Loam in foothills',
    waterRetention: 'High',
    organicCarbon: 'Medium (0.5-0.75%)',
    majorNutrientDeficiencies: ['Iron (lime-induced chlorosis)', 'Zinc', 'Boron'],
    irrigationProfile: 'Parambikulam-Aliyar Project (PAP), Bhavani basin & deep borewell drip networks',
    currentSeasonAdvisory: 'Utilize automated drip fertigation to conserve water in black soils. Watch for sucking pests under warm daytime conditions.',
    crops: [
      {
        name: 'Bt Cotton (Gossypium hirsutum)',
        tamilName: 'பருத்தி',
        category: 'Commercial / Cash Crop',
        season: 'Kharif / Winter (Aug - Feb)',
        waterNeed: 'Moderate',
        idealTempRangeC: [21, 34],
        idealHumidityRange: [50, 75],
        soilSuitability: 'Deep black cotton vertisols crack during drying, providing excellent root aeration for deep tap roots.',
        agronomicTip: 'Foliar spray of 1% DAP + 1% Potassium chloride at flowering prevents boll shedding.',
        yieldDurationDays: '150 - 165 days'
      },
      {
        name: 'Hybrid Maize / Corn (CO 6 / Pioneer)',
        tamilName: 'மக்காச்சோளம்',
        category: 'Food Grain',
        season: 'Adipattam (Jul - Oct) & Thaipattam (Jan - Apr)',
        waterNeed: 'Moderate',
        idealTempRangeC: [20, 32],
        idealHumidityRange: [45, 70],
        soilSuitability: 'Deep, well-drained loam to clay loam ensures vigorous cob filling.',
        agronomicTip: 'Install pheromone traps to monitor and control Fall Armyworm (Spodoptera frugiperda).',
        yieldDurationDays: '100 - 115 days'
      },
      {
        name: 'Pollachi Tall Coconut',
        tamilName: 'தென்னை (பொள்ளாச்சி மட்டை)',
        category: 'Plantation & Hill',
        season: 'Year-Round plantation',
        waterNeed: 'Moderate',
        idealTempRangeC: [22, 33],
        idealHumidityRange: [60, 85],
        soilSuitability: 'Red gravelly loam with high groundwater percolation in Anamalai rain shadow.',
        agronomicTip: 'Apply TNAU Coconut Tonic (200 ml/tree) to boost nut set and copra weight.',
        yieldDurationDays: 'Perennial'
      },
      {
        name: 'Erode Turmeric / Haldi',
        tamilName: 'மஞ்சள்',
        category: 'Spices',
        season: 'Vaikasi Pattam (May - Jan)',
        waterNeed: 'Moderate',
        idealTempRangeC: [22, 32],
        idealHumidityRange: [60, 80],
        soilSuitability: 'Friable sandy clay loam allows healthy rhizome multiplication without waterlogging rot.',
        agronomicTip: 'Ridge and furrow planting combined with micro-drip fertigation maximizes curcumin content.',
        yieldDurationDays: '240 - 270 days'
      }
    ]
  },

  'Madurai': {
    district: 'Madurai',
    agroZone: 'Southern Agro-Climatic Zone (Vaigai Basin)',
    soilType: 'Red Sandy Loam, Clay Loam & Calcareous Black Soil',
    soilSubtypes: ['Red Sandy Loam', 'Vaigai Basin Alluvial Clay', 'Calcareous Black Cotton Soil'],
    soilPh: '7.2 - 8.2 (Neutral to Slightly Alkaline)',
    soilTexture: 'Medium-textured Loamy Sand to Clay Loam',
    waterRetention: 'Moderate',
    organicCarbon: 'Low (<0.5%)',
    majorNutrientDeficiencies: ['Nitrogen', 'Zinc', 'Iron'],
    irrigationProfile: 'Periyar-Vaigai Canal system, tank irrigation & deep borewells',
    currentSeasonAdvisory: 'High daytime insolation favors jasmine flower blooming. Apply farmyard manure (FYM) to enhance sandy loam moisture holding capacity.',
    crops: [
      {
        name: 'Madurai Malli / Jasmine (Jasminum sambac)',
        tamilName: 'மதுரை மல்லி (GI Tagged)',
        category: 'Horticulture & Fruits',
        season: 'Peak Flowering (Mar - Oct)',
        waterNeed: 'Moderate',
        idealTempRangeC: [24, 36],
        idealHumidityRange: [45, 75],
        soilSuitability: 'Well-drained red sandy loam rich in clay minerals gives the distinctive thick petals and intense aroma.',
        agronomicTip: 'Prune bushes to 45 cm height in late November; apply vermicompost for maximum bud yield.',
        yieldDurationDays: 'Perennial (Daily morning harvest)'
      },
      {
        name: 'Barnyard Millet / Kuthiraivali',
        tamilName: 'குதிரைவாலி (CO 2)',
        category: 'Food Grain',
        season: 'Kharif / Rainfed (Sep - Dec)',
        waterNeed: 'Low',
        idealTempRangeC: [24, 35],
        idealHumidityRange: [35, 65],
        soilSuitability: 'Exceptionally drought-hardy in shallow red soils with low natural fertility.',
        agronomicTip: 'Requires minimal water; ideal climate-resilient crop during deficit rainfall years.',
        yieldDurationDays: '75 - 85 days'
      },
      {
        name: 'Gingelly / Sesame (Sesamum indicum)',
        tamilName: 'எள் (TMV 7)',
        category: 'Pulses & Oilseeds',
        season: 'Summer (Feb - May) & Kharif (Jul - Oct)',
        waterNeed: 'Low',
        idealTempRangeC: [25, 36],
        idealHumidityRange: [40, 65],
        soilSuitability: 'Light sandy loam prevents waterlogging and fosters high seed oil concentration.',
        agronomicTip: 'Thin seedlings to 15 cm spacing at 15-20 days after sowing to avoid stunted branching.',
        yieldDurationDays: '80 - 90 days'
      },
      {
        name: 'Samba Paddy (Vaigai Irrigated)',
        tamilName: 'நெல் (ADT 45 / TKM 13)',
        category: 'Food Grain',
        season: 'Pishanam (Oct - Feb)',
        waterNeed: 'High',
        idealTempRangeC: [22, 33],
        idealHumidityRange: [60, 85],
        soilSuitability: 'Vaigai riverine clay alluvium supports good root establishment.',
        agronomicTip: 'Incorporate green manure (Daincha / Sunnhemp) before puddling to enrich soil nitrogen.',
        yieldDurationDays: '120 - 130 days'
      }
    ]
  },

  'Chennai': {
    district: 'Chennai',
    agroZone: 'North-Eastern Coastal Zone',
    soilType: 'Coastal Sandy Marine Alluvium & Heavy Clayey Coastal Sand',
    soilSubtypes: ['Marine Sand', 'Coastal Alluvial Loam', 'Estuarine Saline Silt'],
    soilPh: '7.4 - 8.5 (Slightly Alkaline)',
    soilTexture: 'Coarse Sand to Loamy Sand with rapid drainage',
    waterRetention: 'Low',
    organicCarbon: 'Low (<0.5%)',
    majorNutrientDeficiencies: ['Potassium', 'Nitrogen', 'Organic Matter'],
    irrigationProfile: 'Borewells, municipal treated runoff & drip hydroponics / urban terrace farming',
    currentSeasonAdvisory: 'Focus on high-value peri-urban rooftop greens, microgreens, and potted vegetables with shade-net protection.',
    crops: [
      {
        name: 'Peri-Urban Leafy Greens / Keerai',
        tamilName: 'கீரை வகைகள் (அரைக்கீரை, சிறுகீரை)',
        category: 'Vegetables',
        season: 'Year-Round (Best Oct - Mar)',
        waterNeed: 'Moderate',
        idealTempRangeC: [22, 32],
        idealHumidityRange: [60, 85],
        soilSuitability: 'Cocopeat + Vermicompost enriched sandy loam in urban grow bags.',
        agronomicTip: 'Harvest early morning; apply Panchagavya spray weekly for vigorous leaf expansion.',
        yieldDurationDays: '25 - 35 days'
      },
      {
        name: 'Coastal Watermelon & Musk Melon',
        tamilName: 'தர்பூசணி',
        category: 'Horticulture & Fruits',
        season: 'Summer (Dec - Apr)',
        waterNeed: 'Low',
        idealTempRangeC: [26, 36],
        idealHumidityRange: [50, 75],
        soilSuitability: 'Deep marine sand along the ECR corridor allows deep root warmth and high fruit brix.',
        agronomicTip: 'Mulch with silver-black plastic sheet to preserve subsoil moisture and prevent fruit rot.',
        yieldDurationDays: '75 - 90 days'
      }
    ]
  },

  'Salem': {
    district: 'Salem',
    agroZone: 'North-Western Agro-Climatic Zone',
    soilType: 'Red Inceptisols, Gravelly Loam & Deep Clayey Loam',
    soilSubtypes: ['Red Sandy Loam', 'Magnesite-rich Loam', 'Black Vertic Soil'],
    soilPh: '6.8 - 7.9 (Neutral to Alkaline)',
    soilTexture: 'Friable Sandy Clay Loam with good drainage',
    waterRetention: 'Moderate',
    organicCarbon: 'Medium (0.5-0.75%)',
    majorNutrientDeficiencies: ['Zinc', 'Boron', 'Nitrogen'],
    irrigationProfile: 'Mettur Stanley Reservoir canal system, wells & tank irrigation',
    currentSeasonAdvisory: 'Dry ambient winds favor tapioca starch accumulation. Ensure scheduled potassium fertilization.',
    crops: [
      {
        name: 'Salem Malgoa & Alphonso Mango',
        tamilName: 'மாம்பழம் (மல்கோவா / சேலம் குண்டு)',
        category: 'Horticulture & Fruits',
        season: 'Flowering (Dec-Feb), Harvest (Apr-Jun)',
        waterNeed: 'Low',
        idealTempRangeC: [24, 38],
        idealHumidityRange: [40, 70],
        soilSuitability: 'Deep, well-drained red loam with gravelly subsoil prevents root waterlogging.',
        agronomicTip: 'Withhold irrigation during flowering to induce maximum hermaphrodite flower ratio.',
        yieldDurationDays: 'Perennial'
      },
      {
        name: 'Tapioca / Cassava (Manihot esculenta)',
        tamilName: 'மரவள்ளிக்கிழங்கு (Sago Capital)',
        category: 'Commercial / Cash Crop',
        season: 'Main season (Oct - Feb)',
        waterNeed: 'Low',
        idealTempRangeC: [22, 35],
        idealHumidityRange: [50, 75],
        soilSuitability: 'Light red sandy loam allows uninhibited tuber elongation and high starch content.',
        agronomicTip: 'Apply 100 kg Potassium per hectare in two splits to boost starch content for Sago mills.',
        yieldDurationDays: '270 - 300 days'
      },
      {
        name: 'Sericulture & Mulberry (Morus alba)',
        tamilName: 'பட்டுப்புழு மல்பெரி',
        category: 'Commercial / Cash Crop',
        season: 'Year-Round plantation',
        waterNeed: 'Moderate',
        idealTempRangeC: [20, 32],
        idealHumidityRange: [55, 80],
        soilSuitability: 'Rich, fertile red loam supports succulent, protein-rich leaves for silkworm feeding.',
        agronomicTip: 'Prune every 60 days in conjunction with silkworm rearing batches (V1 variety).',
        yieldDurationDays: 'Perennial (Leaves every 50 days)'
      }
    ]
  },

  'Ramanathapuram': {
    district: 'Ramanathapuram',
    agroZone: 'Southern Coastal Rain Shadow Zone',
    soilType: 'Coastal Saline Alluvium, Sandy Marine Soils & Heavy Black Clay',
    soilSubtypes: ['Saline Coastal Alluvium', 'Marine Sand', 'Deep Cracking Black Clay'],
    soilPh: '7.8 - 8.8 (Moderately Saline / Alkaline)',
    soilTexture: 'Coarse Sand along coastline, Heavy Compact Clay in inland tanks',
    waterRetention: 'High in black clay / Very Low in coastal sands',
    organicCarbon: 'Low (<0.5%)',
    majorNutrientDeficiencies: ['Nitrogen', 'Zinc', 'Phosphorus', 'Iron'],
    irrigationProfile: 'Rainfed tanks (Eri), Gundar river runoff & deep saline tube wells',
    currentSeasonAdvisory: 'High solar radiation and saline breeze. Excellent climate for Ramanathapuram Mundu Chilli pungency development.',
    crops: [
      {
        name: 'Ramnad Mundu Chilli (Capsicum annuum)',
        tamilName: 'ராமநாதபுரம் குண்டு மிளகாய் (GI Tagged)',
        category: 'Spices',
        season: 'Kharif / Rainfed (Sep - Mar)',
        waterNeed: 'Low',
        idealTempRangeC: [24, 36],
        idealHumidityRange: [40, 65],
        soilSuitability: 'Saline-tolerant clay loam imparts thick skin, high capsaicin pungency, and intense red color.',
        agronomicTip: 'Apply Gypsum (500 kg/ha) to reclaim saline-sodic soils before nursery transplanting.',
        yieldDurationDays: '130 - 150 days'
      },
      {
        name: 'Rainfed Sesame / Gingelly',
        tamilName: 'எள் (SVPR 1)',
        category: 'Pulses & Oilseeds',
        season: 'Rabi (Oct - Jan)',
        waterNeed: 'Low',
        idealTempRangeC: [25, 35],
        idealHumidityRange: [45, 65],
        soilSuitability: 'Light sandy coastal soil prevents waterlogging and fosters early maturity.',
        agronomicTip: 'Seed treatment with Trichoderma viride prevents root rot in sandy coastal beds.',
        yieldDurationDays: '75 - 85 days'
      },
      {
        name: 'Palmyra Palm & Neera',
        tamilName: 'பனை மரம் (State Tree)',
        category: 'Plantation & Hill',
        season: 'Year-Round (Neera tapping Feb - Jun)',
        waterNeed: 'Low',
        idealTempRangeC: [25, 42],
        idealHumidityRange: [30, 80],
        soilSuitability: 'Thrives in harsh coastal saline sand and drought-prone saline tracts without any irrigation.',
        agronomicTip: 'Zero input natural cultivation; produces Karupatti (palm jaggery) and nungu.',
        yieldDurationDays: 'Perennial'
      }
    ]
  },

  'Kanyakumari': {
    district: 'Kanyakumari',
    agroZone: 'High Rainfall Southern Heavy Wet Zone',
    soilType: 'Deep Coastal Alluvium, Red Laterite & Mountain Valley Loam',
    soilSubtypes: ['Lateritic Red Loam', 'Coastal Marine Sand', 'Valley Alluvial Silt'],
    soilPh: '5.2 - 6.5 (Slightly Acidic)',
    soilTexture: 'Deep Red Loam to Silty Clay with high organic matter',
    waterRetention: 'High',
    organicCarbon: 'High (>0.75%)',
    majorNutrientDeficiencies: ['Potassium', 'Boron', 'Zinc'],
    irrigationProfile: 'Bihourly monsoon rains (SW & NE monsoons), Pechiparai, Perunchani dams & hill streams',
    currentSeasonAdvisory: 'High maritime moisture and abundant monsoon rainfall. Perfect conditions for rubber tapping and spice tree flowering.',
    crops: [
      {
        name: 'Natural Rubber (Hevea brasiliensis)',
        tamilName: 'ரப்பர்',
        category: 'Plantation & Hill',
        season: 'Tapping (Year-Round, peak Sep - Jan)',
        waterNeed: 'High',
        idealTempRangeC: [22, 32],
        idealHumidityRange: [75, 95],
        soilSuitability: 'Deep, acidic laterite soil (pH 5.0-6.0) with >150 cm depth allows deep taproot anchorage.',
        agronomicTip: 'Apply rain-guards to tapping cuts during heavy monsoon rains to avoid latex wash-off.',
        yieldDurationDays: 'Perennial'
      },
      {
        name: 'Matti & Red Banana (Sevvazhai)',
        tamilName: 'மட்டி வாழைப்பழம் (GI Tagged) / செவ்வாழை',
        category: 'Horticulture & Fruits',
        season: 'Year-Round (Planting Apr - Jun / Sep - Oct)',
        waterNeed: 'High',
        idealTempRangeC: [23, 33],
        idealHumidityRange: [70, 90],
        soilSuitability: 'Deep riverine alluvial loam in Thovalai / Agasteeswaram tracts gives unique fragrance and soft texture.',
        agronomicTip: 'Provide high potassium fertilization (MOP 300g/plant) at 5th and 7th month for bunch weight.',
        yieldDurationDays: '11 - 13 months'
      },
      {
        name: 'Cloves, Nutmeg & Black Pepper',
        tamilName: 'கிராம்பு, ஜாதிக்காய், மிளகு',
        category: 'Spices',
        season: 'Harvest (Dec - Mar)',
        waterNeed: 'High',
        idealTempRangeC: [20, 30],
        idealHumidityRange: [75, 95],
        soilSuitability: 'Organic-rich acidic red loams of Maramalai and Asambu hills.',
        agronomicTip: 'Grow black pepper as an intercrop climbing on silver oak or arecanut shade trees.',
        yieldDurationDays: 'Perennial'
      }
    ]
  },

  'Tirunelveli': {
    district: 'Tirunelveli',
    agroZone: 'Thamirabarani Basin & Southern Dry Plains',
    soilType: 'Thamirabarani Alluvial Silt, Red Sandy Loam & Black Soil',
    soilSubtypes: ['Riverine Alluvium', 'Deep Red Clay Loam', 'Black Cotton Soil'],
    soilPh: '6.8 - 8.0 (Neutral to Mildly Alkaline)',
    soilTexture: 'Rich river silt in river basin, deep gravelly red soil in uplands',
    waterRetention: 'High in river tracts / Moderate in plains',
    organicCarbon: 'Medium (0.5-0.75%)',
    majorNutrientDeficiencies: ['Zinc', 'Nitrogen', 'Sulfur'],
    irrigationProfile: 'Perennial Thamirabarani River canal network, Manimuthar & Servalar dams',
    currentSeasonAdvisory: 'Riverine alluvium provides abundant fertility for double-crop paddy (Kar and Pishanam).',
    crops: [
      {
        name: 'Thamirabarani Rice (ASD 16 / TPS 5)',
        tamilName: 'நெல் (அம்பை 16 / பிசானம்)',
        category: 'Food Grain',
        season: 'Kar (Jun - Sep) & Pishanam (Oct - Feb)',
        waterNeed: 'Very High',
        idealTempRangeC: [24, 34],
        idealHumidityRange: [60, 85],
        soilSuitability: 'Perennial Thamirabarani silt deposit provides high natural mineral nutrition.',
        agronomicTip: 'Adopt alternate wetting and drying (AWD) to save 25% irrigation water without yield penalty.',
        yieldDurationDays: '115 - 125 days'
      },
      {
        name: 'Nendran & Red Banana',
        tamilName: 'நேந்திரன் வாழை',
        category: 'Horticulture & Fruits',
        season: 'Planting (Aug - Oct)',
        waterNeed: 'High',
        idealTempRangeC: [23, 34],
        idealHumidityRange: [65, 85],
        soilSuitability: 'Deep, friable alluvial clay loam provides excellent bunch filling for banana chips processing.',
        agronomicTip: 'Earthing up at 3rd and 5th month prevents lodging during windy post-monsoon spells.',
        yieldDurationDays: '10 - 11 months'
      },
      {
        name: 'Blackgram / Urad (VBN 6)',
        tamilName: 'உளுந்து',
        category: 'Pulses & Oilseeds',
        season: 'Rabi (Nov - Feb)',
        waterNeed: 'Low',
        idealTempRangeC: [23, 33],
        idealHumidityRange: [50, 75],
        soilSuitability: 'Grows on residual Thamirabarani moisture following paddy harvest.',
        agronomicTip: 'Foliar spray of 2% DAP at 30 and 45 days after sowing enhances pod set by 20%.',
        yieldDurationDays: '65 - 75 days'
      }
    ]
  },

  'Dharmapuri': {
    district: 'Dharmapuri',
    agroZone: 'North-Western Agro-Climatic Zone',
    soilType: 'Red Sandy Loam, Red Gravelly Clay & Calcareous Soils',
    soilSubtypes: ['Red Sandy Loam (Inceptisols)', 'Gravelly Hill Foothill Soil', 'Black Clay Pockets'],
    soilPh: '6.5 - 7.6 (Neutral)',
    soilTexture: 'Coarse to Medium textured Loam with high drainage',
    waterRetention: 'Moderate',
    organicCarbon: 'Medium (0.5-0.75%)',
    majorNutrientDeficiencies: ['Nitrogen', 'Zinc', 'Boron'],
    irrigationProfile: 'Pennagaram river basin, Hogenakkal tracts, borewells & micro-drip networks',
    currentSeasonAdvisory: 'High daytime temperatures and red loam make this ideal for Finger Millet (Ragi) and Totapuri Mangoes.',
    crops: [
      {
        name: 'Finger Millet / Ragi (Eleusine coracana)',
        tamilName: 'கேழ்வரகு / ராகி (GPU 28 / CO 15)',
        category: 'Food Grain',
        season: 'Kharif (Jul - Oct) & Rabi (Nov - Feb)',
        waterNeed: 'Low',
        idealTempRangeC: [22, 33],
        idealHumidityRange: [45, 70],
        soilSuitability: 'Thrives in well-drained red sandy loam with minimal water requirement.',
        agronomicTip: 'Transplanting 20-day-old seedlings gives 25% higher grain yield than direct broadcasting.',
        yieldDurationDays: '105 - 115 days'
      },
      {
        name: 'Commercial Processing Mango (Totapuri / Neelam)',
        tamilName: 'தோத்தாபுரி மாம்பழம் (Pulp Capital)',
        category: 'Horticulture & Fruits',
        season: 'Harvest (May - Jul)',
        waterNeed: 'Low',
        idealTempRangeC: [24, 38],
        idealHumidityRange: [40, 65],
        soilSuitability: 'Deep gravelly red soils provide ideal thermal conditions for pulp processing orchards.',
        agronomicTip: 'Drip fertigation with water-soluble fertilizers improves fruit size and pulp recovery.',
        yieldDurationDays: 'Perennial'
      },
      {
        name: 'Tomato & Hybrid Capsicum',
        tamilName: 'தக்காளி / குடைமிளகாய்',
        category: 'Vegetables',
        season: 'Year-Round (Best Oct - Mar)',
        waterNeed: 'Moderate',
        idealTempRangeC: [18, 30],
        idealHumidityRange: [50, 75],
        soilSuitability: 'Well-drained red loam with pH 6.8 prevents bacterial wilt and blossom end rot.',
        agronomicTip: 'Stake plants with bamboo supports and tie with jute thread to prevent fruit soil contact.',
        yieldDurationDays: '110 - 130 days'
      }
    ]
  },

  'Erode': {
    district: 'Erode',
    agroZone: 'Western Agro-Climatic Zone (Bhavani-Cauvery Basin)',
    soilType: 'Red Gravelly Loam, Black Cotton Vertisols & River Alluvium',
    soilSubtypes: ['Red Gravelly Loam', 'Bhavani Alluvial Clay', 'Deep Black Vertisols'],
    soilPh: '7.2 - 8.2 (Neutral to Slightly Alkaline)',
    soilTexture: 'Deep Loamy Sand to Rich River Clay',
    waterRetention: 'High',
    organicCarbon: 'Medium (0.5-0.75%)',
    majorNutrientDeficiencies: ['Zinc', 'Iron', 'Boron'],
    irrigationProfile: 'Bhavani Sagar Dam canal, Lower Bhavani Project (LBP) & Kalingarayan Canal',
    currentSeasonAdvisory: 'Turmeric city of India. Maintain well-drained raised beds to ensure high curcumin rhizome development.',
    crops: [
      {
        name: 'Erode Turmeric (Curcuma longa)',
        tamilName: 'ஈரோடு மஞ்சள் (GI Tagged - விரலி)',
        category: 'Spices',
        season: 'Planting (May - Jul), Harvest (Jan - Mar)',
        waterNeed: 'Moderate',
        idealTempRangeC: [22, 33],
        idealHumidityRange: [60, 85],
        soilSuitability: 'Deep, friable loamy soil allows unhindered finger rhizome growth with >3.5% curcumin.',
        agronomicTip: 'Intercrop with onion or coriander in early vegetative phase for supplementary income.',
        yieldDurationDays: '260 - 280 days'
      },
      {
        name: 'Sugarcane (Co 86032)',
        tamilName: 'கரும்பு',
        category: 'Commercial / Cash Crop',
        season: 'Special / Main planting (Dec - Apr)',
        waterNeed: 'High',
        idealTempRangeC: [23, 35],
        idealHumidityRange: [55, 80],
        soilSuitability: 'Bhavani river alluvium provides abundant soil moisture for heavy millable cane tonnage.',
        agronomicTip: 'Subsurface drip irrigation with fertigation increases cane yield by 35 tonnes/ha.',
        yieldDurationDays: '11 - 12 months'
      },
      {
        name: 'Commercial Tapioca & Maize',
        tamilName: 'மரவள்ளி / மக்காச்சோளம்',
        category: 'Food Grain',
        season: 'Adipattam (Jul - Oct)',
        waterNeed: 'Moderate',
        idealTempRangeC: [22, 34],
        idealHumidityRange: [50, 70],
        soilSuitability: 'Red sandy loam ensures fast root establishment and high grain weight.',
        agronomicTip: 'Apply split nitrogen at 25 and 45 days after sowing to avoid nitrogen leaching.',
        yieldDurationDays: '105 - 120 days'
      }
    ]
  }
};

// Fallback generator for remaining districts with accurate agro-climatic parameters
export function getDistrictAgroProfile(districtName: string): DistrictAgroProfile {
  const key = Object.keys(DISTRICT_AGRO_PROFILES).find(
    (k) => k.toLowerCase() === districtName.toLowerCase() || districtName.toLowerCase().includes(k.toLowerCase())
  );

  if (key && DISTRICT_AGRO_PROFILES[key]) {
    return DISTRICT_AGRO_PROFILES[key];
  }

  // Generalized realistic agro profile based on geographic regions
  const dLower = districtName.toLowerCase();
  
  if (dLower.includes('tiruvarur') || dLower.includes('nagapattinam') || dLower.includes('mayiladuthurai') || dLower.includes('pudukkottai') || dLower.includes('ariyalur') || dLower.includes('perambalur') || dLower.includes('cuddalore')) {
    return {
      district: districtName,
      agroZone: 'Cauvery Delta & Coastal Agricultural Zone',
      soilType: 'Deep Deltaic Alluvial Clay & Fertile River Silt',
      soilSubtypes: ['Deltaic River Alluvium', 'Marine Clayey Silt', 'Red Loamy Sand'],
      soilPh: '6.8 - 7.8 (Neutral)',
      soilTexture: 'Heavy Clay to Silty Clay Loam with high moisture retention',
      waterRetention: 'High',
      organicCarbon: 'Medium (0.5-0.75%)',
      majorNutrientDeficiencies: ['Zinc', 'Nitrogen', 'Sulfur'],
      irrigationProfile: 'Canal network, river distributaries & filter point borewells',
      currentSeasonAdvisory: 'Maintain steady puddling for paddy; broadcast blackgram in rice fallow to enrich soil nitrogen.',
      crops: [
        {
          name: 'Samba / Kuruvai Paddy (Oryza sativa)',
          tamilName: 'நெல் (ADT 53 / CR 1009)',
          category: 'Food Grain',
          season: 'Kuruvai (Jun-Sep) / Samba (Aug-Jan)',
          waterNeed: 'Very High',
          idealTempRangeC: [23, 34],
          idealHumidityRange: [65, 90],
          soilSuitability: 'Heavy alluvium holds standing water with zero percolation loss.',
          agronomicTip: 'Apply Zinc Sulfate (25 kg/ha) basal to avoid Khaira disease.',
          yieldDurationDays: '120 - 140 days'
        },
        {
          name: 'Rice Fallow Blackgram (Urad)',
          tamilName: 'உளுந்து',
          category: 'Pulses & Oilseeds',
          season: 'Post-Paddy (Jan - Apr)',
          waterNeed: 'Low',
          idealTempRangeC: [25, 35],
          idealHumidityRange: [45, 70],
          soilSuitability: 'Flourishes on residual soil moisture without ploughing.',
          agronomicTip: 'Broadcast 4 days before paddy harvest.',
          yieldDurationDays: '65 - 75 days'
        },
        {
          name: 'High-Yielding Sugarcane',
          tamilName: 'கரும்பு',
          category: 'Commercial / Cash Crop',
          season: 'Dec - Apr planting',
          waterNeed: 'High',
          idealTempRangeC: [24, 36],
          idealHumidityRange: [55, 80],
          soilSuitability: 'Rich silt maximizes cane diameter and sugar recovery.',
          agronomicTip: 'Trash mulching retains moisture and suppresses weeds.',
          yieldDurationDays: '10 - 12 months'
        }
      ]
    };
  }

  if (dLower.includes('thoothukudi') || dLower.includes('virudhunagar') || dLower.includes('sivaganga') || dLower.includes('tenkasi')) {
    return {
      district: districtName,
      agroZone: 'Southern Dry Plains & Cotton-Pulses Zone',
      soilType: 'Deep Black Cotton Soil (Vertisol) & Red Sandy Loam',
      soilSubtypes: ['Black Cotton Clay', 'Gravelly Red Loam', 'Coastal Saline Sand'],
      soilPh: '7.5 - 8.4 (Alkaline)',
      soilTexture: 'Deep Clayey Vertisol with cracking characteristics',
      waterRetention: 'High in black clay / Moderate in red loam',
      organicCarbon: 'Low (<0.5%)',
      majorNutrientDeficiencies: ['Nitrogen', 'Zinc', 'Phosphorus'],
      irrigationProfile: 'Rainfed tanks, open wells & drip irrigation',
      currentSeasonAdvisory: 'High daytime temperatures and moderate humidity favor cotton boll opening and dryland millet harvesting.',
      crops: [
        {
          name: 'Bt Cotton / Kapas',
          tamilName: 'பருத்தி',
          category: 'Commercial / Cash Crop',
          season: 'Winter / Kharif (Aug - Feb)',
          waterNeed: 'Moderate',
          idealTempRangeC: [22, 35],
          idealHumidityRange: [45, 70],
          soilSuitability: 'Deep black soils provide deep root penetration and moisture reserves.',
          agronomicTip: 'Foliar spray of 1% DAP prevents boll drop.',
          yieldDurationDays: '150 - 165 days'
        },
        {
          name: 'Guntur / Mundu Dry Chilli',
          tamilName: 'மிளகாய்',
          category: 'Spices',
          season: 'Sep - Mar',
          waterNeed: 'Low',
          idealTempRangeC: [24, 36],
          idealHumidityRange: [40, 65],
          soilSuitability: 'Saline-resistant red loam enhances capsaicin content and color.',
          agronomicTip: 'Drip fertigation prevents blossom end rot.',
          yieldDurationDays: '120 - 140 days'
        },
        {
          name: 'Proso / Barnyard Millet (Kuthiraivali)',
          tamilName: 'குதிரைவாலி',
          category: 'Food Grain',
          season: 'Rainfed (Sep - Dec)',
          waterNeed: 'Low',
          idealTempRangeC: [24, 36],
          idealHumidityRange: [35, 65],
          soilSuitability: 'Exceptionally drought-resilient in dry black soils.',
          agronomicTip: 'Ideal climate-resilient crop during deficit rainfall years.',
          yieldDurationDays: '75 - 85 days'
        }
      ]
    };
  }

  // Default North-Western / Interior Zone (Krishnagiri, Tirupattur, Vellore, Ranipet, Tiruvannamalai, Villupuram, Kallakurichi, Kanchipuram, Chengalpattu, Tiruvallur)
  return {
    district: districtName,
    agroZone: 'North-Eastern / North-Western Plains Zone',
    soilType: 'Red Sandy Loam, Clay Loam & Lateritic Gravel',
    soilSubtypes: ['Red Sandy Loam (Alfisols)', 'Clay Loam', 'River Alluvium'],
    soilPh: '6.5 - 7.8 (Neutral to Mildly Alkaline)',
    soilTexture: 'Friable Sandy Clay Loam with good aeration',
    waterRetention: 'Moderate',
    organicCarbon: 'Medium (0.5-0.75%)',
    majorNutrientDeficiencies: ['Nitrogen', 'Zinc', 'Boron'],
    irrigationProfile: 'Borewells, Palar/Cheyyar river basin & tank irrigation',
    currentSeasonAdvisory: 'Warm ambient weather is ideal for Groundnut pegging and horticultural fruit orchard establishment.',
    crops: [
      {
        name: 'Groundnut / Peanut (Arachis hypogaea)',
        tamilName: 'நிலக்கடலை (TMV 13 / VRI 8)',
        category: 'Pulses & Oilseeds',
        season: 'Adipattam (Jul - Oct) & Thaipattam (Dec - Mar)',
        waterNeed: 'Moderate',
        idealTempRangeC: [22, 33],
        idealHumidityRange: [50, 75],
        soilSuitability: 'Loose, friable red sandy loam allows effortless peg penetration and pod development.',
        agronomicTip: 'Apply Gypsum (400 kg/ha) at 40-45 days after sowing to ensure shell hardening and high oil recovery.',
        yieldDurationDays: '105 - 115 days'
      },
      {
        name: 'Finger Millet / Ragi',
        tamilName: 'கேழ்வரகு',
        category: 'Food Grain',
        season: 'Kharif (Jul - Oct) & Rabi (Dec - Mar)',
        waterNeed: 'Low',
        idealTempRangeC: [22, 32],
        idealHumidityRange: [45, 70],
        soilSuitability: 'High calcium and iron uptake from well-drained red loam.',
        agronomicTip: 'Seed treatment with Azospirillum saves 25% inorganic nitrogen.',
        yieldDurationDays: '100 - 110 days'
      },
      {
        name: 'Commercial Mango & Guava Orchards',
        tamilName: 'மாம்பழம் / கொய்யா',
        category: 'Horticulture & Fruits',
        season: 'Main Harvest (Apr - Jul)',
        waterNeed: 'Low',
        idealTempRangeC: [24, 38],
        idealHumidityRange: [40, 65],
        soilSuitability: 'Deep, stone-free red soil ensures strong taproot development.',
        agronomicTip: 'Adopt ultra-high-density planting (UHDP) with regular pruning for 2x fruit yield.',
        yieldDurationDays: 'Perennial'
      }
    ]
  };
};

/**
 * Authentic 12-Month Agro-Climatic Sowing & Harvesting Calendar for Tamil Nadu
 * Calibrated against TNAU Agro-Advisory & Seasonal Crop Sowing Schedules
 */
export const TAMIL_NADU_12_MONTH_CROP_CALENDAR: MonthlyCropSchedule[] = [
  {
    monthIndex: 0,
    monthName: 'January',
    tamilMonth: 'தை (Thai)',
    seasonName: 'Navarai / Late Thaladi (Winter Sowing)',
    seasonTamil: 'தைப்பட்டம் / நவரை பருவம்',
    agroClimateOverview: 'Pleasant winter temperatures with moderate morning dew and minimum rainfall. Favorable for rice-fallow pulses, watermelon, summer groundnut, and vegetables.',
    irrigationStrategy: 'Light frequent irrigations for seedlings. Protect soil moisture in delta wetlands as monsoon water recedes.',
    pestAndDiseaseAdvisory: 'Watch for powdery mildew in pulses and thrips in chillies during warm daytime hours.',
    harvestingCrops: ['Samba Paddy (மெயின் சம்பா நெல்)', 'Sugarcane (கரும்பு)', 'Cotton (பருத்தி - First Picking)', 'Turmeric (மஞ்சள்)'],
    recommendedSowingCrops: [
      {
        name: 'Rice Fallow Blackgram (ADT-3, VBN-8)',
        tamilName: 'உளுந்து (நெல் தரிசு)',
        category: 'Pulses & Oilseeds',
        waterNeed: 'Low',
        idealSoil: 'Clayey Delta Alluvium retaining residual moisture post-paddy.',
        durationDays: '65 - 70 days',
        description: 'Broadcasted 4-6 days before paddy harvest into standing crop to capture residual moisture.',
        idealTempRangeC: [20, 32],
        idealHumidityRange: [50, 75],
        suitableAgroZones: ['Cauvery Delta', 'Northern Coastal', 'Southern Plains']
      },
      {
        name: 'Summer Watermelon & Muskmelon',
        tamilName: 'தர்பூசணி / முலாம் பழம்',
        category: 'Horticulture & Fruits',
        waterNeed: 'Moderate',
        idealSoil: 'Sandy River Loam / Coastal Riverbeds with high drainage.',
        durationDays: '75 - 85 days',
        description: 'Prime month for sowing to capture peak summer market demand in April-May.',
        idealTempRangeC: [22, 35],
        idealHumidityRange: [45, 70],
        suitableAgroZones: ['River Basins', 'Coastal Belt', 'Central Plains']
      },
      {
        name: 'Navarai Short Duration Paddy (CO-51, ADT-43)',
        tamilName: 'நவரை நெல்',
        category: 'Food Grain',
        waterNeed: 'Very High',
        idealSoil: 'Alluvial and clayey wetland soils with assured well/tank irrigation.',
        durationDays: '105 - 115 days',
        description: 'High solar radiation during vegetative stage promotes profuse tillering.',
        idealTempRangeC: [22, 34],
        idealHumidityRange: [60, 85],
        suitableAgroZones: ['Northern Tamil Nadu', 'Kanchipuram', 'Tiruvallur']
      },
      {
        name: 'Summer Sesame (Gingelly - TMV-7)',
        tamilName: 'எள் (கோடை எள்)',
        category: 'Pulses & Oilseeds',
        waterNeed: 'Low',
        idealSoil: 'Well-drained red sandy loam and light alluvial soils.',
        durationDays: '80 - 85 days',
        description: 'Excellent cash crop requiring only 2-3 protective irrigations.',
        idealTempRangeC: [24, 36],
        idealHumidityRange: [40, 65],
        suitableAgroZones: ['Statewide', 'Delta', 'Southern Drylands']
      }
    ]
  },
  {
    monthIndex: 1,
    monthName: 'February',
    tamilMonth: 'மாசி (Masi)',
    seasonName: 'Masi Pattam (Early Summer Crop Cycle)',
    seasonTamil: 'மாசிப்பட்டம் (கோடை முன் பருவம்)',
    agroClimateOverview: 'Rising daytime temperatures and clear skies. Excellent solar radiation for flowering in pulses and fruit setting in vegetables.',
    irrigationStrategy: 'Initiate drip fertigation for horticultural crops; schedule irrigation in early morning hours.',
    pestAndDiseaseAdvisory: 'Monitor red spider mites in bhendi and shoot & fruit borer in brinjal.',
    harvestingCrops: ['Late Samba Paddy (தாளடி நெல்)', 'Chillies (மிளகாய் - Main Flush)', 'Tobacco (புகையிலை)'],
    recommendedSowingCrops: [
      {
        name: 'Hybrid Bhendi / Okra (Co-4, Arka Anamika)',
        tamilName: 'வெண்டைக்காய்',
        category: 'Vegetables',
        waterNeed: 'Moderate',
        idealSoil: 'Rich loamy soil with neutral pH (6.5 - 7.5).',
        durationDays: '85 - 90 days',
        description: 'Sow in ridges and furrows. High resistance to Yellow Vein Mosaic Virus.',
        idealTempRangeC: [24, 35],
        idealHumidityRange: [45, 75],
        suitableAgroZones: ['Statewide Plains', 'Coimbatore', 'Salem']
      },
      {
        name: 'Bitter Gourd & Snake Gourd',
        tamilName: 'பாகற்காய் / புடலங்காய்',
        category: 'Vegetables',
        waterNeed: 'Moderate',
        idealSoil: 'Sandy loam with organic compost pits.',
        durationDays: '100 - 120 days',
        description: 'Pandal (trellis) cultivation delivers premium quality export-grade gourds.',
        idealTempRangeC: [25, 36],
        idealHumidityRange: [50, 75],
        suitableAgroZones: ['Dindigul', 'Theni', 'Coimbatore', 'Tiruppur']
      },
      {
        name: 'Madurai Jasmine (Jasminum sambac)',
        tamilName: 'மதுரை மல்லிகை (புதிய நடவு)',
        category: 'Commercial / Cash Crop',
        waterNeed: 'Moderate',
        idealSoil: 'Well-drained red loam with gravelly subsoil.',
        durationDays: 'Perennial (Pruning season)',
        description: 'Spring pruning and organic manuring induces intense flower bud initiation for summer.',
        idealTempRangeC: [24, 34],
        idealHumidityRange: [50, 70],
        suitableAgroZones: ['Madurai', 'Virudhunagar', 'Dindigul', 'Erode']
      },
      {
        name: 'Cluster Beans & Cowpea',
        tamilName: 'கொத்தவரங்காய் / காராமணி',
        category: 'Vegetables',
        waterNeed: 'Low',
        idealSoil: 'Drought-tolerant in light red and black soils.',
        durationDays: '70 - 80 days',
        description: 'Fixes atmospheric nitrogen while yielding continuous vegetable flushes.',
        idealTempRangeC: [25, 38],
        idealHumidityRange: [40, 65],
        suitableAgroZones: ['Southern Drylands', 'Interior Plains']
      }
    ]
  },
  {
    monthIndex: 2,
    monthName: 'March',
    tamilMonth: 'பங்குனி (Panguni)',
    seasonName: 'Summer Irrigated / Zaid Season',
    seasonTamil: 'பங்குனிப்பட்டம் / கோடை பாசனப் பருவம்',
    agroClimateOverview: 'Dry tropical atmosphere with thermal highs reaching 34°C - 38°C in interior plains. Focus on drought-hardy and irrigated cash crops.',
    irrigationStrategy: 'Apply mulching (sugarcane trash or coir pith) around fruit trees and vegetables to cut evaporation losses by 40%.',
    pestAndDiseaseAdvisory: 'Watch for yellowing in groundnut due to iron chlorosis in calcareous soils; apply ferrous sulfate spray.',
    harvestingCrops: ['Summer Sesame (எள் அறுவடை)', 'Coriander (கொத்தமல்லி)', 'Sunflower (சூரியகாந்தி)'],
    recommendedSowingCrops: [
      {
        name: 'Summer Irrigated Groundnut (TMV-13, VRI-8)',
        tamilName: 'கோடை நிலக்கடலை',
        category: 'Pulses & Oilseeds',
        waterNeed: 'Moderate',
        idealSoil: 'Red sandy loam with friable texture for easy peg penetration.',
        durationDays: '100 - 105 days',
        description: 'Gypsum application at 40-45 days ensures bold kernels and high oil percentage.',
        idealTempRangeC: [25, 36],
        idealHumidityRange: [40, 65],
        suitableAgroZones: ['Vellore', 'Tiruvannamalai', 'Villupuram', 'Cuddalore']
      },
      {
        name: 'Fodder Sorghum & Co-FS-29',
        tamilName: 'தீவனச் சோளம்',
        category: 'Food Grain',
        waterNeed: 'Low',
        idealSoil: 'Adaptable to medium black and red soils.',
        durationDays: '60 days (Multi-cut)',
        description: 'Crucial green fodder security for dairy cattle during dry summer months.',
        idealTempRangeC: [26, 38],
        idealHumidityRange: [35, 60],
        suitableAgroZones: ['Coimbatore', 'Erode', 'Namakkal', 'Dindigul']
      },
      {
        name: 'Cucumber & Gherkins',
        tamilName: 'வெள்ளரிக்காய்',
        category: 'Vegetables',
        waterNeed: 'Moderate',
        idealSoil: 'Sandy alluvial soils with rapid drainage.',
        durationDays: '60 - 70 days',
        description: 'Short duration cash generator with ready local market acceptance.',
        idealTempRangeC: [25, 36],
        idealHumidityRange: [45, 70],
        suitableAgroZones: ['Dharmapuri', 'Krishnagiri', 'Salem']
      }
    ]
  },
  {
    monthIndex: 3,
    monthName: 'April',
    tamilMonth: 'சித்திரை (Chithirai)',
    seasonName: 'Chithirai Pattam (Summer Sowing & Green Manure)',
    seasonTamil: 'சித்திரைப்பட்டம் (பசுந்தாள் உரம் & கோடை விதைப்பு)',
    agroClimateOverview: 'Peak summer heat across Tamil Nadu plains (36°C - 41°C). Sowing of green manure crops to rejuvenate soil organic matter ahead of Kuruvai.',
    irrigationStrategy: 'Night-time or early dawn irrigation avoids thermal shock to crop root systems.',
    pestAndDiseaseAdvisory: 'Protect nurseries with 50% green agro-shade nets against scorching solar flux.',
    harvestingCrops: ['Alphonso & Banganapalli Mango (மாம்பழம்)', 'Summer Groundnut (கோடை நிலக்கடலை)'],
    recommendedSowingCrops: [
      {
        name: 'Green Manure Daincha & Sunnhemp',
        tamilName: 'தக்கைப்பூண்டு / சணப்பை (பசுந்தாள் உரம்)',
        category: 'Commercial / Cash Crop',
        waterNeed: 'Low',
        idealSoil: 'All wetland and dryland soils; dissolves hard clay pan.',
        durationDays: '45 days (Plough back into soil)',
        description: 'Adds 15-20 tonnes/ha of organic biomass and fixes 80kg of atmospheric nitrogen.',
        idealTempRangeC: [28, 40],
        idealHumidityRange: [35, 65],
        suitableAgroZones: ['Cauvery Delta', 'Statewide Wetlands']
      },
      {
        name: 'Summer Ragi / Finger Millet (CO-15)',
        tamilName: 'கேழ்வரகு (சித்திரை ராகி)',
        category: 'Food Grain',
        waterNeed: 'Low',
        idealSoil: 'Red sandy loam and gravelly soils.',
        durationDays: '95 - 105 days',
        description: 'Highly nutritious drought-resilient cereal with high calcium content.',
        idealTempRangeC: [26, 38],
        idealHumidityRange: [40, 65],
        suitableAgroZones: ['Salem', 'Dharmapuri', 'Krishnagiri']
      },
      {
        name: 'Sweet Corn & Baby Corn',
        tamilName: 'இனிப்புச் சோளம்',
        category: 'Commercial / Cash Crop',
        waterNeed: 'Moderate',
        idealSoil: 'Deep, fertile well-drained loams.',
        durationDays: '75 - 80 days',
        description: 'Short duration peri-urban crop with high profit margins.',
        idealTempRangeC: [25, 37],
        idealHumidityRange: [45, 70],
        suitableAgroZones: ['Tiruvallur', 'Coimbatore', 'Madurai']
      }
    ]
  },
  {
    monthIndex: 4,
    monthName: 'May',
    tamilMonth: 'வைகாசி (Vaigasi)',
    seasonName: 'Vaigasi Pattam (Pre-Monsoon Preparation & Kuruvai Nursery)',
    seasonTamil: 'வைகாசிப்பட்டம் (குறுவை நாற்றங்கால் பருவம்)',
    agroClimateOverview: 'Summer thunderstorms (Summer Convective Showers) begin in Western and Southern zones. Optimum window for raising Kuruvai paddy mat nurseries.',
    irrigationStrategy: 'Prepare raised nursery beds (Modified Mat Nursery) for mechanized transplanter operations.',
    pestAndDiseaseAdvisory: 'Seed treatment with Pseudomonas fluorescens (10g/kg seed) to prevent blast and bacterial leaf blight.',
    harvestingCrops: ['Summer Watermelon', 'Banana (வாழை - Ratoon Crop)'],
    recommendedSowingCrops: [
      {
        name: 'Kuruvai Paddy Nursery (CO-51, ADT-37, ASD-16)',
        tamilName: 'குறுவை நெல் நாற்றங்கால்',
        category: 'Food Grain',
        waterNeed: 'High',
        idealSoil: 'Fertile wetland alluvium with high organic matter.',
        durationDays: '15-18 days nursery stage',
        description: 'Mat nursery method uses 80% less water and ensures robust seedlings.',
        idealTempRangeC: [26, 36],
        idealHumidityRange: [55, 85],
        suitableAgroZones: ['Thanjavur', 'Tiruvarur', 'Nagapattinam', 'Mayiladuthurai']
      },
      {
        name: 'Erode Turmeric (Rhizome Planting)',
        tamilName: 'மஞ்சள் (ஈரோடு மஞ்சள் நடவு)',
        category: 'Spices',
        waterNeed: 'High',
        idealSoil: 'Deep, friable rich red and black clay loam.',
        durationDays: '270 - 290 days',
        description: 'Ridge planting with drip irrigation prevents rhizome rot and enhances curcumin levels.',
        idealTempRangeC: [25, 35],
        idealHumidityRange: [60, 85],
        suitableAgroZones: ['Erode', 'Salem', 'Coimbatore', 'Karur']
      },
      {
        name: 'Summer Irrigated Cotton (SVPR-4, Suraj)',
        tamilName: 'பருத்தி (கோடை இறவை)',
        category: 'Commercial / Cash Crop',
        waterNeed: 'Moderate',
        idealSoil: 'Deep black cotton soil (Vertisols) with high clay content.',
        durationDays: '150 - 160 days',
        description: 'Pre-monsoon sowing enables root establishment before heavy rains.',
        idealTempRangeC: [26, 37],
        idealHumidityRange: [50, 75],
        suitableAgroZones: ['Virudhunagar', 'Theni', 'Madurai', 'Tirunelveli']
      }
    ]
  },
  {
    monthIndex: 5,
    monthName: 'June',
    tamilMonth: 'ஆனி (Aani)',
    seasonName: 'Kuruvai / Sornavari Prime Sowing',
    seasonTamil: 'ஆனிப்பட்டம் / குறுவை / சொர்ணவாரி பருவம்',
    agroClimateOverview: 'Southwest Monsoon winds active along Western Ghats. Inflow in Mettur dam feeds Cauvery delta canals. Intensive transplanting phase.',
    irrigationStrategy: 'Maintain 2.5cm shallow water depth during initial tillering stage of transplanted paddy.',
    pestAndDiseaseAdvisory: 'Apply zinc sulfate (25 kg/ha) basal to eliminate khaira disease in delta soils.',
    harvestingCrops: ['Summer Pulses', 'Mango (மாம்பழம் இறுதி அறுவடை)'],
    recommendedSowingCrops: [
      {
        name: 'Kuruvai Main Paddy (ADT-43, TPS-5, CO-51)',
        tamilName: 'குறுவை நெல் நடவு',
        category: 'Food Grain',
        waterNeed: 'Very High',
        idealSoil: 'Deltaic alluvial clay and fertile clay loams.',
        durationDays: '105 - 115 days',
        description: 'Prime agricultural season in Cauvery basin with maximum solar energy conversion.',
        idealTempRangeC: [25, 35],
        idealHumidityRange: [65, 88],
        suitableAgroZones: ['Delta Zone', 'Northern Plains']
      },
      {
        name: 'Pearl Millet / Cumbu (CO-10)',
        tamilName: 'கம்பு',
        category: 'Food Grain',
        waterNeed: 'Low',
        idealSoil: 'Light sandy soils and porous red soils.',
        durationDays: '85 - 90 days',
        description: 'Highly heat-tolerant millets with high iron and zinc density.',
        idealTempRangeC: [26, 38],
        idealHumidityRange: [40, 70],
        suitableAgroZones: ['Tuticorin', 'Ramanathapuram', 'Villupuram', 'Perambalur']
      },
      {
        name: 'Commercial Tapioca / Cassava (Kunguma Rose)',
        tamilName: 'மரவள்ளிக்கிழங்கு',
        category: 'Commercial / Cash Crop',
        waterNeed: 'Moderate',
        idealSoil: 'Well-drained red loam with low compaction.',
        durationDays: '270 - 300 days',
        description: 'Major raw material for sago and starch industrial mills in Salem-Namakkal belt.',
        idealTempRangeC: [25, 36],
        idealHumidityRange: [55, 80],
        suitableAgroZones: ['Salem', 'Namakkal', 'Dharmapuri', 'Villupuram']
      }
    ]
  },
  {
    monthIndex: 6,
    monthName: 'July',
    tamilMonth: 'ஆடி (Aadi)',
    seasonName: 'Aadi Pattam (Grand Sowing Season - ஆடிப்பட்டம் தேடி விதை)',
    seasonTamil: 'ஆடிப்பட்டம் (தமிழகத்தின் முதன்மை விதைப்புப் பருவம்)',
    agroClimateOverview: 'The most revered traditional sowing window across Tamil Nadu. High atmospheric moisture, steady cloud cover, and moderate temperatures.',
    irrigationStrategy: 'Ideal moisture profile for dryland rainfed seeding. Conserve rainwater in farm ponds.',
    pestAndDiseaseAdvisory: 'Treat groundnut seeds with Trichoderma viride to prevent collar rot.',
    harvestingCrops: ['Green Manure (மண்ணில் மடக்க உழுதல்)'],
    recommendedSowingCrops: [
      {
        name: 'Rainfed Groundnut (VRI-2, TMV-7, Kadiri-6)',
        tamilName: 'ஆடிப்பட்ட நிலக்கடலை',
        category: 'Pulses & Oilseeds',
        waterNeed: 'Moderate',
        idealSoil: 'Red gravelly loam and sandy soils.',
        durationDays: '105 - 110 days',
        description: 'Traditional Aadi sowing ensures highest pod filling and kernel weight.',
        idealTempRangeC: [24, 34],
        idealHumidityRange: [55, 80],
        suitableAgroZones: ['Tiruvannamalai', 'Vellore', 'Namakkal', 'Pudukkottai']
      },
      {
        name: 'Rainfed Cotton (KC-3, SVPR-2, Bt Cotton)',
        tamilName: 'மானாவாரிப் பருத்தி',
        category: 'Commercial / Cash Crop',
        waterNeed: 'Moderate',
        idealSoil: 'Deep black soils (Vertisols) with deep moisture retention.',
        durationDays: '150 - 165 days',
        description: 'Sow at 90x45cm spacing with bio-fertilizers.',
        idealTempRangeC: [25, 35],
        idealHumidityRange: [50, 75],
        suitableAgroZones: ['Perambalur', 'Ariyalur', 'Virudhunagar', 'Tuticorin']
      },
      {
        name: 'Redgram / Pigeonpea (CO-8, VBN-3)',
        tamilName: 'துவரை (மானாவாரி)',
        category: 'Pulses & Oilseeds',
        waterNeed: 'Low',
        idealSoil: 'Well-drained red loam, intercropped with groundnut/cotton.',
        durationDays: '160 - 180 days',
        description: 'Essential protein pulse, deep taproot breaks compacted subsoil.',
        idealTempRangeC: [24, 35],
        idealHumidityRange: [50, 75],
        suitableAgroZones: ['Krishnagiri', 'Dharmapuri', 'Salem', 'Tiruvannamalai']
      },
      {
        name: 'Commercial Tomato & Brinjal Nursery',
        tamilName: 'தக்காளி / கத்தரி நாற்றங்கால்',
        category: 'Vegetables',
        waterNeed: 'Moderate',
        idealSoil: 'Sterilized raised nursery beds with vermicompost.',
        durationDays: '25 days nursery -> 120 days crop',
        description: 'High yielding hybrids (Shivam, US-440) for festive winter harvest.',
        idealTempRangeC: [22, 32],
        idealHumidityRange: [60, 85],
        suitableAgroZones: ['Dindigul', 'Krishnagiri', 'Coimbatore', 'Salem']
      }
    ]
  },
  {
    monthIndex: 7,
    monthName: 'August',
    tamilMonth: 'ஆவணி (Aavani)',
    seasonName: 'Samba Nursery & Pre-Northeast Monsoon Planting',
    seasonTamil: 'ஆவணிப்பட்டம் (சம்பா நெல் நாற்றங்கால் பருவம்)',
    agroClimateOverview: 'Transition towards Northeast Monsoon. Rising humidity and pleasant breeze. Prime time for long-duration Samba paddy nursery raising.',
    irrigationStrategy: 'Ensure weed-free nursery beds. Adopt cono-weeder in early transplanted plots.',
    pestAndDiseaseAdvisory: 'Set up light traps and pheromone traps for yellow stem borer in paddy.',
    harvestingCrops: ['Sesame (எள்)', 'Early Vegetables'],
    recommendedSowingCrops: [
      {
        name: 'Samba Long Duration Paddy (CR-1009 Sub-1, BPT-5204)',
        tamilName: 'சம்பா நெல் நாற்றங்கால்',
        category: 'Food Grain',
        waterNeed: 'Very High',
        idealSoil: 'Heavy deltaic clay and river basin soils.',
        durationDays: '145 - 155 days',
        description: 'Flood-tolerant submergence gene (Sub-1) protects against monsoon waterlogging.',
        idealTempRangeC: [24, 33],
        idealHumidityRange: [65, 90],
        suitableAgroZones: ['Cauvery Delta', 'Cuddalore', 'Kanchipuram']
      },
      {
        name: 'Small Onion / Shallots (CO-5, CO-On-5)',
        tamilName: 'சின்ன வெங்காயம் (சாம்பார் வெங்காயம்)',
        category: 'Vegetables',
        waterNeed: 'Moderate',
        idealSoil: 'Friable red sandy loam with organic poultry manure.',
        durationDays: '65 - 75 days',
        description: 'Extremely profitable cash crop in Dindigul-Perambalur belt.',
        idealTempRangeC: [22, 32],
        idealHumidityRange: [55, 80],
        suitableAgroZones: ['Perambalur', 'Dindigul', 'Tiruppur', 'Namakkal']
      },
      {
        name: 'Maize / Corn (CO-6, Pioneer Hybrid)',
        tamilName: 'மக்காச்சோளம்',
        category: 'Food Grain',
        waterNeed: 'Moderate',
        idealSoil: 'Deep black and fertile red loams.',
        durationDays: '105 - 110 days',
        description: 'Major poultry feed grain in Namakkal and Udumalpet belts.',
        idealTempRangeC: [24, 34],
        idealHumidityRange: [50, 75],
        suitableAgroZones: ['Namakkal', 'Perambalur', 'Coimbatore', 'Tiruppur']
      }
    ]
  },
  {
    monthIndex: 8,
    monthName: 'September',
    tamilMonth: 'புரட்டாசி (Purattasi)',
    seasonName: 'Main Samba Transplanting & Rainfed Millets',
    seasonTamil: 'புரட்டாசிப்பட்டம் (பெருஞ் சம்பா நடவு & சிறுதானியங்கள்)',
    agroClimateOverview: 'Pre-monsoon cloudiness increases. Thunderstorms provide soil saturation. Peak transplanting activity for Samba paddy in Tamil Nadu.',
    irrigationStrategy: 'Level fields meticulously to ensure uniform water depth and prevent seedling drowning.',
    pestAndDiseaseAdvisory: 'Incorporate neem cake (250 kg/ha) into soil to suppress root nematodes and soil grubs.',
    harvestingCrops: ['Kuruvai Paddy (குறுவை நெல் அறுவடை)', 'Pearl Millet / Cumbu'],
    recommendedSowingCrops: [
      {
        name: 'Main Samba Paddy Transplanting (ADT-45, TKM-13, Deluxe Ponni)',
        tamilName: 'பெருஞ்சம்பா நெல் நடவு',
        category: 'Food Grain',
        waterNeed: 'Very High',
        idealSoil: 'Clayey alluvium and fertile wetlands.',
        durationDays: '135 - 145 days',
        description: 'Mainstay rice crop of Tamil Nadu covering over 12 lakh hectares.',
        idealTempRangeC: [23, 33],
        idealHumidityRange: [70, 92],
        suitableAgroZones: ['Cauvery Delta', 'Northern Tamil Nadu', 'Coastal Belts']
      },
      {
        name: 'Minor Millets (Kodo, Little Millet, Foxtail)',
        tamilName: 'சிறு தானியங்கள் (வரகு, சாமை, தினை)',
        category: 'Food Grain',
        waterNeed: 'Low',
        idealSoil: 'Marginal red gravelly and drought-prone rocky soils.',
        durationDays: '80 - 90 days',
        description: 'Nutritional powerhouses with minimal fertilizer requirements.',
        idealTempRangeC: [24, 35],
        idealHumidityRange: [45, 70],
        suitableAgroZones: ['Dharmapuri', 'Pudukkottai', 'Ramanathapuram']
      },
      {
        name: 'Rainfed Sunflower (CO-2, Sunbred)',
        tamilName: 'சூரியகாந்தி',
        category: 'Pulses & Oilseeds',
        waterNeed: 'Moderate',
        idealSoil: 'Black soil with deep root zone.',
        durationDays: '85 - 90 days',
        description: 'High oil recovery percentage with good drought tolerance.',
        idealTempRangeC: [22, 33],
        idealHumidityRange: [50, 75],
        suitableAgroZones: ['Virudhunagar', 'Tuticorin', 'Tirunelveli']
      }
    ]
  },
  {
    monthIndex: 9,
    monthName: 'October',
    tamilMonth: 'ஐப்பசி (Aippasi)',
    seasonName: 'Thaladi & Northeast Monsoon Sowing Cycle',
    seasonTamil: 'ஐப்பசிப்பட்டம் / தாளடி / வடகிழக்குப் பருவமழை பருவம்',
    agroClimateOverview: 'Arrival of Northeast Monsoon (Oct-Dec) bringing 60% of Tamil Nadu annual rainfall. Cyclonic depressions and heavy coastal rain showers.',
    irrigationStrategy: 'Provide deep field drainage trenches every 6 meters to evacuate excess storm runoff.',
    pestAndDiseaseAdvisory: 'Watch for Bacterial Leaf Blight and Brown Plant Hopper (BPH) in flooded paddy; drain water immediately.',
    harvestingCrops: ['Kuruvai Final Harvest (குறுவை இறுதி அறுவடை)'],
    recommendedSowingCrops: [
      {
        name: 'Thaladi Paddy (ADT-38, CR-1009 Sub-1, CO-52)',
        tamilName: 'தாளடி நெல் (இரண்டாம் போகம்)',
        category: 'Food Grain',
        waterNeed: 'Very High',
        idealSoil: 'Double-cropped delta wetlands following Kuruvai.',
        durationDays: '130 - 140 days',
        description: 'Tolerates cooler winter flowering period and high monsoon humidity.',
        idealTempRangeC: [22, 31],
        idealHumidityRange: [75, 95],
        suitableAgroZones: ['Cauvery Delta', 'Kallakurichi', 'Villupuram']
      },
      {
        name: 'Bengal Gram / Chickpea (CO-4, JAKI-9218)',
        tamilName: 'கொண்டைக்கடலை (சுண்டல்)',
        category: 'Pulses & Oilseeds',
        waterNeed: 'Low',
        idealSoil: 'Deep black cotton soils (Vertisols) with residual monsoon moisture.',
        durationDays: '90 - 100 days',
        description: 'Winter crop thriving on morning dew in southern black soil tracts.',
        idealTempRangeC: [18, 28],
        idealHumidityRange: [50, 75],
        suitableAgroZones: ['Coimbatore', 'Tiruppur', 'Virudhunagar', 'Tuticorin']
      },
      {
        name: 'Coriander / Cilantro (CO-4, CS-11)',
        tamilName: 'கொத்தமல்லி (மானாவாரி)',
        category: 'Spices',
        waterNeed: 'Low',
        idealSoil: 'Black clay loam with high moisture holding capacity.',
        durationDays: '70 - 75 days',
        description: 'Commercial spice crop sown as winter rainfed crop in southern districts.',
        idealTempRangeC: [20, 30],
        idealHumidityRange: [55, 80],
        suitableAgroZones: ['Ramanathapuram', 'Tuticorin', 'Virudhunagar']
      },
      {
        name: 'Hill Winter Carrots, Garlic & Potato',
        tamilName: 'மலைக்காய்கறிகள் (கேரட், பூண்டு, உருளை)',
        category: 'Vegetables',
        waterNeed: 'Moderate',
        idealSoil: 'Highland acidic forest loam (Nilgiris / Kodaikanal).',
        durationDays: '90 - 120 days',
        description: 'High-value temperate vegetable production in Western Ghats.',
        idealTempRangeC: [10, 18],
        idealHumidityRange: [65, 90],
        suitableAgroZones: ['Nilgiris', 'Dindigul (Kodaikanal)', 'Yercaud']
      }
    ]
  },
  {
    monthIndex: 10,
    monthName: 'November',
    tamilMonth: 'கார்த்திகை (Karthigai)',
    seasonName: 'Late Monsoon / Post-Rain Sowing Cycle',
    seasonTamil: 'கார்த்திகைப் பட்டம் (பின்பருவ மழை விதைப்பு)',
    agroClimateOverview: 'Peak Northeast Monsoon precipitation in coastal zones. Decreasing night temperatures (20°C - 24°C). Ideal for sowing winter cash crops.',
    irrigationStrategy: 'Utilize monsoon soil recharge; maintain bunds to prevent topsoil nutrient leaching.',
    pestAndDiseaseAdvisory: 'Spray copper oxychloride (0.25%) against fungal fruit rot in chillies and vegetables.',
    harvestingCrops: ['Rainfed Groundnut (மானாவாரி நிலக்கடலை)', 'Maize (மக்காச்சோளம்)'],
    recommendedSowingCrops: [
      {
        name: 'Samba Chilli / Guntur Hybrid (K1, K2, Teja)',
        tamilName: 'மிளகாய் (கார்த்திகை நடவு)',
        category: 'Spices',
        waterNeed: 'Moderate',
        idealSoil: 'Well-drained red loam and black clay loam.',
        durationDays: '150 - 180 days',
        description: 'High capsaicin content and vibrant red color development.',
        idealTempRangeC: [20, 30],
        idealHumidityRange: [60, 85],
        suitableAgroZones: ['Ramanathapuram', 'Tuticorin', 'Sivagangai', 'Madurai']
      },
      {
        name: 'Tobacco (Chewing & Bidi Tobacco)',
        tamilName: 'புகையிலை',
        category: 'Commercial / Cash Crop',
        waterNeed: 'Moderate',
        idealSoil: 'Deep, well-drained red gravelly soils with high potassium.',
        durationDays: '120 - 130 days',
        description: 'Traditional cash crop in Dindigul (Vedasandur) and Erode districts.',
        idealTempRangeC: [20, 31],
        idealHumidityRange: [55, 75],
        suitableAgroZones: ['Dindigul', 'Erode', 'Tiruppur']
      },
      {
        name: 'Winter Watermelon & Gourds',
        tamilName: 'குளிர்கால தர்பூசணி',
        category: 'Horticulture & Fruits',
        waterNeed: 'Moderate',
        idealSoil: 'Sandy coastal and riverbed soils.',
        durationDays: '80 - 90 days',
        description: 'Harvest timed for early summer March premium markets.',
        idealTempRangeC: [22, 32],
        idealHumidityRange: [50, 75],
        suitableAgroZones: ['Coastal Belt', 'Kanchipuram', 'Cuddalore']
      }
    ]
  },
  {
    monthIndex: 11,
    monthName: 'December',
    tamilMonth: 'மார்கழி (Margazhi)',
    seasonName: 'Navarai / Pishanam Winter Sowing Preparation',
    seasonTamil: 'மார்கழிப் பட்டம் / பிசானம் / நவரை பருவம்',
    agroClimateOverview: 'Monsoon tapering off; crisp cool mornings (18°C - 22°C) with clear afternoon skies. Favorable for cool-season pulses and winter rice.',
    irrigationStrategy: 'Monitor canal closure and switch to borewell/tank irrigation for early vegetative crops.',
    pestAndDiseaseAdvisory: 'Control blast disease in late-sown paddy using tricyclazole during cool, dewy mornings.',
    harvestingCrops: ['Early Samba Paddy (முன் சம்பா நெல்)', 'Cotton (பருத்தி முதல்கட்டம்)', 'Turmeric (மஞ்சள் முதிர்வு)'],
    recommendedSowingCrops: [
      {
        name: 'Navarai Winter Paddy (CO-51, ADT-39, ASD-16)',
        tamilName: 'நவரை குளிர்கால நெல்',
        category: 'Food Grain',
        waterNeed: 'Very High',
        idealSoil: 'Wetland alluvial clay loams with guaranteed water source.',
        durationDays: '110 - 120 days',
        description: 'Fast growing short duration varieties escape pre-summer water scarcity.',
        idealTempRangeC: [19, 30],
        idealHumidityRange: [65, 88],
        suitableAgroZones: ['Tirunelveli (Pishanam)', 'Kanyakumari', 'Vellore']
      },
      {
        name: 'Greengram / Moong (VBN-4, CO-8)',
        tamilName: 'பாசிப்பயறு (பச்சைப்பயறு)',
        category: 'Pulses & Oilseeds',
        waterNeed: 'Low',
        idealSoil: 'Residual moisture soils and light alluvium.',
        durationDays: '60 - 65 days',
        description: 'Short duration pulse offering rapid financial turnaround.',
        idealTempRangeC: [20, 31],
        idealHumidityRange: [55, 75],
        suitableAgroZones: ['Cauvery Delta', 'Southern Plains']
      },
      {
        name: 'French Beans & Cabbage (Plains & Hills)',
        tamilName: 'பீன்ஸ் / முட்டைக்கோஸ்',
        category: 'Vegetables',
        waterNeed: 'Moderate',
        idealSoil: 'Fertile loam with high organic compost.',
        durationDays: '70 - 90 days',
        description: 'Crisp cool December climate ensures dense, sweet vegetable heads.',
        idealTempRangeC: [15, 26],
        idealHumidityRange: [55, 80],
        suitableAgroZones: ['Krishnagiri', 'Dharmapuri', 'Dindigul', 'Theni']
      }
    ]
  }
];

export interface CoordinateAgroMatch {
  latitude: number;
  longitude: number;
  nearestDistrict: string;
  nearestCityName: string;
  distanceKm: number;
  agroZone: string;
  estimatedElevationM: number;
  soilType: string;
  soilPh: string;
  soilTexture: string;
  waterRetention: 'Low' | 'Moderate' | 'High' | 'Very High';
  majorNutrientDeficiencies: string[];
  crops: CropSuggestion[];
  currentMonthSchedule: MonthlyCropSchedule;
}

/**
 * Resolves precision agro-pedology profile & seasonal calendar from GPS Coordinates (Lat, Lon)
 */
export function findAgroProfileByCoordinates(lat: number, lon: number): CoordinateAgroMatch {
  let nearestCity = CITIES_TAMIL_NADU[0];
  let minDistanceSq = Infinity;

  for (const city of CITIES_TAMIL_NADU) {
    const dLat = city.lat - lat;
    const dLon = city.lon - lon;
    const distSq = dLat * dLat + dLon * dLon;
    if (distSq < minDistanceSq) {
      minDistanceSq = distSq;
      nearestCity = city;
    }
  }

  const distanceKm = Number((Math.sqrt(minDistanceSq) * 111).toFixed(1));
  const profile = DISTRICT_AGRO_PROFILES[nearestCity.district] || DISTRICT_AGRO_PROFILES['Chennai'];
  const currentMonthIdx = new Date().getMonth();
  const currentMonthSchedule = TAMIL_NADU_12_MONTH_CROP_CALENDAR[currentMonthIdx];

  return {
    latitude: lat,
    longitude: lon,
    nearestDistrict: nearestCity.district,
    nearestCityName: nearestCity.name,
    distanceKm,
    agroZone: profile.agroZone,
    estimatedElevationM: nearestCity.elevationM,
    soilType: profile.soilType,
    soilPh: profile.soilPh,
    soilTexture: profile.soilTexture,
    waterRetention: profile.waterRetention,
    majorNutrientDeficiencies: profile.majorNutrientDeficiencies,
    crops: profile.crops,
    currentMonthSchedule
  };
}

