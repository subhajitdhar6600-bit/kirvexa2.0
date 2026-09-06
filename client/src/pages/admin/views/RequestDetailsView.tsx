import React, { useState } from "react";
import { ArrowLeft, Send, CheckCircle2, MessageSquareText, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import type { RequestItem } from "../types.ts";
import { toast } from "sonner";

interface RequestDetailsViewProps {
  request: RequestItem;
  onRequestChange: (updated: RequestItem) => void;
  onBack: () => void;
}

export default function RequestDetailsView({ request, onRequestChange, onBack }: RequestDetailsViewProps) {
  const [replyText, setReplyText] = useState("");
  const [status, setStatus] = useState(request.status);
  const [assignedTo, setAssignedTo] = useState(request.assignedTo);
  const [priority, setPriority] = useState(request.priority);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const newMsg = {
      sender: "Kshitiz Rahul",
      role: "Admin",
      time: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      message: replyText
    };
    const updated: RequestItem = {
      ...request,
      status: status,
      assignedTo: assignedTo,
      priority: priority,
      conversation: [...request.conversation, newMsg]
    };
    onRequestChange(updated);
    setReplyText("");
    toast.success("Reply sent to user!");
  };

  const handleResolve = () => {
    const updated: RequestItem = { ...request, status: "resolved" };
    setStatus("resolved");
    onRequestChange(updated);
    toast.success("Request marked as resolved!");
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-xs text-gray-300 hover:text-white border border-white/10">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Requests List
        </Button>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-white font-mono">
            Request Details - {request.id}
          </h2>
          <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30 capitalize">
            {status.replace("_", " ")}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Request Info & Conversation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Info Card */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-emerald-400" /> {request.subject}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-gray-400">Submitted User</p>
                <p className="font-bold text-white mt-0.5">{request.user}</p>
              </div>
              <div>
                <p className="text-gray-400">Request Type</p>
                <p className="font-bold text-emerald-400 mt-0.5">{request.type}</p>
              </div>
              <div>
                <p className="text-gray-400">Date Submitted</p>
                <p className="font-bold text-white mt-0.5">{request.date}</p>
              </div>
              <div>
                <p className="text-gray-400">Assigned Admin</p>
                <p className="font-bold text-white mt-0.5">{assignedTo}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 mb-1">Description / Inquiry</p>
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-200 leading-relaxed">
                  {request.description}
                </div>
              </div>
            </div>
          </div>

          {/* Conversation Thread */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
            <h4 className="font-bold text-sm text-white border-b border-white/10 pb-3">Conversation Timeline</h4>
            <div className="space-y-4">
              {request.conversation.map((msg, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border text-xs space-y-1 ${
                    msg.role === "Admin"
                      ? "bg-emerald-500/10 border-emerald-500/30 ml-6"
                      : "bg-white/5 border-white/10 mr-6"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      {msg.sender} <Badge className="text-[9px] py-0 px-1.5">{msg.role}</Badge>
                    </span>
                    <span className="text-gray-400 font-mono">{msg.time}</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed pt-1">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSendReply} className="pt-4 border-t border-white/10 space-y-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response to the user..."
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-3 text-xs outline-none focus:border-emerald-500/50 resize-none h-24"
              />
              <div className="flex justify-end gap-2">
                <Button type="submit" className="bg-emerald-500 text-black font-bold text-xs">
                  <Send className="h-3.5 w-3.5 mr-1.5" /> Reply to User
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: Admin Controls */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-5 space-y-5 h-fit shadow-xl">
          <h3 className="font-bold text-sm text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-emerald-400" /> Admin Actions
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-gray-300 font-semibold mb-1 block">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RequestItem["status"])}
                className="w-full bg-[#1a1a1a] border border-white/10 text-white text-xs rounded-xl p-2.5 outline-none cursor-pointer"
              >
                <option value="new">New</option>
                <option value="in_review">In Review</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="text-gray-300 font-semibold mb-1 block">Assigned To</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 text-white text-xs rounded-xl p-2.5 outline-none cursor-pointer"
              >
                <option value="Kshitiz Rahul">Kshitiz Rahul</option>
                <option value="Aditya Saha">Aditya Saha (Super Admin)</option>
                <option value="Neha Verma">Neha Verma</option>
                <option value="Ankit Singh">Ankit Singh</option>
              </select>
            </div>

            <div>
              <label className="text-gray-300 font-semibold mb-1 block">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as RequestItem["priority"])}
                className="w-full bg-[#1a1a1a] border border-white/10 text-white text-xs rounded-xl p-2.5 outline-none cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <Button onClick={handleResolve} className="w-full bg-emerald-500 text-black font-bold text-xs mt-3">
              <CheckCircle2 className="h-4 w-4 mr-2" /> Mark Resolved
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
