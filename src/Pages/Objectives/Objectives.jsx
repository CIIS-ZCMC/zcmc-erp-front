import { useEffect, useState } from "react";

import { Stack, Divider, Typography, Breadcrumbs, Grid } from '@mui/joy';
import { useLocation, useNavigate } from "react-router-dom";

import { ThreeDotsLoader } from '@Components/Common/Loading/ThreeDotsLoader';

import BoxComponent from '../../Components/Common/Card/BoxComponent';
import SearchBarComponent from '../../Components/SearchBarComponent';
import ButtonComponent from '../../Components/Common/ButtonComponent';
import ModalComponent from '@Components/Common/Dialog/ModalComponent';
import ObjectivesModal from './modal/ObjectivesModal';
import CardComponent from '@Components/Common/Card/CardComponent';
import ConfirmationModalComponent from '@Components/Common/Dialog/ConfirmationModalComponent';

import useModalHook from '../../Hooks/ModalHook';

import CardHeader from './card/CardHeader';
import CardBody from './card/CardBody';
import CardActions from './card/CardActions';

import { OBJECTIVES } from "../../Data/constants";

import { useFunctionType, useObjective, useSuccessIndicator, useObjectivesActions, useApplicationObjectives, useApplicationObjective } from '../../Store/ObjectivesStore';
import useObjectivesHook from '../../Hooks/ObjectivesHook';

