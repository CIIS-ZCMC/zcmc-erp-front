import React from 'react'

import { Typography, Stack } from '@mui/joy'

const CardBody = ({ objective, activity, timeframe }) => {
    return (
        <>

            <Stack
                direction={'column'}
                alignItems={'start'}
            >
                <Typography
                    level={'body-sm'}
                >
                    {objective}
                </Typography>

                <Typography
                    level={'title-md'}
                    sx={{
                    }}
                >
                    {activity}
                </Typography>

                <Typography
                    level={'body-sm'}
                >
                    {timeframe}
                </Typography>
            </Stack>

            <Typography
                level="body-sm"
                sx={{
                    // flex: 1,
                    textAlign: 'right',
                    // whiteSpace: 'nowrap',
                    // overflow: 'hidden',
                    // textOverflow: 'ellipsis',
                    // maxWidth: '50%',
                }}
            >
                cost here
            </Typography>

        </>


    )
}

export default CardBody