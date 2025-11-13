import React from 'react'

import { Stack, Typography, Box } from '@mui/joy'

const AccordionSummary = ({
    objectiveName,
    activitiesCount,
    cost,
    index,
}) => {
    return (
        <>
            <Stack
                direction={'row'}
                gap={10}
            >
                <Stack>
                    <Typography
                        level='body-sm'
                        textTransform={'uppercase'}
                    >
                        #objective {index}
                    </Typography>
                    <Typography
                        level='title-lg'
                        color={'primary'}
                    >
                        {objectiveName}
                    </Typography>
                </Stack>


                {/* <Stack
                    alignItems={'flex-end'}
                >
                    <Typography
                        level='body-sm'
                        textTransform={'capitalize'}
                    >
                        Activities
                    </Typography>
                    <Typography
                        level='title-lg'
                        color={'primary'}
                    >
                        {activitiesCount}
                    </Typography>
                </Stack>

                <Stack
                    alignItems={'flex-end'}
                >
                    <Typography
                        level='body-sm'
                        textTransform={'capitalize'}
                    >
                        Cost
                    </Typography>
                    <Typography
                        level='title-lg'
                        color={'primary'}
                    >
                        {cost}
                    </Typography>
                </Stack> */}

            </Stack>
        </>
    )
}

export default AccordionSummary