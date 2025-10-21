import { Fragment, useEffect, useState } from "react";
import { Stack, Typography, Grid } from "@mui/joy";

import { useNavigate } from "react-router-dom";
import useAOPStore, { useAOPActions } from "../../../Store/AOPStore";
import useAOPHook from "../../../Hooks/AOP/AOPHook";

import Header from "./Header";
import Summary from "./Summary";
import Timeline from "./Timeline";

import ButtonComponent from "../../../Components/Common/ButtonComponent";
import BoxComponent from "../../../Components/Common/Card/BoxComponent";
import ModalComponent from '@Components/Common/Dialog/ModalComponent'
import TextareaComponent from "@Components/Form/TextareaComponent";
import PageTitle from "../../../Components/Common/PageTitle";

import no_result from "../../../assets/empty-state-icon-base.png";
import { AOP_CONSTANTS } from "../../../Data/constants";

import { ThreeDotsLoader } from "../../../Components/Common/Loading/ThreeDotsLoader";

import { ANNUAL_OPS } from "../../../Data/constants";

const FiscalYearModal = ({ value, onChange, fiscalYear }) => {

  const { missionPlaceHolder } = ANNUAL_OPS;

  return (
    <>
      <Stack spacing={1}>
        <Typography>Fiscal Year: {fiscalYear}</Typography>
        <TextareaComponent
          label={'Mission'}
          placeholder={missionPlaceHolder}
          value={value}
          onChange={onChange}
        />
      </Stack>
    </>
  )
}

const AnnualOps = () => {
  const navigate = useNavigate();

  const { header, description } = ANNUAL_OPS;
  const [isLoading, setIsLoading] = useState(false);
  const [openFiscalYearModal, setOpenFiscalYearModal] = useState(false);

  const { aop, mission, fiscalYear } = useAOPStore();
  const { setMission, clearMission } = useAOPActions();
  const { getAOP, createAOP } = useAOPHook();

  const { aop_application_id } = aop || []

  const handleSaveAOP = async () => {

    const body = {
      mission,
      year: fiscalYear,
    };

    await createAOP(body, (status, message) => {

      console.log('status:', status);
      console.log('message:', message)

      if (status) {
        console.log(" AOP created successfully:", message);
        clearMission();
        setOpenFiscalYearModal(false);
        console.log(`fiscal year: ${fiscalYear}, mission: ${mission}`);
        // navigate("/aop-management");
      } else {
        console.error(" Failed to create AOP:", message);
      }
    });
  };

  useEffect(() => {
    setIsLoading(true);
    getAOP((status, message) => {
      if (!(status >= 200 && status < 300)) {
        // if status not success
        return; //Toast error
      }
      setIsLoading(false);
    });
  }, [])

  useEffect(() => {
    console.log('current aop', aop)
    console.log('aop_application_id', aop_application_id)
  }, [aop])

  return (
    <Fragment>
      <PageTitle
        title={AOP_CONSTANTS.CREATE_AOP_TITLE}
        description={AOP_CONSTANTS.CREATE_AOP_SUBHEADING}
      />
      {isLoading ? (
        <BoxComponent
          mt={3}
          height={"83vh"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignContent={"center"}
        >
          <ThreeDotsLoader />
        </BoxComponent>
      ) : (
        <>
          {aop_application_id ?
            <>render this if there are existing AOP</>
            :
            <BoxComponent
              mt={3}
              height={"83vh"}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignContent={"center"}
            >
              <Stack
                direction={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                textAlign={"center"}
                m={2}
              >
                <img src={no_result} alt="not-found-img" width={"30%"} />

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
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={2}
              >
                <ButtonComponent
                  label={"Request new items"}
                  variant={"outlined"}
                // onClick={() => navigate('create')}
                />

                <ButtonComponent
                  label={"Create new AOP"}
                  onClick={() => setOpenFiscalYearModal(true)}
                />
              </Stack>
            </BoxComponent>
          }
        </>
      )}

      <ModalComponent
        isOpen={openFiscalYearModal}
        handleClose={() => setOpenFiscalYearModal(false)}
        title={header}
        description={description}
        content={<FiscalYearModal
          fiscalYear={fiscalYear}
          value={mission}
          onChange={(e) => setMission(e.target.value)}
        />}
        hasActionButtons={true}
        rightButtonLabel={'Save AOP'}
        rightButtonAction={() => handleSaveAOP()}
        minWidth={500}
      />

    </Fragment>
  );
};

export default AnnualOps;
