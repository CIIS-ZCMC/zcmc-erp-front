import { Fragment } from 'react'

import { useNavigate } from 'react-router-dom';
import { Stack, Typography, Grid, } from '@mui/joy'
import { ExternalLink, CloudDownload, } from "lucide-react";

import BoxComponent from '../../../Components/Common/Card/BoxComponent';
import ButtonComponent from '../../../Components/Common/ButtonComponent';

import { useAOPActions } from '../../../Hooks/AOP/AOPObjectivesHook';

import SummaryCard from './SummaryCard';

const Summary = (
    {
        aopObjectives,
        total_objectives,
        total_success_indicators,
        total_activities,
        total_gad_related,
        total_not_gad_related,
        total_cost,
        total_job_positions,
        total_areas,
        total_users,
        total_responsible_people,
        total_resources,
        aop_application_id,
    }
) => {

    const { exportAsExcel } = useAOPActions();

    const navigate = useNavigate();

    const objectivesContent = `Contains (${total_success_indicators}) success indicators in total on this request `
    const activitiesContent = ` Where (${total_gad_related}) are GAD-related and (${total_not_gad_related}) are not GAD-related on this reques`
    const resourcesContent = ` With (${total_cost}) total allocated budget`
    const responsiblePersonContent = `Includes (${total_job_positions}) job positions, (${total_areas}) areas (${total_users}) user/s in total`

    const handleExport = () => {
        exportAsExcel(aop_application_id, (status, message) => {
            // Optional: Add notification or feedback to user about export status
            console.log(`Export status: ${status}, message: ${message}`);
        });
    }

    return (
        <Fragment>
            <BoxComponent
                p={3}
            >
                <Typography sx={{ fontSize: 32, fontWeight: 600 }}>
                    Annual Operations Plan summary:
                </Typography>

                <Grid
                    container
                    columns={12}
                    gap={2}
                    direction={'row'}
                    mt={3}
                >
                    <Grid item={'true'} sm={5} md={5.8}>
                        <SummaryCard
                            title={`${total_objectives} Objectives`}
                            content={objectivesContent}
                        />
                    </Grid>

                    <Grid item={'true'} sm={5} md={5.8}>
                        <SummaryCard
                            title={`${total_activities} Activities`}
                            content={activitiesContent}
                        />
                    </Grid>

                    <Grid item={'true'} sm={5} md={5.8}>
                        <SummaryCard
                            title={`${total_resources} Resources`}
                            content={resourcesContent}
                        />
                    </Grid>

                    <Grid item={'true'} sm={5} md={5.8}>
                        <SummaryCard
                            title={`${total_responsible_people} Responsible people`}
                            content={responsiblePersonContent}
                        />
                    </Grid>
                </Grid>

                <Stack
                    mt={2}
                    direction={'row'}
                    gap={2}
                >
                    <ButtonComponent
                        label={'Export as (.XLS)'}
                        variant={'outlined'}
                        size={'sm'}
                        onClick={() => handleExport()}
                        endDecorator={<CloudDownload size={16} />}
                    />

                    <ButtonComponent
                        label={'Open request'}
                        variant={'outlined'}
                        size={'sm'}
                        onClick={() => navigate(`/aop-management`, { state: { aopAppId: aop_application_id } })}
                        endDecorator={<ExternalLink size={16} />}
                    />

                    <ButtonComponent
                        label={'Request new item'}
                        variant={'outlined'}
                        size={'sm'}
                        endDecorator={<ExternalLink size={16} />}
                    />
                </Stack>
            </BoxComponent>
        </Fragment>
    )
}


export default Summary