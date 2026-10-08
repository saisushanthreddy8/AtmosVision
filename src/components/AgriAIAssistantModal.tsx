import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  Sprout,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  RotateCcw,
  Thermometer,
  Droplets,
  Layers,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { CITIES_TAMIL_NADU } from '../data/cities';
import {
  DISTRICT_AGRO_PROFILES,
  TAMIL_NADU_12_MONTH_CROP_CALENDAR,
  getDistrictAgroProfile
} from '../data/districtAgroData';
import { LiveDistrictWeather } from '../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedDistrict?: string;
  suggestedCrops?: { name: string; tamilName: string; tip: string }[];
  weatherAlert?: string;
}

interface AgriAIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  liveDistrictData?: LiveDistrictWeather[];
}

const QUICK_PROMPTS = [
  '🌱 Best crops for Thanjavur this month?',
  '💧 Cotton irrigation & water management?',
  '⛰️ Nilgiris tea frost & hill crop protection?',
  '🌾 உளுந்து மற்றும் பயறு வகைகள் நடவு பருவம்?',
  '🧪 Best crops for Black Cotton Soil?'
];

export const AgriAIAssistantModal: React.FC<AgriAIAssistantModalProps> = ({
  isOpen,
  onClose,
  liveDistrictData = []
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Vanakkam! 🙏 I am your **Atmos Agri-AI Assistant**. Ask me anything about crop suggestions, sowing months, soil suitability, or weather impacts across all 38 districts of Tamil Nadu.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  // NLP Knowledge Matcher
  const processQuery = (query: string): ChatMessage => {
    const q = query.toLowerCase();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Detect District
    let matchedDistrict: string | null = null;
    for (const city of CITIES_TAMIL_NADU) {
      if (q.includes(city.district.toLowerCase()) || q.includes(city.name.toLowerCase())) {
        matchedDistrict = city.district;
        break;
      }
    }

    // 2. Detect Month
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const tamilMonths = ['thai', 'masi', 'panguni', 'chithirai', 'vaikasi', 'aani', 'aadi', 'avani', 'purattasi', 'aippasi', 'karthigai', 'margazhi', 'தை', 'மாசி', 'பங்குனி', 'சித்திரை', 'வைகாசி', 'ஆனி', 'ஆடி', 'ஆவணி', 'புரட்டாசி', 'ஐப்பசி', 'கார்த்திகை', 'மார்கழி'];

    let matchedMonthIdx = new Date().getMonth();
    for (let i = 0; i < months.length; i++) {
      if (q.includes(months[i]) || q.includes(tamilMonths[i]) || (tamilMonths[i + 12] && q.includes(tamilMonths[i + 12]))) {
        matchedMonthIdx = i;
        break;
      }
    }

    // 3. Detect Specific Crop
    const isPaddy = q.includes('paddy') || q.includes('rice') || q.includes('நெல்') || q.includes('samba') || q.includes('kuruvai');
    const isCotton = q.includes('cotton') || q.includes('பருத்தி') || q.includes('kapas');
    const isTurmeric = q.includes('turmeric') || q.includes('மஞ்சள்');
    const isBanana = q.includes('banana') || q.includes('வாழை');
    const isTea = q.includes('tea') || q.includes('தேயிலை') || q.includes('nilgiri');
    const isPulses = q.includes('pulse') || q.includes('urad') || q.includes('blackgram') || q.includes('gram') || q.includes('உளுந்து') || q.includes('பயறு');
    const isSoilQuery = q.includes('soil') || q.includes('மண்') || q.includes('clay') || q.includes('black') || q.includes('red') || q.includes('ph');

    const monthSchedule = TAMIL_NADU_12_MONTH_CROP_CALENDAR[matchedMonthIdx];
    const liveWeather = matchedDistrict ? liveDistrictData.find(d => d.district.toLowerCase() === matchedDistrict?.toLowerCase()) : null;

    // Response synthesis
    if (matchedDistrict) {
      const profile = getDistrictAgroProfile(matchedDistrict);
      const topCrops = profile.crops.map(c => ({ name: c.name, tamilName: c.tamilName, tip: c.agronomicTip }));

      let responseText = `Here is the agricultural advisory for **${matchedDistrict}** in **${monthSchedule.monthName} (${monthSchedule.tamilMonth})**:\n\n` +
        `• **Agro-Zone:** ${profile.agroZone}\n` +
        `• **Soil Type:** ${profile.soilType} (pH: ${profile.soilPh})\n` +
        (liveWeather ? `• **Current Weather:** ${liveWeather.tempC}°C, Humidity ${liveWeather.humidityPct}%\n\n` : '\n') +
        `🌱 **Recommended Sowing:** ${profile.crops.map(c => `${c.name} (${c.tamilName})`).join(', ')}.\n\n` +
        `💧 **Irrigation Advice:** ${monthSchedule.irrigationStrategy}\n` +
        `🛡️ **Crop Health:** ${monthSchedule.pestAndDiseaseAdvisory}`;

      return {
        id: Date.now().toString(),
        sender: 'assistant',
        text: responseText,
        timestamp: nowTime,
        suggestedDistrict: matchedDistrict,
        suggestedCrops: topCrops.slice(0, 3)
      };
    }

    if (isPaddy) {
      return {
        id: Date.now().toString(),
        sender: 'assistant',
        text: `🌾 **Paddy (நெல்) Cultivation Guide for Tamil Nadu:**\n\n` +
          `• **Key Seasons:** Kuruvai (Jun–Sep), Samba (Aug–Jan), Navarai (Dec–Apr).\n` +
          `• **Best Soil:** Deltaic alluvial clay and silty clay with high water holding capacity (Thanjavur, Tiruvarur, Mayiladuthurai, Tiruchirappalli).\n` +
          `• **Water Need:** Very High (Standing water 2-5 cm during vegetative phase).\n` +
          `• **Field Tip:** Apply Zinc Sulfate (25 kg/ha) basal to prevent Khaira deficiency. Adopt SRI (System of Rice Intensification) to save 30% water.`,
        timestamp: nowTime,
        suggestedCrops: [
          { name: 'Samba / Kuruvai Paddy', tamilName: 'நெல் (ADT 53 / CR 1009)', tip: 'Maintain water puddling and apply organic neem cake.' }
        ]
      };
    }

    if (isCotton) {
      return {
        id: Date.now().toString(),
        sender: 'assistant',
        text: `🌱 **Cotton (பருத்தி) Cultivation & Irrigation Advisory:**\n\n` +
          `• **Best Season:** Adipattam / Winter Irrigated (Aug – Feb).\n` +
          `• **Best Soil:** Deep Black Cotton Soil (Vertisols) in Coimbatore, Tiruppur, Salem, Virudhunagar, and Theni.\n` +
          `• **Water Need:** Moderate. Sensitive to waterlogging during seedling stage.\n` +
          `• **Field Tip:** Foliar spray of 1% DAP or Potassium Nitrate at 60 and 75 DAS prevents boll drop. Drip fertigation increases yield by 30%.`,
        timestamp: nowTime,
        suggestedCrops: [
          { name: 'Bt Cotton / Kapas', tamilName: 'பருத்தி', tip: 'Provide 1% DAP foliar spray to prevent square drop.' }
        ]
      };
    }

    if (isTea) {
      return {
        id: Date.now().toString(),
        sender: 'assistant',
        text: `🍵 **Highland Tea (தேயிலை) & Nilgiris Advice:**\n\n` +
          `• **Altitude & Soil:** Thrives above 1,200m in acidic lateritic forest loam (pH 4.5–5.5).\n` +
          `• **Temperature Window:** 12°C – 22°C with high ambient mist.\n` +
          `• **Frost Protection:** During cold December–January nights, maintain shade trees (Silver Oak) and light overhead sprinkler misting before sunrise to wash off night frost.`,
        timestamp: nowTime,
        suggestedCrops: [
          { name: 'Nilgiri Tea', tamilName: 'தேயிலை', tip: 'Contour planting across slopes prevents monsoon soil loss.' }
        ]
      };
    }

    if (isPulses) {
      return {
        id: Date.now().toString(),
        sender: 'assistant',
        text: `🌱 **Pulses (உளுந்து / பாசிப்பயறு) Fallow & Rainfed Guide:**\n\n` +
          `• **Best Window:** Rice fallow in Jan–March or Adipattam (Jul–Oct) in rainfed red loam.\n` +
          `• **Duration:** 65 – 75 days (Low water requirement).\n` +
          `• **Field Tip:** Broadcast seeds 4-6 days before paddy harvest into standing moisture. Seed treat with Rhizobium biofertilizer to fix 40 kg N/ha naturally.`,
        timestamp: nowTime,
        suggestedCrops: [
          { name: 'Rice Fallow Blackgram', tamilName: 'உளுந்து (VBN 8 / VBN 11)', tip: 'Treat seeds with Rhizobium culture.' }
        ]
      };
    }

    if (isSoilQuery) {
      return {
        id: Date.now().toString(),
        sender: 'assistant',
        text: `🧪 **Tamil Nadu Soil Pedology & Crop Match Guide:**\n\n` +
          `1. **Deltaic Alluvial Clay:** Deep fertile river silt in Cauvery delta $\\rightarrow$ Ideal for **Paddy, Sugarcane, Banana**.\n` +
          `2. **Black Cotton Soil (Vertisol):** High moisture retention in Western & Southern plains $\\rightarrow$ Ideal for **Cotton, Chillies, Millets**.\n` +
          `3. **Red Sandy Loam:** Well-drained soil in Salem, Dharmapuri, Namakkal $\\rightarrow$ Ideal for **Turmeric, Groundnut, Tapioca**.\n` +
          `4. **Acidic Hill Laterite:** Nilgiris & Kodaikanal $\\rightarrow$ Ideal for **Tea, Coffee, Hill Vegetables**.\n\n` +
          `Which district or crop are you planning to plant?`,
        timestamp: nowTime
      };
    }

    // Default general response for the current month
    return {
      id: Date.now().toString(),
      sender: 'assistant',
      text: `For **${monthSchedule.monthName} (${monthSchedule.tamilMonth})**, here are key guidelines across Tamil Nadu:\n\n` +
        `• **Current Season:** ${monthSchedule.seasonName} (${monthSchedule.seasonTamil})\n` +
        `• **Recommended Sowing:** ${monthSchedule.recommendedSowingCrops.slice(0, 4).map(c => `${c.name} (${c.tamilName})`).join(', ')}.\n` +
        `• **Ready for Harvest:** ${monthSchedule.harvestingCrops.join(', ')}.\n` +
        `• **Irrigation Strategy:** ${monthSchedule.irrigationStrategy}\n\n` +
        `💡 *Tip: You can ask for a specific district (e.g. "Crops for Madurai") or crop (e.g. "How to grow Turmeric?").*`,
      timestamp: nowTime,
      suggestedCrops: monthSchedule.recommendedSowingCrops.slice(0, 2).map(c => ({
        name: c.name,
        tamilName: c.tamilName,
        tip: c.description
      }))
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: nowTime
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = processQuery(text);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 600);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'Vanakkam! 🙏 I am your **Atmos Agri-AI Assistant**. Ask me anything about crop suggestions, sowing months, soil suitability, or weather impacts across all 38 districts of Tamil Nadu.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white border border-[#DDE5E1] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-[85vh] sm:h-[680px] overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-[#DDE5E1] bg-[#F8FAF9] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]">
                <Bot className="w-5 h-5" />
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] absolute -bottom-0.5 -right-0.5 border-2 border-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-[#17201C]">Atmos Agri-AI Assistant</h3>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#ECFDF5] text-[#047857] font-bold">
                  TNAU Rules Engine
                </span>
              </div>
              <p className="text-[11px] text-[#64706A]">
                Smart Weather & Crop Advisory Assistant (English / தமிழ்)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetChat}
              className="p-1.5 rounded-lg text-[#64706A] hover:text-[#17201C] hover:bg-[#E8F0EC] transition"
              title="Reset Chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#64706A] hover:text-[#17201C] hover:bg-[#E8F0EC] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-b border-[#DDE5E1] flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full bg-[#F8FAF9] hover:bg-[#ECFDF5] border border-[#DDE5E1] hover:border-[#A7F3D0] text-[11px] text-[#17201C] hover:text-[#047857] font-medium whitespace-nowrap transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-sans">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 shadow-xs ${
                    isUser
                      ? 'bg-[#059669] text-white rounded-tr-xs'
                      : 'bg-[#F8FAF9] text-[#17201C] border border-[#DDE5E1] rounded-tl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Optional Suggested Crop Cards */}
                  {msg.suggestedCrops && msg.suggestedCrops.length > 0 && (
                    <div className="pt-2 border-t border-[#DDE5E1]/60 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase text-[#059669]">
                        Recommended Varieties:
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {msg.suggestedCrops.map((c, cIdx) => (
                          <div
                            key={cIdx}
                            className="p-2 rounded-xl bg-white border border-[#DDE5E1] text-[11px] space-y-0.5"
                          >
                            <div className="flex items-center justify-between font-bold text-[#17201C]">
                              <span>{c.name}</span>
                              <span className="text-[#059669] text-[10px]">{c.tamilName}</span>
                            </div>
                            <p className="text-[10px] text-[#64706A]">{c.tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={`text-[9px] text-right font-mono ${isUser ? 'text-white/70' : 'text-[#64706A]'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-2.5 items-center text-xs text-[#64706A]">
              <div className="w-7 h-7 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] flex-shrink-0">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="p-3 rounded-2xl bg-[#F8FAF9] border border-[#DDE5E1] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-ping" />
                <span className="text-[11px] font-medium">Analyzing meteorological & soil database...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#DDE5E1] bg-white flex items-center gap-2 flex-shrink-0">
          <input
            type="text"
            placeholder="Ask about crops, districts, weather, or soil in Tamil Nadu..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            className="flex-1 bg-[#F8FAF9] border border-[#DDE5E1] rounded-2xl px-4 py-2.5 text-xs text-[#17201C] placeholder-[#64706A] focus:outline-none focus:border-[#059669] focus:bg-white transition"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] disabled:opacity-40 text-white transition shadow-xs flex-shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
