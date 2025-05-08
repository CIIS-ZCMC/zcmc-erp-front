import React, { Fragment, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import PageTitle from "../../../Components/Common/PageTitle";
import { AOP_CONSTANTS } from "../../../Data/constants";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import { Grid, Link, Stack } from "@mui/joy";
import InputComponent from "../../../Components/Form/InputComponent";
import DatePickerComponent from "../../../Components/Form/DatePickerComponent";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useAOPApplications,
  useAOPApplicationsActions,
} from "../../../Hooks/AOP/AOPApplicationsHook";
import AOPCardComponent from "../../../Components/Common/Card/AOPCardComponent";
import { toCapitalize } from "../../../Utils/Typography";
import { TEST_MODE } from "../../../Services/Config";
import { APPROVAL_TIMELINE, MANAGE_AOP_APPROVAL } from "../../../Data/TestData";
import { localStorageSetter } from "../../../Utils/LocalStorage";
import DrawerComponent from "../../../Components/Common/DrawerComponent";
import StepperComponent from "../../../Components/Stepper/StepperComponent";
import TabComponent from "../../../Components/Common/TabComponent";
import { approvalPageTabs } from "../../../Data/Options";
import YearSelectorComponent from "../../../Components/Form/YearSelectorComponent";

const AOPApproval = () => {
  const navigate = useNavigate();

  // HOOKS
  const { getAOPApplications, getAOPApplicationById } =
    useAOPApplicationsActions();
  const AOPApplications = useAOPApplications();

  // STATES
  const [openTimelineModal, setOpenTimelineModal] = useState(false);
  const [index, setIndex] = useState("all");
  const [year, setYear] = useState(new Date().getFullYear());
  // const [search, setSearch] = useState("");

  // FUNCTIONScccccccccccccccccccccccccccc
  const handleClickCard = (id) => {
    getAOPApplicationById(id, () => navigate(`/aop-approval/objectives/${id}`));
    localStorageSetter("aop_application_id", id);
  };

  const handleViewTimeline = (id) => {
    setOpenTimelineModal(true);
  };

  useEffect(() => {
    const params = {
      status: index == "all" ? null : index,
      year: year,
    };

    getAOPApplications(params, () => {});
  }, [index, year, getAOPApplications]);

  const APPLICATIONS = TEST_MODE ? MANAGE_AOP_APPROVAL : AOPApplications;

  return (
    <Fragment>
      <Stack gap={3}>
        <PageTitle
          title={AOP_CONSTANTS?.AOP_TITLE}
          description={AOP_CONSTANTS?.AOP_REQUEST_SUBHEADING}
        />

        <ContainerComponent
          title={"List of AOP requests"}
          description={
            "Each area can have only one request per year. Open a request to begin processing."
          }
        >
          <Stack gap={3} mt={3}>
            <TabComponent
              tabs={approvalPageTabs}
              index={index}
              setIndex={setIndex}
            />
            <Stack direction={"row"} justifyContent={"space-between"}>
              <InputComponent
                label={"Search"}
                placeholder="Find records by document number, year, items, etc."
                width={400}
                color="primary"
                startDecorator={<Search size={14} />}
              />

              <Stack direction={"row"} gap={2} alignItems={"center"}>
                <YearSelectorComponent
                  width="auto"
                  label={"Select year"}
                  setValue={setYear}
                  value={{ year: year }}
                />
                <Link fontSize={13} mt={3} mr={1}>
                  Clear filters
                </Link>
              </Stack>
            </Stack>
            {/* LIST */}
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ sm: 4, md: 8, xl: 12 }}
              sx={{
                flexGrow: 1,
                minHeight: "40vh",
                maxHeight: "60vh",
                overflow: "auto",
              }}
            >
              {APPLICATIONS?.map(
                (
                  { id, created_on, date_approved, area_code, status },
                  index
                ) => (
                  <Grid key={index} item="true" xs={4}>
                    <AOPCardComponent
                      date_requested={created_on}
                      date_approved={date_approved}
                      status={status}
                      area_code={area_code ?? "-"}
                      statusLabel={toCapitalize(status)}
                      leftClick={() => handleClickCard(id)}
                      rightClick={() => handleViewTimeline(id)}
                    />
                  </Grid>
                )
              )}
            </Grid>
          </Stack>
        </ContainerComponent>
      </Stack>

      {/* APPROVAL TIMELINE */}
      <DrawerComponent
        open={openTimelineModal}
        setOpen={setOpenTimelineModal}
        title={`Approval timeline for this AOP`}
        description={"The list below shows the current status of the request."}
        content={
          <Stack mt={2} width="99%">
            <StepperComponent data={APPROVAL_TIMELINE} />
          </Stack>
        }
      />
    </Fragment>
  );
};

AOPApproval.propTypes = {};

export default AOPApproval;
