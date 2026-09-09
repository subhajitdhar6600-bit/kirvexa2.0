import { useState, useEffect } from "react";
import {
  Headphones, CheckCircle2, Clock, XCircle, Search, Filter,
  Download, Plus, MoreVertical, ChevronRight, Star, BookOpen,
  ShieldCheck, Phone, Mail, Pencil, Trash2, X
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface TicketItem {
  id: string;
  ticketNo: string;
  subject: string;
  user: string;
  phone: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdOn: string;
}

export default function SupportTicketsView() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<string>("All Tickets");
  const [search, setSearch] = useState("");

  // Create Ticket State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createSubject, setCreateSubject] = useState("");
  const [createUser, setCreateUser] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createCategory, setCreateCategory] = useState("Payments");
  const [createPriority, setCreatePriority] = useState<"High" | "Medium" | "Low">("Medium");

  // Edit / Delete State
  const [editingTicket, setEditingTicket] = useState<TicketItem | null>(null);
  const [deletingTicketId, setDeletingTicketId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editStatus, setEditStatus] = useState<"Open" | "In Progress" | "Resolved" | "Closed">("Open");
  const [editSubject, setEditSubject] = useState("");

  const loadTickets = async () => {
    setLoading(true);
    try {
      const expertRes = await api.getExpertQueries();
      const list: TicketItem[] = [];

      if (Array.isArray(expertRes)) {
        expertRes.forEach((e: any, idx: number) => {
          list.push({
            id: e.id || `TKT-${100 + idx}`,
            ticketNo: e.id || `TKT-2026-${100 + idx}`,
            subject: e.problemDetails || `${e.cropName || "Crop"} Advisory Query`,
            user: e.farmerName || "Farmer Customer",
            phone: e.phone || "â",
            category: "Agri Advisory",
            priority: "High",
            status: e.status === "resolved" ? "Resolved" : "Open",
            createdOn: e.createdAt ? new Date(e.createdAt).toLocaleDateString("en-IN") : "Today",
          });
        });
      }

      setTickets(list);
    } catch (err) {
      console.error("Error loading tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const filteredTickets = tickets.filter((t) => {
    const matchSearch =
      t.ticketNo.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.user.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());

    const matchTab =
      activeTab === "All Tickets" ||
      (activeTab === "Open" && t.status === "Open") ||
      (activeTab === "In Progress" && t.status === "In Progress") ||
      (activeTab === "Resolved" && t.status === "Resolved") ||
      (activeTab === "Closed" && t.status === "Closed");

    return matchSearch && matchTab;
  });

  const openCount = tickets.filter(t => t.status === "Open").length;
  const inProgressCount = tickets.filter(t => t.status === "In Progress").length;
  const resolvedCount = tickets.filter(t => t.status === "Resolved").length;
  const closedCount = tickets.filter(t => t.status === "Closed").length;

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createSubject || !createUser) {
      toast.error("Subject and user name are required!");
      return;
    }

    setIsSubmitting(true);
    try {
      const id = `tkt-${Date.now()}`;
      await api.addExpertQuery({
        id,
        farmerName: createUser,
        phone: createPhone || "9999999999",
        cropName: createCategory,
        problemDetails: createSubject,
        address: "Patna, Bihar",
        status: "pending",
      });

      const newT: TicketItem = {
        id,
        ticketNo: `TKT-2026-${Date.now().toString().slice(-4)}`,
        subject: createSubject,
        user: createUser,
        phone: createPhone || "â",
        category: createCategory,
        priority: createPriority,
        status: "Open",
        createdOn: "Today",
      };

      setTickets((prev) => [newT, ...prev]);
      toast.success(`Support ticket ${newT.ticketNo} created in MongoDB!`);
      setIsCreateOpen(false);
      setCreateSubject("");
      setCreateUser("");
    } catch (err: any) {
      console.error("Error creating ticket:", err);
      toast.error(err.message || "Failed to create ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTicket) return;

    setIsSubmitting(true);
    try {
      await api.updateExpertQuery(editingTicket.id, editStatus === "Resolved" ? "resolved" : "pending");

      setTickets((prev) =>
        prev.map((t) =>
          t.id === editingTicket.id ? { ...t, status: editStatus, subject: editSubject } : t
        )
      );

      toast.success(`Ticket #${editingTicket.ticketNo} updated!`);
      setEditingTicket(null);
    } catch (err: any) {
      console.error("Error updating ticket:", err);
      toast.error(err.message || "Failed to update ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    setIsSubmitting(true);
    try {
      await api.deleteExpertQuery(id);
      setTickets((prev) => prev.filter((t) => t.id !== id));
      toast.success(`Ticket deleted from MongoDB!`);
      setDeletingTicketId(null);
    } catch (err: any) {
      console.error("Error deleting ticket:", err);
      toast.error(err.message || "Failed to delete ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Support &amp; Help Desk</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage customer support tickets and advisory requests from MongoDB</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 rounded-xl gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Create Support Ticket
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-gray-500">Open Tickets</p>
            <p className="text-xl font-black text-blue-600 mt-0.5">{openCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-gray-500">In Progress</p>
            <p className="text-xl font-black text-amber-600 mt-0.5">{inProgressCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Headphones className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-gray-500">Resolved</p>
            <p className="text-xl font-black text-emerald-600 mt-0.5">{resolvedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-gray-500">Closed</p>
            <p className="text-xl font-black text-gray-700 mt-0.5">{closedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
            <XCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header Tabs */}
        <div className="flex items-center gap-6 px-5 pt-3 border-b border-gray-100 text-xs font-semibold">
          {["All Tickets", "Open", "In Progress", "Resolved", "Closed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${activeTab === tab ? "border-emerald-600 text-emerald-700 font-bold" : "border-transparent text-gray-400 hover:text-gray-700"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ticket #, subject, user..."
              className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 text-xs pl-9 h-9 rounded-xl"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-semibold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Ticket No</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400 text-xs">
                    Loading tickets from MongoDB...
                  </td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400 text-xs">
                    No support tickets found in database.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600 text-[11px]">{t.ticketNo}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800 max-w-xs truncate">{t.subject}</td>
                    <td className="py-3 px-4 text-gray-800 font-medium">
                      <div>{t.user}</div>
                      <div className="text-[10px] text-gray-400">{t.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-semibold">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.priority === "High" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${t.status === "Resolved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : t.status === "Open" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingTicket(t);
                            setEditStatus(t.status);
                            setEditSubject(t.subject);
                          }}
                          className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 flex items-center justify-center cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingTicketId(t.id)}
                          className="w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 flex items-center justify-center cursor-pointer"
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
      </div>

      {/* CREATE TICKET MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Create Support Ticket</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Subject / Issue Title *</label>
                <Input value={createSubject} onChange={(e) => setCreateSubject(e.target.value)} placeholder="e.g. Payment failed" className="bg-gray-50 text-xs" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">User Name *</label>
                  <Input value={createUser} onChange={(e) => setCreateUser(e.target.value)} placeholder="e.g. Ramesh Kumar" className="bg-gray-50 text-xs" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Phone Number</label>
                  <Input value={createPhone} onChange={(e) => setCreatePhone(e.target.value)} placeholder="e.g. 9876543210" className="bg-gray-50 text-xs" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} className="text-xs text-gray-600">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                  {isSubmitting ? "Creating..." : "Save to DB"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Edit Ticket #{editingTicket.ticketNo}</h3>
              <button onClick={() => setEditingTicket(null)} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Subject</label>
                <Input value={editSubject} onChange={(e) => setEditSubject(e.target.value)} className="bg-gray-50 text-xs" required />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Status</label>
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as any)} className="w-full bg-gray-50 border text-xs rounded-xl p-2 cursor-pointer">
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <Button type="button" variant="ghost" onClick={() => setEditingTicket(null)} className="text-xs text-gray-600">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deletingTicketId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Delete Ticket?</h3>
            <p className="text-xs text-gray-500">Are you sure you want to delete this support ticket from MongoDB?</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="ghost" onClick={() => setDeletingTicketId(null)} className="text-xs text-gray-600">Cancel</Button>
              <Button disabled={isSubmitting} onClick={() => handleDeleteTicket(deletingTicketId)} className="bg-red-600 text-white text-xs font-bold px-5 py-2 rounded-xl cursor-pointer">
                {isSubmitting ? "Deleting..." : "Delete Permanently"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
