import { Fragment, useEffect, useState, useCallback } from "react";

import { useNavigate, Outlet } from "react-router-dom";
import { Stack, Link, Snackbar, Alert, Divider } from "@mui/joy";
import { Plus, ExternalLink } from "lucide-react";

//custom components
import { ThreeDotsLoader } from "../../../../../Components/Common/Loading/ThreeDotsLoader";
import BoxComponent from "../../../../../Components/Common/Card/BoxComponent";
import AlertDialogComponent from "../../../../../Components/Common/Dialog/AlertDialogComponent";
import ButtonComponent from "../../../../../Components/Common/ButtonComponent";
import ContainerComponent from "../../../../../Components/Common/ContainerComponent";
import EditableTableComponent from "../../../../../Components/Common/Table/EditableTableComponent";
import ObjectivesTable from "./ObjectivesTable";

import MissionModal from "./modals/MissionModal";
import ConfirmationModal from "./modals/ConfirmationModal";
import DiscussedModal from "./modals/DiscussedModal";
import CancelModal from './modals/CancelModal';
import FeedbackSection from "./FeedbackSection";

// hooks
import useFunctionTypeHook from "../../../../../Hooks/FunctionTypeHook";
import useAOPObjectivesHooks from "../../../../../Hooks/AOP/AOPObjectivesHook";
import useObjectivesHook from "../../../../../Hooks/ObjectivesHook";
import useActivitiesHook from "../../../../../Hooks/ActivitiesHook";
import useModalHook from "../../../../../Hooks/ModalHook";
import { useAOPActions, useAopStatus } from "../../../../../Hooks/AOP/AOPObjectivesHook";
import useResourceHook from "../../../../../Hooks/ResourceHook";
import useResponsiblePeopleHook from "../../../../../Hooks/ResponsiblePeopleHook";
import { useCommentActions } from "../../../../../Hooks/CommentHook";

//data related
import { AOP_CONSTANTS, CONFIRMATION_CONSTANTS } from "../../../../../Data/constants";
import { AOP_HEADER } from "../../../../../Data/Columns";

// utils
import { buildAOP } from "../../../../../Utils/aopBuilder";
import { useAuth } from "../../../../../Store/AuthStore";
import { useSubmitAOP } from "../../../../../Hooks/AOP/useSubmitAop";
import { useObjectivesStorage } from "../../../../../Store/useObjectivesStorage";
import useSocketEditing from "../../../../../Hooks/Socket/useSocketEditing";
import { disabledEditMode, getActivitiesCount } from "../../../../../Utils/aopUtils";

