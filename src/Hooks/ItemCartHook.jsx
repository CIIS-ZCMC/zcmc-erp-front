import { create } from "zustand";
import { persist } from "zustand/middleware";

const useItemCartHook = create(
  persist(
    (set, get) => ({
      cart: [],

      // Add item to cart
      addToCart: (item) => {
        set((state) => {
          const existing = state.cart.find((i) => i.id === item.id);
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { cart: [...state.cart, { ...item, quantity: 1 }] };
        });
      },

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
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage", // key in localStorage
      getStorage: () => localStorage, // Default to localStorage
    }
  )
);

export default useItemCartHook;
