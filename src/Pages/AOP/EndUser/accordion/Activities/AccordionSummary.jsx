import React, { useEffect } from 'react'

import { Stack, Typography, } from '@mui/joy'

import { formattedLongDate } from '../../../../../Utils/formattedLongDate'
import formattedPrice from '../../../../../Utils/formattedPrice'

const AccordionSummary = ({
    activityIndex,
    name,
    startMonth,
    endMonth,
    isGadRelated,
    totalCost,
    resourcesCount,
    peopleCount,
}) => {

    useEffect(() => {
        console.log(startMonth)
        console.log(endMonth)
    }, [startMonth, endMonth])

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
                        // color={'primary'}
                        >
                            {startMonth && endMonth ? `${formattedLongDate(startMonth)} to ${formattedLongDate(endMonth)}` : 'Please select a start month and end month'}
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
                            {formattedPrice(totalCost)}
                        </Typography>
                    </Stack>

                </Stack>
            </>
        </>
    )
}

export default AccordionSummary