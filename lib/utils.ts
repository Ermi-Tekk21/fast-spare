import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function getProformas() {
  const res = await fetch("https://65f3509e105614e654a05b09.mockapi.io/ownbest/proformas", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch proformas");
  return res.json();
}

export interface ProformaItem {
  itemName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
}

export interface Proforma {
  proformaNumber: string;
  customerName: string;
  plateNumber: string;
  vin: string;
  model: string;
  referenceNumber: string;
  deliveryTime: string;
  preparedBy: string;
  createdAt: string;
  items: ProformaItem[];
}
