import { useState } from "react";
import { CheckCircle, XCircle, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import type { VerificationItem } from "../types.ts";
import { toast } from "sonner";

interface VerificationsViewProps {
  verifications: VerificationItem[];
  setVerifications: React.Dispatch<React.SetStateAction<VerificationItem[]>>;
}

export default function VerificationsView({ verifications, setVerifications }: VerificationsViewProps) {
  const [activeTab, setActiveTab] = useState<"Farmer Verification" | "Dealer Verification" | "Document Verification">("Farmer Verification");
  const [selectedDoc, setSelectedDoc] = useState<VerificationItem | null>(null);

  const farmerCount = verifications.filter((v) => v.type === "Farmer").length;
  const dealerCount = verifications.filter((v) => v.type === "Dealer").length;
  const docCount = verifications.length;

  const currentList = verifications.filter((v) => {
    if (activeTab === "Farmer Verification") return v.type === "Farmer";
    if (activeTab === "Dealer Verification") return v.type === "Dealer";
    return true;
  });

  const handleApprove = (id: string) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "approved" as const } : v))
    );
    toast.success("Verification request approved!");
  };

  const handleReject = (id: string) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "rejected" as const } : v))
    );
    toast.error("Verification request rejected.");
  };

  return (
    <div className="space-y-6">
      {/* Top Tabs */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-2 flex gap-2">
        <button
          onClick={() => setActiveTab("Farmer Verification")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "Farmer Verification"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <span>Farmer Verification</span>
          <Badge className="bg-emerald-500/20 text-emerald-400">{farmerCount}</Badge>
        </button>
        <button
          onClick={() => setActiveTab("Dealer Verification")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "Dealer Verification"
              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <span>Dealer Verification</span>
          <Badge className="bg-amber-500/20 text-amber-400">{dealerCount}</Badge>
        </button>
        <button
          onClick={() => setActiveTab("Document Verification")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "Document Verification"
              ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <span>Document Verification</span>
          <Badge className="bg-blue-500/20 text-blue-400">{docCount}</Badge>
        </button>
      </div>

      {/* Verification Table */}
      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Req ID</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Submitted On</th>
                <th className="py-3.5 px-4">Documents</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentList.map((v) => (
                <tr key={v.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{v.id}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{v.user}</td>
                  <td className="py-3.5 px-4 text-gray-300">{v.type}</td>
                  <td className="py-3.5 px-4 text-gray-400">{v.submittedOn}</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> {v.documentsCount} Docs
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      className={
                        v.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : v.status === "pending"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }
                    >
                      {v.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedDoc(v)}
                      className="text-xs text-gray-300 hover:text-white border border-white/10 h-7 px-2.5"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> Review
                    </Button>
                    {v.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(v.id)}
                          className="bg-emerald-500 text-black font-bold text-xs h-7 px-2.5"
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleReject(v.id)}
                          className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 h-7 px-2.5"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Verification Details - {selectedDoc.id}</h3>
              <Badge className="bg-emerald-500/10 text-emerald-400">{selectedDoc.status}</Badge>
            </div>
            <div className="space-y-2 text-xs">
              <p><strong className="text-gray-400">Submitted By:</strong> <span className="text-white font-bold">{selectedDoc.user} ({selectedDoc.type})</span></p>
              <p><strong className="text-gray-400">Verification Type:</strong> <span className="text-white">{selectedDoc.verificationType}</span></p>
              <p><strong className="text-gray-400">Submission Date:</strong> <span className="text-white">{selectedDoc.submittedOn}</span></p>

              <div className="pt-3">
                <p className="font-bold text-white mb-2">Attached Documents:</p>
                <div className="space-y-2">
                  {selectedDoc.documents.map((doc, idx) => (
                    <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-emerald-400" />
                        <span className="font-semibold text-white">{doc.name}</span>
                      </div>
                      <Badge className="bg-white/10 text-gray-300">{doc.type}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <Button variant="ghost" onClick={() => setSelectedDoc(null)} className="text-xs border border-white/10 text-gray-300">
                Close
              </Button>
              {selectedDoc.status === "pending" && (
                <Button onClick={() => { handleApprove(selectedDoc.id); setSelectedDoc(null); }} className="bg-emerald-500 text-black font-bold text-xs">
                  Approve Verification
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
