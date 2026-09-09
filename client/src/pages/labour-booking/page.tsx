import { useState } from "react";
import { Users, MapPin, Calendar, Phone, CheckCircle2, Loader2, Bell, Clock } from "lucide-react";
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

export default function LabourBookingPage() {
  const { labourTypes, addLabourBooking, labourBookings, checkKccPermission, isKccIssued, setIsKccAppModalOpen, addNotification, user, t } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numDays, setNumDays] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({
    labourType: "",
    count: "",
    days: "",
    startDate: "",
    endDate: "",
    location: "",
    userName: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkKccPermission()) return;
    if (!form.labourType || !form.count || !form.days || !form.location || !form.userName || !form.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setShowPreview(true);
  };

  const handleConfirmSubmit = () => {
    setShowPreview(false);
    setLoading(true);

    setTimeout(() => {
      const refId = `LAB-${Math.floor(100000 + Math.random() * 900000)}`;

      // Generate PDF
      const { dataUrl, fileName } = generateFormPdf({
        formTitle: "Labour Booking Confirmation",
        referenceId: refId,
        userName: form.userName,
        userPhone: form.phone,
        userRole: user?.role === "farmer" ? "Farmer" : "Dealer",
        details: {
          "Client Name": form.userName,
          "Contact Phone": form.phone,
          "Labour Type Needed": form.labourType,
          "Number of Workers": `${form.count} Person(s)`,
          "Duration of Booking": `${form.days} Days`,
          "Start Date": form.startDate || "As soon as possible",
          "End Date": form.endDate || "N/A",
          "Work Location": form.location,
        },
      });

      addLabourBooking({
        userName: form.userName,
        phone: form.phone,
        labourType: form.labourType,
        count: parseInt(form.count),
        days: parseInt(form.days),
        startDate: form.startDate,
        endDate: form.endDate,
        location: form.location,
      });

      // Send notification with PDF receipt
      addNotification(
        "Labour Booking Requested 👷‍♂️",
        `Booking request for ${form.count} ${form.labourType} workers has been submitted (Ref: ${refId}). Download PDF receipt.`,
        "success",
        "/labour-booking",
        "labour",
        dataUrl,
        fileName
      );

      setLoading(false);
      setSubmitted(true);
      toast.success("Labour booking request submitted successfully!");
    }, 1000);
  };

  const userBookings = labourBookings.slice(0, 3); // show recent

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Header */}
      <div className="relative h-44 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&q=80" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] flex items-end px-6 pb-6">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-4xl font-black" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              <span className="text-primary">{t.labourBooking.title.split(" ")[0]}</span> {t.labourBooking.title.split(" ").slice(1).join(" ")}
            </h1>
            <p className="text-gray-400 text-sm mt-1">{t.labourBooking.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        {/* Booking Form */}
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{submitted ? t.labourBooking.submittedTitle : t.labourBooking.formHeader}</h2>
              <p className="text-xs text-gray-400">{t.labourBooking.formSubheader}</p>
            </div>
          </div>

          {submitted ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.labourBooking.submittedTitle}</h3>
              <p className="text-gray-400 text-sm mb-5">{t.labourBooking.submittedMsg}</p>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 text-amber-400 text-sm mb-5">
                <Clock className="h-4 w-4" /> {t.labourBooking.pendingBadge}
              </div>
              <div className="mt-4">
                <Button onClick={() => { setSubmitted(false); setForm({ labourType: "", count: "", days: "", startDate: "", endDate: "", location: "", userName: "", phone: "" }); setNumDays(""); }}
                  className="bg-primary text-black font-bold">{t.labourBooking.submitAnother}</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Labour Type */}
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">{t.labourBooking.labourType} *</Label>
                <Select onValueChange={(v) => setForm(f => ({ ...f, labourType: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-gray-300">
                    <SelectValue placeholder="Select labour type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10">
                    {labourTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Count & Days */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">{t.labourBooking.numLabours} *</Label>
                  <Input type="number" value={form.count} onChange={e => setForm(f => ({ ...f, count: e.target.value }))} placeholder="e.g. 5" min="1" className="bg-white/5 border-white/10 text-white" required />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">{t.labourBooking.numDays} *</Label>
                  <Input type="number" value={form.days} onChange={e => { setForm(f => ({ ...f, days: e.target.value })); setNumDays(e.target.value); }} placeholder="e.g. 3" min="1" className="bg-white/5 border-white/10 text-white" required />
                </div>
              </div>

              {/* Start & End Date (show end date only if days > 2) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">{t.labourBooking.startDate}</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="pl-10 bg-white/5 border-white/10 text-white" />
                  </div>
                </div>
                {parseInt(numDays) > 2 && (
                  <div>
                    <Label className="text-gray-300 text-sm mb-1.5 block">{t.labourBooking.endDate}</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="pl-10 bg-white/5 border-white/10 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">{t.labourBooking.location} *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Village / Field location" className="pl-10 bg-white/5 border-white/10 text-white" required />
                </div>
              </div>

              {/* Personal Info */}
              <div className="border-t border-white/10 pt-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300 text-sm mb-1.5 block">{t.labourBooking.name} *</Label>
                    <Input value={form.userName} onChange={e => setForm(f => ({ ...f, userName: e.target.value }))} placeholder="Your full name" className="bg-white/5 border-white/10 text-white" required />
                  </div>
                  <div>
                    <Label className="text-gray-300 text-sm mb-1.5 block">{t.labourBooking.phone} *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="10-digit number" className="pl-10 bg-white/5 border-white/10 text-white" required />
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-primary text-black font-bold py-5 text-base hover:bg-primary/90 rounded-xl">
                {loading ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting...</> : <><Users className="h-5 w-5 mr-2" />{t.labourBooking.submit}</>}
              </Button>
            </form>
          )}
        </div>

        {/* Assigned Labour Notifications */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">{t.labourBooking.assignedTitle}</h2>
          </div>
          {userBookings.filter(b => b.status === "assigned").length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">{t.labourBooking.noAssigned}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userBookings.filter(b => b.status === "assigned").map(b => (
                <div key={b.id} className="bg-white/5 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">{b.labourType}</p>
                    <span className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5">Assigned</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{b.count} workers · {b.days} days · {b.location}</p>
                  {b.assignedLabours && b.assignedLabours.map((l, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-3 mb-2">
                      <div>
                        <p className="text-sm font-semibold">{l.name}</p>
                        <p className="text-xs text-gray-400">{l.charges}</p>
                      </div>
                      <a href={`tel:${l.phone}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <Phone className="h-3 w-3" />{l.phone}
                      </a>
                    </div>
                  ))}
                  {b.adminNotes && <p className="text-xs text-amber-400 mt-2">Admin note: {b.adminNotes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <FormPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleConfirmSubmit}
        title="Labour Booking Preview"
        data={{
          "Client Name": form.userName,
          "Contact Phone": form.phone,
          "Labour Category": form.labourType,
          "Number of Workers": form.count,
          "Days Needed": form.days,
          "Start Date": form.startDate || "Immediate",
          "End Date": form.endDate || "N/A",
          "Service Location": form.location,
        }}
        loading={loading}
      />

      <Footer />
    </div>
  );
}
