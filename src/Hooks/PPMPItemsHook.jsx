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
        const { calculateQuantity, setLoading, itemsData, updateRow } = get();

        if (fieldName === "description") {
          setLoading(true);
          const selected = itemsData.find((item) => item.name === newValue);
          setTimeout(() => {
            if (selected) {
              updateRow({
                ...row,
                description: newValue,
                item_code: selected?.code,
                classification: selected?.classification,
                category: selected?.category,
                unit: selected?.unit,
                estimated_budget: selected?.estimated_budget,
              });
            } else {
              updateRow({
                ...row,
                description: newValue,
                item_code: "",
                classification: "",
                category: "",
                unit: "",
                estimated_budget: "",
              });
            }
            set({ loading: false });
          }, 1000);
        } else if (fieldName === "procurement_mode") {
          updateRow({
            ...row,
            procurement_mode: newValue,
          });
        } else if (fieldName.includes("target_by_quarter")) {
          const updatedTarget = {
            ...row.target_by_quarter,
            [fieldName.split(".")[1]]: parseInt(newValue) || 0,
          };
          const updatedQuantity = calculateQuantity(updatedTarget);
          const newTotalAmount =
            updatedQuantity * (parseFloat(row.estimated_budget) || 0);

          updateRow({
            ...row,
            target_by_quarter: updatedTarget,
            quantity: updatedQuantity,
            total_amount: newTotalAmount,
          });
        } else if (fieldName === "quantity") {
          const newQuantity = parseFloat(newValue) || 0;
          const newTotalAmount =
            newQuantity * (parseFloat(row.estimated_budget) || 0);
          updateRow({
            ...row,
            quantity: newQuantity,
            total_amount: newTotalAmount,
          });
        } else {
          updateRow({
            ...row,
            [fieldName]: newValue,
          });
        }
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
