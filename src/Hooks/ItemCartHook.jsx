import { create } from "zustand";
import { persist } from "zustand/middleware";

const useItemCartHook = create(
  persist(
    (set, get) => ({
      cart: [],

      activity_id: null,
      expense_class_id: null,

      setCartMeta: ({ activity_id, expense_class_id }) =>
        set(() => ({
          activity_id,
          expense_class_id,
        })),

      // Add item to cart
      addToCart: (item, quantity = 1) => {
        const { cart, activity_id, expense_class_id } = get();

        set((state) => {
          const existing = cart?.find((i) => i?.id === item?.id);
          console.log(activity_id);
          if (existing) {
            return {
              cart: cart?.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }

          const newItem = {
            ...item,
            quantity,
            activity_id,
            expense_class_id,
          };

          return {
            cart: [...cart, newItem],
          };
        });
      },
      // addToCart: (item) => {
      //   set((state) => {
      //     const existing = state.cart.find((i) => i.id === item.id);
      //     if (existing) {
      //       return {
      //         cart: state.cart.map((i) =>
      //           i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      //         ),
      //       };
      //     }
      //     return { cart: [...state.cart, { ...item, quantity: 1 }] };
      //   });
      // },

      // Update quantity
      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),

      // Remove item from cart
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      // Clear the cart
      clearCart: () =>
        set({ cart: [], activity_id: null, expense_class_id: null }),

      // Merge cart with ppmp-store and store in merged-cart
      mergeWithPPMPStore: () => {
        try {
          const cartStorage = get().cart;
          const ppmpState =
            JSON.parse(localStorage.getItem("ppmp-store")) || {};
          const ppmpCart = ppmpState?.state?.cart || [];

          const combinedMap = new Map();

          [...cartStorage, ...ppmpCart].forEach((item) => {
            if (combinedMap.has(item.id)) {
              const existing = combinedMap.get(item.id);
              combinedMap.set(item.id, {
                ...existing,
                quantity: existing.quantity + (item.quantity || 1),
              });
            } else {
              combinedMap.set(item.id, { ...item });
            }
          });

          const mergedCart = Array.from(combinedMap.values());

          localStorage.setItem("merged-cart", JSON.stringify(mergedCart));
        } catch (err) {
          console.error("Error merging localStorage carts:", err);
        }
      },
    }),
    {
      name: "cart-storage", // key in localStorage
      getStorage: () => localStorage, // Default to localStorage
      partialize: (state) => ({
        cart: state.cart, // only persist the cart
      }),
    }
  )
);

export default useItemCartHook;
