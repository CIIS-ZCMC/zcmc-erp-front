import { Fragment, useEffect, useState, useCallback } from "react";

import { useNavigate, Outlet } from "react-router-dom";
import { Stack, Link, Checkbox } from "@mui/joy";
import { Plus, ExternalLink } from "lucide-react";

//custom components
import { ThreeDotsLoader } from "../../../../../Components/Common/Loading/ThreeDotsLoader";
import BoxComponent from "../../../../../Components/Common/Card/BoxComponent";
import AlertDialogComponent from "../../../../../Components/Common/Dialog/AlertDialogComponent";
import ButtonComponent from "../../../../../Components/Common/ButtonComponent";
import ContainerComponent from "../../../../../Components/Common/ContainerComponent";
import EditableTableComponent from "../../../../../Components/Common/Table/EditableTableComponent";
import ConfirmationModalComponent from "../../../../../Components/Common/Dialog/ConfirmationModalComponent";
import ObjectivesTable from "./ObjectivesTable";

import MissionModal from "./MissionModal";
import FeedbackSection from "./FeedbackSection";

// hooks
import useFunctionTypeHook from "../../../../../Hooks/FunctionTypeHook";
import useAOPObjectivesHooks from "../../../../../Hooks/AOP/AOPObjectivesHook";
import useObjectivesHook from "../../../../../Hooks/ObjectivesHook";
import useActivitiesHook from "../../../../../Hooks/ActivitiesHook";
import useModalHook from "../../../../../Hooks/ModalHook";
import { useAOPActions } from "../../../../../Hooks/AOP/AOPObjectivesHook";
import useResourceHook from "../../../../../Hooks/ResourceHook";
import useResponsiblePeopleHook from "../../../../../Hooks/ResponsiblePeopleHook";
import { useCommentActions } from "../../../../../Hooks/CommentHook";

//data related
import { AOP_CONSTANTS, CONFIRMATION_CONSTANTS } from "../../../../../Data/constants";
import { AOP_HEADER } from "../../../../../Data/Columns";

// utils
import { localStorageSetter, localStorageGetter } from "../../../../../Utils/LocalStorage";
import { buildAOP } from "../../../../../Utils/aopBuilder";

