import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CheckCircle2, CreditCard, Wallet, QrCode, Truck, ShieldCheck, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import { useApp } from "@/context/AppContext.tsx";
import { toast } from "sonner";
import { api } from "@/services/api.ts";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity, clearCart, checkoutCart, orders, user, kccDetails, kccAvailableBalance, checkKccPermission, isKccIssued, setIsKccAppModalOpen, walletBalance } = useApp();

  const [activeTab, setActiveTab] = useState<"cart" | "orders">("cart");
  const [paymentMethod, setPaymentMethod] = useState<"kcc" | "upi" | "cod" | "wallet">("kcc");
  const [deliveryAddress, setDeliveryAddress] = useState<string>(() => {
    if (user) {
      return `${user.village ? user.village + ", " : ""}${user.district || ""}, ${user.state || ""}`.trim();
    }
    return "Patna, Bihar";
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<string | null>(null);

  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingOrders(true);
    api.getOrders().then((res) => {
      if (!isMounted) return;
      if (Array.isArray(res)) {
        setDbOrders(res);
      }
    }).catch((err) => console.warn("[Cart] Failed to fetch orders:", err))
      .finally(() => { if (isMounted) setIsLoadingOrders(false); });
    return () => { isMounted = false; };
  }, [activeTab]);

  const displayOrders = dbOrders.length > 0 ? dbOrders : orders;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const grandTotal = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (!checkKccPermission("checkout and place orders")) return;
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    if (!deliveryAddress.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }

    if (paymentMethod === "wallet" && walletBalance < grandTotal) {
      toast.error(`Insufficient wallet balance! Available: ₹${walletBalance.toLocaleString("en-IN")}, Required: ₹${grandTotal.toLocaleString("en-IN")}. Please add money to your wallet.`);
      return;
    }
    if (paymentMethod === "kcc" && kccAvailableBalance < grandTotal) {
      toast.error(`Insufficient KCC credit limit! Available: ₹${kccAvailableBalance.toLocaleString("en-IN")}, Required: ₹${grandTotal.toLocaleString("en-IN")}.`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = checkoutCart(paymentMethod, deliveryAddress);
      setIsSubmitting(false);

      if (result.success && result.orderId) {
        setLastCompletedOrder(result.orderId);
        toast.success(result.message);
      } else {
        toast.error(result.message || "Failed to process order.");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Page Banner */}
        <div className="relative bg-linear-to-b from-primary/10 via-primary/5 to-transparent border-b border-white/10 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                  <span>/</span>
                  <Link to="/agri-market" className="hover:text-primary transition-colors">Buy Inputs</Link>
                  <span>/</span>
                  <span className="text-primary font-semibold">Shopping Cart</span>
                </div>
                <h1 className="text-3xl font-black flex items-center gap-3" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                  <ShoppingCart className="h-8 w-8 text-primary" /> My Personal Cart
                </h1>
                <p className="text-gray-400 text-xs mt-1">
                  Manage your items, check out with Kisan Credit Card, UPI or Wallet, and track your farm orders.
                </p>
              </div>

              {/* View Switch Tabs */}
              <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-xl shrink-0 self-start sm:self-auto">
                <button
                  onClick={() => setActiveTab("cart")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === "cart" ? "bg-primary text-black shadow-lg" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" /> Cart ({cart.reduce((a, b) => a + b.quantity, 0)})
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === "orders" ? "bg-primary text-black shadow-lg" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" /> My Orders ({orders.length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* KCC APPLICATION BANNER */}
          {!isKccIssued && (
            <div className="mb-6 bg-linear-to-r from-amber-950/90 via-amber-900/60 to-black border-2 border-amber-500/70 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400 font-bold">
                  🔒
                </div>
                <div>
                  <h3 className="text-base font-black text-amber-200">
                    Cart Checkout Gated — Apply for KCC Now
                  </h3>
                  <p className="text-xs text-gray-300 max-w-2xl">
                    Kisan Credit Card (KCC) account verification is required to place order and checkout. Apply now to issue your card!
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setIsKccAppModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-400 text-black font-black text-xs py-2.5 px-6 rounded-xl shrink-0 shadow-md animate-pulse cursor-pointer border border-amber-300"
              >
                Apply for KCC Now →
              </Button>
            </div>
          )}
          
          {/* ORDER SUCCESS OVERLAY / MESSAGE */}
          {lastCompletedOrder && (
            <div className="mb-8 p-6 bg-linear-to-r from-emerald-950/80 via-emerald-900/40 to-black border border-emerald-500/40 rounded-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs mb-1">
                      Order Confirmed
                    </Badge>
                    <h3 className="text-xl font-bold text-white">Order {lastCompletedOrder} Placed Successfully!</h3>
                    <p className="text-xs text-gray-300 mt-1">
                      Your items will be packed and dispatched shortly. Delivery to: <span className="font-semibold text-emerald-300">{deliveryAddress}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 shrink-0">
                  <Button
                    onClick={() => { setLastCompletedOrder(null); setActiveTab("orders"); }}
                    className="bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400"
                  >
                    View My Orders
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/agri-market")}
                    className="border-white/20 text-white text-xs hover:bg-white/10"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "cart" ? (
            cart.length === 0 ? (
              /* Empty Cart State */
              <div className="text-center py-20 bg-[#111] border border-white/10 rounded-3xl p-8">
                <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  <ShoppingCart className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Your Personal Cart is Empty</h2>
                <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                  You haven't added any agricultural inputs or crops to your cart yet. Explore our market for verified seeds, fertilizers, and farmer crops.
                </p>
                <div className="flex justify-center gap-4">
                  <Link to="/agri-market">
                    <Button className="bg-primary text-black font-bold hover:bg-primary/90">
                      Explore Agri Market <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              /* Cart Layout with Items & Checkout */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left 2 Columns: Items List */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      Cart Items ({cart.length})
                    </h2>
                    <button
                      onClick={clearCart}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Clear Cart
                    </button>
                  </div>

                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#111] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/30 transition-all"
                      >
                        {/* Item Info */}
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&q=80"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-xl border border-white/10 shrink-0"
                          />
                          <div>
                            {item.category && (
                              <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">
                                {item.category}
                              </span>
                            )}
                            <h3 className="text-sm font-bold text-white leading-snug">{item.name}</h3>
                            {item.sellerName && (
                              <p className="text-[11px] text-amber-400 font-medium">Listed by: {item.sellerName}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-0.5">
                              ₹{item.price} {item.unit ? `/ ${item.unit}` : ""}
                            </p>
                          </div>
                        </div>

                        {/* Quantity Controls & Price */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-white/5">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-white/10 rounded-xl bg-white/5 overflow-hidden">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 hover:bg-white/10 text-gray-300 transition-colors cursor-pointer"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="px-3 text-xs font-bold text-white min-w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-white/10 text-gray-300 transition-colors cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="text-right">
                            <div className="text-base font-black text-primary" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                              ₹{item.price * item.quantity}
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-[11px] text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <Link to="/agri-market" className="text-xs text-gray-400 hover:text-primary flex items-center gap-1 transition-colors">
                      <ArrowLeft className="h-3.5 w-3.5" /> Add more items from Agri Market
                    </Link>
                  </div>
                </div>

                {/* Right Column: Checkout & Summary */}
                <div className="space-y-6">
                  <div className="bg-[#111] border border-white/10 rounded-3xl p-6 space-y-6">
                    <h3 className="text-lg font-bold border-b border-white/10 pb-3 flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" /> Order Summary
                    </h3>

                    {/* Delivery Address Input */}
                    <div>
                      <label className="text-xs font-semibold text-gray-300 mb-1.5 flex items-center justify-between">
                        <span>Delivery Address</span>
                        <span className="text-[10px] text-primary">Required</span>
                      </label>
                      <Input
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Village, District, Pin code..."
                        className="bg-white/5 border-white/10 text-white text-xs"
                      />
                    </div>

                    {/* Payment Method Options */}
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-2">
                        Select Payment Method
                      </label>
                      <div className="space-y-2">
                        {/* KCC Card Option */}
                        <div
                          onClick={() => setPaymentMethod("kcc")}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                            paymentMethod === "kcc"
                              ? "border-primary bg-primary/10 text-white"
                              : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                          }`}
                        >
                          <div className={`p-2 rounded-xl ${paymentMethod === "kcc" ? "bg-primary text-black" : "bg-white/10 text-white"}`}>
                            <CreditCard className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-white flex items-center justify-between">
                              <span>Kisan Credit Card (KCC)</span>
                              <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px]">Recommended</Badge>
                            </div>
                            <div className="text-[10px] mt-0.5 flex items-center justify-between">
                              <span className="text-gray-400">Card: {kccDetails?.cardNumber || user?.kccCardNumber || "KCC-BH-2026-9041"}</span>
                              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                                kccAvailableBalance >= grandTotal ? "bg-emerald-500/20 text-emerald-400 font-semibold" : "bg-red-500/20 text-red-400 font-semibold"
                              }`}>
                                Limit: ₹{kccAvailableBalance.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Krivexo Wallet Option */}
                        <div
                          onClick={() => setPaymentMethod("wallet")}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                            paymentMethod === "wallet"
                              ? "border-primary bg-primary/10 text-white"
                              : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                          }`}
                        >
                          <div className={`p-2 rounded-xl ${paymentMethod === "wallet" ? "bg-primary text-black" : "bg-white/10 text-white"}`}>
                            <Wallet className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-white flex items-center gap-2">
                              Krivexo Kisan Wallet
                              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                walletBalance >= grandTotal ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                              }`}>
                                ₹{walletBalance.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <div className="text-[10px] mt-0.5">
                              {walletBalance >= grandTotal
                                ? <span className="text-gray-400">Direct debit from wallet balance</span>
                                : <span className="text-red-400 font-semibold">⚠ Insufficient balance – add ₹{(grandTotal - walletBalance).toLocaleString("en-IN")} more</span>
                              }
                            </div>
                          </div>
                        </div>

                        {/* UPI Payment */}
                        <div
                          onClick={() => setPaymentMethod("upi")}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                            paymentMethod === "upi"
                              ? "border-primary bg-primary/10 text-white"
                              : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                          }`}
                        >
                          <div className={`p-2 rounded-xl ${paymentMethod === "upi" ? "bg-primary text-black" : "bg-white/10 text-white"}`}>
                            <QrCode className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-white">UPI / GPay / PhonePe</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">Instant online payment via UPI</div>
                          </div>
                        </div>

                        {/* Cash on Delivery */}
                        <div
                          onClick={() => setPaymentMethod("cod")}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                            paymentMethod === "cod"
                              ? "border-primary bg-primary/10 text-white"
                              : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                          }`}
                        >
                          <div className={`p-2 rounded-xl ${paymentMethod === "cod" ? "bg-primary text-black" : "bg-white/10 text-white"}`}>
                            <Truck className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-white">Cash on Delivery (COD)</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">Pay cash when items arrive</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-2 text-xs pt-3 border-t border-white/10">
                      <div className="flex justify-between text-gray-400">
                        <span>Items Subtotal</span>
                        <span className="font-semibold text-white">₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Delivery Fee</span>
                        <span className="font-semibold text-emerald-400">
                          {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                        <span>Total Payable</span>
                        <span className="text-xl font-black text-primary" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                          ₹{grandTotal}
                        </span>
                      </div>
                    </div>

                    {/* Checkout Action Button */}
                    <Button
                      onClick={handleCheckout}
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-black font-black py-3 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-primary/20"
                    >
                      {isSubmitting ? "Processing Order..." : `Checkout Now (₹${grandTotal})`}
                    </Button>
                  </div>
                </div>

              </div>
            )
          ) : (
            /* Orders History Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                  My Farm Orders ({displayOrders.length})
                </h2>
                {isLoadingOrders && (
                  <div className="flex items-center gap-1.5 text-xs text-primary">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Syncing with Farma Database...</span>
                  </div>
                )}
              </div>

              {isLoadingOrders && displayOrders.length === 0 ? (
                <div className="space-y-3">
                  {[1, 2].map((n) => (
                    <div key={n} className="bg-[#111] border border-white/10 rounded-2xl p-5 animate-pulse space-y-3">
                      <div className="h-4 bg-white/10 rounded w-1/4" />
                      <div className="h-3 bg-white/5 rounded w-1/2" />
                      <div className="h-3 bg-white/5 rounded w-1/3" />
                    </div>
                  ))}
                </div>
              ) : displayOrders.length === 0 ? (
                <div className="text-center py-16 bg-[#111] border border-white/10 rounded-3xl p-8">
                  <ShoppingBag className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-300 text-sm font-semibold mb-1">No orders placed yet</p>
                  <p className="text-xs text-gray-500 mb-4">Browse agricultural products and place your first order.</p>
                  <Button
                    onClick={() => navigate("/agri-market")}
                    className="bg-primary hover:bg-primary/90 text-black text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                  >
                    Browse Market →
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayOrders.map((ord) => (
                    <div key={ord.id || ord._id} className="bg-[#111] border border-white/10 rounded-2xl p-5 space-y-3 hover:border-white/20 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                        <div>
                          <span className="text-xs font-bold text-primary">{ord.id || ord.orderNumber}</span>
                          <span className="text-[11px] text-gray-400 ml-2">
                            {ord.createdAt ? new Date(ord.createdAt).toLocaleString("en-IN") : "Today"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                            {ord.status || ord.orderStatus || "Confirmed"}
                          </Badge>
                          <Badge className="bg-white/10 text-gray-300 border-white/10 text-xs uppercase">
                            Payment: {ord.paymentMethod || "UPI"}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {(ord.items || []).map((it: any, idx: number) => (
                          <div key={it.id || idx} className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2 text-gray-200">
                              <span className="font-semibold">{it.quantity || 1}x</span>
                              <span>{it.name || "Agricultural Item"}</span>
                            </div>
                            <span className="font-mono text-gray-300">₹{((it.price || 0) * (it.quantity || 1)).toLocaleString("en-IN")}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
                        <span className="text-gray-400 truncate max-w-md">
                          Delivery Address: {ord.deliveryAddress || (ord.shippingAddress?.addressLine ? ord.shippingAddress.addressLine : "Registered Farm Address")}
                        </span>
                        <span className="font-black text-sm text-primary" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                          Total: ₹{(ord.totalAmount || ord.amount || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
