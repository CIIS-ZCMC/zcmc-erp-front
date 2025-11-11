import React from 'react'

import { Stack, Typography } from '@mui/joy'

const CardActions = () => {
    return (

        <>
            <Stack
                direction={'column'}
                textAlign={'start'}
                mr={10}
            >
                <Typography level='body-sm'>
                    Prepared by:
                </Typography>
                <Typography level='title-md'>
                    IISU
                </Typography>
            </Stack>

            <Stack
                textAlign={'start'}
                mr={10}
            >
                <Typography level='body-sm'>
                    Prepared by:
                </Typography>
                <Typography level='title-md'>
                    IISU
                </Typography>
            </Stack>

            <Stack
                textAlign={'start'}
                mr={10}
            >
                <Typography level='body-sm'>
                    Prepared by:
                </Typography>
                <Typography level='title-md'>
                    IISU
                </Typography>
            </Stack>

        </>

    )
}

export default CardActions