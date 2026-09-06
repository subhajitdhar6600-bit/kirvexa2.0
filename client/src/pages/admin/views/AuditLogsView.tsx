import { useState } from "react";
import { ClipboardList, Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import type { AuditLogItem } from "../types.ts";

interface AuditLogsViewProps {
  auditLogs: AuditLogItem[];
}

export default function AuditLogsView({ auditLogs }: AuditLogsViewProps) {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");

  const filteredLogs = auditLogs.filter((log) => {
    const matchSearch =
      log.adminName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.id.toLowerCase().includes(search.toLowerCase());
    const matchMod = moduleFilter === "all" || log.module.toLowerCase() === moduleFilter.toLowerCase();
    return matchSearch && matchMod;
  });

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 text-white text-xs rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Modules</option>
            <option value="farmers">Farmers</option>
            <option value="dealers">Dealers</option>
            <option value="payments">Payments</option>
            <option value="announcements">Announcements</option>
          </select>

          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search log ID, admin, action, details..."
              className="bg-white/5 border-white/10 text-white text-xs pl-9 h-9 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Log ID</th>
                <th className="py-3.5 px-4">Admin</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Module</th>
                <th className="py-3.5 px-4">Details</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-500">
                    <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p className="font-semibold text-sm">No audit logs yet</p>
                    <p className="text-[11px] mt-1 text-gray-600">
                      Admin actions and system events will be logged here automatically.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{log.id}</td>
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <ClipboardList className="h-3.5 w-3.5 text-emerald-400" />
                      {log.adminName}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">{log.action}</td>
                    <td className="py-3.5 px-4 text-gray-300 font-medium">{log.module}</td>
                    <td className="py-3.5 px-4 text-gray-300 max-w-xs truncate">{log.details}</td>
                    <td className="py-3.5 px-4 text-gray-400 font-mono">{log.dateTime}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-gray-500">{log.ipAddress}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
