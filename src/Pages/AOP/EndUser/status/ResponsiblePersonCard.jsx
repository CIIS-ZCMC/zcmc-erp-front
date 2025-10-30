import React from 'react';

import { Stack, Typography } from '@mui/joy';

import BoxComponent from '@Components/Common/Card/BoxComponent';

import PersonsLogo from '../../../../assets/dashboard/Persons.svg'

const ObjectivesCard = ({ PersonsCount }) => {
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
                    <img src={PersonsLogo} alt="" width={60} />

                    <Typography level="title-sm">Responsible Persons</Typography>

                    <Typography
                        level="title-lg"
                        sx={{
                            fontSize: '40px'
                        }}
                    >
                        {PersonsCount}
                    </Typography>

                    <Typography level="body-sm">Includes (6) job positions and (6) persons in total</Typography>

                </Stack>

            </BoxComponent>
        </>
    )
}

export default ObjectivesCard