import React, { useState, useRef } from "react";
import {
  Package, Plus, Trash2, Check, ArrowRight, UploadCloud,
  Camera, Info, CheckCircle2, ChevronRight, X,
  HelpCircle, Bell, User as UserIcon, Image as ImageIcon,
  ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { toast } from "sonner";

export interface ProductVariant {
  id: string;
  sizeWeight: string;
  packingType: "Pack" | "Bottle" | "Bag" | "Box" | "Can" | "Pouch" | "Drum";
  mrp: number;
  salePrice: number;
  stockQty: number;
  variantImageUrl?: string;
}

const PACKING_TYPES = ["Pack", "Bottle", "Bag", "Box", "Can", "Pouch", "Drum"] as const;

const packingEmoji = (p: string) => {
  switch (p) {
    case "Bottle": return "🍾";
    case "Bag": return "🛍️";
    case "Box": return "📦";
    case "Can": return "🥫";
    case "Drum": return "🪣";
    default: return "📦";
  }
};

export interface AddProductPayload {
  name: string;
  category: string;
  brand: string;
  description: string;
  imageUrl: string;
  unitType: string;
  shelfLifeMonths: number;
  isActive: boolean;
  tags: string[];
  variants: ProductVariant[];
  dealerId?: string;
  dealerName?: string;
}

interface AddNewProductFormProps {
  onSuccess?: (product: AddProductPayload) => void;
  onCancel?: () => void;
  dealerInfo?: {
    storeName?: string;
    retailerId?: string;
    dealerName?: string;
  };
  isAdmin?: boolean;
}

export default function AddNewProductForm({
  onSuccess,
  onCancel,
  dealerInfo = {
    storeName: "Shree Agro Store",
    retailerId: "KRVX5487",
    dealerName: "Amit Kumar",
  },
  isAdmin = false,
}: AddNewProductFormProps) {
  // 1. Product Details
  const [productName, setProductName] = useState("Profex");
  const [category, setCategory] = useState("Fertilizer / Plant Nutrition");
  const [brand, setBrand] = useState("Profex");
  const [description, setDescription] = useState(
    "Profex ek premium quality plant nutrition product hai jo fasal ki growth aur upaj badhane me madad karta hai. Yeh sabhi prakar ki fasalon ke liye upyogi hai."
  );
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&auto=format&fit=crop&q=60");

  // 2. Variants State
  const [variants, setVariants] = useState<ProductVariant[]>([
    { id: "v-1", sizeWeight: "100 GM", packingType: "Pack", mrp: 120, salePrice: 105, stockQty: 45 },
    { id: "v-2", sizeWeight: "250 GM", packingType: "Pack", mrp: 240, salePrice: 210, stockQty: 32 },
    { id: "v-3", sizeWeight: "500 GM", packingType: "Pack", mrp: 450, salePrice: 390, stockQty: 28 },
    { id: "v-4", sizeWeight: "1 LTR", packingType: "Bottle", mrp: 780, salePrice: 680, stockQty: 20 },
  ]);
  // Which variant row has its image panel open
  const [expandedVariantImg, setExpandedVariantImg] = useState<string | null>(null);

  // 3. Additional Info
  const [unitType, setUnitType] = useState("Gram / Litre");
  const [shelfLife, setShelfLife] = useState("24");
  const [isActive, setIsActive] = useState(true);
  const [tagsInput, setTagsInput] = useState("Organic, Plant Nutrition, High Yield");

  const mainImageRef = useRef<HTMLInputElement>(null);
  const variantFileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Add a new variant row
  const handleAddVariant = () => {
    setVariants(prev => [
      ...prev,
      { id: `v-${Date.now()}`, sizeWeight: "1 KG", packingType: "Pack", mrp: 500, salePrice: 420, stockQty: 10 },
    ]);
  };

  // Remove a variant row
  const handleRemoveVariant = (id: string) => {
    if (variants.length <= 1) {
      toast.error("Kam se kam 1 variant hona zaroori hai!");
      return;
    }
    setVariants(prev => prev.filter(v => v.id !== id));
  };

  // Update variant field
  const handleUpdateVariant = (id: string, field: keyof ProductVariant, value: any) => {
    setVariants(prev =>
      prev.map(v => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  // ── Image helpers ──────────────────────────────────────────────────────────
  const readFileAsDataUrl = (file: File, cb: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === "string") cb(reader.result); };
    reader.readAsDataURL(file);
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFileAsDataUrl(file, (url) => { setImageUrl(url); toast.success("Main product image updated!"); });
  };

  const handleVariantImageChange = (variantId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readFileAsDataUrl(file, (url) => {
        handleUpdateVariant(variantId, "variantImageUrl", url);
        toast.success("Variant image uploaded!");
      });
    }
    e.target.value = "";
  };

  const removeVariantImage = (variantId: string) => {
    handleUpdateVariant(variantId, "variantImageUrl", undefined);
    toast.info("Variant image removed.");
  };

  // Form Submit / Publish
  const handlePublish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!productName.trim()) {
      toast.error("Product name bharna anivarya hai!");
      return;
    }

    const payload: AddProductPayload = {
      name: productName,
      category,
      brand,
      description,
      imageUrl,
      unitType,
      shelfLifeMonths: Number(shelfLife) || 12,
      isActive,
      tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
      variants,
      dealerName: dealerInfo.dealerName,
      dealerId: dealerInfo.retailerId,
    };

    if (onSuccess) {
      onSuccess(payload);
    } else {
      toast.success(`🎉 "${productName}" successfully published to catalog!`);
    }
  };

  return (
    <div className="w-full bg-[#f0f4f8] text-gray-800 font-sans min-h-screen">

      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 sticky top-0 z-20 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Package className="h-5 w-5 text-emerald-600" />
            Add New Product
          </h1>
          <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5 font-medium">
            <span>Dashboard</span>
            <ChevronRight className="h-3 w-3" />
            <span>Products</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-emerald-700 font-semibold">Add New Product</span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
            <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center">
              <UserIcon className="h-3.5 w-3.5 text-emerald-800" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-900 leading-none">{dealerInfo.dealerName || "Amit Kumar"}</div>
              <div className="text-[10px] text-gray-500">{isAdmin ? "Admin" : "Dealer"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Step Breadcrumb ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-5 py-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { n: 1, label: "Product Details" },
            { n: 2, label: "Variants" },
            { n: 3, label: "Additional Info" },
            { n: 4, label: "Review & Publish" },
          ].map((s, i, arr) => (
            <React.Fragment key={s.n}>
              <div className="flex items-center gap-2 shrink-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black border-2 ${
                  s.n <= 2 ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-gray-300 text-gray-400"
                }`}>
                  {s.n <= 1 ? <Check className="h-3.5 w-3.5" /> : s.n}
                </div>
                <span className={`text-xs font-semibold whitespace-nowrap ${
                  s.n <= 2 ? "text-emerald-700" : "text-gray-400"
                }`}>{s.label}</span>
              </div>
              {i < arr.length - 1 && (
                <div className={`h-px flex-1 min-w-[20px] mx-1 ${
                  s.n < 2 ? "bg-emerald-400" : "bg-gray-200"
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">

        {/* ─ Row 1: Product Details + Variants ─ */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          {/* ╔══════════════════════════════╗
              ║   Section 1: Product Details ║
              ╚══════════════════════════════╝ */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-emerald-600 px-5 py-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-black flex items-center justify-center">1</div>
              <h2 className="text-sm font-bold text-white">Product Details</h2>
            </div>
            <div className="p-5 space-y-4">

              {/* Product Name */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">Product Name <span className="text-red-500">*</span></label>
                  <span className="text-[10px] text-gray-400 font-mono">{productName.length}/100</span>
                </div>
                <Input
                  value={productName} maxLength={100}
                  onChange={e => setProductName(e.target.value)}
                  placeholder="e.g. Profex Super / Nano Urea"
                  className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-xl h-10 focus:border-emerald-500 focus:bg-white"
                />
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                  <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl px-3 h-10 outline-none focus:border-emerald-500 focus:bg-white cursor-pointer font-medium">
                    <option value="Fertilizer / Plant Nutrition">🌾 Fertilizer / Plant Nutrition</option>
                    <option value="Seeds & Hybrids">🌱 Seeds & Hybrids</option>
                    <option value="Pesticides / Insecticides">🧪 Pesticides / Insecticides</option>
                    <option value="Fungicides & Herbicides">🍂 Fungicides & Herbicides</option>
                    <option value="Farm Equipment / Tools">🚜 Farm Equipment / Tools</option>
                    <option value="Organic Bio-Fertilizer">🌿 Organic Bio-Fertilizer</option>
                    <option value="Animal Feed & Veterinary">🐄 Animal Feed & Veterinary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Brand <span className="text-red-500">*</span></label>
                  <select value={brand} onChange={e => setBrand(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl px-3 h-10 outline-none focus:border-emerald-500 focus:bg-white cursor-pointer font-medium">
                    <option>Profex</option>
                    <option>Bayer CropScience</option>
                    <option>Syngenta</option>
                    <option>IFFCO</option>
                    <option>UPL Limited</option>
                    <option>Dhanuka Agritech</option>
                    <option>Tata Rallis</option>
                    <option>Krivexo Agro Brand</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">Product Description <span className="text-red-500">*</span></label>
                  <span className="text-[10px] text-gray-400 font-mono">{description.length}/500</span>
                </div>
                <textarea
                  value={description} maxLength={500} rows={4}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Product ki khasiyat, fayde aur upyog karne ka tarika likhein..."
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl px-3 py-2.5 resize-none outline-none focus:border-emerald-500 focus:bg-white leading-relaxed"
                />
              </div>

              {/* Main Product Image */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Main Product Image <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border-2 border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center overflow-hidden min-h-[140px] gap-2 p-2">
                    <img src={imageUrl} alt="Product" className="max-h-24 object-contain rounded-lg" />
                    <button
                      type="button"
                      onClick={() => mainImageRef.current?.click()}
                      className="flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-white border border-gray-300 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-700 py-1.5 px-3 rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      <Camera className="h-3 w-3" /> Change Image
                    </button>
                    <input ref={mainImageRef} type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
                  </div>
                  <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl bg-emerald-50/40 hover:bg-emerald-50 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[140px] gap-1.5">
                    <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <div className="text-xs font-bold text-gray-700">Upload Photo</div>
                    <div className="text-[10px] text-gray-500">JPG, PNG, WEBP</div>
                    <div className="text-[10px] text-gray-400">Max 5 MB</div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* ╔══════════════════════════════════════╗
              ║  Section 2: Variants (Size / Weight) ║
              ╚══════════════════════════════════════╝ */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-blue-600 px-5 py-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-black flex items-center justify-center">2</div>
              <h2 className="text-sm font-bold text-white">Variants (Size / Weight)</h2>
              <Badge className="ml-auto bg-white/20 text-white border-0 text-[10px] font-bold px-2">
                {variants.length} added
              </Badge>
            </div>
            <div className="p-4 space-y-3">
              {/* Info banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2 text-blue-800 text-xs">
                <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>{productName || "Product"}</strong> ke alag alag size/weight variants add karein. Har variant ka apna alag image bhi upload kar sakte hain (image icon tap karein).
                </span>
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-[32px_1fr_86px_68px_68px_52px_36px] gap-1 px-1 pb-1.5 border-b border-gray-200">
                <div className="text-[10px] font-bold text-blue-500 text-center">Img</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase">Size / Weight</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase">Packing</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase">MRP ₹</div>
                <div className="text-[10px] font-bold text-blue-600 uppercase">Sale ₹</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase">Stock</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase text-center">Del</div>
              </div>

              {/* Variant rows */}
              <div className="space-y-2">
                {variants.map((v) => (
                  <div key={v.id} className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50/60">
                    {/* Main row */}
                    <div className="grid grid-cols-[32px_1fr_86px_68px_68px_52px_36px] gap-1 items-center px-2 py-2">
                      {/* Image icon - Click directly to upload image */}
                      <button
                        type="button"
                        title={v.variantImageUrl ? "Click to change variant image" : "Click to upload image for this variant"}
                        onClick={() => variantFileRefs.current[v.id]?.click()}
                        className={`group relative w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer border overflow-hidden shrink-0 ${
                          v.variantImageUrl
                            ? "border-blue-400 bg-blue-50 ring-1 ring-blue-200"
                            : "border-dashed border-gray-300 bg-white text-gray-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/60"
                        }`}
                      >
                        {v.variantImageUrl ? (
                          <>
                            <img src={v.variantImageUrl} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Camera className="h-3 w-3 text-white" />
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Camera className="h-3.5 w-3.5 text-gray-400 group-hover:text-blue-600 group-hover:scale-110 transition-transform" />
                          </div>
                        )}
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={el => { variantFileRefs.current[v.id] = el; }}
                        onChange={e => handleVariantImageChange(v.id, e)}
                      />
                      {/* Size / Weight */}
                      <Input
                        value={v.sizeWeight}
                        onChange={e => handleUpdateVariant(v.id, "sizeWeight", e.target.value)}
                        className="h-8 text-xs font-semibold bg-white border-gray-300 rounded-lg"
                        placeholder="e.g. 500 GM"
                      />
                      {/* Packing type */}
                      <select
                        value={v.packingType}
                        onChange={e => handleUpdateVariant(v.id, "packingType", e.target.value)}
                        className="h-8 text-xs bg-white border border-gray-300 rounded-lg px-1.5 outline-none font-medium cursor-pointer w-full"
                      >
                        {PACKING_TYPES.map(p => <option key={p}>{p}</option>)}
                      </select>
                      {/* MRP */}
                      <Input
                        type="number" value={v.mrp}
                        onChange={e => handleUpdateVariant(v.id, "mrp", Number(e.target.value))}
                        className="h-8 text-xs font-mono bg-white border-gray-300 rounded-lg"
                      />
                      {/* Sale Price */}
                      <Input
                        type="number" value={v.salePrice}
                        onChange={e => handleUpdateVariant(v.id, "salePrice", Number(e.target.value))}
                        className="h-8 text-xs font-bold font-mono text-blue-700 bg-blue-50 border-blue-200 rounded-lg"
                      />
                      {/* Stock */}
                      <Input
                        type="number" value={v.stockQty}
                        onChange={e => handleUpdateVariant(v.id, "stockQty", Number(e.target.value))}
                        className="h-8 text-xs font-mono bg-white border-gray-300 rounded-lg"
                      />
                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(v.id)}
                        className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-red-200"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* ── Variant Image Panel (expandable) ── */}
                    {expandedVariantImg === v.id && (
                      <div className="border-t border-blue-100 bg-blue-50/40 px-3 py-3 animate-in slide-in-from-top-1 duration-150">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                            <ImageIcon className="h-3.5 w-3.5 text-blue-600" />
                            Variant Image — <span className="text-blue-700 font-black">{v.sizeWeight}</span>
                          </span>
                          {v.variantImageUrl && (
                            <button
                              type="button"
                              onClick={() => removeVariantImage(v.id)}
                              className="text-[10px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                            >
                              <X className="h-3 w-3" /> Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {/* Preview */}
                          <div className="border border-dashed border-blue-200 rounded-xl bg-blue-50/30 flex flex-col items-center justify-center min-h-[110px] overflow-hidden">
                            {v.variantImageUrl ? (
                              <>
                                <img src={v.variantImageUrl} alt={v.sizeWeight} className="max-h-20 object-contain rounded-lg mb-1" />
                                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                  <Check className="h-3 w-3" /> Uploaded
                                </span>
                              </>
                            ) : (
                              <div className="text-center text-gray-400 text-[10px] px-2">
                                <ImageIcon className="h-6 w-6 mx-auto mb-1 text-gray-300" />
                                No image yet
                              </div>
                            )}
                          </div>
                          {/* Upload */}
                          <label className="border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-xl bg-blue-50/30 hover:bg-blue-50 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[110px] gap-1.5">
                            <input
                              type="file" accept="image/*"
                              onChange={e => handleVariantImageChange(v.id, e)}
                              className="hidden"
                            />
                            <UploadCloud className="h-6 w-6 text-blue-500" />
                            <div className="text-[11px] font-bold text-blue-700">Upload Variant Image</div>
                            <div className="text-[10px] text-gray-500">JPG, PNG, WEBP · Max 5MB</div>
                          </label>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2">
                          ℹ️ Yeh image sirf is variant ({v.sizeWeight}) ke liye hogi. Agar upload nahi karenge to main product image use hogi.
                        </p>
                      </div>
                    )}

                    {/* Expand toggle */}
                    <button
                      type="button"
                      onClick={() => setExpandedVariantImg(expandedVariantImg === v.id ? null : v.id)}
                      className="w-full flex items-center justify-center gap-1 py-1 text-[10px] font-semibold text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer border-t border-gray-100"
                    >
                      {expandedVariantImg === v.id
                        ? <><ChevronUp className="h-3 w-3" /> Hide Preview</>
                        : <><ChevronDown className="h-3 w-3" /> {v.variantImageUrl ? "✅ Image Uploaded · View / Remove" : "🔍 Preview & Image Info"}</>
                      }
                    </button>
                  </div>
                ))}
              </div>

              {/* Add variant */}
              <Button
                type="button" variant="outline"
                onClick={handleAddVariant}
                className="w-full text-xs font-bold text-blue-700 border-blue-300 hover:bg-blue-50 rounded-xl gap-1.5 cursor-pointer h-9"
              >
                <Plus className="h-3.5 w-3.5" /> Add Another Variant
              </Button>

              <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium pt-1 border-t border-gray-100">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Har variant ka alag image bhi upload kar sakte hain (image icon tap karein).</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─ Row 2: Additional Info + Preview ─ */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          {/* ╔══════════════════════════════════╗
              ║  Section 3: Additional Info       ║
              ╚══════════════════════════════════╝ */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-violet-600 px-5 py-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-black flex items-center justify-center">3</div>
              <h2 className="text-sm font-bold text-white">Additional Information</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Unit Type <span className="text-red-500">*</span></label>
                  <select value={unitType} onChange={e => setUnitType(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl px-3 h-10 outline-none focus:border-violet-500 focus:bg-white cursor-pointer font-medium">
                    <option>Gram / Litre</option>
                    <option>Kilogram (KG)</option>
                    <option>Litre (LTR)</option>
                    <option>Millilitre (ML)</option>
                    <option>Pieces (PCS)</option>
                    <option>Quintal / Ton</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Shelf Life</label>
                  <div className="flex h-10 rounded-xl overflow-hidden border border-gray-300 bg-gray-50 focus-within:border-violet-500">
                    <Input
                      type="number" value={shelfLife}
                      onChange={e => setShelfLife(e.target.value)}
                      className="border-0 bg-transparent text-sm text-gray-900 focus-visible:ring-0 h-full rounded-none"
                    />
                    <span className="bg-gray-100 px-3 text-[11px] font-bold text-gray-600 flex items-center border-l border-gray-300 shrink-0">Months</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Listing Status</label>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`flex items-center gap-2 px-3 h-10 rounded-xl font-bold text-xs cursor-pointer transition-all border w-full ${
                      isActive ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-gray-100 border-gray-300 text-gray-500"
                    }`}
                  >
                    <div className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors shrink-0 ${
                      isActive ? "bg-emerald-500" : "bg-gray-300"
                    }`}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow transition-transform ${isActive ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                    {isActive ? "Active / Live" : "Inactive / Draft"}
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">Tags <span className="text-gray-400 font-normal">(optional, comma-separated)</span></label>
                  <span className="text-[10px] text-gray-400 font-mono">{tagsInput.length}/100</span>
                </div>
                <Input
                  value={tagsInput} maxLength={100}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="e.g. Organic, High Yield, Best Quality"
                  className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-xl focus:border-violet-500 focus:bg-white h-10"
                />
                {tagsInput && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tagsInput.split(",").map(t => t.trim()).filter(Boolean).map(t => (
                      <span key={t} className="bg-violet-100 text-violet-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-violet-200">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ╔══════════════════════════════╗
              ║  Section 4: Preview & Publish ║
              ╚══════════════════════════════╝ */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-800 px-5 py-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-black flex items-center justify-center">4</div>
              <h2 className="text-sm font-bold text-white">Product Preview & Publish</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-4">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl bg-white border-2 border-gray-200 p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                    <img src={imageUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-black text-gray-900 truncate">{productName || "Product Name"}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">{brand} · {category}</p>
                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{description.slice(0, 80)}{description.length > 80 ? "…" : ""}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px] font-bold px-2 py-0">{variants.length} Variants</Badge>
                      {isActive
                        ? <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] font-bold px-2 py-0">🟢 Live</Badge>
                        : <Badge className="bg-gray-100 text-gray-500 border-gray-200 text-[10px] font-bold px-2 py-0">⚪ Draft</Badge>
                      }
                    </div>
                  </div>
                </div>

                {/* Variant mini-list */}
                <div className="mt-3 border-t border-gray-200 pt-3 space-y-1.5">
                  {variants.map(v => (
                    <div key={v.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {v.variantImageUrl
                          ? <img src={v.variantImageUrl} alt={v.sizeWeight} className="w-6 h-6 rounded object-cover border border-blue-200" />
                          : <span className="text-sm">{packingEmoji(v.packingType)}</span>
                        }
                        <span className="font-semibold text-gray-700">{v.sizeWeight}</span>
                        <span className="text-gray-400">{v.packingType}</span>
                        {v.variantImageUrl && <span className="text-[10px] text-blue-600 font-bold">📷</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 line-through text-[10px]">₹{v.mrp}</span>
                        <span className="font-black text-emerald-700">₹{v.salePrice}</span>
                        <span className="text-gray-400 text-[10px]">Qty: {v.stockQty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}
                    className="h-10 px-5 rounded-xl text-xs font-bold text-gray-600 border-gray-300 hover:bg-gray-100 cursor-pointer">
                    Cancel
                  </Button>
                )}
                <Button type="button" variant="outline"
                  onClick={() => toast.success("Draft saved successfully!")}
                  className="h-10 px-5 rounded-xl text-xs font-bold text-violet-700 bg-violet-50 border-violet-200 hover:bg-violet-100 cursor-pointer">
                  💾 Save as Draft
                </Button>
                <Button type="button" onClick={handlePublish}
                  className="h-10 px-6 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 gap-2 cursor-pointer">
                  Publish Product <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

