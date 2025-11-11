import React, { useState } from 'react'
import { List, ListItem, ListItemContent, Stack, Typography, Avatar } from '@mui/joy'

import BoxComponent from '@Components/Common/Card/BoxComponent'

import ResourcesIcon from '../../../../../../assets/dashboard/Resources.svg'

import formattedPrice from '../../../../../../Utils/formattedPrice'

const ResourcesList = ({
    resources,
    resourcesCount,
}) => {

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
                                {/* {usersCount} */} {resourcesCount}
                            </Typography>
                        </Avatar>
                    </Stack>
                </ListItemContent>

                <List
                    sx={{
                        padding: 2
                    }}
                >
                    {resources.map(({ id, item, quantity, item_cost, total_resource_cost, item_category }) => {

                        const { name } = item;

                        return (
                            <ListItem
                                key={id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'start',
                                    justifyContent: 'space-between',
                                    mt: 2
                                }}
                            >
                                <Stack>
                                    <Typography level="title-sm">{name}</Typography>
                                    <Typography level="body-sm">
                                        Qty: {quantity}
                                    </Typography>
                                </Stack>

                                <Stack>
                                    <Typography level="title-sm">{item_category.name}</Typography>
                                    {/* <Typography level="body-sm">

                                    </Typography> */}
                                </Stack>

                                <Stack
                                    alignItems={'end'}
                                >
                                    <Typography level="title-sm">
                                        {formattedPrice(total_resource_cost)}
                                    </Typography>
                                    <Typography level="body-sm">
                                        {formattedPrice(item_cost)} per pc
                                    </Typography>
                                </Stack>
                            </ListItem>
                        )
                    })}


                </List>
            </BoxComponent>

        </>
    )
}

export default ResourcesList