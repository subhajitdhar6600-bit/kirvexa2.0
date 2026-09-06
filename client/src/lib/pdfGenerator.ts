import jsPDF from "jspdf";

export interface FormPdfData {
  formTitle: string;
  referenceId?: string;
  userName?: string;
  userPhone?: string;
  userRole?: string;
  details?: Record<string, string | number | undefined | null>;
  timestamp?: string;
  formData?: Record<string, string | number | undefined | null>;
  footerNote?: string;
}

export function generateFormPdf(params: FormPdfData): { dataUrl: string; fileName: string } {
  const formTitle = params.formTitle || "Receipt";
  const detailsObj = params.details || params.formData || {};
  const referenceId = params.referenceId || (detailsObj["Transaction ID"] as string) || (detailsObj["Application ID"] as string) || (detailsObj["Farmer ID"] as string) || `REF-${Math.floor(100000 + Math.random() * 900000)}`;
  const userName = params.userName || (detailsObj["Farmer Name"] as string) || (detailsObj["Applicant Name"] as string) || (detailsObj["Full Name"] as string) || "Farmer";
  const userPhone = params.userPhone || (detailsObj["Phone Number"] as string) || (detailsObj["Mobile Number"] as string) || "N/A";
  const userRole = params.userRole || "Farmer";
  const timestamp = params.timestamp || new Date().toLocaleString("en-IN");
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Page Dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header Banner Background (Dark Gradient Theme)
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageWidth, 40, "F");

  // Primary Accent Bar
  doc.setFillColor(34, 197, 94); // Green accent
  doc.rect(0, 38, pageWidth, 2, "F");

  // Company Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("KRIVEXA", 15, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(34, 197, 94);
  doc.text("SMART AGRICULTURE PLATFORM", 15, 24);

  // Document Title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(formTitle.toUpperCase(), pageWidth - 15, 18, { align: "right" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  doc.text(`REF ID: ${referenceId}`, pageWidth - 15, 25, { align: "right" });

  // Submission Meta Section
  let y = 50;
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(15, y, pageWidth - 30, 24, 3, 3, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("SUBMISSION SUMMARY & APPLICANT DETAILS", 20, y + 7);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Applicant Name: ${userName}`, 20, y + 14);
  doc.text(`Phone Number: ${userPhone}`, 20, y + 19);
  doc.text(`User Account Type: ${userRole}`, 110, y + 14);
  doc.text(`Date & Time: ${timestamp}`, 110, y + 19);

  y += 32;

  // Form Field Table
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("FORM DATA & SPECIFICATIONS", 15, y);
  y += 4;

  // Table Header
  doc.setFillColor(34, 197, 94);
  doc.rect(15, y, pageWidth - 30, 8, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("FIELD DESCRIPTION", 20, y + 5.5);
  doc.text("SUBMITTED INFORMATION", 90, y + 5.5);

  y += 8;

  // Table Rows
  const entries = Object.entries(detailsObj).filter(
    ([_, val]) => val !== undefined && val !== null && val !== ""
  );

  entries.forEach(([key, val], idx) => {
    // Row background zebra striping
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, pageWidth - 30, 8, "F");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(String(key), 20, y + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    const textVal = String(val);
    if (textVal.length > 55) {
      const splitText = doc.splitTextToSize(textVal, pageWidth - 105);
      doc.text(splitText, 90, y + 5);
    } else {
      doc.text(textVal, 90, y + 5.5);
    }

    // Border line below row
    doc.setDrawColor(226, 232, 240);
    doc.line(15, y + 8, pageWidth - 15, y + 8);

    y += 8;
  });

  // Footer Stamp & Disclaimer
  y = Math.max(y + 15, 230);

  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, y, pageWidth - 30, 28, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(34, 197, 94);
  doc.text("KRIVEXA OFFICIAL DIGITAL VERIFICATION RECEIPT", 20, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "This document serves as an official confirmation of the submission made on KRIVEXA Smart Agriculture.",
    20,
    y + 13
  );
  doc.text(
    `Reference ID #${referenceId} is logged in the system audit registry for verification.`,
    20,
    y + 18
  );
  doc.text("Help Center Hotline: 1800-KRIVEXA | Web: www.krivexa.in", 20, y + 23);

  const fileName = `${formTitle.toLowerCase().replace(/\s+/g, "_")}_${referenceId}.pdf`;
  const dataUrl = doc.output("datauristring");

  return { dataUrl, fileName };
}

export function downloadPdf(dataUrl: string, fileName: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
