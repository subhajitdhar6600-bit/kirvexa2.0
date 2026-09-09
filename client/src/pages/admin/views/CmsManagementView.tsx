import { useState } from "react";
import {
  FileText, Globe, Layout, Newspaper, Plus, Edit, MoreVertical,
  Search, Filter, ChevronRight, CheckCircle2, ArrowRight, Video,
  Code, Image, Menu, BookOpen
} from "lucide-react";
import { toast } from "sonner";

interface PageItem {
  id: string;
  title: string;
  type: "Landing Page" | "Static Page" | "Blog Listing" | "Blog Page";
  slug: string;
  status: "Published" | "Draft" | "Scheduled";
  lastUpdated: string;
}

const PAGES_DATA: PageItem[] = [
  { id: "1", title: "Home Page", type: "Landing Page", slug: "/", status: "Published", lastUpdated: "25 May 2025 10:30 AM" },
  { id: "2", title: "About Us", type: "Static Page", slug: "/about-us", status: "Published", lastUpdated: "24 May 2025 04:15 PM" },
  { id: "3", title: "Our Services", type: "Static Page", slug: "/services", status: "Published", lastUpdated: "24 May 2025 02:40 PM" },
  { id: "4", title: "Krivexo Card", type: "Static Page", slug: "/krivexo-card", status: "Published", lastUpdated: "23 May 2025 11:20 AM" },
  { id: "5", title: "For Farmers", type: "Landing Page", slug: "/for-farmers", status: "Published", lastUpdated: "23 May 2025 09:10 AM" },
  { id: "6", title: "For Retailers", type: "Landing Page", slug: "/for-retailers", status: "Published", lastUpdated: "22 May 2025 06:35 PM" },
  { id: "7", title: "Products", type: "Static Page", slug: "/products", status: "Published", lastUpdated: "22 May 2025 05:00 PM" },
  { id: "8", title: "Blog", type: "Blog Listing", slug: "/blog", status: "Published", lastUpdated: "21 May 2025 03:20 PM" },
  { id: "9", title: "Blog Details", type: "Blog Page", slug: "/blog/:id", status: "Published", lastUpdated: "21 May 2025 03:20 PM" },
  { id: "10", title: "Contact Us", type: "Static Page", slug: "/contact-us", status: "Published", lastUpdated: "20 May 2025 01:45 PM" },
  { id: "11", title: "Terms & Conditions", type: "Static Page", slug: "/terms-conditions", status: "Published", lastUpdated: "20 May 2025 11:10 AM" },
  { id: "12", title: "Privacy Policy", type: "Static Page", slug: "/privacy-policy", status: "Published", lastUpdated: "19 May 2025 04:30 PM" },
  { id: "13", title: "Refund Policy", type: "Static Page", slug: "/refund-policy", status: "Draft", lastUpdated: "19 May 2025 10:15 AM" },
  { id: "14", title: "Shipping Policy", type: "Static Page", slug: "/shipping-policy", status: "Draft", lastUpdated: "18 May 2025 02:00 PM" },
  { id: "15", title: "Careers", type: "Static Page", slug: "/careers", status: "Draft", lastUpdated: "18 May 2025 11:55 AM" },
];

const POPULAR_PAGES = [
  { title: "Home Page", views: "12,450", unique: "8,230", time: "02:34", bounce: "35.6%" },
  { title: "Krivexo Card", views: "7,850", unique: "5,420", time: "03:12", bounce: "32.1%" },
  { title: "For Farmers", views: "6,120", unique: "4,230", time: "02:48", bounce: "33.8%" },
  { title: "For Retailers", views: "5,740", unique: "3,980", time: "02:20", bounce: "31.4%" },
  { title: "Products", views: "4,980", unique: "3,210", time: "01:58", bounce: "28.9%" },
];

