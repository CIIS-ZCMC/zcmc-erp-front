import React from 'react'

import {
    Avatar,
    ListItemContent,
    Stack,
    Typography
} from '@mui/joy'

import PositionsIcon from '../../../../../../assets/responsible_people/Positions.svg'

const AccordionSummary = ({
    positionsCount
}) => {
    return (
        <>
            <img src={PositionsIcon} alt="positions-icon" />

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

                    <Avatar
                        variant='soft'
                        color='secondary'
                        size='lg'
                    >
                        <Typography level="title-lg" color='violet'>
                            {positionsCount}
                        </Typography>
                    </Avatar>


                </Stack>
            </ListItemContent>
        </>
    )
}

export default AccordionSummary