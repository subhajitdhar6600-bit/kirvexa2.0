import { useState } from "react";
import { Calendar, Leaf, Sun, CloudRain, Thermometer } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";

const SEASONS = ["All", "Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"];

const CROPS = [
  { name: "Paddy (Rice)", season: "Kharif (Monsoon)", sowing: "June–July", harvest: "October–November", duration: "120–150 days", water: "High", temp: "20–35°C", img: "🌾", states: "UP, Bihar, WB, Punjab" },
  { name: "Maize", season: "Kharif (Monsoon)", sowing: "June–July", harvest: "September–October", duration: "85–95 days", water: "Medium", temp: "21–27°C", img: "🌽", states: "UP, Bihar, Karnataka" },
  { name: "Soyabean", season: "Kharif (Monsoon)", sowing: "June–July", harvest: "October–November", duration: "90–120 days", water: "Medium", temp: "20–30°C", img: "🟡", states: "MP, Maharashtra, Rajasthan" },
  { name: "Cotton", season: "Kharif (Monsoon)", sowing: "April–May", harvest: "October–January", duration: "170–180 days", water: "Medium", temp: "25–35°C", img: "🌱", states: "Gujarat, Maharashtra, Telangana" },
  { name: "Wheat", season: "Rabi (Winter)", sowing: "October–December", harvest: "March–May", duration: "120–150 days", water: "Low-Medium", temp: "10–25°C", img: "🌾", states: "UP, Punjab, Haryana, MP" },
  { name: "Mustard", season: "Rabi (Winter)", sowing: "September–October", harvest: "February–March", duration: "110–140 days", water: "Low", temp: "10–25°C", img: "🌼", states: "Rajasthan, UP, Haryana" },
  { name: "Gram (Chickpea)", season: "Rabi (Winter)", sowing: "October–November", harvest: "February–March", duration: "90–110 days", water: "Low", temp: "15–25°C", img: "🟤", states: "MP, Rajasthan, Maharashtra" },
  { name: "Potato", season: "Rabi (Winter)", sowing: "October–November", harvest: "January–March", duration: "75–120 days", water: "High", temp: "15–20°C", img: "🥔", states: "UP, West Bengal, Bihar" },
  { name: "Watermelon", season: "Zaid (Summer)", sowing: "February–March", harvest: "April–June", duration: "85–95 days", water: "Medium", temp: "25–35°C", img: "🍉", states: "UP, Karnataka, AP" },
  { name: "Muskmelon", season: "Zaid (Summer)", sowing: "February–March", harvest: "May–June", duration: "80–90 days", water: "Medium", temp: "25–35°C", img: "🍈", states: "UP, Rajasthan, Gujarat" },
];

const waterColor = (level: string) =>
  level === "High" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
  level === "Medium" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
  "bg-green-500/20 text-green-400 border-green-500/30";

export default function CropCalendarPage() {
  const [season, setSeason] = useState("All");

  const filtered = CROPS.filter((c) => season === "All" || c.season === season);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="relative h-36 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-3xl font-black" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              <span className="text-primary">Crop</span> Calendar
            </h1>
            <p className="text-gray-400 text-sm">Sowing and harvesting guide for major crops across India</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 flex-wrap mb-8">
          {SEASONS.map((s) => (
            <button key={s} onClick={() => setSeason(s)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${season === s ? "bg-primary text-black" : "bg-white/5 border border-white/10 text-gray-300 hover:border-primary/40"}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((crop) => (
            <div key={crop.name} className="bg-[#111] border border-white/10 rounded-2xl p-5 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{crop.img}</div>
                <div>
                  <h3 className="font-bold">{crop.name}</h3>
                  <Badge className="text-[10px] bg-primary/20 text-primary border-primary/30">{crop.season}</Badge>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Sowing</span>
                  <span className="font-medium text-green-400">{crop.sowing}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5"><Leaf className="h-3.5 w-3.5" /> Harvest</span>
                  <span className="font-medium text-yellow-400">{crop.harvest}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5"><Sun className="h-3.5 w-3.5" /> Duration</span>
                  <span className="font-medium">{crop.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5"><Thermometer className="h-3.5 w-3.5" /> Temperature</span>
                  <span className="font-medium">{crop.temp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5"><CloudRain className="h-3.5 w-3.5" /> Water Need</span>
                  <Badge className={`text-[10px] ${waterColor(crop.water)}`}>{crop.water}</Badge>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="text-[11px] text-gray-500">Major States: <span className="text-gray-300">{crop.states}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
