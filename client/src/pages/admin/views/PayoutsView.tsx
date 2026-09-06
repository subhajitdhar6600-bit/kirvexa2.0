import { Banknote, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import type { PayoutItem } from "../types.ts";
import { toast } from "sonner";

interface PayoutsViewProps {
  payouts: PayoutItem[];
  setPayouts: React.Dispatch<React.SetStateAction<PayoutItem[]>>;
}

export default function PayoutsView({ payouts, setPayouts }: PayoutsViewProps) {
  const handleProcessPayout = (id: string) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "processed" as const } : p))
    );
    toast.success("Payout processed & released to bank account!");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Banknote className="h-5 w-5 text-emerald-400" /> Payouts & Commissions Settlement
          </h2>
          <p className="text-xs text-gray-400">Manage dealer and farmer net payouts after platform commission deduction.</p>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Payout ID</th>
                <th className="py-3.5 px-4">Recipient</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Gross Amount</th>
                <th className="py-3.5 px-4">Commission %</th>
                <th className="py-3.5 px-4">Net Payout</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{p.id}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{p.recipient}</td>
                  <td className="py-3.5 px-4 text-gray-300">{p.recipientType}</td>
                  <td className="py-3.5 px-4 text-gray-300 font-mono">₹{p.grossAmount.toLocaleString("en-IN")}</td>
                  <td className="py-3.5 px-4 font-bold text-amber-400">{p.commissionPct}%</td>
                  <td className="py-3.5 px-4 font-black text-emerald-400">₹{p.netPayout.toLocaleString("en-IN")}</td>
                  <td className="py-3.5 px-4">
                    <Badge
                      className={
                        p.status === "processed"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {p.status === "pending" ? (
                      <Button
                        size="sm"
                        onClick={() => handleProcessPayout(p.id)}
                        className="bg-emerald-500 text-black font-bold text-xs h-7 px-3"
                      >
                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Process Payout
                      </Button>
                    ) : (
                      <span className="text-emerald-400 font-semibold">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
