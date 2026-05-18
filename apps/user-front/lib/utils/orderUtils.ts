import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface OrderItem {
  product: {
    _id: string;
    productName: string;
    imageURIs: string[];
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  paymentStatus: string;
  deliveryAddress: string;
  createdAt: string;
}

export const generateOrderPDF = (order: Order, isFarmerExport = false, customerDetails?: { name: string, email: string, phone: string }) => {
  const doc = new jsPDF();

  // Colors
  const primaryColor = "#f97316"; // tailwind orange-500
  const headingColor = "#111827"; // gray-900
  const textColor = "#4b5563"; // gray-600

  // 1. Header - Branding with Logo
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, 45, "F");
  
  // Embed Logo (assuming /logo.png is available and we can use it)
  // For a more robust solution, we use a placeholder or the text branding
  try {
    doc.addImage("/logo.png", "PNG", 20, 10, 25, 25);
  } catch (e) {
    // Fallback if logo fails to load in PDF environment
  }

  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("CHILLEBAZZAR", 55, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Artisanal Marketplace Hub - Elite Fulfillment Registry", 55, 32);

  // 2. Order Metadata
  doc.setTextColor(headingColor);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(isFarmerExport ? "COMMERCE MANIFEST" : "DIGITAL RECEIPT", 20, 65);

  doc.setFontSize(9);
  doc.setTextColor(textColor);
  doc.setFont("helvetica", "normal");
  doc.text(`Manifest ID: #${order._id.toUpperCase()}`, 20, 75);
  doc.text(`Finalized Date: ${new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date(order.createdAt))}`, 20, 80);
  doc.text(`Transaction Status: ${order.paymentStatus.toUpperCase()}`, 20, 85);

  // 3. Customer Intelligence & Logistics
  const detailsY = 100;
  
  // Left Side: Customer Info
  doc.setTextColor(headingColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("CUSTOMER INTELLIGENCE", 20, detailsY);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textColor);
  doc.setFontSize(9);
  doc.text(`Name: ${customerDetails?.name || "Verified Buyer"}`, 20, detailsY + 8);
  doc.text(`Email: ${customerDetails?.email || "N/A"}`, 20, detailsY + 13);
  doc.text(`Contact: ${customerDetails?.phone || "N/A"}`, 20, detailsY + 18);

  // Right Side: Logistics
  doc.setTextColor(headingColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("DELIVERY LOGISTICS", 120, detailsY);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textColor);
  doc.setFontSize(9);
  const splitAddress = doc.splitTextToSize(order.deliveryAddress, 70);
  doc.text(splitAddress, 120, detailsY + 8);

  // 4. Itemized Harvest Table
  const tableData = order.items.map((item) => [
    item.product?.productName || "Direct Harvest Product",
    item.quantity.toString(),
    `LKR ${item.price.toFixed(2)}`,
    `LKR ${(item.quantity * item.price).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: detailsY + 30,
    head: [["Artisanal Product", "Quantity", "Unit Price", "Subtotal"]],
    body: tableData,
    theme: "grid",
    headStyles: { 
      fillColor: [249, 115, 22],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10
    },
    styles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [255, 247, 237] },
    margin: { left: 20, right: 20 },
  });

  // 5. Financial Summary
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setTextColor(headingColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL VALUE: LKR ${order.totalPrice.toFixed(2)}`, 130, finalY + 10);

  // 6. Professional Footer
  doc.setFontSize(8);
  doc.setTextColor("#9ca3af");
  doc.text("This manifest is a digitally authenticated document. For fulfillment support, contact ChilleBazzar HQ.", 105, 285, { align: "center" });
  doc.text("Thank you for your partnership in artisanal commerce. Deliver excellence.", 105, 290, { align: "center" });

  // Save with dynamic filename
  const fileName = isFarmerExport 
    ? `CHB-Manifest-${order._id.slice(-6).toUpperCase()}.pdf`
    : `CHB-Receipt-${order._id.slice(-6).toUpperCase()}.pdf`;
    
  doc.save(fileName);
};
