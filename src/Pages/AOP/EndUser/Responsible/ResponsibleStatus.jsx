import React from "react";

import { Stack, useTheme, Typography } from "@mui/joy";
import { PlusIcon } from "lucide-react";
import moment from "moment";
import ChipComponent from "@Components/Common/ChipComponent";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import ButtonComponent from "@Components/Common/ButtonComponent";
import { RESPONSIBLE } from "../../../../Data/constants";
import { isAopDisabled } from "../../../../Utils/AopStatus";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import ActivityDetailsSection from "../ActivityDetailsSection";

const ResponsibleStatus = ({
  activity,
  openResponsibleModal,
  status,
  search,
  setSearch,
}) => {
  const { MANAGE_RESPONSIBLE_HEADER, MANAGE_RESPONSIBLE_SUBHEADER } =
    RESPONSIBLE;

  const theme = useTheme();
  const color = theme.palette;
  const { start_month, end_month, name, cost, is_gad_related, target } =
    activity || {};
  const { first_quarter, second_quarter, third_quarter, fourth_quarter } =
    target || {};

  // useEffect(() => {
  //     console.log(activity)
  // }, [activity])

  const formattedStartMonth = moment(start_month, "YYYY-MM").format(
    "MMMM YYYY",
  );
  const formattedEndMonth = moment(end_month, "YYYY-MM").format("MMMM YYYY");

  const timeframe = `${start_month ? formattedStartMonth : ""} - ${
    end_month ? formattedEndMonth : ""
  }`;

  return (
    <>
      <BoxComponent
        bgColor={color.background.surface}
        boxShadow="xs"
        padding={2}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"flex-end"}
        >
          <Stack>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <Typography level="body-md" sx={{ fontWeight: 600 }}>
                {MANAGE_RESPONSIBLE_HEADER}
              </Typography>
              <ChipComponent
                label={`Activity: ${name}`}
                color={"success"}
                variant={"outlined"}
              />
            </Stack>

            <Typography level="body-xs">
              {MANAGE_RESPONSIBLE_SUBHEADER}
            </Typography>
          </Stack>

          <Stack>
            <ButtonComponent
              label={"Assign Responsible Person"}
              startDecorator={<PlusIcon />}
              onClick={openResponsibleModal}
              disabled={isAopDisabled(status)}
            />
          </Stack>
        </Stack>

        <ActivityDetailsSection
          start_month={start_month}
          end_month={end_month}
          cost={cost}
          is_gad_related={is_gad_related}
          target={target}
        />
        <Stack mt={3} width={"350px"}>
          <SearchBarComponentv2
            value={search}
            setValue={setSearch}
            placeholder="Search responsible person/position..."
            fullWidth
          />
        </Stack>
      </BoxComponent>
    </>
  );
};

export default ResponsibleStatus;
