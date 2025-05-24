import { Fragment, useEffect, useState } from 'react';
import { Stack, Typography, Grid, CircularProgress } from '@mui/joy'

import { useNavigate } from "react-router-dom";

import useAOPObjectivesHooks from '../../../Hooks/AOP/AOPObjectivesHook';

import Header from './Header';
import Summary from './Summary';
import Timeline from './Timeline';

import ButtonComponent from "../../../Components/Common/ButtonComponent";
import BoxComponent from "../../../Components/Common/Card/BoxComponent";

import no_result from '../../../assets/empty-state-icon-base.png';
import { AOP_CONSTANTS } from '../../../Data/constants';

const AnnualOps = () => {
  const navigate = useNavigate();

  const [aopObjectives, setAopObjectives] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const { aop_summary, getSummary } = useAOPObjectivesHooks();

  const {
    total_objectives,
    total_success_indicators,
    total_activities,
    total_gad_related,
    total_resources,
    total_not_gad_related,
    total_cost,
    total_job_positions,
    total_areas,
    total_users,
    total_responsible_people
  } = aop_summary

  useEffect(() => {
    setIsLoading(true)
    getSummary((status, message) => {
      // console.log(status)
      if (!(status >= 200 && status < 300)) {
        return; //Toast error
      }
      setIsLoading(false)
    })
  }, [])

  // useEffect(() => {
  //   console.log(aop_summary)
  // }, [aop_summary])

  return (
    <Fragment>
      {
        isLoading ? <BoxComponent
          mt={10}
          height={'83vh'}
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignContent={'center'}
        >
          <CircularProgress />
        </BoxComponent>
          :
          !aop_summary ?
            <BoxComponent
              mt={10}
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

                <img
                  src={no_result}
                  alt="not-found-img"
                  width={'30%'}
                />

                <Typography sx={{ fontSize: 32, fontWeight: 600 }}>
                  {AOP_CONSTANTS.AOP_EMPTY_STATE_TITLE}
                </Typography>

                <Typography sx={{ fontSize: 32, fontWeight: 700 }}>
                  {AOP_CONSTANTS.AOP_CREATE_NEW_AOP}
                </Typography>

                <Typography mt={2} sx={{ fontSize: 14 }}>
                  {AOP_CONSTANTS.AOP_EMPTY_STATE_CONTENT}
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
                  onClick={() => navigate('/aop-create')}
                />
              </Stack>

            </BoxComponent>
            :
            <>
              <BoxComponent
                mt={10}
                height={'83vh'}
              >
                <Header />
                <Grid
                  container
                  columns={{ xs: 12, sm: 12, md: 12 }}
                  justifyContent={'center'}
                  gap={3}
                  mt={3}
                >
                  <Grid item={"true"} xs={12} md={6}>
                    <Summary
                      total_objectives={total_objectives}
                      total_success_indicators={total_success_indicators}
                      total_activities={total_activities}
                      total_gad_related={total_gad_related}
                      total_resources={total_resources}
                      total_not_gad_related={total_not_gad_related}
                      total_job_positions={total_job_positions}
                      total_cost={total_cost}
                      total_areas={total_areas}
                      total_users={total_users}
                      total_responsible_people={total_responsible_people}
                    />
                  </Grid>

                  <Grid item={"true"} xs={12} md={4}>
                    <>
                      <Timeline />
                    </>
                  </Grid>
                </Grid>

              </BoxComponent>

            </>

      }
    </Fragment >
  )
};

export default AnnualOps;
