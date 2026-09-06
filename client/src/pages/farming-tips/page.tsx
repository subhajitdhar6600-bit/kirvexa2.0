import { useState } from "react";
import { Leaf, Droplets, Bug, Sun, Sprout, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";

const CATEGORIES_TIPS = [
  { id: "all", label: "All Tips", icon: BookOpen },
  { id: "soil", label: "Soil Health", icon: Leaf },
  { id: "water", label: "Water Management", icon: Droplets },
  { id: "pest", label: "Pest Control", icon: Bug },
  { id: "weather", label: "Seasonal Tips", icon: Sun },
  { id: "seeds", label: "Seeds & Sowing", icon: Sprout },
];

const TIPS = [
  { category: "soil", title: "Test Your Soil Before Every Season", level: "Basic", desc: "Always get a soil test done before sowing. It tells you exactly which nutrients are lacking and how much fertilizer you need. This can save up to 20–30% on fertilizer costs.", steps: ["Collect soil from 8–10 spots in your field", "Mix them together and send 500g to a certified lab", "Apply fertilizers only as recommended in the report"] },
  { category: "water", title: "Use Drip Irrigation for Water Savings", level: "Intermediate", desc: "Drip irrigation delivers water directly to plant roots, reducing water use by 40–60% compared to flood irrigation while improving yield.", steps: ["Install drip lines along crop rows", "Set drip schedule based on crop need and weather", "Inspect lines weekly for clogging or leaks"] },
  { category: "pest", title: "Integrated Pest Management (IPM) Basics", level: "Intermediate", desc: "Combine biological, cultural, and chemical methods for sustainable pest control. IPM reduces pesticide costs by 25–40%.", steps: ["Monitor fields weekly for pest signs", "Use pheromone traps for early detection", "Apply pesticides only when pest count crosses threshold level"] },
  { category: "weather", title: "Pre-Monsoon Field Preparation", level: "Basic", desc: "Prepare your fields before the first rains to maximize water retention and reduce runoff and soil erosion.", steps: ["Deep plough fields in May–June before rains", "Create bunds to prevent water runoff", "Apply organic matter or FYM at 5 tonnes/acre"] },
  { category: "seeds", title: "Seed Treatment Before Sowing", level: "Basic", desc: "Treating seeds before sowing protects them from soil-borne diseases and improves germination by 15–20%.", steps: ["Soak seeds in Thiram or Carbendazim solution", "Dry treated seeds in shade for 30 minutes", "Sow within 24 hours of treatment for best results"] },
  { category: "soil", title: "Green Manuring to Improve Soil Fertility", level: "Intermediate", desc: "Growing crops like Dhaincha or Sunn Hemp and plowing them under adds nitrogen and organic matter, reducing chemical fertilizer needs.", steps: ["Sow Dhaincha at 20–25 kg/acre before kharif", "Allow to grow for 40–45 days", "Plow green crop into soil before flowering"] },
  { category: "water", title: "Rainwater Harvesting for Farm Ponds", level: "Advanced", desc: "Construct a farm pond to collect monsoon runoff. A 100×50 ft pond can store enough water for 1–2 irrigations in rabi season.", steps: ["Select lowest point in field for pond location", "Apply for government subsidy before construction", "Line pond with HDPE sheet to prevent water seepage"] },
  { category: "pest", title: "Natural Pest Control with Neem", level: "Basic", desc: "Neem-based pesticides are highly effective against 200+ pests and safe for beneficial insects, humans, and environment.", steps: ["Mix 5ml neem oil per litre of water", "Add few drops of soap solution as emulsifier", "Spray in evening or early morning for best results"] },
  { category: "weather", title: "Cold Wave Protection for Rabi Crops", level: "Intermediate", desc: "Frost and cold waves can damage wheat, potato, and vegetable crops. Timely protection can prevent 20–30% yield loss.", steps: ["Light irrigation the evening before expected frost", "Apply mulch around plant base to retain heat", "Use polythene covers for vegetables in severe cold"] },
];

export default function FarmingTipsPage() {
  const [active, setActive] = useState("all");

  const filtered = TIPS.filter((t) => active === "all" || t.category === active);

  const levelColor = (l: string) =>
    l === "Basic" ? "bg-green-500/20 text-green-400 border-green-500/30" :
    l === "Intermediate" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
    "bg-red-500/20 text-red-400 border-red-500/30";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="relative h-36 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-3xl font-black" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              Farming <span className="text-primary">Tips</span>
            </h1>
            <p className="text-gray-400 text-sm">Expert farming techniques to boost your crop yield and income</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES_TIPS.map((c) => {
            const Icon = c.icon;
            return (
              <button key={c.id} onClick={() => setActive(c.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${active === c.id ? "bg-primary text-black" : "bg-white/5 border border-white/10 text-gray-300 hover:border-primary/40"}`}>
                <Icon className="h-3.5 w-3.5" /> {c.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tip) => (
            <div key={tip.title} className="bg-[#111] border border-white/10 rounded-2xl p-5 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${levelColor(tip.level)}`}>{tip.level}</span>
              </div>
              <h3 className="font-bold mb-2 leading-snug">{tip.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{tip.desc}</p>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-primary mb-2">Steps to Follow:</div>
                {tip.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                    <div className="w-4 h-4 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 text-primary font-bold text-[10px] mt-0.5">{i + 1}</div>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
