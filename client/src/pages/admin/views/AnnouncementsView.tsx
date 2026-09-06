import React, { useState } from "react";
import { Megaphone, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import type { AnnouncementItem } from "../types.ts";
import { toast } from "sonner";

interface AnnouncementsViewProps {
  announcements: AnnouncementItem[];
  setAnnouncements: React.Dispatch<React.SetStateAction<AnnouncementItem[]>>;
}

export default function AnnouncementsView({ announcements, setAnnouncements }: AnnouncementsViewProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAnn, setNewAnn] = useState<Partial<AnnouncementItem>>({
    title: "",
    audience: "All Users",
    type: "Announcement",
    content: ""
  });

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnn.title || !newAnn.content) {
      toast.error("Title and content are required.");
      return;
    }
    const created: AnnouncementItem = {
      id: `ANN${Math.floor(600 + Math.random() * 400)}`,
      title: newAnn.title || "New Announcement",
      audience: newAnn.audience || "All Users",
      type: newAnn.type || "Announcement",
      publishedOn: "20 May 2024",
      status: "published",
      content: newAnn.content || ""
    };
    setAnnouncements((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    toast.success("Announcement broadcasted successfully!");
  };

  const handleDelete = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    toast.success("Announcement removed.");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-emerald-400" /> Communications & System Broadcasts
          </h2>
          <p className="text-xs text-gray-400">Publish guidelines, alerts, and platform announcements to farmers and dealers.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs h-9">
          <Plus className="h-4 w-4 mr-1" /> New Announcement
        </Button>
      </div>

      {/* Announcements Table */}
      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Audience</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Published On</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {announcements.map((a) => (
                <tr key={a.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-emerald-400" />
                    {a.title}
                  </td>
                  <td className="py-3.5 px-4 text-gray-300 font-semibold">{a.audience}</td>
                  <td className="py-3.5 px-4 text-gray-300">{a.type}</td>
                  <td className="py-3.5 px-4 text-gray-400 font-mono">{a.publishedOn}</td>
                  <td className="py-3.5 px-4">
                    <Badge
                      className={
                        a.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                      }
                    >
                      {a.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(a.id)}
                      className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 h-7 px-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">New Announcement</h3>
            <form onSubmit={handleAddAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 mb-1 block font-semibold">Title *</label>
                <Input
                  value={newAnn.title}
                  onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                  placeholder="Title e.g. Subsidy Update 2024"
                  className="bg-white/5 border-white/10 text-white text-xs h-9"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-300 mb-1 block font-semibold">Audience</label>
                  <select
                    value={newAnn.audience}
                    onChange={(e) => setNewAnn({ ...newAnn, audience: e.target.value as AnnouncementItem["audience"] })}
                    className="w-full bg-[#1a1a1a] border border-white/10 text-white text-xs rounded-xl p-2 outline-none"
                  >
                    <option value="All Users">All Users</option>
                    <option value="Farmers">Farmers</option>
                    <option value="Dealers">Dealers</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-300 mb-1 block font-semibold">Type</label>
                  <select
                    value={newAnn.type}
                    onChange={(e) => setNewAnn({ ...newAnn, type: e.target.value as AnnouncementItem["type"] })}
                    className="w-full bg-[#1a1a1a] border border-white/10 text-white text-xs rounded-xl p-2 outline-none"
                  >
                    <option value="Announcement">Announcement</option>
                    <option value="Alert">Alert</option>
                    <option value="System Maintenance">System Maintenance</option>
                    <option value="Policy Update">Policy Update</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-gray-300 mb-1 block font-semibold">Content *</label>
                <textarea
                  value={newAnn.content}
                  onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                  placeholder="Announcement message body..."
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-3 text-xs outline-none h-24 resize-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)} className="text-xs text-gray-300 border border-white/10">
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-500 text-black font-bold text-xs">
                  Broadcast
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
