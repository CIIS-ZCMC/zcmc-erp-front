import React from 'react'

import { List, ListItem, ListItemContent, Stack, Typography, Avatar } from '@mui/joy'

import BoxComponent from '@Components/Common/Card/BoxComponent'

import PeopleIcon from '../../../../../../assets/responsible_people/People.svg'

const PeopleList = ({ responsiblePeople, peopleCount }) => {
    return (
        <>
            <BoxComponent>
                <ListItemContent
                    sx={{
                        padding: 2
                    }}
                >
                    <Stack
                        direction={'row'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <Stack
                            direction={'row'}
                            gap={2}
                        >
                            <img src={PeopleIcon} alt="people-icon" width={50} />
                            <Stack>
                                <Typography level="title-md">Assigned Persons</Typography>
                                <Typography level="body-sm">
                                    Specific individuals responsible for this activity
                                </Typography>
                            </Stack>
                        </Stack>

                        <Avatar
                            variant='soft'
                            color=''
                            size='lg'
                        >
                            <Typography level="title-lg" color='violet'>
                                {peopleCount}
                            </Typography>
                        </Avatar>
                    </Stack>
                </ListItemContent>

                <List
                    sx={{
                        padding: 2
                    }}
                >
                    {responsiblePeople?.map(({ id, user, designation }) => {

                        const { name: employeeName, designation_name } = user || '';
                        const { name: jobPosition } = designation || ''

                        return <ListItem
                            key={id}
                        >
                            <Stack>
                                <Typography level="title-sm">{employeeName ? employeeName : jobPosition}</Typography>
                                <Typography level="body-sm">
                                    {employeeName ? designation_name : 'Position'}
                                </Typography>
                            </Stack>
                        </ListItem>
                    })}


                </List>
            </BoxComponent>
        </>
    )
}

export default PeopleList