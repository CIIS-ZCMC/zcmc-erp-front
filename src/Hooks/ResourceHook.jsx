import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import { setNestedValue } from "../Utils/SetNestedValue";

const initialResource = (
  rowId = 1,
  parentId = null,
  purchaseTypeId = null

) => ({
  id: uuid(),
  item_id: null,
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
      totalCost: 0,

      setResources: (data) => {
        set(() => ({
          resources: data
        }))
      },

      setUpdatedResources: (data) => {
        set(() => ({
          resources: data,
        }))
      },

      clearResources: () => {
        set(() => ({
          resources: []
        }))
      },

      clearCart: () => {
        set(() => ({
          cart: []
        }))
      },

      setCart: () => {
        set(() => ({
          cart: data
        }))
      },

      setTotalCost: (data) => {
        set(() => ({
          totalCost: data,
        }))
      },

      updateResourceField: (id, field, value) => {
        set((state) => {
          const updatedResources = state.resources.map((resource) => {
            if (resource.id === id) {
              const updated = {
                ...resource,
                [field]: value,
              };
              // console.log(`Updating resource ${id}:`, updated);
              return updated;
            }
            return resource;
          });

          return { resources: updatedResources };
        });
      },

      addResourceToCart: (item, parentId, quantity = 1) => {
        const { cart } = get();

        // Try to find the existing item by ID
        const existingItem = cart?.find(
          // (cartItem) => cartItem?.id === item?.id
          (cartItem) => cartItem?.id === item?.item_id && cartItem?.parentId === parentId
        );

        if (existingItem) {
          // Update only the quantity of the existing item
          const updatedCart = cart.map((cartItem) =>
            cartItem?.id === item?.id
              ? {
                ...cartItem,
                aop_quantity: cartItem.aop_quantity + quantity,
                parentId: parentId,
                // item_id: item.id,
              }
              : cartItem
          );
          set({ cart: updatedCart });
          // console.log(updatedCart);
        } else {
          const newItem = {
            ...item,
            aop_quantity: quantity || 1,
            parentId: parentId,
            // item_id: item.id,
          };

          const updatedCart = [...cart, newItem];
          set({ cart: updatedCart });
          // console.log(updatedCart);
        }
      },

      // Remove  resourse item from cart
      removeFromCart: (id) => {
        // console.log(id)
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
      },

      // Update quantity cart
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

        /**
         * Check which items exist in the resource that is already in the cart
         * if exist update the quantity and total cost
         * if not add the item to the resource
         */

        const updatedResources = cart.map((item, index) => {
          // const exist = resources.find((resource) => resource.item_id === item.id);

          const exist = resources.find(
            (resource) =>
              resource.item_id === item.item_id && resource.parentId === parentId
          );

          // If exist update the quantity and total cost
          if (exist) {
            return {
              ...exist,
              quantity: item.aop_quantity,
              totalCost: item.aop_quantity * item.estimated_budget,
            }
          }

          return {
            ...initialResource(resources.length + index + 1, parentId, null),
            name: item.name,
            quantity: item.aop_quantity,
            individualPrice: item.estimated_budget,
            item_id: item.id,
            totalCost: totalPrice,
            parentId: parentId,
          }
        });

        // Remove resources for this parentId that are being replaced, but keep others
        const filteredResources = resources.filter(
          (resource) => resource.parentId !== parentId
        );

        set((state) => ({
          resources: [
            ...filteredResources,
            ...updatedResources,
          ],
          cart: [],
        }));
      },

      cancelResources: () => {
        set((state) => (state.cart = []));
      },

      addResource: (parentId) => {
        const resources = get().resources;
        set((state) => ({
          resources: [
            ...state.resources,
            initialResource(
              resources.filter((item) => item.parentId === parentId).length + 1,
              parentId
            ),
          ],
          initialRender: false,
        }));
      },

      removeItemResource: (idsToRemove) => {
        // console.log(idsToRemove)
        const resources = get().resources;

        // const filtered = resources.filter((item) => item.id !== id);

        // Filter out all resources with matching IDs
        const filtered = resources.filter((item) => !idsToRemove.includes(item.id));

        const groupedByParent = {};

        filtered.forEach((item) => {
          if (!groupedByParent[item.parentId]) {
            groupedByParent[item.parentId] = [];
          }
          groupedByParent[item.parentId].push(item);
        });

        const newResources = Object.values(groupedByParent).flatMap((group) =>
          group.map((item, index) => ({
            ...item,
            rowId: index + 1,
          }))
        );

        set({ resources: newResources });
      },

      findResourcesByActivityID: (activityId, mode = 'create') => {
        return get()
          .resources
          .filter((item) =>
            // console.log(item.parentId === activityId)
            item.parentId === activityId
          )
          .map((item) => ({
            id: item.id,
            item_id: item.item_id,
            purchase_type_id: item.purchaseTypeId?.id || item.purchaseTypeId, // handles both object and raw id
            quantity: item.quantity,
            expense_class: item.expenseClass,
          }));
      },

      isItemSelectedInOtherActivity: (itemId, currentActivityId) => {
        const resources = get().resources;
        return resources.find(
          (res) => res.item_id === itemId && res.parentId !== currentActivityId
        );
      },

    }),

    {
      name: "resources-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useResourceHook;
