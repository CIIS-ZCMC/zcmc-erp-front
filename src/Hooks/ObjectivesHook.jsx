import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";

const initialObjective = (rowId = 1) => ({
  id: uuid(),
  functionType: null,
  objective: null,
  successIndicator: null,
  rowId,
});
const useObjectivesHook = create(

  persist(
    (set, get) => ({
      objectives: [],
      current_parent_id: null,
      current_row_id: null,

      setObjectives: (data) => {
        console.log(data)
        set(() => ({
          objectives: data
        }))
      },

      //update field
      updateObjectiveField: (id, field, value) => {
        set((state) => ({
          objectives: state.objectives?.map((row) =>
            row.id === id
              ? {
                ...row,
                [field]: value,
                ...(field === "objective_id" && {
                  success_indicator_id: null,
                }),
              }
              : row
          ),
        }));
      },

      // add row objective
      addObjective: () => {
        const current = get().objectives;
        set((state) => ({
          objectives: [
            ...state.objectives,
            initialObjective(current.length + 1),
          ],
        }));
      },

      deleteObjective: (id) => {
        const objectives = get().objectives;
        const filtered = objectives.filter((item) => item.id !== id)
        set({ objectives: filtered })
      },

      setCurrentObjective: (objectiveuuid) => {
        set(() => ({
          current_parent_id: objectiveuuid,
        }));
      },

      setCurrentRowId: (objectiveRowId) => {
        set(() => ({
          current_row_id: objectiveRowId
        }))
      }
    }),
    {
      name: "objectives-storage",
      getStorage: () => localStorage,
    }
  )
);
export default useObjectivesHook;
