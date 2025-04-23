import React, { Fragment } from 'react';

import { Stack, Grid, Box, Typography, Divider } from '@mui/joy';
import { Trash } from 'lucide-react';

import ButtonComponent from '../../../../../../../../Components/Common/ButtonComponent';
import ContainerComponent from '../../../../../../../../Components/Common/ContainerComponent';
import BoxComponent from '../../../../../../../../Components/Common/Card/BoxComponent';
import AutocompleteComponent from '../../../../../../../../Components/Form/AutocompleteComponent';

import PersonSection from '../../../../../../../../Layout/ResponsiblePerson/PersonSection';

import { AOP_CONSTANTS } from '../../../../../../../../Data/constants';

const ResponsiblePerson = () => {
    return (
        <Fragment>
            <ContainerComponent
                title={AOP_CONSTANTS.TABLE_PERSON_HEADER}
                description={AOP_CONSTANTS.TABLE_PERSON_SUBHEADING}
            >

                <Grid
                    container
                    spacing={3}
                    columns={{ xs: 12, sm: 12, md: 12 }}
                    sx={{
                        flexGrow: 1,
                        width: "auto",
                        p: 1,
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        sm={2}
                        md={4}
                    >
                        <PersonSection />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={2}
                        md={4}
                    >
                        <BoxComponent>
                            <Box
                                m={1}
                            >
                                <Stack gap={1}>
                                    <AutocompleteComponent
                                        label={'Select Job Position(s)'}
                                        size={'md'}
                                    />

                                    <Typography
                                        level="body-xs"
                                        fontWeight={400}
                                    >
                                        Selected Poeple(s)
                                    </Typography>
                                </Stack>

                                <Box
                                    m={1}
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'space-between'}
                                >

                                    <Box
                                        display={'flex'}
                                        alignItems={'center'}
                                    >
                                        <Stack
                                            direction={'column'}
                                            m={1}
                                        >
                                            <Typography>
                                                Name
                                            </Typography>
                                            <Typography
                                                level="body-xs"
                                                fontWeight={400}
                                            >
                                                Computer Programmer
                                            </Typography>

                                        </Stack>

                                    </Box>

                                    <Box>
                                        <ButtonComponent
                                            label={'Remove'}
                                            variant={'text'}
                                            endDecorator={<Trash size={12} />}
                                            size={'sm'}
                                        />
                                    </Box>
                                </Box>
                                <Divider />

                            </Box>
                        </BoxComponent>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={2}
                        md={4}
                    >
                        <BoxComponent>
                            <Box
                                m={1}
                            >

                                <Stack gap={1}>
                                    <AutocompleteComponent
                                        label={'Select Area(s)'}
                                        size={'md'}
                                    />

                                    <Typography
                                        level="body-xs"
                                        fontWeight={400}
                                    >
                                        Selected Job Position (16)
                                    </Typography>
                                </Stack>

                                <Box
                                    m={1}
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'space-between'}
                                >

                                    <Box
                                        display={'flex'}
                                        alignItems={'center'}
                                    >
                                        <Stack
                                            direction={'column'}
                                            m={1}
                                        >
                                            <Typography>
                                                Name
                                            </Typography>
                                            <Typography
                                                level="body-xs"
                                                fontWeight={400}
                                            >
                                                Computer Programmer
                                            </Typography>

                                        </Stack>

                                    </Box>

                                    <Box>
                                        <ButtonComponent
                                            label={'Remove'}
                                            variant={'text'}
                                            endDecorator={<Trash size={12} />}
                                            size={'sm'}
                                        />
                                    </Box>
                                </Box>

                            </Box>
                        </BoxComponent>
                    </Grid>

                </Grid>

                <Stack
                    mt={2}
                    direction={'flex'}
                    alignItems={'center'}
                    justifyContent={'start'}
                    gap={1}
                >
                    <ButtonComponent
                        label={'Cancel Selection'}
                        size={'md'}
                        variant={'outlined'}
                    // onClick={() => navigate(`/aop-create`)}
                    />

                    <ButtonComponent
                        label={'Save Assignment'}
                        size={'md'}
                        variant={'solid'}
                    // onClick={() => navigate(`/aop-create`)}
                    />
                </Stack>
            </ContainerComponent>
        </Fragment>
    )
}

export default ResponsiblePerson