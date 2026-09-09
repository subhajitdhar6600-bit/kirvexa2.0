import { useState } from "react";
import { Tractor, Calendar, MapPin, Clock, CheckCircle, User, Phone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import { useApp } from "@/context/AppContext.tsx";
import { toast } from "sonner";
import FormPreviewModal from "@/components/FormPreviewModal.tsx";
import { generateFormPdf } from "@/lib/pdfGenerator.ts";

const MACHINERY_OPTIONS = [
  "Tractor (45 HP)",
  "Rotavator",
  "Harvester (Combine)",
  "Power Tiller",
  "Seed Drill",
  "Sprayer (Boom)",
];

export default function MachineryBookingPage() {
  const { user, machineryBookings, addMachineryBooking, addNotification, checkKccPermission, isKccIssued, setIsKccAppModalOpen } = useApp();

  const [selectedMachine, setSelectedMachine] = useState<string>("Tractor (45 HP)");
  const [userName, setUserName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  });
  const [durationHours, setDurationHours] = useState("4");
  const [location, setLocation] = useState(() => {
    if (user?.village && user?.district) return `${user.village}, ${user.district}`;
    return user?.district ? `${user.district}, Bihar` : "";
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkKccPermission()) return;
    if (!userName.trim() || !phone.trim() || !location.trim()) {
      toast.error("Please fill in all required booking details.");
      return;
    }
    setShowPreview(true);
  };

  const handleConfirmSubmit = () => {
    setShowPreview(false);
    setLoading(true);

    setTimeout(() => {
      const refId = `MAC-${Math.floor(100000 + Math.random() * 900000)}`;

      // Generate PDF
      const { dataUrl, fileName } = generateFormPdf({
        formTitle: "Machinery Booking Request",
        referenceId: refId,
        userName,
        userPhone: phone,
        userRole: user?.role === "farmer" ? "Farmer" : "Dealer",
        details: {
          "Applicant Name": userName,
          "Contact Phone": phone,
          "Requested Equipment": selectedMachine,
          "Booking Date": bookingDate,
          "Duration Hours": `${durationHours} Hour(s)`,
          "Field Location": location,
        },
      });

      addMachineryBooking({
        userName,
        phone,
        machineryType: selectedMachine,
        bookingDate,
        durationHours: Number(durationHours) || 4,
        location,
      });

      // Send notification with PDF receipt
      addNotification(
        "Machinery Booking Request Submitted 🚜",
        `Your request for booking ${selectedMachine} has been registered (Ref: ${refId}). Download PDF receipt.`,
        "success",
        "/machinery-booking",
        "machinery",
        dataUrl,
        fileName
      );

      setLoading(false);
      toast.success("Machinery booking request submitted! Admin will allot machine soon.");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="relative h-36 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&q=80" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-3xl font-black" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              <span className="text-primary">Machinery</span> Booking
            </h1>
            <p className="text-gray-400 text-sm">Book tractors, harvesters and farm machinery instantly</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Booking Form & User Requests Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Booking Form */}
          <div className="lg:col-span-6 bg-[#111] border border-white/10 rounded-2xl p-6 h-fit">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Tractor className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Fill Booking Details</h2>
                <p className="text-xs text-gray-400">Admin will allot the nearest machine to your location</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label className="text-gray-300 text-xs mb-1.5 block">Selected Equipment</Label>
                <Select value={selectedMachine} onValueChange={setSelectedMachine}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white font-medium">
                    <SelectValue placeholder="Choose machinery" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                    {MACHINERY_OPTIONS.map((name) => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 text-xs mb-1.5 block">Your Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter full name"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300 text-xs mb-1.5 block">Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter 10-digit mobile"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 text-xs mb-1.5 block">Required Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300 text-xs mb-1.5 block">Duration (hours)</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      type="number"
                      value={durationHours}
                      onChange={(e) => setDurationHours(e.target.value)}
                      placeholder="e.g. 4"
                      className="pl-10 bg-white/5 border-white/10 text-white"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-gray-300 text-xs mb-1.5 block">Field Location / Village</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter village, district, landmark"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary text-black font-bold py-5 text-base hover:bg-primary/90 rounded-xl">
                Submit Booking Request →
              </Button>
            </form>
          </div>

          {/* User's Machinery Booking Requests Status */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> My Machinery Bookings & Allotments
              </h2>
              <span className="text-xs text-gray-400">{machineryBookings.length} Total</span>
            </div>

            {machineryBookings.length === 0 ? (
              <div className="bg-[#111] border border-white/10 rounded-2xl p-8 text-center text-gray-500">
                <Tractor className="h-10 w-10 text-gray-600 mx-auto mb-2" />
                <p className="text-sm font-semibold">No active machinery bookings yet.</p>
                <p className="text-xs text-gray-600 mt-1">Fill out the form on the left to request a machine allotment.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {machineryBookings.map((b) => (
                  <div key={b.id} className="bg-[#111] border border-white/10 rounded-2xl p-5 hover:border-primary/30 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-bold text-base text-white">{b.machineryType}</h3>
                        <p className="text-xs text-gray-400">{b.userName} · {b.phone}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                        b.status === "allotted"
                          ? "bg-primary/10 text-primary border-primary/30"
                          : b.status === "rejected"
                          ? "bg-red-500/10 text-red-400 border-red-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse"
                      }`}>
                        {b.status === "allotted" ? "✓ Machine Allotted" : b.status === "rejected" ? "Cancelled" : "Pending Allotment"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 bg-white/5 p-3 rounded-xl mb-3">
                      <div><span className="text-gray-500">Date:</span> {b.bookingDate}</div>
                      <div><span className="text-gray-500">Duration:</span> {b.durationHours} Hours</div>
                      <div className="col-span-2"><span className="text-gray-500">Location:</span> {b.location}</div>
                    </div>

                    {b.status === "allotted" && b.allottedMachineDetails && (
                      <div className="p-3 bg-primary/10 border border-primary/30 rounded-xl text-xs text-primary flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Allotment Details from Admin:</p>
                          <p className="text-white font-medium mt-0.5">{b.allottedMachineDetails}</p>
                        </div>
                      </div>
                    )}

                    {b.status === "pending" && (
                      <p className="text-[11px] text-amber-400/80 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> Your request is in queue. Admin will assign a machine and notify you shortly.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      <FormPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleConfirmSubmit}
        title="Machinery Booking Request Preview"
        data={{
          "Equipment Request": selectedMachine,
          "Operator/Applicant": userName,
          "Contact Phone": phone,
          "Required Date": bookingDate,
          "Booking Duration": `${durationHours} Hour(s)`,
          "Field Address": location,
        }}
        loading={loading}
      />

      <Footer />
    </div>
  );
}
