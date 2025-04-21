import { create } from "zustand";
import { persist } from "zustand/middleware";

const useItemCartHook = create(
  persist(
    (set, get) => ({
      cart: [],

      // Add item to cart
      addToCart: (item, quantity = 1) => {
        set((state) => {
          const existing = state.cart.find((i) => i.id === item.id);

          if (existing) {
            // If the item exists, just increment the quantity
            return {
              cart: state.cart.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }

          // If it's a new item, add it with quantity, activity_id, and expense_class
          const newItem = {
            ...item,
            quantity: quantity,
            activity_id: item.activity_id,
            expense_class: item.expense_class,
          };

          return {
            cart: [...state.cart, newItem],
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
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage", // key in localStorage
      getStorage: () => localStorage, // Default to localStorage
    }
  )
);

export default useItemCartHook;
