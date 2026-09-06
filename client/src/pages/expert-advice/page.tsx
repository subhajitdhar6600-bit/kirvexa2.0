import { useState } from "react";
import { MessageSquare, Phone, Loader2, CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext.tsx";
import FormPreviewModal from "@/components/FormPreviewModal.tsx";
import { generateFormPdf } from "@/lib/pdfGenerator.ts";

const ADMIN_PHONE = "8708742170";

export default function ExpertAdvicePage() {
  const { addExpertQuery, checkKccPermission, isKccIssued, setIsKccAppModalOpen, addNotification, user, t } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({
    farmerName: "",
    phone: "",
    address: "",
    cropName: "",
    problemDetails: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkKccPermission()) return;
    if (!form.farmerName || !form.phone || !form.cropName || !form.problemDetails) {
      toast.error("Please fill all required fields.");
      return;
    }
    setShowPreview(true);
  };

  const handleConfirmSubmit = () => {
    setShowPreview(false);
    setLoading(true);

    setTimeout(() => {
      const refId = `EXP-${Math.floor(100000 + Math.random() * 900000)}`;

      // Generate PDF
      const { dataUrl, fileName } = generateFormPdf({
        formTitle: "Expert Advice Request",
        referenceId: refId,
        userName: form.farmerName,
        userPhone: form.phone,
        userRole: user?.role === "farmer" ? "Farmer" : "Dealer",
        details: {
          "Farmer Name": form.farmerName,
          "Contact Phone": form.phone,
          "Crop Name": form.cropName,
          "Problem Symptoms": form.problemDetails,
          "Farmer Address": form.address || "Not Specified",
        },
      });

      addExpertQuery({
        farmerName: form.farmerName,
        phone: form.phone,
        address: form.address,
        cropName: form.cropName,
        problemDetails: form.problemDetails,
      });

      // Send notification with PDF receipt
      addNotification(
        "Expert Query Received 🩺",
        `Your expert query regarding ${form.cropName} is logged (Ref: ${refId}). Download official PDF report.`,
        "success",
        "/expert-advice",
        "expert",
        dataUrl,
        fileName
      );

      setLoading(false);
      setSubmitted(true);
      toast.success("Expert query submitted successfully!");
    }, 1000);
  };

  const handleCall = () => {
    if (!checkKccPermission()) return;
    window.location.href = `tel:${ADMIN_PHONE}`;
  };

  const handleWhatsApp = () => {
    if (!checkKccPermission()) return;
    window.open(`https://wa.me/91${ADMIN_PHONE}?text=Hello, I need expert advice regarding my crops. Please assist me.`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Header */}
      <div className="relative h-44 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&q=80" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] flex items-end px-6 pb-6">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-4xl font-black" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              <span className="text-primary">{t.expertAdvice.title.split(" ")[0]}</span> {t.expertAdvice.title.split(" ").slice(1).join(" ")}
            </h1>
            <p className="text-gray-400 text-sm mt-1">{t.expertAdvice.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        {/* Instant Contact Options */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleCall}
            className="flex flex-col items-center gap-3 p-5 bg-primary/5 border border-primary/20 rounded-2xl hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone className="h-7 w-7 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-bold text-white">{t.expertAdvice.callAdmin}</p>
              <p className="text-xs text-gray-400 mt-0.5">+91 {ADMIN_PHONE}</p>
            </div>
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center gap-3 p-5 bg-green-500/5 border border-green-500/20 rounded-2xl hover:bg-green-500/10 hover:border-green-500/50 transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="h-7 w-7 text-green-400" />
            </div>
            <div className="text-center">
              <p className="font-bold text-white">{t.expertAdvice.whatsappAdmin}</p>
              <p className="text-xs text-gray-400 mt-0.5">Chat on WhatsApp</p>
            </div>
          </button>
        </div>

        {/* Expert Query Form */}
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{t.expertAdvice.formHeader}</h2>
              <p className="text-xs text-gray-400">{t.expertAdvice.formSubheader}</p>
            </div>
          </div>

          {submitted ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.expertAdvice.submittedTitle}</h3>
              <p className="text-gray-400 text-sm mb-4">{t.expertAdvice.submittedMsg}</p>
              <div className="bg-white/5 rounded-xl p-4 text-left text-sm text-gray-300 mb-5 space-y-1">
                <p>👤 <strong>Farmer:</strong> {form.farmerName}</p>
                <p>🌾 <strong>Crop:</strong> {form.cropName}</p>
                <p>📋 <strong>Problem:</strong> {form.problemDetails.substring(0, 80)}{form.problemDetails.length > 80 ? "..." : ""}</p>
              </div>
              <Button onClick={() => { setSubmitted(false); setForm({ farmerName: "", phone: "", address: "", cropName: "", problemDetails: "" }); }}
                className="bg-primary text-black font-bold">{t.expertAdvice.submitAnother}</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">{t.expertAdvice.farmerName} *</Label>
                  <Input value={form.farmerName} onChange={e => setForm(f => ({ ...f, farmerName: e.target.value }))} placeholder="Your full name" className="bg-white/5 border-white/10 text-white" required />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">{t.expertAdvice.phone} *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="10-digit number" className="pl-10 bg-white/5 border-white/10 text-white" required />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">{t.expertAdvice.address}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Village, District, State" className="pl-10 bg-white/5 border-white/10 text-white" />
                </div>
              </div>

              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">{t.expertAdvice.cropName} *</Label>
                <Input value={form.cropName} onChange={e => setForm(f => ({ ...f, cropName: e.target.value }))} placeholder="e.g. Wheat, Paddy, Cotton" className="bg-white/5 border-white/10 text-white" required />
              </div>

              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">{t.expertAdvice.problemDetails} *</Label>
                <textarea
                  value={form.problemDetails}
                  onChange={e => setForm(f => ({ ...f, problemDetails: e.target.value }))}
                  placeholder="Describe the symptoms, affected area, and anything else relevant..."
                  rows={4}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder:text-gray-600 text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-primary text-black font-bold py-5 text-base hover:bg-primary/90 rounded-xl">
                {loading ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting...</> : <><MessageSquare className="h-5 w-5 mr-2" />{t.expertAdvice.submit}</>}
              </Button>
            </form>
          )}
        </div>
      </div>

      <FormPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleConfirmSubmit}
        title="Expert Advice Request Preview"
        data={{
          "Farmer Name": form.farmerName,
          "Contact Phone": form.phone,
          "Farmer Address": form.address || "N/A",
          "Crop Affected": form.cropName,
          "Details of Problem": form.problemDetails,
        }}
        loading={loading}
      />

      <Footer />
    </div>
  );
}
