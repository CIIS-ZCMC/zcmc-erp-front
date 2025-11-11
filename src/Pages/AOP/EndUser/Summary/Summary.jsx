import React from 'react';

import { Grid } from '@mui/joy';

import ObjectivesCard from '../status/ObjectivesCard';
import ActivitiesCard from '../status/ActivitiesCard';
import ResourcesCard from '../status/ResourcesCard';
import ResponsiblePersonCard from '../status/ResponsiblePersonCard';
import CostCard from '../status/CostCard';

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