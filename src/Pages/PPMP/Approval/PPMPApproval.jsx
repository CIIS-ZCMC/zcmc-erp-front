import { Link, Stack } from "@mui/joy";
import React, { Fragment, useState } from "react";
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

function PPMPApproval() {
  // HOOKS
  let navigate = useNavigate();

  // STATES
  const [index, setIndex] = React.useState("all");
  // FUNCTIONS
  const handleOpen = (id) => {
    navigate(`view/${id}`);
  };

  const handleDelete = (id) => {};

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
              />

              <Stack direction={"row"} gap={2} alignItems={"center"}>
                <YearSelectorComponent
                  width="auto"
                  label={"Select year"}
                  // setValue={setYear}
                  // value={{ year: year }}
                />
                <Link fontSize={13} mt={3} mr={1}>
                  Clear filters
                </Link>
              </Stack>
            </Stack>

            <ScrollableTableComponent
              columns={PPMP_REQUEST_HEADER(handleOpen, handleDelete)}
              data={PPMP_REQUESTS}
            />
          </Stack>
        </ContainerComponent>
      </Stack>
    </Fragment>
  );
}

export default PPMPApproval;
