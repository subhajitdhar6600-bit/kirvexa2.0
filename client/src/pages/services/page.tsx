import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Bell, CheckCircle2, ArrowRight, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext.tsx";

const SERVICES = [
  { id:"doctor", emoji:"?????", title:"Doctor Visit", hindi:"?????? ?? ??? ???????? ?? ??????", action:"Book Now", bg:"bg-blue-50", border:"border-blue-100", titleColor:"text-blue-700", btnClass:"bg-blue-600 hover:bg-blue-700" },
  { id:"pesticide", emoji:"??", title:"Dava (Pesticide)", hindi:"???? ????? ?? ????????? ?? ?????", action:"Buy Now", bg:"bg-green-50", border:"border-green-100", titleColor:"text-green-700", btnClass:"bg-green-600 hover:bg-green-700" },
  { id:"weather", emoji:"???", title:"Weather Information", hindi:"???? ?? ???? ??????? ?? ??????", action:"Check Now", bg:"bg-sky-50", border:"border-sky-100", titleColor:"text-sky-700", btnClass:"bg-sky-500 hover:bg-sky-600" },
  { id:"soil", emoji:"??", title:"Soil Testing", hindi:"?????? ?? ???? ?? ??? ??? ?? ????", action:"Book Test", bg:"bg-amber-50", border:"border-amber-100", titleColor:"text-amber-700", btnClass:"bg-amber-600 hover:bg-amber-700" },
  { id:"tractor", emoji:"??", title:"Tractor Booking", hindi:"???????? ??? ???? - ?????, ???? ?? ??? ?? ???", action:"Book Tractor", bg:"bg-emerald-50", border:"border-emerald-100", titleColor:"text-emerald-700", btnClass:"bg-emerald-600 hover:bg-emerald-700" },
  { id:"labour", emoji:"??", title:"Labour Booking", hindi:"???? ?? ??? ????? ??? ????", action:"Book Labour", bg:"bg-orange-50", border:"border-orange-100", titleColor:"text-orange-700", btnClass:"bg-orange-600 hover:bg-orange-700" },
  { id:"land", emoji:"???", title:"Land Preparation", hindi:"??? ?? ?????? ?? ????? ?? ??? ??????", action:"Book Service", bg:"bg-violet-50", border:"border-violet-100", titleColor:"text-violet-700", btnClass:"bg-violet-600 hover:bg-violet-700" },
  { id:"agri", emoji:"??", title:"Agri Consultation", hindi:"???? ?????????? ?? ???? ?????? ?? ??????", action:"Get Advice", bg:"bg-teal-50", border:"border-teal-100", titleColor:"text-teal-700", btnClass:"bg-teal-600 hover:bg-teal-700" },
];

const ACTIVE_SERVICES = [
  { icon:"?????", title:"Doctor Visit", sub:"Dr. Suresh Kumar", detail:"25 May 2025 Â 10:30 AM", status:"Scheduled", statusColor:"text-blue-600 bg-blue-50 border-blue-200" },
  { icon:"??", title:"Soil Testing", sub:"Lab No. 7845", detail:"24 May 2025 Â 02:15 PM", status:"In Progress", statusColor:"text-amber-600 bg-amber-50 border-amber-200" },
  { icon:"??", title:"Tractor Booking", sub:"Mahindra 575 DI", detail:"26 May 2025 Â 08:00 AM", status:"Confirmed", statusColor:"text-emerald-700 bg-emerald-50 border-emerald-200" },
  { icon:"??", title:"Dava (Pesticide)", sub:"Bayer Insecticide", detail:"22 May 2025 Â 04:20 PM", status:"Delivered", statusColor:"text-violet-600 bg-violet-50 border-violet-200" },
];

const RECENT_REQUESTS = [
  { service:"Doctor Visit", date:"25 May 2025, 10:30 AM", status:"Scheduled", statusColor:"text-blue-600 bg-blue-50 border-blue-200" },
  { service:"Soil Testing", date:"24 May 2025, 02:15 PM", status:"In Progress", statusColor:"text-amber-600 bg-amber-50 border-amber-200" },
  { service:"Tractor Booking", date:"20 May 2025, 08:00 AM", status:"Completed", statusColor:"text-emerald-700 bg-emerald-50 border-emerald-200" },
];

