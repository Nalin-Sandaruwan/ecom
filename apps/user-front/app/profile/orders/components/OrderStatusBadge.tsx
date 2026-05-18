import React from "react";
import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const s = status.toLowerCase();
  switch (s) {
    case "paid":
      return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold font-sans">Paid</Badge>;
    case "delivered":
    case "completed":
      return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold font-sans">Delivered</Badge>;
    case "pending":
    case "unpaid":
      return <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold font-sans">Pending</Badge>;
    case "prepearing":
    case "preparing":
      return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold font-sans">Preparing</Badge>;
    case "delivering":
      return <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 border-indigo-500/20 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold font-sans">Delivering</Badge>;
    default:
      return <Badge variant="secondary" className="px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold font-sans">{status}</Badge>;
  }
};
