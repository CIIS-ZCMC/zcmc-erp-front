import React from 'react'

import { Card, CardContent, CardActions, Stack, Typography, IconButtonComponent } from '@mui/joy'

const CardComponent = ({ statusColor }) => {
    return (
        <>
            <Card
                sx={{
                    textAlign: 'center',
                    overflow: 'auto',
                    width: "450px",
                    borderLeft: '6px solid #2E7D32',
                    borderRadius: 'md',
                }}
            >

                <CardContent>
                    <Stack
                        direction={'row'}
                        alignItems={'end'}
                        justifyContent={'end'}
                    >
                        <IconButtonComponent
                            size={'sm'}
                            icon={<Check size={18} />}
                        />

                        <IconButtonComponent
                            size={'sm'}
                            icon={<Pencil size={18} />}
                        />

                        <IconButtonComponent
                            size={'sm'}
                            icon={<Trash size={18} />}
                        />
                    </Stack>


                    <Stack
                        direction={'row'}
                        alignItems={'start'}
                        justifyContent={'space-between'}
                        gap={5}
                    >

                        <Stack
                            alignItems={'start'}
                        >
                            <Typography
                                level={'body-sm'}
                                sx={{ flex: 1 }}
                            >
                                Function Type
                            </Typography>

                            <Typography
                                level={'title-lg'}
                                sx={{ flex: 1 }}
                            >
                                Objective Name #1
                            </Typography>
                        </Stack>



                        <Typography
                            level="body-sm"
                            sx={{
                                flex: 1,
                                // whiteSpace: 'nowrap',
                                // overflow: 'hidden',
                                // textOverflow: 'ellipsis',
                                // maxWidth: '50%',
                            }}
                        >
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis perspiciatis maiores amet atque ducimus expedita tempora Voluptas, illo.
                        </Typography>
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
                        <Chip
                            variant="soft"
                            color="primary"
                            size="lg"
                            p={2}
                            startDecorator={10}
                            endDecorator={<ArrowRight size={18} />}
                            onClick={() => alert('You clicked the Joy Chip!')}
                        >
                            Activities
                        </Chip>
                        {/* 
                                <ButtonComponent
                                    variant={'soft'}
                                    color={'primary'}
                                    label={`${10} Activities`}
                                    size={'sm'}
                                    endDecorator={<ArrowRight size={18} />}
                                >
                                    chip
                                </ButtonComponent> */}
                    </Stack>
                </CardActions>

            </Card>
        </>
    )
}

export default CardComponent