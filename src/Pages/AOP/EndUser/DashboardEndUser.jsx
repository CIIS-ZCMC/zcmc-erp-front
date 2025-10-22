import ButtonComponent from "@Components/Common/ButtonComponent";
import { Box, Stack, Typography, useTheme } from "@mui/joy";
import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import no_result from "../../../assets/empty-state-icon-base.svg";
import { ANNUAL_OPS } from "../../../Data/constants";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import TextareaComponent from "@Components/Form/TextareaComponent";
import { Warning } from "@mui/icons-material";
import InputComponent from "@Components/Form/InputComponent";
import {
  useMission,
  useObjectivesActions,
} from "../../../Store/ObjectivesStore";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import { TbTargetArrow } from "react-icons/tb";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import YearSelectorComponent from "@Components/Form/YearSelectorComponent";
import SelectComponent from "@Components/Form/YearSelectComponent";

const FiscalYearModal = ({ value, onChange, fiscalYear }) => {
  const { missionPlaceHolder } = ANNUAL_OPS;
  const theme = useTheme();
  const color = theme.palette.custom;

  return (
    <>
      <Stack spacing={2}>
        <InputComponent
          label={"Fiscal Year"}
          fontWeight={500}
          value={fiscalYear}
          disabled
        />
        <TextareaComponent
          label={"Mission"}
          placeholder={missionPlaceHolder}
          value={value}
          onChange={onChange}
        />
        <Stack
          direction="row"
          spacing={2}
          bgcolor="#FFF4E5"
          p={2}
          borderRadius={8}
        >
          <Box>
            <Warning sx={{ color: color.warning, fontSize: 20 }} />
          </Box>
          <Typography color="warning" level="body-xs">
            After creating this new AOP, you’ll need to define its details such
            as functions, objectives, activities, resources and responsible
            persons before formal submission. This AOP will remain in draft mode
            until all required information is completed and submitted for
            review.
          </Typography>
        </Stack>
      </Stack>
    </>
  );
};

function DashboardEndUser(props) {
  const navigate = useNavigate();
  const [openFiscalYearModal, setOpenFiscalYearModal] = useState(false);
  const { header, description } = ANNUAL_OPS;
  const mission = useMission();
  const { setMission, clearMission } = useObjectivesActions();
  const [year, setYear] = useState("");

  const currentYear = new Date().getFullYear();
  const currentFiscalYear = currentYear + 1;

  const handleSaveAOP = () => {
    // alert('successfully created new aop')
    clearMission();
    setOpenFiscalYearModal(false);
    console.log(`fiscal year : ${currentFiscalYear} mission: ${mission}`);
    navigate("/aop-management");
    //handle Save aop api here
  };
  const startYear = 2024;

  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i
  );

  return (
    <Fragment>
      {console.log(mission)}
      {mission !== "" ? (
        <Fragment>
          <Stack>
            <Typography level="h2">Annual Operations Planning</Typography>
            <Typography level="body-xs">
              The following below serves as the summary of your AOP request. You
              can open and update your request before the deadline as set by the
              administrators.
            </Typography>
          </Stack>
          <BoxComponent mt={3}>
            <Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                bgcolor="#006599"
                padding={3}
                sx={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
              >
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography level="h3" sx={{ color: "white" }} width="100%">
                      AOP for Fiscal year
                    </Typography>
                    <Box>
                      <SelectComponent
                        bgcolor="#004366"
                        txtcolor="white"
                        width="100px"
                        size="lg"
                        onChange={setYear}
                      />
                    </Box>
                  </Stack>

                  <Typography level="body-xs" sx={{ color: "white" }}>
                    Mission: {mission}
                  </Typography>
                </Box>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="stretch"
                bgcolor="#FAFAFA"
                paddingX={5}
                paddingY={5}
                sx={{
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
                gap={2}
              >
                <BoxComponent width="100%" padding={2}>
                  <Typography fontWeight={600} pb={2} fontSize={20}>
                    Plan summary:
                  </Typography>
                  <Stack direction={"row"} spacing={2} alignItems="flex-end">
                    <BoxComponent width="100%">
                      <Typography
                        fontSize={16}
                        fontWeight={600}
                        py={1}
                      ></Typography>
                      <Stack direction="row" alignItems="flex-start" gap={1}>
                        <TbTargetArrow
                          style={{
                            fontSize: 25,
                            marginTop: "5px",
                            color: "#666666",
                          }}
                        />

                        <Typography>Contained from </Typography>
                      </Stack>
                    </BoxComponent>
                    <BoxComponent width="100%">
                      <Typography
                        fontSize={16}
                        fontWeight={600}
                        py={1}
                      ></Typography>
                      <Stack direction="row" alignItems="flex-start" gap={1}>
                        <MdOutlineShoppingCartCheckout
                          style={{
                            fontSize: 25,
                            marginTop: "5px",
                            color: "#666666",
                          }}
                        />
                        <Typography>
                          With a PPMP total of{" "}
                          <b style={{ color: "#004366" }}></b>
                        </Typography>
                      </Stack>
                    </BoxComponent>
                  </Stack>
                </BoxComponent>

                <BoxComponent width="100%" padding={2}>
                  <Stack gap={3} alignItems="start">
                    <Typography fontWeight={600} fontSize={20} align="left">
                      About your PPMP
                    </Typography>
                    <Typography>
                      This is a draft PPMP request that we’ve generated based
                      from the AOP you’ve just created recently. Update the
                      draft so you can submit it for approval.
                    </Typography>
                    <ButtonComponent
                      label={"View PPMP"}
                      // onClick={() => handleNavigate()}
                      width="auto"
                      boxShadow={"2px 3px 4px #D3D3D3"}
                    />
                  </Stack>
                </BoxComponent>
              </Stack>
            </Stack>
          </BoxComponent>
        </Fragment>
      ) : (
        <Fragment>
          <Stack>
            <Typography level="h2">
              Enterprise Resource Planning System
            </Typography>
            <Typography level="body-xs">Sample description</Typography>
          </Stack>

          <Stack
            height="85vh"
            sx={{
              border: "2px solid #003049",
              borderRadius: 10,
              bgcolor: "white",
            }}
            alignItems="center"
            justifyContent="center"
            mt={3}
            gap={2}
          >
            <img src={no_result} alt="not-found-img" width={300} />

            <Box>
              <Typography fontSize={24} textAlign="center">
                You don't have an AOP for this year yet.{" "}
              </Typography>
              <Typography
                sx={{ color: "#003049", fontSize: 24, fontWeight: "bold" }}
                textAlign="center"
              >
                Begin by creating a new AOP.
              </Typography>
            </Box>

            <Typography width={"35%"} textAlign="center">
              Nothing to show yet for this year’s PPMP. You may request new
              items for the meantime or create a new AOP request.
            </Typography>
            <Stack direction="row" gap={1}>
              <ButtonComponent label="Request new items" variant="outlined" />
              <ButtonComponent
                label="Create New AOP"
                variant="solid"
                onClick={() => setOpenFiscalYearModal(true)}
              />
            </Stack>
          </Stack>

          <ModalComponent
            isOpen={openFiscalYearModal}
            handleClose={() => setOpenFiscalYearModal(false)}
            title={header}
            description={description}
            content={
              <FiscalYearModal
                fiscalYear={currentFiscalYear}
                value={mission}
                onChange={(e) => setMission(e.target.value)}
              />
            }
            hasActionButtons={true}
            rightButtonLabel={"Save AOP"}
            rightButtonAction={() => handleSaveAOP()}
            maxWidth={500}
          />
        </Fragment>
      )}
    </Fragment>
  );
}

export default DashboardEndUser;
