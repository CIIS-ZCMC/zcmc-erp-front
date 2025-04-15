import { create } from 'zustand';

const useAOPObjectivesHooks = create((set, get) => ({

    // Initial 3 default objectives
    aopObjectives: Array.from({ length: 3 }, (_, i) => ({
        id: i + 1,
        objective_id: null,
        success_indicator_id: null,
        activities: [],
    })),

    updateObjectiveField: (id, field, value) => {
        set((state) => ({
            aopObjectives: state.aopObjectives.map((row) =>
                row.id === id
                    ? {
                        ...row,
                        [field]: value,
                        // reset fields
                        ...(field === 'objective_id' && { success_indicator_id: null }),
                    }
                    : row
            ),
        }));
    },

    // Add new objective row
    addObjective: () => {
        const currentObjectives = get().aopObjectives;
        const newId = currentObjectives.length + 1;

        set((state) => ({
            aopObjectives: [
                ...state.aopObjectives,
                {
                    id: newId,
                    objective_id: null,
                    success_indicator_id: null,
                    activities: [],
                },
            ],
        }));
    },

    // Delete an entire objective
    deleteObjective: (id) => {
        set((state) => ({
            aopObjectives: state.aopObjectives.filter((row) => row.id !== id),
        }));
    },

    // Generate final payload
    getApplicationObjectivesPayload: () => {
        return get().aopObjectives.map((obj) => ({
            objective_id: obj.objective_id,
            success_indicator_id: obj.success_indicator_id,
            activities: obj.activities.map((act) => ({
                activity_code: act.activity_code,
                name: act.name,
                is_gad_related: act.is_gad_related,
                cost: act.cost,
                start_month: act.start_month,
                end_month: act.end_month,
                target: act.target,
                resources: act.resources,
                responsible_people: act.responsible_people,
            })),
        }));
    },

}));

export default useAOPObjectivesHooks