import React from 'react'

import { Avatar, ListItemContent, Stack, Typography } from '@mui/joy'
import { CircleUser } from 'lucide-react'

const AccordionSummary = ({
    positionsCount
}) => {
    return (
        <>
            <Avatar
                variant='soft'
                color='primary'
            >
                <CircleUser color='white' />
            </Avatar>

            <ListItemContent>
                <Stack
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <Stack>
                        <Typography level="title-md">Assigned Positions</Typography>
                        <Typography level="body-sm">
                            Specific positions responsible for this activity
                        </Typography>
                    </Stack>

                    <Typography level="title-lg">
                        {positionsCount}
                    </Typography>
                </Stack>
            </ListItemContent>
        </>
    )
}

export default AccordionSummary