const Objectives = () => {

    const APPLICATION_OBJECTIVE_ID = localStorageGetter('application-objective-id');
    const OBJECTIVES = localStorageGetter('objectives-storage');
    const savedMission = localStorageGetter("mission");

    useEffect(() => {
        console.log(savedMission)
    }, [savedMission])

    const { create, updateAOP, getSingleAOP } = useAOPActions();

    const { formattedObjectives } = useAOPObjectivesHooks();
    const { function_types, getFunctionType } = useFunctionTypeHook();

    const {
        objectives,
        hasDiscussed,
        addObjective,
        updateObjectiveField,
        clearObjectives,
        setIsDiscussed,
        setObjectives,
        deleteObjective,
    } = useObjectivesHook();
    const { findActivitiesByObjectiveID, activities, clearActivities, setActivities, removeActivity } =
        useActivitiesHook();
    const {
        responsible_people,
        findResponsiblePeopleByActivityID,
        clearResponsiblePeople,
        setResponsiblePeople,
        removeMultipleResponsiblePersonnel,
    } = useResponsiblePeopleHook();
    const { resources, findResourcesByActivityID, clearResources, clearCart, setResources, removeItemResource } =
        useResourceHook();
    const { setAlertDialog, setConfirmationModal, closeConfirmation, closeAlertDialog } =
        useModalHook();


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
    const [openSubmitModal, setOpenSubmitModal] = useState(false);
    const [openSaveMissionModal, setOpenSaveMissionModal] = useState(false);
    const [openFeedbackModal, setOpenFeedbackModal] = useState(false)

    const [authorizationPin, setAuthorizationPin] = useState(null);
    const [isDraft, setIsDraft] = useState(false);
    const [mission, setMission] = useState(savedMission ? savedMission : "");

    const activitiesCount = objectives.map((objective) => {
        return activities.filter((activity) => {
            return activity.parentId === objective.id || activity.parentId === objective.objectiveUuid
        }
        )
    });

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
    }, [APPLICATION_OBJECTIVE_ID, formattedObjectives, isLoading]);

    // check pag walang objectives then add default objective
    useEffect(() => {

        // console.log(objectives)

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

    // handle close alert and navigate to aop
    const handleNavigateToAOP = () => {
        setOpenAlertSuccess(true)
        setIsLoading(true);
        setTimeout(() => {
            window.location.href = "/aop";
            closeAlertDialog()
            setIsLoading(false);
        }, 2000)
    }

    // build aop payload
    const buildAopPayload = useCallback(() => {
        return buildAOP({
            objectives,
            findActivitiesByObjectiveID,
            findResourcesByActivityID,
            findResponsiblePeopleByActivityID
        });
    }, [
        objectives,
        findActivitiesByObjectiveID,
        findResourcesByActivityID,
        findResponsiblePeopleByActivityID
    ]);

    useEffect(() => {
        console.log(APPLICATION_OBJECTIVE_ID)
    }, [APPLICATION_OBJECTIVE_ID])


    const handleSubmit = () => {
        setIsLoading(true);

        const payload = {
            mission: mission,
            has_discussed: !!hasDiscussed,
            status: isDraft ? 'draft' : 'pending',
            authorization_pin: authorizationPin,
            application_objectives: buildAopPayload(),
        };

        console.log('payload', payload)

        // Determine which action to take (update or create)
        const submissionAction = APPLICATION_OBJECTIVE_ID ? updateAOP : create;

        // submissionAction(payload, APPLICATION_OBJECTIVE_ID, (status, message) => {
        //     setIsLoading(false);

        //     // Common response handler for both create and update
        //     const responseMessages = {
        //         existing: {
        //             status: 200,
        //             title: "Existing AOP",
        //             description: "You already have an AOP application in your area."
        //         },
        //         success: {
        //             status: 200,
        //             title: `AOP for F.Y. 2026 successfully ${APPLICATION_OBJECTIVE_ID ? 'updated' : 'submitted for approval'}.`,
        //             description: APPLICATION_OBJECTIVE_ID
        //                 ? "Your AOP has been successfully updated."
        //                 : "Your AOP request has been sent to the next approving body."
        //         },
        //         error: {
        //             status: status,
        //             title: "Submission failed",
        //             description: message || "An unexpected error occurred."
        //         }
        //     };

        //     // Handle existing AOP case
        //     if (status === 200 && message === responseMessages.existing.description) {
        //         setAlertDialog(responseMessages.existing);
        //         return;
        //     }

        //     // Handle success case
        //     if (status === 200) {
        //         setOpenSubmitModal(false);
        //         clearLocalStorage();
        //         setMission("");
        //         setAlertDialog(responseMessages.success);
        //         // handle alert that will navigate to aop
        //         handleNavigateToAOP()
        //         return;
        //     }

        //     // Handle failure case
        //     setAlertDialog(responseMessages.error);
        // });

    };

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

    //cancel aop request
    const handleCancelRequest = () => {
        {
            clearLocalStorage();
            setMission("");
            navigate("/aop");
        }
    };

    // handle view feedback/comments
    const handleViewFeedback = () => {
        setOpenFeedbackModal(true);
        setIsRemarksLoading(true);

        const fetch = () => {
            // if (!isDivisionHead || !isMCC) {
            getCommentsByApplication(APPLICATION_OBJECTIVE_ID, () => { });
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


    return (
        <Fragment>
            <ContainerComponent
                title={AOP_CONSTANTS.MANAGE_OBJECTIVES_HEADER}
                description={AOP_CONSTANTS.MANAGE_OBJECTIVES_SUBHEADER}
                actions={
                    <Stack direction={"row"} gap={1}>

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
                        />
                        {
                            !APPLICATION_OBJECTIVE_ID &&
                            <ButtonComponent
                                onClick={() => {
                                    setIsDraft(true);
                                    // handleSubmit("draft");
                                }}
                                label={"Save as Draft"}
                                variant={"outlined"}
                                disabled={isDraft}
                            />
                        }
                    </Stack>
                }
            >
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
                                    rows={objectives}
                                    deleteRow={removeObjective}
                                    handleChange={updateObjectiveField}
                                    function_types={function_types}
                                    activitiesCount={activitiesCount}
                                />
                            }
                            stickLast
                        />

                        <Stack
                            mt={2}
                            direction={"flex"}
                            alignItems={"center"}
                            justifyContent={"start"}
                            gap={1}
                        >
                            <ButtonComponent
                                label={"Cancel Request"}
                                size={"md"}
                                variant={"outlined"}
                                onClick={() => handleCancelRequest()}
                            />

                            <ButtonComponent
                                label={"Submit AOP"}
                                size={"md"}
                                variant={"solid"}
                                disabled={isSubmitEnabled}
                                onClick={() => handleDiscussedConfirmationModal()} //open the has discussed modal
                            />
                        </Stack>
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

            {openConfirmDialog && (
                <ConfirmationModalComponent
                    leftButtonlabel={"Back to editor"}
                    rightButtonAction={() => handleSubmit()}
                    withAuthPin
                    rightButtonDisabled={!authorizationPin}
                    setAuthPin={setAuthorizationPin}
                    isLoading={isLoading}
                />
            )}

            {/* Confirmation for handle discussed */}
            {openConfirmDiscussedDialog && (
                <ConfirmationModalComponent
                    leftButtonLabel={"Back"}
                    rightButtonAction={() => handleProceedAuthModal(200)}
                    rightButtonLabel="Proceed"
                    rightButtonDisabled={!hasDiscussed}
                    isLoading={isLoading}
                    content={
                        <>
                            <Checkbox
                                label={
                                    "Yes, I have discussed these plans with my Division Chief."
                                }
                                onChange={(e) => {
                                    setIsDiscussed(e.target.checked);
                                }}
                                checked={hasDiscussed}
                            />
                        </>
                    }
                />
            )}

            <FeedbackSection
                openFeedbackModal={openFeedbackModal}
                setOpenFeedbackModal={setOpenFeedbackModal}
                isLoading={isRemarksLoading}
            />
            {
                openAlertSuccess && (
                    <AlertDialogComponent
                        rightButtonAction={() => handleNavigateToAOP()}
                        isLoading={isLoading}
                        noRightButton={false}
                    />
                )
            }


            <Outlet />
        </Fragment>

    );
};

export default Objectives;
