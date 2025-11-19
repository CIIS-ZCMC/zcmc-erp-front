import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const cartStores = {};

const useCartStore = (userId = "guest", isPPMP = false) => {
  if (cartStores[userId]) return cartStores[userId];
  const store = create(
    persist(
      (set, get) => ({
        cart: [],

        // ---------------------------------------------------
        // ADD TO CART
        // ---------------------------------------------------

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
                p.id === item.id
                  ? {
                      ...p,
                      qty: p.qty + (item.qty || 1),
                    }
                  : p
              ),
            });
          } else {
            set({ cart: [...get().cart, baseItem] });
          }
        },

        // ---------------------------------------------------
        // REMOVE CART ITEM
        // ---------------------------------------------------
        removeFromCart: (id) =>
          set({ cart: get().cart.filter((i) => i.id !== id) }),

        // ---------------------------------------------------
        // UPDATE QUANTITY
        // ---------------------------------------------------
        updateQty: (id, qty) =>
          set({
            cart: get().cart.map((i) =>
              i.id === id ? { ...i, qty: Math.max(qty, 1) } : i
            ),
          }),

        // ---------------------------------------------------
        // ADD ACTIVITY (PPMP)
        // ---------------------------------------------------
        addActivityToItem: (itemId, activity) =>
          set({
            cart: get().cart.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    activities: item.activities?.some(
                      (a) => a.id === activity.id
                    )
                      ? item.activities // prevent duplicates
                      : [
                          {
                            id: activity.id,
                            code: activity.code,
                          },
                          ...(item.activities || []), // add on top
                        ],
                  }
                : item
            ),
          }),

        // ---------------------------------------------------
        // REMOVE ACTIVITY BY ID
        // ---------------------------------------------------
        removeActivityFromItem: (itemId, activityId) =>
          set({
            cart: get().cart.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    activities: (item.activities || []).filter(
                      (a) => a.id !== activityId
                    ),
                  }
                : item
            ),
          }),

        // ---------------------------------------------------
        // CLEAR CART
        // ---------------------------------------------------
        clearCart: () => set({ cart: [] }),
      }),
      {
        name: `cart-storage-${userId}`, // per-user key
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
  cartStores[userId] = store;
  return store;
};

export default useCartStore;
