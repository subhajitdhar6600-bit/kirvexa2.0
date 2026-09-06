import { AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import type { ComplaintItem } from "../types.ts";
import { toast } from "sonner";

interface ComplaintsViewProps {
  complaints: ComplaintItem[];
  setComplaints: React.Dispatch<React.SetStateAction<ComplaintItem[]>>;
}

export default function ComplaintsView({ complaints, setComplaints }: ComplaintsViewProps) {
  const handleResolve = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "resolved" as const } : c))
    );
    toast.success("Complaint marked as resolved.");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" /> Complaints & Dispute Resolution Center
          </h2>
          <p className="text-xs text-gray-400">Review quality, payment, and logistics complaints reported by farmers and dealers.</p>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">CMP ID</th>
                <th className="py-3.5 px-4">Complainant</th>
                <th className="py-3.5 px-4">Against</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {complaints.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{c.id}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{c.complainant}</td>
                  <td className="py-3.5 px-4 text-gray-300">{c.against}</td>
                  <td className="py-3.5 px-4 text-amber-400 font-medium">{c.category}</td>
                  <td className="py-3.5 px-4 text-gray-200">{c.subject}</td>
                  <td className="py-3.5 px-4 text-gray-400 font-mono">{c.date}</td>
                  <td className="py-3.5 px-4">
                    <Badge
                      className={
                        c.status === "resolved"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }
                    >
                      {c.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {c.status !== "resolved" ? (
                      <Button
                        size="sm"
                        onClick={() => handleResolve(c.id)}
                        className="bg-emerald-500 text-black font-bold text-xs h-7 px-3"
                      >
                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Mark Resolved
                      </Button>
                    ) : (
                      <span className="text-emerald-400 font-semibold">Resolved</span>
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
