import React, { useEffect, useState } from 'react';

import {
    Stack,
    Typography,
    Breadcrumbs,
    Divider,
    Grid,
} from '@mui/joy';

import { useLocation, useNavigate } from 'react-router-dom';

import useModalHook from '../../Hooks/ModalHook';
import useActivitiesHook from '../../Hooks/ActivitiesHook';

import CardComponent from '@Components/Common/Card/CardComponent';
import { ThreeDotsLoader } from '@Components/Common/Loading/ThreeDotsLoader';
import BoxComponent from '@Components/Common/Card/BoxComponent';
import ButtonComponent from '@Components/Common/ButtonComponent';
import ModalComponent from '@Components/Common/Dialog/ModalComponent';
import InputComponent from '@Components/Form/InputComponent';
import SearchBarComponent from '@Components/SearchBarComponent';
import ConfirmationModalComponent from '@Components/Common/Dialog/ConfirmationModalComponent';

import ActivitiesModal from './modal/ActivitiesModal';
import ActivitiesList from './ActivitiesList';

import useActivitiesStore, { useActivitiesActions } from '../../Store/ActivitiesStore';

import { ACTIVITIES } from '../../Data/constants';

const centeredStyle = {
    direction: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    height: '65vh',
    my: 2,
}

const Activities = () => {

    const location = useLocation()
    const { objId } = location.state

    const {
        applicationActivities,
        activity,
        cost,
        startMonth,
        endMonth,
        isGadRelated,
        target
    } = useActivitiesStore();

    const { setApplicationActivities } = useActivitiesActions();

    const { getActivities, createActivity, removeActivity } = useActivitiesHook();

    const {
        setAlertDialog,
        setConfirmationModal,
        closeConfirmation
    } = useModalHook();

    const {
        MANAGE_ACTIVITIES_HEADER,
        MANAGE_ACTIVITIES_SUBHEADER,
        MODAL_TITLE,
        MODAL_DESCRIPTION,
        COUNT_LABEL,
        EMPTY_STATE_TITLE,
        ACTIVITY_CREATE_NEW
    } = ACTIVITIES;


    const [isLoading, setIsLoading] = useState(false);
    const [isCountModal, setIsCountModal] = useState(false);
    const [countActivities, setCountActivities] = useState(1);
    const [isOpenActivitiesModal, setIsOpenActivitiesModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [selectedActivityId, setSelectedActivityId] = useState(null)


    useEffect(() => {
        setIsLoading(true);

        const params = { application_objective_id: objId }

        getActivities(params, (status, message) => {
            if (!(status >= 200 && status < 300)) {
                // if status not success
                return; //Toast error
            }
            setIsLoading(false);
        })
    }, [])

    useEffect(() => {
        console.log(applicationActivities)
    }, [applicationActivities])

    const breadcrumbs = [
        <Typography key="3" sx={{ color: 'text.primary' }}>
            Objectives
        </Typography>,
    ];

    const handleOpenActivitiesModal = () => {
        setIsOpenActivitiesModal(true)
    }

    const handleCloseActivitiesModal = () => {
        setIsOpenActivitiesModal(false)
    }

    const handleOpenEditModal = async (activityId) => {
        // console.log(activityId)
        setIsEditMode(true)
        setSelectedActivityId(activityId)
        setIsOpenActivitiesModal(true)
    }

    const handleOpenCountModal = () => {
        setIsCountModal(true)
    }

    const handleSaveActivity = () => {
        console.log(activity)
        console.log(startMonth)
        console.log(endMonth)
        console.log(isGadRelated)
        console.log(target)
    }

    const handleConfirmDelete = async () => {

        if (!selectedActivityId) return

        setIsLoading(true)

        const params = { id: selectedActivityId };

        await removeActivity(params, (status, message) => {
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
            setSelectedActivityId(null);
        })


        setTimeout(() => {
            setIsLoading(false);
            setOpenDeleteModal(false)
        }, 2000);
    }

    const handleOpenDeleteModal = (activityId) => {

        setOpenDeleteModal(true)
        setSelectedActivityId(activityId)

        const data = {
            status: "warning",
            title: ` Are you sure you want to delete this activity ? `,
            description:
                "The selected activity will be removed",
        }
        setConfirmationModal(data);
    }

    const handleCountActivities = async () => {

        setIsLoading(true)

        const payload = {
            application_objective_id: objId,
            count: countActivities
        }

        try {
            await createActivity(payload, (status, message) => {
                if (status === 201) {
                    setAlertDialog({
                        status: "success",
                        title: `${message}`,
                        description: "",
                    })
                    setIsLoading(false)
                    // handleCloseModal()
                } else {
                    setAlertDialog({
                        status: "error",
                        title: message,
                        description: "Please try again later",
                    })
                    setIsLoading(false)
                    console.error(" Failed to update objectives:", message);
                }
            })
        } catch (error) {
            console.error(error)
            setAlertDialog({
                status: "error",
                title: "Unexpected Error",
                description: error.message || "Something went wrong.",
            });
        }
    }

    return (
        <>
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
            </Stack>

            <BoxComponent mt={2} p={2}>
                <Stack direction={"column"} spacing={1}>
                    <Typography fontWeight={600}>{MANAGE_ACTIVITIES_HEADER}</Typography>

                    <Typography level="body-xs" fontWeight={400}>
                        {MANAGE_ACTIVITIES_SUBHEADER}
                    </Typography>
                </Stack>

                <Divider sx={{ my: 1 }} />

                <Stack
                    direction={"row"}
                    spacing={1}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <SearchBarComponent placeholder="search activities" />

                    <ButtonComponent
                        onClick={() => setIsCountModal(true)}
                        label={"Add Activity"}
                    // endDecorator={<Plus size={16} />}
                    // disabled={!show || disabledEditMode(APPLICATION_OBJECTIVE_ID, remarks, comments, disabled)}
                    />
                </Stack>
            </BoxComponent>

            {isLoading ?
                <Stack
                    sx={centeredStyle}
                >
                    <ThreeDotsLoader />
                </Stack>
                :
                applicationActivities.length === 0 ?
                    <>
                        <Stack
                            sx={centeredStyle}
                        >
                            <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                                {EMPTY_STATE_TITLE}
                            </Typography>

                            <Typography mb={2} sx={{ fontSize: 20, fontWeight: 400 }}>
                                {ACTIVITY_CREATE_NEW}
                            </Typography>

                            <ButtonComponent
                                onClick={() => handleOpenCountModal()}
                                label={"Add Activity"}
                            // endDecorator={<Plus size={16} />}
                            />
                        </Stack>
                    </>
                    :
                    <Grid mt={2} container direction="row" spacing={2} sx={{ flexGrow: 1 }}>
                        {applicationActivities.map((activity) => (
                            <Grid
                                key={activity.id}
                                size={4}
                                lg={4}
                                md={6}
                                sm={12}
                            >
                                <ActivitiesList
                                    isLoading={isLoading}
                                    activities={applicationActivities}
                                    activity={activity}
                                    handleAdd={() => handleOpenCountModal()}
                                    handleEdit={() => handleOpenEditModal(activity.id)}
                                    handleDelete={() => handleOpenDeleteModal(activity.id)}
                                />
                            </Grid>
                        ))}
                    </Grid >
            }


            <ModalComponent
                isOpen={isCountModal}
                handleClose={() => setIsCountModal(false)}
                title={MODAL_TITLE}
                description={MODAL_DESCRIPTION}
                minWidth={500}
                content={
                    <>
                        <Stack direction={'column'} alignItems={'start'} justifyContent={'center'}>
                            {COUNT_LABEL}
                            <InputComponent
                                type={'number'}
                                width={80}
                                value={countActivities}
                                setValue={(val) => setCountActivities(val)}
                            />
                        </Stack>
                    </>
                }
                hasActionButtons={true}
                rightButtonLabel={`Save`}
                rightButtonAction={() => handleCountActivities()}
                isLoading={isLoading}

            />

            <ModalComponent
                isOpen={isOpenActivitiesModal}
                handleClose={() => setIsOpenActivitiesModal(false)}
                title={'Edit Activity'}
                description={'Add or modify the details of this activity to align with its objective.'}
                height={670}
                minWidth={550}
                content={
                    <>
                        <ActivitiesModal />
                    </>
                }
                hasActionButtons={true}
                rightButtonLabel={`Save activity`}
                rightButtonAction={() => handleSaveActivity()}
                isLoading={isLoading}
            />

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

        </>
    )
}

export default Activities