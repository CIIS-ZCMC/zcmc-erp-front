import { Fragment, useEffect, useState } from 'react'

import { Box, Stack, Typography, Grid, Link } from '@mui/joy'
import { MousePointerClick, CloudDownload, ExternalLink } from 'lucide-react'

import { useNavigate, Outlet } from 'react-router-dom'

import ButtonComponent from '../../../../../../Components/Common/ButtonComponent'
import BoxComponent from '../../../../../../Components/Common/Card/BoxComponent'
import StepperComponent from '../../../../../../Components/Stepper/StepperComponent'

import no_result from '../../../../../../assets/not-found.png';
import { APPROVAL_TIMELINE } from '../../../../../../Data/TestData'

const AOPDashboard = () => {

    const navigate = useNavigate();

    const [aopObjectives, setAopObjectives] = useState([]);

    useEffect(() => {
        console.log(aopObjectives)
    }, [])

    return (
        <Fragment>
            {
                aopObjectives.length === 0 ?
                    <BoxComponent
                        mt={3}
                        height={'83vh'}
                        display={'flex'}
                        flexDirection={'column'}
                        justifyContent={'center'}
                        alignContent={'center'}
                    >
                        <Stack
                            direction={'column'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            textAlign={'center'}
                            m={2}
                        >

                            {/* <NoResultComponent /> */}

                            <img
                                src={no_result}
                                alt="not-found-img"
                                width={140}
                            />

                            <Typography sx={{ fontSize: 32, fontWeight: 600 }}>
                                You didn’t have an AOP for this year yet.
                            </Typography>

                            <Typography sx={{ fontSize: 32, fontWeight: 700 }}>
                                Begin by creating a new request
                            </Typography>

                            <Typography mt={2} sx={{ fontSize: 14 }}>
                                Nothing to show yet for this year’s AOP. You may request new items for the
                                <br></br>
                                meantime or create a new AOP request.
                            </Typography>
                        </Stack>

                        <Stack
                            direction={'row'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            gap={2}
                        >
                            <ButtonComponent
                                label={'Request new items'}
                                variant={'outlined'}
                            // onClick={() => navigate('create')}
                            />

                            <ButtonComponent
                                label={'Create new AOP'}
                                onClick={() => navigate('create')}
                            />

                        </Stack>

                    </BoxComponent>
                    :
                    <>
                        <BoxComponent
                            mt={3}
                            height={'83vh'}
                        >
                            <Stack>
                                <Box
                                    bgcolor="#006599"
                                    padding={3}
                                    sx={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
                                >
                                    <Typography sx={{ color: "white", fontSize: 32, fontWeight: 600 }}>
                                        PPMP #2023-0031 for Fiscal year 2026
                                    </Typography>
                                    <Typography sx={{ color: "white", fontSize: 14 }}>
                                        Mission: This is a sample mission written by the requesting body.
                                        This could be as short as a
                                        <br></br>
                                        single sentence but could be as long
                                        as two sentences if necessary.
                                    </Typography>
                                </Box>
                            </Stack>


                            <Grid
                                container
                                columns={{ xs: 12, sm: 12, md: 12 }}
                                justifyContent={'center'}
                                gap={3}
                                mt={3}
                            >
                                <Grid item={"true"} xs={12} md={6} >
                                    <>
                                        <BoxComponent
                                            p={5}
                                        >
                                            <Typography sx={{ fontSize: 32, fontWeight: 600 }}>
                                                Annual Operations Plan summary:
                                            </Typography>

                                            <Grid
                                                container
                                                columns={12}
                                                gap={2}
                                                direction={'row'}
                                                mt={3}
                                            >
                                                <Grid item={'true'} sm={5} md={5.8}>
                                                    <BoxComponent
                                                        p={2}
                                                    >
                                                        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                                                            Objectives
                                                        </Typography>
                                                        <Stack
                                                            mt={2}
                                                            direction={'row'}
                                                            alignItems={'start'}
                                                            gap={1}
                                                        >
                                                            {/* <MousePointerClick size={20} /> */}
                                                            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
                                                                Contains(14) success indicators in total on this request
                                                            </Typography>
                                                        </Stack>

                                                    </BoxComponent>
                                                </Grid>

                                                <Grid item={'true'} sm={5} md={5.8}>
                                                    <BoxComponent
                                                        p={2}
                                                    >
                                                        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                                                            Activities
                                                        </Typography>
                                                        <Stack
                                                            mt={2}
                                                            direction={'row'}
                                                            alignItems={'start'}
                                                            gap={1}
                                                        >
                                                            {/* <MousePointerClick size={20} /> */}
                                                            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
                                                                Where (6) are GAD-related and (6) are not GAD-related on this reques
                                                            </Typography>
                                                        </Stack>

                                                    </BoxComponent>
                                                </Grid>

                                                <Grid item={'true'} sm={5} md={5.8}>
                                                    <BoxComponent
                                                        p={2}
                                                    >
                                                        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                                                            Resources
                                                        </Typography>
                                                        <Stack
                                                            mt={2}
                                                            direction={'row'}
                                                            alignItems={'start'}
                                                            gap={1}
                                                        >
                                                            {/* <MousePointerClick size={20} /> */}
                                                            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
                                                                With (₱22,000,000.00) total allocated budget
                                                            </Typography>
                                                        </Stack>

                                                    </BoxComponent>
                                                </Grid>

                                                <Grid item={'true'} sm={5} md={5.8}>
                                                    <BoxComponent
                                                        p={2}
                                                    >
                                                        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                                                            responsible persons
                                                        </Typography>
                                                        <Stack
                                                            mt={2}
                                                            direction={'row'}
                                                            alignItems={'start'}
                                                            gap={1}
                                                        >
                                                            {/* <MousePointerClick size={20} /> */}
                                                            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
                                                                Includes (6) job positions, (6) areas (2) persons in total
                                                            </Typography>
                                                        </Stack>
                                                    </BoxComponent>
                                                </Grid>
                                            </Grid>

                                            <Stack
                                                mt={2}
                                                direction={'row'}
                                                gap={2}
                                            >
                                                <ButtonComponent
                                                    label={'Print as (.XLS)'}
                                                    variant={'outlined'}
                                                    size={'sm'}
                                                    endDecorator={<CloudDownload size={16} />}
                                                />

                                                <ButtonComponent
                                                    label={'Open request'}
                                                    variant={'outlined'}
                                                    size={'sm'}
                                                    endDecorator={<ExternalLink size={16} />}
                                                />

                                                <ButtonComponent
                                                    label={'Request new item'}
                                                    variant={'outlined'}
                                                    size={'sm'}
                                                    endDecorator={<ExternalLink size={16} />}
                                                />

                                            </Stack>


                                        </BoxComponent>
                                    </>
                                </Grid>

                                <Grid item={"true"} xs={12} md={4}>
                                    <>
                                        <Typography sx={{ fontSize: 32, fontWeight: 600 }}>
                                            Annual Operations Plan summary:
                                        </Typography>

                                        <BoxComponent>
                                            <StepperComponent data={APPROVAL_TIMELINE} />
                                        </BoxComponent>
                                    </>
                                </Grid>
                            </Grid>

                        </BoxComponent>

                    </>
            }
        </Fragment >
    )
}

export default AOPDashboard