import React, { useState } from "react";
import {
  Package, Plus, Trash2, Check, ArrowRight, UploadCloud,
  Camera, Info, CheckCircle2, ChevronRight, X, Sparkles,
  HelpCircle, Bell, User as UserIcon
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
  imageType?: "pack" | "bottle";
}

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
    { id: "v-1", sizeWeight: "100 GM", packingType: "Pack", mrp: 120, salePrice: 105, stockQty: 45, imageType: "pack" },
    { id: "v-2", sizeWeight: "250 GM", packingType: "Pack", mrp: 240, salePrice: 210, stockQty: 32, imageType: "pack" },
    { id: "v-3", sizeWeight: "500 GM", packingType: "Pack", mrp: 450, salePrice: 390, stockQty: 28, imageType: "pack" },
    { id: "v-4", sizeWeight: "1 LTR", packingType: "Bottle", mrp: 780, salePrice: 680, stockQty: 20, imageType: "bottle" },
  ]);

  // 3. Additional Info
  const [unitType, setUnitType] = useState("Gram / Litre");
  const [shelfLife, setShelfLife] = useState("24");
  const [isActive, setIsActive] = useState(true);
  const [tagsInput, setTagsInput] = useState("Organic, Plant Nutrition, High Yield");

  // Active step in the top wizard (1, 2, 3, 4)
  const [currentStep, setCurrentStep] = useState<number>(2);

  // Add a new variant row
  const handleAddVariant = () => {
    const newId = `v-${Date.now()}`;
    setVariants(prev => [
      ...prev,
      {
        id: newId,
        sizeWeight: "1 KG",
        packingType: "Pack",
        mrp: 500,
        salePrice: 420,
        stockQty: 10,
        imageType: "pack",
      },
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

  // Handle local image upload simulation
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result);
          toast.success("Product image uploaded successfully!");
        }
      };
      reader.readAsDataURL(file);
    }
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
    <div className="w-full bg-[#f8fafc] text-gray-800 font-sans min-h-screen p-3 md:p-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Product List Karein
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 font-medium">
            <span>Dashboard</span>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <span>Products</span>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <span className="text-emerald-700 font-semibold">Add New Product</span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <Button
            variant="outline"
            size="sm"
            className="bg-white border-gray-200 text-gray-700 hover:text-emerald-700 text-xs rounded-xl gap-1.5 shadow-xs"
          >
            <HelpCircle className="h-4 w-4 text-emerald-600" /> Help Center
          </Button>

          <div className="relative p-2 rounded-xl bg-white border border-gray-200 text-gray-600 shadow-xs cursor-pointer">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </div>

          <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 overflow-hidden flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-emerald-800" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-gray-900 leading-none">
                {dealerInfo.dealerName || "Amit Kumar"}
              </div>
              <div className="text-[10px] text-gray-500 font-medium leading-tight">
                {isAdmin ? "Admin / Supervisor" : "Dukandaar"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4-Step Wizard */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 mb-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1 */}
          <div
            onClick={() => setCurrentStep(1)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
              1
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 group-hover:text-emerald-700">
                Product Details
              </div>
              <div className="text-[11px] text-gray-500 leading-tight">
                Product ki basic jankari bharein
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => setCurrentStep(2)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0 ring-4 ring-emerald-100">
              2
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-800 group-hover:text-emerald-900">
                Variants (Size / Weight)
              </div>
              <div className="text-[11px] text-gray-500 leading-tight">
                Alag alag size / weight add karein
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => setCurrentStep(3)}
            className="flex items-center gap-3 cursor-pointer group opacity-80 hover:opacity-100"
          >
            <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 font-bold text-sm flex items-center justify-center border border-gray-200 shrink-0">
              3
            </div>
            <div>
              <div className="text-xs font-bold text-gray-700 group-hover:text-gray-900">
                Additional Info
              </div>
              <div className="text-[11px] text-gray-400 leading-tight">
                Aur jankari bharein
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div
            onClick={() => setCurrentStep(4)}
            className="flex items-center gap-3 cursor-pointer group opacity-70 hover:opacity-100"
          >
            <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 font-bold text-sm flex items-center justify-center border border-gray-200 shrink-0">
              4
            </div>
            <div>
              <div className="text-xs font-bold text-gray-600 group-hover:text-gray-900">
                Review & Publish
              </div>
              <div className="text-[11px] text-gray-400 leading-tight">
                Review karke publish karein
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: Section 1 (Product Details) & Section 3 (Additional Info) */}
        <div className="space-y-6">
          
          {/* Card 1: Product Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
              1. Product Details
            </h2>

            {/* Product Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-800">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-gray-400 font-mono">
                  {productName.length}/100
                </span>
              </div>
              <Input
                value={productName}
                maxLength={100}
                onChange={e => setProductName(e.target.value)}
                placeholder="e.g. Profex Super / Nano Urea"
                className="bg-gray-50/50 border-gray-200 text-gray-900 text-xs rounded-xl focus:bg-white"
              />
            </div>

            {/* Category & Brand */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 text-xs rounded-xl p-2.5 outline-none focus:border-emerald-500 focus:bg-white cursor-pointer font-medium"
                >
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
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Brand <span className="text-red-500">*</span>
                </label>
                <select
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 text-xs rounded-xl p-2.5 outline-none focus:border-emerald-500 focus:bg-white cursor-pointer font-medium"
                >
                  <option value="Profex">Profex</option>
                  <option value="Bayer CropScience">Bayer CropScience</option>
                  <option value="Syngenta">Syngenta</option>
                  <option value="IFFCO">IFFCO</option>
                  <option value="UPL Limited">UPL Limited</option>
                  <option value="Dhanuka Agritech">Dhanuka Agritech</option>
                  <option value="Tata Rallis">Tata Rallis</option>
                  <option value="Krivexa Agro Brand">Krivexa Agro Brand</option>
                </select>
              </div>
            </div>

            {/* Product Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-800">
                  Product Description <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-gray-400 font-mono">
                  {description.length}/500
                </span>
              </div>
              <textarea
                value={description}
                maxLength={500}
                rows={4}
                onChange={e => setDescription(e.target.value)}
                placeholder="Product ki khasiyat, fayde aur upyog karne ka tarika likhein..."
                className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 text-xs rounded-xl p-3 resize-none outline-none focus:border-emerald-500 focus:bg-white leading-relaxed"
              />
            </div>

            {/* Product Image Section */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                Product Image <span className="text-red-500">*</span>
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Image Preview Box */}
                <div className="relative border border-gray-200 rounded-2xl bg-gray-50 p-2 flex flex-col items-center justify-center overflow-hidden min-h-[150px]">
                  <img
                    src={imageUrl}
                    alt="Product preview"
                    className="max-h-28 object-contain rounded-lg mb-2"
                  />
                  <label className="w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    <span className="flex items-center justify-center gap-1 text-[11px] font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 py-1.5 px-2 rounded-lg cursor-pointer transition-colors shadow-2xs">
                      <Camera className="h-3 w-3 text-gray-500" /> Change Image
                    </span>
                  </label>
                </div>

                {/* Upload Trigger Box */}
                <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl bg-emerald-50/30 hover:bg-emerald-50/60 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <div className="text-xs font-bold text-gray-800">
                    Ek product ka photo upload karein
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    (JPG, PNG, WEBP)
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    Max size 5MB
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Card 3: Additional Information */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
              3. Additional Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Unit Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={unitType}
                  onChange={e => setUnitType(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 text-xs rounded-xl p-2.5 outline-none focus:border-emerald-500 focus:bg-white cursor-pointer font-medium"
                >
                  <option value="Gram / Litre">Gram / Litre</option>
                  <option value="Kilogram (KG)">Kilogram (KG)</option>
                  <option value="Litre (LTR)">Litre (LTR)</option>
                  <option value="Millilitre (ML)">Millilitre (ML)</option>
                  <option value="Pieces (PCS)">Pieces (PCS)</option>
                  <option value="Quintal / Ton">Quintal / Ton</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Shelf Life
                </label>
                <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-gray-50/50">
                  <Input
                    type="number"
                    value={shelfLife}
                    onChange={e => setShelfLife(e.target.value)}
                    className="border-0 bg-transparent text-xs text-gray-900 focus-visible:ring-0"
                  />
                  <span className="bg-gray-100 px-3 text-[11px] font-bold text-gray-600 flex items-center border-l border-gray-200">
                    Months
                  </span>
                </div>
              </div>

              <div className="pt-3 sm:pt-0">
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  Is Active
                </label>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    isActive ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      isActive ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Tags (Optional) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-800">
                  Tags (Optional)
                </label>
                <span className="text-[11px] text-gray-400 font-mono">
                  {tagsInput.length}/100
                </span>
              </div>
              <Input
                value={tagsInput}
                maxLength={100}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="Eg. Organic, Best Quality, High Yield"
                className="bg-gray-50/50 border-gray-200 text-gray-900 text-xs rounded-xl focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Section 2 (Variants) & Product Preview Card */}
        <div className="space-y-6">

          {/* Card 2: Variants (Size / Weight) */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
              2. Variants (Size / Weight)
            </h2>

            {/* Info notice banner */}
            <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3 flex items-start gap-2.5 text-blue-900 text-xs leading-relaxed">
              <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">{productName || "Profex"}</strong> is product ko alag alag size / weight me bechein. Sabhi variants yahin add karein.
              </div>
            </div>

            {/* Variants Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-500 font-bold border-b border-gray-100">
                    <th className="pb-2.5 font-bold">Size / Weight</th>
                    <th className="pb-2.5 font-bold">Packing Type</th>
                    <th className="pb-2.5 font-bold">MRP (₹) *</th>
                    <th className="pb-2.5 font-bold">Sale Price (₹) *</th>
                    <th className="pb-2.5 font-bold">Stock Qty *</th>
                    <th className="pb-2.5 text-center font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {variants.map((v, index) => (
                    <tr key={v.id} className="group hover:bg-gray-50/50 transition-colors">
                      {/* Size / Weight */}
                      <td className="py-2.5 pr-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-emerald-100/70 border border-emerald-200 flex items-center justify-center shrink-0">
                            {v.packingType === "Bottle" ? "🍾" : "📦"}
                          </div>
                          <Input
                            value={v.sizeWeight}
                            onChange={e => handleUpdateVariant(v.id, "sizeWeight", e.target.value)}
                            className="h-8 text-xs font-bold w-24 bg-white border-gray-200 rounded-lg"
                          />
                        </div>
                      </td>

                      {/* Packing Type */}
                      <td className="py-2.5 pr-2">
                        <select
                          value={v.packingType}
                          onChange={e => handleUpdateVariant(v.id, "packingType", e.target.value)}
                          className="h-8 text-xs bg-white border border-gray-200 rounded-lg px-2 outline-none font-medium cursor-pointer"
                        >
                          <option value="Pack">Pack</option>
                          <option value="Bottle">Bottle</option>
                          <option value="Bag">Bag</option>
                          <option value="Box">Box</option>
                          <option value="Can">Can</option>
                          <option value="Pouch">Pouch</option>
                          <option value="Drum">Drum</option>
                        </select>
                      </td>

                      {/* MRP */}
                      <td className="py-2.5 pr-2">
                        <Input
                          type="number"
                          value={v.mrp}
                          onChange={e => handleUpdateVariant(v.id, "mrp", Number(e.target.value))}
                          className="h-8 text-xs font-mono w-20 bg-white border-gray-200 rounded-lg"
                        />
                      </td>

                      {/* Sale Price */}
                      <td className="py-2.5 pr-2">
                        <Input
                          type="number"
                          value={v.salePrice}
                          onChange={e => handleUpdateVariant(v.id, "salePrice", Number(e.target.value))}
                          className="h-8 text-xs font-bold font-mono text-emerald-700 w-20 bg-white border-emerald-200 rounded-lg"
                        />
                      </td>

                      {/* Stock Qty */}
                      <td className="py-2.5 pr-2">
                        <Input
                          type="number"
                          value={v.stockQty}
                          onChange={e => handleUpdateVariant(v.id, "stockQty", Number(e.target.value))}
                          className="h-8 text-xs font-mono w-16 bg-white border-gray-200 rounded-lg"
                        />
                      </td>

                      {/* Action */}
                      <td className="py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(v.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                          title="Variant delete karein"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Variant Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddVariant}
              className="w-full sm:w-auto text-xs font-bold text-emerald-700 border-emerald-300 hover:bg-emerald-50 rounded-xl gap-1.5 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-emerald-600" /> Add Another Variant
            </Button>

            {/* Helper Notice */}
            <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium pt-2 border-t border-gray-100">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Aap jitne chahein variants (size / weight) add kar sakte hain.</span>
            </div>
          </div>

          {/* Product Preview Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Product Preview
            </h3>

            <div className="flex items-center gap-4 bg-gray-50/70 border border-gray-100 rounded-2xl p-4">
              <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                <img
                  src={imageUrl}
                  alt="Thumbnail"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-base font-black text-gray-900 truncate">
                  {productName || "Product Name"}
                </h4>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  Available in: {variants.map(v => v.sizeWeight).filter(Boolean).join(", ") || "100 GM, 250 GM, 500 GM, 1 LTR"}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                    {variants.length} Variants
                  </Badge>
                  {isActive && (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live on Store
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-5 mt-4 border-t border-gray-100">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="h-10 px-5 rounded-xl text-xs font-bold text-gray-700 border-gray-300 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  toast.success("Draft saved successfully!");
                }}
                className="h-10 px-5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50/60 border-emerald-200 hover:bg-emerald-100 cursor-pointer"
              >
                Save as Draft
              </Button>

              <Button
                type="button"
                onClick={handlePublish}
                className="h-10 px-6 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-700/20 gap-2 cursor-pointer"
              >
                <span>Next: Additional Info</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
