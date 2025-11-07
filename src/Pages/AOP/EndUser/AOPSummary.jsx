import React from 'react'

import { Stack, Typography, Breadcrumbs } from '@mui/joy'

const AOPSummary = () => {

    const breadcrumbs = [
        <Typography key="3" sx={{ color: 'text.primary' }}>
            Submission of AOP
        </Typography>,
    ];

    return (
        <>
            <Stack spacing={1}>
                <Stack
                    direction={'row'}
                    alignItems={'center'}
                    alignContent={'start'}
                >
                    <Typography
                        level="h2"
                        fontWeight={700}
                    >
                        AOP #2025-0031 for Fiscal Year 2026
                    </Typography>

                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                        {breadcrumbs}
                    </Breadcrumbs>
                </Stack>

                <Typography
                    level="body-md"
                    fontWeight={400}
                    width={1075}
                >
                    Please carefully review the complete summary of your AOP request below. Verify all details are correct before submitting. Once submitted, your AOP will be forwarded to the the approving bodies for review and approval.
                </Typography>

            </Stack>
        </>
    )
}

export default AOPSummary