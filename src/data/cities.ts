import { CityLocation } from '../types';

export const CITIES_TAMIL_NADU: CityLocation[] = [
  {
    id: 'ooty',
    name: 'Nilgiris (Ooty)',
    district: 'Nilgiris',
    lat: 11.4102,
    lon: 76.6950,
    elevationM: 2240,
    nearestGridLatIdx: 8, // 11.50°N
    nearestGridLonIdx: 2, // 76.75°E
    nearestGridLat: 11.50,
    nearestGridLon: 76.75,
    regionType: 'western-ghats',
    description: 'High-altitude mountain climate in the Nilgiri plateau (2,240m), showing sub-tropical highland properties with low geopotential thickness and crisp sub-15°C temperatures.'
  },
  {
    id: 'chennai',
    name: 'Chennai',
    district: 'Chennai',
    lat: 13.0827,
    lon: 80.2707,
    elevationM: 6,
    nearestGridLatIdx: 2, // 13.00°N
    nearestGridLonIdx: 16, // 80.25°E
    nearestGridLat: 13.00,
    nearestGridLon: 80.25,
    regionType: 'coastal',
    description: 'Capital city along the Coromandel Coast, characterized by marine boundary layer dynamics, northeast trade winds, and high atmospheric moisture flux.'
  },
  {
    id: 'tiruvallur',
    name: 'Tiruvallur',
    district: 'Tiruvallur',
    lat: 13.1438,
    lon: 79.9083,
    elevationM: 38,
    nearestGridLatIdx: 1, // 13.25°N
    nearestGridLonIdx: 15, // 80.00°E
    nearestGridLat: 13.25,
    nearestGridLon: 80.00,
    regionType: 'coastal',
    description: 'Northern coastal district bordering Andhra Pradesh with extensive wetland systems and coastal agricultural plains.'
  },
  {
    id: 'kanchipuram',
    name: 'Kanchipuram',
    district: 'Kanchipuram',
    lat: 12.8342,
    lon: 79.7036,
    elevationM: 83,
    nearestGridLatIdx: 3, // 12.75°N
    nearestGridLonIdx: 14, // 79.75°E
    nearestGridLat: 12.75,
    nearestGridLon: 79.75,
    regionType: 'interior-plains',
    description: 'Northeastern plains adjacent to the Chennai metropolitan grid, tracking regional airmass movement from the northeast.'
  },
  {
    id: 'chengalpattu',
    name: 'Chengalpattu',
    district: 'Chengalpattu',
    lat: 12.6841,
    lon: 79.9836,
    elevationM: 46,
    nearestGridLatIdx: 3, // 12.75°N
    nearestGridLonIdx: 15, // 80.00°E
    nearestGridLat: 12.75,
    nearestGridLon: 80.00,
    regionType: 'coastal',
    description: 'Eastern coastal plain featuring the Palar River estuary, Vedanthangal wetlands, and moderate diurnal temperature variation.'
  },
  {
    id: 'vellore',
    name: 'Vellore',
    district: 'Vellore',
    lat: 12.9165,
    lon: 79.1325,
    elevationM: 216,
    nearestGridLatIdx: 2, // 13.00°N
    nearestGridLonIdx: 12, // 79.25°E
    nearestGridLat: 13.00,
    nearestGridLon: 79.25,
    regionType: 'northern-plateau',
    description: 'Northern inland hill-girt basin of Palar river, prone to high diurnal ranges with cool nights and dry daytime radiation.'
  },
  {
    id: 'ranipet',
    name: 'Ranipet',
    district: 'Ranipet',
    lat: 12.9271,
    lon: 79.3328,
    elevationM: 160,
    nearestGridLatIdx: 2, // 13.00°N
    nearestGridLonIdx: 12, // 79.25°E
    nearestGridLat: 13.00,
    nearestGridLon: 79.25,
    regionType: 'northern-plateau',
    description: 'Industrial basin along the northern plains with dry continental airmass dominance during winter months.'
  },
  {
    id: 'tirupattur',
    name: 'Tirupattur',
    district: 'Tirupattur',
    lat: 12.4925,
    lon: 78.5739,
    elevationM: 388,
    nearestGridLatIdx: 4, // 12.50°N
    nearestGridLonIdx: 9, // 78.50°E
    nearestGridLat: 12.50,
    nearestGridLon: 78.50,
    regionType: 'northern-plateau',
    description: 'Bordered by Yelagiri hills, displaying moderate elevation plateau climate and pleasant nighttime temperatures.'
  },
  {
    id: 'tiruvannamalai',
    name: 'Tiruvannamalai',
    district: 'Tiruvannamalai',
    lat: 12.2253,
    lon: 79.0747,
    elevationM: 171,
    nearestGridLatIdx: 5, // 12.25°N
    nearestGridLonIdx: 11, // 79.00°E
    nearestGridLat: 12.25,
    nearestGridLon: 79.00,
    regionType: 'interior-plains',
    description: 'Home to the volcanic Annamalai hill inselberg, exhibiting semi-arid microclimate with dry sunny conditions in January.'
  },
  {
    id: 'villupuram',
    name: 'Villupuram',
    district: 'Villupuram',
    lat: 11.9401,
    lon: 79.4861,
    elevationM: 45,
    nearestGridLatIdx: 6, // 12.00°N
    nearestGridLonIdx: 13, // 79.50°E
    nearestGridLat: 12.00,
    nearestGridLon: 79.50,
    regionType: 'interior-plains',
    description: 'Central-eastern plain between coastal maritime zone and inland plateau with steady moderate humidity.'
  },
  {
    id: 'kallakurichi',
    name: 'Kallakurichi',
    district: 'Kallakurichi',
    lat: 11.7384,
    lon: 78.9639,
    elevationM: 125,
    nearestGridLatIdx: 7, // 11.75°N
    nearestGridLonIdx: 11, // 79.00°E
    nearestGridLat: 11.75,
    nearestGridLon: 79.00,
    regionType: 'interior-plains',
    description: 'Bordering the Kalrayan Hills, characterized by mixed forest terrain and dry winter convective regimes.'
  },
  {
    id: 'cuddalore',
    name: 'Cuddalore',
    district: 'Cuddalore',
    lat: 11.7480,
    lon: 79.7714,
    elevationM: 6,
    nearestGridLatIdx: 7, // 11.75°N
    nearestGridLonIdx: 14, // 79.75°E
    nearestGridLat: 11.75,
    nearestGridLon: 79.75,
    regionType: 'coastal',
    description: 'Coastal port along the Bay of Bengal, experiencing high relative humidity and steady sea breeze circulation.'
  },
  {
    id: 'salem',
    name: 'Salem',
    district: 'Salem',
    lat: 11.6643,
    lon: 78.1460,
    elevationM: 278,
    nearestGridLatIdx: 7, // 11.75°N
    nearestGridLonIdx: 8, // 78.25°E
    nearestGridLat: 11.75,
    nearestGridLon: 78.25,
    regionType: 'northern-plateau',
    description: 'Encouraged by surrounding hills (Shevaroy Hills), showing distinct nocturnal thermal inversions and stable boundary layer structure.'
  },
  {
    id: 'namakkal',
    name: 'Namakkal',
    district: 'Namakkal',
    lat: 11.2189,
    lon: 78.1674,
    elevationM: 218,
    nearestGridLatIdx: 9, // 11.25°N
    nearestGridLonIdx: 8, // 78.25°E
    nearestGridLat: 11.25,
    nearestGridLon: 78.25,
    regionType: 'interior-plains',
    description: 'Featuring the Kolli Hills to the east, experiencing semi-arid conditions and strong dry north-easterly winds.'
  },
  {
    id: 'dharmapuri',
    name: 'Dharmapuri',
    district: 'Dharmapuri',
    lat: 12.1211,
    lon: 78.1582,
    elevationM: 468,
    nearestGridLatIdx: 5, // 12.25°N
    nearestGridLonIdx: 8, // 78.25°E
    nearestGridLat: 12.25,
    nearestGridLon: 78.25,
    regionType: 'northern-plateau',
    description: 'North-western highland plateau terrain with cooler night temperatures and low dew point temperatures.'
  },
  {
    id: 'krishnagiri',
    name: 'Krishnagiri',
    district: 'Krishnagiri',
    lat: 12.5186,
    lon: 78.2137,
    elevationM: 491,
    nearestGridLatIdx: 4, // 12.50°N
    nearestGridLonIdx: 8, // 78.25°E
    nearestGridLat: 12.50,
    nearestGridLon: 78.25,
    regionType: 'northern-plateau',
    description: 'Elevated granite outcrop terrain near Karnataka plateau, experiencing brisk mornings and high solar radiation.'
  },
  {
    id: 'erode',
    name: 'Erode',
    district: 'Erode',
    lat: 11.3410,
    lon: 77.7172,
    elevationM: 183,
    nearestGridLatIdx: 9, // 11.25°N
    nearestGridLonIdx: 6, // 77.75°E
    nearestGridLat: 11.25,
    nearestGridLon: 77.75,
    regionType: 'interior-plains',
    description: 'Bhavani-Cauvery confluence basin, reflecting mild winter dry conditions with low specific humidity.'
  },
  {
    id: 'tiruppur',
    name: 'Tiruppur',
    district: 'Tiruppur',
    lat: 11.1085,
    lon: 77.3411,
    elevationM: 295,
    nearestGridLatIdx: 10, // 11.00°N
    nearestGridLonIdx: 4, // 77.25°E
    nearestGridLat: 11.00,
    nearestGridLon: 77.25,
    regionType: 'interior-plains',
    description: 'Textile hub in the Noyyal River basin, marked by semi-arid climate and dry winds from the Western Ghats rain shadow.'
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    district: 'Coimbatore',
    lat: 11.0168,
    lon: 76.9558,
    elevationM: 411,
    nearestGridLatIdx: 10, // 11.00°N
    nearestGridLonIdx: 3, // 77.00°E
    nearestGridLat: 11.00,
    nearestGridLon: 77.00,
    regionType: 'interior-plains',
    description: 'Located at the eastern exit of the Palghat Gap in the Western Ghats; experiences localized wind channeling and moderate January temperatures.'
  },
  {
    id: 'tiruchirappalli',
    name: 'Tiruchirappalli',
    district: 'Tiruchirappalli',
    lat: 10.7905,
    lon: 78.7047,
    elevationM: 88,
    nearestGridLatIdx: 11, // 10.75°N
    nearestGridLonIdx: 10, // 78.75°E
    nearestGridLat: 10.75,
    nearestGridLon: 78.75,
    regionType: 'interior-plains',
    description: 'Geographic center of Tamil Nadu in the fertile Cauvery Delta transition, marked by steady inland easterly winds in January.'
  },
  {
    id: 'karur',
    name: 'Karur',
    district: 'Karur',
    lat: 10.9601,
    lon: 78.0766,
    elevationM: 122,
    nearestGridLatIdx: 10, // 11.00°N
    nearestGridLonIdx: 7, // 78.00°E
    nearestGridLat: 11.00,
    nearestGridLon: 78.00,
    regionType: 'interior-plains',
    description: 'Amaravathi-Cauvery basin with hot semi-arid days and clear sunny skies during the winter reanalysis cycle.'
  },
  {
    id: 'perambalur',
    name: 'Perambalur',
    district: 'Perambalur',
    lat: 11.2342,
    lon: 78.8805,
    elevationM: 143,
    nearestGridLatIdx: 9, // 11.25°N
    nearestGridLonIdx: 11, // 79.00°E
    nearestGridLat: 11.25,
    nearestGridLon: 79.00,
    regionType: 'interior-plains',
    description: 'Pachaimalai hills foothills with black cotton soils and dry continental winter weather.'
  },
  {
    id: 'ariyalur',
    name: 'Ariyalur',
    district: 'Ariyalur',
    lat: 11.1401,
    lon: 79.0786,
    elevationM: 76,
    nearestGridLatIdx: 9, // 11.25°N
    nearestGridLonIdx: 11, // 79.00°E
    nearestGridLat: 11.25,
    nearestGridLon: 79.00,
    regionType: 'interior-plains',
    description: 'Sedimentary fossil-rich limestone basin transitioning to the Cauvery delta plain.'
  },
  {
    id: 'thanjavur',
    name: 'Thanjavur',
    district: 'Thanjavur',
    lat: 10.7870,
    lon: 79.1378,
    elevationM: 57,
    nearestGridLatIdx: 11, // 10.75°N
    nearestGridLonIdx: 12, // 79.25°E
    nearestGridLat: 10.75,
    nearestGridLon: 79.25,
    regionType: 'coastal',
    description: 'Cauvery delta region, influenced by Bay of Bengal sea breezes and winter moisture convergence.'
  },
  {
    id: 'tiruvarur',
    name: 'Tiruvarur',
    district: 'Tiruvarur',
    lat: 10.7719,
    lon: 79.6368,
    elevationM: 10,
    nearestGridLatIdx: 11, // 10.75°N
    nearestGridLonIdx: 14, // 79.75°E
    nearestGridLat: 10.75,
    nearestGridLon: 79.75,
    regionType: 'coastal',
    description: 'Central Cauvery delta alluvial wetlands, exhibiting high humidity and coastal fog formation.'
  },
  {
    id: 'nagapattinam',
    name: 'Nagapattinam',
    district: 'Nagapattinam',
    lat: 10.7672,
    lon: 79.8449,
    elevationM: 9,
    nearestGridLatIdx: 11, // 10.75°N
    nearestGridLonIdx: 14, // 79.75°E
    nearestGridLat: 10.75,
    nearestGridLon: 79.75,
    regionType: 'coastal',
    description: 'Low-lying coastal delta tip directly exposed to Bay of Bengal cyclonic tracks and humid sea breezes.'
  },
  {
    id: 'mayiladuthurai',
    name: 'Mayiladuthurai',
    district: 'Mayiladuthurai',
    lat: 11.1018,
    lon: 79.6522,
    elevationM: 14,
    nearestGridLatIdx: 10, // 11.00°N
    nearestGridLonIdx: 14, // 79.75°E
    nearestGridLat: 11.00,
    nearestGridLon: 79.75,
    regionType: 'coastal',
    description: 'Northern delta coastline with rich river channels and sustained moderate relative humidity.'
  },
  {
    id: 'pudukkottai',
    name: 'Pudukkottai',
    district: 'Pudukkottai',
    lat: 10.3833,
    lon: 78.8200,
    elevationM: 100,
    nearestGridLatIdx: 12, // 10.50°N
    nearestGridLonIdx: 10, // 78.75°E
    nearestGridLat: 10.50,
    nearestGridLon: 78.75,
    regionType: 'interior-plains',
    description: 'Semi-arid laterite plateau with sparse vegetation and clear nighttime radiative cooling.'
  },
  {
    id: 'dindigul',
    name: 'Dindigul',
    district: 'Dindigul',
    lat: 10.3673,
    lon: 77.9803,
    elevationM: 268,
    nearestGridLatIdx: 13, // 10.25°N
    nearestGridLonIdx: 7, // 78.00°E
    nearestGridLat: 10.25,
    nearestGridLon: 78.00,
    regionType: 'interior-plains',
    description: 'Foothills of the Palani and Sirumalai ranges, with prominent mountain-valley wind circulation patterns.'
  },
  {
    id: 'madurai',
    name: 'Madurai',
    district: 'Madurai',
    lat: 9.9252,
    lon: 78.1198,
    elevationM: 101,
    nearestGridLatIdx: 14, // 10.00°N
    nearestGridLonIdx: 7, // 78.00°E
    nearestGridLat: 10.00,
    nearestGridLon: 78.00,
    regionType: 'interior-plains',
    description: 'Central Vaigai river basin in the semi-arid interior rain shadow, exhibiting pronounced diurnal temperature oscillations.'
  },
  {
    id: 'theni',
    name: 'Theni',
    district: 'Theni',
    lat: 10.0104,
    lon: 77.4768,
    elevationM: 300,
    nearestGridLatIdx: 14, // 10.00°N
    nearestGridLonIdx: 5, // 77.50°E
    nearestGridLat: 10.00,
    nearestGridLon: 77.50,
    regionType: 'western-ghats',
    description: 'Cumbum valley flanked by the Western Ghats with orographic wind funnels and pleasant highland breezes.'
  },
  {
    id: 'virudhunagar',
    name: 'Virudhunagar',
    district: 'Virudhunagar',
    lat: 9.5872,
    lon: 77.9578,
    elevationM: 81,
    nearestGridLatIdx: 16, // 9.50°N
    nearestGridLonIdx: 7, // 78.00°E
    nearestGridLat: 9.50,
    nearestGridLon: 78.00,
    regionType: 'interior-plains',
    description: 'Dry inland plains characterized by high daytime temperatures and dry soil moisture profiles.'
  },
  {
    id: 'sivaganga',
    name: 'Sivaganga',
    district: 'Sivaganga',
    lat: 9.8433,
    lon: 78.4809,
    elevationM: 102,
    nearestGridLatIdx: 15, // 9.75°N
    nearestGridLonIdx: 9, // 78.50°E
    nearestGridLat: 9.75,
    nearestGridLon: 78.50,
    regionType: 'interior-plains',
    description: 'Chettinad flatlands with scrub vegetation and dry north-easterly surface airflow in January.'
  },
  {
    id: 'ramanathapuram',
    name: 'Ramanathapuram',
    district: 'Ramanathapuram',
    lat: 9.3639,
    lon: 78.8395,
    elevationM: 10,
    nearestGridLatIdx: 17, // 9.25°N
    nearestGridLonIdx: 10, // 78.75°E
    nearestGridLat: 9.25,
    nearestGridLon: 78.75,
    regionType: 'coastal',
    description: 'Palk Strait and Gulf of Mannar coastal peninsula, experiencing strong maritime wind shear and salt humidity.'
  },
  {
    id: 'thoothukudi',
    name: 'Thoothukudi',
    district: 'Thoothukudi',
    lat: 8.7642,
    lon: 78.1348,
    elevationM: 4,
    nearestGridLatIdx: 19, // 8.75°N
    nearestGridLonIdx: 8, // 78.25°E
    nearestGridLat: 8.75,
    nearestGridLon: 78.25,
    regionType: 'coastal',
    description: 'Gulf of Mannar coastal port, characterized by maritime humidity, salt-haze conditions, and moderate wind shear.'
  },
  {
    id: 'tirunelveli',
    name: 'Tirunelveli',
    district: 'Tirunelveli',
    lat: 8.7139,
    lon: 77.7567,
    elevationM: 47,
    nearestGridLatIdx: 19, // 8.75°N
    nearestGridLonIdx: 6, // 77.75°E
    nearestGridLat: 8.75,
    nearestGridLon: 77.75,
    regionType: 'southern-tip',
    description: 'Southern river basin (Thamirabarani) bordered by Agasthiyamalai hills, exhibiting dry northeasterly continental winds during January.'
  },
  {
    id: 'tenkasi',
    name: 'Tenkasi',
    district: 'Tenkasi',
    lat: 8.9594,
    lon: 77.3150,
    elevationM: 143,
    nearestGridLatIdx: 18, // 9.00°N
    nearestGridLonIdx: 4, // 77.25°E
    nearestGridLat: 9.00,
    nearestGridLon: 77.25,
    regionType: 'western-ghats',
    description: 'Courtallam Western Ghats foothills with mountain breeze circulation and scenic highland runoff.'
  },
  {
    id: 'kanyakumari',
    name: 'Kanyakumari',
    district: 'Kanyakumari',
    lat: 8.0883,
    lon: 77.5385,
    elevationM: 10,
    nearestGridLatIdx: 22, // 8.00°N
    nearestGridLonIdx: 5, // 77.50°E
    nearestGridLat: 8.00,
    nearestGridLon: 77.50,
    regionType: 'southern-tip',
    description: 'Southernmost apex of the Indian subcontinent where the Arabian Sea, Bay of Bengal, and Indian Ocean meet, presenting strong oceanic wind divergence.'
  }
];
