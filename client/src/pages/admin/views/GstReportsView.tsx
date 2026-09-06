import { useState, useMemo } from "react";
import {
  FileText, Download, Filter, Settings, Calendar,
  CheckCircle2, Clock, AlertTriangle, ArrowRight, Eye,
  ExternalLink, BarChart3, ShieldCheck, IndianRupee, ArrowDownLeft,
  Coins, Percent, FileCheck, Pencil, Trash2, X, Save
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext.tsx";

interface GstReportsViewProps {
  orders?: any[];
  onViewInvoice?: (invoiceId: string) => void;
}

interface GstInvoiceRecord {
  id: string;
  date: string;
  inv: string;
  party: string;
  type: string;
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  status: "Filed" | "Pending" | "Processed";
}

export default function GstReportsView({ orders: propOrders, onViewInvoice }: GstReportsViewProps) {
  const { orders: appOrders } = useApp();
  const rawOrders = (propOrders && propOrders.length > 0 ? propOrders : (appOrders || []));

  const [activeSubTab, setActiveSubTab] = useState("GST Dashboard");

  // Local state for GST invoices so Edit and Delete work interactively
  const initialGstInvoices = useMemo<GstInvoiceRecord[]>(() => {
    return rawOrders.map((o: any, idx: number) => {
      const amt = Number(o.totalAmount || o.amount || 0);
      const taxVal = Math.round((amt / 1.05) * 100) / 100;
      const gstAmt = Math.round((amt - taxVal) * 100) / 100;
      const c = Math.round((gstAmt / 2) * 100) / 100;
      const s = Math.round((gstAmt - c) * 100) / 100;
      const dateStr = o.date || (o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "Today");

      return {
        id: String(o.id || `ORD${8000 + idx}`),
        date: dateStr,
        inv: `INV-${o.id || `KRVX${8000 + idx}`}`,
        party: o.buyer || o.userName || "Registered Farmer",
        type: "Sales (Outward)",
        taxable: taxVal,
        cgst: c,
        sgst: s,
        igst: 0,
        totalGst: gstAmt,
        status: "Filed",
      };
    });
  }, [rawOrders]);

  const [gstInvoices, setGstInvoices] = useState<GstInvoiceRecord[]>(initialGstInvoices);

  // Sync if rawOrders change initially
  useMemo(() => {
    if (gstInvoices.length === 0 && initialGstInvoices.length > 0) {
      setGstInvoices(initialGstInvoices);
    }
  }, [initialGstInvoices]);

  // Edit modal state
  const [editingInvoice, setEditingInvoice] = useState<GstInvoiceRecord | null>(null);
  const [editForm, setEditForm] = useState<{ party: string; taxable: number; status: GstInvoiceRecord["status"] }>({
    party: "",
    taxable: 0,
    status: "Filed",
  });

  const handleOpenEdit = (inv: GstInvoiceRecord) => {
    setEditingInvoice(inv);
    setEditForm({
      party: inv.party,
      taxable: inv.taxable,
      status: inv.status,
    });
  };

  const handleSaveEdit = () => {
    if (!editingInvoice) return;
    const newTaxable = Number(editForm.taxable) || 0;
    const newTotalGst = Math.round((newTaxable * 0.05) * 100) / 100;
    const newC = Math.round((newTotalGst / 2) * 100) / 100;
    const newS = Math.round((newTotalGst - newC) * 100) / 100;

    setGstInvoices(prev => prev.map(item => {
      if (item.id === editingInvoice.id) {
        return {
          ...item,
          party: editForm.party,
          taxable: newTaxable,
          cgst: newC,
          sgst: newS,
          totalGst: newTotalGst,
          status: editForm.status,
        };
      }
      return item;
    }));

    toast.success(`GST Invoice ${editingInvoice.inv} updated successfully`);
    setEditingInvoice(null);
  };

  const handleDelete = (inv: GstInvoiceRecord) => {
    if (window.confirm(`Are you sure you want to delete GST Invoice ${inv.inv}?`)) {
      setGstInvoices(prev => prev.filter(item => item.id !== inv.id));
      toast.success(`GST Invoice ${inv.inv} deleted`);
    }
  };

  // Real calculations based on current GST invoices
  const totalTaxable = useMemo(() => gstInvoices.reduce((sum, i) => sum + i.taxable, 0), [gstInvoices]);
  const totalGstCollected = useMemo(() => gstInvoices.reduce((sum, i) => sum + i.totalGst, 0), [gstInvoices]);
  const totalSales = totalTaxable + totalGstCollected;
  const cgst = Math.round((totalGstCollected / 2) * 100) / 100;
  const sgst = Math.round((totalGstCollected - cgst) * 100) / 100;
  const totalGstPaid = 0;
  const netGstPayable = totalGstCollected;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">GST Reports</h1>
          <p className="text-xs text-gray-500 mt-0.5">Track, manage and file GST returns &amp; view real-time tax reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => toast.info("GST Settings")} className="h-8 text-xs gap-1.5 rounded-xl border-gray-200">
            <Settings className="h-3.5 w-3.5 text-gray-500" /> GST Settings
          </Button>
          <Button onClick={() => toast.success("Exporting GST Reports...")} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 rounded-xl font-semibold">
            <Download className="h-3.5 w-3.5" /> Export Reports
          </Button>
        </div>
      </div>

      {/* 4 KPI Cards - Computed dynamically from real sales */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total GST Collected (Sales)", value: `₹ ${totalGstCollected.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, sub: `From ₹ ${totalSales.toLocaleString("en-IN")} sales`, Icon: IndianRupee, bg: "bg-purple-50", tc: "text-purple-600" },
          { label: "Total GST Paid (Purchases)", value: `₹ ${totalGstPaid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, sub: "Input tax credit", Icon: ArrowDownLeft, bg: "bg-emerald-50", tc: "text-emerald-600" },
          { label: "Net GST Payable", value: `₹ ${netGstPayable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, sub: "Ready for monthly filing", Icon: Coins, bg: "bg-amber-50", tc: "text-amber-600" },
          { label: "GST Compliance Rate", value: "100.0%", sub: `${gstInvoices.length} invoices compliant`, Icon: Percent, bg: "bg-blue-50", tc: "text-blue-600" },
        ].map((k, i) => {
          const IconComp = k.Icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 font-medium">{k.label}</p>
                <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center font-bold text-base`}>
                  <IconComp className={`w-4 h-4 ${k.tc}`} />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">{k.value}</p>
              <p className={`text-[11px] ${k.tc} mt-1 font-medium`}>{k.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Subtabs + Filters Bar Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
        {/* Subtabs */}
        <div className="flex items-center gap-6 border-b border-gray-100 pb-3 text-xs font-semibold overflow-x-auto">
          {["GST Dashboard", "GSTR-1 (Outward)", "GSTR-3B (Summary)", "GSTR-2B (Inward)", "Returns Filed", "GST Reconciliation"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`pb-1 transition-colors whitespace-nowrap ${activeSubTab === tab ? "border-b-2 border-emerald-600 text-emerald-700 font-bold" : "text-gray-400 hover:text-gray-700"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Financial Year</span>
            <select className="h-8 px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-medium">
              <option>2025-26</option>
              <option>2024-25</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Return Type</span>
            <select className="h-8 px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-medium">
              <option>All</option>
              <option>GSTR-1</option>
              <option>GSTR-3B</option>
            </select>
          </div>
          <Button onClick={() => toast.success("Filters applied")} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 rounded-xl font-semibold ml-auto">
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Row 1: Tax Breakup Donut + GSTIN Profile */}
      <div className="grid grid-cols-12 gap-4">
        {/* GST Tax Breakup Donut */}
        <div className="col-span-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs font-bold text-gray-800 mb-2">GST Tax Breakup</p>
          <div className="flex items-center gap-4">
            <svg width="95" height="95" viewBox="0 0 95 95" className="shrink-0">
              <circle cx="47.5" cy="47.5" r="35" fill="none" stroke="#e5e7eb" strokeWidth="12" />
              <circle cx="47.5" cy="47.5" r="35" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="110 220" strokeLinecap="round" transform="rotate(-90 47.5 47.5)" />
              <circle cx="47.5" cy="47.5" r="35" fill="none" stroke="#059669" strokeWidth="12" strokeDasharray="110 220" strokeLinecap="round" transform="rotate(90 47.5 47.5)" strokeDashoffset="-2" />
              <text x="47.5" y="44" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#111">₹ {totalGstCollected.toLocaleString("en-IN")}</text>
              <text x="47.5" y="54" textAnchor="middle" fontSize="7" fill="#9ca3af">Total Tax</text>
            </svg>
            <div className="space-y-1 text-[10px] flex-1">
              <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /><span>CGST (2.5%)</span></div><span className="font-bold text-gray-800">₹ {cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })} (50%)</span></div>
              <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /><span>SGST (2.5%)</span></div><span className="font-bold text-gray-800">₹ {sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })} (50%)</span></div>
              <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /><span>IGST</span></div><span className="font-bold text-gray-800">₹ 0.00 (0%)</span></div>
            </div>
          </div>
        </div>

        {/* GSTIN Profile Card */}
        <div className="col-span-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
          <div>
            <p className="font-bold text-gray-800 text-xs mb-2">GSTIN Profile</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-gray-400 text-[10px]">GSTIN</span><p className="font-mono font-bold text-emerald-700">10ABCDE1234F1Z5</p></div>
              <div><span className="text-gray-400 text-[10px]">Legal Entity</span><p className="font-semibold text-gray-800">Krivexa Agritech Pvt Ltd</p></div>
              <div><span className="text-gray-400 text-[10px]">Registered State</span><p className="text-gray-700">Bihar (State Code 10)</p></div>
              <div><span className="text-gray-400 text-[10px]">Filing Frequency</span><p className="text-gray-700">Monthly (GSTR-1 &amp; 3B)</p></div>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center gap-2 text-emerald-700 font-semibold text-[11px]">
            <FileCheck className="w-4 h-4" />
            <span>Active &amp; Compliant</span>
          </div>
        </div>
      </div>

      {/* Row 2: Recent GST Invoices Table - Clean Full Width Layout with View, Edit, and Delete buttons */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Recent GST Invoices ({gstInvoices.length})</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Live order tax records from database</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-[11px] uppercase font-semibold">
                <th className="py-3 px-4 text-left whitespace-nowrap">Date</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">Invoice No.</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">Customer</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">Type</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Taxable Value</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">CGST (2.5%)</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">SGST (2.5%)</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Total GST</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {gstInvoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-gray-400">
                    No GST invoices found.
                  </td>
                </tr>
              ) : (
                gstInvoices.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{row.date}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700 whitespace-nowrap">{row.inv}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900 whitespace-nowrap">{row.party}</td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.type}</td>
                    <td className="py-3 px-4 text-right font-medium text-gray-800 whitespace-nowrap">₹ {row.taxable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4 text-right text-gray-600 whitespace-nowrap">₹ {row.cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4 text-right text-gray-600 whitespace-nowrap">₹ {row.sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900 whitespace-nowrap">₹ {row.totalGst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        row.status === "Filed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : row.status === "Processed"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Button */}
                        <button
                          onClick={() => onViewInvoice ? onViewInvoice(row.id) : toast.info(`Viewing invoice ${row.inv}`)}
                          title="View Invoice"
                          className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEdit(row)}
                          title="Edit GST Invoice"
                          className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-600 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(row)}
                          title="Delete GST Invoice"
                          className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 transition-colors"
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

      {/* Edit GST Invoice Modal */}
      {editingInvoice && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Edit GST Invoice</h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{editingInvoice.inv}</p>
              </div>
              <button
                onClick={() => setEditingInvoice(null)}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Customer / Entity Name</label>
                <Input
                  value={editForm.party}
                  onChange={(e) => setEditForm(prev => ({ ...prev, party: e.target.value }))}
                  placeholder="Customer Name"
                  className="h-9 text-xs rounded-xl border-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Taxable Value (₹)</label>
                <Input
                  type="number"
                  value={editForm.taxable}
                  onChange={(e) => setEditForm(prev => ({ ...prev, taxable: parseFloat(e.target.value) || 0 }))}
                  placeholder="Taxable Value"
                  className="h-9 text-xs rounded-xl border-gray-200"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  GST (5%): ₹ {((editForm.taxable || 0) * 0.05).toFixed(2)} (CGST ₹ {((editForm.taxable || 0) * 0.025).toFixed(2)} + SGST ₹ {((editForm.taxable || 0) * 0.025).toFixed(2)})
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Filing Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as GstInvoiceRecord["status"] }))}
                  className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium"
                >
                  <option value="Filed">Filed</option>
                  <option value="Processed">Processed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setEditingInvoice(null)}
                className="h-8 text-xs rounded-xl border-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl font-semibold gap-1.5"
              >
                <Save className="h-3.5 w-3.5" /> Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-[11px] text-gray-400">© {new Date().getFullYear()} Krivexa. All rights reserved.</div>
    </div>
  );
}
