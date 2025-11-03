import React from 'react';

import { Stack, Typography, Divider } from '@mui/joy';
import { ArrowRight } from 'lucide-react';

import BoxComponent from '@Components/Common/Card/BoxComponent';

import ButtonComponent from '@Components/Common/ButtonComponent';


import ObjectivesLogo from '../../../../assets/dashboard/Objectives.svg';

const ObjectivesCard = ({
    objectiveCounts,
    handleNavigate,
}) => {
    return (
        <>
            <BoxComponent
                height={302}
            >
                <Stack
                    px={3}
                    py={2}
                    spacing={1}
                >
                    <img src={ObjectivesLogo} alt="" width={60} />

                    <Typography level="title-sm">Objectives</Typography>

                    <Typography
                        level="title-lg"
                        sx={{
                            fontSize: '40px'
                        }}
                    >
                        {objectiveCounts}
                    </Typography>

                    <Typography level="body-sm">Contains (14) success indicators in total on this request</Typography>

                    <Divider />

                    <ButtonComponent
                        label={'Go to Objectives'}
                        size={'sm'}
                        onClick={handleNavigate}
                        endDecorator={<ArrowRight />}
                        fullWidth
                    />

                </Stack>

            </BoxComponent>
        </>
    )
}

export default ObjectivesCard