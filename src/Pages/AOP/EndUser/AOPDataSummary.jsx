import React, { useEffect } from 'react'

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

    const {
        objectives_count,
        activities_count,
        resources_count,
        responsible_people_count,
        unified_success_indicators_count,
        gad_activities_count,
        non_gad_activities_count,
        total_cost,
        users_only,
        designations_only,
    } = aop.counts;

    return (
        <>
            <Grid xs={12} sm={6} >
                <ObjectivesCard
                    height={302}
                    hasFunction={true}
                    handleNavigate={handleNavigateObjectives}
                    successIndicatorCount={unified_success_indicators_count}
                    objectiveCount={objectives_count} />
            </Grid>

            <Grid xs={12} sm={6}>
                <ActivitiesCard
                    height={302}
                    activitiesCount={activities_count}
                    gadActivitiesCount={gad_activities_count}
                    nonGadActivitiesCount={non_gad_activities_count}
                />
            </Grid>

            <Grid xs={12} sm={6}>
                <ResourcesCard
                    totalCost={total_cost}
                    height={302}
                    resourcesCount={resources_count}
                />
            </Grid>

            <Grid xs={12} sm={6}>
                <ResponsiblePersonCard
                    height={302}
                    usersCount={users_only}
                    designationCount={designations_only}
                    PersonsCount={responsible_people_count}
                />
            </Grid>
        </>
    )
}

export default AOPDataSummary