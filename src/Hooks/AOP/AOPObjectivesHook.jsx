import { create } from 'zustand';

const aopActivity = {
    activity_code: '',
    name: '',
    is_gad_related: false,
    cost: 0,
    start_month: '',
    end_month: '',
    target: {
        first_quarter: '',
        second_quarter: '',
        third_quarter: '',
        fourth_quarter: '',
    },
    resources: [],
    responsible_people: [
        {
            user_id: null,
            designation_id: null,
            division_id: null,
            department_id: null,
            section_id: null,
            unit_id: null
        }
    ],
}

const useAOPObjectivesHooks = create((set, get) => ({
    // Initial 3 default objectives
    aopObjectives: Array.from({ length: 3 }, (_, index) => ({
        id: index + 1,
        objective_id: null,
        success_indicator_id: null,
        activities: [
            {
                id: `${index + 1}-1`,
                ...aopActivity
            }
        ],
    })),

    // Update fields objective
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

    //Add new activity
    updateActivityField: (objectiveId, activityId, fieldPath, value) => {
        set((state) => ({
            aopObjectives: state.aopObjectives.map((objective) =>
                objective.id === objectiveId
                    ? {
                        ...objective,
                        activities: objective.activities.map((activity) => {
                            if (activity.id !== activityId) return activity;

                            const updatedActivity = { ...activity };
                            const keys = fieldPath.split(".");
                            let current = updatedActivity;

                            for (let i = 0; i < keys.length - 1; i++) {
                                current = current[keys[i]] = { ...current[keys[i]] };
                            }

                            current[keys.at(-1)] = value;

                            return updatedActivity;
                        }),
                    }
                    : objective
            ),
        }));
    },

    setAopObjective: (objectiveId, activityId, responsiblePeople) => {
        set((state) => ({
            aopObjectives: state.aopObjectives.map((objective) =>
                objective.id === objectiveId
                    ? {
                        ...objective,
                        activities: objective.activities.map((activity) =>
                            activity.id === activityId
                                ? {
                                    ...activity,
                                    responsible_people: responsiblePeople,
                                }
                                : activity
                        ),
                    }
                    : objective
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

    //Add new activity
    addActivity: (objectiveId) => {

        set((state) => ({
            aopObjectives: state.aopObjectives.map((objective) =>
                objective.id === objectiveId
                    ? {
                        ...objective,
                        activities: [
                            ...objective.activities,
                            {
                                id: `${objective.id}-${objective.activities.length + 1}`,
                                ...aopActivity,
                            },
                        ],
                    }
                    : objective
            ),
        }));
    },

    // Delete an entire objective
    deleteObjective: (id) => {
        set((state) => ({
            aopObjectives: state.aopObjectives.filter((row) => row.id !== id),
        }));
    },

    //delete single activity
    deleteActivity: (activityId) => {
        set((state) => ({
            aopObjectives: state.aopObjectives.map((objective) => ({
                ...objective,
                activities: objective.activities.filter((activity) => activity.id !== activityId),
            })),
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

export const useAopObjectives = () =>
    useAOPObjectivesHooks((state) => state.aopObjectives);
