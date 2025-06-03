import { Fragment, useEffect, useState } from 'react';
import { Stack, Typography, Grid, CircularProgress } from '@mui/joy'
import { v4 as uuid } from 'uuid';

import { useNavigate } from "react-router-dom";

import useAOPObjectivesHooks from '../../../Hooks/AOP/AOPObjectivesHook';
import useObjectivesHook from '../../../Hooks/ObjectivesHook';
import useActivitiesHook from '../../../Hooks/ActivitiesHook';
import useResourceHook from '../../../Hooks/ResourceHook';
import useResponsiblePeopleHook from '../../../Hooks/ResponsiblePeopleHook';
import { useAOPActions, } from '../../../Hooks/AOP/AOPObjectivesHook';

import Header from './Header';
import Summary from './Summary';
import Timeline from './Timeline';

import ButtonComponent from "../../../Components/Common/ButtonComponent";
import BoxComponent from "../../../Components/Common/Card/BoxComponent";
import PageTitle from '../../../Components/Common/PageTitle';

import no_result from '../../../assets/empty-state-icon-base.png';
import { AOP_CONSTANTS } from '../../../Data/constants';

const AnnualOps = () => {
  const navigate = useNavigate();

  // const [aopObjectives, setAopObjectives] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const { aopObjectives, aop_summary } = useAOPObjectivesHooks();
  const { getSummary, getSingleAOP } = useAOPActions();

  const { objectives, setObjectives } = useObjectivesHook();
  const { activities, setActivities } = useActivitiesHook();
  const { resources, setResources, setCart } = useResourceHook();
  const { responsible_people, setResponsiblePeople } = useResponsiblePeopleHook();

  const {
    aop_application_id,
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

  useEffect(() => {
    setIsLoading(true)
    getSingleAOP((status, message) => {
      // console.log(status)
      if (!(status >= 200 && status < 300)) {
        return; //Toast error
      }
      setIsLoading(false)
    })
  }, [])

  // formatted objectives
  const formattedObjectives = aopObjectives.application_objectives?.map(({ function_type, objective, success_indicator }, index) => (
    {
      id: uuid(),
      rowId: index + 1,
      functionType: function_type,
      objective: objective,
      successIndicator: success_indicator
    }
  ))

  // get flat activities
  const flatActivities = aopObjectives.application_objectives?.flatMap(data => data.activity) || [];

  // formatted activities
  const formattedActivities = flatActivities.map(({ activity_uuid, name, is_gad_related, cost, start_month, end_month, target }, index) => ({
    id: activity_uuid ? activity_uuid : uuid(),
    // parentId: objectiveId,
    rowId: index + 1,
    name: name,
    isGadRelated: is_gad_related,
    cost: cost,
    startMonth: start_month,
    endMonth: end_month,
    target: {
      firstQuarter: target.first_quarter,
      secondQuarter: target.second_quarter,
      thirdQuarter: target.third_quarter,
      fourthQuarter: target.fourth_quarter,
    }
  }));

  //get item resourcese
  const flatResources = aopObjectives.application_objectives?.flatMap(data =>
    data.activity.flatMap(item => item.resources)
  ) || [];

  // formatted resources
  const formattedResources = flatResources?.map((resource) => ({
    id: uuid(),
    item_id: resource.item?.id,
    name: resource.item?.name,
    quantity: resource.quantity,
    individualPrice: resource.item?.estimated_budget,
    expenseClass: resource.expense_class,
    purchaseTypeId: resource.purchase_type?.id,
    totalCost: Number((resource.item?.estimated_budget * resource.quantity).toFixed(2)),
  }));

  const flatResponsiblePeople = aopObjectives.application_objectives?.flatMap(data =>
    data.activity.flatMap(item => item.responsible_people));

  const formattedResponsiblePeople = flatResponsiblePeople?.map((responsible) => (responsible

    // users: [responsible.user] || [],
    // designations: [responsible.designation] || [],
    // areas: [responsible.division || responsible.department || responsible.section || responsible.unit] || []

  ))

  useEffect(() => {
    // console.log('AOP OBJECTIVES:', aopObjectives);
    // console.log('responsible people:', flatResponsiblePeople)
    console.log('formatted', formattedResponsiblePeople)

    setObjectives(formattedObjectives);
    setActivities(formattedActivities);
    setResources(formattedResources);
    // setResponsiblePeople(formattedResponsiblePeople);
  }, [])


  return (
    <Fragment>
      <PageTitle
        title={AOP_CONSTANTS.CREATE_AOP_TITLE}
        description={AOP_CONSTANTS.CREATE_AOP_SUBHEADING}
      />
      {
        isLoading ? <BoxComponent
          mt={3}
          height={'83vh'}
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignContent={'center'}
        >
          <CircularProgress />
        </BoxComponent>
          :
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
                mt={3}
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
                      aopObjectives={aopObjectives}
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
                      aop_application_id={aop_application_id}
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
