import { create } from 'zustand';

const useAOPObjectivesHooks = create((set, get) => ({
    aopObjectives: [],

    // Delete an entire objective
    deleteObjective: (id) => {
        set((state) => ({
            aopObjectives: state.aopObjectives.filter((row) => console.log(row)),
        }));
    },

    setApplicationObjectivesPayload: (objectivesPayload) => {
        set(() => ({
            aopObjectives: objectivesPayload.map((item) => ({
                objective_id: item?.objective_id || null,
                success_indicator_id: item?.success_indicator_id || null,
                activities: [],
            })),
        }));
    },

    //update activities payload 
    setActivitiesPayload: (activitiesPayload) => {
        set((state) => ({
            aopObjectives: state.aopObjectives.map((obj, index) => {
                const incomingActivities = activitiesPayload[index]?.activities || [];
                return {
                    ...obj,
                    activities: incomingActivities.map((activity) => ({
                        name: activity.name,
                        is_gad_related: activity.is_gad_related,
                        cost: activity.cost,
                        start_month: activity.start_month,
                        end_month: activity.end_month,
                        target: activity.target,
                        responsible_people: activity.responsible_people,
                    })),
                };
            }),
        }));
    },

    setResponsiblePeoplePayload: (resPeoplePayload) => {
        console.log(get().aopObjectives);
        set((state) => ({
            aopObjectives: state.aopObjectives.map((obj) => {

                const updatedActivities = obj.activities.map((act) => {
                    const matchedRes = resPeoplePayload.find(
                        (res) => res.activityId === act.id // act must have id
                    );


                    return {
                        ...act,
                        responsible_people: matchedRes ? matchedRes.responsible_people : [],
                    };
                });

                return {
                    ...obj,
                    activities: updatedActivities,
                };
            }),
        }));
    },

    // Generate final payload
    getApplicationObjectivesPayload: () => {
        return get().aopObjectives.map((obj) => ({
            objective_id: obj.objective_id,
            success_indicator_id: obj.success_indicator_id,
            activities: obj.activities.map((act) => ({
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
