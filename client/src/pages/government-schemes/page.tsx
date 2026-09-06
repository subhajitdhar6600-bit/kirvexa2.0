import { useState } from "react";
import { ExternalLink, Search, IndianRupee, Users, Calendar, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";

const CATEGORIES = ["All", "Income Support", "Insurance", "Credit & Loans", "Irrigation", "Technology", "Market"];

const SCHEMES = [
  {
    name: "PM Kisan Samman Nidhi", category: "Income Support", ministry: "Ministry of Agriculture",
    benefit: "₹6,000 per year (₹2,000 every 4 months)", eligibility: "Small & marginal farmers with less than 2 hectares land",
    deadline: "Ongoing", status: "Active", link: "https://pmkisan.gov.in",
    desc: "Direct income support scheme for farmers. ₹6000 per year in 3 equal installments transferred directly to bank account.",
    color: "bg-green-500/10 border-green-500/20",
  },
  {
    name: "PM Fasal Bima Yojana", category: "Insurance", ministry: "Ministry of Agriculture",
    benefit: "Crop insurance at 2% premium for Kharif, 1.5% for Rabi", eligibility: "All farmers growing notified crops",
    deadline: "Per season", status: "Active", link: "https://pmfby.gov.in",
    desc: "Comprehensive crop insurance scheme to protect farmers against crop loss due to natural calamities, pests and diseases.",
    color: "bg-blue-500/10 border-blue-500/20",
  },
  {
    name: "Kisan Credit Card (KCC)", category: "Credit & Loans", ministry: "Ministry of Finance",
    benefit: "Short-term credit up to ₹3 Lakh at 4% interest", eligibility: "All farmers, sharecroppers & tenant farmers",
    deadline: "Ongoing", status: "Active", link: "#",
    desc: "Flexible credit facility for farmers to meet their agricultural and allied activities requirements without multiple bank visits.",
    color: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    name: "PM Krishi Sinchayee Yojana", category: "Irrigation", ministry: "Ministry of Jal Shakti",
    benefit: "Subsidy on drip & sprinkler irrigation systems", eligibility: "All farmers; SC/ST & small farmers get more subsidy",
    deadline: "Ongoing", status: "Active", link: "#",
    desc: "Har Khet Ko Pani, More Crop Per Drop. Focuses on end-to-end solutions for irrigation supply chain.",
    color: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    name: "Sub-Mission on Agricultural Mechanization", category: "Technology", ministry: "Ministry of Agriculture",
    benefit: "40–50% subsidy on farm machinery and equipment", eligibility: "All farmers; small & marginal get higher subsidy",
    deadline: "Ongoing", status: "Active", link: "#",
    desc: "Promotes farm mechanization by making modern farm equipment accessible to small farmers through custom hiring centers.",
    color: "bg-purple-500/10 border-purple-500/20",
  },
  {
    name: "eNAM (National Agriculture Market)", category: "Market", ministry: "Ministry of Agriculture",
    benefit: "Access to national market, better price discovery", eligibility: "Registered farmers with mandis",
    deadline: "Ongoing", status: "Active", link: "https://enam.gov.in",
    desc: "Pan-India electronic trading portal that networks existing APMC mandis to create a unified national market for agricultural commodities.",
    color: "bg-orange-500/10 border-orange-500/20",
  },
  {
    name: "Soil Health Card Scheme", category: "Technology", ministry: "Ministry of Agriculture",
    benefit: "Free soil testing and crop-wise fertilizer recommendations", eligibility: "All farmers across India",
    deadline: "Ongoing", status: "Active", link: "https://soilhealth.dac.gov.in",
    desc: "Provides farmers with soil health cards showing the nutrient status of their soil with recommendations on appropriate dosage of nutrients.",
    color: "bg-amber-500/10 border-amber-500/20",
  },
  {
    name: "PM Kisan Mandhan Yojana", category: "Income Support", ministry: "Ministry of Agriculture",
    benefit: "₹3,000/month pension after age 60", eligibility: "Small & marginal farmers aged 18–40 years",
    deadline: "Ongoing", status: "Active", link: "#",
    desc: "Old Age Pension scheme for farmers. Farmers contribute ₹55–200/month and government contributes equal amount for pension.",
    color: "bg-rose-500/10 border-rose-500/20",
  },
];

export default function GovernmentSchemesPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = SCHEMES.filter((s) => {
    const matchCat = category === "All" || s.category === category;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="relative h-36 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-3xl font-black" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              Government <span className="text-primary">Schemes</span>
            </h1>
            <p className="text-gray-400 text-sm">All central & state government schemes for farmers in one place</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input placeholder="Search schemes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white" />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${category === c ? "bg-primary text-black" : "bg-white/5 border border-white/10 text-gray-300 hover:border-primary/40"}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((scheme) => (
            <div key={scheme.name} className={`border rounded-2xl p-5 hover:border-primary/40 transition-colors ${scheme.color}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold">{scheme.name}</h3>
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">{scheme.status}</Badge>
                  </div>
                  <div className="text-xs text-gray-500">{scheme.ministry}</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{scheme.desc}</p>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-start gap-2">
                  <IndianRupee className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <div><span className="text-gray-500">Benefit: </span><span className="text-gray-200">{scheme.benefit}</span></div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <div><span className="text-gray-500">Eligibility: </span><span className="text-gray-200">{scheme.eligibility}</span></div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                  <div><span className="text-gray-500">Application: </span><span className="text-gray-200">{scheme.deadline}</span></div>
                </div>
              </div>
              <Button size="sm" className="bg-primary text-black font-semibold text-xs" onClick={() => scheme.link !== "#" && window.open(scheme.link, "_blank")}>
                <CheckCircle className="h-3 w-3 mr-1" /> Apply Now <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
