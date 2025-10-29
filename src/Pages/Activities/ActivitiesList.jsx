import React, { useEffect } from 'react';

import { Stack, Typography, Grid, } from '@mui/joy';

import ButtonComponent from '@Components/Common/ButtonComponent';
import CardComponent from '@Components/Common/Card/CardComponent';
import { ThreeDotsLoader } from '@Components/Common/Loading/ThreeDotsLoader';

import CardHeader from './card/CardHeader';
import CardBody from './card/CardBody';
import CardActions from './card/CardActions';


import { ACTIVITIES } from '../../Data/constants';

const centeredStyle = {
    direction: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    height: '65vh',
    my: 2,
}

const ActivitiesList = (
    {
        isLoading,
        activities,
        handleAdd,
        handleEdit,
        handleDelete
    }
) => {

    const {
        EMPTY_STATE_TITLE,
        ACTIVITY_CREATE_NEW,
    } = ACTIVITIES;

    // useEffect(() => {
    //     console.log('current activities:', activities)
    // }, [activities])

    return (
        <div>
            {isLoading ?
                <Stack
                    sx={centeredStyle}
                >
                    <ThreeDotsLoader />
                </Stack>
                :
                activities.length === 0 ?
                    <>
                        <Stack
                            sx={centeredStyle}
                        >
                            <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                                {EMPTY_STATE_TITLE}
                            </Typography>

                            <Typography mb={2} sx={{ fontSize: 20, fontWeight: 400 }}>
                                {ACTIVITY_CREATE_NEW}
                            </Typography>

                            <ButtonComponent
                                onClick={handleAdd}
                                label={"Add Activity"}
                            // endDecorator={<Plus size={16} />}
                            />
                        </Stack>
                    </>
                    :
                    <>
                        <Grid mt={2} container direction="row" spacing={2} sx={{ flexGrow: 1 }}>
                            {/* {applicationObjectives?.map(({ id, success_indicator, objective }) => ( */}
                            <Grid
                                // key={id}
                                size={4}
                                lg={4}
                                md={6}
                                sm={12}
                            >
                                <CardComponent
                                    height={150}
                                    statusColor={'red'}
                                    cardHeader={<CardHeader
                                        handleEdit={handleEdit}
                                        handleDelete={handleDelete}
                                    />}
                                    cardBody={<CardBody
                                        objective={'Objective'}
                                        activity={'Activity One'}
                                        timeframe={`start month - end month`}
                                    />}
                                    cardActions={<CardActions
                                        handleActivities={() => console.log('activities')}
                                    />}
                                />
                            </Grid>
                            {/* ))} */}
                        </Grid>
                    </>
            }

        </div>
    )
}

export default ActivitiesList