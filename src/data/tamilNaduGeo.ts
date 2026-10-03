/**
 * Tamil Nadu Geographic Coordinates & ERA5 Grid Geometry
 * Bounding Box: 8.00°N - 13.50°N (23 steps of 0.25°), 76.25°E - 80.75°E (19 steps of 0.25°)
 */

export const TN_BOUNDS = {
  minLat: 7.95,
  maxLat: 13.65,
  minLon: 76.15,
  maxLon: 80.60,
  latCount: 23,
  lonCount: 19,
  latStep: 0.25,
  lonStep: 0.25,
};

// Generates the 23 latitude points [13.50, 13.25, ..., 8.00] (North to South)
export const ERA5_LATS: number[] = Array.from({ length: 23 }, (_, i) => 13.5 - i * 0.25);

// Generates the 19 longitude points [76.25, 76.50, ..., 80.75] (West to East)
export const ERA5_LONS: number[] = Array.from({ length: 19 }, (_, i) => 76.25 + i * 0.25);

// High-fidelity, geographically exact polygon outline of Tamil Nadu boundary in [lon, lat] pairs
export const TAMIL_NADU_BORDER_GEOJSON: [number, number][] = [
  // 1. Northern Coast & Chennai Metropolitan Region
  [80.18, 13.55], // Pulicat Lake (North border with AP)
  [80.32, 13.46], // Pulicat Island / Barrier spit
  [80.34, 13.32], // Minjur / Ennore Port coast
  [80.30, 13.15], // Royapuram / Chennai Port
  [80.28, 13.06], // Chennai Marina Beach
  [80.26, 12.92], // Thiruvanmiyur / ECR Coast

  // 2. Coromandel Coastline (Chengalpattu, Villupuram, Cuddalore, Mayiladuthurai, Nagapattinam)
  [80.25, 12.78], // Kovalam
  [80.19, 12.62], // Mahabalipuram / Mamallapuram
  [80.12, 12.45], // Sadras / Kalpakkam
  [80.02, 12.30], // Cheyyur
  [79.95, 12.20], // Marakkanam Salt Pans
  [79.86, 12.02], // Auroville / Kalapet
  [79.83, 11.93], // Puducherry Coast
  [79.77, 11.75], // Cuddalore (Silver Beach)
  [79.77, 11.50], // Parangipettai / Porto Novo / Vellar Estuary
  [79.80, 11.35], // Pichavaram Mangrove Wetlands
  [79.85, 11.15], // Poompuhar (Cauvery Delta Outflow)
  [79.85, 11.03], // Tarangambadi (Tranquebar)
  [79.84, 10.92], // Karaikal Sector
  [79.84, 10.76], // Nagapattinam Port
  [79.84, 10.68], // Velankanni Coast
  [79.85, 10.50], // Thiruthuraipoondi Coastal Verge
  [79.85, 10.37], // Vedaranyam

  // 3. Point Calimere (Kodiakkarai) - Eastern Promontory Horn
  [79.88, 10.28], // Point Calimere (Kodiakkarai Cape)

  // 4. Palk Bay Coastline (Muthupet, Pattukkottai, Pudukkottai, Ramanathapuram)
  [79.70, 10.28], // Vedaranyam Great Salt Swamp
  [79.52, 10.32], // Muthupet Mangrove Lagoon
  [79.38, 10.34], // Adirampattinam
  [79.28, 10.20], // Mallipattinam
  [79.20, 10.05], // Sethubhavachatram
  [79.15, 9.95],  // Kottaipattinam / Manamelkudi
  [79.05, 9.80],  // Mimisal
  [79.02, 9.74],  // Thondi
  [78.96, 9.60],  // Uppoor / Tiruvadanai Coast
  [78.90, 9.48],  // Devipattinam

  // 5. Mandapam & Rameswaram Island / Pamban Spit (Dhanushkodi)
  [79.05, 9.38],  // Ramanathapuram East Verge
  [79.15, 9.28],  // Mandapam Peninsula Base
  [79.23, 9.28],  // Pamban Island
  [79.31, 9.29],  // Rameswaram
  [79.42, 9.18],  // Dhanushkodi Point (Adam's Bridge Spit)
  [79.30, 9.24],  // South Rameswaram Shore
  [79.15, 9.25],  // South Mandapam

  // 6. Gulf of Mannar Coastline (Ramanathapuram, Thoothukudi, Tirunelveli)
  [78.92, 9.24],  // Periyapattinam
  [78.78, 9.23],  // Kilakarai
  [78.65, 9.15],  // Valinokkam / Sayalgudi
  [78.50, 9.10],  // Mukaiyur
  [78.36, 9.05],  // Vembar
  [78.25, 8.95],  // Kulathur / Sippikulam
  [78.16, 8.81],  // Thoothukudi (VOC Port)
  [78.15, 8.65],  // Punnakayal (Thamirabarani Estuary)
  [78.13, 8.49],  // Tiruchendur Coast
  [78.06, 8.38],  // Kulasekharapatnam / Manapad Point
  [77.92, 8.28],  // Periathalai / Uvari
  [77.78, 8.20],  // Idinthakarai / Koodankulam
  [77.62, 8.12],  // Vattakottai

  // 7. Southernmost Tip - Kanyakumari (Cape Comorin)
  [77.54, 8.08],  // Kanyakumari (Cape Comorin - Indian Ocean Confluence)

  // 8. Arabian Sea Verge & Western Ghats Border with Kerala
  [77.40, 8.12],  // Manakudy / Rajakkamangalam
  [77.26, 8.18],  // Colachel / Muttom
  [77.16, 8.32],  // Kaliyakkavilai / Marthandam (Kerala Border)
  [77.20, 8.48],  // Pechiparai / Ashambu Hills / Kodayar
  [77.24, 8.65],  // Kalakkad Mundanthurai / Agasthyamalai
  [77.20, 8.82],  // Papanasam / Karayar
  [77.16, 8.98],  // Shenkottai Gap / Courtallam Pass
  [77.24, 9.15],  // Puliyangudi / Sivagiri Hills
  [77.30, 9.35],  // Vasudevanallur / Srivilliputhur Reserve
  [77.35, 9.55],  // Varushanadu / Megamalai Hills
  [77.15, 9.68],  // Cumbum Valley / Highwavys / Gudalur
  [77.12, 9.90],  // Bodinayakkanur / Bodimettu
  [77.15, 10.08], // Kodaikanal / Palani Hills Western Verge
  [77.05, 10.22], // Amaravathi / Anamalai Ridge
  [76.95, 10.32], // Valparai / High Anamallais
  [76.85, 10.48], // Topslip / Pollachi Hills
  [76.82, 10.78], // Palghat Gap (Walayar Border Pass)
  [76.85, 10.88], // Coimbatore West / Walayar Border
  [76.72, 10.98], // Siruvani Hills / Boluvampatti
  [76.80, 11.12], // Karamadai / Mettupalayam Foothills
  [76.80, 11.35], // Coonoor / Nilgiri South Slopes
  [76.54, 11.38], // Ooty / Mukurthi National Park
  [76.38, 11.50], // Naduvattam / Gudalur (Wayanad Border)
  [76.58, 11.60], // Mudumalai Tiger Reserve / Moyar Valley

  // 9. Northern Border with Karnataka & Andhra Pradesh
  [76.85, 11.68], // Moyar River Gorge / Sathyamangalam
  [77.00, 11.88], // Thalavadi Plateau / Hasanur
  [77.24, 11.98], // Biligirirangan Hills / Cauvery North Sanctuary
  [77.52, 12.05], // Pennagaram / Hogenakkal Border
  [77.62, 12.35], // Anchetti / Denkanikottai
  [77.82, 12.74], // Hosur / Bangalore Border
  [78.05, 12.82], // Bagalur / Berigai
  [78.25, 12.78], // Krishnagiri / Kuppam Border
  [78.48, 12.72], // Vaniyambadi / Tirupattur Hills
  [78.70, 12.85], // Ambur / Javadi Hills Foothills
  [78.88, 12.98], // Gudiyatham / Chittoor Border
  [79.12, 13.04], // Katpadi / Vellore North
  [79.35, 13.12], // Ranipet / Sholinghur
  [79.62, 13.22], // Arakkonam / Nagari Border
  [79.78, 13.38], // Tiruttani / Nagalapuram Hills
  [80.05, 13.48], // Uthukottai / Gummidipoondi
  [80.18, 13.55], // Pulicat Lake (Loop Closure)
];

