import { useState, useMemo } from "react";
import {
  Printer, Download, Send, ArrowLeft, MoreHorizontal,
  CheckCircle, FileSpreadsheet, FileText, QrCode, Building2, Sprout
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext.tsx";
import { formatDate } from "@/lib/dateUtils.ts";

interface InvoiceDetailsViewProps {
  invoiceId?: string;
  orders?: any[];
  onBack?: () => void;
}

export default function InvoiceDetailsView({ invoiceId, orders: propOrders, onBack }: InvoiceDetailsViewProps) {
  const { orders: appOrders } = useApp();
  const allOrders = propOrders && propOrders.length > 0 ? propOrders : (appOrders || []);

  // Find targeted order
  const currentOrder = useMemo(() => {
    if (!allOrders || allOrders.length === 0) return null;
    if (invoiceId) {
      const cleanId = String(invoiceId).replace(/^#/, "").trim().toLowerCase();
      const found = allOrders.find((o: any) =>
        String(o.id || "").toLowerCase().includes(cleanId) ||
        cleanId.includes(String(o.id || "").toLowerCase())
      );
      if (found) return found;
    }
    return allOrders[0];
  }, [allOrders, invoiceId]);

  const displayInvId = invoiceId || (currentOrder ? `INV-${currentOrder.id}` : "INV-KRVX-001");
  const orderId = currentOrder?.id ? `#${currentOrder.id}` : "KRVX-ORD-01";
  const buyerName = currentOrder?.buyer || currentOrder?.userName || "Registered Farmer";
  const buyerPhone = currentOrder?.phone || currentOrder?.contactNumber || "9876543210";
  const buyerAddress = currentOrder?.shippingAddress || "Samastipur, Bihar - 848101, India";
  const orderAmount = Number(currentOrder?.totalAmount || currentOrder?.amount || 0);
  const paymentMethod = (currentOrder?.paymentMethod || "UPI").toUpperCase();
  const orderDate = currentOrder?.date || (currentOrder?.createdAt ? formatDate(currentOrder.createdAt) : formatDate(new Date()));

  // Calculate taxes (GST is 5% included or added for agricultural goods)
  const taxableValue = Math.round((orderAmount / 1.05) * 100) / 100;
  const totalGst = Math.round((orderAmount - taxableValue) * 100) / 100;
  const cgst = Math.round((totalGst / 2) * 100) / 100;
  const sgst = Math.round((totalGst - cgst) * 100) / 100;

  // Real items or fallback to real order items
  const items = currentOrder?.items && currentOrder.items.length > 0 ? currentOrder.items : [
    {
      name: currentOrder?.product || "Agricultural Certified Inputs",
      desc: "Certified Quality Farm Grade",
      hsn: "12099090",
      qty: parseInt(currentOrder?.qty || "1") || 1,
      unit: "PACK",
      rate: taxableValue,
      taxable: taxableValue,
      gst: 5,
      gstAmt: totalGst,
      total: orderAmount,
    }
  ];

  const handleDownloadPdf = () => {
    toast.success("Opening print dialog to Save as PDF...");
    window.print();
  };

  const handleDownloadExcel = () => {
    const csvContent = [
      ["INVOICE DETAILS", displayInvId],
      ["Order ID", orderId],
      ["Date", orderDate],
      ["Customer", buyerName],
      ["Phone", buyerPhone],
      ["Address", `"${buyerAddress}"`],
      ["Payment Mode", paymentMethod],
      [""],
      ["#", "Product Details", "HSN Code", "Qty", "Unit", "Rate", "Taxable Value", "GST %", "GST Amount", "Total"],
      ...items.map((it: any, idx: number) => {
        const qty = Number(it.qty || it.quantity || 1);
        const price = Number(it.price || it.rate || (taxableValue / qty));
        const taxVal = Math.round((price * qty) * 100) / 100;
        const itemGst = Math.round((taxVal * 0.05) * 100) / 100;
        return [idx + 1, `"${it.name || it.title || 'Item'}"`, it.hsn || "12099090", qty, it.unit || "UNIT", price, taxVal, "5%", itemGst, taxVal + itemGst];
      }),
      [""],
      ["Total Taxable Value", taxableValue],
      ["CGST (2.5%)", cgst],
      ["SGST (2.5%)", sgst],
      ["Grand Total", orderAmount]
    ].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `invoice_${displayInvId.replace(/[^a-zA-Z0-9]/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Invoice exported to spreadsheet");
  };

  return (
    <div className="space-y-5">
      {/* Header with action bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Invoice Details</h1>
          <p className="text-xs text-gray-500 mt-0.5">View, print and manage official tax invoice</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Dashboard</span><span>›</span><span>Orders & Sales</span><span>›</span><span>Invoices</span><span>›</span>
          <span className="text-emerald-600 font-medium">{displayInvId}</span>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline" className="h-8 text-xs gap-1.5 rounded-xl border-gray-200">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Orders
        </Button>
        <div className="flex items-center gap-2">
          <Button onClick={() => window.print()} variant="outline" className="h-8 text-xs gap-1.5 rounded-xl border-gray-200">
            <Printer className="h-3.5 w-3.5" /> Print Invoice
          </Button>
          <Button onClick={handleDownloadPdf} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 rounded-xl font-semibold">
            <Download className="h-3.5 w-3.5" /> Download PDF
          </Button>
          <Button onClick={() => toast.info("Sending invoice email to " + buyerName)} variant="outline" className="h-8 text-xs gap-1.5 rounded-xl border-gray-200">
            <Send className="h-3.5 w-3.5" /> Send Invoice
          </Button>
          <Button variant="outline" className="h-8 w-8 p-0 rounded-xl border-gray-200">
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </div>

      {/* Split: Tax Invoice Document Left + Right Controls */}
      <div className="flex gap-4 items-start">
        {/* Tax Invoice Document */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-xs text-gray-800 space-y-6">
          {/* Header Row: Company Details, QR Code, Invoice Metadata */}
          <div className="flex items-start justify-between border-b border-gray-100 pb-6">
            <div className="space-y-1 max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Sprout className="w-5 h-5" />
                </div>
                <span className="text-lg font-black text-gray-900 tracking-tight">Krivexo</span>
              </div>
              <p className="font-bold text-gray-900 text-xs">Krivexo Agritech Private Limited</p>
              <p className="text-[11px] text-gray-500">1st Floor, Arkipire Technology Pvt Ltd,</p>
              <p className="text-[11px] text-gray-500">Mukatapur Station Road, Samastipur, Bihar - 848101, India</p>
              <p className="text-[11px] text-gray-600 font-semibold mt-1">GSTIN: <span className="font-mono text-gray-800">10ABCDE1234F1Z5</span></p>
              <p className="text-[11px] text-gray-600 font-semibold">CIN: <span className="font-mono text-gray-800">U72900BR2023PTC062456</span></p>
            </div>

            {/* Center QR code */}
            <div className="text-center flex flex-col items-center">
              <span className="px-3 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                ORIGINAL FOR RECIPIENT
              </span>
              <p className="text-sm font-black text-gray-900 tracking-wide mb-2">TAX INVOICE</p>
              <div className="w-20 h-20 border-2 border-gray-800 rounded-lg p-1 bg-white flex items-center justify-center">
                <QrCode className="w-16 h-16 text-gray-900" />
              </div>
              <p className="text-[9px] text-gray-400 mt-1">Thank you for choosing Krivexo</p>
            </div>

            {/* Right Invoice Info */}
            <div className="space-y-1.5 text-right">
              <div><span className="text-gray-400">Invoice No: </span><span className="font-mono font-bold text-emerald-700">{displayInvId}</span></div>
              <div><span className="text-gray-400">Invoice Date: </span><span className="font-semibold text-gray-800">{orderDate}</span></div>
              <div><span className="text-gray-400">Order ID: </span><span className="font-mono font-bold text-gray-800">{orderId}</span></div>
              <div><span className="text-gray-400">Place of Supply: </span><span className="font-semibold text-gray-800">Bihar (10)</span></div>
              <div><span className="text-gray-400">Reverse Charge: </span><span className="font-semibold text-gray-800">No</span></div>
              <div><span className="text-gray-400">Payment Mode: </span><span className="font-semibold text-emerald-700">{paymentMethod}</span></div>
            </div>
          </div>

          {/* BILL TO & SHIP TO */}
          <div className="grid grid-cols-2 gap-6 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1.5 flex items-center gap-1">
                <Building2 className="h-3 w-3" /> BILL TO
              </p>
              <p className="font-bold text-gray-900">{buyerName}</p>
              <p className="text-gray-500 text-[11px]">{buyerAddress}</p>
              <p className="text-gray-500 text-[11px] mt-1">Mobile: {buyerPhone}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700 mb-1.5 flex items-center gap-1">
                <Building2 className="h-3 w-3" /> SHIP TO
              </p>
              <p className="font-bold text-gray-900">{buyerName}</p>
              <p className="text-gray-500 text-[11px]">{buyerAddress}</p>
              <p className="text-gray-500 text-[11px] mt-1">Mobile: {buyerPhone}</p>
              <p className="text-gray-500 text-[11px]">Transport: Krivexo Express Logistics</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-200 text-gray-600 font-semibold text-[11px]">
                  <th className="py-2.5 px-3 text-left w-6">#</th>
                  <th className="py-2.5 px-3 text-left">Product Details</th>
                  <th className="py-2.5 px-3 text-left">HSN Code</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-left">Unit</th>
                  <th className="py-2.5 px-3 text-right">Rate (₹)</th>
                  <th className="py-2.5 px-3 text-right">Taxable Value (₹)</th>
                  <th className="py-2.5 px-3 text-right">GST %</th>
                  <th className="py-2.5 px-3 text-right">GST Amount (₹)</th>
                  <th className="py-2.5 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item: any, idx: number) => {
                  const qty = Number(item.qty || item.quantity || 1);
                  const price = Number(item.price || item.rate || (taxableValue / qty));
                  const taxVal = Math.round((price * qty) * 100) / 100;
                  const itemGst = Math.round((taxVal * 0.05) * 100) / 100;
                  const itemTotal = taxVal + itemGst;
                  return (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="py-3 px-3 text-gray-400">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-gray-900">{item.name || item.title || "Agricultural Item"}</p>
                        <p className="text-[10px] text-gray-400">{item.desc || "Verified Agricultural Supplies"}</p>
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-600">{item.hsn || "12099090"}</td>
                      <td className="py-3 px-3 text-center font-semibold">{qty}</td>
                      <td className="py-3 px-3 text-gray-600">{item.unit || "UNIT"}</td>
                      <td className="py-3 px-3 text-right">{price.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right font-medium">{taxVal.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right">5%</td>
                      <td className="py-3 px-3 text-right">{itemGst.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right font-bold text-gray-900">{itemTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Amount in Words + Financial Summary */}
          <div className="flex justify-between items-start pt-3 border-t border-gray-200">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Payment Status:</p>
              <p className="font-bold text-emerald-700 text-xs mt-0.5">Paid via {paymentMethod}</p>
            </div>
            <div className="w-64 space-y-1.5 text-right text-xs">
              <div className="flex justify-between"><span className="text-gray-500">Total Taxable Value</span><span className="font-semibold text-gray-800">₹ {taxableValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">CGST (2.5%)</span><span className="font-semibold text-gray-800">₹ {cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">SGST (2.5%)</span><span className="font-semibold text-gray-800">₹ {sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping Charges</span><span className="font-semibold text-emerald-600">FREE</span></div>
              <div className="flex justify-between text-sm font-black text-emerald-700 pt-2 border-t border-gray-200">
                <span>Grand Total</span><span>₹ {orderAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Bank Details & Signature Footer */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200 items-end">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1">BANK DETAILS</p>
              <p className="text-gray-500 text-[11px]">Bank Name: <span className="font-semibold text-gray-800">HDFC Bank</span></p>
              <p className="text-gray-500 text-[11px]">A/C No: <span className="font-mono font-semibold text-gray-800">50200012345678</span></p>
              <p className="text-gray-500 text-[11px]">IFSC Code: <span className="font-mono font-semibold text-gray-800">HDFC0001234</span></p>
              <p className="text-gray-500 text-[11px]">Branch: <span className="font-semibold text-gray-800">Samastipur, Bihar</span></p>
            </div>

            <div className="space-y-1 text-[10px] text-gray-400">
              <p className="font-bold text-gray-700 mb-1">TERMS & CONDITIONS</p>
              <p>1. Certified quality agricultural items.</p>
              <p>2. Subject to Samastipur Jurisdiction only.</p>
            </div>

            <div className="text-center space-y-2 flex flex-col items-center">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">AUTHORIZED SIGNATORY</p>
              <div className="h-10 flex items-center justify-center italic font-serif text-lg text-gray-700 font-bold border-b border-gray-300 w-36">
                Rajesh Kumar
              </div>
              <div className="w-14 h-14 rounded-full border-2 border-emerald-600/40 text-emerald-800 flex flex-col items-center justify-center text-[7px] font-bold p-1 leading-tight text-center">
                <span>KRIVEXO</span>
                <span>AGRITECH</span>
                <span>PVT. LTD.</span>
              </div>
            </div>
          </div>

          <p className="text-center text-[9px] text-gray-400 pt-3 border-t border-gray-100">
            This is a computer generated invoice and does not require physical signature.
          </p>
        </div>

        {/* Right Controls Panel */}
        <div className="w-72 space-y-4 shrink-0">
          {/* Invoice Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-bold text-gray-800 mb-3">Invoice Actions</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => window.print()} className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-gray-100 bg-emerald-50 text-emerald-700 text-[10px] font-semibold hover:opacity-80">
                <Printer className="h-4 w-4" /><span>Print Invoice</span>
              </button>
              <button onClick={handleDownloadPdf} className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-gray-100 bg-blue-50 text-blue-700 text-[10px] font-semibold hover:opacity-80">
                <Download className="h-4 w-4" /><span>Download PDF</span>
              </button>
              <button onClick={() => toast.info("Sent invoice via email")} className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-gray-100 bg-purple-50 text-purple-700 text-[10px] font-semibold hover:opacity-80">
                <Send className="h-4 w-4" /><span>Send Invoice</span>
              </button>
              <button onClick={handleDownloadExcel} className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-gray-100 bg-teal-50 text-teal-700 text-[10px] font-semibold hover:opacity-80">
                <FileSpreadsheet className="h-4 w-4" /><span>Download Excel</span>
              </button>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2 text-xs">
            <div className="flex justify-between items-center mb-2">
              <p className="font-bold text-gray-800">Payment Information</p>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">Paid</span>
            </div>
            <div className="flex justify-between"><span className="text-gray-400">Payment Mode</span><span className="font-semibold text-gray-800">{paymentMethod}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Transaction ID</span><span className="font-mono text-gray-700 text-[10px]">TXN-{currentOrder?.id || "001"}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Payment Date</span><span className="text-gray-700">{orderDate}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Paid Amount</span><span className="font-bold text-emerald-600">₹ {orderAmount.toLocaleString("en-IN")}</span></div>
          </div>

          {/* Invoice Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2 text-xs">
            <p className="font-bold text-gray-800 mb-2">Invoice Summary</p>
            <div className="flex justify-between"><span className="text-gray-400">Total Items</span><span className="font-semibold text-gray-800">{items.length}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Total Taxable Value</span><span className="font-semibold text-gray-800">₹ {taxableValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Total GST</span><span className="font-semibold text-gray-800">₹ {totalGst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Shipping Charges</span><span className="font-semibold text-emerald-600">₹ 0.00</span></div>
            <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-bold text-emerald-700">
              <span>Grand Total</span><span>₹ {orderAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-gray-400">© {new Date().getFullYear()} Krivexo Agritech Private Limited. All rights reserved.</div>
    </div>
  );
}
