import React from 'react'

import { Stack, Typography, } from '@mui/joy'

const AccordionSummary = ({
    activityIndex,
    name,
    startMonth,
    endMOnth,
    isGadRelated,
    totalCost,
    resourcesCount,
    peopleCount,
}) => {
    return (
        <>
            <>
                <Stack
                    direction={'row'}
                    gap={10}
                    alignItems={'center'}
                    p={2}
                >
                    <Stack>
                        <Typography
                            level='body-sm'
                            textTransform={'uppercase'}
                        >
                            # Activity {activityIndex}
                        </Typography>

                        <Typography
                            level='title-md'
                            color={'primary'}
                        >
                            {name}
                        </Typography>

                        <Typography
                            level='body-sm'
                            color={'primary'}
                        >
                            {startMonth} - {endMOnth}
                        </Typography>
                    </Stack>


                    <Typography
                        level='body-sm'
                        textTransform={'capitalize'}
                    >
                        {isGadRelated ? 'GAD-related activity' : 'Not GAD-related activity'}
                    </Typography>

                    <Typography
                        level='body-sm'
                        textTransform={'capitalize'}
                    >
                        {resourcesCount} Resources
                    </Typography>

                    <Typography
                        level='body-sm'
                        textTransform={'capitalize'}
                    >
                        {peopleCount}  Personnel
                    </Typography>

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
                            {totalCost}
                        </Typography>
                    </Stack>

                </Stack>
            </>
        </>
    )
}

export default AccordionSummary