import React, { useEffect } from 'react'

import { Avatar, ListItemContent, Stack, Typography } from '@mui/joy'
import { CircleUser } from 'lucide-react'

const AccordionSummary = ({
    usersCount
}) => {

    useEffect(() => {
        console.log(usersCount)
    }, [usersCount])

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
                        <Typography level="title-md">Assigned Persons</Typography>
                        <Typography level="body-sm">
                            Specific individuals responsible for this activity
                        </Typography>
                    </Stack>

                    <Typography level="title-lg">
                        {usersCount}
                    </Typography>
                </Stack>
            </ListItemContent>
        </>
    )
}

export default AccordionSummary