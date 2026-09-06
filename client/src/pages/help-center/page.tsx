import { useState } from "react";
import { Search, ChevronDown, ChevronUp, MessageSquare, Phone, Mail, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";

const TOPICS = ["All", "Account", "Mandi Bhav", "Machinery Booking", "Soil Testing", "Wallet", "Orders", "Technical"];

const FAQS = [
  { topic: "Account", q: "How do I register on Krivexa?", a: "Click the 'Register' button on the top right. Fill in your personal details including name, mobile number, address and state. You will receive an OTP on your mobile for verification." },
  { topic: "Account", q: "I forgot my password. How do I reset it?", a: "Go to the Login page and click 'Forgot Password'. Enter your registered mobile number and you'll receive an OTP to reset your password." },
  { topic: "Mandi Bhav", q: "How accurate are the mandi prices on Krivexa?", a: "Our mandi prices are sourced directly from AGMARKNET and updated multiple times daily. Prices are accurate as of the last update shown on the page." },
  { topic: "Mandi Bhav", q: "Which mandis are covered on Krivexa?", a: "We currently cover 500+ mandis across 20 states including UP, MP, Maharashtra, Punjab, Haryana, Bihar, Rajasthan, Gujarat and more." },
  { topic: "Machinery Booking", q: "How do I book a tractor on Krivexa?", a: "Go to Machinery Booking, select the equipment you need, choose your preferred date and duration, enter your location and submit the form. Our team will confirm within 2 hours." },
  { topic: "Machinery Booking", q: "Can I cancel a machinery booking?", a: "Yes, you can cancel a booking up to 24 hours before the scheduled date without any cancellation fee. Contact support if you need to cancel on short notice." },
  { topic: "Soil Testing", q: "How long does soil testing take?", a: "After sample collection, results are available within 5–7 working days. You will receive the report via SMS and on your Krivexa dashboard." },
  { topic: "Soil Testing", q: "What does a standard soil test include?", a: "Our standard test covers pH, N-P-K (Nitrogen, Phosphorus, Potassium), Organic Carbon, Sulphur, Zinc and Iron — all the key nutrients needed for crop planning." },
  { topic: "Wallet", q: "How do I add money to my Krivexa Wallet?", a: "Go to Wallet page and click 'Add Money'. You can choose a preset amount or enter a custom amount. We accept UPI, net banking and debit/credit cards." },
  { topic: "Wallet", q: "Is my money safe in the Krivexa Wallet?", a: "Yes. Krivexa Wallet is fully secured with bank-grade encryption. All transactions are monitored 24/7. Your money is insured up to ₹1 Lakh." },
  { topic: "Orders", q: "How do I track my order?", a: "Go to Dashboard > Recent Orders to see the status of all your orders. You will also receive SMS updates at every stage of your order." },
  { topic: "Technical", q: "The app is not loading. What should I do?", a: "Try refreshing the page or clearing your browser cache. If the issue persists, try a different browser or contact our support team at support@krivexa.com." },
];

export default function HelpCenterPage() {
  const [topic, setTopic] = useState("All");
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filtered = FAQS.filter((f) => {
    const matchTopic = topic === "All" || f.topic === topic;
    const matchSearch = f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
    return matchTopic && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="relative h-36 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80" alt="" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-3xl font-black" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              Help <span className="text-primary">Center</span>
            </h1>
            <p className="text-gray-400 text-sm">Find answers to your questions and get support</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Contact options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: MessageSquare, label: "Live Chat", desc: "Chat with our support team", action: "Start Chat" },
            { icon: Phone, label: "Call Support", desc: "+91 87087 42170", action: "Call Now" },
            { icon: Mail, label: "Email Support", desc: "support@krivexa.com", action: "Send Email" },
          ].map((c) => (
            <div key={c.label} className="bg-[#111] border border-white/10 rounded-2xl p-5 text-center hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                <c.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="font-bold mb-1">{c.label}</div>
              <div className="text-xs text-gray-500 mb-3">{c.desc}</div>
              <Button size="sm" className="bg-primary text-black font-semibold text-xs">{c.action}</Button>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input placeholder="Search for answers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white py-5" />
        </div>

        {/* Topics */}
        <div className="flex gap-2 flex-wrap mb-6">
          {TOPICS.map((t) => (
            <button key={t} onClick={() => setTopic(t)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${topic === t ? "bg-primary text-black" : "bg-white/5 border border-white/10 text-gray-300 hover:border-primary/40"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* FAQ accordion */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <HelpCircle className="h-10 w-10 mx-auto mb-3 text-gray-700" />
              <div>No results found. Try a different search or contact support.</div>
            </div>
          ) : (
            filtered.map((faq, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl overflow-hidden hover:border-primary/30 transition-colors">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full shrink-0">{faq.topic}</span>
                    <span className="text-sm font-semibold">{faq.q}</span>
                  </div>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 text-primary shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-500 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-gray-400 leading-relaxed border-t border-white/10 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
