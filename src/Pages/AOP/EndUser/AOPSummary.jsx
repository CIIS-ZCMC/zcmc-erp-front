import React, { Fragment, useEffect, useState } from 'react'

import { Stack, Typography, Breadcrumbs, Grid, Divider, Box } from '@mui/joy';
import { useNavigate } from 'react-router-dom';

import { useAop } from '../../../Store/AOPStore'

import BoxComponent from '@Components/Common/Card/BoxComponent';
import AccordionComponent from '@Components/Common/AccordionComponent';
import CardComponent from '@Components/Common/Card/CardComponent';
import ButtonComponent from '@Components/Common/ButtonComponent';
import ConfirmationModalComponent from '@Components/Common/Dialog/ConfirmationModalComponent';
import AlertDialogComponent from '@Components/Common/Dialog/AlertDialogComponent';

import Summary from './Summary/Summary';
import AccordionSummary from './accordion/Objectives/AccordionSummary';
import AccordionDetails from './accordion/Objectives/AccordionDetails';

import CardHeader from './Summary/Card/CardHeader';
import CardBody from './Summary/Card/CardBody';
import CardActions from './Summary/Card/CardActions';

import useModalHook from '../../../Hooks/ModalHook';
import useAOPHook from '../../../Hooks/AOP/AOPHook';

import { AOP_SUMMARY, AOP_CONFRIM_DATA } from '../../../Data/constants';

