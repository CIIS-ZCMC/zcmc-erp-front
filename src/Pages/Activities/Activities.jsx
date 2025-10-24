import React, { useState } from 'react';

import {
    Stack,
    Typography,
    Breadcrumbs,
    Divider,
    Grid,
    Input,
    FormControl,
    FormLabel,
    Checkbox,
    Alert
} from '@mui/joy';

import { TriangleAlert } from 'lucide-react';


import TextareaComponent from '@Components/Form/TextareaComponent';
import CardComponent from '@Components/Common/Card/CardComponent';
import BoxComponent from '@Components/Common/Card/BoxComponent';
import ButtonComponent from '@Components/Common/ButtonComponent';
import ModalComponent from '@Components/Common/Dialog/ModalComponent';
import InputComponent from '@Components/Form/InputComponent';

import CardHeader from './card/CardHeader';
import CardBody from './card/CardBody';
import CardActions from './card/CardActions';

import SearchBarComponent from '@Components/SearchBarComponent';


import { ACTIVITIES } from '../../Data/constants';

const Activities = () => {

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

    const handleOpenEditModal = async () => {
        // console.log(id)
        setIsEditMode(true)
        setIsOpenActivitiesModal(true)
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
            {/* 
            <Stack
                direction={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                textAlign={"center"}
                my={2}
                height={'65vh'}
            >
                <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                    {EMPTY_STATE_TITLE}
                </Typography>

                <Typography mb={2} sx={{ fontSize: 20, fontWeight: 400 }}>
                    {ACTIVITY_CREATE_NEW}
                </Typography>

                <ButtonComponent
                    onClick={() => setIsCountModal(true)}
                    label={"Add Activity"}
                // endDecorator={<Plus size={16} />}
                />
            </Stack> */}

            <Grid mt={2} container direction="row" spacing={2} sx={{ flexGrow: 1 }}>
                {/* {applicationObjectives?.map(({ id, success_indicator, objective }) => ( */}
                <Grid
                    // key={id}
                    size={4}
                    lg={4}
                    md={6}
                    sm={12}
                >
                    <CardComponent
                        height={150}
                        statusColor={'red'}
                        cardHeader={<CardHeader
                            handleEdit={() => handleOpenEditModal()}
                        // handleDelete={() => handleOpenDeleteModal(id)}
                        />}
                        cardBody={<CardBody
                            objective={'Objective'}
                            activity={'Activity One'}
                            timeframe={`start month - end month`}
                        />}
                        cardActions={<CardActions
                            handleActivities={() => console.log('activities')}
                        />}
                    />
                </Grid>
                {/* ))} */}
            </Grid>

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
                rightButtonAction={() => console.log('activities to be added:', countActivities)}
                isLoading={isLoading}

            />

            <ModalComponent
                isOpen={isOpenActivitiesModal}
                handleClose={() => setIsOpenActivitiesModal(false)}
                title={'Edit Activity'}
                description={'Add or modify the details of this activity to align with its objective.'}
                height={700}
                minWidth={550}
                content={
                    <>
                        <Stack
                            p={1}
                        >
                            <TextareaComponent
                                label={'Activity name'}
                                placeholder="Activity name"
                            // value={name}
                            // onChange={(e) => handleChange(id, 'name', e.target.value)}
                            // onBlur={() => {
                            //     handleChange(id, 'name', name);
                            //     setEditRowId(null);
                            // }}
                            />


                            <Stack
                                mt={2}
                                gap={1}
                            >
                                <Typography>Timeframe</Typography>

                                <Stack
                                    direction={'row'}
                                    alignItems={'center'}
                                    justifyContent={'space-between'}
                                >
                                    <FormControl>
                                        <FormLabel>from</FormLabel>
                                        <Input
                                            size='sm'
                                            type='month'
                                            fullWidth={true}
                                            sx={{
                                                width: 225
                                            }}
                                        // value={startMonth}
                                        // onChange={(e) => handleChange(id, 'startMonth', e.target.value)}
                                        // onBlur={() => setEditRowId(null)}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>to</FormLabel>
                                        <Input
                                            size='sm'
                                            type='month'
                                            fullWidth
                                            sx={{
                                                width: 225
                                            }}
                                        // value={startMonth}
                                        // onChange={(e) => handleChange(id, 'startMonth', e.target.value)}
                                        // onBlur={() => setEditRowId(null)}
                                        />
                                    </FormControl>
                                </Stack>

                                <Stack
                                    mt={2}
                                    gap={1}
                                    direction={'row'}
                                    alignItems={'center'}
                                    justifyContent={'space-between'}
                                >
                                    <InputComponent
                                        type={'number'}
                                        label={'Quarter 1'}
                                        width={100}
                                    // value={countActivities}
                                    // setValue={(val) => setCountActivities(val)}
                                    />

                                    <InputComponent
                                        type={'number'}
                                        label={'Quarter 2'}
                                        width={100}
                                    // value={countActivities}
                                    // setValue={(val) => setCountActivities(val)}
                                    />

                                    <InputComponent
                                        type={'number'}
                                        label={'Quarter 3'}
                                        width={100}
                                    // value={countActivities}
                                    // setValue={(val) => setCountActivities(val)}
                                    />

                                    <InputComponent
                                        type={'number'}
                                        label={'Quarter 4'}
                                        width={100}
                                    // value={countActivities}s
                                    // setValue={(val) => setCountActivities(val)}
                                    />
                                </Stack>

                            </Stack>

                            <Stack
                                mt={5}
                            >
                                <Checkbox label="GAD related activity" />
                            </Stack>


                            <Alert
                                size='sm'
                                color="warning"
                                startDecorator={<TriangleAlert />}
                                sx={{
                                    mt: 2,
                                    p: 1,
                                    width: 460
                                }}
                            >
                                Reminder: This activity doesn’t have assigned resources or responsible persons yet. After saving, you can add them by opening the full details of this activity or through the Manage Activities page.
                            </Alert>

                        </Stack>


                    </>
                }
                hasActionButtons={true}
                rightButtonLabel={`Save activity`}
                // rightButtonAction={() => console.log('activities to be added:', countActivities)}
                isLoading={isLoading}
            />

        </>
    )
}

export default Activities