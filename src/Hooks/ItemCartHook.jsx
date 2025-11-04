import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const cartStores = {};

const useCartStore = (userId = "guest") => {
  if (cartStores[userId]) return cartStores[userId];
  const store = create(
    persist(
      (set, get) => ({
        cart: [],

        addToCart: (item) => {
          const existing = get().cart.find((p) => p.id === item.id);
          if (existing) {
            set({
              cart: get().cart.map((p) =>
                p.id === item.id ? { ...p, qty: p.qty + (item.qty || 1) } : p
              ),
            });
          } else {
            set({
              cart: [...get().cart, { ...item, qty: item.qty || 1 }],
            });
          }
        },

        removeFromCart: (id) =>
          set({ cart: get().cart.filter((i) => i.id !== id) }),

        updateQty: (id, qty) =>
          set({
            cart: get().cart.map((i) =>
              i.id === id ? { ...i, qty: Math.max(qty, 1) } : i
            ),
          }),

        clearCart: () => set({ cart: [] }),
      }),
      {
        name: `cart-storage-${userId}`, // 👈 per-user key
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
  cartStores[userId] = store;
  return store;
};

export default useCartStore;
