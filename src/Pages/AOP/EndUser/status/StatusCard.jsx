import React from 'react'

import { Stack, Typography, Divider } from '@mui/joy'

import BoxComponent from '@Components/Common/Card/BoxComponent'

const StatusCard = ({
    height,
    hasFunction,
    logo,
    count,
    title,
    description,
    functionHandler,
}) => {
    return (
        <>
            <BoxComponent
                height={height}
            >
                <Stack
                    px={3}
                    py={2}
                    spacing={hasFunction ? 1 : 2}
                >
                    <img src={logo} alt="" width={60} />

                    <Typography
                        level="title-sm"
                        color='primary'
                        textTransform='uppercase'
                    >
                        {title}
                    </Typography>

                    <Typography
                        level="title-lg"
                        sx={{
                            fontSize: '40px'
                        }}
                    >
                        {count}
                    </Typography>

                    <Typography level="body-sm">
                        {description}
                    </Typography>

                    {
                        hasFunction &&
                        <>
                            <Divider />

                            {functionHandler}
                        </>
                    }

                </Stack>


            </BoxComponent>


        </>
    )
}

export default StatusCard