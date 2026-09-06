import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Globe, ExternalLink, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import { toast } from "sonner";

const CONTACT_INFO = [
  { icon: Phone, label: "Phone", value: "+91 87087 42170", sub: "Mon–Sat, 9 AM – 6 PM" },
  { icon: Mail, label: "Email", value: "support@krivexa.com", sub: "We reply within 24 hours" },
  { icon: MapPin, label: "Address", value: "Kanpur, Uttar Pradesh", sub: "India – 208001" },
  { icon: Clock, label: "Working Hours", value: "9 AM – 6 PM", sub: "Monday to Saturday" },
];

const SUBJECTS = ["General Enquiry", "Technical Support", "Machinery Booking", "Expert Advice", "Soil Testing", "Mandi Prices", "Billing", "Other"];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", mobile: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We will get back to you within 24 hours.");
    setForm({ name: "", mobile: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Banner */}
      <div className="relative h-44 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] to-transparent flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-4xl font-black" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Home &gt; <span className="text-primary">Contact Us</span></p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left info */}
          <div className="space-y-5">
            <h2 className="text-2xl font-black" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              Get in <span className="text-primary">Touch</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Have a question or need help? Our team is always ready to assist you. Reach out through any of the channels below.
            </p>

            {CONTACT_INFO.map((info) => (
              <div key={info.label} className="flex items-start gap-4 bg-[#111] border border-white/10 rounded-xl p-4 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <info.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">{info.label}</div>
                  <div className="font-semibold text-sm">{info.value}</div>
                  <div className="text-xs text-gray-500">{info.sub}</div>
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="bg-[#111] border border-white/10 rounded-xl p-5">
              <div className="text-sm font-semibold mb-4">Follow Us</div>
              <div className="flex gap-3">
                {[
                  { Icon: Share2, label: "ig", color: "hover:bg-pink-600" },
                  { Icon: Globe, label: "web", color: "hover:bg-primary" },
                  { Icon: MessageSquare, label: "wa", color: "hover:bg-green-600" },
                  { Icon: ExternalLink, label: "yt", color: "hover:bg-red-600" },
                ].map((s) => (
                  <a key={s.label} href="#" className={`w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-400 ${s.color} hover:text-white transition-colors`}>
                    <s.Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-2xl p-7">
            <h2 className="text-xl font-bold mb-6">Send Us a <span className="text-primary">Message</span></h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">Full Name <span className="text-red-400">*</span></Label>
                  <Input
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">Mobile Number <span className="text-red-400">*</span></Label>
                  <Input
                    placeholder="+91 00000 00000"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">Email Address</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                />
              </div>
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">Subject <span className="text-red-400">*</span></Label>
                <Select onValueChange={(val) => setForm({ ...form, subject: val })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-gray-300">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10">
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">Message <span className="text-red-400">*</span></Label>
                <textarea
                  rows={5}
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-600 outline-none focus:border-primary/50 resize-none"
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-black font-bold py-5 text-base hover:bg-primary/90">
                <Send className="h-4 w-4 mr-2" /> Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-10 bg-[#111] border border-white/10 rounded-2xl overflow-hidden h-56 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-10 w-10 text-primary mx-auto mb-3" />
            <div className="font-bold">Kanpur, Uttar Pradesh, India</div>
            <div className="text-sm text-gray-500">Head Office Location</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
