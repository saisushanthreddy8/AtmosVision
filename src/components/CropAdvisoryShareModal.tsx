import React, { useState } from 'react';
import {
  X,
  Printer,
  Share2,
  Copy,
  Check,
  Sprout,
  MapPin,
  Calendar,
  Droplets,
  ShieldCheck,
  Thermometer,
  Layers,
  Sparkles,
  Download
} from 'lucide-react';
import { CoordinateAgroMatch, MonthlyCropSchedule } from '../data/districtAgroData';
import { LiveDistrictWeather } from '../types';

interface CropAdvisoryShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  coordinateMatch: CoordinateAgroMatch;
  liveWeather?: LiveDistrictWeather | null;
  activeMonthSchedule: MonthlyCropSchedule;
}

export const CropAdvisoryShareModal: React.FC<CropAdvisoryShareModalProps> = ({
  isOpen,
  onClose,
  coordinateMatch,
  liveWeather,
  activeMonthSchedule
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Format WhatsApp message
  const generateWhatsAppMessage = () => {
    const cropsList = coordinateMatch.crops
      .slice(0, 4)
      .map((c) => `• *${c.name}* (${c.tamilName}) - Water: ${c.waterNeed}, Duration: ${c.yieldDurationDays}`)
      .join('\n');

    return (
      `🌾 *TAMIL NADU AGRI-WEATHER ADVISORY BULLETIN*\n` +
      `📍 *Location:* ${coordinateMatch.nearestDistrict} (${coordinateMatch.latitude.toFixed(2)}°N, ${coordinateMatch.longitude.toFixed(2)}°E)\n` +
      `🏔️ *Agro-Zone:* ${coordinateMatch.agroZone}\n` +
      `🧪 *Soil:* ${coordinateMatch.soilType} (pH: ${coordinateMatch.soilPh})\n` +
      (liveWeather ? `🌡️ *Live Weather:* ${liveWeather.tempC}°C | Humidity: ${liveWeather.humidityPct}%\n` : '') +
      `🗓️ *Season:* ${activeMonthSchedule.monthName} (${activeMonthSchedule.tamilMonth}) · ${activeMonthSchedule.seasonTamil}\n\n` +
      `🌱 *Recommended Sowing Crops:*\n${cropsList}\n\n` +
      `💧 *Irrigation Advisory:* ${activeMonthSchedule.irrigationStrategy}\n` +
      `🛡️ *Pest Management:* ${activeMonthSchedule.pestAndDiseaseAdvisory}\n\n` +
      `_Generated via AtmosVision AI Live Meteorological GIS_`
    );
  };

  const handleShareWhatsApp = () => {
    const text = generateWhatsAppMessage();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyText = () => {
    const text = generateWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-[#DDE5E1] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[#DDE5E1] flex items-center justify-between bg-[#F8FAF9] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center text-[#059669]">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#17201C]">
                Official Agricultural Advisory Bulletin
              </h3>
              <p className="text-[11px] text-[#64706A]">
                Printable Crop & Soil Summary Card for {coordinateMatch.nearestDistrict}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64706A] hover:text-[#17201C] hover:bg-[#E8F0EC] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Bulletin Card Content */}
        <div className="p-6 overflow-y-auto space-y-5 print:p-0" id="printable-advisory-card">
          
          {/* Bulletin Header Badge */}
          <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#059669] block">
                TAMIL NADU LIVE METEOROLOGICAL GIS NETWORK
              </span>
              <h2 className="text-lg font-black text-[#047857]">
                {coordinateMatch.nearestDistrict} Agro-Pedology Bulletin
              </h2>
              <div className="text-xs text-[#065F46] mt-0.5">
                GPS: {coordinateMatch.latitude.toFixed(3)}°N, {coordinateMatch.longitude.toFixed(3)}°E · Elevation: {coordinateMatch.estimatedElevationM}m ASL
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs px-3 py-1 rounded-full bg-white text-[#047857] font-bold border border-[#A7F3D0] inline-block">
                {activeMonthSchedule.monthName} ({activeMonthSchedule.tamilMonth})
              </span>
              <div className="text-[10px] text-[#065F46] font-semibold mt-1">
                {activeMonthSchedule.seasonTamil}
              </div>
            </div>
          </div>

          {/* Soil & Live Weather Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            {/* Soil Profile */}
            <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1] space-y-1.5">
              <div className="font-bold text-[#17201C] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#059669]" />
                <span>Soil & Terrain Profile</span>
              </div>
              <div className="space-y-0.5 text-[11px] text-[#64706A]">
                <div>Soil Type: <strong className="text-[#17201C]">{coordinateMatch.soilType}</strong></div>
                <div>Soil Reaction: <strong className="text-[#059669]">{coordinateMatch.soilPh}</strong></div>
                <div>Texture: <strong className="text-[#17201C]">{coordinateMatch.soilTexture}</strong></div>
                <div>Water Retention: <strong className="text-[#17201C]">{coordinateMatch.waterRetention}</strong></div>
              </div>
            </div>

            {/* Live Weather */}
            <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1] space-y-1.5">
              <div className="font-bold text-[#17201C] flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-[#059669]" />
                <span>Live Ground-Truth Telemetry</span>
              </div>
              {liveWeather ? (
                <div className="space-y-0.5 text-[11px] text-[#64706A]">
                  <div>Surface Temperature: <strong className="text-[#17201C]">{liveWeather.tempC}°C</strong></div>
                  <div>Relative Humidity: <strong className="text-[#17201C]">{liveWeather.humidityPct}%</strong></div>
                  <div>Wind Velocity: <strong className="text-[#17201C]">{liveWeather.windKmh} km/h</strong></div>
                  <div>Barometer: <strong className="text-[#17201C]">{liveWeather.pressureHpa} hPa</strong></div>
                </div>
              ) : (
                <div className="text-[11px] text-[#64706A]">Live station telemetry active.</div>
              )}
            </div>

          </div>

          {/* Recommended Sowing Crops */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#17201C] uppercase tracking-wider flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-[#059669]" />
              <span>Recommended Crops to Sow this Month ({activeMonthSchedule.monthName})</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {coordinateMatch.crops.slice(0, 4).map((crop, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-[#DDE5E1] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#17201C]">{crop.name}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#ECFDF5] text-[#047857] font-bold">
                      {crop.tamilName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#64706A]">
                    <span>💧 Water: <strong>{crop.waterNeed}</strong></span>
                    <span>⏳ Duration: <strong>{crop.yieldDurationDays}</strong></span>
                  </div>
                  <p className="text-[10px] text-[#065F46] bg-[#F0FDF4] p-1.5 rounded-lg border border-[#DCFCE7]">
                    💡 {crop.agronomicTip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Irrigation & Pest Management */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] space-y-1">
              <div className="font-bold text-[#0369A1] flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5" />
                <span>Irrigation Strategy</span>
              </div>
              <p className="text-[11px] text-[#0C4A6E] leading-relaxed">
                {activeMonthSchedule.irrigationStrategy}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] space-y-1">
              <div className="font-bold text-[#DC2626] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pest & Disease Advisory</span>
              </div>
              <p className="text-[11px] text-[#991B1B] leading-relaxed">
                {activeMonthSchedule.pestAndDiseaseAdvisory}
              </p>
            </div>
          </div>

          {/* Bulletin Footer */}
          <div className="pt-3 border-t border-[#DDE5E1] text-center text-[10px] text-[#64706A]">
            Official Tamil Nadu Agro-Ecological Guidance System · AtmosVision AI GIS Telemetry
          </div>

        </div>

        {/* Modal Bottom Action Controls */}
        <div className="p-4 border-t border-[#DDE5E1] bg-[#F8FAF9] flex flex-wrap items-center justify-between gap-2.5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#E8F0EC] border border-[#DDE5E1] text-[#17201C] text-xs font-bold transition shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-[#059669]" /> : <Copy className="w-4 h-4 text-[#64706A]" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold transition shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>Share to WhatsApp</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};
