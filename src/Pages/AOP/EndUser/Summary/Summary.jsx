import React from 'react';

import { Grid } from '@mui/joy';

import ObjectivesCard from '../Status/ObjectivesCard';
import ActivitiesCard from '../Status/ActivitiesCard';
import ResourcesCard from '../Status/ResourcesCard';
import ResponsiblePersonCard from '../Status/ResponsiblePersonCard';
import CostCard from '../Status/CostCard';

const Summary = ({
    hasTotalCost = false,
    activitiesCount,
    objectivesCount,
    resourcesCount,
    gadActivitiesCount,
    nonGadActivitiesCount,
    responsiblePeopleCount,
    totalCost,
    successIndicatorCount,
    usersCount,
    designationCount,
}) => {
    return (
        <>
            <Grid
                container
                spacing={1}
            >
                <Grid xs={hasTotalCost ? 2.4 : 3} >
                    <ObjectivesCard
                        hasFunction={false}
                        height={285}
                        objectiveCount={objectivesCount}
                        successIndicatorCount={successIndicatorCount}
                    />
                </Grid>

                <Grid xs={hasTotalCost ? 2.4 : 3}>
                    <ActivitiesCard
                        height={285}
                        activitiesCount={activitiesCount}
                        gadActivitiesCount={gadActivitiesCount}
                        nonGadActivitiesCount={nonGadActivitiesCount}
                    />
                </Grid>

                <Grid xs={hasTotalCost ? 2.4 : 3}>
                    <ResourcesCard
                        height={285}
                        resourcesCount={resourcesCount}
                        totalCost={totalCost}
                    />
                </Grid>

                <Grid xs={hasTotalCost ? 2.4 : 3}>
                    <ResponsiblePersonCard
                        height={285}
                        PersonsCount={responsiblePeopleCount}
                        usersCount={usersCount}
                        designationCount={designationCount}
                    />
                </Grid>

                {hasTotalCost
                    &&
                    <Grid xs={2.4}>
                        <CostCard
                            totalCost={totalCost}
                            height={285}
                        />
                    </Grid>
                }

            </Grid>

        </>
    )
}

export default Summary