export default function CmsManagementView() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const filtered = PAGES_DATA.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All Types" || p.type === typeFilter;
    return matchSearch && matchType;
  });

  const getTypeBadge = (type: string) => {
    if (type === "Landing Page") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          Landing Page
        </span>
      );
    }
    if (type === "Static Page") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          Static Page
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
        {type}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">CMS / Pages Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Create, edit and manage all pages and content of the website</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-400 mr-2">
            <span>Dashboard</span>
            <span>âº</span>
            <span>CMS</span>
            <span>âº</span>
            <span className="text-emerald-600 font-semibold">Pages Management</span>
          </div>
          <button
            onClick={() => toast.info("Opening page creator...")}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create New Page
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Total Pages */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Total Pages</p>
            <p className="text-xl font-black text-gray-900 mt-0.5">58</p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              <span className="text-emerald-600 font-bold">Published: 48</span> &nbsp;
              <span className="text-amber-600 font-semibold">Draft: 10</span>
            </p>
          </div>
        </div>

        {/* Static Pages */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Static Pages</p>
            <p className="text-xl font-black text-gray-900 mt-0.5">24</p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              <span className="text-emerald-600 font-bold">Published: 21</span> &nbsp;
              <span className="text-amber-600 font-semibold">Draft: 3</span>
            </p>
          </div>
        </div>

        {/* Landing Pages */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Layout className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Landing Pages</p>
            <p className="text-xl font-black text-gray-900 mt-0.5">12</p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              <span className="text-emerald-600 font-bold">Published: 11</span> &nbsp;
              <span className="text-amber-600 font-semibold">Draft: 1</span>
            </p>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Newspaper className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Blog Posts</p>
            <p className="text-xl font-black text-gray-900 mt-0.5">22</p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              <span className="text-emerald-600 font-bold">Published: 16</span> &nbsp;
              <span className="text-amber-600 font-semibold">Draft: 6</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-8 px-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none"
          >
            <option>All Types</option>
            <option>Landing Page</option>
            <option>Static Page</option>
            <option>Blog Listing</option>
            <option>Blog Page</option>
          </select>

          <select className="h-8 px-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>

          <select className="h-8 px-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none">
            <option>All Languages</option>
            <option>Hindi</option>
            <option>English</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            onClick={() => toast.info("Filter modal")}
            className="flex items-center gap-1 h-8 px-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-50 shadow-xs"
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Pages Table + Right Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Pages Table (2 Cols) */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-gray-50/70 text-gray-400 font-semibold text-[10px] uppercase tracking-wider border-b border-gray-100">
                    <th className="py-2.5 px-4">Page Title</th>
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4">Slug / URL</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Last Updated</th>
                    <th className="py-2.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-gray-800 text-[11px]">
                        <div className="flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          {row.title}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getTypeBadge(row.type)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-gray-500">
                        {row.slug}
                      </td>
                      <td className="py-3 px-4">
                        {row.status === "Published" ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-[10.5px]">
                        {row.lastUpdated}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => toast.info(`Editing ${row.title}`)}
                            className="p-1 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => toast.info(`Options for ${row.title}`)}
                            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 px-4 py-2.5 text-xs text-gray-500 gap-2">
              <span>Showing 1 to 15 of 58 pages</span>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px]">
                  â¹
                </button>
                <button className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-bold text-[11px]">
                  1
                </button>
                <button className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px]">
                  2
                </button>
                <button className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px]">
                  3
                </button>
                <button className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px]">
                  4
                </button>
                <span>...</span>
                <button className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px]">
                  6
                </button>
                <button className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px]">
                  âº
                </button>
              </div>
            </div>
          </div>

          {/* Popular Pages Performance + Need Help Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Performance table (2 cols) */}
            <div className="md:col-span-2 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2.5">
              <h3 className="text-xs font-bold text-gray-800">Popular Pages Performance (Last 30 Days)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-gray-400 text-[10px] uppercase font-semibold border-b border-gray-100">
                      <th className="py-2">Page Title</th>
                      <th className="py-2">Page Views</th>
                      <th className="py-2">Unique Views</th>
                      <th className="py-2">Avg. Time</th>
                      <th className="py-2">Bounce Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-[11px]">
                    {POPULAR_PAGES.map((p, i) => (
                      <tr key={i}>
                        <td className="py-2 font-semibold text-gray-800 flex items-center gap-1.5">
                          <FileText className="h-3 w-3 text-emerald-600" />
                          {p.title}
                        </td>
                        <td className="py-2 font-bold text-gray-900">{p.views}</td>
                        <td className="py-2 text-gray-600">{p.unique}</td>
                        <td className="py-2 text-gray-600">{p.time}</td>
                        <td className="py-2 text-emerald-600 font-semibold">{p.bounce}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Need Help Card (1 col) */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-800 mb-1">Need Help?</h3>
                <p className="text-[11px] text-gray-500 mb-3">Learn how to manage your website content effectively.</p>
                <div className="space-y-1.5 text-[10.5px] text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>CMS User Guide</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Video className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Watch Video Tutorial</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Contact Support Team</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => toast.info("Opening Help Center...")}
                className="mt-3 w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                Go to Help Center â
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Donut + Quick Actions + Recently Updated */}
        <div className="space-y-4">
          {/* Content Overview Donut */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold text-gray-800 mb-3">Content Overview</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-28 shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path
                    className="text-gray-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500"
                    strokeDasharray="82.8, 100"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-500"
                    strokeDasharray="17.2, 100"
                    strokeDashoffset="-82.8"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] font-black text-gray-900 leading-tight">58</span>
                  <span className="text-[9px] text-gray-400">Total Pages</span>
                </div>
              </div>

              <div className="space-y-1.5 flex-1 text-[10.5px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-gray-700">Published</span>
                  </div>
                  <span className="text-gray-400 font-semibold">48 (82.8%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="text-gray-700">Draft</span>
                  </div>
                  <span className="text-gray-400 font-semibold">10 (17.2%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="text-gray-700">Scheduled</span>
                  </div>
                  <span className="text-gray-400">0 (0%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span className="text-gray-700">Expired</span>
                  </div>
                  <span className="text-gray-400">0 (0%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-gray-800 mb-2">Quick Actions</h3>

            <button
              onClick={() => toast.info("Creating new page...")}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Plus className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Create New Page</p>
                  <p className="text-[10px] text-gray-400">Add a new page to website</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-600" />
            </button>

            <button
              onClick={() => toast.info("Adding blog post...")}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Newspaper className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Add Blog Post</p>
                  <p className="text-[10px] text-gray-400">Publish a new blog post</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-600" />
            </button>

            <button
              onClick={() => toast.info("Opening menu editor...")}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Menu className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Manage Menus</p>
                  <p className="text-[10px] text-gray-400">Edit website navigation menus</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-purple-600" />
            </button>

            <button
              onClick={() => toast.info("Opening media library...")}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Image className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Media Library</p>
                  <p className="text-[10px] text-gray-400">Manage images and files</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-amber-600" />
            </button>

            <button
              onClick={() => toast.info("Opening custom code editor...")}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Code className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Custom Code</p>
                  <p className="text-[10px] text-gray-400">Add custom CSS / JS</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-rose-600" />
            </button>
          </div>

          {/* Recently Updated Pages */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800">Recently Updated Pages</h3>
              <button
                onClick={() => toast.info("Viewing all updated pages")}
                className="text-[11px] text-emerald-600 font-semibold hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { title: "Home Page", time: "25 May 2025, 10:30 AM" },
                { title: "About Us", time: "24 May 2025, 04:15 PM" },
                { title: "Our Services", time: "24 May 2025, 02:40 PM" },
                { title: "Krivexo Card", time: "23 May 2025, 11:20 AM" },
                { title: "For Farmers", time: "23 May 2025, 09:10 AM" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <FileText className="h-3 w-3 text-emerald-600" />
                    {item.title}
                  </span>
                  <span className="text-[10px] text-gray-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
