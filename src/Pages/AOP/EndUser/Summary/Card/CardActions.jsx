import React from 'react'

import { Stack, Typography } from '@mui/joy'
import { formattedDate } from '../../../../../Utils/formattedLongDate'

const CardActions = ({
    datePrepared,
    dateToday,
    PreparedBySector
}) => {
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
                    {PreparedBySector}
                </Typography>
            </Stack>

            <Stack
                textAlign={'start'}
                mr={10}
            >
                <Typography level='body-sm'>
                    Date Prepared:
                </Typography>
                <Typography level='title-md'>
                    {formattedDate(datePrepared)}
                </Typography>
            </Stack>

            <Stack
                textAlign={'start'}
                mr={10}
            >
                <Typography level='body-sm'>
                    Date Today:
                </Typography>
                <Typography level='title-md'>
                    {formattedDate(dateToday)}
                </Typography>
            </Stack>

        </>

    )
}

export default CardActions