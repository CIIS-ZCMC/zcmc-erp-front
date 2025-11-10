import React from 'react'

import { Stack, Typography } from '@mui/joy'
import { TriangleAlert } from 'lucide-react';

import { AOP_SUMMARY } from '../../../../../Data/constants';

const CardHeader = () => {

    const { SUMMARY_CARD_HEADER } = AOP_SUMMARY;

    return (
        <>
            <Stack
                direction={'row'}
                spacing={2}
                alignItems={'center'}
            >
                <TriangleAlert />
                <Typography>
                    {SUMMARY_CARD_HEADER}
                </Typography>
            </Stack>
        </>
    )
}

export default CardHeader