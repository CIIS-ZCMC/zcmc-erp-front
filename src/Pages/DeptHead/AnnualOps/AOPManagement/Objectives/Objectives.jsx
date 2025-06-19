import { Fragment, useEffect, useState } from "react";

import { useNavigate, Outlet } from "react-router-dom";
import { Stack, Link, Checkbox } from "@mui/joy";
import { Plus, ExternalLink } from "lucide-react";
import { v4 as uuid } from "uuid";

//custom components
import { ThreeDotsLoader } from "../../../../../Components/Common/Loading/ThreeDotsLoader";
import BoxComponent from "../../../../../Components/Common/Card/BoxComponent";
import AlertDialogComponent from "../../../../../Components/Common/Dialog/AlertDialogComponent";
import ButtonComponent from "../../../../../Components/Common/ButtonComponent";
import ContainerComponent from "../../../../../Components/Common/ContainerComponent";
import EditableTableComponent from "../../../../../Components/Common/Table/EditableTableComponent";
import ModalComponent from "../../../../../Components/Common/Dialog/ModalComponent";
import ConfirmationModalComponent from "../../../../../Components/Common/Dialog/ConfirmationModalComponent";
import TextareaComponent from "../../../../../Components/Form/TextareaComponent";
import ObjectivesTable from "./ObjectivesTable";
import { FeedbackContent } from "../../../../PlanningOps/Approval/Contents/FeedbackContent";

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

