import { useState } from "react";
import {
  Building2, ShieldCheck, ArrowUpRight, RotateCcw, Plus,
  Eye, EyeOff, MoreVertical, CheckCircle2, Clock, Headphones, Lock,
  ChevronRight, AlertCircle, Check, X, Trash2, Pencil, Phone, IndianRupee
} from "lucide-react";
import { toast } from "sonner";

interface BankAccountItem {
  id: string;
  bankName: string;
  branch: string;
  logo: string;
  bgColor: string;
  textColor: string;
  holderName: string;
  accountNumber: string;
  maskedNumber: string;
  ifsc: string;
  type: "Savings Account" | "Current Account";
  status: "Active" | "Pending";
  isPrimary: boolean;
}

const INITIAL_ACCOUNTS: BankAccountItem[] = [
  { id: "acc1", bankName: "HDFC Bank", branch: "Patna Main Branch, Bihar", logo: "HDFC", bgColor: "bg-red-600", textColor: "text-white", holderName: "Krivexo Agritech Pvt Ltd", accountNumber: "50100432165678", maskedNumber: "**** **** 5678", ifsc: "HDFC0001234", type: "Current Account", status: "Active", isPrimary: true },
  { id: "acc2", bankName: "State Bank of India", branch: "Gandhi Maidan Branch, Patna", logo: "SBI", bgColor: "bg-blue-700", textColor: "text-white", holderName: "Krivexo Agritech Pvt Ltd", accountNumber: "32109876542345", maskedNumber: "**** **** 2345", ifsc: "SBIN0001234", type: "Current Account", status: "Active", isPrimary: false },
  { id: "acc3", bankName: "ICICI Bank", branch: "Boring Road Branch, Patna", logo: "ICIC", bgColor: "bg-amber-600", textColor: "text-white", holderName: "Krivexo Agritech Pvt Ltd", accountNumber: "00812345678910", maskedNumber: "**** **** 8910", ifsc: "ICIC0001234", type: "Current Account", status: "Active", isPrimary: false },
  { id: "acc4", bankName: "Punjab National Bank", branch: "Dak Bungalow Road, Patna", logo: "PNB", bgColor: "bg-orange-600", textColor: "text-white", holderName: "Krivexo Agritech Pvt Ltd", accountNumber: "09871234567788", maskedNumber: "**** **** 7788", ifsc: "PUNB0001234", type: "Savings Account", status: "Pending", isPrimary: false },
];

const EMPTY_FORM: { bankName: string; branch: string; holderName: string; accountNumber: string; confirmAccountNumber: string; ifsc: string; type: "Savings Account" | "Current Account" } = { bankName: "", branch: "", holderName: "", accountNumber: "", confirmAccountNumber: "", ifsc: "", type: "Savings Account" };

