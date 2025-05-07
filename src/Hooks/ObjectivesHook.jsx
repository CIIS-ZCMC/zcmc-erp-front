import { create } from "zustand";
import { persist } from "zustand/middleware"
import { v4 as uuid } from 'uuid';

const initialObjective = () => (
    {
        id: uuid(),
        functionType: null,
        objective: null,
        successIndicator: null,
        rowId: 1
    }
)

const useObjectivesHook = create(
    persist(
        (set, get) => ({
            objectives: [],

            //update field 
            updateObjectiveField: (id, field, value) => {
                set((state) => ({
                    objectives: state.objectives?.map((row) =>
                        row.id === id
                            ? {
                                ...row,
                                [field]: value,
                                ...(field === 'objective_id' && { success_indicator_id: null }),
                            }
                            : row
                    ),
                }));
            },
            // add row objective
            addObjective: () => {
                const current = get().objectives;
                set((state) => ({
                    objectives: [...state.objectives,
                    initialObjective(current.length + 1)],
                }));
            }
        }),
        {
            name: "objectives-storage",
            getStorage: () => localStorage,
        }
    ),

);
export default useObjectivesHook;