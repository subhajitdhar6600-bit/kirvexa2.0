import { useState } from "react";
import {
  Search, Eye, MessageSquareText, Pencil, Trash2, X, AlertCircle, Clock,
  CheckCircle2, FileText, Filter, RotateCcw, User, ShieldCheck
} from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { api } from "@/services/api.ts";
import type { RequestItem } from "../types.ts";
import RequestDetailsView from "./RequestDetailsView.tsx";

interface RequestsViewProps {
  requests: RequestItem[];
  setRequests: React.Dispatch<React.SetStateAction<RequestItem[]>>;
}

export default function RequestsView({ requests, setRequests }: RequestsViewProps) {
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [editingRequest, setEditingRequest] = useState<RequestItem | null>(null);
  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Edit form state
  const [editStatus, setEditStatus] = useState<string>("new");
  const [editSubject, setEditSubject] = useState("");
  const [editPriority, setEditPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [editAssignedTo, setEditAssignedTo] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const filteredRequests = requests.filter((r) => {
    const matchSearch =
      r.subject.toLowerCase().includes(search.toLowerCase()) ||
      r.user.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || r.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  // KPI Metrics
  const totalCount = requests.length;
  const newCount = requests.filter(r => r.status === "new" || r.status === "pending").length;
  const inReviewCount = requests.filter(r => r.status === "in_review" || r.status === "assigned").length;
  const resolvedCount = requests.filter(r => r.status === "resolved" || r.status === "closed" || r.status === "allotted").length;

  const handleRequestChange = (updated: RequestItem) => {
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSelectedRequest(updated);
  };

  const handleOpenEditModal = (r: RequestItem) => {
    setEditingRequest(r);
    setEditStatus(r.status || "new");
    setEditSubject(r.subject || "");
    setEditPriority(r.priority || "Medium");
    setEditAssignedTo(r.assignedTo || "");
    setEditDescription(r.description || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRequest) return;

    setIsSubmitting(true);
    try {
      const targetId = editingRequest.id;
      const typeLower = editingRequest.type.toLowerCase();

      if (typeLower.includes("labour")) {
        await api.updateLabourBooking(targetId, { status: editStatus, adminNotes: editDescription });
      } else if (typeLower.includes("machinery")) {
        await api.updateMachineryBooking(targetId, { status: editStatus, adminNotes: editDescription });
      } else if (typeLower.includes("expert")) {
        await api.updateExpertQuery(targetId, editStatus, editDescription);
      }

      const updatedItem: RequestItem = {
        ...editingRequest,
        status: editStatus as any,
        subject: editSubject,
        priority: editPriority,
        assignedTo: editAssignedTo,
        description: editDescription,
      };

      setRequests((prev) => prev.map((r) => (r.id === targetId ? updatedItem : r)));
      toast.success(`Request ${targetId} updated successfully!`);
      setEditingRequest(null);
    } catch (err: any) {
      console.error("Error updating request:", err);
      toast.error(err.message || "Failed to update request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    setIsSubmitting(true);
    try {
      const target = requests.find((r) => r.id === id);
      const typeLower = (target?.type || "").toLowerCase();

      if (typeLower.includes("labour")) {
        await api.deleteLabourBooking(id);
      } else if (typeLower.includes("machinery")) {
        await api.deleteMachineryBooking(id);
      } else if (typeLower.includes("expert")) {
        await api.deleteExpertQuery(id);
      }

      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success(`Request ${id} deleted successfully from database!`);
      setDeletingRequestId(null);
    } catch (err: any) {
      console.error("Error deleting request:", err);
      toast.error(err.message || "Failed to delete request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (selectedRequest) {
    return (
      <RequestDetailsView
        request={selectedRequest}
        onRequestChange={handleRequestChange}
        onBack={() => setSelectedRequest(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Advisory &amp; Services Requests</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage farmer advisory queries, labour bookings, machinery requests, and service requisitions
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span>Dashboard</span>
          <span>›</span>
          <span className="text-emerald-600 font-semibold">Advisory &amp; Services</span>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-gray-500">Total Requests</p>
            <p className="text-xl font-black text-gray-900 mt-0.5">{totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-gray-500">New / Pending</p>
            <p className="text-xl font-black text-blue-600 mt-0.5">{newCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-gray-500">In Review / Assigned</p>
            <p className="text-xl font-black text-amber-600 mt-0.5">{inReviewCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-gray-500">Resolved &amp; Closed</p>
            <p className="text-xl font-black text-emerald-600 mt-0.5">{resolvedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-3.5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-emerald-500 transition-colors"
          >
            <option value="all">All Types</option>
            <option value="Expert Advice">Expert Advice</option>
            <option value="Labour Booking">Labour Booking</option>
            <option value="Machinery Booking">Machinery Booking</option>
            <option value="Product Request">Product Request</option>
            <option value="Contact Request">Contact Request</option>
            <option value="Support Request">Support Request</option>
            <option value="Requisition Request">Requisition Request</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-emerald-500 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="pending">Pending</option>
            <option value="in_review">In Review</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          {/* Search Input */}
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search request ID, subject, user..."
              className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 text-xs pl-9 h-9 rounded-xl focus:border-emerald-500"
            />
          </div>

          {(search || typeFilter !== "all" || statusFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
                setStatusFilter("all");
              }}
              className="text-xs text-gray-500 hover:text-emerald-700"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-semibold text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Req ID</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <MessageSquareText className="h-8 w-8 text-gray-300" />
                      <p className="text-sm font-bold text-gray-800">No Advisory &amp; Service Requests Found</p>
                      <p className="text-xs text-gray-400">There are currently no requests matching your filter or search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Req ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 text-[11px]">{r.id}</td>

                    {/* User */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold text-xs shrink-0">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900">{r.user}</div>
                          <div className="text-[10px] text-gray-400 font-medium">{r.userType || "Farmer"}</div>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium text-[11px]">
                        {r.type}
                      </span>
                    </td>

                    {/* Subject */}
                    <td className="py-3.5 px-4 font-medium text-gray-800 max-w-xs truncate">{r.subject}</td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">{r.date}</td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          r.status === "resolved" || r.status === "allotted"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : r.status === "in_review" || r.status === "assigned"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : r.status === "new" || r.status === "pending"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {(r.status || "new").replace("_", " ").toUpperCase()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Details */}
                        <button
                          onClick={() => setSelectedRequest(r)}
                          title="View Details"
                          className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Edit Request */}
                        <button
                          onClick={() => handleOpenEditModal(r)}
                          title="Edit Request"
                          className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        {/* Delete Request */}
                        <button
                          onClick={() => setDeletingRequestId(r.id)}
                          title="Delete Request"
                          className="w-8 h-8 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL DIALOG */}
      {editingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Edit Request #{editingRequest.id}</h3>
                <p className="text-xs text-gray-500">{editingRequest.type} • Submitted by {editingRequest.user}</p>
              </div>
              <button
                onClick={() => setEditingRequest(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Subject Title</label>
                <Input
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="bg-gray-50 border-gray-200 text-gray-900 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-emerald-500"
                  >
                    <option value="new">New</option>
                    <option value="pending">Pending</option>
                    <option value="in_review">In Review</option>
                    <option value="assigned">Assigned</option>
                    <option value="allotted">Allotted</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-emerald-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Assigned Officer / Expert</label>
                <Input
                  value={editAssignedTo}
                  onChange={(e) => setEditAssignedTo(e.target.value)}
                  placeholder="e.g. Dr. A. K. Verma (Agri Specialist)"
                  className="bg-gray-50 border-gray-200 text-gray-900 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Description &amp; Admin Notes</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl p-3 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditingRequest(null)}
                  className="text-xs text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  {isSubmitting ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL DIALOG */}
      {deletingRequestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Delete Request #{deletingRequestId}?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to permanently delete this request from MongoDB? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2 border-t border-gray-100">
              <Button
                variant="ghost"
                onClick={() => setDeletingRequestId(null)}
                className="text-xs text-gray-600 hover:text-gray-900"
              >
                Cancel
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={() => handleDeleteRequest(deletingRequestId)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2 rounded-xl cursor-pointer"
              >
                {isSubmitting ? "Deleting..." : "Delete Permanently"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
