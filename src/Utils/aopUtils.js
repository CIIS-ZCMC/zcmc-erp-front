//disabled edit mode
export const disabledEditMode = (APPLICATION_OBJECTIVE_ID, remarks, comments, disabled) => {
    if (!APPLICATION_OBJECTIVE_ID) return false //create mode

    const noRemarks = !remarks || remarks.length === 0;
    const noComments = !comments || comments.length === 0;

    if (noRemarks && noComments) return true;
    return disabled;
}

//get Activities Count
export const getActivitiesCount = (objectives, activities) => {
    return objectives?.map((objective) => {
        return activities.filter((activity) => {
            return activity.parentId === objective.id || activity.parentId === objective.objectiveUuid
        }
        )
    });
}