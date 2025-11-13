import React from 'react'

import {
    Grid,
} from '@mui/joy';

// Status Cards
import ObjectivesCard from "./Status/ObjectivesCard";
import ActivitiesCard from "./Status/ActivitiesCard";
import ResourcesCard from "./Status/ResourcesCard";
import ResponsiblePersonCard from "./Status/ResponsiblePersonCard";


const AOPDataSummary = ({
    aop,
    handleNavigateObjectives
}) => {
    return (
        <>
            <Grid xs={12} sm={6} >
                <ObjectivesCard
                    height={302}
                    hasFunction={true}
                    handleNavigate={handleNavigateObjectives}
                    objectiveCount={aop.counts.objectives_count} />
            </Grid>

            <Grid xs={12} sm={6}>
                <ActivitiesCard
                    height={302}
                    activitiesCount={aop.counts.activities_count}
                />
            </Grid>

            <Grid xs={12} sm={6}>
                <ResourcesCard
                    height={302}
                    resourcesCount={aop.counts.resources_count}
                />
            </Grid>

            <Grid xs={12} sm={6}>
                <ResponsiblePersonCard
                    height={302}
                    PersonsCount={aop.counts.responsible_people_count}
                />
            </Grid>
        </>
    )
}

export default AOPDataSummary