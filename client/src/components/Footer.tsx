import { Link } from "react-router-dom";
import { Phone, Mail, Globe, MapPin, CreditCard, Wheat, Shield } from "lucide-react";
import { useApp } from "@/context/AppContext.tsx";

export default function Footer() {
  const year = new Date().getFullYear();
  const { t, setIsKccAppModalOpen, hasAppliedKcc } = useApp();

  const QUICK_LINKS = [
    { label: "Home", href: "/" },
    { label: "Mandi Bhav", href: "/mandi-bhav" },
    { label: "Buy Inputs", href: "/agri-market" },
    { label: "Sell Crops", href: "/sell-crops" },
    { label: "Machinery Booking", href: "/machinery-booking" },
    { label: "Labour Booking", href: "/labour-booking" },
    { label: "Expert Advice", href: "/expert-advice" },
  ];

  const RESOURCES_LINKS = [
    { label: "Blog", href: "/blog" },
    { label: "Crop Calendar", href: "/crop-calendar" },
    { label: "Government Schemes", href: "/government-schemes" },
    { label: "Weather News", href: "/weather" },
    { label: "Farming Tips", href: "/farming-tips" },
    { label: "Help Center", href: "/help-center" },
  ];

  const SERVICES_LINKS = [
    { label: "Mandi Bhav", href: "/mandi-bhav" },
    { label: "Buy Inputs", href: "/agri-market" },
    { label: "Sell Crops", href: "/sell-crops" },
    { label: "Machinery Booking", href: "/machinery-booking" },
    { label: "Soil Testing", href: "/soil-testing" },
    { label: "Weather Update", href: "/weather" },
    { label: "Kisan Wallet", href: "/wallet" },
  ];

  return (
    <footer className="relative text-sm overflow-hidden">
      {/* Gradient top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent" />
      <div className="absolute top-0 left-1/4 right-1/4 h-12 bg-primary/5 blur-2xl" />

      <div className="bg-linear-to-b from-[#0c0c0c] to-[#080808] relative">
        {/* KCC CTA Banner inside footer (Hidden once applied) */}
        {!hasAppliedKcc && (
          <div
            className="flex items-center justify-center gap-3 py-5 px-4 bg-linear-to-r from-amber-900/40 via-amber-800/30 to-amber-900/40 border-b border-amber-500/20 cursor-pointer group"
            onClick={() => setIsKccAppModalOpen(true)}
          >
            <CreditCard className="h-5 w-5 text-amber-400 shrink-0" />
            <div className="text-center">
              <p className="text-amber-300 font-bold text-sm">{t.nav.applyKcc}</p>
              <p className="text-amber-500/80 text-xs">Get instant credit & unlock all platform features</p>
            </div>
            <span className="text-amber-400 font-bold text-sm group-hover:translate-x-1 transition-transform">→</span>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
            
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Wheat className="h-5 w-5 text-primary" />
                </div>
                <span className="text-white font-bold text-xl tracking-widest" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                  KRIV<span className="text-primary">E</span>XA
                </span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-5 max-w-xs">
                {t.footer.tagline}
              </p>

              {/* Helpline */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
                <p className="text-primary text-xs font-bold mb-1">{t.footer.helpline}</p>
                <p className="text-white text-lg font-black" style={{ fontFamily: "Rajdhani, sans-serif" }}>+91 87087 42170</p>
                <p className="text-gray-500 text-xs">support@krivexa.com</p>
              </div>

              <div className="flex gap-3">
                {[
                  { l: "f", label: "Facebook" }, { l: "in", label: "Instagram" },
                  { l: "yt", label: "YouTube" }, { l: "tw", label: "Twitter" },
                ].map((s) => (
                  <a key={s.l} href="#" title={s.label}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black hover:border-primary transition-colors text-xs font-bold">
                    {s.l}
                  </a>
                ))}
              </div>
            </div>

            {/* 1. Quick Links */}
            <div className="lg:col-span-1">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm">
                <span className="w-1 h-4 bg-primary rounded-full inline-block" />
                Quick Links
              </h4>
              <ul className="space-y-2 text-gray-400 text-xs">
                {QUICK_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link to={item.href} className="hover:text-primary transition-colors hover:pl-1 inline-block">
                      → {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Resources */}
            <div className="lg:col-span-1">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm">
                <span className="w-1 h-4 bg-primary rounded-full inline-block" />
                Resources
              </h4>
              <ul className="space-y-2 text-gray-400 text-xs">
                {RESOURCES_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link to={item.href} className="hover:text-primary transition-colors hover:pl-1 inline-block">
                      → {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Services */}
            <div className="lg:col-span-1">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm">
                <span className="w-1 h-4 bg-primary rounded-full inline-block" />
                Services
              </h4>
              <ul className="space-y-2 text-gray-400 text-xs">
                {SERVICES_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link to={item.href} className="hover:text-primary transition-colors hover:pl-1 inline-block">
                      → {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & App */}
            <div className="lg:col-span-1">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm">
                <span className="w-1 h-4 bg-primary rounded-full inline-block" />
                Contact Us
              </h4>
              <ul className="space-y-2.5 text-gray-400 text-xs">
                <li className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>+91 87087 42170</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>support@krivexa.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>www.krivexa.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <span>{t.footer.address}</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 px-4 py-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-gray-600 text-xs">© {year} KRIVEXA. {t.footer.rights}</p>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <Link to="/admin" className="hover:text-primary flex items-center gap-1 transition-colors">
                <Shield className="h-3 w-3" /> Admin
              </Link>
              <a href="#" className="hover:text-primary transition-colors">{t.footer.privacyPolicy}</a>
              <a href="#" className="hover:text-primary transition-colors">{t.footer.termsConditions}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
