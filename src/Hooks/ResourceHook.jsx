import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";

const initialResource = (
  rowId = 1,
  parentId = null,
  purchaseTypeId = null
) => ({
  id: uuid(),
  parentId: parentId,
  rowId: rowId,
  name: "",
  typeOfResources: "",
  quantity: 0,
  individualPrice: 0,
  totalCost: 0,
  expenseClass: "",
  purchaseTypeId: purchaseTypeId,
});

const useResourceHook = create(
  persist(
    (set, get) => ({
      resources: [],
      cart: [],

      addResourceToCart: (item, parentId, quantity = 1) => {
        const { cart } = get();

        // Try to find the existing item by ID
        const existingItem = cart?.find(
          (cartItem) => cartItem?.id === item?.id
        );

        if (existingItem) {
          // Update only the quantity of the existing item
          const updatedCart = cart.map((cartItem) =>
            cartItem?.id === item?.id
              ? {
                ...cartItem,
                aop_quantity: cartItem.aop_quantity + quantity,
                parentId: parentId,
              }
              : cartItem
          );
          set({ cart: updatedCart });
          console.log(updatedCart);
        } else {
          const newItem = {
            ...item,
            aop_quantity: quantity || 1,
            parentId: parentId,
          };

          const updatedCart = [...cart, newItem];
          set({ cart: updatedCart });
          console.log(updatedCart);
        }
      },

      // Remove  resourse item from cart
      removeFromCart: (id) => {
        // console.log(id)
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
      },

      // Update quantity
      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, aop_quantity: quantity } : item
          ),
        })),


      //handle assigment of data from cart to table row resources
      // navigate to resources Table


      saveItems: (parentId = null, totalPrice) => {
        const { resources, cart } = get();

        const updatedResources = cart.map((item, index) =>
        ({
          ...initialResource(resources.length + index + 1, parentId, null),
          name: item.name,
          quantity: item.aop_quantity,
          individualPrice: item.estimated_budget,
          totalCost: totalPrice,
        })
        );

        console.log("Updated Resources:", updatedResources);

        set((state) => ({
          resources: [...state.resources, ...updatedResources],
        }));
      },

      findResourcesByActivityID: (activityId) => {
        return get().resources.filter((item) => item.parentId == activityId);
      },
    }),

    {
      name: "resources-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useResourceHook;
