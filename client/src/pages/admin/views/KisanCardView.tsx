import { useState } from "react";
import { CreditCard, Search, CheckCircle, XCircle, Clock, Plus, Eye, Check, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { useApp } from "@/context/AppContext.tsx";
import { toast } from "sonner";

export default function KisanCardView() {
  const { kccApplications, approveKccApplication, rejectKccApplication } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const filtered = kccApplications.filter((app) => {
    const matchSearch =
      app.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      app.phone?.includes(search) ||
      app.aadhaar?.includes(search) ||
      app.district?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const total = kccApplications.length;
  const pending = kccApplications.filter((a) => a.status === "pending").length;
  const approved = kccApplications.filter((a) => a.status === "approved").length;
  const rejected = kccApplications.filter((a) => a.status === "rejected").length;

  const handleApprove = (id: string) => {
    approveKccApplication(id);
    toast.success("KCC Application approved! Card number generated and account fully unlocked.");
    setSelectedApp(null);
  };

  const handleReject = (id: string) => {
    rejectKccApplication(id);
    toast.error("KCC Application rejected.");
    setSelectedApp(null);
  };

  const statusBadge: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div className="space-y-6 text-gray-800">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-gray-400 mb-1">Dashboard &gt; Krivexo Card &gt; Card Requests</div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-emerald-600" />
            Krivexo Kisan Card (KCC) Management
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Review incoming applications, issue official Kisan Credit Cards, and unlock features.
          </p>
        </div>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <div className="text-xs font-semibold text-gray-500">Total Applications</div>
          <div className="text-2xl font-black text-gray-900 mt-1">{total}</div>
          <div className="text-[11px] text-gray-400 mt-1">All time submissions</div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <div className="text-xs font-semibold text-amber-600">Pending Review</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{pending}</div>
          <div className="text-[11px] text-amber-600/80 mt-1">Requires admin approval</div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <div className="text-xs font-semibold text-emerald-600">Cards Issued / Approved</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{approved}</div>
          <div className="text-[11px] text-emerald-600/80 mt-1">Active cards in Bharat</div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
          <div className="text-xs font-semibold text-rose-600">Rejected</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{rejected}</div>
          <div className="text-[11px] text-rose-600/80 mt-1">Failed verification</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by farmer name, phone, district, or Aadhaar..."
            className="pl-9.5 pr-4 text-xs h-9.5 rounded-xl border-gray-200 bg-gray-50/60 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {(["all", "pending", "approved", "rejected"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors cursor-pointer ${
                statusFilter === st
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st} {st === "pending" && pending > 0 && `(${pending})`}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Contact &amp; District</th>
                <th className="py-3.5 px-4">Land &amp; Crop</th>
                <th className="py-3.5 px-4">Card Number</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No KCC applications found.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900">{app.fullName}</div>
                      <div className="text-[11px] text-gray-400 font-mono">
                        Aadhaar: {app.aadhaar ? `•••• ${app.aadhaar.slice(-4)}` : "Not provided"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-800">{app.phone}</div>
                      <div className="text-[11px] text-gray-400">{app.district || "Bihar"}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-800">{app.landSize || "N/A"} Acres</div>
                      <div className="text-[11px] text-gray-400">{(app as any).primaryCrop || "Agriculture"}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {app.cardNumber ? (
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg text-[11px]">
                          {app.cardNumber}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">Pending issuance</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${statusBadge[app.status] || "bg-gray-100 text-gray-600"}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedApp(app)}
                          className="h-7 text-xs text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> View
                        </Button>

                        {app.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(app.id)}
                              className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                            >
                              <Check className="h-3.5 w-3.5 mr-1" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleReject(app.id)}
                              className="h-7 text-xs text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details & Approval Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-gray-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-base text-gray-900">Application Details</h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-black p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-400 block mb-0.5">Full Name</span>
                <span className="font-bold text-gray-900">{selectedApp.fullName}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-400 block mb-0.5">Phone Number</span>
                <span className="font-bold text-gray-900">{selectedApp.phone}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-400 block mb-0.5">Aadhaar Number</span>
                <span className="font-mono font-bold text-gray-900">{selectedApp.aadhaar || "N/A"}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-400 block mb-0.5">District / State</span>
                <span className="font-bold text-gray-900">{selectedApp.district || "Bihar"}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-400 block mb-0.5">Land Size</span>
                <span className="font-bold text-gray-900">{selectedApp.landSize || "N/A"} Acres</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-400 block mb-0.5">Primary Crop</span>
                <span className="font-bold text-gray-900">{(selectedApp as any).primaryCrop || "Agriculture"}</span>
              </div>
            </div>

            {selectedApp.cardNumber && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                <span className="text-emerald-700 font-semibold block mb-0.5">Issued Card Number</span>
                <span className="font-mono font-extrabold text-emerald-900 text-sm">{selectedApp.cardNumber}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <Button variant="outline" onClick={() => setSelectedApp(null)} className="rounded-xl text-xs">
                Close
              </Button>
              {selectedApp.status === "pending" && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => handleReject(selectedApp.id)}
                    className="text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold"
                  >
                    Reject Application
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedApp.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                  >
                    Approve &amp; Issue Card
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

