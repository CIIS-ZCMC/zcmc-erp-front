import ButtonComponent from "@Components/Common/ButtonComponent";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import ChipComponent from "@Components/Common/ChipComponent";
import ContainerComponent from "@Components/Common/ContainerComponent";
import PageTitle from "@Components/Common/PageTitle";
import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import { Add, Check } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/joy";
import { nextYear } from "@Utils/Functions";
import React, { Fragment } from "react";
import CountUp from "react-countup";

function BudgetDeliberation() {
  return (
    <Fragment>
      <PageTitle title={`PPMP for Fiscal Year ${nextYear}`} />
      <BoxComponent
        mt={2}
        display={"flex"}
        justifyContent={"space-between"}
        bgColor={"#FAFAF9"}
        boxShadow="xs"
      >
        <Stack spacing={2}>
          <Stack>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Typography level="title-md" fontWeight={600}>
                Manage Resources for{" "}
              </Typography>
              <ChipComponent
                label={`PPMP Fiscal Year ${nextYear}`}
                color={"success"}
                variant={"outlined"}
              />
            </Stack>
            <Typography level="body-sm">
              The below contains a list of resources synced from your submitted
              AOP request. Click a row to expand and view more details.
            </Typography>
          </Stack>

          <Stack direction={"row"} spacing={2} alignItems={"end"}>
            <SearchBarComponentv2 size="sm" fullWidth />
            <AutocompleteComponent placeholder="Filter by category" />
          </Stack>
        </Stack>
        <Stack spacing={1} alignItems={"flex-end"}>
          <Stack direction={"row"} spacing={2}>
            <ButtonComponent
              label={"Save All Changes"}
              color="warning"
              startDecorator={<Check />}
            />
            <ButtonComponent
              label={"Add a Resource"}
              color="primary"
              startDecorator={<Add />}
            />
          </Stack>
          <BoxComponent px={2} py={1} bgColor={"white"} borderRadius={10}>
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
              fontSize={25}
              color="primary"
              textAlign={"right"}
              fontWeight={600}
            >
              &#8369;{" "}
              <CountUp
                start={0}
                end={0}
                duration={1.5} // duration in seconds
                separator=","
                decimals={2}
                decimal="."
                prefix=""
              />
            </Typography>
          </BoxComponent>
        </Stack>
      </BoxComponent>
    </Fragment>
  );
}

export default BudgetDeliberation;
