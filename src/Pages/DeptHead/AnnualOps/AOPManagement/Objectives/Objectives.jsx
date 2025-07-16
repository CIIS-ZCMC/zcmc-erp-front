import { Fragment, useEffect, useState, useCallback } from "react";

import { useNavigate, Outlet } from "react-router-dom";
import { Stack, Link, Checkbox, Snackbar, Alert, Divider } from "@mui/joy";
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
import { useAOPActions, useAopStatus } from "../../../../../Hooks/AOP/AOPObjectivesHook";
import useResourceHook from "../../../../../Hooks/ResourceHook";
import useResponsiblePeopleHook from "../../../../../Hooks/ResponsiblePeopleHook";
import { useCommentActions } from "../../../../../Hooks/CommentHook";

//data related
import { AOP_CONSTANTS, CONFIRMATION_CONSTANTS } from "../../../../../Data/constants";
import { AOP_HEADER } from "../../../../../Data/Columns";

// utils
import { localStorageSetter, localStorageGetter } from "../../../../../Utils/LocalStorage";
import { buildAOP } from "../../../../../Utils/aopBuilder";
import { useAuth } from "../../../../../Store/AuthStore";
import { socket } from "../../../../../Services/Socket";

const Objectives = () => {

    const APPLICATION_OBJECTIVE_ID = localStorageGetter('aop-app-id');
    const OBJECTIVES = localStorageGetter('objectives-storage');
    const savedMission = localStorageGetter("mission");
    const remarks = localStorageGetter("remarks");
    const comments = localStorageGetter("all_comments");
    const aopStatus = localStorage.getItem("aop-status");

    useEffect(() => {
        console.log('remarks', remarks)
        console.log('comments', comments) //show only comments for unit 
        console.log('aopStatus', aopStatus)
    }, [remarks, comments])

    const getCommentsByApplicationId = () => {
        const commentsByApplicationId = comments?.filter((comment) => comment.application_id === APPLICATION_OBJECTIVE_ID);
        console.log(`${APPLICATION_OBJECTIVE_ID}:`, commentsByApplicationId)
        return commentsByApplicationId;
    }

    useEffect(() => {
        getCommentsByApplicationId()
    }, [comments])

    const { user } = useAuth();
    const { name, id, assignedArea } = user ?? {};

    useEffect(() => {
        if (!assignedArea?.name) return;
        socket.emit("register-user", {
            userId: id,
            name: name,
            area: assignedArea.name,
        });
    }, [assignedArea]);

    useEffect(() => {
        socket.on("editing", handleEditing);
        return () => {
            socket.off("editing"); // Clean up on unmount
        };
    }, [socket]);

    // AUTHENTICATE
    useEffect(() => {
        socket.emit("authenticate", {
            id: id,
            area: assignedArea?.name,
        });
    }, []);

    const editSignal = () => {
        socket.emit('start-edit', {
            userId: id,
            name: name,
            area: assignedArea?.name,
        })
    }

    const disconnectSignal = () => {
        socket.emit('stop-edit', {
            userId: id,
            area: assignedArea?.name,
        })
        setShow(false);
        handleCloseSnack();
    }

    const handleEditing = ({ editable, showEdit, editorName, editorId }) => {
        setDisabled(!editable);
        setShow(showEdit);
        setOpenNotify(editable ? false : true);
        setEditor(() => {
            return { editorName: editorName, editorId: editorId };
        });

        if (!editable) {
            return notify();
        }
    };

    const handleEditClick = () => {
        setEditLoad(true)
        setTimeout(() => {
            editSignal();
            setShow(true);
            setEditLoad(false)
        }, 500);
    }

    const disabledEditMode = () => {

        if (!APPLICATION_OBJECTIVE_ID) return false //create mode

        const noRemarks = !remarks || remarks.length === 0;
        const noComments = !comments || comments.length === 0;

        if (noRemarks && noComments) return true;

        return disabled;
    }

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
    const { findActivitiesByObjectiveID, activities, clearActivities, removeActivity } =
        useActivitiesHook();
    const {
        responsible_people,
        findResponsiblePeopleByActivityID,
        clearResponsiblePeople,
        removeMultipleResponsiblePersonnel,
    } = useResponsiblePeopleHook();
    const { resources, findResourcesByActivityID, clearResources, clearCart, removeItemResource } =
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
    const [openSaveMissionModal, setOpenSaveMissionModal] = useState(false);
    const [openFeedbackModal, setOpenFeedbackModal] = useState(false)
    const [openCancelRequestModal, setOpenCancelRequestModal] = useState(false)
    const [openNotify, setOpenNotify] = useState(false);
    const [editor, setEditor] = useState(null);
    const [show, setShow] = useState(false);
    const [editLoad, setEditLoad] = useState(false);
    const [disabled, setDisabled] = useState(false);



    const [authorizationPin, setAuthorizationPin] = useState(null);
    const [isDraft, setIsDraft] = useState(false);
    const [mission, setMission] = useState(savedMission ? savedMission : "");

    const activitiesCount = objectives.map((objective) => {
        return activities.filter((activity) => {
            return activity.parentId === objective.id || activity.parentId === objective.objectiveUuid
        }
        )
    });

    const notify = () => setOpenNotify(true);

    const handleCloseSnack = () => {
        setEditor(null);
        setOpenNotify(false);
    };

    // check for open modals
    useEffect(() => {
        // console.log('global isLoading', isLoading)
        // console.log('open confirm dialog', openConfirmDialog);
        // console.log('open confirm discussed dialog', openConfirmDiscussedDialog);
        // console.log('open alert success', openAlertSuccess);
        // console.log('open submit modal', openSubmitModal);
        // console.log('open save mission modal', openSaveMissionModal);
        // console.log('open feedback modal', openFeedbackModal);
        // console.log('open cancel request modal', openCancelRequestModal);
    }, [isLoading])

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

    const handleSubmit = async (is_draft) => {

        // console.log('payload', is_draft)

        // setOpenConfirmDialog(false);
        setIsLoading(true); // ✅ Set loading at the start

        const payload = {
            mission: mission,
            has_discussed: !!hasDiscussed,
            status: is_draft ? 'draft' : 'pending',
            authorization_pin: authorizationPin,
            application_objectives: buildAopPayload(),
        };

        console.log(payload)

        const responseMessages = {
            existing: {
                status: 200,
                title: "Existing AOP",
                description: "You already have an AOP application in your area."
            },
            success: {
                status: 200,
                title: `AOP for F.Y. 2026 successfully ${APPLICATION_OBJECTIVE_ID ? 'updated' : 'submitted for approval'}.`,
                isGlobal: false,
                description: APPLICATION_OBJECTIVE_ID
                    ? "Your AOP has been successfully updated."
                    : "Your AOP request has been sent to the next approving body."
            },
            error: (status, message) => ({
                status: status,
                title: "Submission failed",
                description: message || "An unexpected error occurred."
            })
        };

        try {
            const { status, message } = await new Promise((resolve) => {
                create(payload, (status, message) => {
                    resolve({ status, message });
                });
            });

            if (status === 200 && message === responseMessages.existing.description) {
                setAlertDialog(responseMessages.existing);
                return;
            }

            if (status === 200) {
                setAlertDialog(responseMessages.success);
                closeConfirmation();
                setOpenAlertSuccess(true);
            } else {
                setAlertDialog(responseMessages.error(status, message));
            }

        } catch (err) {
            console.error('Submission error:', err);
            setAlertDialog(responseMessages.error(err?.status || 500, err?.message));
        } finally {
            setIsLoading(false);
        }
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

    const handleOpenCancelRequestModal = () => {
        setOpenCancelRequestModal(true)
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
                            disabled={disabledEditMode()}
                        />
                        {
                            !APPLICATION_OBJECTIVE_ID &&
                            <ButtonComponent
                                onClick={() => {
                                    setIsDraft(true);
                                    handleSubmit(true);
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
                            disabled={disabledEditMode()}  //get the remarks and comments then check if empty, user cannot edit and also if socket detected that there is someone editing
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
                    leftButtonLabel={"Cancel"}
                    leftButtonAction={() => setOpenConfirmDiscussedDialog(false)}
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

            {/* Confirmation for cancel */}
            {openCancelRequestModal && (
                <ConfirmationModalComponent
                    leftButtonLabel={"Cancel"}
                    leftButtonAction={() => setOpenCancelRequestModal(false)}
                    rightButtonAction={() => handleCancelRequest()}
                    rightButtonLabel="Proceed"
                    isLoading={isLoading}
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
                        leftButtonLabel={"Close"}
                        leftButtonAction={() => handleNavigateToAOP()}
                        rightButtonLabel="Proceed"
                        rightButtonAction={() => handleNavigateToAOP()}
                        isLoading={isLoading}
                        noRightButton={false}
                    />
                )
            }

            <AlertDialogComponent
                leftButtonAction={() => handleClose()}
            />

            <Snackbar
                open={openNotify}
                // autoHideDuration={2000}
                onClose={handleCloseSnack}
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
