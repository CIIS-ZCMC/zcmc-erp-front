import { Fragment, useState, useEffect } from 'react';

import { Stack, Typography, } from '@mui/joy';

import useAOPObjectivesHooks from '../../../Hooks/AOP/AOPObjectivesHook';
import { useApprovalActions, useApprovalLoading, useApprovalTimeline } from '../../../Hooks/AOP/AOPApprovalHook';
import { useAOPActions } from '../../../Hooks/AOP/AOPObjectivesHook';


import BoxComponent from '../../../Components/Common/Card/BoxComponent';
import StepperComponent from '../../../Components/Stepper/StepperComponent';
import { ThreeDotsLoader } from '../../../Components/Common/Loading/ThreeDotsLoader';

const Timeline = ({ aop_id }) => {

    const { getAOPApprovalTimeline } = useApprovalActions();
    const approvalTimeline = useApprovalTimeline();
    const isLoading = useApprovalLoading();

    useEffect(() => {
        getAOPApprovalTimeline(aop_id, (status, message) => {
            // console.log(status)
            if (!(status >= 200 && status < 300)) {
                return; //Toast error
            }
        })
    }, [aop_id])

    // useEffect(() => {
    //     console.log('current timeline', approvalTimeline)
    // }, [approvalTimeline])

    return (
        <Fragment>
            <BoxComponent
                p={3}
            >
                <Stack mb={2}>
                    <Typography sx={{ fontSize: 32, fontWeight: 600 }}>
                        Approval timeline for this AOP
                    </Typography>
                    <Typography sx={{ fontSize: 14 }}>
                        The list below shows the current status of the request.
                    </Typography>
                </Stack>

                {isLoading ?
                    <ThreeDotsLoader />
                    :
                    <Fragment>
                        <StepperComponent data={approvalTimeline} />
                    </Fragment>
                }
            </BoxComponent >
        </Fragment>

    )
}


export default Timeline