export default function BankAccountsView() {
  const [accounts, setAccounts] = useState<BankAccountItem[]>(() => {
    try {
      const saved = localStorage.getItem("krivexo_bank_accounts");
      return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
    } catch { return INITIAL_ACCOUNTS; }
  });

  const saveAccounts = (updated: BankAccountItem[]) => {
    setAccounts(updated);
    try { localStorage.setItem("krivexo_bank_accounts", JSON.stringify(updated)); } catch { }
  };

  const [activeTab, setActiveTab] = useState<"my_accounts" | "add_account" | "verification">("my_accounts");
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // Edit modal
  const [editingAccount, setEditingAccount] = useState<BankAccountItem | null>(null);
  const [editForm, setEditForm] = useState({ holderName: "", branch: "", ifsc: "", type: "Savings Account" as BankAccountItem["type"] });

  // Add account form
  const [addForm, setAddForm] = useState(EMPTY_FORM);
  const [addError, setAddError] = useState("");

  // Verification
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifyStep, setVerifyStep] = useState<"idle" | "sending" | "checking" | "done">("idle");
  const [verifyAmount, setVerifyAmount] = useState("");

  // Contact Support
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportMsg, setSupportMsg] = useState("");

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const setPrimaryAccount = (id: string) => {
    const updated = accounts.map(acc => ({ ...acc, isPrimary: acc.id === id }));
    saveAccounts(updated);
    toast.success("Primary account updated successfully!");
  };

  const handleDeleteAccount = (id: string) => {
    const acc = accounts.find(a => a.id === id);
    if (acc?.isPrimary) { toast.error("Cannot delete primary account."); return; }
    if (!window.confirm(`Delete ${acc?.bankName} account ending in ${acc?.maskedNumber}?`)) return;
    saveAccounts(accounts.filter(a => a.id !== id));
    toast.success("Account removed.");
    setActionMenuId(null);
  };

  const handleOpenEdit = (acc: BankAccountItem) => {
    setEditingAccount(acc);
    setEditForm({ holderName: acc.holderName, branch: acc.branch, ifsc: acc.ifsc, type: acc.type });
    setActionMenuId(null);
  };

  const handleSaveEdit = () => {
    if (!editingAccount) return;
    const updated = accounts.map(a => a.id === editingAccount.id ? { ...a, ...editForm } : a);
    saveAccounts(updated);
    toast.success("Account details updated!");
    setEditingAccount(null);
  };

  const handleAddAccount = () => {
    setAddError("");
    if (!addForm.bankName || !addForm.holderName || !addForm.accountNumber || !addForm.ifsc) {
      setAddError("Please fill all required fields."); return;
    }
    if (addForm.accountNumber !== addForm.confirmAccountNumber) {
      setAddError("Account numbers do not match."); return;
    }
    if (addForm.accountNumber.length < 9 || addForm.accountNumber.length > 18) {
      setAddError("Account number must be 9–18 digits."); return;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(addForm.ifsc)) {
      setAddError("Invalid IFSC code format (e.g. HDFC0001234)."); return;
    }
    const last4 = addForm.accountNumber.slice(-4);
    const newAcc: BankAccountItem = {
      id: `acc_${Date.now()}`,
      bankName: addForm.bankName,
      branch: addForm.branch || "Main Branch",
      logo: addForm.bankName.slice(0, 4).toUpperCase(),
      bgColor: "bg-gray-700",
      textColor: "text-white",
      holderName: addForm.holderName,
      accountNumber: addForm.accountNumber,
      maskedNumber: `**** **** ${last4}`,
      ifsc: addForm.ifsc.toUpperCase(),
      type: addForm.type,
      status: "Pending",
      isPrimary: accounts.length === 0,
    };
    saveAccounts([...accounts, newAcc]);
    toast.success(`Bank account added! Verification pending.`);
    setAddForm(EMPTY_FORM);
    setActiveTab("my_accounts");
  };

  const handleVerify = (id: string) => {
    setVerifyingId(id);
    setVerifyStep("sending");
    setVerifyAmount("");
    setTimeout(() => setVerifyStep("checking"), 1500);
  };

  const handleConfirmVerify = () => {
    if (!verifyAmount.trim()) { toast.error("Please enter the penny amount received."); return; }
    const n = parseFloat(verifyAmount);
    if (isNaN(n) || n <= 0 || n >= 2) { toast.error("Incorrect amount. Check your bank statement."); return; }
    const updated = accounts.map(a => a.id === verifyingId ? { ...a, status: "Active" as const } : a);
    saveAccounts(updated);
    toast.success("🎉 Account verified successfully!");
    setVerifyingId(null);
    setVerifyStep("idle");
    setVerifyAmount("");
  };

  const primaryAcc = accounts.find(a => a.isPrimary);
  const activeCount = accounts.filter(a => a.status === "Active").length;
  const pendingAccounts = accounts.filter(a => a.status === "Pending");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Bank Accounts</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage all bank accounts for payments, refunds and withdrawals</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span>Dashboard</span>
          <span>›</span>
          <span>Finance &amp; Wallet</span>
          <span>›</span>
          <span className="text-emerald-600 font-semibold">Bank Accounts</span>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* Total Bank Accounts */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Total Bank Accounts</p>
            <p className="text-xl font-black text-gray-900 mt-0.5">{accounts.length}</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Active Accounts: {activeCount}</p>
          </div>
        </div>

        {/* Primary Account */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Primary Account</p>
            <p className="text-xs font-bold text-gray-900 mt-0.5">{primaryAcc?.bankName ?? "—"}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-gray-500 font-mono">{primaryAcc?.maskedNumber ?? "—"}</span>
              {primaryAcc?.status === "Active" && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Verified</span>
              )}
            </div>
          </div>
        </div>

        {/* Total Withdrawn */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <ArrowUpRight className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Total Withdrawn</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">₹ 16,58,230.00</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">This Month ↗ 14.3%</p>
          </div>
        </div>

        {/* Total Refunded */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Total Refunded</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">₹ 11,13,230.00</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">This Month ↗ 8.7%</p>
          </div>
        </div>
      </div>

      {/* Tabs & Add Button Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("my_accounts")}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "my_accounts"
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            My Bank Accounts
          </button>
          <button
            onClick={() => setActiveTab("add_account")}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "add_account"
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Add New Account
          </button>
          <button
            onClick={() => setActiveTab("verification")}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "verification"
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Beneficiary Verification
          </button>
        </div>

        <button
          onClick={() => setActiveTab("add_account")}
          className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-sm transition-colors cursor-pointer w-fit"
        >
          <Plus className="h-4 w-4" />
          Add New Bank Account
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "my_accounts" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-gray-50/70 text-gray-400 font-semibold text-[10px] uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3 px-4">Bank Details</th>
                  <th className="py-3 px-4">Account Holder</th>
                  <th className="py-3 px-4">Account Number</th>
                  <th className="py-3 px-4">IFSC Code</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Primary</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {accounts.length === 0 ? (
                  <tr><td colSpan={8} className="py-10 text-center text-gray-400">No bank accounts found. Click "Add New Bank Account" to add one.</td></tr>
                ) : accounts.map((acc) => {
                  const isRevealed = revealedIds[acc.id];
                  const isMenuOpen = actionMenuId === acc.id;
                  return (
                    <tr key={acc.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl ${acc.bgColor} ${acc.textColor} flex items-center justify-center font-black text-xs shrink-0 shadow-xs`}>{acc.logo}</div>
                          <div>
                            <p className="font-bold text-gray-900 text-[11px]">{acc.bankName}</p>
                            <p className="text-[10px] text-gray-400">{acc.branch}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-gray-800 text-[11px]">{acc.holderName}</p>
                        {acc.status === "Active" ? (
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded inline-block mt-0.5">Verified</span>
                        ) : (
                          <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded inline-block mt-0.5">Pending Verification</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <span>{isRevealed ? acc.accountNumber : acc.maskedNumber}</span>
                          <button type="button" onClick={() => toggleReveal(acc.id)} className="text-gray-400 hover:text-gray-600 p-0.5">
                            {isRevealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-gray-600 text-[11px]">{acc.ifsc}</td>
                      <td className="py-3.5 px-4 text-gray-600 text-[11px]">{acc.type}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${acc.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                          <span className={`font-semibold text-[11px] ${acc.status === "Active" ? "text-emerald-700" : "text-amber-700"}`}>{acc.status}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {acc.isPrimary ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Primary</span>
                        ) : (
                          <button onClick={() => setPrimaryAccount(acc.id)} className="text-xs text-emerald-600 hover:underline font-medium transition-colors">Set Primary</button>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center relative">
                        <button
                          onClick={() => setActionMenuId(isMenuOpen ? null : acc.id)}
                          className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {isMenuOpen && (
                          <div className="absolute right-4 top-10 z-20 bg-white border border-gray-200 rounded-xl shadow-xl p-1 min-w-[140px] text-xs animate-in fade-in zoom-in-95 duration-150">
                            {!acc.isPrimary && <button onClick={() => { setPrimaryAccount(acc.id); setActionMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-left text-gray-700"><ShieldCheck className="h-3 w-3 text-emerald-600" /> Set as Primary</button>}
                            <button onClick={() => handleOpenEdit(acc)} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-left text-gray-700"><Pencil className="h-3 w-3 text-blue-500" /> Edit Details</button>
                            {acc.status === "Pending" && <button onClick={() => { handleVerify(acc.id); setActiveTab("verification"); setActionMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-left text-gray-700"><CheckCircle2 className="h-3 w-3 text-amber-600" /> Verify Account</button>}
                            {!acc.isPrimary && <button onClick={() => handleDeleteAccount(acc.id)} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-red-50 text-left text-red-600"><Trash2 className="h-3 w-3" /> Delete</button>}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Account Tab */}
      {activeTab === "add_account" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center"><Building2 className="h-4 w-4 text-emerald-600" /></div>
            <div><h3 className="text-sm font-bold text-gray-900">Add New Bank Account</h3><p className="text-[11px] text-gray-400 mt-0.5">All fields marked * are required. Verification via penny drop.</p></div>
          </div>
          {addError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">{addError}</div>}
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-gray-700 font-semibold mb-1">Bank Name *</label><input value={addForm.bankName} onChange={(e) => setAddForm(p => ({ ...p, bankName: e.target.value }))} placeholder="e.g. HDFC Bank" className="w-full h-9 px-3 border border-gray-200 rounded-xl" /></div>
              <div><label className="block text-gray-700 font-semibold mb-1">Branch</label><input value={addForm.branch} onChange={(e) => setAddForm(p => ({ ...p, branch: e.target.value }))} placeholder="e.g. Patna Main Branch" className="w-full h-9 px-3 border border-gray-200 rounded-xl" /></div>
            </div>
            <div><label className="block text-gray-700 font-semibold mb-1">Account Holder Name *</label><input value={addForm.holderName} onChange={(e) => setAddForm(p => ({ ...p, holderName: e.target.value }))} placeholder="Legal name as per bank records" className="w-full h-9 px-3 border border-gray-200 rounded-xl" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-gray-700 font-semibold mb-1">Account Number *</label><input type="text" inputMode="numeric" value={addForm.accountNumber} onChange={(e) => setAddForm(p => ({ ...p, accountNumber: e.target.value.replace(/\D/g, "") }))} placeholder="9–18 digit account number" className="w-full h-9 px-3 border border-gray-200 rounded-xl font-mono" /></div>
              <div><label className="block text-gray-700 font-semibold mb-1">Confirm Account Number *</label><input type="text" inputMode="numeric" value={addForm.confirmAccountNumber} onChange={(e) => setAddForm(p => ({ ...p, confirmAccountNumber: e.target.value.replace(/\D/g, "") }))} placeholder="Re-enter account number" className="w-full h-9 px-3 border border-gray-200 rounded-xl font-mono" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-gray-700 font-semibold mb-1">IFSC Code *</label><input value={addForm.ifsc} onChange={(e) => setAddForm(p => ({ ...p, ifsc: e.target.value.toUpperCase() }))} placeholder="e.g. HDFC0001234" className="w-full h-9 px-3 border border-gray-200 rounded-xl font-mono" /></div>
              <div><label className="block text-gray-700 font-semibold mb-1">Account Type *</label><select value={addForm.type} onChange={(e) => setAddForm(p => ({ ...p, type: e.target.value as BankAccountItem["type"] }))} className="w-full h-9 px-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium"><option value="Savings Account">Savings Account</option><option value="Current Account">Current Account</option></select></div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-xs flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p><strong>Verification required:</strong> A ₹1 penny drop will be sent to verify your account. You'll need to confirm the exact amount received.</p>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button onClick={() => { setAddForm(EMPTY_FORM); setAddError(""); setActiveTab("my_accounts"); }} className="h-9 px-4 text-xs rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50">Cancel</button>
            <button onClick={handleAddAccount} className="h-9 px-5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" /> Add Account</button>
          </div>
        </div>
      )}

      {/* Verification Tab */}
      {activeTab === "verification" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center"><ShieldCheck className="h-4 w-4 text-amber-600" /></div>
            <div><h3 className="text-sm font-bold text-gray-900">Beneficiary Verification</h3><p className="text-[11px] text-gray-400 mt-0.5">Verify pending bank accounts using penny drop (₹1 deposit)</p></div>
          </div>
          {pendingAccounts.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-800">All accounts verified!</p>
              <p className="text-xs text-gray-400 mt-1">No pending accounts require verification.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingAccounts.map(acc => (
                <div key={acc.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl ${acc.bgColor} ${acc.textColor} flex items-center justify-center font-black text-xs`}>{acc.logo}</div>
                      <div><p className="font-bold text-gray-900 text-xs">{acc.bankName}</p><p className="text-[10px] text-gray-500">{acc.maskedNumber} · {acc.type}</p></div>
                    </div>
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">Pending</span>
                  </div>
                  {verifyingId === acc.id ? (
                    <div className="space-y-2">
                      {verifyStep === "sending" && (
                        <div className="flex items-center gap-2 text-xs text-amber-800"><div className="w-4 h-4 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" /> Sending ₹1 penny drop...</div>
                      )}
                      {verifyStep === "checking" && (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-700">✅ ₹1 sent! Enter the exact amount received in your bank statement:</p>
                          <div className="flex items-center gap-2">
                            <input type="number" step="0.01" value={verifyAmount} onChange={(e) => setVerifyAmount(e.target.value)} placeholder="e.g. 0.53" className="h-9 px-3 border border-gray-200 rounded-xl text-xs w-32 font-mono" />
                            <button onClick={handleConfirmVerify} className="h-9 px-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">Verify</button>
                            <button onClick={() => { setVerifyingId(null); setVerifyStep("idle"); }} className="h-9 px-3 text-xs rounded-xl border border-gray-200 text-gray-500">Cancel</button>
                          </div>
                          <p className="text-[10px] text-gray-400">Hint: The amount is between ₹0.01 and ₹1.00</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button onClick={() => handleVerify(acc.id)} className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-xl transition-colors">
                      <IndianRupee className="h-3 w-3" /> Initiate Penny Drop Verification
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3-Column Bottom Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Col 1: Recent Account Activities */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-800">Recent Account Activities</h3>
            <button
              onClick={() => toast.info("Viewing all account activities")}
              className="text-[11px] text-emerald-600 font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <Building2 className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-[11px]">Bank Account Added</p>
                <p className="text-[10px] text-gray-400">HDFC Bank - ****5678</p>
              </div>
              <span className="text-[9px] text-gray-400 whitespace-nowrap">25 May 2025, 10:30 AM</span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-[11px]">Account Verified</p>
                <p className="text-[10px] text-gray-400">SBI Bank - ****2345</p>
              </div>
              <span className="text-[9px] text-gray-400 whitespace-nowrap">24 May 2025, 02:15 PM</span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-[11px]">Primary Account Changed</p>
                <p className="text-[10px] text-gray-400">ICICI Bank - ****8910</p>
              </div>
              <span className="text-[9px] text-gray-400 whitespace-nowrap">23 May 2025, 11:45 AM</span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-[11px]">Account Verification Pending</p>
                <p className="text-[10px] text-gray-400">PNB Bank - ****7788</p>
              </div>
              <span className="text-[9px] text-gray-400 whitespace-nowrap">22 May 2025, 04:20 PM</span>
            </div>
          </div>
        </div>

        {/* Col 2: Important Information */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-800 mb-3">Important Information</h3>
            <div className="space-y-2.5 text-[11px] text-gray-600">
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-800">All bank accounts are secured</p>
                  <p className="text-gray-500 text-[10px]">We use bank level encryption to keep your data safe and secure.</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-800">Withdrawals</p>
                  <p className="text-gray-500 text-[10px]">Withdrawals are processed only in verified bank accounts.</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-800">Verification Timeline</p>
                  <p className="text-gray-500 text-[10px]">Bank account verification may take up to 24 hours.</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => toast.info("Opening verification guidelines...")}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 pt-2"
          >
            Learn more about bank verification <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Col 3: Need Help? */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col items-center text-center justify-between">
          <div>
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-3xl mx-auto mb-2">
              👨‍💼
            </div>
            <h4 className="text-xs font-bold text-gray-800">Need Help?</h4>
            <p className="text-[11px] text-gray-500 mt-1">
              Our support team is here to help you with bank account related queries.
            </p>

            <div className="mt-3 p-2 rounded-xl bg-emerald-50/60 border border-emerald-100 text-[10.5px]">
              <p className="font-bold text-emerald-800">Support Hours</p>
              <p className="text-emerald-600">Mon - Sat (9:00 AM - 7:00 PM)</p>
            </div>
          </div>

          <button
            onClick={() => setShowSupportModal(true)}
            className="mt-3 w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Headphones className="h-3.5 w-3.5" />
            Contact Support
          </button>
        </div>
      </div>

      {/* 100% Secure & Trusted Footer Banner */}
      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3.5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <Lock className="h-4 w-4" />
        </div>
        <div className="text-[11px] text-emerald-900 leading-tight">
          <span className="font-bold text-emerald-800">100% Secure &amp; Trusted:</span>{" "}
          <span className="text-emerald-700">
            Your bank details are protected with 256-bit SSL encryption and are never shared with third parties.
          </span>
        </div>
      </div>

      {/* Edit Account Modal */}
      {editingAccount && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setEditingAccount(null); }}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900">Edit Account Details</h3>
              <button onClick={() => setEditingAccount(null)} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div><label className="block text-gray-700 font-semibold mb-1">Account Holder Name</label><input value={editForm.holderName} onChange={(e) => setEditForm(p => ({ ...p, holderName: e.target.value }))} className="w-full h-9 px-3 border border-gray-200 rounded-xl" /></div>
              <div><label className="block text-gray-700 font-semibold mb-1">Branch</label><input value={editForm.branch} onChange={(e) => setEditForm(p => ({ ...p, branch: e.target.value }))} className="w-full h-9 px-3 border border-gray-200 rounded-xl" /></div>
              <div><label className="block text-gray-700 font-semibold mb-1">IFSC Code</label><input value={editForm.ifsc} onChange={(e) => setEditForm(p => ({ ...p, ifsc: e.target.value.toUpperCase() }))} className="w-full h-9 px-3 border border-gray-200 rounded-xl font-mono" /></div>
              <div><label className="block text-gray-700 font-semibold mb-1">Account Type</label><select value={editForm.type} onChange={(e) => setEditForm(p => ({ ...p, type: e.target.value as BankAccountItem["type"] }))} className="w-full h-9 px-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium"><option value="Savings Account">Savings Account</option><option value="Current Account">Current Account</option></select></div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button onClick={() => setEditingAccount(null)} className="h-8 px-3 text-xs rounded-xl border border-gray-200 text-gray-500">Cancel</button>
              <button onClick={handleSaveEdit} className="h-8 px-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowSupportModal(false); }}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center"><Headphones className="h-3.5 w-3.5 text-emerald-600" /></div>
                <h3 className="text-sm font-bold text-gray-900">Contact Support</h3>
              </div>
              <button onClick={() => setShowSupportModal(false)} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800">
                <p className="font-bold">Support Hours</p>
                <p>Monday – Saturday, 9:00 AM – 7:00 PM IST</p>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <Phone className="h-4 w-4 text-emerald-600" />
                <div><p className="font-bold text-gray-800">+91 1800-XXX-XXXX</p><p className="text-[10px] text-gray-400">Toll-free helpline for bank account queries</p></div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Your Message</label>
                <textarea value={supportMsg} onChange={(e) => setSupportMsg(e.target.value)} rows={3} placeholder="Describe your bank account issue..." className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button onClick={() => setShowSupportModal(false)} className="h-8 px-3 text-xs rounded-xl border border-gray-200 text-gray-500">Cancel</button>
              <button onClick={() => { if (!supportMsg.trim()) { toast.error("Please enter a message"); return; } toast.success("Support ticket created! We'll respond in 24h."); setSupportMsg(""); setShowSupportModal(false); }} className="h-8 px-4 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">Send Message</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
