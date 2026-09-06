import React, { useState } from "react";
import { UserCheck, Plus, Trash2, Shield, Eye, EyeOff, Key, RefreshCw, Copy, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import type { AdminUserItem } from "../types.ts";
import { toast } from "sonner";

interface AdminUsersViewProps {
  adminUsers: AdminUserItem[];
  setAdminUsers: React.Dispatch<React.SetStateAction<AdminUserItem[]>>;
}

export default function AdminUsersView({ adminUsers, setAdminUsers }: AdminUsersViewProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUserItem | null>(null);
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [showFormPassword, setShowFormPassword] = useState(false);

  const [newAdmin, setNewAdmin] = useState<Partial<AdminUserItem>>({
    name: "",
    email: "",
    role: "Operations Admin",
    status: "active",
    password: "",
  });

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$";
    let pass = "Kriv";
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email) {
      toast.error("Name and email are required.");
      return;
    }
    const finalPassword = newAdmin.password?.trim() || generatePassword();

    const created: AdminUserItem = {
      id: `ADM${Math.floor(100 + Math.random() * 900)}`,
      name: newAdmin.name.trim(),
      email: newAdmin.email.trim(),
      role: newAdmin.role || "Operations Admin",
      status: "active",
      lastLogin: "Never",
      password: finalPassword,
    };

    setAdminUsers((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewAdmin({ name: "", email: "", role: "Operations Admin", status: "active", password: "" });
    toast.success(`Admin User ${created.name} created with password: ${finalPassword}`);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    setAdminUsers((prev) =>
      prev.map((a) => (a.id === editingAdmin.id ? { ...a, password: editingAdmin.password } : a))
    );
    toast.success(`Password updated for ${editingAdmin.name}`);
    setEditingAdmin(null);
  };

  const handleDelete = (id: string) => {
    setAdminUsers((prev) => prev.filter((a) => a.id !== id));
    toast.success("Admin user deleted.");
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswordMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-emerald-400" /> Admin Users & Staff Personnel
          </h2>
          <p className="text-xs text-gray-400 mt-1">Manage internal administrative accounts, security roles, and allot login passwords.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs h-9">
          <Plus className="h-4 w-4 mr-1" /> Add Admin User
        </Button>
      </div>

      {/* Admin Users Table */}
      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Admin Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Allotted Password</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {adminUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    <Shield className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    No admin users created yet. Click "Add Admin User" above to create one.
                  </td>
                </tr>
              ) : (
                adminUsers.map((a) => {
                  const isVisible = !!showPasswordMap[a.id];
                  const passwordDisplay = a.password || "Adi890655";

                  return (
                    <tr key={a.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-400" />
                        {a.name}
                      </td>
                      <td className="py-3.5 px-4 text-gray-300 font-mono">{a.email}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">{a.role}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 font-mono text-gray-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 w-fit">
                          <Key className="h-3 w-3 text-amber-400" />
                          <span>{isVisible ? passwordDisplay : "••••••••"}</span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(a.id)}
                            className="text-gray-400 hover:text-white ml-1 cursor-pointer"
                            title={isVisible ? "Hide Password" : "Show Password"}
                          >
                            {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(passwordDisplay, "Password")}
                            className="text-gray-400 hover:text-emerald-400 ml-0.5 cursor-pointer"
                            title="Copy Password"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge className="bg-emerald-500/10 text-emerald-400">{a.status}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 font-mono">{a.lastLogin}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingAdmin(a)}
                            className="text-xs text-amber-400 hover:text-amber-300 border border-amber-500/20 h-7 px-2"
                            title="Reset / Update Password"
                          >
                            <Edit2 className="h-3.5 w-3.5 mr-1" /> Key
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(a.id)}
                            className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 h-7 px-2"
                            title="Delete Admin User"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-emerald-400" /> Add New Admin User
            </h3>
            <form onSubmit={handleAddAdmin} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 mb-1 block font-semibold">Full Name *</label>
                <Input
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  placeholder="e.g. Aditya Saha"
                  className="bg-white/5 border-white/10 text-white text-xs h-9"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 mb-1 block font-semibold">Email Address *</label>
                <Input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  placeholder="aditya@krivexa.com"
                  className="bg-white/5 border-white/10 text-white text-xs h-9"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 mb-1 block font-semibold">Role</label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 text-white text-xs rounded-xl p-2.5 outline-none"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Operations Admin">Operations Admin</option>
                  <option value="Finance Admin">Finance Admin</option>
                  <option value="Support Admin">Support Admin</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-gray-300 font-semibold flex items-center gap-1">
                    <Key className="h-3.5 w-3.5 text-amber-400" /> Allot Login Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewAdmin({ ...newAdmin, password: generatePassword() })}
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" /> Auto Generate
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showFormPassword ? "text" : "password"}
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    placeholder="Enter or generate login password"
                    className="bg-white/5 border-white/10 text-white text-xs h-9 pr-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowFormPassword(!showFormPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showFormPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">This password will be assigned for the user to log into the admin panel.</p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)} className="text-xs text-gray-300 border border-white/10">
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-500 text-black font-bold text-xs">
                  Create Admin User
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Password Modal */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Key className="h-5 w-5 text-amber-400" /> Update Password for {editingAdmin.name}
            </h3>
            <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-400 mb-1 block">New Login Password</label>
                <div className="relative">
                  <Input
                    type={showFormPassword ? "text" : "password"}
                    value={editingAdmin.password || ""}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, password: e.target.value })}
                    placeholder="Enter new password"
                    className="bg-white/5 border-white/10 text-white text-xs h-9 pr-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowFormPassword(!showFormPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showFormPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <Button type="button" variant="ghost" onClick={() => setEditingAdmin(null)} className="text-xs text-gray-300 border border-white/10">
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-500 text-black font-bold text-xs">
                  Save New Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
