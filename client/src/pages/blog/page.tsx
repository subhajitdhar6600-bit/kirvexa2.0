import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, Clock, Tag } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";

const CATEGORIES = ["All", "Crop Tips", "Market Insights", "Technology", "Government Schemes", "Weather", "Organic Farming"];

const POSTS = [
  {
    title: "How to Get Maximum Price for Your Wheat Crop This Season",
    category: "Market Insights", date: "18 Aug 2026", readTime: "5 min read",
    desc: "Learn the best strategies to sell your wheat at the highest mandi price this rabi season with expert tips.",
    img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80", tag: "Featured",
  },
  {
    title: "Soil Testing Guide: Why Every Farmer Must Test Their Soil",
    category: "Crop Tips", date: "15 Aug 2026", readTime: "7 min read",
    desc: "Understand how soil testing can dramatically improve your crop yield and save you money on fertilizers.",
    img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80", tag: "",
  },
  {
    title: "PM Kisan Samman Nidhi: How to Apply and Check Status",
    category: "Government Schemes", date: "12 Aug 2026", readTime: "4 min read",
    desc: "Complete step-by-step guide to applying for PM Kisan Samman Nidhi and receiving ₹6000 annually.",
    img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80", tag: "Popular",
  },
  {
    title: "Best Practices for Drip Irrigation in Cotton Farming",
    category: "Technology", date: "10 Aug 2026", readTime: "6 min read",
    desc: "Drip irrigation can save up to 50% water while increasing yield by 30%. Here's how to set it up.",
    img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80", tag: "",
  },
  {
    title: "Monsoon 2026: What Farmers Should Prepare For",
    category: "Weather", date: "8 Aug 2026", readTime: "3 min read",
    desc: "IMD forecasts above-normal rainfall in central India. Here's how to prepare your fields and crops.",
    img: "https://images.unsplash.com/photo-1504608524841-42584120d693?w=600&q=80", tag: "",
  },
  {
    title: "Organic Farming: Switching from Chemical to Natural Inputs",
    category: "Organic Farming", date: "5 Aug 2026", readTime: "8 min read",
    desc: "A complete guide to transitioning to organic farming and accessing premium organic markets.",
    img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80", tag: "",
  },
];

export default function BlogPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = POSTS.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="relative h-36 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-3xl font-black" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              <span className="text-primary">Krivexa</span> Blog
            </h1>
            <p className="text-gray-400 text-sm">Farming tips, market insights, and agricultural news</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white" />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${category === c ? "bg-primary text-black" : "bg-white/5 border border-white/10 text-gray-300 hover:border-primary/40"}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <div key={post.title} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-primary/40 transition-colors group cursor-pointer">
              <div className="relative h-44 overflow-hidden">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {post.tag && <Badge className="absolute top-2 left-2 bg-primary text-black text-[10px] font-bold">{post.tag}</Badge>}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-primary font-semibold flex items-center gap-1">
                    <Tag className="h-3 w-3" /> {post.category}
                  </span>
                  <span className="text-gray-600 text-xs">•</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {post.date}
                  </span>
                </div>
                <h3 className="font-bold mb-2 line-clamp-2 leading-snug">{post.title}</h3>
                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4">{post.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.readTime}
                  </span>
                  <button className="text-xs text-primary font-semibold hover:underline cursor-pointer">Read More →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
