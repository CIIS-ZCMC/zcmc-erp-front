import React, { useEffect } from 'react'

import { Stack, Typography, Breadcrumbs, Grid, } from '@mui/joy';

import { useAop } from '../../../Store/AOPStore'

import BoxComponent from '@Components/Common/Card/BoxComponent';
import AccordionComponent from '@Components/Common/AccordionComponent';
import CardComponent from '@Components/Common/Card/CardComponent';
import ButtonComponent from '@Components/Common/ButtonComponent';

import Summary from './Summary/Summary';
import AccordionSummary from './accordion/Objectives/AccordionSummary';
import AccordionDetails from './accordion/Objectives/AccordionDetails';

import CardHeader from './Summary/Card/CardHeader';
import CardBody from './Summary/Card/CardBody';
import CardActions from './Summary/Card/CardActions';

import { AOP_SUMMARY } from '../../../Data/constants';

const AOPSummary = () => {

    const aop = useAop();

    useEffect(() => {
        console.log(aop)
    }, [aop])

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

    const { counts, application_objectives } = aop;

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
    } = counts

    const applicationsObjectives = application_objectives;

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
                    cardActions={<CardActions />}
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
                                {applicationsObjectives.map(({ objective, counts, activities }, index) => {

                                    const { code } = objective
                                    const { activities_count, total_cost } = counts

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
                                                <AccordionDetails
                                                    activities={activities}
                                                />
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
                                    label={'Submit AOP for Review'}
                                    size={'lg'}
                                    onClick={() => console.log('working')}
                                />
                            </Stack>

                        </Stack>
                    </Stack>
                </BoxComponent>

            </Stack>
        </>
    )
}

export default AOPSummary