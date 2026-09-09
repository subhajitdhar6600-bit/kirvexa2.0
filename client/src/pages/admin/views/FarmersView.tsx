import React, { useState } from "react";
import {
  Search, Plus, Edit2, Trash2, MoreHorizontal,
  ChevronLeft, ChevronRight, Filter, Download, RefreshCw,
  CheckCircle, XCircle, Clock, MapPin, Phone, Mail,
  Calendar, CreditCard, Eye, ArrowRight, Users,
  TrendingUp, UserCheck, UserX, UserPlus, SlidersHorizontal,
  ShieldCheck, Bell, Upload, X, FileText, User
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import type { Farmer } from "../types.ts";
import { toast } from "sonner";

interface FarmersViewProps {
  farmers: Farmer[];
  setFarmers: React.Dispatch<React.SetStateAction<Farmer[]>>;
}

export default function FarmersView({ farmers: propFarmers, setFarmers }: FarmersViewProps) {
  const farmers = propFarmers || [];
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(farmers[0] || null);
  const [viewingModalFarmer, setViewingModalFarmer] = useState<Farmer | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const filtered = farmers.filter((f) => {
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      (f.userId && f.userId.toLowerCase().includes(search.toLowerCase())) ||
      (f.fatherName && f.fatherName.toLowerCase().includes(search.toLowerCase())) ||
      (f.email && f.email.toLowerCase().includes(search.toLowerCase())) ||
      (f.gender && f.gender.toLowerCase().includes(search.toLowerCase())) ||
      (f.dob && f.dob.toLowerCase().includes(search.toLowerCase())) ||
      f.phone.includes(search) ||
      f.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || f.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paged = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const totalFarmers = farmers.length;
  const activeFarmers = farmers.filter(f => f.status === "active").length;
  const inactiveFarmers = farmers.filter(f => f.status === "suspended" || f.status === "inactive").length;
  const verifiedFarmers = farmers.filter(f => f.verified === "verified").length;

  const getStatusBadge = (status: string) => {
    if (status === "active") return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">Active</span>;
    if (status === "pending") return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">Pending</span>;
    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[11px] font-semibold">Inactive</span>;
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Farmers Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage all registered farmers and inspect complete profile details</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Dashboard</span><span className="text-gray-300">âº</span>
          <span>Farmers Management</span><span className="text-gray-300">âº</span>
          <span className="text-emerald-600 font-medium">All Farmers</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Farmers", value: totalFarmers.toString(), sub: "Registered in database", Icon: UserCheck, color: "text-emerald-600", light: "bg-emerald-50" },
          { label: "Active Farmers", value: activeFarmers.toString(), sub: `${totalFarmers > 0 ? Math.round((activeFarmers / totalFarmers) * 100) : 0}% active platform users`, Icon: CheckCircle, color: "text-blue-600", light: "bg-blue-50" },
          { label: "Inactive Farmers", value: inactiveFarmers.toString(), sub: "Pending or deactivated", Icon: UserX, color: "text-red-500", light: "bg-red-50" },
        ].map((s, i) => {
          const IconComp = s.Icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                <div className={`w-9 h-9 rounded-xl ${s.light} flex items-center justify-center`}>
                  <IconComp className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-[11px] text-gray-500 mt-1 font-medium">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Split layout: Table + Right Panel */}
      <div className="flex gap-4">
        {/* Table */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search by name, father name, mobile or id..."
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9 h-8 text-xs border-gray-200 bg-gray-50 rounded-xl"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-medium"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4 text-left w-8">#</th>
                  <th className="py-3 px-4 text-left">Farmer Details</th>
                  <th className="py-3 px-4 text-left">User ID</th>
                  <th className="py-3 px-4 text-left">Gender & DOB</th>
                  <th className="py-3 px-4 text-left">Mobile / Email</th>
                  <th className="py-3 px-4 text-left">State & District</th>
                  <th className="py-3 px-4 text-left">Occupation</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-400">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="font-semibold text-gray-600">No farmers found</p>
                      <p className="text-[11px] text-gray-400">Try changing your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  paged.map((f, idx) => (
                    <tr
                      key={f.id}
                      onClick={() => setSelectedFarmer(f)}
                      className={`cursor-pointer hover:bg-gray-50 transition-colors ${selectedFarmer?.id === f.id ? "bg-emerald-50/50" : ""}`}
                    >
                      <td className="py-3.5 px-4 text-gray-400 font-medium">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          {f.avatar ? (
                            <img src={f.avatar} alt="" className="w-8 h-8 rounded-xl object-cover border border-emerald-300" />
                          ) : (
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-xs shadow-2xs">
                              {f.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-900 leading-tight">{f.name}</p>
                            <p className="text-[10px] text-gray-400 font-mono">#{f.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-mono font-bold">
                          {f.userId || f.id || "â"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-gray-800 font-semibold">{f.gender || "â"}</p>
                        <p className="text-[10px] text-gray-400">{f.dob || "â"}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-gray-800 font-medium">{f.phone}</p>
                        <p className="text-[10px] text-emerald-700 font-medium truncate max-w-[140px]">{f.email || "â"}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-gray-800 font-medium">{f.district || "Patna"}</p>
                        <p className="text-[10px] text-gray-400">{f.state || "Bihar"}</p>
                      </td>
                      <td className="py-3.5 px-4 text-gray-700">{f.occupation || "Farmer"}</td>
                      <td className="py-3.5 px-4">{getStatusBadge(f.status)}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={e => { e.stopPropagation(); setViewingModalFarmer(f); }}
                            className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 cursor-pointer"
                            title="View Full Profile Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[11px] text-gray-500">
              Showing {filtered.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length} farmers
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold cursor-pointer ${
                    currentPage === p ? "bg-emerald-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Farmer Complete Registration Details */}
        {selectedFarmer && (
          <div className="w-80 space-y-4 shrink-0">
            {/* Farmer Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 relative">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Farmer Profile</p>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/30 text-emerald-100 text-[10px] font-bold border border-emerald-400/40 capitalize">
                    {selectedFarmer.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {selectedFarmer.avatar ? (
                    <img src={selectedFarmer.avatar} alt="" className="w-12 h-12 rounded-xl object-cover border-2 border-white/40 shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/40 flex items-center justify-center text-white font-bold text-base shadow-sm">
                      {selectedFarmer.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-bold text-sm leading-tight">{selectedFarmer.name}</h3>
                    <p className="text-emerald-200 text-[11px] font-mono">#{selectedFarmer.id}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 text-xs">
                <div className="space-y-2 pb-2 border-b border-gray-100">
                  <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Personal Information</p>
                  {[
                    { label: "Full Name", value: selectedFarmer.name },
                    { label: "User ID", value: selectedFarmer.userId || selectedFarmer.id || "â" },
                    { label: "Gender", value: selectedFarmer.gender || "â" },
                    { label: "Date of Birth", value: selectedFarmer.dob || "â" },
                    { label: "Occupation", value: selectedFarmer.occupation || "Farmer" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-start justify-between gap-2">
                      <span className="text-gray-400 shrink-0">{row.label}</span>
                      <span className="text-gray-800 font-semibold text-right truncate max-w-[150px]">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pb-2 border-b border-gray-100">
                  <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Contact & Address</p>
                  {[
                    { label: "Mobile No.", value: selectedFarmer.phone },
                    { label: "Email Address", value: selectedFarmer.email || "â" },
                    { label: "State", value: selectedFarmer.state || "Bihar" },
                    { label: "District", value: selectedFarmer.district || "Patna" },
                    { label: "Village", value: selectedFarmer.village || "â" },
                    { label: "Full Address", value: selectedFarmer.address || "â" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-start justify-between gap-2">
                      <span className="text-gray-400 shrink-0">{row.label}</span>
                      <span className="text-gray-800 font-semibold text-right truncate max-w-[150px]">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-gray-400 shrink-0">Joined On</span>
                    <span className="text-gray-800 font-semibold">{selectedFarmer.createdAt}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-gray-400 shrink-0">Status</span>
                    <span className="text-emerald-700 font-bold capitalize">{selectedFarmer.status}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setViewingModalFarmer(selectedFarmer)}
                  className="w-full mt-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" /> Inspect Full Profile Modal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FULL FARMER DETAILS MODAL */}
      {viewingModalFarmer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                {viewingModalFarmer.avatar ? (
                  <img src={viewingModalFarmer.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-white/40 shadow-sm" />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center text-white font-bold text-lg">
                    {viewingModalFarmer.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold leading-tight">{viewingModalFarmer.name}</h2>
                  <p className="text-xs text-emerald-200">Registered Farmer Account Profile â¢ User ID: {viewingModalFarmer.userId || viewingModalFarmer.id}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingModalFarmer(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
              {/* Card 1: Personal Registration Details */}
              <div className="bg-gray-50/70 rounded-2xl p-4 border border-gray-100 space-y-3">
                <h3 className="font-bold text-gray-800 text-xs flex items-center gap-1.5 border-b border-gray-200/60 pb-2">
                  <User className="h-4 w-4 text-emerald-600" /> Personal Registration Details
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">Full Name</span>
                    <span className="font-bold text-gray-800 text-xs">{viewingModalFarmer.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">User ID (Login ID)</span>
                    <span className="font-bold text-emerald-700 font-mono text-xs">{viewingModalFarmer.userId || viewingModalFarmer.id || "â"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">Gender</span>
                    <span className="font-bold text-gray-800 text-xs capitalize">{viewingModalFarmer.gender || "â"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">Date of Birth</span>
                    <span className="font-bold text-gray-800 text-xs">{viewingModalFarmer.dob || "â"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">Email Address</span>
                    <span className="font-bold text-emerald-700 text-xs">{viewingModalFarmer.email || "â"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">Account Status</span>
                    <span className="font-bold text-emerald-600 text-xs capitalize">{viewingModalFarmer.status}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Contact & Address Information */}
              <div className="bg-gray-50/70 rounded-2xl p-4 border border-gray-100 space-y-3">
                <h3 className="font-bold text-gray-800 text-xs flex items-center gap-1.5 border-b border-gray-200/60 pb-2">
                  <MapPin className="h-4 w-4 text-emerald-600" /> Contact & Residence Location
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">Mobile Number</span>
                    <span className="font-bold text-gray-800 text-xs">{viewingModalFarmer.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">Email Address</span>
                    <span className="font-bold text-gray-800 text-xs">{viewingModalFarmer.email || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">State</span>
                    <span className="font-bold text-gray-800 text-xs">{viewingModalFarmer.state || "Bihar"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">District</span>
                    <span className="font-bold text-gray-800 text-xs">{viewingModalFarmer.district || "Patna"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">Village / Panchayat</span>
                    <span className="font-bold text-gray-800 text-xs">{viewingModalFarmer.village || "â"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">Registration Date</span>
                    <span className="font-bold text-gray-800 text-xs">{viewingModalFarmer.createdAt}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <span className="text-gray-400 block text-[10.5px]">Full Residence Address</span>
                    <span className="font-medium text-gray-800 text-xs">{viewingModalFarmer.address || "â"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">Database Record ID: {viewingModalFarmer.id}</span>
              <Button
                onClick={() => setViewingModalFarmer(null)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2 rounded-xl cursor-pointer"
              >
                Close Full Details
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-[11px] text-gray-400">
        Â© 2026 Farma. All rights reserved. &nbsp; Real-time Bihar Farmers Database
      </div>
    </div>
  );
}
