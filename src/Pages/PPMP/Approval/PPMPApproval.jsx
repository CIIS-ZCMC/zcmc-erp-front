import { Link, Stack } from "@mui/joy";
import React, { Fragment, useEffect, useState } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import { PPMP_CONSTANTS } from "../../../Data/constants";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import { ppmpReceivingTabs } from "../../../Data/Options";
import InputComponent from "../../../Components/Form/InputComponent";
import { Search } from "lucide-react";
import TabComponent from "../../../Components/Common/TabComponent";
import TableComponent from "../../../Components/Common/Table/TableComponent";
import { PPMP_REQUEST_HEADER } from "../../../Data/Columns";
import { PPMP_REQUESTS } from "../../../Data/TestData";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import { useNavigate } from "react-router-dom";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import YearSelectorComponent from "../../../Components/Form/YearSelectorComponent";
import {
  usePPMP,
  usePPMPApplicationActions,
} from "../../../Hooks/PPMP/PPMPApplicationHook";
import { usePPMPActions } from "../../../Hooks/PPMP/PPMPHook";
import useModalHook from "../../../Hooks/ModalHook";
import debounce from "lodash.debounce";

function PPMPApproval() {
  // HOOKS
  let navigate = useNavigate();
  const { getPPMPApplications, getPPMPApplicationByID } =
    usePPMPApplicationActions();
  const { ppmpApplications } = usePPMP();
  const { exportPPMP } = usePPMPActions();
  const { setAlertDialog } = useModalHook();

  // STATES
  const [index, setIndex] = React.useState("all");
  const [year, setYear] = useState(new Date().getFullYear()?.toString());
  const [dlLoader, setDlLoader] = useState(false);
  const [search, setSearch] = useState(null);
  const [isFetchLoading, setIsFetchLoading] = useState(false);

  // FUNCTIONS
  const handleOpen = (id) => {
    getPPMPApplicationByID(id, (status) => {
      if (status === 200) {
        navigate(`view/${id}`);
      }
    });
  };

  const handleExportToCSV = (id, area_details) => {
    const { code } = area_details;
    const request = { export: true, ppmp_application_id: id };

    exportPPMP(request, code, (status) => {
      if (status === 200) {
        setDlLoader(false);
        setAlertDialog({
          status: "success",
          title: "PPMP Downloaded",
          description: "PPMP has been successfully downloaded.",
        });
      } else {
        setDlLoader(false);
        setAlertDialog({
          status: "error",
          title: "PPMP Download failed",
          description: "An unexpected error occurred. Please try again.",
        });
      }
    });
  };

  useEffect(() => {
    const debouncedFetch = debounce((params) => {
      setIsFetchLoading(true);
      getPPMPApplications(params, () => {
        setIsFetchLoading(false);
      });
    }, 300);

    const params = {
      status: index === "all" ? null : index,
      year,
      search,
    };

    debouncedFetch(params);

    return () => {
      debouncedFetch.cancel();
    };
  }, [index, year, search, getPPMPApplications]);

  return (
    <Fragment>
      <Stack gap={3}>
        <PageTitle
          title={PPMP_CONSTANTS?.PPMP_RECEIVE_TITLE}
          description={PPMP_CONSTANTS?.PPMP_RECEIVE_SUBHEADING}
        />

        <ContainerComponent
          title={"List of requests"}
          description={
            "The following requests below have undergone all necessary approvals."
          }
        >
          <Stack gap={3} mt={3}>
            <TabComponent
              tabs={ppmpReceivingTabs}
              index={index}
              setIndex={setIndex}
            />

            <Stack
              direction={"row"}
              gap={2}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
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

            <ScrollableTableComponent
              isLoading={isFetchLoading}
              columns={PPMP_REQUEST_HEADER(handleOpen, handleExportToCSV)}
              data={ppmpApplications}
            />
          </Stack>
        </ContainerComponent>
      </Stack>
    </Fragment>
  );
}

export default PPMPApproval;
