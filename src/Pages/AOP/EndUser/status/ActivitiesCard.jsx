import React from 'react'

import { Stack, Typography } from '@mui/joy';

import BoxComponent from '@Components/Common/Card/BoxComponent'
import ActivitiesLogo from '../../../../assets/dashboard/Activities.svg';

const ActivitiesCard = ({ activitiesCount }) => {
    return (
        <>
            <BoxComponent
                height={302}
            >
                <Stack
                    px={3}
                    py={2}
                    spacing={2}
                >
                    <img src={ActivitiesLogo} alt="" width={60} />

                    <Typography level="title-sm">Activities</Typography>

                    <Typography
                        level="title-lg"
                        sx={{
                            fontSize: '40px'
                        }}
                    >
                        {activitiesCount}
                    </Typography>

                    <Typography level="body-sm">Where (6) are GAD-related and (6) are not GAD-related on this request</Typography>

                </Stack>

            </BoxComponent>
        </>
    )
}

export default ActivitiesCard