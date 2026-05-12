export interface Product {
  id: string;
  category: string;
  name: string;
  desc: string;
  price: number;
  oldPrice?: number;
  img: string;
  badge?: string;
  hasAddons?: boolean;
  isBait?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  unitPrice: number;
  addons?: string[];
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
