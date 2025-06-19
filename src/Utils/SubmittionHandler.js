import { useCallback } from 'react';

export const useSubmissionHandlers = ({
    AOP_APPLICATION_ID,
    mission,
    hasDiscussed,
    buildAOP,
    updateAOP,
    create,
    setIsLoading,
    setOpenSubmitModal,
    clearLocalStorage,
    setMission,
    setAlertDialog,
    setConfirmationModal,
    closeConfirmation,
    closeAlertDialog
}) => {

    // Handle successful submission alert
    const handleSubmitAlertSuccess = useCallback(() => {
        alert('navigating....');
        window.location.href = "/aop";
        closeAlertDialog();
    }, [closeAlertDialog]);

    // Main submission handler
    const handleSubmit = useCallback((isDraft) => {
        setIsLoading(true);

        const payload = {
            mission: mission,
            has_discussed: !!hasDiscussed,
            status: isDraft,
            authorization_pin: authorizationPin,
            application_objectives: buildAOP(),
        };

        const submissionAction = AOP_APPLICATION_ID ? updateAOP : create;

        submissionAction(payload, AOP_APPLICATION_ID, (status, message) => {
            setIsLoading(false);

            const responseMessages = {
                existing: {
                    status: 200,
                    title: "Existing AOP",
                    description: "You already have an AOP application in your area."
                },
                success: {
                    status: 200,
                    title: `AOP for F.Y. 2026 successfully ${AOP_APPLICATION_ID ? 'updated' : 'submitted for approval'}.`,
                    description: AOP_APPLICATION_ID
                        ? "Your AOP has been successfully updated."
                        : "Your AOP request has been sent to the next approving body."
                },
                error: {
                    status: status,
                    title: "Submission failed",
                    description: message || "An unexpected error occurred."
                }
            };

            if (status === 200 && message === responseMessages.existing.description) {
                setAlertDialog(responseMessages.existing);
                return;
            }

            if (status === 200) {
                setOpenSubmitModal(false);
                clearLocalStorage();
                setMission("");
                setAlertDialog(responseMessages.success);
                return;
            }

            setAlertDialog(responseMessages.error);
        });
    }, [
        AOP_APPLICATION_ID,
        mission,
        hasDiscussed,
        buildAOP,
        updateAOP,
        create,
        setIsLoading,
        setOpenSubmitModal,
        clearLocalStorage,
        setMission,
        setAlertDialog
    ]);

    // Confirmation modals
    const handleConfirmationModal = useCallback(() => {
        setOpenConfirmDialog(true);
        setConfirmationModal({
            status: 200,
            title: CONFIRMATION_CONSTANTS.ALERT_SUBMITTION_TITLE,
            description: CONFIRMATION_CONSTANTS.ALERT_SUBMITTION_DESCRIPTION,
        });
    }, [setConfirmationModal]);

    const handleDiscussedConfirmationModal = useCallback(() => {
        setOpenConfirmDiscussedDialog(true);
        setConfirmationModal({
            status: "warning",
            title: CONFIRMATION_CONSTANTS.ALERT_HASDISCUSSED_TITLE,
            description: CONFIRMATION_CONSTANTS.ALERT_HASDISCUSSED_DESCRIPTION,
        });
    }, [setConfirmationModal]);

    // Proceed to submission
    const proceed = useCallback(() => {
        handleConfirmationModal();
    }, [handleConfirmationModal]);

    return {
        handleSubmitAlertSuccess,
        handleSubmit,
        handleConfirmationModal,
        handleDiscussedConfirmationModal,
        proceed
    };
};