const Objectives = () => {

    const AOP_APPLICATION_ID = localStorageGetter('aop-app-id');
    const savedMission = localStorageGetter("mission");

    useEffect(() => {
        console.log(savedMission)
    }, [savedMission])

    const { create, updateAOP, getSingleAOP } = useAOPActions();

    const { aopObjectives, deleteObjective } = useAOPObjectivesHooks();
    const { function_types, getFunctionType } = useFunctionTypeHook();

    const {
        objectives,
        otherObjective,
        otherSuccessIndicator,
        hasDiscussed,
        addObjective,
        updateObjectiveField,
        clearObjectives,
        setIsDiscussed,
        setObjectives,
    } = useObjectivesHook();
    const { findActivitiesByObjectiveID, activities, clearActivities, setActivities } =
        useActivitiesHook();
    const {
        responsible_people,
        findResponsiblePeopleByActivityID,
        clearResponsiblePeople,
        setResponsiblePeople
    } = useResponsiblePeopleHook();
    const { resources, findResourcesByActivityID, clearResources, setResources } =
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
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openConfirmDiscussedDialog, setOpenConfirmDiscussedDialog] =
        useState(false);
    const [openSubmitModal, setOpenSubmitModal] = useState(false);
    const [openSaveMissionModal, setOpenSaveMissionModal] = useState(false);
    const [authorizationPin, setAuthorizationPin] = useState(null);
    const [isDraft, setIsDraft] = useState(false);

    const [mission, setMission] = useState(savedMission ? savedMission : "");

    const [openFeedbackModal, setOpenFeedbackModal] = useState(false)
    const [isRemarksLoading, setIsRemarksLoading] = useState(true);

    const activitiesCount = objectives.map((objective) =>
        activities.filter((activity) => activity.parentId === objective.id)
    );

    useEffect(() => {
        if (AOP_APPLICATION_ID) {
            setIsLoading(true);
            getSingleAOP(AOP_APPLICATION_ID, (status, message) => {
                setIsLoading(false)
                if (!(status >= 200 && status < 300)) {
                    return
                }
            })
        }
    }, []);

    useEffect(() => {
        const params = { with_sub_data: 1 };
        getFunctionType(params, (status, message) => {
            if (!(status >= 200 && status < 300)) {
                // if status not success
                return; //Toast error
            }
            setIsLoading(false);
        });
    }, [isLoading]);

    // check pag walang objectives then add default objective
    useEffect(() => {
        console.log(objectives)

        if (objectives?.length === 0) {
            addObjective();
        }
    }, [objectives, addObjective]);

    // formatted objectives
    const formattedObjectives = aopObjectives.application_objectives?.map((
        { function_type, objective, success_indicator, objective_uuid }, index) => ({
            id: uuid(),
            rowId: index + 1,
            functionType: function_type,
            objective: objective,
            successIndicator: success_indicator,
            objectiveUuid: objective_uuid,
        })
    );

    // get flat activities
    const flatActivities =
        aopObjectives.application_objectives?.flatMap((data) =>
            data.activity.map((activity) => ({
                ...activity,
                objectiveUuid: data.objective_uuid,
            }))
        ) || [];

    // formatted activities
    const formattedActivities = flatActivities.map(
        (
            {
                activity_uuid,
                name,
                is_gad_related,
                cost,
                start_month,
                end_month,
                target,
                objectiveUuid,
            },
            index
        ) => ({
            id: activity_uuid ? activity_uuid : uuid(),
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

    //get item resourcese
    const flatResources =
        aopObjectives.application_objectives?.flatMap((data) =>
            data.activity.flatMap((item) => item.resources)
        ) || [];

    // formatted resources
    const formattedResources = flatResources?.map((resource, index) => ({
        id: uuid(),
        item_id: resource.item?.id,
        parentId: resource.item.parentId,
        rowId: index + 1,
        name: resource.item?.name,
        quantity: resource.quantity,
        individualPrice: resource.item?.estimated_budget,
        totalCost: Number(
            (resource.item?.estimated_budget * resource.quantity).toFixed(2)
        ),
        expenseClass: resource.expense_class,
        purchaseTypeId: resource.purchase_type,
    }));

    const flatResponsiblePeople = aopObjectives.application_objectives?.flatMap(
        (data) => data.activity.flatMap((item) => item.responsible_people)
    );

    const formattedResponsiblePeople = flatResponsiblePeople?.map(
        (responsible) => ({
            activityId: responsible.activity_uuid,
            users: responsible.users,
            designations: responsible.designations,
            areas: responsible.areas,
        })
    );

    useEffect(() => {
        setObjectives(formattedObjectives ? formattedObjectives : []);
        setActivities(formattedActivities ? formattedActivities : []);
        setResources(formattedResources ? formattedResources : []);
        setResponsiblePeople(
            formattedResponsiblePeople ? formattedResponsiblePeople : []
        );
    }, [aopObjectives])

    function buildAOP() {
        const objectiveData = objectives?.map((item) => {
            const activities = findActivitiesByObjectiveID(item.id);
            const activitiesWithResourceAndResponsiblePeople = activities.map(
                (act) => {
                    const {
                        parentId,
                        id,
                        startMonth,
                        endMonth,
                        target,
                        isGadRelated,
                        ...actData
                    } = act;
                    const resources = findResourcesByActivityID(act.id);
                    const responsible_people = findResponsiblePeopleByActivityID(act.id);

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
                        resources: resources,
                        responsible_people: responsible_people,
                    };
                }
            );

            return {
                objective_id: item.objective.id,
                success_indicator_id: item.successIndicator.id,
                others_objective: otherObjective,
                other_success_indicator: otherSuccessIndicator,
                activities: activitiesWithResourceAndResponsiblePeople,
            };
        });

        return objectiveData;
    }

    const handleSubmitAlertSuccess = () => {
        alert('navigating....');
        window.location.href = "/aop";
        closeAlertDialog()
    }

    const clearLocalStorage = () => {
        //set objectives, activities, resources into empty state then clear localStorrage
        clearObjectives();
        clearActivities();
        clearResponsiblePeople();
        clearResources();
    };

    const handleConfirmationModal = () => {
        setOpenConfirmDialog(true);
        const data = {
            status: 200,
            title: CONFIRMATION_CONSTANTS.ALERT_SUBMITTION_TITLE,
            description: CONFIRMATION_CONSTANTS.ALERT_SUBMITTION_DESCRIPTION,
        };
        setConfirmationModal(data);
    };

    const handleDiscussedConfirmationModal = () => {
        setOpenConfirmDiscussedDialog(true);

        const data = {
            status: "warning",
            title: CONFIRMATION_CONSTANTS.ALERT_HASDISCUSSED_TITLE,
            description: CONFIRMATION_CONSTANTS.ALERT_HASDISCUSSED_DESCRIPTION,
        };

        setConfirmationModal(data);
    };

    const proceed = () => {
        handleConfirmationModal();
    };

    const handleSubmit = (isDraft) => {
        setIsLoading(true);

        const payload = {
            mission: mission,
            has_discussed: !!hasDiscussed, // boolean explicitly
            status: isDraft,
            authorization_pin: authorizationPin,
            application_objectives: buildAOP(),
        };

        // Determine which action to take (update or create)
        const submissionAction = AOP_APPLICATION_ID ? updateAOP : create;

        submissionAction(payload, AOP_APPLICATION_ID, (status, message) => {
            setIsLoading(false);

            // Common response handler for both create and update
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

            // Handle existing AOP case
            if (status === 200 && message === responseMessages.existing.description) {
                setAlertDialog(responseMessages.existing);
                return;
            }

            // Handle success case
            if (status === 200) {
                setOpenSubmitModal(false);
                clearLocalStorage();
                setMission("");
                setAlertDialog(responseMessages.success);
                return;
            }

            // Handle failure case
            setAlertDialog(responseMessages.error);
        });
    };

    // handle save mission
    const handleSaveMission = () => {
        let data = {};

        data = {
            status: 200,
            title: AOP_APPLICATION_ID ? "Mission updated successfully" : "Mission created successfully!",
            description: "",
        };
        setOpenSaveMissionModal(false);
        setAlertDialog(data);

        // Save to local storage
        localStorage.setItem("mission", JSON.stringify(mission));
    };

    const handleOpenDialog = () => {
        setOpenSaveMissionModal(true);
    };

    const handleCloseDialog = () => {
        setOpenSaveMissionModal(false);
        // setMission('')
    };

    const handleCancelRequest = () => {
        {
            clearLocalStorage();
            setMission("");
            navigate("/aop");
        }
    };

    const handleViewFeedback = () => {
        setOpenFeedbackModal(true);
        setIsRemarksLoading(true);

        const fetch = () => {
            // if (!isDivisionHead || !isMCC) {
            getCommentsByApplication(AOP_APPLICATION_ID, () => { });
            // }

            getRemarksByApplication(AOP_APPLICATION_ID, () => {
                setTimeout(() => setIsRemarksLoading(false), 1000);
            });
        };

        Promise.all(fetch())
            .then(() => {
                setIsRemarksLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching comments or remarks:", error);
                setIsRemarksLoading(false);
            });

    }

    return (
        <Fragment>
            <ContainerComponent
                title={AOP_CONSTANTS.MANAGE_OBJECTIVES_HEADER}
                description={AOP_CONSTANTS.MANAGE_OBJECTIVES_SUBHEADER}
                actions={
                    <Stack direction={"row"} gap={1}>

                        {
                            AOP_APPLICATION_ID &&
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
                            !AOP_APPLICATION_ID &&
                            <ButtonComponent
                                onClick={() => {
                                    setIsDraft(true);
                                    handleSubmit("draft");
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
                                        {AOP_APPLICATION_ID ? 'Update Mission' : ' Create Mission'}
                                        <ExternalLink size={16} />
                                    </Stack>
                                </Link>
                            }
                            tableRow={
                                <ObjectivesTable
                                    rows={objectives}
                                    deleteRow={deleteObjective}
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
                                disabled={
                                    !mission ||
                                    resources.length === 0 ||
                                    responsible_people.length === 0
                                }
                                onClick={() => handleDiscussedConfirmationModal()}
                            />
                        </Stack>
                    </Fragment>
                }
            </ContainerComponent>

            {/* Create Mission Modal */}
            <ModalComponent
                isOpen={openSaveMissionModal}
                handleClose={handleCloseDialog}
                title={AOP_APPLICATION_ID ? 'Update mission' : 'Create mission'}
                description={`Define the core purpose and primary focus of the organization's operational efforts for the upcoming fiscal year. This statement should guide the development and execution of the annual plan.`}
                content={
                    <>
                        <TextareaComponent
                            // label={'Mission'}
                            placeholder={"Please insert mission content here"}
                            value={mission}
                            onChange={(e) => setMission(e.target.value)}
                        />
                    </>
                }
                hasActionButtons={true}
                rightButtonLabel={AOP_APPLICATION_ID ? 'Update' : "Save"}
                rightButtonAction={() => handleSaveMission()}
            />

            {openConfirmDialog && (
                <ConfirmationModalComponent
                    leftButtonlabel={"Back to editor"}
                    rightButtonAction={() => handleSubmit("pending")}
                    withAuthPin
                    rightButtonDisabled={!authorizationPin}
                    setAuthPin={setAuthorizationPin}
                    isLoading={isLoading}
                />
            )}

            {/* Confirmation modal to proceed */}
            {openConfirmDiscussedDialog && (
                <ConfirmationModalComponent
                    leftButtonLabel={"Back"}
                    rightButtonAction={() => proceed(200)}
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

            <AlertDialogComponent
                leftButtonLabel="'confirm"
                leftButtonAction={() => handleSubmitAlertSuccess()}
            />

            <FeedbackContent
                openFeedbackModal={openFeedbackModal}
                setOpenFeedbackModal={setOpenFeedbackModal}
                isLoading={isRemarksLoading}
            />

            <Outlet />
        </Fragment>

    );
};

export default Objectives;
