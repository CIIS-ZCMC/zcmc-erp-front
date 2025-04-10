import { create } from "zustand";

const useAccordionHook = create((set) => ({
  rotation: false,
  rotationId: null,

  preventRotate: () => set(() => ({ rotation: false })),
  handleExpand: (isOpen, setExpanded, id, name) => {
    set(() => ({ rotation: true, rotationId: id }));
    if (isOpen) {
      setExpanded((prev) =>
        Array.isArray(prev) ? prev.filter((item) => item.id !== id) : []
      );
    } else {
      setExpanded((prev) =>
        Array.isArray(prev) ? [...prev, { id, name }] : [{ id, name }]
      );
    }

    setTimeout(() => {
      set(() => ({ rotation: false, rotationId: null }));
    }, 500);
  },
}));

export default useAccordionHook;
