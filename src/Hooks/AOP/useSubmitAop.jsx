import SubmissionServices from "../../Services/SubmissionServices";
import useSubmitAopStore from "../../Store/useSubmitAopStore";
import useModalHook from "../../Hooks/ModalHook";

export const useSubmitAOP = ({
    mission,
    hasDiscussed,
    authorizationPin,
    buildAopPayload,
    APPLICATION_OBJECTIVE_ID,
    createFn
}) => {
    const { isSubmitLoading, setIsSubmitLoading, alertDialog, setAlertDialog } = useSubmitAopStore();
    const { closeConfirmation } = useModalHook();

    const handleSubmit = async (is_draft, setOpenAlertSuccess) => {
        setIsSubmitLoading(true);

        const payload = {
            mission,
            has_discussed: !!hasDiscussed,
            status: is_draft ? "draft" : "pending",
            authorization_pin: authorizationPin,
            application_objectives: buildAopPayload,
        };

        //log to check payload
        // console.log(payload)

        const result = await SubmissionServices.submit(payload, createFn, APPLICATION_OBJECTIVE_ID);

        if (result.type === "existing") {
            setAlertDialog(result);
        } else if (result.type === "success") {
            setAlertDialog(result);
            closeConfirmation();
            setOpenAlertSuccess(true);
        } else {
            setAlertDialog(result);
        }

        setIsSubmitLoading(false);
    };

    return { handleSubmit, isSubmitLoading, alertDialog };
};