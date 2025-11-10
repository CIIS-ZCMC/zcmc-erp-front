import React from 'react'

import { Card, CardContent, CardActions, Stack, Typography, Chip, Divider } from '@mui/joy'
import IconButtonComponent from '../IconButtonComponent'

const CardComponent = ({
    statusColor,
    cardHeader,
    cardBody,
    cardActions,
    height,
    justifyContentHeader,
    justifyContentActions,
    direction,
}) => {
    return (
        <>
            <Card
                // variant=''
                // color='primary'
                sx={{
                    textAlign: 'center',
                    overflow: 'auto',
                    // width: "459px",
                    height: height,
                    borderLeft: `6px solid ${statusColor}`,
                    borderRadius: 'md',
                }}
            >

                <CardContent>
                    <Stack
                        direction={'row'}
                        alignItems={'center'}
                        justifyContent={justifyContentHeader ? justifyContentHeader : 'flex-end'}
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
                        justifyContent: justifyContentActions ? '' : "flex-end",
                    }}
                >
                    <Stack
                        direction={direction ? direction : 'column'}
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