import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePPMPItemsHook = create(
  persist(
    (set, get) => ({
      tableData: [],
      loading: false,
      activity: "",
      activityId: "",
      description: "",
      expenseClass: "",
      descriptionsData: [],

      setTableData: (data) => set({ tableData: data }),
      setDescriptionData: (data) => set({ descriptionsData: data }),
      setLoading: (value) => set({ loading: value }),

      calculateQuantity: (target) =>
        Object.values(target).reduce((sum, value) => sum + value, 0),

      handleFieldChange: (fieldName, newValue, row, updateRow) => {
        const { calculateQuantity, setLoading, descriptionsData } = get();

        if (fieldName === "description") {
          setLoading(true);
          const selected = descriptionsData.find(
            (item) => item.label === newValue
          );
          setTimeout(() => {
            if (selected) {
              updateRow({
                ...row,
                description: newValue,
                classification: selected.classification,
                category: selected.category,
              });
            } else {
              updateRow({
                ...row,
                description: newValue,
                classification: "",
                category: "",
              });
            }
            set({ loading: false });
          }, 1000);
        } else if (fieldName === "procurement_mode") {
          // 🔧 Handle procurement mode separately
          updateRow({
            ...row,
            procurement_mode: newValue,
          });
        } else if (fieldName.includes("target_by_quarter")) {
          const updatedTarget = {
            ...row.target_by_quarter,
            [fieldName.split(".")[1]]: parseInt(newValue),
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
        set({
          activity: event.label,
          activityId: event.value,
          description: event.description,
        });
      },

      handleSelectExpense: (event) => {
        set({ expenseClass: event.value });
      },
    }),
    {
      name: "ppmp-store",
    }
  )
);