// District centroids & key regions
export const DISTRICT_REGIONS = [
  { name: 'Chennai', lat: 13.08, lon: 80.27, code: 'CHN' },
  { name: 'Tiruvallur', lat: 13.14, lon: 79.91, code: 'TLR' },
  { name: 'Kanchipuram', lat: 12.83, lon: 79.70, code: 'KCH' },
  { name: 'Chengalpattu', lat: 12.68, lon: 79.98, code: 'CGP' },
  { name: 'Vellore', lat: 12.91, lon: 79.13, code: 'VEL' },
  { name: 'Ranipet', lat: 12.93, lon: 79.33, code: 'RPT' },
  { name: 'Tirupattur', lat: 12.49, lon: 78.57, code: 'TPT' },
  { name: 'Tiruvannamalai', lat: 12.22, lon: 79.07, code: 'TVM' },
  { name: 'Villupuram', lat: 11.94, lon: 79.49, code: 'VLP' },
  { name: 'Kallakurichi', lat: 11.73, lon: 78.96, code: 'KLK' },
  { name: 'Cuddalore', lat: 11.75, lon: 79.76, code: 'CDL' },
  { name: 'Salem', lat: 11.66, lon: 78.14, code: 'SLM' },
  { name: 'Namakkal', lat: 11.22, lon: 78.16, code: 'NMK' },
  { name: 'Dharmapuri', lat: 12.13, lon: 78.16, code: 'DPI' },
  { name: 'Krishnagiri', lat: 12.52, lon: 78.21, code: 'KRI' },
  { name: 'Erode', lat: 11.34, lon: 77.72, code: 'ERD' },
  { name: 'Tiruppur', lat: 11.10, lon: 77.34, code: 'TPR' },
  { name: 'Coimbatore', lat: 11.01, lon: 76.96, code: 'CBE' },
  { name: 'Nilgiris', lat: 11.41, lon: 76.70, code: 'NLG' },
  { name: 'Tiruchirappalli', lat: 10.79, lon: 78.70, code: 'TRY' },
  { name: 'Karur', lat: 10.96, lon: 78.08, code: 'KRR' },
  { name: 'Perambalur', lat: 11.23, lon: 78.88, code: 'PBL' },
  { name: 'Ariyalur', lat: 11.14, lon: 79.08, code: 'ALR' },
  { name: 'Thanjavur', lat: 10.78, lon: 79.14, code: 'TNJ' },
  { name: 'Tiruvarur', lat: 10.77, lon: 79.64, code: 'TVR' },
  { name: 'Nagapattinam', lat: 10.76, lon: 79.84, code: 'NGP' },
  { name: 'Mayiladuthurai', lat: 11.10, lon: 79.65, code: 'MYD' },
  { name: 'Pudukkottai', lat: 10.38, lon: 78.82, code: 'PDK' },
  { name: 'Dindigul', lat: 10.36, lon: 77.98, code: 'DGL' },
  { name: 'Madurai', lat: 9.92, lon: 78.12, code: 'MDU' },
  { name: 'Theni', lat: 10.01, lon: 77.47, code: 'THN' },
  { name: 'Virudhunagar', lat: 9.58, lon: 77.95, code: 'VDR' },
  { name: 'Sivaganga', lat: 9.84, lon: 78.48, code: 'SVG' },
  { name: 'Ramanathapuram', lat: 9.36, lon: 78.83, code: 'RMD' },
  { name: 'Thoothukudi', lat: 8.76, lon: 78.13, code: 'TKD' },
  { name: 'Tirunelveli', lat: 8.71, lon: 77.75, code: 'TNV' },
  { name: 'Tenkasi', lat: 8.95, lon: 77.31, code: 'TKS' },
  { name: 'Kanyakumari', lat: 8.08, lon: 77.53, code: 'KKI' },
];

/**
 * Coordinate mapping helper: Converts (lon, lat) to SVG canvas coordinate space (width x height)
 */
export function projectGeoToSvg(
  lon: number,
  lat: number,
  width: number,
  height: number,
  padding = 30
): { x: number; y: number } {
  const lonSpan = TN_BOUNDS.maxLon - TN_BOUNDS.minLon;
  const latSpan = TN_BOUNDS.maxLat - TN_BOUNDS.minLat;

  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  // X goes from minLon (left) to maxLon (right)
  const x = padding + ((lon - TN_BOUNDS.minLon) / lonSpan) * innerW;
  // Y goes from maxLat (top) to minLat (bottom)
  const y = padding + ((TN_BOUNDS.maxLat - lat) / latSpan) * innerH;

  return { x, y };
}