const NAV_ITEMS = [
  { label:"Dashboard", href:"/dashboard", icon:"??" },
  { label:"My Farm", href:"/dashboard", icon:"??" },
  { label:"Market Prices", href:"/mandi-bhav", icon:"??" },
  { label:"Products", href:"/agri-market", icon:"??" },
  { label:"Services", href:"/services", icon:"??", active:true },
  { label:"Fasal Selling", href:"/sell-crops", icon:"??" },
  { label:"Credit & Wallet", href:"/wallet", icon:"??" },
  { label:"Reports", href:"/dashboard", icon:"??" },
  { label:"Support", href:"/help-center", icon:"??" },
  { label:"Settings", href:"/profile", icon:"??" },
];

export default function ServicesPage() {
  const { user } = useApp();
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">K</span>
            </div>
            <div>
              <p className="text-sm font-black text-gray-900">Krivexo</p>
              <p className="text-[10px] text-emerald-600 font-medium">Kheti ko Digital Saath</p>
            </div>
          </div>
        </div>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.name?.charAt(0) || "R"}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">{user?.name || "Ramesh Kumar"}</p>
              <p className="text-[10px] text-gray-400">Farmer ID: KR123456</p>
              <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">Premium</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {NAV_ITEMS.map((n, i) => (
            <Link key={i} to={n.href} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold mb-0.5 transition-colors ${n.active ? "bg-emerald-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}>
              <span className="text-sm">{n.icon}</span>{n.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-3 text-white">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><span className="text-sm">??</span></div>
              <div><p className="text-[10px] font-black leading-tight">Krivexo</p><p className="text-[9px] text-emerald-200">Kisan Card</p></div>
            </div>
            <p className="text-[9px] text-emerald-200 leading-tight mb-2">?? ????? ?? ????, ???? ?? ?????</p>
            <button className="w-full h-6 bg-white/20 hover:bg-white/30 rounded-lg text-[9px] font-bold text-white transition-colors">View Card Details</button>
          </div>
          <p className="text-center text-[9px] text-amber-600 font-bold italic mt-2">"Behtar Kheti Samriddh Kisan"</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 shrink-0">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for services, experts, or anything..." className="w-full h-9 pl-9 pr-4 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 outline-none focus:border-emerald-400" />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
              <Bell className="h-4 w-4" /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="h-8 px-3 text-[11px] border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">?? ?? ?</button>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-1.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-[10px] font-bold">{user?.name?.charAt(0) || "R"}</div>
              <div><p className="text-[11px] font-bold text-gray-800">{user?.name || "Ramesh Kumar"}</p><p className="text-[9px] text-gray-400">Farmer</p></div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex gap-5 items-start">
            {/* Left Column */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* Hero Banner */}
              <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 rounded-2xl p-6 relative overflow-hidden min-h-[140px] flex items-center">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
                  <div className="absolute bottom-0 right-0 w-64 h-full flex items-center justify-end pr-4 gap-2">
                    <div className="text-5xl opacity-60">??</div><div className="text-6xl opacity-70">??</div><div className="text-6xl opacity-60">??</div>
                  </div>
                  <div className="absolute top-3 right-24 text-5xl opacity-40">?????</div>
                </div>
                <div className="relative z-10">
                  <h1 className="text-2xl font-black text-white leading-tight">Krivexo Services</h1>
                  <p className="text-emerald-200 text-base font-bold mt-0.5">?? ?????? ?? ??????, ?? ?? ?????????? ??</p>
                  <p className="text-emerald-300 text-sm mt-0.5">???? ???, ???? ?????, ????? ??????</p>
                  <div className="flex items-center gap-3 mt-4">
                    {["? Expert Support","? Fast Service","?? Trusted Partner"].map((t,i)=>(
                      <div key={i} className="flex items-center gap-1.5 bg-white/20 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full">{t}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Services Grid */}
              <div>
                <p className="text-base font-black text-gray-900">Our Services</p>
                <p className="text-xs text-gray-500 mb-3">???? ?? ????? ??? ??????, ?? ?? ???</p>
                <div className="grid grid-cols-4 gap-3">
                  {SERVICES.map((s) => (
                    <div key={s.id} className={`${s.bg} ${s.border} border rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all group`}>
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{s.emoji}</div>
                      <p className={`text-xs font-black ${s.titleColor} mb-1`}>{s.title}</p>
                      <p className="text-[10px] text-gray-500 leading-tight mb-3">{s.hindi}</p>
                      <button onClick={() => toast.info(s.action)} className={`w-full h-7 rounded-xl ${s.btnClass} text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors`}>
                        {s.action} <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Requests + Benefits */}
              <div className="flex gap-4">
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-800">?? Recent Service Requests</p>
                    <button className="text-[11px] text-emerald-600 font-semibold hover:underline">View All ?</button>
                  </div>
                  <div className="grid grid-cols-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                    <span>Service</span><span>Date</span><span>Status</span>
                  </div>
                  {RECENT_REQUESTS.map((r,i) => (
                    <div key={i} className="grid grid-cols-3 py-2.5 items-center border-b border-gray-50 last:border-0">
                      <p className="text-[11px] font-semibold text-gray-800">{r.service}</p>
                      <p className="text-[10px] text-gray-500">{r.date}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${r.statusColor} text-[10px] font-semibold border w-fit`}>{r.status}</span>
                    </div>
                  ))}
                </div>
                <div className="w-56 shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <p className="text-xs font-bold text-gray-800 mb-3">Service Benefits</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon:"?????", label:"Expert Guidance", sub:"Anubhavi Vishesagya" },
                      { icon:"?", label:"Sahi Samay Par", sub:"Fast & Reliable" },
                      { icon:"?", label:"100% Trusted", sub:"Verified Partners" },
                      { icon:"??", label:"Digital Tracking", sub:"Har Step Par Update" },
                    ].map((b,i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-2 text-center">
                        <div className="text-2xl mb-1">{b.icon}</div>
                        <p className="text-[10px] font-bold text-gray-800 leading-tight">{b.label}</p>
                        <p className="text-[9px] text-gray-500">{b.sub}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-64 shrink-0 space-y-4">
              {/* Quick Access */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <p className="text-xs font-bold text-gray-800 mb-1">?? Quick Access</p>
                <p className="text-[10px] text-gray-400 mb-3">???? ??????, ????? ????</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon:"?????", label:"Doctor Visit", color:"bg-blue-50 border-blue-100 text-blue-700" },
                    { icon:"??", label:"Crop Advisory", color:"bg-green-50 border-green-100 text-green-700" },
                    { icon:"??", label:"Soil Testing", color:"bg-amber-50 border-amber-100 text-amber-700" },
                    { icon:"???", label:"Weather Info", color:"bg-sky-50 border-sky-100 text-sky-700" },
                  ].map((q,i) => (
                    <button key={i} onClick={() => toast.info(q.label)} className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border ${q.color} text-[10px] font-semibold hover:opacity-80 transition-opacity`}>
                      <span className="text-xl">{q.icon}</span>
                      <span className="text-center leading-tight">{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* My Active Services */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-800">My Active Services</p>
                  <button className="text-[11px] text-emerald-600 font-semibold hover:underline">View All ?</button>
                </div>
                <div className="space-y-2.5">
                  {ACTIVE_SERVICES.map((s,i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-base shrink-0">{s.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-gray-800 truncate">{s.title}</p>
                        <p className="text-[9px] text-gray-400 truncate">{s.sub}</p>
                        <p className="text-[9px] text-gray-400">{s.detail}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${s.statusColor} shrink-0 whitespace-nowrap`}>{s.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo */}
              <div className="bg-gradient-to-br from-emerald-700 to-teal-800 rounded-2xl p-4 relative overflow-hidden">
                <div className="absolute -bottom-4 -right-2 text-5xl opacity-40">?????</div>
                <div className="relative z-10">
                  <p className="text-white text-xs font-black leading-tight mb-1">Kheti ko Banaye<br />Aur Bhi Aasan</p>
                  <p className="text-emerald-200 text-[10px] mb-3">Krivexo Services ke saath!</p>
                  <button onClick={() => toast.info("Explore Now")} className="w-full h-7 rounded-xl bg-white text-emerald-700 text-[10px] font-bold flex items-center justify-center gap-1.5 hover:bg-gray-100">
                    Explore Now <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Chat */}
              <button onClick={() => toast.info("Opening chat...")} className="w-full flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl transition-colors">
                <MessageCircle className="h-4 w-4 shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold">Chat With Us</p>
                  <p className="text-[10px] text-emerald-200">Koi bhi Service Book karne mein pareshaan ho rahi hai?</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
