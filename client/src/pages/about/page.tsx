import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Users, Target, Award, Leaf, TrendingUp, Shield, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";

const TEAM = [
  { name: "Rajiv Sharma", role: "Founder & CEO", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80", initials: "RS" },
  { name: "Priya Agarwal", role: "CTO & Co-Founder", img: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200&q=80", initials: "PA" },
  { name: "Suresh Verma", role: "Head of Agriculture", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80", initials: "SV" },
  { name: "Anita Mishra", role: "Head of Operations", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80", initials: "AM" },
];

const VALUES = [
  { icon: Leaf, title: "Farmer First", desc: "Every decision we make puts the farmer at the center. Their prosperity is our mission." },
  { icon: Shield, title: "Trust & Transparency", desc: "We believe in honest pricing, transparent operations, and building lasting relationships." },
  { icon: Zap, title: "Innovation", desc: "We use cutting-edge technology to solve age-old farming challenges in India." },
  { icon: Globe, title: "Inclusive Growth", desc: "We're committed to reaching every farmer, from small holdings to large farms across India." },
];

const MILESTONES = [
  { year: "2020", event: "Krivexa founded with a vision to digitize Indian agriculture" },
  { year: "2021", event: "Launched Mandi Bhav and Agri Market services across 5 states" },
  { year: "2022", event: "Reached 1 Lakh registered farmers; launched Expert Advice platform" },
  { year: "2023", event: "Expanded to 20 states; launched Machinery Booking and Soil Testing" },
  { year: "2024", event: "10L+ registered farmers; ₹500 Cr+ in transactions facilitated" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Banner */}
      <div className="relative h-44 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80" alt="" className="w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] to-transparent flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-4xl font-black" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              About <span className="text-primary">Krivexa</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Home &gt; <span className="text-primary">About Us</span></p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14 space-y-20">

        {/* Mission */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-5">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-primary text-sm font-medium">Our Mission</span>
            </div>
            <h2 className="text-4xl font-black mb-5 leading-tight" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              Empowering India's <span className="text-primary">140 Million Farmers</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Krivexa is a complete digital platform built for India's farming community. We believe every farmer deserves access to fair prices, modern technology, and expert guidance — regardless of where they live or how much land they own.
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
              From live mandi prices and machinery booking to soil testing and expert consultations, Krivexa puts the power of smart farming in every farmer's hands.
            </p>
            <Link to="/register">
              <Button className="bg-primary text-black font-bold hover:bg-primary/90">
                Join Krivexa Today →
              </Button>
            </Link>
          </div>
          <div className="relative rounded-2xl overflow-hidden h-72">
            <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=700&q=80" alt="Farming" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a]/60 to-transparent" />
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "10L+", label: "Registered Farmers" },
            { value: "500+", label: "Mandis Covered" },
            { value: "20+", label: "States" },
            { value: "₹500Cr+", label: "Transactions Facilitated" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-[#111] border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-3xl font-black text-primary mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>{s.value}</div>
              <div className="text-sm text-gray-400">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Values */}
        <div>
          <h2 className="text-3xl font-black text-center mb-10" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            Our <span className="text-primary">Values</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-primary/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="text-3xl font-black text-center mb-10" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            Our <span className="text-primary">Journey</span>
          </h2>
          <div className="relative border-l-2 border-primary/30 pl-8 space-y-8 max-w-3xl mx-auto">
            {MILESTONES.map((m, i) => (
              <motion.div key={m.year} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative">
                <div className="absolute left-[-2.8rem] w-8 h-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div className="bg-[#111] border border-white/10 rounded-xl p-4">
                  <div className="text-primary font-black text-lg mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>{m.year}</div>
                  <p className="text-gray-300 text-sm">{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-3xl font-black text-center mb-10" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            Our <span className="text-primary">Team</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden text-center hover:border-primary/40 transition-colors">
                <div className="h-48 overflow-hidden">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="p-4">
                  <div className="font-bold">{member.name}</div>
                  <div className="text-xs text-primary mt-1">{member.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-10 bg-linear-to-b from-transparent to-[#0d0d0d] rounded-3xl">
          <h2 className="text-3xl font-black mb-4" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            Ready to <span className="text-primary">Transform</span> Your Farm?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">Join over 10 lakh farmers who are already benefiting from Krivexa's smart farming platform.</p>
          <Link to="/register">
            <Button size="lg" className="bg-primary text-black font-bold px-10 hover:bg-primary/90">
              Register for Free →
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
