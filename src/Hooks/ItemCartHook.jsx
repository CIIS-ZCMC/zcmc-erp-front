import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const cartStores = {};

const useCartStore = (userId, isPPMP = false) => {
  const storeKey = `${userId}-${isPPMP ? "ppmp" : "regular"}`;

  if (cartStores[storeKey]) {
    return cartStores[storeKey];
  }

  const store = create(
    persist(
      (set, get) => ({
        cart: [],

        addToCart: (item) => {
          const existing = get().cart.find((p) => p.id === item.id);

          const baseItem = {
            ...item,
            qty: item.qty || 1,
            activities: isPPMP ? item.activities || [] : undefined,
          };

          if (existing) {
            set({
              cart: get().cart.map((p) =>
                p.id === item.id ? { ...p, qty: p.qty + (item.qty || 1) } : p,
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
              i.id === id ? { ...i, qty: Math.max(qty, 1) } : i,
            ),
          }),

        addActivityToItem: (itemId, activity) =>
          set({
            cart: get().cart.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    activities: item.activities?.some(
                      (a) => a.id === activity.id,
                    )
                      ? item.activities
                      : [
                          { id: activity.id, name: activity.name },
                          ...(item.activities || []),
                        ],
                  }
                : item,
            ),
          }),

        removeActivityFromItem: (itemId, activityId) =>
          set({
            cart: get().cart.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    activities: (item.activities || []).filter(
                      (a) => a.id !== activityId,
                    ),
                  }
                : item,
            ),
          }),

        clearCart: () => set({ cart: [] }),

        clearCartStorage: () => {
          localStorage.removeItem(`cart-storage-${storeKey}`);
          set({ cart: [] });
        },
      }),
      {
        name: `cart-storage-${storeKey}`,
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );

  cartStores[storeKey] = store;
  return store;
};

export default useCartStore;
