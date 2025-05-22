import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePPMPItemsHook = create(
  persist(
    (set, get) => ({
      tableData: [],
      loading: false,
      activityObject: {},
      activity: "",
      activityId: "",
      description: "",
      expenseClass: "",
      itemsData: [],

      setTableData: (data) => set({ tableData: data }),
      setItemsData: (data) => set({ itemsData: data }),
      setLoading: (value) => set({ loading: value }),

      updateRow: (updatedRow) => {
        // setTableData(() =>
        //   tableData.map((row) =>
        //     row.id === updatedRow.id ? { ...row, ...updatedRow } : row
        //   )
        // );
        set((state) => ({
          tableData: state.tableData.map((row) =>
            row.id === updatedRow.id ? { ...row, ...updatedRow } : row
          ),
        }));
      },

      calculateQuantity: (target) =>
        Object.values(target).reduce((sum, value) => sum + value, 0),

      handleFieldChange: (fieldName, newValue, row) => {
        console.log(fieldName, newValue);
        const { calculateQuantity, itemsData } = get();

        if (!row?.id) return;

        // Handle description with async-like update
        if (fieldName === "item") {
          get().setLoading(true);

          const selected = itemsData.find(
            (item) => item.name === newValue.name
          );
          if (!selected) {
            console.warn("Selected item not found.");
            return;
          }
          {
            console.log("Selected item:", selected);
          }
          setTimeout(() => {
            set((state) => ({
              tableData: state.tableData.map((r) => {
                if (r.id !== row.id) return r;

                return {
                  ...r,
                  item: selected,
                  item_code: selected?.code || "",
                  classification: selected?.classification || "",
                  category: selected?.category || "",
                  unit: selected?.unit || "",
                  estimated_budget: selected?.estimated_budget || "",
                };
              }),
              loading: false,
            }));
          }, 1000);
          return;
        }
        const monthFields = [
          "jan",
          "feb",
          "mar",
          "apr",
          "may",
          "jun",
          "jul",
          "aug",
          "sep",
          "oct",
          "nov",
          "dec",
        ];
        // All other fields (sync updates)
        set((state) => ({
          tableData: state.tableData.map((r) => {
            if (r.id !== row.id) return r;

            if (fieldName === "procurement_mode") {
              return {
                ...r,
                procurement_mode: newValue,
              };
            }

            if (monthFields.includes(fieldName)) {
              const updatedTarget = {
                ...r.target_by_quarter,
                [fieldName]: parseInt(newValue) || 0,
              };
              const updatedQuantity = calculateQuantity(updatedTarget);
              const newTotalAmount =
                updatedQuantity * (parseFloat(r.estimated_budget) || 0);

              return {
                ...r,
                target_by_quarter: updatedTarget,
                quantity: updatedQuantity,
                total_amount: newTotalAmount,
              };
            }

            if (fieldName === "quantity") {
              const newQuantity = parseFloat(newValue) || 0;
              const newTotalAmount =
                newQuantity * (parseFloat(r.estimated_budget) || 0);

              return {
                ...r,
                quantity: newQuantity,
                total_amount: newTotalAmount,
              };
            }

            // Default update
            return {
              ...r,
              [fieldName]: newValue,
            };
          }),
        }));
      },

      handleDeleteRow: (id) => {
        set({ loading: id });
        setTimeout(() => {
          const updated = get().tableData.filter((row) => row.id !== id);
          set({ tableData: updated, loading: null });
        }, 1000);
      },

      handleSelectActivity: (event) => {
        console.log(event);
        set({
          activityObject: event,
          activity: event.activity_code,
          activityId: event.id,
          description: event.name,
        });
      },

      handleSelectExpense: (event) => {
        set({ expenseClass: event.value });
      },
    }),
    {
      name: "ppmp-store",
      getStorage: () => localStorage,
      partialize: (state) => ({
        tableData: state.tableData, // only persist the cart
      }),
    }
  )
);
