import { useEffect, useState } from 'react';

import { Stack, Divider, Typography, Breadcrumbs } from '@mui/joy';

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

import { OBJECTIVES } from '../../Data/constants';

import { useFunctionType, useObjective, useSuccessIndicator, useObjectives } from '../../Store/ObjectivesStore';

const Objectives = () => {

    const { setAlertDialog, setConfirmationModal, closeConfirmation } = useModalHook()

    const [isLoading, setIsLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isOpenObjectivesModal, setIsOpenObjectivesModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const functionType = useFunctionType()
    const objective = useObjective()
    const successIndicator = useSuccessIndicator()
    const objectives = useObjectives()

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
        console.info('You clicked a breadcrumb.');
    }

    const breadcrumbs = [
        <Typography key="3" sx={{ color: 'text.primary' }}>
            Objectives
        </Typography>,
    ];

    const handleSaveObjectives = () => {

        if (!functionType || !objective || !successIndicator) {
            alert('Please fill all the fields')
            return
        }

        const payload = {
            functionType,
            objective,
            successIndicator,
        };

        console.log("Submitted data:", payload);

        setAlertDialog({
            status: "success",
            title: `Objectives ${isEditMode ? 'Updated' : 'Created'} successfully!`,
            description: "",
        })

        handleCloseModal()
    }

    useEffect(() => {
        console.log(functionType)
        console.log(objective)
        console.log(successIndicator)
        console.log(objectives.length)
    }, [functionType, objective, successIndicator, objectives])

    const handleEdit = () => {
        setIsEditMode(true)
        setIsOpenObjectivesModal(true);
    }

    const handleOpenObjectivesModal = () => {
        setIsOpenObjectivesModal(true);
    }

    const handleCloseModal = () => {
        setIsOpenObjectivesModal(false);
        setIsEditMode(false);
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

                    <Breadcrumbs
                        separator="›"
                        aria-label="breadcrumb"
                    >
                        {breadcrumbs}
                    </Breadcrumbs>
                </Stack>

                <Typography level="body-xs" fontWeight={400}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis officiis totam quis atque voluptates similique commodi,
                </Typography>

            </Stack>

            <BoxComponent
                mt={2}
                p={2}
            >
                <Stack direction={'column'} spacing={1}>
                    <Typography fontWeight={600}>
                        {MANAGE_OBJECTIVES_HEADER}
                    </Typography>

                    <Typography level="body-xs" fontWeight={400}>
                        {MANAGE_OBJECTIVES_SUBHEADER}
                    </Typography>
                </Stack>

                <Divider sx={{ my: 1 }} />

                <Stack
                    direction={'row'}
                    spacing={1}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >

                    <SearchBarComponent
                        placeholder="search objectives"
                    />

                    <ButtonComponent
                        onClick={() => handleOpenObjectivesModal()}
                        label={"Add an Objective"}
                    // endDecorator={<Plus size={16} />}
                    // disabled={!show || disabledEditMode(APPLICATION_OBJECTIVE_ID, remarks, comments, disabled)}
                    />
                </Stack>
            </BoxComponent>


            {objectives.length === 1 || objectives.length === null ?
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
                <Stack
                    my={3}
                    direction={'row'}
                    spacing={1}
                >
                    <CardComponent
                        statusColor={null}
                        cardHeader={<CardHeader
                            handleSave={() => console.log('save')}
                            handleEdit={() => handleEdit()}
                            handleDelete={() => handleOpenDeleteModal()}
                        />}
                        cardBody={<CardBody status={false} />}
                        cardActions={<CardActions
                            handleActivities={() => console.log('activities')}
                        />}
                    />
                </Stack>
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