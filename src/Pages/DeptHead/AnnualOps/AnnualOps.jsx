
import { Fragment, useEffect, useState } from 'react';
import { Box, Stack, Typography, Grid, useTheme } from '@mui/joy'

import { useNavigate } from "react-router-dom";
import { ExternalLink, CloudDownload, } from "lucide-react";

import ButtonComponent from "../../../Components/Common/ButtonComponent";
import BoxComponent from "../../../Components/Common/Card/BoxComponent";

import StepperComponent from '../../../Components/Stepper/StepperComponent';

import no_result from '../../../assets/empty-state-icon-base.png';

import { AOP_CONSTANTS } from "../../../Data/constants";
import { APPROVAL_TIMELINE } from '../../../Data/TestData'

const Header = () => {
  return (
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
  )
}

const SummaryCard = ({ title, content }) => {
  return (
    < BoxComponent
      p={2}
    >
      <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
        {title}
      </Typography>
      <Stack
        mt={2}
        direction={'row'}
        alignItems={'start'}
        gap={1}
      >
        {/* <MousePointerClick size={20} /> */}
        <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
          {content}
        </Typography>
      </Stack>
    </BoxComponent >
  )
}

const Summary = () => {

  const objectiveCount = 16;
  const objectivesContent = `Contains (${objectiveCount}) success indicators in total on this request `

  const gadRelatedCount = 6;
  const nonGadRelatedCount = 6;
  const activitiesContent = ` Where (${gadRelatedCount}) are GAD-related and (${nonGadRelatedCount}) are not GAD-related on this reques`

  const resourcesAmount = '22,000,000.00';
  const resourcesContent = ` With (${resourcesAmount}) total allocated budget`

  const jobPositionsCount = 6;
  const areasCount = 6;
  const users = 2;
  const responsiblePersonContent = `Includes (${jobPositionsCount}) job positions, (${areasCount}) areas (${users}) user/s in total`

  return (
    <>
      <BoxComponent
        p={3}
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
            <SummaryCard
              title={'Objectives'}
              content={objectivesContent}
            />
          </Grid>

          <Grid item={'true'} sm={5} md={5.8}>
            <SummaryCard
              title={'Activities'}
              content={activitiesContent}
            />
          </Grid>

          <Grid item={'true'} sm={5} md={5.8}>
            <SummaryCard
              title={'Resources'}
              content={resourcesContent}
            />
          </Grid>

          <Grid item={'true'} sm={5} md={5.8}>
            <SummaryCard
              title={'Responsible people'}
              content={responsiblePersonContent}
            />
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
  )
}

const Timeline = () => {
  return (
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
  )
}

const AnnualOps = () => {
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

              {/* <NoResultComponent /> */}

              <img
                src={no_result}
                alt="not-found-img"
                width={'30%'}
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
                <Grid item={"true"} xs={12} md={6} >
                  <Summary />
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
