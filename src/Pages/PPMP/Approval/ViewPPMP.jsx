import ExpandableTable from "@Components/Common/Table/ExpandableTable";
import {
  usePPMP,
  usePPMPApplicationActions,
} from "../../../Hooks/PPMP/PPMPApplicationHook";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { PPMP_APPROVER_HEADERS } from "../../../Data/Columns";
import { Stack, Typography } from "@mui/joy";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import PageTitle from "@Components/Common/PageTitle";

function ViewPPMP() {
  const { id } = useParams();
  const { getPPMPApplicationByID } = usePPMPApplicationActions();
  const { ppmpApplicationItems, ppmpApplication, isLoading } = usePPMP();

  const [search, setSearch] = useState("");

  const filteredPPMPItems = useMemo(() => {
    if (!search) return ppmpApplicationItems;
    return ppmp?.filter((item) =>
      item.item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, ppmpApplicationItems]);

  useEffect(() => {
    getPPMPApplicationByID(id, () => {});
  }, []);
  return (
    <Fragment>
      <PageTitle title={"PPMP"} />
      <BoxComponent my={2} bgColor={"#FAFAF9"} boxShadow="xs" p={2}>
        <Stack direction={"row"} justifyContent={"space-between"} mb={2}>
          <Stack spacing={1}>
            <Stack direction={"row"} gap={1.5}>
              <Typography level="body-md" sx={{ fontWeight: 600 }}>
                Project Procurement Management Plan
              </Typography>
            </Stack>
            <Typography level="body-xs">
              The below contains a list of resources synced from your submitted
              AOP request. Click a row to expand and view more details.
            </Typography>
          </Stack>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <SearchBarComponentv2
            value={search}
            setValue={setSearch}
            placeholder="Search resources..."
            fullWidth
          />
          <BoxComponent px={2} py={0.5} bgColor={"white"} borderRadius={10}>
            <Typography
              textTransform={"uppercase"}
              level="body-xs"
              color="primary"
              textAlign={"right"}
            >
              Total Cost
            </Typography>
            <Typography
              textTransform={"uppercase"}
              level="body-lg"
              color="primary"
              textAlign={"right"}
              fontWeight={600}
            >
              &#8369;{" "}
              {ppmpApplication?.ppmp_total?.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </BoxComponent>
        </Stack>
      </BoxComponent>
      <ExpandableTable
        columns={PPMP_APPROVER_HEADERS()}
        rows={filteredPPMPItems}
        renderExpanded={(row) => (
          <>
            <Typography>Hello</Typography>
          </>
        )}
      />
    </Fragment>
  );
}

export default ViewPPMP;
