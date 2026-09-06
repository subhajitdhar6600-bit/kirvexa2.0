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

interface GstSettings {
  gstin: string;
  legalName: string;
  tradeName: string;
  stateCode: string;
  taxRate5: boolean;
  taxRate12: boolean;
  taxRate18: boolean;
  eInvoicingEnabled: boolean;
  filingFrequency: string;
}

const DEFAULT_GST_SETTINGS: GstSettings = {
  gstin: "10ABCDE1234F1Z5",
  legalName: "Krivexa Agritech Pvt Ltd",
  tradeName: "Krivexa",
  stateCode: "10 - Bihar",
  taxRate5: true,
  taxRate12: false,
  taxRate18: false,
  eInvoicingEnabled: false,
  filingFrequency: "Monthly (GSTR-1 & 3B)",
};

export default function GstReportsView({ orders: propOrders, onViewInvoice }: GstReportsViewProps) {
  const { orders: appOrders } = useApp();
  const rawOrders = (propOrders && propOrders.length > 0 ? propOrders : (appOrders || []));

  const [activeSubTab, setActiveSubTab] = useState("GST Dashboard");

  // GST Settings
  const [gstSettings, setGstSettings] = useState<GstSettings>(() => {
    try {
      const saved = localStorage.getItem("krivexa_gst_settings");
      return saved ? { ...DEFAULT_GST_SETTINGS, ...JSON.parse(saved) } : DEFAULT_GST_SETTINGS;
    } catch { return DEFAULT_GST_SETTINGS; }
  });
  const [showGstSettingsModal, setShowGstSettingsModal] = useState(false);
  const [tempGstSettings, setTempGstSettings] = useState<GstSettings>(gstSettings);

  const handleSaveGstSettings = () => {
    setGstSettings(tempGstSettings);
    try { localStorage.setItem("krivexa_gst_settings", JSON.stringify(tempGstSettings)); } catch { }
    toast.success("GST settings saved successfully!");
    setShowGstSettingsModal(false);
  };

  // Filter state
  const [selectedFY, setSelectedFY] = useState("2025-26");
  const [selectedReturnType, setSelectedReturnType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [pendingFY, setPendingFY] = useState("2025-26");
  const [pendingReturnType, setPendingReturnType] = useState("All");
  const [pendingStatus, setPendingStatus] = useState("All");

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

  // (KPI computations moved below to use filteredInvoices)

  // Filtered invoices based on applied filters
  const filteredInvoices = useMemo(() => {
    if (!filtersApplied) return gstInvoices;
    return gstInvoices.filter(inv => {
      const matchType = selectedReturnType === "All" || inv.type.toLowerCase().includes(selectedReturnType.toLowerCase().replace("gstr-1", "outward").replace("gstr-3b", "summary"));
      const matchStatus = selectedStatus === "All" || inv.status.toLowerCase() === selectedStatus.toLowerCase();
      return matchType && matchStatus;
    });
  }, [gstInvoices, filtersApplied, selectedReturnType, selectedStatus]);

  // KPI computations on filtered invoices
  const totalTaxable = useMemo(() => filteredInvoices.reduce((sum, i) => sum + i.taxable, 0), [filteredInvoices]);
  const totalGstCollected = useMemo(() => filteredInvoices.reduce((sum, i) => sum + i.totalGst, 0), [filteredInvoices]);
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
          <Button variant="outline" onClick={() => { setTempGstSettings(gstSettings); setShowGstSettingsModal(true); }} className="h-8 text-xs gap-1.5 rounded-xl border-gray-200 hover:border-emerald-500 hover:text-emerald-700">
            <Settings className="h-3.5 w-3.5 text-gray-500" /> GST Settings
          </Button>
          <Button onClick={() => {
            const headers = ["Date","Invoice","Party","Taxable","CGST","SGST","Total GST","Status"];
            const rows = filteredInvoices.map(i => [i.date,i.inv,i.party,i.taxable.toFixed(2),i.cgst.toFixed(2),i.sgst.toFixed(2),i.totalGst.toFixed(2),i.status]);
            const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = `gst-report-${selectedFY}.csv`; a.click();
            URL.revokeObjectURL(url);
            toast.success(`GST Report exported (${selectedFY})!`);
          }} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 rounded-xl font-semibold">
            <Download className="h-3.5 w-3.5" /> Export Reports
          </Button>
        </div>
      </div>

      {/* 4 KPI Cards - Computed dynamically from filtered invoices */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total GST Collected (Sales)", value: `₹ ${totalGstCollected.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, sub: `From ₹ ${totalSales.toLocaleString("en-IN")} sales`, Icon: IndianRupee, bg: "bg-purple-50", tc: "text-purple-600" },
          { label: "Total GST Paid (Purchases)", value: `₹ ${totalGstPaid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, sub: "Input tax credit", Icon: ArrowDownLeft, bg: "bg-emerald-50", tc: "text-emerald-600" },
          { label: "Net GST Payable", value: `₹ ${netGstPayable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, sub: "Ready for monthly filing", Icon: Coins, bg: "bg-amber-50", tc: "text-amber-600" },
          { label: "GST Compliance Rate", value: "100.0%", sub: `${filteredInvoices.length} invoices compliant`, Icon: Percent, bg: "bg-blue-50", tc: "text-blue-600" },
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
            <select
              value={pendingFY}
              onChange={(e) => setPendingFY(e.target.value)}
              className="h-8 px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="2025-26">2025-26</option>
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Return Type</span>
            <select
              value={pendingReturnType}
              onChange={(e) => setPendingReturnType(e.target.value)}
              className="h-8 px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All</option>
              <option value="GSTR-1">GSTR-1</option>
              <option value="GSTR-3B">GSTR-3B</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Status</span>
            <select
              value={pendingStatus}
              onChange={(e) => setPendingStatus(e.target.value)}
              className="h-8 px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All</option>
              <option value="Filed">Filed</option>
              <option value="Pending">Pending</option>
              <option value="Processed">Processed</option>
            </select>
          </div>
          {filtersApplied && (
            <button
              onClick={() => {
                setPendingFY("2025-26"); setPendingReturnType("All"); setPendingStatus("All");
                setSelectedFY("2025-26"); setSelectedReturnType("All"); setSelectedStatus("All");
                setFiltersApplied(false);
                toast.success("Filters reset");
              }}
              className="h-8 px-3 rounded-xl border border-gray-200 bg-white text-gray-500 text-xs hover:bg-gray-50 flex items-center gap-1"
            >
              ✕ Reset
            </button>
          )}
          <Button
            onClick={() => {
              setSelectedFY(pendingFY);
              setSelectedReturnType(pendingReturnType);
              setSelectedStatus(pendingStatus);
              setFiltersApplied(true);
              toast.success(`Filters applied: FY ${pendingFY}, Type: ${pendingReturnType}`);
            }}
            className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 rounded-xl font-semibold ml-auto"
          >
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
              <div><span className="text-gray-400 text-[10px]">GSTIN</span><p className="font-mono font-bold text-emerald-700">{gstSettings.gstin}</p></div>
              <div><span className="text-gray-400 text-[10px]">Legal Entity</span><p className="font-semibold text-gray-800">{gstSettings.legalName}</p></div>
              <div><span className="text-gray-400 text-[10px]">Registered State</span><p className="text-gray-700">{gstSettings.stateCode}</p></div>
              <div><span className="text-gray-400 text-[10px]">Filing Frequency</span><p className="text-gray-700">{gstSettings.filingFrequency}</p></div>
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
            <h3 className="text-sm font-bold text-gray-900">GST Invoices ({filteredInvoices.length}{filtersApplied ? ` filtered from ${gstInvoices.length}` : ""})</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{filtersApplied ? `FY ${selectedFY} · ${selectedReturnType} · ${selectedStatus}` : "Live order tax records from database"}</p>
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
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-gray-400">
                    No GST invoices found for selected filters.
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

      {/* GST Settings Modal */}
      {showGstSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowGstSettingsModal(false); }}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center"><ShieldCheck className="h-4 w-4 text-purple-600" /></div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">GST Settings</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Manage GSTIN, tax slabs and compliance settings</p>
                </div>
              </div>
              <button onClick={() => setShowGstSettingsModal(false)} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700"><X className="h-4 w-4" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">GSTIN Number</label>
                  <Input value={tempGstSettings.gstin} onChange={(e) => setTempGstSettings(p => ({ ...p, gstin: e.target.value }))} placeholder="e.g. 10ABCDE1234F1Z5" className="h-9 text-xs rounded-xl border-gray-200 font-mono" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">State Code</label>
                  <select value={tempGstSettings.stateCode} onChange={(e) => setTempGstSettings(p => ({ ...p, stateCode: e.target.value }))} className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium">
                    {["10 - Bihar","07 - Delhi","29 - Karnataka","27 - Maharashtra","09 - Uttar Pradesh","33 - Tamil Nadu","19 - West Bengal"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Legal Entity Name</label>
                <Input value={tempGstSettings.legalName} onChange={(e) => setTempGstSettings(p => ({ ...p, legalName: e.target.value }))} className="h-9 text-xs rounded-xl border-gray-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Trade Name</label>
                  <Input value={tempGstSettings.tradeName} onChange={(e) => setTempGstSettings(p => ({ ...p, tradeName: e.target.value }))} className="h-9 text-xs rounded-xl border-gray-200" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Filing Frequency</label>
                  <select value={tempGstSettings.filingFrequency} onChange={(e) => setTempGstSettings(p => ({ ...p, filingFrequency: e.target.value }))} className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium">
                    <option value="Monthly (GSTR-1 & 3B)">Monthly (GSTR-1 &amp; 3B)</option>
                    <option value="Quarterly (QRMP)">Quarterly (QRMP)</option>
                  </select>
                </div>
              </div>
              {/* Tax Slabs */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1.5">Active Tax Slabs</label>
                <div className="flex items-center gap-3">
                  {([5, 12, 18] as const).map(rate => (
                    <label key={rate} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempGstSettings[`taxRate${rate}` as keyof GstSettings] as boolean}
                        onChange={(e) => setTempGstSettings(p => ({ ...p, [`taxRate${rate}`]: e.target.checked }))}
                        className="w-3.5 h-3.5 accent-emerald-600"
                      />
                      <span className="text-gray-700">{rate}% GST</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* E-Invoicing */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <p className="font-semibold text-gray-800">E-Invoicing (IRN Generation)</p>
                  <p className="text-[10px] text-gray-400">Enable for turnover above ₹5 Cr — as per CBIC mandate</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTempGstSettings(p => ({ ...p, eInvoicingEnabled: !p.eInvoicingEnabled }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${tempGstSettings.eInvoicingEnabled ? "bg-emerald-600" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${tempGstSettings.eInvoicingEnabled ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <Button variant="outline" onClick={() => setShowGstSettingsModal(false)} className="h-8 text-xs rounded-xl border-gray-200">Cancel</Button>
              <Button onClick={handleSaveGstSettings} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl font-semibold gap-1.5">
                <Save className="h-3.5 w-3.5" /> Save GST Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-[11px] text-gray-400">© {new Date().getFullYear()} Krivexa. All rights reserved.</div>
    </div>
  );
}
