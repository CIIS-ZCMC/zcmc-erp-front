import React from 'react'
import { List, ListItem, ListItemContent, Stack, Typography, Avatar } from '@mui/joy'

import BoxComponent from '@Components/Common/Card/BoxComponent'

import ResourcesIcon from '../../../../../../assets/dashboard/Resources.svg'

const ResourcesList = () => {
    return (
        <>
            <BoxComponent >
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
                            <img src={ResourcesIcon} alt="people-icon" width={50} />
                            <Stack>
                                <Typography level="title-md">Resources</Typography>
                                <Typography level="body-sm">
                                    Resources used for this activity
                                </Typography>
                            </Stack>
                        </Stack>

                        <Avatar
                            variant='soft'
                            color=''
                            size='lg'
                        >
                            <Typography level="title-lg" color='violet'>
                                {/* {usersCount} */} 5
                            </Typography>
                        </Avatar>
                    </Stack>
                </ListItemContent>

                <List
                    sx={{
                        padding: 2
                    }}
                >
                    <ListItem
                        sx={{
                            display: 'flex',
                            alignItem: 'center',
                            justifyContent: 'space-between',
                            mt: 2
                        }}
                    >
                        <Stack>
                            <Typography level="title-sm">X-Ray Machine</Typography>
                            <Typography level="body-sm">
                                Qty: 2
                            </Typography>
                        </Stack>

                        <Stack>
                            <Typography level="title-sm">Classification</Typography>
                            <Typography level="body-sm">
                                Category
                            </Typography>
                        </Stack>

                        <Stack>
                            <Typography level="title-sm">15,000,000</Typography>
                            <Typography level="body-sm">
                                1500 per pc
                            </Typography>
                        </Stack>
                    </ListItem>
                </List>
            </BoxComponent>

        </>
    )
}

export default ResourcesList