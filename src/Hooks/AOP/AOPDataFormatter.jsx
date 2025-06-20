// hooks/useAopDataFormatter.js
import { useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import useAOPObjectivesHooks from './AOPObjectivesHook';
const useAopDataFormatter = () => {
    const { aopObjectives } = useAOPObjectivesHooks();

    return useMemo(() => {
        if (!aopObjectives?.application_objectives) {
            return {
                formattedObjectives: [],
                formattedActivities: [],
                formattedResources: [],
                formattedResponsiblePeople: []
            };
        }

        // Format objectives
        const formattedObjectives = aopObjectives.application_objectives.map(
            ({ function_type, objective, success_indicator, objective_uuid, other_objective, other_success_indicator }, index) => ({
                id: uuid(),
                rowId: index + 1,
                functionType: function_type,
                objective: objective,
                successIndicator: success_indicator,
                objectiveUuid: objective_uuid,
                othersObjective: other_objective,
                othersSuccessIndicator: other_success_indicator,
            })
        );

        // Format activities
        const flatActivities = aopObjectives.application_objectives.flatMap(data =>
            data.activity.map(activity => ({
                ...activity,
                objectiveUuid: data.objective_uuid
            }))
        );

        const formattedActivities = flatActivities.map(
            ({
                activity_uuid,
                name,
                is_gad_related,
                cost,
                start_month,
                end_month,
                target,
                objectiveUuid,
            }, index) => ({
                id: activity_uuid || uuid(),
                parentId: objectiveUuid,
                rowId: index + 1,
                name: name,
                isGadRelated: is_gad_related,
                cost: cost,
                startMonth: start_month,
                endMonth: end_month,
                target: {
                    firstQuarter: target?.first_quarter,
                    secondQuarter: target?.second_quarter,
                    thirdQuarter: target?.third_quarter,
                    fourthQuarter: target?.fourth_quarter,
                },
            })
        );

        // Format resources
        const flatResources = aopObjectives.application_objectives.flatMap(data =>
            data.activity.flatMap(item => item.resources || [])
        );

        const formattedResources = flatResources.map((resource, index) => ({
            id: uuid(),
            item_id: resource.item?.id,
            parentId: resource.item?.parentId,
            rowId: index + 1,
            name: resource.item?.name || 'Unnamed Resource',
            quantity: resource.quantity || 0,
            individualPrice: resource.item?.estimated_budget || 0,
            totalCost: Number(((resource.item?.estimated_budget || 0) * (resource.quantity || 0)).toFixed(2)),
            expenseClass: resource.expense_class,
            purchaseTypeId: resource.purchase_type,
        }));

        // Format responsible people
        const flatResponsiblePeople = aopObjectives.application_objectives.flatMap(data =>
            data.activity.flatMap(item => item.responsible_people || [])
        );

        const formattedResponsiblePeople = flatResponsiblePeople.map(responsible => ({
            activityId: responsible.activity_uuid,
            users: responsible.users || [],
            designations: responsible.designations || [],
            areas: responsible.areas || [],
        }));

        return {
            formattedObjectives,
            formattedActivities,
            formattedResources,
            formattedResponsiblePeople
        };
    }, [aopObjectives]);
};

export default useAopDataFormatter;