const AOPSummary = () => {

    const navigate = useNavigate()

    const aop = useAop();

    const [pin, setPin] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const { updateAOP } = useAOPHook()
    const { setAlertDialog, setConfirmationModal, closeConfirmation, closeAlertDialog } = useModalHook();

    // useEffect(() => {
    //     console.log(aop)
    // }, [aop])

    const {
        PAGE_TITLE,
        PAGE_REVIEW,
        SUMMARY_TITLE,
        SUMMARY_FOOTER_TITLE,
        SUMMARY_FOOTER_CONTENT
    } = AOP_SUMMARY;

    const breadcrumbs = [
        <Typography key="3" sx={{ color: 'text.primary' }}>
            Submission of AOP
        </Typography>,
    ];

    const { id, counts, application_objectives, date_prepared, date_today, prepared_by_sector, year, status } = aop;

    // get counts related data from aop 
    const {
        activities_count,
        gad_activities_count,
        non_gad_activities_count,
        objectives_count,
        resources_count,
        responsible_people_count,
        total_cost,
        unified_success_indicators_count,
        users_only,
        designations_only,
    } = counts

    const applicationsObjectives = application_objectives;

    const handleOpenSubmitAopModal = () => {

        const data = {
            status: "success",
            title: `Official Submission Confirmation`,
            description:
                `You are about to officially create PMMP for Fiscal Year ${year}.`,
        };
        setConfirmationModal(data)
    }

    const handleConfirm = () => {
        setIsLoading(true);
        setTimeout(() => {
            navigate('/aop')
            closeAlertDialog()
            setIsLoading(false);
        }, 2000)
    }

    const handleSubmitAop = async () => {

        setIsLoading(true)

        const params = { id }

        const payload = {
            status_id: 2,
            authorization_pin: pin,
        }

        // console.log(payload)

        try {
            await updateAOP(params, payload, (status, message) => {
                if (status === 200) {
                    const data = {
                        status,
                        title: `AOP For F.Y. ${year} ${message}`,
                        isGlobal: false,
                        description: '',
                    };
                    setAlertDialog(data);
                    setIsLoading(false)
                } else if (status === 422) {
                    // console.log(message)
                    const {
                        statusMessage,
                        activities_without_resources,
                        activities_without_responsible_people,
                        activities_without_target,
                        objectives_without_activities,
                    } = message

                    const MISSING_DATA_SECTIONS = [
                        {
                            title: "These activities do not contain any resources:",
                            data: activities_without_resources,
                        },
                        {
                            title: "These activities do not contain any responsible people:",
                            data: activities_without_responsible_people,
                        },
                        {
                            title: "These activities do not contain any target quarter:",
                            data: activities_without_target,
                        },
                    ];

                    const data = {
                        status: status,
                        title: statusMessage,
                        description: <>
                            {objectives_without_activities && <>
                                <Typography
                                    level="title-sm"
                                >
                                    These objectives do not contain any activities :
                                </Typography>
                                {
                                    objectives_without_activities.map((objective, idx) => (
                                        <Typography
                                            key={idx}
                                            level="body-xs"
                                        >
                                            {objective}
                                        </Typography>
                                    ))
                                }
                            </>}

                            <Divider
                                sx={{
                                    my: 1
                                }}
                            />

                            {MISSING_DATA_SECTIONS.map(({ title, data }, idx) =>
                                data?.length > 0 ? (
                                    <Fragment
                                        key={idx}
                                    >
                                        <Typography
                                            level="title-sm"
                                        >
                                            {title}
                                        </Typography>

                                        <Box
                                            display="flex"
                                            flexWrap="wrap"
                                            gap={1}
                                            sx={{
                                                maxWidth: "100%",
                                                overflowX: "hidden",
                                            }}
                                        >
                                            {data.map(({ objective, activities }, i) => (
                                                <>
                                                    {
                                                        activities.map((activity) => (
                                                            <Typography
                                                                key={i}
                                                                level="body-xs"
                                                                sx={{
                                                                    flex: "0 1 auto",
                                                                    bgcolor: "#F5F5F5",
                                                                    borderRadius: "8px",
                                                                    px: 1.5,
                                                                    py: 0.5,
                                                                    whiteSpace: "nowrap",
                                                                }}
                                                            >
                                                                {activity},
                                                            </Typography>
                                                        ))
                                                    }
                                                    <Typography
                                                        level="body-xs"
                                                    >
                                                        From objective: {objective}
                                                    </Typography>
                                                </>
                                            ))}
                                        </Box>

                                        <Divider
                                            sx={{
                                                my: 1
                                            }}
                                        />

                                    </Fragment>
                                ) : null
                            )}
                        </>
                    }

                    setAlertDialog(data)
                    setIsLoading(false)
                }
                else {
                    setAlertDialog({
                        status: "error",
                        title: message,
                        description: '',
                    })
                    setIsLoading(false)
                    console.error(" Failed to update activity:", message);
                }
            })
        } catch (error) {
            console.error("Error updating AOP:", error);
            setAlertDialog({
                status: "error",
                title: "Unexpected Error",
                description: error.message || "Something went wrong.",
            });
        }
    }

    return (
        <>
            <Stack
                spacing={1}
                pb={5}
            >
                <Stack
                    direction={'row'}
                    alignItems={'center'}
                    alignContent={'start'}
                >
                    <Typography
                        level="h2"
                        fontWeight={700}
                    >
                        {PAGE_TITLE}
                    </Typography>

                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                        {breadcrumbs}
                    </Breadcrumbs>
                </Stack>

                <Typography
                    level="body-md"
                    fontWeight={400}
                    width={1075}
                >
                    {PAGE_REVIEW}
                </Typography>

                <CardComponent
                    statusColor={'blue'}
                    justifyContentHeader={'flex-start'}
                    justifyContentActions={'flex-start'}
                    direction={'row'}
                    cardHeader={<CardHeader />}
                    cardBody={<CardBody />}
                    cardActions={<CardActions
                        datePrepared={date_prepared}
                        dateToday={date_today}
                        PreparedBySector={prepared_by_sector}
                    />}
                />

                <Summary
                    hasTotalCost={true}
                    activitiesCount={activities_count}
                    gadActivitiesCount={gad_activities_count}
                    nonGadActivitiesCount={non_gad_activities_count}
                    objectivesCount={objectives_count}
                    resourcesCount={resources_count}
                    responsiblePeopleCount={responsible_people_count}
                    totalCost={total_cost}
                    successIndicatorCount={unified_success_indicators_count}
                    usersCount={users_only}
                    designationCount={designations_only}
                />

                <BoxComponent>
                    <Grid
                        xs={12}
                        bgcolor="#006599"
                        sx={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
                        p={2}
                        mb={1}
                    >
                        <Grid xs={12}>
                            <Typography textColor={'white'}>
                                {SUMMARY_TITLE}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid
                        container
                    >
                        <Grid xs={12}>
                            <BoxComponent>
                                {/* map here */}
                                {applicationsObjectives?.map(({ objective, counts, activities }, index) => {

                                    const { code } = objective;
                                    const { activities_count, total_cost } = counts;

                                    const objectiveIndex = index + 1

                                    return <>
                                        <AccordionComponent
                                            defaultExpanded={false}
                                            accordionSummary={
                                                <>
                                                    <AccordionSummary
                                                        index={objectiveIndex}
                                                        objectiveName={code}
                                                        activitiesCount={activities_count}
                                                        cost={total_cost}
                                                    />
                                                </>
                                            }
                                            accordionDetails={
                                                <>
                                                    {activities.length === 0 &&
                                                        <Typography
                                                            p={4}
                                                            textAlign={'center'}
                                                            level='title-md'
                                                        >
                                                            There are no activities on this objective
                                                        </Typography>}
                                                    <AccordionDetails
                                                        activities={activities}
                                                    />
                                                </>
                                            }
                                        />
                                    </>

                                })}
                            </BoxComponent>

                        </Grid>
                    </Grid>
                </BoxComponent>

                <BoxComponent>
                    <Stack
                        p={2}
                        mb={2}
                    >
                        <Stack>
                            <Typography level="title-md">
                                {SUMMARY_FOOTER_TITLE}
                            </Typography>

                            <Stack
                                mt={2}
                                direction={'row'}
                                alignItems={'center'}
                                justifyContent={'space-between'}
                            >
                                <Typography level="body-sm" width={1000}>
                                    {SUMMARY_FOOTER_CONTENT}
                                </Typography>

                                <ButtonComponent
                                    label={status.id === 6 ? 'Resubmit PPMP' : 'Create PPMP'}
                                    size={'lg'}
                                    onClick={() => handleOpenSubmitAopModal()}
                                />
                            </Stack>

                        </Stack>
                    </Stack>
                </BoxComponent>
            </Stack>

            <ConfirmationModalComponent
                withAuthPin
                content={
                    <>
                        <BoxComponent>
                            <Stack
                                p={2}
                                spacing={1}
                            >
                                <Typography level="title-md">
                                    Please confirm the following:
                                </Typography>

                                {AOP_CONFRIM_DATA.map(({ title, icon }) => (
                                    <Stack
                                        direction={'row'}
                                        alignItems={'center'}
                                        spacing={1}
                                    >
                                        {icon}
                                        <Typography level="body-sm">
                                            {title}
                                        </Typography>
                                    </Stack>
                                ))}
                            </Stack>
                        </BoxComponent>
                    </>
                }
                leftButtonLabel='Cancel'
                leftButtonAction={() => closeConfirmation()}
                rightButtonLabel={status.id === 6 ? 'Resubmit' : 'Submit'}
                rightButtonAction={() => handleSubmitAop()}
                setAuthPin={setPin}
                isLoading={isLoading}
            />

            <AlertDialogComponent
                leftButtonAction={() => handleConfirm()}
                rightButtonAction={() => handleConfirm()}
                isLoading={isLoading}
                noRightButton={false}
            />

        </>
    )
}

export default AOPSummary