import React from 'react';

import { Stack, Typography } from '@mui/joy';

import BoxComponent from '@Components/Common/Card/BoxComponent';

import ResourcesLogo from '../../../../assets/dashboard/Resources.svg';

const ResourcesCard = ({ resourcesCount }) => {
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
                    <img src={ResourcesLogo} alt="" width={60} />

                    <Typography level="title-sm">Resources</Typography>

                    <Typography
                        level="title-lg"
                        sx={{
                            fontSize: '40px'
                        }}
                    >
                        {resourcesCount}
                    </Typography>

                    <Typography level="body-sm">With (₱22,000,000.00) total allocated budget</Typography>

                </Stack>

            </BoxComponent>
        </>
    )
}

export default ResourcesCard