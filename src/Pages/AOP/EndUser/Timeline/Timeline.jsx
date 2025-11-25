import { Fragment, useEffect } from 'react';

import { Typography, useTheme, Divider, Box } from '@mui/joy';

import useTimelinesStore from '../../../../Store/TimelinesStore';
import useTimelineHook from '../../../../Hooks/AOP/TimelineHook';

import BoxComponent from '@Components/Common/Card/BoxComponent';
import StepperComponent from '@Components/Stepper/StepperComponent';
import { ThreeDotsLoader } from '@Components/Common/Loading/ThreeDotsLoader';

import { AOP_TIMELINE } from '../../../../Data/constants';

const Timeline = ({ aopId }) => {

    const {
        TITLE,
        SUBTITLE,
        EMPTY_STATE
    } = AOP_TIMELINE;

    const theme = useTheme();
    const color = theme.palette.custom;

    const {
        timelines,
        isLoading: isTimelineLoading
    } = useTimelinesStore()

    const { getTimelines } = useTimelineHook();

    useEffect(() => {
        getTimelines(aopId, (status, message) => {
            // console.log(status)
            if (!(status >= 200 && status < 300)) {
                return; //Toast error
            }
        })
    }, [])

    useEffect(() => {
        console.log('current timeline', timelines)
    }, [timelines])

    return (
        <Fragment>
            <BoxComponent
                p={3}
                height="65vh"
                padding={2}
            >
                <Typography
                    level="title-lg"
                >
                    {TITLE}
                </Typography>

                <Typography
                    level="body-xs"
                    mt={0.5}
                    sx={{
                        color: color.fontLight
                    }}
                >
                    {SUBTITLE}
                </Typography>

                <Divider
                    sx={{
                        my: 1,
                        color: "gray"
                    }}
                />

                {isTimelineLoading ?
                    <ThreeDotsLoader />
                    :
                    <Fragment>
                        {timelines?.length === 0 ?
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                height={"58vh"}
                            >
                                <Typography
                                    level="body-sm"
                                    sx={{ color: color.fontLight }}
                                >
                                    {EMPTY_STATE}
                                </Typography>
                            </Box>
                            :
                            <StepperComponent
                                data={timelines}
                            />
                        }
                    </Fragment>
                }
            </BoxComponent >
        </Fragment>

    )
}


export default Timeline