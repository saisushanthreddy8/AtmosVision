/**
 * Tamil Nadu 38-District Soil Classification & Agro-Meteorological Crop Advisory
 * Grounded in Tamil Nadu Agricultural University (TNAU) & Department of Agriculture data.
 */

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
}
