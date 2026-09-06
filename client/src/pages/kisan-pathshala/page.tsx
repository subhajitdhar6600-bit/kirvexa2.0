import { useState } from "react";
import { Play, BookOpen, Leaf, Droplets, Bug, Sun, Sprout, Video, Search, GraduationCap } from "lucide-react";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import { useApp } from "@/context/AppContext.tsx";

const CATEGORIES = [
  { id: "all", label: "All Videos", icon: BookOpen },
  { id: "soil", label: "Soil & Fertilizer", icon: Leaf },
  { id: "water", label: "Water & Irrigation", icon: Droplets },
  { id: "pest", label: "Pest Control", icon: Bug },
  { id: "weather", label: "Seasonal Tips", icon: Sun },
  { id: "seeds", label: "Seeds & Sowing", icon: Sprout },
  { id: "government", label: "Govt Schemes", icon: GraduationCap },
];

const CAT_COLOR: Record<string, string> = {
  soil: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  water: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  pest: "text-red-400 bg-red-500/10 border-red-500/30",
  weather: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  seeds: "text-primary bg-primary/10 border-primary/30",
  government: "text-pink-400 bg-pink-500/10 border-pink-500/30",
  all: "text-gray-400 bg-white/5 border-white/10",
};

function getYoutubeId(url: string) {
  const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : null;
}

export default function KisanPathshalaPage() {
  const { pathshalaVideos } = useApp();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filtered = pathshalaVideos.filter(v => {
    const matchCat = activeCategory === "all" || v.category === activeCategory;
    const matchSearch = !searchQuery || v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <div className="relative h-44 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=80"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <Video className="h-5 w-5 text-red-400" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30">
                Free Expert Videos
              </div>
            </div>
            <h1 className="text-3xl font-black" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              Kisan <span className="text-primary">Pathshala</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Free expert farming videos curated by Krivexa — learn modern techniques, earn more.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6 max-w-xl">
          <Search className="h-4 w-4 text-gray-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search videos by title or topic..."
            className="bg-transparent text-sm text-white placeholder:text-gray-500 outline-none flex-1"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-primary text-black shadow-lg shadow-primary/20"
                    : "bg-white/5 border border-white/10 text-gray-300 hover:border-primary/40"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {cat.label}
              </button>
            );
          })}
        </div>

        {/* Video Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Video className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-400">No videos found</h3>
            <p className="text-gray-500 text-sm mt-1">Try a different category or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(video => {
              const ytId = getYoutubeId(video.youtubeUrl);
              const isPlaying = playingId === video.id;

              return (
                <div
                  key={video.id}
                  className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5 group"
                >
                  {/* Video Thumbnail / Player */}
                  <div className="relative aspect-video bg-black">
                    {isPlaying && ytId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    ) : (
                      <>
                        {ytId ? (
                          <img
                            src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white/5">
                            <Video className="h-12 w-12 text-red-400/50" />
                          </div>
                        )}
                        {/* Play Overlay */}
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 cursor-pointer transition-all"
                          onClick={() => setPlayingId(video.id)}
                        >
                          <div className="w-14 h-14 rounded-full bg-red-500/90 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-red-500/40 hover:scale-110 transition-transform">
                            <Play className="h-6 w-6 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                        {/* YouTube badge */}
                        <div className="absolute top-3 left-3">
                          <div className="flex items-center gap-1 bg-red-600 rounded-full px-2.5 py-1 text-[10px] font-bold text-white">
                            <Video className="h-3 w-3" /> YouTube
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <h3 className="font-bold text-sm text-white leading-snug flex-1">{video.title}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize shrink-0 ${CAT_COLOR[video.category] || CAT_COLOR.all}`}>
                        {video.category}
                      </span>
                    </div>

                    {video.description && (
                      <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">{video.description}</p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="text-[10px] text-gray-500">
                        Added {new Date(video.createdAt).toLocaleDateString("en-IN")}
                      </div>
                      <a
                        href={video.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 font-semibold"
                      >
                        <Video className="h-3 w-3" /> Watch on YouTube
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
