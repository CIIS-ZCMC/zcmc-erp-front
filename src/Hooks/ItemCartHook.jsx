import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const cartStores = {};

const useCartStore = (userId = "guest", isPPMP = false) => {
  if (cartStores[userId]) return cartStores[userId];
  const store = create(
    persist(
      (set, get) => ({
        cart: [],

        addToCart: (item) => {
          const existing = get().cart.find((p) => p.id === item.id);

          // If PPMP mode → attach activities array
          const baseItem = {
            ...item,
            qty: item.qty || 1,
            activities: isPPMP ? item.activities || [] : undefined,
          };
          if (existing) {
            set({
              cart: get().cart.map((p) =>
                p.id === item.id
                  ? {
                      ...p,
                      qty: p.qty + (item.qty || 1),
                      activities: isPPMP
                        ? [...(p.activities || []), ...(item.activities || [])]
                        : p.activities,
                    }
                  : p
              ),
            });
          } else {
            set({ cart: [...get().cart, baseItem] });
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

        addActivityToItem: (id, activity) =>
          set({
            cart: get().cart.map((item) =>
              item.id === id
                ? {
                    ...item,
                    activities: [...(item.activities || []), activity],
                  }
                : item
            ),
          }),

        // ❌ Remove activity (PPMP only)
        removeActivityFromItem: (id, activityCode) =>
          set({
            cart: get().cart.map((item) =>
              item.id === id
                ? {
                    ...item,
                    activities: (item.activities || []).filter(
                      (a) => a.code !== activityCode
                    ),
                  }
                : item
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
