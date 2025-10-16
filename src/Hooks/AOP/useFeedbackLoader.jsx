import { useState, useCallback } from "react";
import { useCommentActions } from "../../Hooks/CommentHook";
import { useObjectivesStorage } from "../../Store/useObjectivesStorage";

export default function useFeedbackLoader(applicationObjectiveId) {
    const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
    const [isRemarksLoading, setIsRemarksLoading] = useState(true);

    const { getCommentsByApplication, getRemarksByApplication } = useCommentActions();
    const { getCommentsByApplicationId } = useObjectivesStorage();

    const openFeedback = useCallback(() => {
        setOpenFeedbackModal(true);
        setIsRemarksLoading(true);

        try {
            // Load comments then refresh local store comments
            getCommentsByApplication(applicationObjectiveId, () => {
                getCommentsByApplicationId();
            });

            // Load remarks and end loading after a short delay
            getRemarksByApplication(applicationObjectiveId, () => {
                setTimeout(() => setIsRemarksLoading(false), 1000);
            });
        } catch (e) {
            setIsRemarksLoading(false);
        }
    }, [applicationObjectiveId, getCommentsByApplication, getRemarksByApplication, getCommentsByApplicationId]);

    return {
        openFeedbackModal,
        setOpenFeedbackModal,
        isRemarksLoading,
        openFeedback,
    };
}
