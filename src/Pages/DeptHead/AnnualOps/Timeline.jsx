import { Fragment } from 'react';

import { Stack, Typography, } from '@mui/joy';

import useAOPObjectivesHooks from '../../../Hooks/AOP/AOPObjectivesHook';

import BoxComponent from '../../../Components/Common/Card/BoxComponent';
import StepperComponent from '../../../Components/Stepper/StepperComponent';

import { APPROVAL_TIMELINE } from '../../../Data/TestData';



const Timeline = () => {


    const { getTimeline } = useAOPObjectivesHooks();

    return (
        <Fragment>
            <BoxComponent
                p={3}
            >
                <Stack mb={2}>
                    <Typography sx={{ fontSize: 32, fontWeight: 600 }}>
                        Approval Timeline
                    </Typography>
                    <Typography sx={{ fontSize: 14 }}>
                        The list below shows the current status of the request.
                    </Typography>
                </Stack>

                <StepperComponent data={APPROVAL_TIMELINE} />
            </BoxComponent >
        </Fragment>

    )
}


export default Timeline