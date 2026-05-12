import { Product } from "./types";

export interface Addon {
  id: string;
  name: string;
  price: number;
  img?: string;
}

export interface CartItem extends Product {
  cartItemId: string; // Unique ID for each entry in the cart (same product can have different addons)
  quantity: number;
  unitPrice: number;
  selectedAddons: Addon[];
  observations?: string;
}

export interface Category {
  id: string;
  title: string;
  badge?: string;
}

export interface TrackingParams {
  src: string | null;
  sck: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
}
