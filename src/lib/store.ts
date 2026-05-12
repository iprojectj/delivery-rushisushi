import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, Addon } from "./types";
import { v4 as uuidv4 } from "uuid";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number, selectedAddons: Addon[], observations?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity, selectedAddons, observations) => {
        set((state) => {
          // Check if exactly same product with same addons and observations exists
          const existingItemIndex = state.items.findIndex((i) => 
            i.id === product.id && 
            JSON.stringify(i.selectedAddons) === JSON.stringify(selectedAddons) &&
            i.observations === observations
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems };
          }

          const newItem: CartItem = {
            ...product,
            cartItemId: uuidv4(),
            quantity,
            unitPrice: product.price,
            selectedAddons,
            observations
          };

          return {
            items: [...state.items, newItem],
          };
        });
      },
      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        }));
      },
      updateQuantity: (cartItemId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      total: () => {
        return get().items.reduce((acc, item) => {
          const addonsTotal = item.selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
          return acc + (item.unitPrice + addonsTotal) * item.quantity;
        }, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
