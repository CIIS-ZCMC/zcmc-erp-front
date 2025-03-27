import React from 'react'

import { Stack, Box, Typography, Divider } from '@mui/joy';
import { ExternalLink } from 'lucide-react';

import Header from '../../Layout/Header';

import SheetComponent from '../../Components/Common/SheetComponent';
import ButtonComponent from '../../Components/Common/ButtonComponent';
import TabsComponent from '../../Components/Common/TabsComponent';

const AnnualOps = () => {

    const pageDetails = {
        title: "Annual Operations Planning",
        description: "This is a subheading. It should add more context to the interaction.",
    };

    return (
        <>
            <Header
                pageDetails={pageDetails}
            />

            <Divider sx={{ mt: 2, mb: 2 }} />

            <Stack gap={2} mt={2}>
                <SheetComponent
                    variant={"outlined"}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Stack
                            direction={'column'}
                        >
                            <Typography>
                                List of AOP requests
                            </Typography>
                            <Typography>
                                This is a subheading. It should add more context to the interaction.
                            </Typography>
                        </Stack>

                        <Stack
                            direction={'row'}
                            gap={2}
                        >
                            <ButtonComponent
                                label={'Request new item'}
                                variant={'outlined'}
                                endDecorator={<ExternalLink />}
                                size={'sm'}
                            />
                            <ButtonComponent
                                label={'Create AOP'}
                                variant={'solid'}
                                size={'sm'}
                            />
                        </Stack>
                    </Box>

                    <TabsComponent />

                </SheetComponent>
            </Stack>
        </>

    )
}

export default AnnualOps