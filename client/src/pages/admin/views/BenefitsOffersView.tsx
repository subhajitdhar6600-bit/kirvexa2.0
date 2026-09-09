import { useState, useEffect } from "react";
import {
  Search, Plus, Eye, Edit2, Trash2, Filter, Download,
  CheckCircle, Clock, XCircle, Tag, Gift, Percent, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import { api } from "@/services/api";

interface OfferItem {
  id: string;
  title: string;
  sub: string;
  badgeText: string;
  badgeColor: string;
  type: "Discount" | "Benefit" | "Cashback";
  applicableOn: string;
  cardType: string;
  benefitVal: string;
  validity: string;
  status: "Active" | "Upcoming" | "Expired";
}

export default function BenefitsOffersView() {
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cardTypeFilter, setCardTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;
    api.getDealerListings()
      .then((res) => {
        if (!isMounted) return;
        if (Array.isArray(res)) {
          const loaded: OfferItem[] = res.map((d: any, idx: number) => ({
            id: d.id || d._id || `OFF-${100 + idx}`,
            title: d.title || d.productName || "Dealer Special Offer",
            sub: d.description || "Special offer for registered farmers",
            badgeText: d.discount ? `${d.discount}% OFF` : "OFFER",
            badgeColor: "bg-emerald-600",
            type: "Discount",
            applicableOn: d.category || "All Products",
            cardType: "All Cards",
            benefitVal: d.discount ? `${d.discount}% OFF` : "Special Offer",
            validity: d.validUntil || "Current Month",
            status: "Active",
          }));
          setOffers(loaded);
        }
      })
      .catch((err) => console.error("Error loading offers:", err))
      .finally(() => setLoading(false));

    return () => { isMounted = false; };
  }, []);

  const filteredOffers = offers.filter((o) => {
    const matchSearch =
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.sub.toLowerCase().includes(search.toLowerCase()) ||
      o.applicableOn.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status.toLowerCase() === statusFilter.toLowerCase();
    const matchCard = cardTypeFilter === "all" || o.cardType.toLowerCase().includes(cardTypeFilter.toLowerCase());
    const matchCat = categoryFilter === "all" || o.type.toLowerCase() === categoryFilter.toLowerCase();
    return matchSearch && matchStatus && matchCard && matchCat;
  });

  const handleToggleStatus = (id: string) => {
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const newStatus = o.status === "Active" ? "Expired" : "Active";
          toast.success(`Offer status changed to ${newStatus}`);
          return { ...o, status: newStatus };
        }
        return o;
      })
    );
  };

  const handleDeleteOffer = (id: string) => {
    if (!window.confirm(`Are you sure you want to delete this offer?`)) return;
    setOffers((prev) => prev.filter((o) => o.id !== id));
    toast.success("Offer deleted successfully");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Card Benefits &amp; Offers</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage discounts, offers, and benefits across registered cards</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => toast.info("Create New Offer Modal")} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 rounded-xl font-semibold cursor-pointer">
            <Plus className="h-3.5 w-3.5" /> Create New Offer
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-gray-500">Active Offers</p>
            <p className="text-xl font-black text-emerald-600 mt-0.5">{offers.filter(o => o.status === "Active").length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Gift className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-gray-500">Total Discounts Claimed</p>
            <p className="text-xl font-black text-blue-600 mt-0.5">â¹ 45,200</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Percent className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-gray-500">Expired Offers</p>
            <p className="text-xl font-black text-gray-600 mt-0.5">{offers.filter(o => o.status === "Expired").length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-3.5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search offers..."
              className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 text-xs pl-9 h-9 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-400 text-xs">
            Loading offers from MongoDB...
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500">
            <Gift className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-800">No Benefits &amp; Offers Found</p>
            <p className="text-xs text-gray-400">There are currently no active offers matching your filters.</p>
          </div>
        ) : (
          filteredOffers.map((o) => (
            <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between hover:border-emerald-200 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-white font-bold text-[10px] ${o.badgeColor}`}>
                    {o.badgeText}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${o.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
                    {o.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{o.title}</h3>
                <p className="text-xs text-gray-500 mb-3">{o.sub}</p>
                <div className="space-y-1 text-[11px] text-gray-600 bg-gray-50 p-2.5 rounded-xl">
                  <div className="flex justify-between"><span>Category:</span> <span className="font-semibold text-gray-800">{o.applicableOn}</span></div>
                  <div className="flex justify-between"><span>Validity:</span> <span className="font-semibold text-gray-800">{o.validity}</span></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                <button onClick={() => handleToggleStatus(o.id)} className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer">
                  Toggle Status
                </button>
                <button onClick={() => handleDeleteOffer(o.id)} className="text-xs font-semibold text-red-600 hover:underline cursor-pointer">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
