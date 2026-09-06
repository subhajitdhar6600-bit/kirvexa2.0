import { useState } from "react";
import { FlaskConical, CheckCircle, MapPin, Calendar, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext.tsx";
import FormPreviewModal from "@/components/FormPreviewModal.tsx";
import { generateFormPdf } from "@/lib/pdfGenerator.ts";

const PACKAGES = [
  { name: "Basic Soil Test", price: "₹299", tests: ["pH Level", "Nitrogen (N)", "Phosphorus (P)", "Potassium (K)"], popular: false },
  { name: "Standard Soil Test", price: "₹599", tests: ["pH Level", "N-P-K", "Organic Carbon", "Sulphur", "Zinc", "Iron"], popular: true },
  { name: "Premium Soil Test", price: "₹999", tests: ["All Standard Tests", "Boron", "Manganese", "Copper", "Micro-nutrients", "Fertilizer Recommendation"], popular: false },
];

const PROCESS = [
  { step: 1, title: "Book Test", desc: "Choose your package and book online" },
  { step: 2, title: "Sample Collection", desc: "Our expert collects soil sample from your field" },
  { step: 3, title: "Lab Analysis", desc: "Sample analyzed in certified laboratory" },
  { step: 4, title: "Get Report", desc: "Receive detailed report with recommendations" },
];

export default function SoilTestingPage() {
  const { user, addNotification } = useApp();
  const [selected, setSelected] = useState("Standard Soil Test");
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [crop, setCrop] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address || !date || !crop) {
      toast.error("Please fill in all details");
      return;
    }
    setShowPreview(true);
  };

  const handleConfirmSubmit = () => {
    setShowPreview(false);
    setLoading(true);

    setTimeout(() => {
      const refId = `SOIL-${Math.floor(100000 + Math.random() * 900000)}`;
      const selectedPkg = PACKAGES.find((p) => p.name === selected);

      // Generate PDF
      const { dataUrl, fileName } = generateFormPdf({
        formTitle: "Soil Testing Booking Receipt",
        referenceId: refId,
        userName: name,
        userPhone: phone,
        userRole: user?.role === "farmer" ? "Farmer" : "Dealer",
        details: {
          "Customer Name": name,
          "Contact Phone": phone,
          "Field Address": address,
          "Preferred Date": date,
          "Intended Crop": crop,
          "Chosen Package": selected,
          "Price Rate": selectedPkg?.price || "N/A",
        },
      });

      // Send notification with PDF receipt
      addNotification(
        "Soil Test Scheduled 🔬",
        `Your booking for ${selected} has been registered (Ref: ${refId}). Download PDF receipt.`,
        "success",
        "/soil-testing",
        "soil",
        dataUrl,
        fileName
      );

      setLoading(false);
      setName("");
      setPhone("");
      setAddress("");
      setDate("");
      setCrop("");
      toast.success("Soil test booked! Our expert will contact you shortly.");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="relative h-36 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-3xl font-black" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              <span className="text-primary">Soil</span> Testing
            </h1>
            <p className="text-gray-400 text-sm">Know your soil health and get personalized crop recommendations</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Process */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {PROCESS.map((p, i) => (
            <div key={p.step} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-bold text-primary">{p.step}</div>
                {i < PROCESS.length - 1 && <div className="hidden md:block w-px h-0" />}
              </div>
              <div>
                <div className="text-sm font-bold">{p.title}</div>
                <div className="text-xs text-gray-500">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Packages */}
        <h2 className="text-xl font-bold mb-5">Choose Your Package</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              onClick={() => setSelected(pkg.name)}
              className={`relative bg-[#111] border rounded-2xl p-5 cursor-pointer transition-all ${selected === pkg.name ? "border-primary" : "border-white/10 hover:border-primary/40"}`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>
              )}
              {selected === pkg.name && (
                <CheckCircle className="absolute top-4 right-4 h-5 w-5 text-primary" />
              )}
              <h3 className="font-bold mb-1">{pkg.name}</h3>
              <div className="text-2xl font-black text-primary mb-4" style={{ fontFamily: "Rajdhani, sans-serif" }}>{pkg.price}</div>
              <ul className="space-y-2">
                {pkg.tests.map((t) => (
                  <li key={t} className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle className="h-3 w-3 text-primary shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Booking Form */}
        <div className="max-w-xl mx-auto bg-[#111] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <FlaskConical className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Book Soil Test</h2>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
              </div>
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">Mobile Number</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Mobile number" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
              </div>
            </div>
            <div>
              <Label className="text-gray-300 text-sm mb-1.5 block">Village / Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Enter field location" className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">Preferred Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="pl-10 bg-white/5 border-white/10 text-white" />
                </div>
              </div>
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">Crop Type</Label>
                <Select value={crop} onValueChange={setCrop}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-gray-400">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10">
                    {["Wheat", "Paddy", "Soyabean", "Cotton", "Maize", "Other"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <div>
                <div className="text-xs font-semibold">Selected: {selected}</div>
                <div className="text-[11px] text-gray-500">{PACKAGES.find((p) => p.name === selected)?.price}</div>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-black font-bold py-5 text-base hover:bg-primary/90 rounded-xl">
              {loading ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting...</> : "Book Soil Test →"}
            </Button>
          </form>
        </div>
      </div>

      <FormPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleConfirmSubmit}
        title="Soil Test Booking Preview"
        data={{
          "Customer Name": name,
          "Contact Phone": phone,
          "Preferred Date": date,
          "Crop Cultivated": crop,
          "Address/Location": address,
          "Test Package": selected,
          "Estimated Cost": PACKAGES.find((p) => p.name === selected)?.price || "N/A"
        }}
        loading={loading}
      />

      <Footer />
    </div>
  );
}