const Objectives = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { aopId } = location.state;

    const functionType = useFunctionType()
    const objective = useObjective()
    const successIndicator = useSuccessIndicator()
    const applicationObjectives = useApplicationObjectives();
    const applicationObjective = useApplicationObjective();

    const { clearFields } = useObjectivesActions();

    const { setAlertDialog, setConfirmationModal, closeConfirmation } = useModalHook();
    const {
        getObjectivesBySector,
        showObjective,
        createObjective,
        updateObjective,
        removeObjective
    } = useObjectivesHook();

    const [isLoading, setIsLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isOpenObjectivesModal, setIsOpenObjectivesModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedObjectiveId, setSelectedObjectiveId] = useState(null)

    useEffect(() => {
        setIsLoading(true);
        getObjectivesBySector((status, message) => {
            if (!(status >= 200 && status < 300)) {
                // if status not success
                return; //Toast error
            }
            setIsLoading(false);
        });
    }, [])

    useEffect(() => {
        // console.log('selected objective', functionType)
        // console.log(objectiveState)
        // console.log('selected objective :', objective)
        // console.log('succeses indicator id:', successIndicator?.id)
        // console.log('objective:', applicationObjective)
        // console.log('application objectives:', applicationObjectives);
    }, [functionType, objective, successIndicator, applicationObjectives])

    const {
        OBJECTIVES_EMPTY_STATE_TITLE,
        OBJECTIVES_CREATE_NEW,
        ADD_OBJECTIVE,
        EDIT_OBJECTIVE,
        ADD_OBJECTIVE_SUBHEADING,
        AOP_EMPTY_STATE_TITLE,
        AOP_CREATE_NEW_AOP,
        MANAGE_OBJECTIVES_HEADER,
        MANAGE_OBJECTIVES_SUBHEADER,
    } = OBJECTIVES

    function handleClick(event) {
        event.preventDefault();
        console.info("You clicked a breadcrumb.");
    }

    const breadcrumbs = [
        <Typography key="3" sx={{ color: 'text.primary' }}>
            Objectives
        </Typography>,
    ];

    useEffect(() => {
        console.log('aopId', aopId)
    }, [aopId])

    const handleSaveObjectives = async () => {

        setIsLoading(true)

        const payload = {
            aop_application_id: aopId,
            objective_id: objective?.id,
            success_indicator_id: successIndicator?.id,
        };

        try {
            await createObjective(payload, (status, message) => {
                if (status === 201) {
                    setAlertDialog({
                        status: "success",
                        title: `${message}`,
                        description: "",
                    })
                    setIsLoading(false)
                    handleCloseModal()
                } else {
                    setAlertDialog({
                        status: "error",
                        title: message,
                        description: "Please try again later",
                    })
                    setIsLoading(false)
                    console.error(" Failed to create objectives:", message);
                }
            });

        } catch (error) {
            console.error("Error creating objective:", error);
            setAlertDialog({
                status: "error",
                title: "Unexpected Error",
                description: error.message || "Something went wrong.",
            });
        }
    }

    const handleUpdateObjectives = async () => {

        setIsLoading(true)

        const payload = {
            objective_id: objective?.id,
            success_indicator_id: successIndicator?.id,
            // other_success_indicator_description:
        };

        const params = { id: selectedObjectiveId };

        try {
            await updateObjective(params, payload, (status, message) => {
                if (status === 200) {
                    setAlertDialog({
                        status: "success",
                        title: `${message}`,
                        description: "",
                    })
                    setIsLoading(false)
                    handleCloseModal()
                } else {
                    setAlertDialog({
                        status: "error",
                        title: message,
                        description: "Please try again later",
                    })
                    setIsLoading(false)
                    console.error(" Failed to update objectives:", message);
                }
            });

        } catch (error) {
            console.error("Error creating objective:", error);
            setAlertDialog({
                status: "error",
                title: "Unexpected Error",
                description: error.message || "Something went wrong.",
            });
        }
    }


    const handleOpenEditModal = async (objectiveId) => {
        // setIsLoading(true)
        setSelectedObjectiveId(objectiveId)

        const params = { id: objectiveId }

        await showObjective(params, (status, message) => {
            if (!(status >= 200 && status < 300)) {
                // if status not success
                return; //Toast error
            }
            // setIsLoading(false);
        });

        setIsEditMode(true)
        setIsOpenObjectivesModal(true);
    }

    const handleConfirmDelete = async () => {
        if (!selectedObjectiveId) return;

        setIsLoading(true)

        const params = { id: selectedObjectiveId };

        await removeObjective(params, (status, message) => {

            const isSuccess = status === 200 || status === true;

            setAlertDialog({
                status: isSuccess ? "success" : "error",
                title: message,
                description: isSuccess ? "" : "Please try again later.",
            });

            if (!isSuccess) {
                console.error("Failed to delete objective:", message);
            }

            setIsLoading(false);
            setOpenDeleteModal(false);
            setSelectedObjectiveId(null);
        });
    };

    const handleOpenDeleteModal = (objectiveId) => {
        setOpenDeleteModal(true)
        setSelectedObjectiveId(objectiveId)

        const data = {
            status: "warning",
            title: ` Are you sure you want to delete this objective ? `,
            description:
                "The selected objective will be removed",
        };

        setConfirmationModal(data);
    }

    const handleOpenObjectivesModal = () => {
        setIsOpenObjectivesModal(true);
    };

    const handleCloseModal = () => {
        setIsOpenObjectivesModal(false);
        setIsEditMode(false);
        clearFields()
    }

    return (
        <div>
            <Stack spacing={2}>
                <Stack
                    direction={'row'}
                    alignItems={'center'}
                    alignContent={'start'}
                >
                    <Typography
                        level="h2"
                        fontWeight={700}
                    >
                        AOP #2025-0031 for Fiscal Year 2026
                    </Typography>

                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                        {breadcrumbs}
                    </Breadcrumbs>
                </Stack>

                <Typography level="body-xs" fontWeight={400}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis
                    officiis totam quis atque voluptates similique commodi,
                </Typography>
            </Stack>

            <BoxComponent mt={2} p={2}>
                <Stack direction={"column"} spacing={1}>
                    <Typography fontWeight={600}>{MANAGE_OBJECTIVES_HEADER}</Typography>

                    <Typography level="body-xs" fontWeight={400}>
                        {MANAGE_OBJECTIVES_SUBHEADER}
                    </Typography>
                </Stack>

                <Divider sx={{ my: 1 }} />

                <Stack
                    direction={"row"}
                    spacing={1}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <SearchBarComponent placeholder="search objectives" />

                    <ButtonComponent
                        onClick={() => handleOpenObjectivesModal()}
                        label={"Add an Objective"}
                    // endDecorator={<Plus size={16} />}
                    // disabled={!show || disabledEditMode(APPLICATION_OBJECTIVE_ID, remarks, comments, disabled)}
                    />
                </Stack>
            </BoxComponent>


            {isLoading ?
                <Stack
                    direction={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    textAlign={"center"}
                    my={2}
                    height={'65vh'}
                >
                    <ThreeDotsLoader />
                </Stack>
                :
                applicationObjectives.length === 0 ?
                    <>
                        <Stack
                            direction={"column"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            textAlign={"center"}
                            my={2}
                            height={'65vh'}
                        >
                            <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                                {OBJECTIVES_EMPTY_STATE_TITLE}
                            </Typography>

                            <Typography mb={2} sx={{ fontSize: 20, fontWeight: 400 }}>
                                {OBJECTIVES_CREATE_NEW}
                            </Typography>

                            <ButtonComponent
                                onClick={() => handleOpenObjectivesModal()}
                                label={"Add an Objective"}
                            // endDecorator={<Plus size={16} />}
                            />
                        </Stack>
                    </>
                    :
                    <Grid mt={2} container direction="row" spacing={2} sx={{ flexGrow: 1 }}>
                        {applicationObjectives?.map(({ id, success_indicator, objective, activities_count }) => (
                            <Grid
                                key={id}
                                size={4}
                                lg={4}
                                md={6}
                                sm={12}
                            >
                                <CardComponent
                                    statusColor={null}
                                    cardHeader={<CardHeader
                                        handleSave={() => console.log('save')}
                                        handleEdit={() => handleOpenEditModal(id)}
                                        handleDelete={() => handleOpenDeleteModal(id)}
                                    />}
                                    cardBody={<CardBody
                                        success_indicator={success_indicator}
                                        objective={objective}
                                        status={false}
                                    />}
                                    cardActions={<CardActions
                                        count={activities_count}
                                        handleActivities={() => navigate(`/dashboard/objectives/${aopId}/activities/${id}`, {
                                            state: { objId: id }
                                        })}
                                    />}
                                />
                            </Grid>
                        ))}
                    </Grid>
            }


            {/* edit and add objectives modal */}
            <ModalComponent
                isOpen={isOpenObjectivesModal}
                handleClose={handleCloseModal}
                title={isEditMode ? EDIT_OBJECTIVE : ADD_OBJECTIVE}
                description={ADD_OBJECTIVE_SUBHEADING}
                minWidth={500}
                content={
                    <ObjectivesModal
                        isEditMode={isEditMode}
                        functionType={functionType}
                        objective={objective}
                        successIndicator={successIndicator}
                        applicationObjective={applicationObjective}
                    />
                }
                hasActionButtons={true}
                rightButtonLabel={`${isEditMode ? 'Update' : 'Save'} Objective`}
                rightButtonAction={() => isEditMode ? handleUpdateObjectives() : handleSaveObjectives()}
                isLoading={isLoading}
            />

            {/* Delete Objectives Modal */}
            {
                openDeleteModal && (
                    <ConfirmationModalComponent
                        leftButtonLabel="Cancel"
                        leftButtonAction={() => {
                            setOpenDeleteModal(false)
                            closeConfirmation()
                        }}
                        rightButtonLabel="Delete"
                        rightButtonAction={() => handleConfirmDelete()}
                        isLoading={isLoading}
                    />
                )
            }


        </div >
    )
}

export default Objectives
