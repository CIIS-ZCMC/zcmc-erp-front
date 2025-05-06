import { create } from "zustand";
import { v4 as uuid } from 'uuid';

const useObjectivesHook = create((set, get) => ({
    applicationObjectives: [
        {
            id: uuid(),
            functionType: null,
            objective: null,
            successIndicator: null,
            rowId: 1
        }
    ],

    //update field 
    updateObjectiveField: (id, field, value) => {
        set((state) => ({
            applicationObjectives: state.applicationObjectives?.map((row) =>
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

    // Add objective row
    addObjective: () => {
        const current = get().applicationObjectives;
        const newObjective = {
            id: uuid(),
            functionType: null,
            objective: null,
            successIndicator: null,
            rowId: current.length + 1
        };

        set({ applicationObjectives: [...current, newObjective] });
    },

}))

export default useObjectivesHook;