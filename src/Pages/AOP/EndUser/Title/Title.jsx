import React from 'react';

import { Stack, Typography } from '@mui/joy';

import { AOP } from '../../../../Data/constants';

const Title = () => {

    const { PAGE_TITLE, PAGE_DESCRIPTION } = AOP

    return (
        <Stack>
            <Typography level="h2">{PAGE_TITLE}</Typography>
            <Typography level="body-xs">
                {PAGE_DESCRIPTION}
            </Typography>
        </Stack>
    )
}

export default Title