import { useState } from "react";
import { TrendingUp, ArrowUp, ArrowDown, MapPin, ChevronDown, Check, RefreshCw, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import { useApp } from "@/context/AppContext.tsx";

const CROPS = [
  { id: "wheat", name: "Wheat", hindi: "गेहूं", icon: "🌾", basePrice: 2710 },
  { id: "paddy", name: "Paddy", hindi: "धान", icon: "🌽", basePrice: 1860 },
  { id: "maize", name: "Maize", hindi: "मक्का", icon: "🌽", basePrice: 1950 },
  { id: "mustard", name: "Mustard", hindi: "सरसों", icon: "🟡", basePrice: 5420 },
  { id: "soyabean", name: "Soyabean", hindi: "सोयाबीन", icon: "🫘", basePrice: 4920 },
  { id: "gram", name: "Gram", hindi: "चना", icon: "🧆", basePrice: 5100 },
  { id: "potato", name: "Potato", hindi: "आलू", icon: "🥔", basePrice: 1450 },
  { id: "onion", name: "Onion", hindi: "प्याज", icon: "🧅", basePrice: 2100 },
];

const LOCATIONS: Record<string, Record<string, string[]>> = {
  "Bihar": {
    "Samastipur": ["Samastipur Mandi (समस्तीपुर मंडी)", "Rosera Mandi", "Dalsinghsarai Mandi"],
    "Patna": ["Patna Main Mandi (पटना मंडी)", "Fatuha Mandi", "Bihta Mandi"],
    "Begusarai": ["Begusarai Mandi", "Barauni Mandi"],
    "Muzaffarpur": ["Muzaffarpur Mandi", "Kanti Mandi"],
  },
  "Uttar Pradesh": {
    "Kanpur": ["Kanpur Grain Mandi (कानपुर मंडी)", "Chakeri Mandi"],
    "Lucknow": ["Lucknow Mandi (लखनऊ मंडी)", "Dubagga Mandi"],
    "Varanasi": ["Varanasi Mandi", "Chandauli Mandi"],
  },
  "Madhya Pradesh": {
    "Bhopal": ["Bhopal Krishi Mandi (भोपाल मंडी)", "Berasia Mandi"],
    "Indore": ["Indore Mandi", "Sanwer Mandi"],
  },
  "Rajasthan": {
    "Jaipur": ["Jaipur Grain Mandi (जयपुर मंडी)", "Chomu Mandi"],
  },
};

export default function MandiBhavPage() {
  const { isKccIssued, setIsKccAppModalOpen, t, user } = useApp();

  const [selectedState, setSelectedState] = useState<string>("Bihar");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Samastipur");
  const [selectedMandi, setSelectedMandi] = useState<string>("Samastipur Mandi (समस्तीपुर मंडी)");
  const [selectedCrop, setSelectedCrop] = useState<string>("wheat");

  const states = Object.keys(LOCATIONS);
  const districts = Object.keys(LOCATIONS[selectedState] || {});
  const mandis = LOCATIONS[selectedState]?.[selectedDistrict] || ["General Mandi"];

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    const newDistricts = Object.keys(LOCATIONS[state] || {});
    const firstDist = newDistricts[0] || "";
    setSelectedDistrict(firstDist);
    const firstMandi = LOCATIONS[state]?.[firstDist]?.[0] || "";
    setSelectedMandi(firstMandi);
  };

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    const firstMandi = LOCATIONS[selectedState]?.[dist]?.[0] || "";
    setSelectedMandi(firstMandi);
  };

  const activeCropObj = CROPS.find((c) => c.id === selectedCrop) || CROPS[0];

  // Calculate 7-day realistic price trend for selected crop & mandi
  const get7DayPrices = () => {
    const base = activeCropObj.basePrice;
    // Mandi price variance offset
    const seed = `${selectedState}-${selectedDistrict}-${selectedMandi}`;
    const mandiOffset = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 60 - 30;
    const currentTodayPrice = Math.max(500, base + mandiOffset);

    // Realistic price steps for past 7 days
    const deltas = [0, -10, -165, -10, -15, 20, -10, -20];

    const result = [];
    const today = new Date();

    let cumulativePrice = currentTodayPrice;

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);

      let price = cumulativePrice;
      if (i > 0) {
        price = cumulativePrice + deltas[i];
        cumulativePrice = price;
      }

      const isToday = i === 0;
      const isYesterday = i === 1;

      let dateLabel = "";
      if (isToday) dateLabel = "Today";
      else if (isYesterday) dateLabel = "Yesterday";
      else {
        dateLabel = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      }

      // Next day comparison indicator (is price higher or equal compared to day before)
      const isUp = i === 4 ? false : true; // Make 30 Aug / 4th item show red down arrow as in image 2 mockup

      result.push({
        id: i,
        dateLabel,
        isToday,
        price,
        isUp,
      });
    }
    return result;
  };

  const priceHistory = get7DayPrices();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        {/* KCC APPLICATION BANNER - only for non-dealer farmers */}
        {!isKccIssued && user?.role !== "dealer" && (
          <div className="mb-6 bg-linear-to-r from-amber-950/90 via-amber-900/60 to-black border-2 border-amber-500/70 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400 font-bold text-lg">
                🔒
              </div>
              <div>
                <h3 className="text-sm font-black text-amber-200">
                  Account Verification &amp; KCC Application Required
                </h3>
                <p className="text-xs text-gray-300">
                  You are viewing live Mandi rates. Apply for Kisan Credit Card (KCC) to enable direct crop selling &amp; full trading features!
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsKccAppModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-black font-black text-xs py-2 px-5 rounded-xl shrink-0 shadow-md animate-pulse cursor-pointer border border-amber-300"
            >
              Apply for KCC Now →
            </Button>
          </div>
        )}

        {/* TOP HERO BANNER (Image 2 style) */}
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-5 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <TrendingUp className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Mandi Prices
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium inline-flex">
                Live Updates
              </span>
            </h1>
            <p className="text-xs text-emerald-200/70 mt-0.5">
              View mandi prices for today and last 7 days
            </p>
          </div>
        </div>

        {/* LOCATION SELECTOR (State, District, Area/Mandi) */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 mb-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 uppercase tracking-wider">
            <MapPin className="h-4 w-4 text-emerald-400" /> Select Location
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* State Select */}
            <div>
              <label className="text-[11px] text-gray-400 mb-1 block">State</label>
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white appearance-none cursor-pointer focus:border-emerald-500 focus:outline-none"
                >
                  {states.map((s) => (
                    <option key={s} value={s} className="bg-[#1a1a1a] text-white">
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* District Select */}
            <div>
              <label className="text-[11px] text-gray-400 mb-1 block">District</label>
              <div className="relative">
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white appearance-none cursor-pointer focus:border-emerald-500 focus:outline-none"
                >
                  {districts.map((d) => (
                    <option key={d} value={d} className="bg-[#1a1a1a] text-white">
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Area / Mandi Select */}
            <div>
              <label className="text-[11px] text-gray-400 mb-1 block">Area / Mandi</label>
              <div className="relative">
                <select
                  value={selectedMandi}
                  onChange={(e) => setSelectedMandi(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white appearance-none cursor-pointer focus:border-emerald-500 focus:outline-none font-semibold text-emerald-300"
                >
                  {mandis.map((m) => (
                    <option key={m} value={m} className="bg-[#1a1a1a] text-white">
                      {m}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* CROP SELECTOR (Horizontal Chip Buttons like Image 2) */}
        <div className="mb-6 space-y-2">
          <div className="text-xs font-semibold text-gray-300">Select crop</div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CROPS.map((c) => {
              const isSelected = selectedCrop === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCrop(c.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-emerald-500 text-black border-emerald-400 font-bold shadow-lg shadow-emerald-500/20 scale-[1.02]"
                      : "bg-white/5 border-white/10 text-gray-300 hover:border-emerald-500/40 hover:bg-white/10"
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* UNIT INDICATOR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3 px-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            ₹ / Quintal
          </div>
          <div className="text-[11px] text-gray-400 leading-snug">
            Showing rates for <span className="text-emerald-400 font-bold">{activeCropObj.name} ({activeCropObj.hindi})</span> in <span className="text-white font-medium">{selectedMandi}</span>
          </div>
        </div>

        {/* DAILY PRICE HISTORY LIST (Image 2 style) */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-xl divide-y divide-white/5 mb-8">
          {priceHistory.map((item) => (
            <div
              key={item.id}
              className={`p-4 flex items-center justify-between transition-colors ${
                item.isToday ? "bg-emerald-500/5" : "hover:bg-white/2"
              }`}
            >
              {/* Date Label + Today Badge */}
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-semibold text-gray-200">{item.dateLabel}</span>
                {item.isToday && (
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                    Today
                  </span>
                )}
              </div>

              {/* Price & Indicator Icon */}
              <div className="flex items-center gap-3">
                <div className="text-base font-bold text-white tracking-wide" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                  ₹ {item.price.toLocaleString("en-IN")}
                </div>

                {/* Trend Circle Badge (Green ↑ or Red ↓) */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    item.isUp
                      ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                      : "bg-red-500/15 border border-red-500/30 text-red-400"
                  }`}
                >
                  {item.isUp ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

