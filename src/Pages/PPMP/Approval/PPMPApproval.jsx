import { Stack } from "@mui/joy";
import React from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import { PPMP_CONSTANTS } from "../../../Data/constants";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import { ppmpReceivingTabs } from "../../../Data/Options";
import InputComponent from "../../../Components/Form/InputComponent";
import { Search } from "lucide-react";
import TabComponent from "../../../Components/Common/TabComponent";
import TableComponent from "../../../Components/Common/Table/TableComponent";

function PPMPApproval() {
  const [index, setIndex] = React.useState("all");
  return (
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

          <InputComponent
            label={"Search"}
            placeholder="Find records by document number, year, items, etc."
            width={400}
            color="primary"
            startDecorator={<Search size={14} />}
          />

          <TableComponent />
        </Stack>
      </ContainerComponent>
    </Stack>
  );
}

export default PPMPApproval;
