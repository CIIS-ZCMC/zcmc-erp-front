import { create } from "zustand";
import { persist } from "zustand/middleware";

const useItemCartHook = create(
  persist(
    (set, get) => ({
      cart: [],

      selectedActivity: {},
      expense_class_id: null,

      setCartMeta: ({ selectedActivity, expense_class_id }) =>
        set(() => ({
          selectedActivity,
          expense_class_id,
        })),

      // Add item to cart
      addToCart: (item, quantity = 1) => {
        const { cart, selectedActivity, expense_class_id } = get();

        set((state) => {
          const existing = cart?.find((i) => i?.item_id === item?.id);
          console.log(selectedActivity);
          if (existing) {
            return {
              cart: cart?.map((i) =>
                i.item_id === item.id
                  ? {
                    ...i,
                    aop_quantity: i.aop_quantity + quantity,
                  }
                  : i
              ),
            };
          }

          const newItem = {
            item_id: item.id,
            item_code: item.code,
            variant: item.variant,
            description: item.name,
            category: item.category,
            classification: item.classification,
            estimated_budget: item.estimated_budget,
            aop_quantity: quantity,
            activities: selectedActivity,
            total_amount: 0,
            target_by_quarter: {
              jan: 0,
              feb: 0,
              mar: 0,
              apr: 0,
              may: 0,
              jun: 0,
              jul: 0,
              aug: 0,
              sep: 0,
              oct: 0,
              nov: 0,
              dec: 0,
            },
            procurement_mode: "",
            remarks: "",
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
            item.item_id === id ? { ...item, aop_quantity: quantity } : item
          ),
        })),

      // Remove item from cart
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.item_id !== id),
        })),

      // Clear the cart
      clearCart: () =>
        set({ cart: [], activity_id: null, expense_class_id: null }),
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
