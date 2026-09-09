import React, { useState } from "react";
import {
  Shield, Plus, Edit2, Trash2, Check, X, ChevronDown,
  Users, Lock, Settings, ShieldCheck, CheckCircle2,
  Store, Tractor, UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import type { RoleItem } from "../types.ts";

interface RolesViewProps {
  roles?: RoleItem[];
  setRoles?: React.Dispatch<React.SetStateAction<RoleItem[]>>;
}

const SYSTEM_ROLES = [
  { id: "role_admin", roleName: "Super Admin", description: "Full administrative access to Farma platform, database, and configurations", userCount: 1, status: "Active", createdBy: "System", createdOn: "01 Jan 2026", color: "from-red-500 to-red-600", Icon: Shield },
  { id: "role_dealer", roleName: "Dealer / Merchant", description: "Manage agri-inputs, seed & fertilizer inventory, order dispatch, and earnings", userCount: 2, status: "Active", createdBy: "Super Admin", createdOn: "05 Jan 2026", color: "from-orange-500 to-orange-600", Icon: Store },
  { id: "role_farmer", roleName: "Farmer Member", description: "Buy quality inputs, list harvested crops, book machinery, and access KCC loans", userCount: 5, status: "Active", createdBy: "System", createdOn: "10 Jan 2026", color: "from-emerald-500 to-emerald-600", Icon: UserCheck },
  { id: "role_chc", roleName: "Service Provider (CHC)", description: "Manage Custom Hiring Center equipment, tractors, harvesters, and labour booking", userCount: 1, status: "Active", createdBy: "Super Admin", createdOn: "15 Jan 2026", color: "from-violet-500 to-violet-600", Icon: Tractor },
];

const ALL_MODULES = [
  "Dashboard", "Users Management", "Farmer Management", "Products",
  "Orders & Sales", "RFQ / Wholesale", "Bookings", "Services",
  "Finance & Wallet", "Reports & Analytics", "CMS / Pages",
  "Notifications", "Support Tickets", "System Settings", "Activity Logs",
];

const PERMS_LABELS = ["View", "Add", "Edit", "Delete"];

export default function RolesView({ roles: propRoles, setRoles }: RolesViewProps) {
  const [selectedRole, setSelectedRole] = useState(SYSTEM_ROLES[0]);
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>(() => {
    const init: Record<string, Record<string, boolean>> = {};
    ALL_MODULES.forEach(mod => {
      init[mod] = { View: true, Add: mod !== "System Settings" && mod !== "Activity Logs", Edit: mod !== "System Settings" && mod !== "Activity Logs", Delete: false };
    });
    return init;
  });

  const togglePerm = (mod: string, perm: string) => {
    setPermissions(prev => ({
      ...prev,
      [mod]: { ...prev[mod], [perm]: !prev[mod][perm] }
    }));
    toast.success(`${perm} permission toggled for ${mod}`);
  };

  const selectAll = () => {
    const all: Record<string, Record<string, boolean>> = {};
    ALL_MODULES.forEach(mod => { all[mod] = { View: true, Add: true, Edit: true, Delete: true }; });
    setPermissions(all);
    toast.success("All permissions granted");
  };

  const deselectAll = () => {
    const none: Record<string, Record<string, boolean>> = {};
    ALL_MODULES.forEach(mod => { none[mod] = { View: false, Add: false, Edit: false, Delete: false }; });
    setPermissions(none);
    toast.info("All permissions cleared");
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage your platform roles and set permissions for different modules</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Dashboard</span><span>âº</span>
          <span>Users Management</span><span>âº</span>
          <span className="text-emerald-600 font-medium">Roles & Permissions</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Roles", value: SYSTEM_ROLES.length.toString(), sub: "Configured roles", Icon: Shield, bg: "bg-emerald-50", color: "text-emerald-600" },
          { label: "Active Roles", value: SYSTEM_ROLES.filter(r => r.status === "Active").length.toString(), sub: "100% active", Icon: CheckCircle2, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Total Permissions", value: (ALL_MODULES.length * 4).toString(), sub: "Across all modules", Icon: Lock, bg: "bg-violet-50", color: "text-violet-600" },
          { label: "System Modules", value: ALL_MODULES.length.toString(), sub: "Protected modules", Icon: Settings, bg: "bg-amber-50", color: "text-amber-600" },
        ].map((s, i) => {
          const IconComp = s.Icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <IconComp className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className={`text-[11px] ${s.color} mt-1 font-medium`}>{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Split: Roles List + Role Details */}
      <div className="flex gap-4">
        {/* Roles List */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">Roles List</h2>
            <Button onClick={() => toast.info("Role configuration is managed via role templates.")} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 rounded-xl font-semibold gap-1.5 cursor-pointer">
              <Plus className="h-3.5 w-3.5" /> Add New Role
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4 text-left w-8">#</th>
                  <th className="py-3 px-4 text-left">Role Name</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-center">Users</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {SYSTEM_ROLES.map((r, idx) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedRole(r)}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors ${selectedRole.id === r.id ? "bg-emerald-50/50" : ""}`}
                  >
                    <td className="py-3.5 px-4 text-gray-400 font-medium">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white shadow-2xs`}>
                          <r.Icon className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-gray-800">{r.roleName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 max-w-[220px]">{r.description}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold">{r.userCount}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {r.status === "Active"
                        ? <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">Active</span>
                        : <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[11px] font-semibold">Inactive</span>
                      }
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={e => { e.stopPropagation(); setSelectedRole(r); toast.info(`Selected ${r.roleName} to edit permissions`); }}
                          className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-600 cursor-pointer"
                          title="Edit Permissions"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-gray-100 text-center text-[11px] text-gray-400">
            Showing {SYSTEM_ROLES.length} of {SYSTEM_ROLES.length} roles
          </div>
        </div>

        {/* Role Details Panel */}
        <div className="w-64 shrink-0 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
            <p className="text-xs font-bold text-gray-800">Role Details</p>
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block">Select Role</label>
              <select
                value={selectedRole.id}
                onChange={e => {
                  const found = SYSTEM_ROLES.find(r => r.id === e.target.value);
                  if (found) setSelectedRole(found);
                }}
                className="w-full h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium cursor-pointer"
              >
                {SYSTEM_ROLES.map(r => (
                  <option key={r.id} value={r.id}>{r.roleName}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${selectedRole.color} flex items-center justify-center text-white shadow-sm`}>
                <selectedRole.Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{selectedRole.roleName}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div><span className="text-gray-400">Description</span><p className="text-gray-700 mt-0.5">{selectedRole.description}</p></div>
              <div className="flex items-center justify-between"><span className="text-gray-400">Created On</span><span className="font-semibold text-gray-700">{selectedRole.createdOn}</span></div>
              <div className="flex items-center justify-between"><span className="text-gray-400">Created By</span><span className="font-semibold text-gray-700">{selectedRole.createdBy}</span></div>
              <div className="flex items-center justify-between"><span className="text-gray-400">Total Users</span><span className="font-semibold text-gray-700">{selectedRole.userCount}</span></div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${selectedRole.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>{selectedRole.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">Permissions ({selectedRole.roleName} Role)</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Quick Actions:</span>
            <button onClick={selectAll} className="h-7 px-3 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 border border-emerald-200 cursor-pointer">Select All</button>
            <button onClick={deselectAll} className="h-7 px-3 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 border border-gray-200 cursor-pointer">Deselect All</button>
            <button onClick={() => toast.success(`Permissions saved for ${selectedRole.roleName}!`)} className="h-7 px-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 cursor-pointer shadow-xs">Save Changes</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {ALL_MODULES.map(mod => (
            <div key={mod} className="border border-gray-100 rounded-xl p-3 bg-gray-50/50">
              <p className="text-xs font-semibold text-gray-800 mb-2.5 flex items-center gap-1.5">
                <Shield className="h-3 w-3 text-emerald-500" />{mod}
              </p>
              <div className="flex flex-wrap gap-2">
                {PERMS_LABELS.map(perm => {
                  const isOn = permissions[mod]?.[perm] ?? false;
                  return (
                    <label key={perm} className="flex items-center gap-1 cursor-pointer select-none" onClick={() => togglePerm(mod, perm)}>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${isOn ? "bg-emerald-500 border-emerald-500" : "bg-white border-gray-300"}`}>
                        {isOn && <Check className="h-2.5 w-2.5 text-white" />}
                      </div>
                      <span className="text-[11px] text-gray-600">{perm}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-4">* Permissions define what actions users in this role can perform in the system.</p>
      </div>

      <div className="text-center text-[11px] text-gray-400">
        Â© 2026 Farma. All rights reserved. &nbsp; Made with pure SVG icons for Bihar Farmers
      </div>
    </div>
  );
}
