// utils/aopBuilder.js
export const buildAOP = ({
    objectives,
    otherObjective,
    otherSuccessIndicator,
    findActivitiesByObjectiveID,
    findResourcesByActivityID,
    findResponsiblePeopleByActivityID
}) => {
    return objectives?.map((item) => {
        console.log('objectives', item)
        const activities = findActivitiesByObjectiveID(item.id);
        const activitiesWithExtras = activities.map((act) => {
            const { parentId, id, startMonth, endMonth, target, isGadRelated, ...actData } = act;

            return {
                ...actData,
                start_month: startMonth,
                end_month: endMonth,
                is_gad_related: isGadRelated,
                target: {
                    first_quarter: target.firstQuarter,
                    second_quarter: target.secondQuarter,
                    third_quarter: target.thirdQuarter,
                    fourth_quarter: target.fourthQuarter,
                },
                resources: findResourcesByActivityID(act.id),
                responsible_people: findResponsiblePeopleByActivityID(act.id),
            };
        });

        return {
            objective_id: item.objective?.id,
            success_indicator_id: item.successIndicator?.id,
            others_objective: item.othersObjective,
            other_success_indicator: item.othersSuccessIndicator,
            activities: activitiesWithExtras,
        };
    }) || []; // Return empty array if no objectives
};


// function buildAOP() {
//     const objectiveData = objectives?.map((item) => {
//         const activities = findActivitiesByObjectiveID(item.id);
//         const activitiesWithResourceAndResponsiblePeople = activities.map(
//             (act) => {
//                 const {
//                     parentId,
//                     id,
//                     startMonth,
//                     endMonth,
//                     target,
//                     isGadRelated,
//                     ...actData
//                 } = act;
//                 const resources = findResourcesByActivityID(act.id);
//                 const responsible_people = findResponsiblePeopleByActivityID(act.id);

//                 return {
//                     ...actData,
//                     start_month: startMonth,
//                     end_month: endMonth,
//                     is_gad_related: isGadRelated,
//                     target: {
//                         first_quarter: target.firstQuarter,
//                         second_quarter: target.secondQuarter,
//                         third_quarter: target.thirdQuarter,
//                         fourth_quarter: target.fourthQuarter,
//                     },
//                     resources: resources,
//                     responsible_people: responsible_people,
//                 };
//             }
//         );

//         return {
//             objective_id: item.objective.id,
//             success_indicator_id: item.successIndicator.id,
//             others_objective: otherObjective,
//             other_success_indicator: otherSuccessIndicator,
//             activities: activitiesWithResourceAndResponsiblePeople,
//         };
//     });

//     return objectiveData;
// }


// Create memoized builder function