const Objectives = () => {

    //local staorage data
    const {
        APPLICATION_OBJECTIVE_ID,
        OBJECTIVES,
        savedMission,
        remarks,
        comments,
        aopStatus,
        getCommentsByApplicationId,
    } = useObjectivesStorage()

    useEffect(() => {
        getCommentsByApplicationId()
    }, [comments])

    const { user } = useAuth();
    const { assignedArea } = user ?? {};

    const {
        openNotify,
        editor,
        disabled,
        show,
        editLoad,
        handleEditClick,
        disconnectSignal,
        closeNotify
    } = useSocketEditing({ user, assignedArea })

    const { create, getSingleAOP } = useAOPActions();

    const { formattedObjectives, aop_status } = useAOPObjectivesHooks();
    const { function_types, getFunctionType } = useFunctionTypeHook();

    const {
        objectives,
        hasDiscussed,
        addObjective,
        updateObjectiveField,
        clearObjectives,
        setIsDiscussed,
        deleteObjective,
    } = useObjectivesHook();

    const {
        findActivitiesByObjectiveID,
        activities,
        clearActivities,
        removeActivity
    } = useActivitiesHook();

    const {
        responsible_people,
        findResponsiblePeopleByActivityID,
        clearResponsiblePeople,
        removeMultipleResponsiblePersonnel,
    } = useResponsiblePeopleHook();

    const {
        resources,
        findResourcesByActivityID,
        clearResources,
        clearCart,
        removeItemResource
    } = useResourceHook();

    const {
        setAlertDialog,
        setConfirmationModal,
        closeConfirmation,
        closeAlertDialog
    } = useModalHook();

    // COMMENTS HOOK
    const {
        getCommentsByActivity,
        getCommentsByApplication,
        getRemarksByApplication,
    } = useCommentActions();

    const navigate = useNavigate();

    // local states
    const [isLoading, setIsLoading] = useState(false);
    const [isRemarksLoading, setIsRemarksLoading] = useState(true);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openConfirmDiscussedDialog, setOpenConfirmDiscussedDialog] = useState(false);
    const [openAlertSuccess, setOpenAlertSuccess] = useState(false)
    const [openSaveMissionModal, setOpenSaveMissionModal] = useState(false);
    const [openFeedbackModal, setOpenFeedbackModal] = useState(false)
    const [openCancelRequestModal, setOpenCancelRequestModal] = useState(false)

    const [authorizationPin, setAuthorizationPin] = useState(null);
    const [isDraft, setIsDraft] = useState(false);
    const [mission, setMission] = useState(savedMission ? savedMission : "");

    const activitiesCount = getActivitiesCount(objectives, activities);

    // build aop payload
    const buildAopPayload = useCallback(() => {
        return buildAOP({
            objectives,
            findActivitiesByObjectiveID,
            findResourcesByActivityID,
            findResponsiblePeopleByActivityID,
            APPLICATION_OBJECTIVE_ID,
        });
    }, [
        objectives,
        findActivitiesByObjectiveID,
        findResourcesByActivityID,
        findResponsiblePeopleByActivityID
    ]);

    // submit aop
    const { handleSubmit, isSubmitLoading, alertDialog } = useSubmitAOP({
        mission,
        hasDiscussed,
        authorizationPin,
        buildAopPayload: buildAopPayload(),
        APPLICATION_OBJECTIVE_ID,
        createFn: create // create aop function call
    })

    const handleCloseSnack = () => {
        setEditor(null);
        setOpenNotify(false);
    };

    const isSubmitEnabled = !mission ||
        resources.length === 0 ||
        responsible_people.length === 0

    useEffect(() => {
        const params = { with_sub_data: 1 };
        getFunctionType(params, (status, message) => {
            if (!(status >= 200 && status < 300)) {
                // if status not success
                return; //Toast error
            }
            setIsLoading(false);
        });

        if (APPLICATION_OBJECTIVE_ID && !formattedObjectives?.length) {
            setIsLoading(true);
            getSingleAOP(APPLICATION_OBJECTIVE_ID, (status, message) => {
                setIsLoading(false)
                if (!(status >= 200 && status < 300)) {
                    return
                }
            })

        }
    }, [APPLICATION_OBJECTIVE_ID, formattedObjectives]);

    // check pag walang objectives then add default objective
    useEffect(() => {
        if (objectives?.length === 0) {
            addObjective();
        }
    }, [objectives, addObjective]);

    // clear local storage
    const clearLocalStorage = () => {
        //set objectives, activities, resources into empty state then clear localStorrage
        clearObjectives();
        clearActivities();
        clearResponsiblePeople();
        clearResources();
        clearCart();
        setMission("");
    };

    //with auth pin data
    const handleProceedAuthModal = (status) => {
        setOpenConfirmDialog(true);
        const data = {
            status: status,
            title: CONFIRMATION_CONSTANTS.ALERT_SUBMITTION_TITLE,
            description: CONFIRMATION_CONSTANTS.ALERT_SUBMITTION_DESCRIPTION,
        };
        setConfirmationModal(data);
        setOpenConfirmDiscussedDialog(false) //close is discussed modal
    };

    //has discussed data
    const handleDiscussedConfirmationModal = () => {
        setOpenConfirmDiscussedDialog(true);
        const data = {
            status: "warning",
            title: CONFIRMATION_CONSTANTS.ALERT_HASDISCUSSED_TITLE,
            description: CONFIRMATION_CONSTANTS.ALERT_HASDISCUSSED_DESCRIPTION,
        };
        setConfirmationModal(data);
    };

    // useEffect(() => {
    //     console.log(APPLICATION_OBJECTIVE_ID)
    // }, [APPLICATION_OBJECTIVE_ID])

    // handle close alert and navigate to aop
    const handleNavigateToAOP = () => {
        setIsLoading(true);
        setTimeout(() => {
            setConfirmationModal(false)
            setAlertDialog(false)
            closeAlertDialog()
            window.location.href = "/aop";
            setIsLoading(false)
            setOpenAlertSuccess(false)
            clearLocalStorage();
        }, 2000)
    }

    // useEffect(() => {
    //     console.log(isDraft)
    // }, [isDraft])

    // handle save mission
    const handleSaveMission = () => {
        let data = {};

        data = {
            status: 200,
            title: APPLICATION_OBJECTIVE_ID ? "Mission updated successfully" : "Mission created successfully!",
            description: "",
        };
        handleCloseDialog();
        setAlertDialog(data);

        // Save to local storage
        localStorage.setItem("mission", JSON.stringify(mission));
    };

    const handleOpenDialog = () => {
        setOpenSaveMissionModal(true);
    };

    const handleCloseDialog = () => {
        setOpenSaveMissionModal(false);
    };

    const handleOpenCancelRequestModal = () => {
        setOpenCancelRequestModal(true)
        setOpenConfirmDialog(false)
        setConfirmationModal
        const data = {
            status: "warning",
            title: ` Are you sure you want to cancel this request ? `,
            description: "If you confirm, you will be redirected back to the AOP page.",
        };
        setConfirmationModal(data);
    }

    //cancel aop request
    const handleCancelRequest = () => {
        setIsLoading(true)
        try {
            setTimeout(() => {
                clearLocalStorage();
                setMission("");
                navigate("/aop");
                // window.location.href = "/aop";
                setOpenCancelRequestModal(false);
                closeConfirmation();
                setIsLoading(false)
            }, 1000);

        } catch (error) {
            setIsLoading(false)
            setAlertDialog({
                status: "error",
                title: "Unexpected error",
                description: "Something went wrong. Please try again.",
            });
        }
    };

    // handle view feedback/comments
    const handleViewFeedback = () => {
        setOpenFeedbackModal(true);
        setIsRemarksLoading(true);

        const fetch = () => {
            // if (!isDivisionHead || !isMCC) {
            getCommentsByApplication(APPLICATION_OBJECTIVE_ID, () => {
                getCommentsByApplicationId()
            });
            // }

            getRemarksByApplication(APPLICATION_OBJECTIVE_ID, () => {
                setTimeout(() => setIsRemarksLoading(false), 1000);
            });
        };

        Promise.all(fetch())
            .then(() => {
                setIsRemarksLoading(false);
            })
            .catch((error) => {
                // console.error("Error fetching comments or remarks:", error);
                setIsRemarksLoading(false);
            });
    }

    const removeObjective = (objectiveId) => {
        const relatedActivities = findActivitiesByObjectiveID(objectiveId);
        const activityIds = relatedActivities.map((act) => act.id);

        // Remove resources by parentId
        const resourceIdsToDelete = resources
            .filter((res) => activityIds.includes(res.parentId))
            .map((res) => res.id);

        if (resourceIdsToDelete.length > 0) {
            removeItemResource(resourceIdsToDelete);
        }

        // Remove responsible people in batch by parentId
        if (activityIds.length > 0) {
            removeMultipleResponsiblePersonnel(activityIds); // NEW batch delete!
        }

        // Remove activities
        activityIds.forEach((id) => removeActivity(id));

        // Remove the objective
        deleteObjective(objectiveId)
    };

    const handleCancelDiscussedModal = () => {
        setOpenConfirmDiscussedDialog(false)
        setOpenConfirmDialog(false)
    }

    const handleClose = () => {
        close;
        closeAlertDialog();
        // setOpenReq(false);
        // setItemReq({});
        // setActivity({});
        // setExpenseClass({});
        // setPin("");
    };

    return (
        <Fragment>
            <ContainerComponent
                title={AOP_CONSTANTS.MANAGE_OBJECTIVES_HEADER}
                description={AOP_CONSTANTS.MANAGE_OBJECTIVES_SUBHEADER}
                sx={{ mt: 3 }}
                actions={
                    <Stack direction={"row"} spacing={1}>
                        {
                            APPLICATION_OBJECTIVE_ID &&
                            <ButtonComponent
                                label={'Read Feedback'}
                                variant={"outlined"}
                                onClick={() => handleViewFeedback()}
                            />
                        }

                        <ButtonComponent
                            onClick={addObjective}
                            label={"Add an Objective"}
                            endDecorator={<Plus size={16} />}
                            disabled={!show || disabledEditMode(APPLICATION_OBJECTIVE_ID, remarks, comments, disabled)}
                        />

                        {
                            !APPLICATION_OBJECTIVE_ID &&
                            <ButtonComponent
                                onClick={() => {
                                    setIsDraft(true);
                                    handleSubmit(true, () => setOpenAlertSuccess(true));
                                }}
                                label={"Save as Draft"}
                                variant={"outlined"}
                                disabled={isDraft}
                            />
                        }

                        <ButtonComponent
                            label={show ? "Exit Edit Mode" : "Edit Objectives"}
                            onClick={() => (show ? disconnectSignal() : handleEditClick())}
                            size="md"
                            isLoading={editLoad}
                            color={show ? "danger" : "primary"}
                            variant="outlined"
                            disabled={disabledEditMode(APPLICATION_OBJECTIVE_ID, remarks, comments, disabled)}  //get the remarks and comments then check if empty, user cannot edit and also if socket detected that there is someone editing
                        />
                    </Stack>
                }
            >
                <Stack
                    mb={2}
                    direction={"flex"}
                    alignItems={"center"}
                    justifyContent={"end"}
                    gap={1}
                >
                    <ButtonComponent
                        label={"Cancel Request"}
                        size={"md"}
                        variant={"outlined"}
                        onClick={() => handleOpenCancelRequestModal()}
                    />

                    <ButtonComponent
                        label={APPLICATION_OBJECTIVE_ID ? "Resubmit AOP" : "Submit AOP"}
                        size={"md"}
                        variant={"solid"}
                        disabled={!show}
                        onClick={() => handleDiscussedConfirmationModal()} //open the has discussed modal
                    />
                </Stack>

                <Divider sx={{ mb: 2 }} />

                {isLoading
                    ?
                    <BoxComponent
                        mt={3}
                        height={"65vh"}
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"center"}
                        alignContent={"center"}
                    >
                        <ThreeDotsLoader />
                    </BoxComponent>
                    :
                    <Fragment>
                        <EditableTableComponent
                            columns={AOP_HEADER}
                            secondaryHeader={
                                <Link component="button" onClick={() => handleOpenDialog()} pb={1}>
                                    <Stack direction={"row"} gap={1} alignItems={"center"}>
                                        {APPLICATION_OBJECTIVE_ID ? 'Update Mission' : ' Create Mission'}
                                        <ExternalLink size={16} />
                                    </Stack>
                                </Link>
                            }
                            tableRow={
                                <ObjectivesTable
                                    isEditing={show}
                                    rows={objectives}
                                    deleteRow={removeObjective}
                                    handleChange={updateObjectiveField}
                                    function_types={function_types}
                                    activitiesCount={activitiesCount}
                                    applicationObjectiveId={APPLICATION_OBJECTIVE_ID}
                                    remarks={remarks}
                                    comments={comments}
                                    disabled={disabled}
                                    disabledEditMode={disabledEditMode}
                                />
                            }
                            stickLast
                        />
                    </Fragment>
                }
            </ContainerComponent>

            <MissionModal
                APPLICATION_OBJECTIVE_ID={APPLICATION_OBJECTIVE_ID}
                openSaveMissionModal={openSaveMissionModal}
                handleCloseDialog={handleCloseDialog}
                mission={mission}
                setMission={setMission}
                handleSaveMission={handleSaveMission}
            />

            {/* confirm with authpin submittion */}
            <ConfirmationModal
                rightButtonAction={() => handleSubmit(false, () => setOpenAlertSuccess(true))}
                withAuthPin
                rightButtonDisabled={authorizationPin}
                setAuthPin={setAuthorizationPin}
                isLoading={isLoading}
                openConfirmDialog={openConfirmDialog}
            />

            {/* Confirmation for handle discussed */}
            <DiscussedModal
                openConfirmDiscussedDialog={openConfirmDiscussedDialog}
                setOpenConfirmDiscussedDialog={setOpenConfirmDiscussedDialog}
                leftButtonAction={() => handleCancelDiscussedModal()}
                rightButtonAction={() => handleProceedAuthModal(200)}
                hasDiscussed={hasDiscussed}
                setIsDiscussed={setIsDiscussed}
                isLoading={isLoading}
            />

            <CancelModal
                leftButtonAction={() => setOpenCancelRequestModal(false)}
                rightButtonAction={() => handleCancelRequest()}
                openCancelRequestModal={openCancelRequestModal}
                isLoading={isLoading}
            />

            <FeedbackSection
                openFeedbackModal={openFeedbackModal}
                setOpenFeedbackModal={setOpenFeedbackModal}
                isLoading={isRemarksLoading}
            />

            {
                openAlertSuccess && (
                    <AlertDialogComponent
                        leftButtonLabel={"Close"}
                        leftButtonAction={() => handleNavigateToAOP()}
                        rightButtonLabel="Proceed"
                        rightButtonAction={() => handleNavigateToAOP()}
                        isLoading={isLoading}
                        noRightButton={false}
                    />
                )
            }

            {/* <AlertDialogComponent
                leftButtonAction={() => handleClose()}
            /> */}

            <Snackbar
                open={openNotify}
                // autoHideDuration={2000}
                onClose={closeNotify}
                color="success"
            >
                <Alert
                    onClose={handleCloseSnack}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {editor?.editorName}
                    is currently editing
                </Alert>
            </Snackbar>

            <Outlet />
        </Fragment>

    );
};

export default Objectives;
