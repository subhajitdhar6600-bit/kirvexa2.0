import { useState } from "react";
import {
  Building2, ShieldCheck, ArrowUpRight, RotateCcw, Plus,
  Eye, MoreVertical, CheckCircle2, Clock, Headphones, Lock,
  ChevronRight, AlertCircle, Check
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

const INITIAL_ACCOUNTS: BankAccountItem[] = [];

export default function BankAccountsView() {
  const [accounts, setAccounts] = useState<BankAccountItem[]>(INITIAL_ACCOUNTS);
  const [activeTab, setActiveTab] = useState<"my_accounts" | "add_account" | "verification">("my_accounts");
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const setPrimaryAccount = (id: string) => {
    setAccounts(prev =>
      prev.map(acc => ({
        ...acc,
        isPrimary: acc.id === id,
      }))
    );
    toast.success("Primary account updated successfully!");
  };

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
            <p className="text-xl font-black text-gray-900 mt-0.5">5</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Active Accounts: 4</p>
          </div>
        </div>

        {/* Primary Account */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Primary Account</p>
            <p className="text-xs font-bold text-gray-900 mt-0.5">HDFC Bank</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-gray-500 font-mono">**** **** 5678</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified
              </span>
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
          onClick={() => {
            setActiveTab("add_account");
            toast.info("Opening Add Bank Account form...");
          }}
          className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-sm transition-colors cursor-pointer w-fit"
        >
          <Plus className="h-4 w-4" />
          Add New Bank Account
        </button>
      </div>

      {/* Table of Bank Accounts */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50/70 text-gray-400 font-semibold text-[10px] uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-4">Bank Details</th>
                <th className="py-3 px-4">Account Holder Name</th>
                <th className="py-3 px-4">Account Number</th>
                <th className="py-3 px-4">IFSC Code</th>
                <th className="py-3 px-4">Account Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Primary</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {accounts.map((acc) => {
                const isRevealed = revealedIds[acc.id];
                return (
                  <tr key={acc.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Bank Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl ${acc.bgColor} ${acc.textColor} flex items-center justify-center font-black text-xs shrink-0 shadow-xs`}
                        >
                          {acc.logo}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-[11px]">{acc.bankName}</p>
                          <p className="text-[10px] text-gray-400">{acc.branch}</p>
                        </div>
                      </div>
                    </td>

                    {/* Holder */}
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-gray-800 text-[11px]">{acc.holderName}</p>
                      {acc.status === "Active" ? (
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded inline-block mt-0.5">
                          Verified
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded inline-block mt-0.5">
                          Pending Verification
                        </span>
                      )}
                    </td>

                    {/* Account Number */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <span>{isRevealed ? acc.accountNumber : acc.maskedNumber}</span>
                        <button
                          type="button"
                          onClick={() => toggleReveal(acc.id)}
                          className="text-gray-400 hover:text-gray-600 p-0.5"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                      </div>
                    </td>

                    {/* IFSC Code */}
                    <td className="py-3.5 px-4 font-mono font-medium text-gray-600 text-[11px]">
                      {acc.ifsc}
                    </td>

                    {/* Account Type */}
                    <td className="py-3.5 px-4 text-gray-600 text-[11px]">
                      {acc.type}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            acc.status === "Active" ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        <span
                          className={`font-semibold text-[11px] ${
                            acc.status === "Active" ? "text-emerald-700" : "text-amber-700"
                          }`}
                        >
                          {acc.status}
                        </span>
                      </div>
                    </td>

                    {/* Primary badge */}
                    <td className="py-3.5 px-4">
                      {acc.isPrimary ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Primary
                        </span>
                      ) : (
                        <button
                          onClick={() => setPrimaryAccount(acc.id)}
                          className="text-gray-400 hover:text-emerald-600 text-[11px] transition-colors"
                        >
                          —
                        </button>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toast.info(`Options for ${acc.bankName}`)}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

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
            onClick={() => toast.info("Contacting support...")}
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
    </div>
  );
}
