import { create } from "zustand";

const useAccordionHook = create((set) => ({
  rotation: false,
  rotationId: null,

  expandedParent: [{ name: "parent", id: 1 }],
  expandedChild: [{ name: "child", id: 1 }],

  preventRotate: () => set({ rotation: false }),

  handleExpand: (isOpen, id, name) => {
    set({ rotation: true, rotationId: id });

    const updateState = (key, condition) =>
      set((state) => ({
        [key]: condition
          ? state[key].filter((item) => item.id !== id)
          : [...state[key], { id, name }],
      }));

    if (name === "child") {
      updateState("expandedChild", isOpen);
    } else {
      updateState("expandedParent", isOpen);
    }

    setTimeout(() => set({ rotation: false, rotationId: null }), 500);
  },

  handleRotation: () => set({ rotation: false, rotationId: null }),
}));

export const useExpandedParent = () =>
  useAccordionHook((state) => state.expandedParent);

export const useExpandedChild = () =>
  useAccordionHook((state) => state.expandedChild);

export default useAccordionHook;
