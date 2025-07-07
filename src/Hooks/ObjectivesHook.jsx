import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import { post } from "../Services/RequestMethods";

const initialObjective = (rowId = 1) => ({
  id: uuid(),
  functionType: null,
  objective: null,
  successIndicator: null,
  othersObjective: '',
  othersSuccessIndicator: '',
  rowId,
});
const useObjectivesHook = create(

  persist(
    (set, get) => ({
      objectives: [],
      currentEditedObjective: null,
      hasDiscussed: false,
      current_parent_id: null,
      current_row_id: null,

      setCurrentEditedObjective: (objective) => set({ currentEditedObjective: objective }),

      setObjectives: (data) => {
        set((state) => ({
          objectives: data
        }))
      },

      //clear others and successindicator fields
      clearOthersFields: (id) => {
        set(state => ({
          objectives: state.objectives.map(obj =>
            obj.id === id
              ? {
                ...obj,
                othersObjective: '',
                othersSuccessIndicator: ''
              }
              : obj
          ),
          //clear current edited objective 
          currentEditedObjective:
            state.currentEditedObjective?.id === id
              ? {
                ...state.currentEditedObjective,
                othersObjective: '',
                othersSuccessIndicator: ''
              }
              : state.currentEditedObjective
        }));
      },

      clearParentId: () => {
        set(() => ({
          current_parent_id: null,
        }))
      },

      setIsDiscussed: (data) => {
        set(() => ({
          hasDiscussed: data
        }))
      },

      clearObjectives: () => {
        set(() => ({
          objectives: [],
          hasDiscussed: false
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

      // delete objective with auth pin
      removeItem: async (body, callback) => {
        post({
          url: `check-pin`,
          // param: { id: params },
          form: body,
          success: (response) => {
            const { message, data } = response.data;
            callback(response.status, message, data);
          },
          failed: callback,
        });
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

export const useObjectivesActions = () =>
  useObjectivesHook(state => state.actions);

export const useObjectives = () =>
  useObjectivesHook(state => state.objectives)
