import React from 'react';

import { Stack, Typography } from '@mui/joy';

import BoxComponent from '@Components/Common/Card/BoxComponent';

import ObjectivesLogo from '../../../../assets/dashboard/Objectives.svg';

const ObjectivesCard = ({
    objectiveCounts
}) => {
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
                    <img src={ObjectivesLogo} alt="" width={60} />

                    <Typography level="title-sm">Objectives</Typography>

                    <Typography
                        level="title-lg"
                        sx={{
                            fontSize: '40px'
                        }}
                    >
                        {objectiveCounts}
                    </Typography>

                    <Typography level="body-sm">Contains (14) success indicators in total on this request</Typography>

                </Stack>

            </BoxComponent>
        </>
    )
}

export default ObjectivesCard