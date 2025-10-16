import { localStorageGetter } from "../Utils/LocalStorage";

export const useObjectivesStorage = () => {
    const APPLICATION_OBJECTIVE_ID = localStorageGetter("aop-app-id");
    const OBJECTIVES = localStorageGetter("objectives-storage");
    const savedMission = localStorageGetter("mission");
    const remarks = localStorageGetter("remarks");
    const comments = localStorageGetter("all_comments");
    const aopStatus = localStorage.getItem("aop-status");

    const getCommentsByApplicationId = (applicationId) =>
        comments?.filter((comment) => comment.application_id === applicationId) || [];

    //reserve
    // const getCommentsByApplicationId = () => {
    //     const commentsByApplicationId = comments?.filter((comment) => comment.application_id === APPLICATION_OBJECTIVE_ID);
    //     console.log(`${APPLICATION_OBJECTIVE_ID}:`, commentsByApplicationId)
    //     return commentsByApplicationId;
    // }

    return {
        APPLICATION_OBJECTIVE_ID,
        OBJECTIVES,
        savedMission,
        remarks,
        comments,
        aopStatus,
        getCommentsByApplicationId,
    };
};
