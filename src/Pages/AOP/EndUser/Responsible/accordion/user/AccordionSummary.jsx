import React, { useEffect } from 'react'

import {
    Avatar,
    ListItemContent,
    Stack,
    Typography
} from '@mui/joy'

import { CircleUser } from 'lucide-react'

import PeopleIcon from '../../../../../../assets/responsible_people/People.svg'

const AccordionSummary = ({
    usersCount
}) => {

    return (
        <>

            <img src={PeopleIcon} alt="people-icon" />

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

                    <Avatar
                        variant='soft'
                        color=''
                        size='lg'
                    >
                        <Typography level="title-lg" color='violet'>
                            {usersCount}
                        </Typography>
                    </Avatar>
                </Stack>

            </ListItemContent>
        </>
    )
}

export default AccordionSummary