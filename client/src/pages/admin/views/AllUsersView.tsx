import React, { useState } from "react";
import {
  Search, Plus, Edit2, Trash2, Eye, Filter, Download, ChevronLeft,
  ChevronRight, CheckCircle, XCircle, Clock, Users, UserCheck,
  Store, Wrench, Shield, SlidersHorizontal, RefreshCw, X, Loader2, Phone, Mail, MapPin, Calendar, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { toast } from "sonner";
import { api } from "@/services/api.ts";
import { formatDate } from "@/lib/dateUtils.ts";

interface AllUsersViewProps {
  farmers?: any[];
  dealers?: any[];
  rawUsers?: any[];
  onAddUser?: () => void;
  onEditUser?: (user: any) => void;
  onNavigate?: (tab: string) => void;
  onRefresh?: () => void;
}

const ROLE_COLORS: Record<string, string> = {
  Farmer: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Retailer: "bg-blue-100 text-blue-700 border-blue-200",
  "Service Provider": "bg-violet-100 text-violet-700 border-violet-200",
  Admin: "bg-amber-100 text-amber-700 border-amber-200",
  Dealer: "bg-orange-100 text-orange-700 border-orange-200",
};

export default function AllUsersView({
  farmers = [],
  dealers = [],
  rawUsers = [],
  onAddUser,
  onEditUser,
  onNavigate,
  onRefresh
}: AllUsersViewProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const rowsPerPage = 10;

  // Modals state
  const [viewingUser, setViewingUser] = useState<any | null>(null);
  const [deletingUser, setDeletingUser] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifyingUserId, setVerifyingUserId] = useState<string | null>(null);

  const handleToggleVerify = async (user: any) => {
    setVerifyingUserId(user.rawId);
    try {
      const nextStatus = !user.verified;
      await api.updateUser(user.rawId, {
        isVerified: nextStatus,
        verificationStatus: nextStatus ? "Verified" : "Pending",
      });
      toast.success(`User ${user.name} marked as ${nextStatus ? "Verified" : "Unverified"}!`);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update verification status");
    } finally {
      setVerifyingUserId(null);
    }
  };

  // Local state for instant optimistic updates
  const [localUsers, setLocalUsers] = useState<any[]>([]);

  // Construct dynamic users list
  const sourceList = rawUsers && rawUsers.length > 0 ? rawUsers : [
    ...farmers.map((f, idx) => ({ ...f, role: "farmer" })),
    ...dealers.map((d, idx) => ({ ...d, role: "dealer" })),
  ];

  const users = sourceList.map((u: any, idx: number) => {
    const rawId = u._id || u.id || `usr-${idx}`;
    const name = u.fullName || u.name || "User";
    const customUserId = u.userId || u.id || `USR${1000 + idx}`;
    const emailVal = (u.email && u.email !== "—" && !u.email.endsWith("@farma.local")) ? u.email : (u.email || "—");
    return {
      id: customUserId,
      userId: customUserId,
      rawId: rawId,
      name: name,
      role: (u.role || "Farmer").charAt(0).toUpperCase() + (u.role || "farmer").slice(1),
      phone: u.phone || "—",
      email: emailVal,
      gender: (u.gender && u.gender !== "—") ? u.gender : "—",
      dob: (u.dob && u.dob !== "—") ? u.dob : "—",
      address: u.address || "",
      location: [u.village, u.district, u.state].filter(Boolean).join(", ") || u.location || "Bihar, India",
      joinedOn: u.createdAt ? formatDate(u.createdAt) : "Recent",
      status: (u.status === "inactive" || u.isActive === false) ? "Inactive" : "Active",
      verified: u.isVerified === true || u.verificationStatus === "Verified" || u.verified === "verified" || u.verified === true,
      avatar: name.slice(0, 2).toUpperCase(),
      original: u,
    };
  });

  // Calculate live dynamic counts strictly from database
  const totalUsers = users.length;
  const totalFarmers = users.filter((u) => u.role === "Farmer").length;
  const totalRetailers = users.filter((u) => u.role === "Dealer" || u.role === "Retailer").length;
  const totalServiceProviders = users.filter((u) => u.role === "Service Provider").length;
  const totalAdmins = users.filter((u) => u.role === "Admin").length;

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role.toLowerCase().replace(/\s+/, "_") === roleFilter;
    const matchStatus = statusFilter === "all" || u.status.toLowerCase() === statusFilter;
    const matchVerified =
      verifiedFilter === "all" || (verifiedFilter === "verified" ? u.verified : !u.verified);
    return matchSearch && matchRole && matchStatus && matchVerified;
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  const paged = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const getStatusBadge = (status: string) => {
    if (status === "Active")
      return <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">Active</span>;
    if (status === "Pending")
      return <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">Pending</span>;
    return <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[11px] font-semibold">Inactive</span>;
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    setIsProcessing(true);
    try {
      await api.deleteUser(deletingUser.rawId);
      toast.success(`User ${deletingUser.name} deleted from database.`);
      setDeletingUser(null);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete user");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Users Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage all platform users directly from Farma database</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Dashboard</span>
          <span>›</span>
          <span>Users Management</span>
          <span>›</span>
          <span className="text-emerald-600 font-medium">All Users</span>
        </div>
      </div>

      {/* Real Live Stat Cards strictly computed from MongoDB with pure SVGs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: "Total Users", value: totalUsers.toLocaleString("en-IN"), sub: "Total registered", Icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Farmers", value: totalFarmers.toLocaleString("en-IN"), sub: "Registered farmers", Icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Retailers / Dealers", value: totalRetailers.toLocaleString("en-IN"), sub: "Verified dealers", Icon: Store, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Service Providers", value: totalServiceProviders.toLocaleString("en-IN"), sub: "Custom hiring centers", Icon: Wrench, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Admins", value: totalAdmins.toLocaleString("en-IN"), sub: "Super administrators", Icon: Shield, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((s, i) => {
          const IconComp = s.Icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-gray-500 font-medium leading-tight">{s.label}</p>
                <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center shadow-2xs`}>
                  <IconComp className={`h-4.5 w-4.5 ${s.color}`} />
                </div>
              </div>
              <p className="text-xl font-black text-gray-900">{s.value}</p>
              <p className={`text-[10px] ${s.color} mt-1 font-semibold`}>{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span>All Users</span>
              <Badge variant="outline" className="text-xs bg-gray-50 font-semibold">{filtered.length}</Badge>
            </h2>
            <div className="flex items-center gap-2">
              {onRefresh && (
                <Button
                  onClick={onRefresh}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-gray-200 text-gray-600 hover:bg-gray-50 gap-1 rounded-xl"
                  title="Refresh users from database"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </Button>
              )}
              <Button
                onClick={() => {
                  if (onAddUser) onAddUser();
                  else if (onNavigate) onNavigate("add_new_user");
                  else toast.info("Navigate to Add New User view");
                }}
                className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 rounded-xl font-semibold gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" /> Add New User
              </Button>
              <Button
                onClick={() => {
                  if (onNavigate) onNavigate("admin_users");
                }}
                className="h-8 bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 rounded-xl font-semibold gap-1.5 cursor-pointer shadow-sm"
              >
                <Shield className="h-3.5 w-3.5" /> + Add Admin User
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search by name, email or mobile..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9 h-8 text-xs border-gray-200 bg-gray-50 rounded-xl"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium cursor-pointer outline-none"
            >
              <option value="all">All Roles</option>
              <option value="farmer">Farmer</option>
              <option value="dealer">Dealer</option>
              <option value="service_provider">Service Provider</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium cursor-pointer outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={verifiedFilter}
              onChange={(e) => { setVerifiedFilter(e.target.value); setCurrentPage(1); }}
              className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium cursor-pointer outline-none"
            >
              <option value="all">All Verified</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
            {(search || roleFilter !== "all" || statusFilter !== "all" || verifiedFilter !== "all") && (
              <button
                onClick={() => { setSearch(""); setRoleFilter("all"); setStatusFilter("all"); setVerifiedFilter("all"); }}
                className="h-8 px-3 flex items-center gap-1.5 border border-red-200 text-red-600 rounded-xl bg-red-50 text-xs font-semibold hover:bg-red-100 cursor-pointer transition-colors"
              >
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 text-left w-8">#</th>
                <th className="py-3 px-4 text-left">User Details</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Mobile / Email</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Joined On</th>
                <th className="py-3 px-4 text-left">Verification</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold text-gray-600">No users found</p>
                    <p className="text-[11px] text-gray-400">Try changing your search or filter options</p>
                  </td>
                </tr>
              ) : (
                paged.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-gray-400 font-medium">
                      {(currentPage - 1) * rowsPerPage + idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-xs shadow-2xs">
                          {u.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-tight">{u.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">#{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${ROLE_COLORS[u.role] || "bg-gray-100 text-gray-600"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-gray-800 font-medium">{u.phone}</p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[150px]">{u.email}</p>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 truncate max-w-[140px]">{u.location}</td>
                    <td className="py-3.5 px-4 text-gray-600">{u.joinedOn}</td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={u.verified}
                        disabled={verifyingUserId === u.rawId}
                        onClick={() => handleToggleVerify(u)}
                        className="flex items-center gap-2 cursor-pointer group select-none py-1"
                        title={u.verified ? "Click to set as Not Verified" : "Click to set as Verified"}
                      >
                        {/* Interactive Toggle Switch */}
                        <div
                          className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
                            u.verified ? "bg-emerald-600" : "bg-gray-300 group-hover:bg-gray-400"
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                              u.verified ? "translate-x-4.5" : "translate-x-1"
                            }`}
                          />
                        </div>
                        {/* Toggle Label */}
                        <span
                          className={`text-xs font-semibold transition-colors ${
                            u.verified ? "text-emerald-700" : "text-gray-500"
                          }`}
                        >
                          {u.verified ? "Verified" : "Not Verified"}
                        </span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewingUser(u)}
                          title="View User Details"
                          className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 cursor-pointer transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (onEditUser) {
                              onEditUser(u);
                            } else {
                              setEditingUser({ ...u });
                            }
                          }}
                          title="Edit User"
                          className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-600 cursor-pointer transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingUser(u)}
                          title="Delete User"
                          className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 cursor-pointer transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-500">
            Showing {filtered.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * rowsPerPage, filtered.length)} of {totalUsers.toLocaleString()} users
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 text-xs rounded-xl"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
            </Button>
            <span className="text-xs font-semibold text-gray-700 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 text-xs rounded-xl"
            >
              Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* ─── 1. View User Details Modal ─── */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setViewingUser(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xl font-bold shadow-md">
                {viewingUser.avatar}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{viewingUser.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${ROLE_COLORS[viewingUser.role] || "bg-gray-100 text-gray-600"}`}>
                    {viewingUser.role}
                  </span>
                  <span className="text-xs font-mono text-gray-400">#{viewingUser.id}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">User ID (Login ID)</span>
                <span className="font-mono font-bold text-emerald-700">{viewingUser.userId || viewingUser.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Gender</span>
                <span className="font-semibold text-gray-900 capitalize">{viewingUser.gender || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Date of Birth</span>
                <span className="font-semibold text-gray-900">{viewingUser.dob || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-gray-400" /> Phone</span>
                <span className="font-semibold text-gray-900">{viewingUser.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-gray-400" /> Email</span>
                <span className="font-semibold text-gray-900">{viewingUser.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-gray-400" /> Location</span>
                <span className="font-semibold text-gray-900">{viewingUser.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-gray-400" /> Registered On</span>
                <span className="font-semibold text-gray-900">{viewingUser.joinedOn}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                <span>{getStatusBadge(viewingUser.status)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Verification</span>
                <span className={`font-bold flex items-center gap-1.5 ${viewingUser.verified ? "text-emerald-600" : "text-amber-600"}`}>
                  {viewingUser.verified ? (
                    <>
                      <span>Verified</span>
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </>
                  ) : (
                    <>
                      <span>Pending Verification</span>
                      <Clock className="h-4 w-4 text-amber-600" />
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button onClick={() => setViewingUser(null)} className="w-full bg-gray-900 text-white text-xs h-9 rounded-xl font-semibold cursor-pointer">
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}



      {/* ─── 3. Delete Confirmation Modal ─── */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Delete User Account?</h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Are you sure you want to delete <strong className="text-gray-800">{deletingUser.name}</strong> (#{deletingUser.id})? This action cannot be undone.
            </p>

            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                onClick={() => setDeletingUser(null)}
                className="h-9 text-xs rounded-xl font-semibold flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={isProcessing}
                className="h-9 bg-red-600 hover:bg-red-700 text-white text-xs rounded-xl font-semibold flex-1 gap-1 cursor-pointer shadow-sm"
              >
                {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
