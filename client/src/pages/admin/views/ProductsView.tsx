import { useState, useEffect } from "react";
import {
  Search, Plus, Edit2, Trash2, Eye, Download, ChevronLeft, ChevronRight,
  Filter, Package, ArrowRight, AlertTriangle, XCircle,
  CheckCircle2, AlertCircle, Folder, Tag, BarChart3, X, Check, Power, Layers, Scale, Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import type { ProductItem } from "../types.ts";
import { toast } from "sonner";
import { api } from "@/services/api";

interface ProductsViewProps {
  products: ProductItem[];
  setProducts: React.Dispatch<React.SetStateAction<ProductItem[]>>;
  productSubTab?: string;
  setProductSubTab?: (tab: string) => void;
}

function ProductImage({ src, name }: { src?: string; name: string }) {
  const [errored, setErrored] = useState(false);
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  if (!src || errored || src.startsWith("https://images.unsplash")) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
        {initials}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      onError={() => setErrored(true)}
      className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-100"
    />
  );
}

export default function ProductsView({ products: propProducts, setProducts, productSubTab = "all", setProductSubTab }: ProductsViewProps) {
  const products = propProducts;

  // Filters
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals
  const [viewProduct, setViewProduct] = useState<any | null>(null);
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [isUnitsOpen, setIsUnitsOpen] = useState(false);

  // Custom added categories, brands, units
  const [customCategories, setCustomCategories] = useState<string[]>(["Fertilizers", "Seeds", "Pesticides", "Machinery", "Farmer Crops"]);
  const [customBrands, setCustomBrands] = useState<string[]>(["Krivexa Agro", "IFFCO", "Mahyco", "Bayer", "Tata Rallis"]);
  const [customUnits, setCustomUnits] = useState<string[]>(["kg", "Quintal", "Tonne", "50kg Bag", "1L Bottle", "500ml Bottle", "Packet", "Piece"]);

  const [newCatName, setNewCatName] = useState("");
  const [newBrandName, setNewBrandName] = useState("");
  const [newUnitName, setNewUnitName] = useState("");

  // Respond to sidebar sub-tab navigation
  useEffect(() => {
    if (productSubTab === "add") {
      setIsAddOpen(true);
    } else if (productSubTab === "categories") {
      setIsCategoriesOpen(true);
    } else if (productSubTab === "brands") {
      setIsBrandsOpen(true);
    } else if (productSubTab === "units") {
      setIsUnitsOpen(true);
    } else if (productSubTab === "all") {
      setIsAddOpen(false);
      setIsCategoriesOpen(false);
      setIsBrandsOpen(false);
      setIsUnitsOpen(false);
      setCatFilter("all");
      setBrandFilter("all");
    }
  }, [productSubTab]);
  const [newProduct, setNewProduct] = useState({
    name: "", category: "", price: 0, mrp: 0, stock: 0,
    status: "active", sku: "", brand: "", unit: "",
    minOrderQty: 1, discount: 0, imageUrl: "",
    description: "", tags: "", warranty: "",
  });

  // Computed KPIs — real data only
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === "active" || p.status === "approved").length;
  const lowStock = products.filter(p => {
    const prod = p as any;
    return typeof prod.stock === "number" && prod.stock > 0 && prod.stock < 20;
  }).length;
  const outOfStock = products.filter(p => {
    const prod = p as any;
    // Only count as "out of stock" when stock is explicitly 0, not undefined/missing
    return typeof prod.stock === "number" && prod.stock === 0;
  }).length;

  // Unique categories from real products
  const categoryCounts = products.reduce((acc: Record<string, number>, p) => {
    const cat = p.category || "General";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const catColors = ["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-violet-500", "bg-rose-500", "bg-teal-500"];
  const dynamicCategories = Object.entries(categoryCounts).map(([name, count], i) => ({
    name,
    count: `${count} Product${count > 1 ? "s" : ""}`,
    pct: Math.round((count / (products.length || 1)) * 100),
    color: catColors[i % catColors.length],
  }));

  // Unique brands from real products
  const allBrands = Array.from(new Set(products.map((p: any) => p.brand).filter(Boolean)));

  // Inventory donut stats from real data
  const inStockCount = products.filter((p: any) => (p.stock ?? 0) > 20).length;
  const lowStockCount = products.filter((p: any) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 20).length;
  const outCount = products.filter((p: any) => (p.stock ?? 0) === 0).length;
  const inactiveCount = products.filter(p => p.status === "inactive").length;
  const donutTotal = totalProducts || 1;
  const CIRC = 2 * Math.PI * 46; // ~289
  const inPct = (inStockCount / donutTotal);
  const lowPct = (lowStockCount / donutTotal);
  const outPct = (outCount / donutTotal);
  const inactivePct = (inactiveCount / donutTotal);

  const filtered = products.filter(p => {
    const prod = p as any;
    const matchSearch =
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.id || "").toLowerCase().includes(search.toLowerCase()) ||
      (prod.sku || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || (p.category || "").toLowerCase().includes(catFilter.toLowerCase());
    const matchBrand = brandFilter === "all" || (prod.brand || "").toLowerCase().includes(brandFilter.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchCat && matchBrand && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paged = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const getStockBadge = (stock: number | undefined) => {
    // If no stock info at all, show neutral "N/A" badge
    if (stock === undefined || stock === null) {
      return <span className="px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 border border-gray-200 text-[11px] font-semibold">N/A</span>;
    }
    if (stock === 0) return <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[11px] font-semibold">Out of Stock</span>;
    if (stock < 20) return <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">Low Stock</span>;
    return <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">In Stock</span>;
  };

  // CSV export
  const handleExport = () => {
    if (filtered.length === 0) { toast.error("No products to export"); return; }
    const headers = ["ID", "Name", "Category", "Price (₹)", "Stock", "Status"];
    const rows = filtered.map((p: any) => [p.id, p.name, p.category, p.price, p.stock ?? "—", p.status]);
    const csv = [headers, ...rows].map(r => r.map((c: any) => `"${c ?? ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `products_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} products`);
  };

  // Toggle status
  const handleToggleStatus = async (id: string, name: string, currentStatus: string) => {
    const next = currentStatus === "active" ? "inactive" : "active";
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: next } : p));
    toast.success(`"${name}" set to ${next}`);

    await api.updateProduct(id, { status: next }).catch(() => {});
  };

  // Delete
  const handleDelete = async (id: string, name: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success(`"${name}" deleted`);

    await Promise.allSettled([
      api.deleteProduct(id),
      api.deleteCrop(id),
      api.deleteDealerListing(id),
    ]);
  };

  // Save edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    const target = editProduct;
    setProducts(prev => prev.map(p => p.id === target.id ? { ...p, ...target } : p));
    setEditProduct(null);
    toast.success(`"${target.name}" updated`);

    await api.updateProduct(target.id, {
      name: target.name,
      price: Number(target.price),
      stockQuantity: Number(target.stock ?? target.stockQuantity ?? 0),
      status: target.status,
      category: target.category,
      brand: target.brand,
    }).catch(() => {});
  };

  // Add product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return;
    const added = {
      ...newProduct,
      id: `prod_${Date.now()}`,
      price: Number(newProduct.price),
      mrp: Number(newProduct.mrp),
      stock: Number(newProduct.stock),
      minOrderQty: Number(newProduct.minOrderQty),
      discount: Number(newProduct.discount),
      image: newProduct.imageUrl || undefined,
      tags: newProduct.tags ? newProduct.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
    } as any;
    setProducts(prev => [added, ...prev]);
    setIsAddOpen(false);
    setNewProduct({
      name: "", category: "", price: 0, mrp: 0, stock: 0,
      status: "active", sku: "", brand: "", unit: "",
      minOrderQty: 1, discount: 0, imageUrl: "",
      description: "", tags: "", warranty: "",
    });
    toast.success(`"${added.name}" added successfully`);

    await api.addProduct({
      id: added.id,
      name: added.name,
      category: added.category || 'general',
      categoryId: added.category || 'general',
      price: added.price,
      stockQuantity: added.stock,
      unit: added.unit || 'kg',
      brand: added.brand,
      sku: added.sku,
      status: added.status,
      description: added.description,
      images: added.image ? [added.image] : [],
    }).catch(() => {});
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage all products, inventory and pricing</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Dashboard</span><span>›</span><span>Products Management</span><span>›</span>
          <span className="text-emerald-600 font-medium">All Products</span>
        </div>
      </div>

      {/* Stat Cards — real data */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: totalProducts.toLocaleString("en-IN"), sub: "Total catalog items", Icon: Package, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Active Products", value: activeProducts.toLocaleString("en-IN"), sub: "Available on store", Icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Low Stock Products", value: lowStock.toLocaleString("en-IN"), sub: "Reorder required", Icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Out of Stock", value: outOfStock.toLocaleString("en-IN"), sub: "Inventory depleted", Icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
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
              <p className="text-[11px] text-emerald-600 mt-1 font-medium">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Split layout */}
      <div className="flex gap-4">
        {/* Table */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input placeholder="Search by product name, SKU..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} className="pl-9 h-8 text-xs border-gray-200 bg-gray-50 rounded-xl" />
            </div>
            <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setCurrentPage(1); }} className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-pointer">
              <option value="all">All Categories</option>
              {Object.keys(categoryCounts).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={brandFilter} onChange={e => { setBrandFilter(e.target.value); setCurrentPage(1); }} className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-pointer">
              <option value="all">All Brands</option>
              {allBrands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-pointer">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button onClick={() => { setCatFilter("all"); setBrandFilter("all"); setStatusFilter("all"); setSearch(""); setCurrentPage(1); toast.info("Filters cleared"); }} className="h-8 w-8 flex items-center justify-center border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100">
              <Filter className="h-3.5 w-3.5 text-gray-500" />
            </button>
            <button onClick={handleExport} className="h-8 w-8 flex items-center justify-center border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100">
              <Download className="h-3.5 w-3.5 text-gray-500" />
            </button>
            <Button onClick={() => setIsAddOpen(true)} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 rounded-xl font-semibold gap-1.5 ml-auto cursor-pointer">
              <Plus className="h-3.5 w-3.5" /> Add New Product
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4 text-left w-14">Image</th>
                  <th className="py-3 px-4 text-left">Product List</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Price (₹)</th>
                  <th className="py-3 px-4 text-left">Stock</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paged.length === 0 ? (
                  <tr><td colSpan={7} className="py-10 text-center text-gray-400 text-xs">
                    {totalProducts === 0 ? "No products in database yet." : "No products match your filters."}
                  </td></tr>
                ) : (
                  paged.map((p) => {
                    const prod = p as any;
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <ProductImage src={prod.image || prod.imageUrl} name={p.name || "P"} />
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-gray-800">{p.name}</p>
                          <p className="text-[10px] text-gray-400">{prod.sku || p.id}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-medium">{p.category}</span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-gray-800">₹ {Number(prod.price || p.price || 0).toLocaleString("en-IN")}</p>
                          {prod.mrp && <p className="text-[10px] text-gray-400">MRP: ₹ {Number(prod.mrp).toLocaleString("en-IN")}</p>}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-gray-800">{prod.stock !== undefined ? prod.stock.toLocaleString("en-IN") : "—"}</p>
                        </td>
                        <td className="py-3 px-4">{getStockBadge(prod.stock)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setViewProduct(prod)} className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 cursor-pointer" title="View">
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => setEditProduct({ ...prod })} className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-600 cursor-pointer" title="Edit">
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => handleToggleStatus(p.id, p.name || "", p.status || "active")} className={`w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer ${p.status === "inactive" ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-600" : "bg-gray-50 hover:bg-gray-100 text-gray-500"}`} title={p.status === "inactive" ? "Activate" : "Deactivate"}>
                              <Power className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => handleDelete(p.id, p.name || "")} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 cursor-pointer" title="Delete">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination — real */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
            <p className="text-[11px] text-gray-500">
              Showing {filtered.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to{" "}
              {Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length} products
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40">
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} className={`w-7 h-7 rounded-lg text-xs font-semibold ${currentPage === p ? "bg-emerald-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{p}</button>
              ))}
              {totalPages > 5 && <span className="text-gray-400 text-xs">...</span>}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <select value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="h-7 px-2 border border-gray-200 rounded-lg text-xs text-gray-600 outline-none bg-gray-50">
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-72 space-y-4 shrink-0">
          {/* Inventory Overview — real donut */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-bold text-gray-800 mb-4">Inventory Overview</p>
            <div className="flex items-center justify-center mb-4">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="46" fill="none" stroke="#e5e7eb" strokeWidth="16" />
                {/* In Stock */}
                <circle cx="60" cy="60" r="46" fill="none" stroke="#059669" strokeWidth="16"
                  strokeDasharray={`${CIRC * inPct} ${CIRC}`} strokeLinecap="round" transform="rotate(-90 60 60)" />
                {/* Low Stock */}
                <circle cx="60" cy="60" r="46" fill="none" stroke="#f59e0b" strokeWidth="16"
                  strokeDasharray={`${CIRC * lowPct} ${CIRC}`} strokeLinecap="round"
                  transform={`rotate(${-90 + 360 * inPct} 60 60)`} />
                {/* Out of Stock */}
                <circle cx="60" cy="60" r="46" fill="none" stroke="#ef4444" strokeWidth="16"
                  strokeDasharray={`${CIRC * outPct} ${CIRC}`} strokeLinecap="round"
                  transform={`rotate(${-90 + 360 * (inPct + lowPct)} 60 60)`} />
                {/* Inactive */}
                <circle cx="60" cy="60" r="46" fill="none" stroke="#9ca3af" strokeWidth="16"
                  strokeDasharray={`${CIRC * inactivePct} ${CIRC}`} strokeLinecap="round"
                  transform={`rotate(${-90 + 360 * (inPct + lowPct + outPct)} 60 60)`} />
                <text x="60" y="56" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#111">{totalProducts}</text>
                <text x="60" y="69" textAnchor="middle" fontSize="9" fill="#9ca3af">Total</text>
              </svg>
            </div>
            <div className="space-y-1.5">
              {[
                { color: "bg-emerald-500", label: "In Stock", value: `${inStockCount} (${Math.round(inPct * 100)}%)` },
                { color: "bg-amber-400", label: "Low Stock", value: `${lowStockCount} (${Math.round(lowPct * 100)}%)` },
                { color: "bg-red-400", label: "Out of Stock", value: `${outCount} (${Math.round(outPct * 100)}%)` },
                { color: "bg-gray-400", label: "Inactive", value: `${inactiveCount} (${Math.round(inactivePct * 100)}%)` },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5"><div className={`w-2.5 h-2.5 rounded-full ${s.color}`} /><span className="text-gray-600">{s.label}</span></div>
                  <span className="font-semibold text-gray-700">{s.value}</span>
                </div>
              ))}
            </div>
            <button onClick={handleExport} className="w-full mt-3 h-8 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-emerald-100 cursor-pointer">
              View Inventory Report <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Top Categories — real */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-800">Top Categories</p>
              <button onClick={() => { setCatFilter("all"); setCurrentPage(1); }} className="text-[11px] text-emerald-600 font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-2.5">
              {dynamicCategories.length === 0 ? (
                <p className="text-[11px] text-gray-400 py-2">No product categories yet</p>
              ) : (
                dynamicCategories.map((c, i) => (
                  <div key={i} className="space-y-1 cursor-pointer" onClick={() => { setCatFilter(c.name); setCurrentPage(1); }}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-gray-700">{c.name}</span>
                      <span className="text-gray-400">{c.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-bold text-gray-800 mb-3">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Add New Product", Icon: Plus, color: "bg-emerald-50 text-emerald-700 border-emerald-100", action: () => setIsAddOpen(true) },
                { label: "Export Products", Icon: Download, color: "bg-blue-50 text-blue-700 border-blue-100", action: handleExport },
                { label: "Filter by Category", Icon: Folder, color: "bg-violet-50 text-violet-700 border-violet-100", action: () => toast.info("Use the Category filter above") },
                { label: "Filter by Brand", Icon: Tag, color: "bg-amber-50 text-amber-700 border-amber-100", action: () => toast.info("Use the Brand filter above") },
                { label: "Low Stock Alert", Icon: AlertCircle, color: "bg-red-50 text-red-700 border-red-100", action: () => { setStatusFilter("all"); setSearch(""); setCatFilter("all"); setCurrentPage(1); toast.info(`${lowStock} products with low stock`); } },
                { label: "Stock Report", Icon: BarChart3, color: "bg-gray-50 text-gray-700 border-gray-200", action: handleExport },
              ].map((a, i) => {
                const ActionIcon = a.Icon;
                return (
                  <button key={i} onClick={a.action} className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-[10px] font-semibold ${a.color} hover:opacity-80 cursor-pointer`}>
                    <ActionIcon className="h-4 w-4" />
                    <span className="leading-tight text-center">{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── View Product Modal ─── */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 relative">
            <button onClick={() => setViewProduct(null)} className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <ProductImage src={viewProduct.image || viewProduct.imageUrl} name={viewProduct.name || "P"} />
              <div>
                <h3 className="text-sm font-bold text-gray-900">{viewProduct.name}</h3>
                <p className="text-[11px] text-gray-400">{viewProduct.sku || viewProduct.id}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-gray-700">
              {[
                ["Category", viewProduct.category],
                ["Price", `₹ ${Number(viewProduct.price || 0).toLocaleString("en-IN")}`],
                ["MRP", viewProduct.mrp ? `₹ ${Number(viewProduct.mrp).toLocaleString("en-IN")}` : "—"],
                ["Stock", viewProduct.stock !== undefined ? viewProduct.stock : "—"],
                ["Brand", viewProduct.brand || "—"],
                ["Status", viewProduct.status || "—"],
              ].map(([label, val], i) => (
                <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-1.5">
                  <span className="text-gray-500 font-medium">{label}</span>
                  <span className="font-semibold text-gray-800">{val}</span>
                </div>
              ))}
              {viewProduct.description && (
                <div className="pt-1">
                  <p className="text-gray-500 font-medium mb-1">Description</p>
                  <p className="text-gray-700 text-[11px] leading-relaxed">{viewProduct.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Edit Product Modal ─── */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <button onClick={() => setEditProduct(null)} className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Edit Product</h3>
            <p className="text-[11px] text-gray-400 mb-4">Update product details and inventory</p>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Product Name *</label>
                <Input value={editProduct.name || ""} onChange={e => setEditProduct({ ...editProduct, name: e.target.value })} className="h-9 text-xs rounded-xl" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <Input value={editProduct.category || ""} onChange={e => setEditProduct({ ...editProduct, category: e.target.value })} className="h-9 text-xs rounded-xl" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Brand</label>
                  <Input value={editProduct.brand || ""} onChange={e => setEditProduct({ ...editProduct, brand: e.target.value })} className="h-9 text-xs rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Price (₹) *</label>
                  <Input type="number" min="0" value={editProduct.price || 0} onChange={e => setEditProduct({ ...editProduct, price: Number(e.target.value) })} className="h-9 text-xs rounded-xl" required />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">MRP (₹)</label>
                  <Input type="number" min="0" value={editProduct.mrp || 0} onChange={e => setEditProduct({ ...editProduct, mrp: Number(e.target.value) })} className="h-9 text-xs rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Stock Qty</label>
                  <Input type="number" min="0" value={editProduct.stock ?? 0} onChange={e => setEditProduct({ ...editProduct, stock: Number(e.target.value) })} className="h-9 text-xs rounded-xl" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Status</label>
                  <select value={editProduct.status || "active"} onChange={e => setEditProduct({ ...editProduct, status: e.target.value })} className="w-full h-9 px-3 border border-gray-200 rounded-xl bg-gray-50 text-xs font-medium cursor-pointer">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">SKU</label>
                <Input value={editProduct.sku || ""} onChange={e => setEditProduct({ ...editProduct, sku: e.target.value })} className="h-9 text-xs rounded-xl" placeholder="e.g. PRD-001" />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea value={editProduct.description || ""} onChange={e => setEditProduct({ ...editProduct, description: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </div>
              <div className="pt-2 flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setEditProduct(null)} className="h-9 text-xs rounded-xl font-semibold cursor-pointer">Cancel</Button>
                <Button type="submit" className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 rounded-xl font-semibold gap-1.5 cursor-pointer">
                  <Check className="h-3.5 w-3.5" /> Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Add New Product Modal ─── */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
            <button onClick={() => setIsAddOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Add New Product</h3>
            <p className="text-[11px] text-gray-400 mb-4">Add a new product to the catalog</p>
            <form onSubmit={handleAddProduct} className="space-y-3 text-xs max-h-[75vh] overflow-y-auto pr-1">

              {/* Product Name */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Product Name *</label>
                <Input placeholder="e.g. Bio NPK Growth Enhancer" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="h-9 text-xs rounded-xl" required />
              </div>

              {/* Category + Brand */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <Input placeholder="e.g. Fertilizers" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="h-9 text-xs rounded-xl" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Brand</label>
                  <Input placeholder="e.g. Krivexa Agro" value={newProduct.brand} onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} className="h-9 text-xs rounded-xl" />
                </div>
              </div>

              {/* SKU + Unit */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">SKU</label>
                  <Input placeholder="e.g. PRD-001" value={newProduct.sku} onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} className="h-9 text-xs rounded-xl" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Unit / Weight</label>
                  <Input placeholder="e.g. 1 kg, 500 ml" value={newProduct.unit} onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })} className="h-9 text-xs rounded-xl" />
                </div>
              </div>

              {/* Price + MRP */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Selling Price (₹) *</label>
                  <Input type="number" min="0" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className="h-9 text-xs rounded-xl" required />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">MRP (₹)</label>
                  <Input type="number" min="0" value={newProduct.mrp} onChange={e => setNewProduct({ ...newProduct, mrp: Number(e.target.value) })} className="h-9 text-xs rounded-xl" />
                </div>
              </div>

              {/* Discount + Stock */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Discount (%)</label>
                  <Input type="number" min="0" max="100" value={newProduct.discount} onChange={e => setNewProduct({ ...newProduct, discount: Number(e.target.value) })} className="h-9 text-xs rounded-xl" placeholder="0" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Stock Qty</label>
                  <Input type="number" min="0" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} className="h-9 text-xs rounded-xl" />
                </div>
              </div>

              {/* Min Order Qty + Warranty */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Min. Order Qty</label>
                  <Input type="number" min="1" value={newProduct.minOrderQty} onChange={e => setNewProduct({ ...newProduct, minOrderQty: Number(e.target.value) })} className="h-9 text-xs rounded-xl" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Warranty</label>
                  <Input placeholder="e.g. 6 months" value={newProduct.warranty} onChange={e => setNewProduct({ ...newProduct, warranty: e.target.value })} className="h-9 text-xs rounded-xl" />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Status</label>
                <select value={newProduct.status} onChange={e => setNewProduct({ ...newProduct, status: e.target.value })} className="w-full h-9 px-3 border border-gray-200 rounded-xl bg-gray-50 text-xs font-medium cursor-pointer">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Image URL</label>
                <Input placeholder="https://example.com/product.jpg" value={newProduct.imageUrl} onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })} className="h-9 text-xs rounded-xl" />
              </div>

              {/* Tags */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Tags (comma-separated)</label>
                <Input placeholder="e.g. organic, fertilizer, bio" value={newProduct.tags} onChange={e => setNewProduct({ ...newProduct, tags: e.target.value })} className="h-9 text-xs rounded-xl" />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows={2}
                  placeholder="Short product description (Hindi/English)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="h-9 text-xs rounded-xl font-semibold cursor-pointer">Cancel</Button>
                <Button type="submit" className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 rounded-xl font-semibold gap-1.5 cursor-pointer">
                  <Check className="h-3.5 w-3.5" /> Add Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Categories Manager Modal ─── */}
      {isCategoriesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
            <button onClick={() => { setIsCategoriesOpen(false); setProductSubTab?.("all"); }} className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <Folder className="h-5 w-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-gray-900">Product Categories</h3>
            </div>
            <p className="text-[11px] text-gray-400 mb-4">Manage product categories and catalog structure</p>

            {/* Add New Category Input */}
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="New Category Name (e.g. Bio-Pesticides)"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                className="h-9 text-xs rounded-xl flex-1"
              />
              <Button
                onClick={() => {
                  if (!newCatName.trim()) return;
                  if (!customCategories.includes(newCatName.trim())) {
                    setCustomCategories(prev => [...prev, newCatName.trim()]);
                    toast.success(`Category "${newCatName.trim()}" added`);
                  }
                  setNewCatName("");
                }}
                className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 rounded-xl font-semibold gap-1 cursor-pointer shrink-0"
              >
                <Plus className="h-3.5 w-3.5" /> Add Category
              </Button>
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {Array.from(new Set([...customCategories, ...Object.keys(categoryCounts)])).map(cat => {
                const count = categoryCounts[cat] || 0;
                return (
                  <div key={cat} className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        {cat.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{cat}</p>
                        <p className="text-[10px] text-gray-400">{count} Product{count !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCatFilter(cat);
                        setIsCategoriesOpen(false);
                        setProductSubTab?.("all");
                        toast.info(`Filtered by "${cat}"`);
                      }}
                      className="h-7 text-[11px] rounded-lg border-emerald-200 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                    >
                      Filter Products
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <Button onClick={() => { setIsCategoriesOpen(false); setProductSubTab?.("all"); }} className="h-8 bg-gray-900 text-white text-xs rounded-xl px-4 cursor-pointer font-semibold">Done</Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Brands Manager Modal ─── */}
      {isBrandsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
            <button onClick={() => { setIsBrandsOpen(false); setProductSubTab?.("all"); }} className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <Bookmark className="h-5 w-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-gray-900">Brand Management</h3>
            </div>
            <p className="text-[11px] text-gray-400 mb-4">Manage manufacturers and product brand listings</p>

            <div className="flex gap-2 mb-4">
              <Input
                placeholder="New Brand Name (e.g. Syngenta)"
                value={newBrandName}
                onChange={e => setNewBrandName(e.target.value)}
                className="h-9 text-xs rounded-xl flex-1"
              />
              <Button
                onClick={() => {
                  if (!newBrandName.trim()) return;
                  if (!customBrands.includes(newBrandName.trim())) {
                    setCustomBrands(prev => [...prev, newBrandName.trim()]);
                    toast.success(`Brand "${newBrandName.trim()}" added`);
                  }
                  setNewBrandName("");
                }}
                className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 rounded-xl font-semibold gap-1 cursor-pointer shrink-0"
              >
                <Plus className="h-3.5 w-3.5" /> Add Brand
              </Button>
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {Array.from(new Set([...customBrands, ...allBrands])).map(brand => {
                const brandProds = products.filter((p: any) => (p.brand || p.seller || "").toLowerCase() === brand.toLowerCase());
                return (
                  <div key={brand} className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {brand.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{brand}</p>
                        <p className="text-[10px] text-gray-400">{brandProds.length} Product{brandProds.length !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setBrandFilter(brand);
                        setIsBrandsOpen(false);
                        setProductSubTab?.("all");
                        toast.info(`Filtered by brand "${brand}"`);
                      }}
                      className="h-7 text-[11px] rounded-lg border-blue-200 text-blue-700 hover:bg-blue-100 cursor-pointer"
                    >
                      Filter Products
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <Button onClick={() => { setIsBrandsOpen(false); setProductSubTab?.("all"); }} className="h-8 bg-gray-900 text-white text-xs rounded-xl px-4 cursor-pointer font-semibold">Done</Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Units Manager Modal ─── */}
      {isUnitsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
            <button onClick={() => { setIsUnitsOpen(false); setProductSubTab?.("all"); }} className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <Scale className="h-5 w-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-gray-900">Units & Measurement Standard</h3>
            </div>
            <p className="text-[11px] text-gray-400 mb-4">Standard packaging and weight units for agricultural items</p>

            <div className="flex gap-2 mb-4">
              <Input
                placeholder="New Measurement Unit (e.g. 250ml Bottle)"
                value={newUnitName}
                onChange={e => setNewUnitName(e.target.value)}
                className="h-9 text-xs rounded-xl flex-1"
              />
              <Button
                onClick={() => {
                  if (!newUnitName.trim()) return;
                  if (!customUnits.includes(newUnitName.trim())) {
                    setCustomUnits(prev => [...prev, newUnitName.trim()]);
                    toast.success(`Unit "${newUnitName.trim()}" added`);
                  }
                  setNewUnitName("");
                }}
                className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 rounded-xl font-semibold gap-1 cursor-pointer shrink-0"
              >
                <Plus className="h-3.5 w-3.5" /> Add Unit
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto pr-1">
              {customUnits.map(unit => {
                const count = products.filter((p: any) => (p.unit || p.quantity || "").toString().toLowerCase().includes(unit.toLowerCase())).length;
                return (
                  <div key={unit} className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 bg-gray-50/70">
                    <div>
                      <p className="text-xs font-bold text-gray-800">{unit}</p>
                      <p className="text-[10px] text-gray-400">{count} Catalog Items</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">Active</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <Button onClick={() => { setIsUnitsOpen(false); setProductSubTab?.("all"); }} className="h-8 bg-gray-900 text-white text-xs rounded-xl px-4 cursor-pointer font-semibold">Done</Button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-[11px] text-gray-400">
        © {new Date().getFullYear()} Krivexa. All rights reserved. &nbsp; Real-time Product Catalog
      </div>
    </div>
  );
}
