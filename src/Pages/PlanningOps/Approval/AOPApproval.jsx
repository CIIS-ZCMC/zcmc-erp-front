import { Fragment, useEffect, useState } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import { AOP_CONSTANTS } from "../../../Data/constants";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import { Box, Grid, Link, Stack } from "@mui/joy";
import InputComponent from "../../../Components/Form/InputComponent";
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
import NoResultComponent from "../../../Components/Common/Table/NoResultComponent";
import {
  useApprovalActions,
  useApprovalLoading,
  useApprovalTimeline,
} from "../../../Hooks/AOP/AOPApprovalHook";

import useObjectivesHook from "../../../Hooks/ObjectivesHook";
import useTimelineHook from "../../../Hooks/AOP/TimelineHook";
import useTimelinesStore from "../../../Store/TimelinesStore";

import { ThreeDotsLoader } from "../../../Components/Common/Loading/ThreeDotsLoader";
import PageLoader from "../../../Components/Loading/PageLoader";
import { ThreeDots } from "react-loader-spinner";
import debounce from "lodash.debounce";

import SelectComponent from "@Components/Form/YearSelectComponent";

import useAOPStore from "../../../Store/AOPStore";
import useAOPHook from "../../../Hooks/AOP/AOPHook";

const AOPApproval = () => {
  const navigate = useNavigate();
  const { getAopYearList } = useAOPHook();
  const { getApproverTimeline, getTimelines } = useTimelineHook();
  const { timelines, approverTimelines } = useTimelinesStore();
  const { yearDetails } = useAOPStore();
  const { timelines: applicationTimelines, filters } = timelines;
  const { status_id, year: currentFiscalYear } = filters || {};
  const { next_year_included, years } = yearDetails || {};
  const [isLoading, setIsLoading] = useState(false);

  // HOOKS
  const { getAOPApplications, getAOPApplicationById } =
    useAOPApplicationsActions();
  const AOPApplications = useAOPApplications();
  const { getAOPApprovalTimeline } = useApprovalActions();

  const approvalTimeline = useApprovalTimeline();

  // const isLoading = useApprovalLoading();

  useEffect(() => {
    console.log(approverTimelines);
  }, [approverTimelines]);

  // STATES
  const [openTimelineModal, setOpenTimelineModal] = useState(false);
  const [index, setIndex] = useState(8);
  const [year, setYear] = useState(new Date().getFullYear()?.toString());
  const [search, setSearch] = useState(null);
  const [pageLoading, setPageLoading] = useState("");
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [timeline, setTimeline] = useState([]);

  // FUNCTIONS
  const handleClickCard = (id, area_code) => {
    setPageLoading(true);

    getAOPApprovalTimeline(id, () => {});
    getAOPApplicationById(id, () => {
      setPageLoading(false);
      navigate(`/aop-approval/objectives/${id}`);
    });

    localStorageSetter("aop_application_id", id);
    localStorageSetter("aop_application_area_code", area_code);
  };

  const handleViewTimeline = (id) => {
    getAOPApprovalTimeline(id, () => {
      setOpenTimelineModal(true);
    });
  };

  const yearsData = [2026, 2025];

  // console.log(yearsData)

  useEffect(() => {
    console.log(applicationTimelines);
    // console.log('year', currentFiscalYear);
    // console.log('status id ', status_id);
    // console.log('year details', yearDetails);
  }, [yearDetails, applicationTimelines]);

  useEffect(() => {
    setIsLoading(true);
    getAopYearList((status, message) => {
      if (!(status >= 200 && status < 300)) {
        // if status not success
        setIsLoading(false);
        return; //Toast error
      }

      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const debouncedFetch = debounce((params) => {
      setIsFetchLoading(true);
      getAOPApplications(params, () => {
        setIsFetchLoading(false);
      });
    }, 300);

    const params = {
      search: search,
      year: next_year_included,
      status_id: index,
    };

    debouncedFetch(params);

    return () => {
      localStorage.removeItem("all_comments");
      debouncedFetch.cancel();
    };
  }, [index, year, search, getAOPApplications]);

  const TIMELINE = TEST_MODE ? APPROVAL_TIMELINE : approvalTimeline;

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
            {/* check this  */}
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
                setValue={setSearch}
                value={search}
              />
              <Stack direction={"row"} gap={2} alignItems={"center"}>
                {next_year_included && (
                  <YearSelectorComponent
                    width="auto"
                    label={"Select year"}
                    setValue={setYear}
                    options={years}
                    value={{ year: next_year_included }}
                  />
                )}

                <Link fontSize={13} mt={3} mr={1}>
                  Clear filters
                </Link>
              </Stack>
            </Stack>
            {/* LIST */}
            <Grid
              container
              spacing={{ xs: 2, md: 2.2 }}
              columns={{ sm: 4, md: 8, xl: 12 }}
              sx={{
                flexGrow: 1,
                minHeight: "40vh",
                maxHeight: "60vh",
                overflow: "auto",
              }}
            >
              {isFetchLoading ? (
                <Box
                  display="flex"
                  alignItems={"center"}
                  justifyContent={"center"}
                  width="100%"
                  // minHeight={contentMaxHeight}
                >
                  <ThreeDots
                    visible={true}
                    // height={contentMinHeight}
                    width="80"
                    color="#003049"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </Box>
              ) : AOPApplications?.length === 0 ? (
                <Box width="100%">
                  <NoResultComponent />
                </Box>
              ) : (
                <>
                  {AOPApplications?.map(
                    ({
                      id,
                      current_timeline,
                      fiscal_year,
                      // current_user,
                      ppmp_application,
                      aop_application_id,
                      ppmp_total,
                    }) => {
                      // const { role } = current_user;
                      // const { aop_application_id } = ppmp_application;
                      const {
                        date_approved,
                        date_returned,
                        date_created,
                        status_name,
                        status_id,
                        actor,
                      } = current_timeline;

                      return (
                        <Grid key={id} item={true} xs={4}>
                          <AOPCardComponent
                            year={fiscal_year}
                            date_approved={date_approved}
                            date_requested={date_created}
                            date_returned={date_returned}
                            area_code={actor?.area}
                            statusLabel={status_name}
                            status={status_id}
                            total_cost={ppmp_total}
                            leftClick={() =>
                              handleClickCard(aop_application_id, actor?.area)
                            }
                            rightClick={() =>
                              handleViewTimeline(aop_application_id)
                            }
                          />
                        </Grid>
                      );
                    }
                  )}
                </>
              )}
            </Grid>
          </Stack>
        </ContainerComponent>
      </Stack>

      {/* APPROVAL TIMELINE */}
      {console.log(approvalTimeline)}
      <DrawerComponent
        open={openTimelineModal}
        setOpen={setOpenTimelineModal}
        title={`Approval timeline for this AOP`}
        description={"The list below shows the current status of the request."}
        content={
          <Stack mt={2} width="99%">
            {isLoading ? (
              <ThreeDotsLoader />
            ) : (
              <StepperComponent data={approvalTimeline} />
            )}
          </Stack>
        }
      />

      {/* LOADER */}
      <PageLoader isLoading={pageLoading} />
    </Fragment>
  );
};

AOPApproval.propTypes = {};

export default AOPApproval;
