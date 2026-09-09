import { useState, useRef, useEffect } from "react";
import { Search, Star, Filter, Phone, X, MapPin, MessageCircle, Package, ChevronRight, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext.tsx";
import type { CropListing } from "@/context/AppContext.tsx";
import { api } from "@/services/api.ts";

export interface LiveProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  rating: number;
  reviews: number;
  img: string;
  badge?: string;
  brand?: string;
  description?: string;
}

interface CropDetailModalProps {
  crop: CropListing;
  onClose: () => void;
}

function CropDetailModal({ crop, onClose }: CropDetailModalProps) {
  const { t } = useApp();
  const allImages = crop.images && crop.images.length > 0 ? crop.images : [crop.image || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80"];
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#141414] border border-white/10 rounded-2xl max-w-md w-full z-10 overflow-hidden shadow-2xl">
        <div className="relative h-60 overflow-hidden bg-black/50">
          <img
            src={allImages[activeImgIdx] || allImages[0]}
            alt={crop.cropName}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 bg-black/60 rounded-full p-1.5 text-white hover:bg-black cursor-pointer z-10">
            <X className="h-4 w-4" />
          </button>
          {allImages.length > 1 && (
            <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-mono px-2 py-1 rounded-full border border-white/20">
              ð· {activeImgIdx + 1} / {allImages.length}
            </span>
          )}
          <div className="absolute bottom-0 left-0 p-4">
            <Badge className="bg-primary/90 text-black text-xs font-bold mb-1">{t.buyInputs.farmerListedBadge}</Badge>
            <h3 className="text-xl font-black text-white">{crop.cropName}</h3>
          </div>
        </div>

        {/* Thumbnail Gallery Strip for Multiple Images */}
        {allImages.length > 1 && (
          <div className="p-3 bg-black/30 border-b border-white/10 flex items-center gap-2 overflow-x-auto">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImgIdx(idx)}
                className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImgIdx === idx ? "border-primary scale-105 shadow-md shadow-primary/30" : "border-white/15 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Sample ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-xs text-gray-500">{t.buyInputs.weight}</p>
              <p className="text-sm font-bold text-white">{crop.weight}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-xs text-gray-500">{t.buyInputs.askingPrice}</p>
              <p className="text-sm font-black text-primary">â¹{crop.price}/Qtl</p>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">{t.buyInputs.sellerDetails}</p>
            <p className="text-sm font-bold text-white">{crop.sellerName}</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
              <MapPin className="h-3 w-3 text-primary" />
              {crop.address}, {crop.city}, {crop.district} â {crop.pincode}
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href={`tel:${crop.phone}`}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-black font-bold py-3 rounded-xl text-sm hover:bg-primary/90 transition-colors"
            >
              <Phone className="h-4 w-4" /> {t.buyInputs.callSeller}
            </a>
            <a
              href={`https://wa.me/91${crop.phone}?text=Hi, I saw your ${crop.cropName} listing on Krivexo. I am interested in buying.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-green-500 transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> {t.buyInputs.whatsappSeller}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgriMarketPage() {
  const { cropListings, dealerListings, addToCart, t, checkKccPermission } = useApp();
  const [products, setProducts] = useState<LiveProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<CropListing | null>(null);
  const [selectedDealerProduct, setSelectedDealerProduct] = useState<any | null>(null);

  const fetchLiveProducts = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const res = await api.getProducts();
      let rawList: any[] = [];
      if (res && res.data && Array.isArray(res.data.products)) {
        rawList = res.data.products;
      } else if (Array.isArray(res)) {
        rawList = res;
      }

      const formatted: LiveProduct[] = rawList.map((p: any) => {
        let cat = "Farm Tools";
        const n = (p.name || "").toLowerCase();
        const cid = (p.categoryId || "").toLowerCase();
        if (cid.includes("seed") || n.includes("seed") || n.includes("wheat") || n.includes("paddy")) cat = "Seeds";
        else if (cid.includes("fert") || n.includes("fertilizer") || n.includes("npk") || n.includes("dap") || n.includes("urea")) cat = "Fertilizers";
        else if (cid.includes("pest") || n.includes("pesticide") || n.includes("neem") || n.includes("spray")) cat = "Pesticides";
        else if (n.includes("organic") || n.includes("bio") || n.includes("compost")) cat = "Organic";
        else if (cid.includes("mach") || n.includes("sprayer") || n.includes("tool") || n.includes("tiller")) cat = "Farm Tools";

        return {
          id: p.id || p._id,
          name: p.name || "Agricultural Product",
          category: cat,
          price: p.effectivePrice || p.price || 0,
          unit: p.unit ? `1 ${p.unit}` : "1 pack",
          rating: 4.8,
          reviews: 50 + (p.name?.length || 5) * 4,
          img: (p.images && p.images[0]) || p.image || "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600",
          badge: p.discount ? `${p.discount}% OFF` : (p.brand ? p.brand : ""),
          brand: p.brand || "",
          description: p.description || "",
        };
      });

      setProducts(formatted);
    } catch (err: any) {
      setApiError(err?.message || "Failed to load products from server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveProducts();
  }, []);

  const approvedCrops = cropListings.filter((c) => c.status === "approved");
  const approvedDealerListings = (dealerListings || []).filter((d) => d.status === "approved");

  const filteredProducts = category === "All" || category === "Farmer Crops" || category === "Dealer Products"
    ? (category === "Farmer Crops" || category === "Dealer Products") ? [] : products.filter((p) =>
        (category === "All" || p.category === category) &&
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    : products.filter((p) =>
        p.category === category && p.name.toLowerCase().includes(search.toLowerCase())
      );

  const showFarmerCrops = category === "All" || category === "Farmer Crops";
  const filteredCrops = approvedCrops.filter((c) =>
    c.cropName.toLowerCase().includes(search.toLowerCase())
  );

  const showDealerProducts = category === "All" || category === "Dealer Products";
  const filteredDealerProducts = approvedDealerListings.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    (d.category && d.category.toLowerCase().includes(search.toLowerCase())) ||
    (d.dealerName && d.dealerName.toLowerCase().includes(search.toLowerCase()))
  );

  const handleViewDetails = (crop: CropListing) => {
    setSelectedCrop(crop);
  };

  const handleAddToCart = (product: { id: string; name: string; category?: string; price: number; unit?: string; img?: string; sellerName?: string }) => {
    if (!checkKccPermission("buy products and add items to cart")) return;
    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      unit: product.unit,
      image: product.img,
      sellerName: product.sellerName,
    });
    toast.success(`${product.name} added to cart!`, {
      action: {
        label: "View Cart",
        onClick: () => (window.location.href = "/cart"),
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      {selectedCrop && <CropDetailModal crop={selectedCrop} onClose={() => setSelectedCrop(null)} />}
      {selectedDealerProduct && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedDealerProduct(null)} />
          <div className="relative bg-[#141414] border border-white/10 rounded-2xl max-w-md w-full z-10 overflow-hidden shadow-2xl">
            <div className="relative h-60 overflow-hidden bg-black/50">
              <img
                src={(selectedDealerProduct.images && selectedDealerProduct.images[0]) || selectedDealerProduct.image || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80"}
                alt={selectedDealerProduct.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
              <button onClick={() => setSelectedDealerProduct(null)} className="absolute top-3 right-3 bg-black/60 rounded-full p-1.5 text-white hover:bg-black cursor-pointer z-10">
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-0 left-0 p-4">
                <Badge className="bg-emerald-500 text-black text-xs font-bold mb-1">Verified Dealer Product</Badge>
                <h3 className="text-xl font-black text-white">{selectedDealerProduct.title}</h3>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Category: {selectedDealerProduct.category}</span>
                <span className="text-xl font-black text-emerald-400">â¹{selectedDealerProduct.price} <span className="text-xs font-normal text-gray-400">/{selectedDealerProduct.unit}</span></span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{selectedDealerProduct.description || "High quality agricultural input supplied directly by verified dealer."}</p>
              <div className="bg-white/5 rounded-xl p-3 text-xs text-gray-400">
                <p className="font-semibold text-white mb-1">Dealer: {selectedDealerProduct.dealerName}</p>
                <p className="flex items-center gap-1"><MapPin className="h-3 w-3 text-emerald-400" /> {selectedDealerProduct.location || "Patna, Bihar"}</p>
              </div>
              <Button
                onClick={() => {
                  handleAddToCart({
                    id: selectedDealerProduct.id,
                    name: selectedDealerProduct.title,
                    category: selectedDealerProduct.category || "Dealer Products",
                    price: selectedDealerProduct.price,
                    unit: selectedDealerProduct.unit,
                    img: (selectedDealerProduct.images && selectedDealerProduct.images[0]) || selectedDealerProduct.image,
                    sellerName: selectedDealerProduct.dealerName,
                  });
                  setSelectedDealerProduct(null);
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm h-10 rounded-xl"
              >
                Add to Cart &amp; Order
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative h-44 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] flex items-end px-6 pb-6">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-4xl font-black" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              <span className="text-primary">{t.buyInputs.title}</span> {t.buyInputs.titleHighlight}
            </h1>
            <p className="text-gray-400 text-sm mt-1">{t.buyInputs.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input placeholder={t.buyInputs.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white" />
          </div>
          <Button variant="ghost" className="border border-white/10 text-gray-300 shrink-0">
            <Filter className="h-4 w-4 mr-2" /> {t.buyInputs.filter}
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {[
            { key: "All", label: t.buyInputs.all },
            { key: "Seeds", label: t.buyInputs.seeds },
            { key: "Fertilizers", label: t.buyInputs.fertilizers },
            { key: "Pesticides", label: t.buyInputs.pesticides },
            { key: "Farm Tools", label: t.buyInputs.farmTools },
            { key: "Organic", label: t.buyInputs.organic },
            { key: "Farmer Crops", label: `ð¾ ${t.buyInputs.userCrops}` },
            { key: "Dealer Products", label: `ðª Dealer Products` },
          ].map((c) => (
            <button key={c.key} onClick={() => setCategory(c.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${category === c.key ? "bg-primary text-black shadow-lg shadow-primary/20 scale-105" : "bg-white/5 border border-white/10 text-gray-300 hover:border-primary/40 hover:bg-primary/5"}`}>
              {c.label}
            </button>
          ))}
        </div>

        {/* 1. Farmer-listed Crops Section */}
        {showFarmerCrops && filteredCrops.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">{t.buyInputs.farmerCropsTitle}</h2>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">{filteredCrops.length} {t.buyInputs.available}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCrops.map((crop) => (
                <div key={crop.id}
                  className="bg-[#111] border border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all group hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={crop.image || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80"}
                      alt={crop.cropName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                    <Badge className="absolute top-2 left-2 bg-amber-500/90 text-black text-[10px] font-bold">{t.buyInputs.farmerListedBadge}</Badge>
                    <div className="absolute bottom-0 left-0 p-3">
                      <p className="text-xs text-gray-300 flex items-center gap-1"><MapPin className="h-3 w-3" />{crop.district}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold mb-1 text-white">{crop.cropName}</h3>
                    <p className="text-xs text-gray-400 mb-2">{t.buyInputs.by} {crop.sellerName} Â· {crop.weight}</p>
                    <div className="flex items-end justify-between">
                      <div className="text-xl font-black text-amber-400" style={{ fontFamily: "Rajdhani, sans-serif" }}>â¹{crop.price}<span className="text-xs text-gray-500 font-normal">/Qtl</span></div>
                      <div className="flex gap-1.5">
                        <Button size="sm" onClick={() => {
                          handleAddToCart({
                            id: crop.id,
                            name: crop.cropName,
                            category: "Farmer Crops",
                            price: crop.price,
                            unit: crop.weight,
                            img: crop.image,
                            sellerName: crop.sellerName
                          });
                        }} className="bg-primary hover:bg-primary/90 text-black text-xs font-bold h-8 px-2.5 rounded-lg">
                          + Cart
                        </Button>
                        <Button size="sm" onClick={() => handleViewDetails(crop)}
                          className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold h-8 px-2.5 rounded-lg">
                          {t.buyInputs.viewDetails} <ChevronRight className="h-3 w-3 ml-0.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Verified Dealers Products Section â Directly below Farmer-Listed Crops */}
        {showDealerProducts && filteredDealerProducts.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <Package className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xl font-bold">Dealers Products</h2>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                {filteredDealerProducts.length} Verified
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDealerProducts.map((dealerProd) => {
                const imgUrl = (dealerProd.images && dealerProd.images[0]) || dealerProd.image || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80";
                return (
                  <div key={dealerProd.id}
                    className="bg-[#111] border border-emerald-500/20 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all group hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10">
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={imgUrl}
                        alt={dealerProd.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                      <Badge className="absolute top-2 left-2 bg-emerald-500/90 text-black text-[10px] font-bold">
                        Verified Dealer
                      </Badge>
                      <div className="absolute bottom-0 left-0 p-3">
                        <p className="text-xs text-gray-300 flex items-center gap-1 font-medium">
                          <MapPin className="h-3 w-3 text-emerald-400" />
                          {dealerProd.location || "Patna, Bihar"}
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold mb-1 text-white">{dealerProd.title}</h3>
                      <p className="text-xs text-gray-400 mb-2">By {dealerProd.dealerName} Â· {dealerProd.unit}</p>
                      <div className="flex items-end justify-between">
                        <div className="text-xl font-black text-emerald-400" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                          â¹{dealerProd.price}
                          <span className="text-xs text-gray-500 font-normal">/{dealerProd.unit}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart({
                              id: dealerProd.id,
                              name: dealerProd.title,
                              category: dealerProd.category || "Dealer Products",
                              price: Number(dealerProd.price) || 0,
                              unit: dealerProd.unit,
                              img: imgUrl,
                              sellerName: dealerProd.dealerName,
                            })}
                            className="bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold h-8 px-2.5 rounded-lg"
                          >
                            + Cart
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setSelectedDealerProduct(dealerProd)}
                            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold h-8 px-2.5 rounded-lg"
                          >
                            Details <ChevronRight className="h-3 w-3 ml-0.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
              <span className="text-sm text-gray-400 font-medium">Fetching real marketplace products from database...</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-[#141414] border border-white/5 rounded-2xl p-4 animate-pulse">
                  <div className="h-40 bg-white/5 rounded-xl mb-3" />
                  <div className="h-3 bg-white/10 rounded w-1/3 mb-2" />
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-3" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-5 bg-white/10 rounded w-1/4" />
                    <div className="h-8 bg-white/10 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* API Error State */}
        {apiError && !isLoading && (
          <div className="mb-8 p-5 bg-rose-950/40 border border-rose-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-rose-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-rose-200">Unable to load live marketplace products</h4>
                <p className="text-xs text-rose-300/80">{apiError}</p>
              </div>
            </div>
            <Button
              onClick={fetchLiveProducts}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs h-9 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </Button>
          </div>
        )}

        {/* Live Agri Products from Database */}
        {!isLoading && filteredProducts.length > 0 && (
          <div>
            {showFarmerCrops && filteredCrops.length > 0 && (
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-xl font-bold">{t.buyInputs.agriInputsTitle}</h2>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                  {filteredProducts.length} Verified Products
                </Badge>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-primary/40 transition-all group hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-40 overflow-hidden bg-black/40">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600";
                        }}
                      />
                      {p.badge && (
                        <Badge className="absolute top-2 left-2 bg-primary text-black text-[10px] font-bold">
                          {p.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="p-3.5 sm:p-4">
                      <div className="text-[10px] text-primary mb-1 font-medium uppercase tracking-wider">{p.category}</div>
                      <h3 className="text-sm font-bold mb-1.5 line-clamp-2 text-white leading-tight">{p.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-semibold">{p.rating}</span>
                        <span className="text-xs text-gray-500">({p.reviews})</span>
                      </div>
                      {p.description && (
                        <p className="text-[11px] text-gray-400 line-clamp-2 mb-2 leading-relaxed">
                          {p.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="p-3.5 sm:p-4 pt-0">
                    <div className="flex items-end justify-between gap-2 border-t border-white/5 pt-3">
                      <div className="min-w-0">
                        <div className="text-base sm:text-lg font-black text-primary truncate" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                          â¹{p.price.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">{p.unit}</div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(p)}
                        className="bg-primary text-black text-xs font-semibold h-8 px-3 rounded-lg hover:bg-primary/90 shrink-0 cursor-pointer"
                      >
                        {t.buyInputs.addToCart}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && filteredCrops.length === 0 && (
          <div className="text-center py-20 bg-white/5 border border-white/5 rounded-3xl p-8">
            <Package className="h-12 w-12 mx-auto mb-3 text-gray-600" />
            <h3 className="text-lg font-bold text-white mb-1">No products found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mb-5">
              {search
                ? `No products matched your search "${search}". Try searching another crop, seed or fertilizer.`
                : `There are currently no products listed in the "${category}" category.`}
            </p>
            {(search || category !== "All") && (
              <Button
                variant="outline"
                onClick={() => { setSearch(""); setCategory("All"); }}
                className="text-xs border-white/10 text-gray-300 hover:bg-white/10 cursor-pointer"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
