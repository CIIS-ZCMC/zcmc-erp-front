import React from 'react'

import { Box, Stack, Skeleton, Typography } from '@mui/joy';

import BoxComponent from '@Components/Common/Card/BoxComponent';
import ButtonComponent from '@Components/Common/ButtonComponent';

import { AOP } from '../../../Data/constants';

const AOPEmptyObjectives = ({
    isLoading,
    handleNavigate
}) => {

    const {
        AOP_EMPTY_OBJECTIVE_TITLE,
        AOP_EMPTY_OBJECTIVE_DESC
    } = AOP;


    return (
        <>
            <BoxComponent
                justifyContent="center"
                alignItems="center"
                height="65vh"
                display="flex"
                padding={2}
            >
                <Box textAlign="center">
                    <Stack direction={"column"} mb={2}>
                        <Skeleton
                            loading={isLoading}
                            animation="wave"
                            variant="text"
                        />

                        <Skeleton
                            loading={isLoading}
                            animation="wave"
                            variant="text"
                        />
                    </Stack>

                    {!isLoading && (
                        <>
                            <Typography>
                                {AOP_EMPTY_OBJECTIVE_TITLE}
                            </Typography>

                            <Typography fontWeight={600} mb={2}>
                                {AOP_EMPTY_OBJECTIVE_DESC}
                            </Typography>
                        </>
                    )}

                    <ButtonComponent
                        isLoading={isLoading}
                        label={"Go to Manage Objectives"}
                        onClick={handleNavigate}
                    />
                </Box>
            </BoxComponent>

        </>
    )
}

export default AOPEmptyObjectives