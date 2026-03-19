import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const cartStores = {};

const ACTIVE_CARTS_KEY = "active-cart-users";
let cleanedUpOnce = false; // ensures cleanup runs only once per session

function addActiveUser(userId) {
  const users = JSON.parse(localStorage.getItem(ACTIVE_CARTS_KEY)) || [];
  if (!users.includes(userId)) {
    users.push(userId);
    localStorage.setItem(ACTIVE_CARTS_KEY, JSON.stringify(users));
  }
}

function removeActiveUser(userId) {
  const users = JSON.parse(localStorage.getItem(ACTIVE_CARTS_KEY)) || [];
  const filtered = users.filter((u) => u !== userId);
  localStorage.setItem(ACTIVE_CARTS_KEY, JSON.stringify(filtered));
}

function cleanupOldCarts() {
  // only run cleanup once per session
  if (cleanedUpOnce) return;
  cleanedUpOnce = true;

  const activeUsers = JSON.parse(localStorage.getItem(ACTIVE_CARTS_KEY)) || [];

  Object.keys(localStorage)
    .filter((key) => key.startsWith("cart-storage-"))
    .forEach((key) => {
      const userId = key.replace("cart-storage-", "");
      if (!activeUsers.includes(userId)) {
        localStorage.removeItem(key);
      }
    });
}

const useCartStore = (userId = "guest", isPPMP = false) => {
  if (cartStores[userId]) return cartStores[userId];

  // Mark user as active
  addActiveUser(userId);
  cleanupOldCarts(); // cleanup runs only once per session now

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
                  : p,
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
              i.id === id ? { ...i, qty: Math.max(qty, 1) } : i,
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
                      (a) => a.id === activity.id,
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
                : item,
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
                      (a) => a.id !== activityId,
                    ),
                  }
                : item,
            ),
          }),

        // ---------------------------------------------------
        // CLEAR CART
        // ---------------------------------------------------
        clearCart: () => set({ cart: [] }),
        clearCartStorage: () => {
          const storageKey = `cart-storage-${userId}`;
          localStorage.removeItem(storageKey); // remove persisted cart
          removeActiveUser(userId); // remove from active users
          set({ cart: [] }); // clear in-memory cart
        },
      }),
      {
        name: `cart-storage-${userId}`, // per-user key
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );
  cartStores[userId] = store;
  return store;
};

export default useCartStore;
