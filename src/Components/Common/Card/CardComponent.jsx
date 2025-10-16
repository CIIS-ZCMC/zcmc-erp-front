import React from 'react'

import { Card, CardContent, CardActions, Stack, Typography, Chip, Divider } from '@mui/joy'
import IconButtonComponent from '../IconButtonComponent'

const CardComponent = ({
    statusColor,
    cardHeader,
    cardBody,
    cardActions,
}) => {
    return (
        <>
            <Card
                sx={{
                    textAlign: 'center',
                    overflow: 'auto',
                    width: "450px",
                    borderLeft: `6px solid ${statusColor}`,
                    borderRadius: 'md',
                }}
            >

                <CardContent>
                    <Stack
                        direction={'row'}
                        alignItems={'center'}
                        justifyContent={'flex-end'}
                    >
                        {cardHeader}
                    </Stack>


                    <Stack
                        direction={'row'}
                        alignItems={'start'}
                        justifyContent={'space-between'}
                        gap={5}
                    >
                        {cardBody}
                    </Stack>
                </CardContent>

                <Divider inset="none" />

                <CardActions
                    sx={{
                        justifyContent: "flex-end",
                    }}
                >
                    <Stack
                        direction={'column'}
                        alignItems={'center'}
                    >
                        {cardActions}
                    </Stack>
                </CardActions>

            </Card>
        </>
    )
}

export default CardComponent