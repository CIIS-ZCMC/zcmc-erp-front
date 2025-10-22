import { useEffect, useState } from "react";

import { Stack, Divider, Typography, Breadcrumbs, Grid } from '@mui/joy';

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

import { useFunctionType, useObjective, useSuccessIndicator, useObjectives, useObjectivesActions } from '../../Store/ObjectivesStore';
import useObjectivesHook from '../../Hooks/ObjectivesHook';

const Objectives = () => {

    const { clearFields } = useObjectivesActions();
    const { setAlertDialog, setConfirmationModal, closeConfirmation } = useModalHook();
    const { getObjectives, createObjectives } = useObjectivesHook();


    const [isLoading, setIsLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isOpenObjectivesModal, setIsOpenObjectivesModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const functionType = useFunctionType()
    const objective = useObjective()
    const successIndicator = useSuccessIndicator()
    const objectives = useObjectives()

    useEffect(() => {
        setIsLoading(true);
        getObjectives((status, message) => {
            if (!(status >= 200 && status < 300)) {
                // if status not success
                return; //Toast error
            }
            setIsLoading(false);
        });
    }, [])

    useEffect(() => {
        // console.log(functionType)
        // console.log('objective id:', objective?.id)
        // console.log('succeses indicator id:', successIndicator?.id)
        console.log('objectives:', objectives)
    }, [functionType, objective, successIndicator, objectives])

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

    const handleSaveObjectives = async () => {

        // if (!functionType || !objective || !successIndicator) {
        //     alert('Please fill all the fields')
        //     return
        // }

        const payload = {
            aop_application_id: 5,
            objective_id: objective?.id,
            success_indicator_id: successIndicator?.id,
        };

        await createObjectives(payload, (status, message) => {

            console.log('status:', status);
            console.log('message:', message)

            if (status === 201) {
                console.log("Application objective created successfully:", message);
                // clearMission();
                setIsOpenObjectivesModal(false);
                console.log('submitted:', payload);
                // navigate("/aop-management");
            } else {
                console.error(" Failed to create AOP:", message);
            }
        });

        setAlertDialog({
            status: "success",
            title: `Objectives ${isEditMode ? 'Updated' : 'Created'} successfully!`,
            description: "",
        })
        handleCloseModal()
    }


    const handleEdit = () => {
        setIsEditMode(true)
        setIsOpenObjectivesModal(true);
    }

    const handleOpenObjectivesModal = () => {
        setIsOpenObjectivesModal(true);
    };

    const handleCloseModal = () => {
        setIsOpenObjectivesModal(false);
        setIsEditMode(false);
        clearFields()
    }

    const handleOpenDeleteModal = () => {
        setOpenDeleteModal(true)
        const data = {
            status: "warning",
            title: ` Are you sure you want to delete item ? `,
            description:
                "The selected item will be removed",
        };
        setConfirmationModal(data);
    }

    const handleDeleteObjective = () => {
        setOpenDeleteModal(false)
        closeConfirmation()
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
                objectives.length === 0 ?
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
                        {objectives.map(({ id, objective, success_indicator }) => (
                            <Grid size={4}>
                                <CardComponent
                                    statusColor={null}
                                    cardHeader={<CardHeader
                                        handleSave={() => console.log('save')}
                                        handleEdit={() => handleEdit()}
                                        handleDelete={() => handleOpenDeleteModal()}
                                    />}
                                    cardBody={<CardBody
                                        success_indicator={success_indicator}
                                        objective={objective}
                                        status={false}
                                    />}
                                    cardActions={<CardActions
                                        handleActivities={() => console.log('activities')}
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
                    />
                }
                hasActionButtons={true}
                rightButtonLabel={`${isEditMode ? 'Update' : 'Save'} Objective`}
                rightButtonAction={() => handleSaveObjectives()}
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
                        rightButtonAction={() => handleDeleteObjective()}
                        isLoading={isLoading}
                    />
                )
            }


        </div >
    )
}

export default Objectives
