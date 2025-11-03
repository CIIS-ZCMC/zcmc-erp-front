import React, { Fragment } from "react";
import PropTypes from "prop-types";
import PageTitle from "@Components/Common/PageTitle";
import {
  Box,
  Breadcrumbs,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import { blue, grey, red } from "@mui/material/colors";
import ChipComponent from "@Components/Common/ChipComponent";
import {
  Book,
  CalendarMonth,
  CalendarMonthTwoTone,
  CalendarToday,
  CheckCircle,
} from "@mui/icons-material";
import {
  Calendar1Icon,
  CalendarIcon,
  Circle,
  PhilippinePeso,
  PhilippinePesoIcon,
  PlusIcon,
} from "lucide-react";
import ButtonComponent from "@Components/Common/ButtonComponent";
import { useNavigate } from "react-router-dom";
import ResourceCardComponent from "@Components/Resources/ResourceCardComponent";

function ManageResources(props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const color = theme.palette;
  const currentYear = new Date().getFullYear();
  const currentFiscalYear = currentYear + 1;

  const data = [
    {
      label: "Timeframe",
      value: " August - September",
      icon: <CalendarToday sx={{ fontSize: 30, color: blue[800] }} />,
    },
    {
      label: "Total Cost",
      value: " ₱ 500,000.00",
      icon: <PhilippinePesoIcon style={{ fontSize: 30, color: blue[800] }} />,
    },
    {
      label: "Expense class",
      value: "MOOE",
      icon: <Book sx={{ fontSize: 30, color: blue[800] }} />,
    },
    { label: "GAD-related activity", value: "Yes" },
  ];
  return (
    <Fragment>
      <Stack spacing={1}>
        <PageTitle
          title={`AOP for Fiscal Year ${currentFiscalYear}`}
          description={
            "The following below serves as the summary of your AOP request. You can open and update your request before the deadline as set by the administrators."
          }
          items={[
            { label: "Objectives", path: "/objectives" },
            { label: "Activities", path: "/activities" },
            { label: "Resources", path: "/manage-resources", current: true },
          ]}
        />

        <BoxComponent bgColor={color.neutralBg} padding={2}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Stack>
              <Stack direction={"row"} spacing={1}>
                <Typography level="body-md" sx={{ fontWeight: 600 }}>
                  Manage Resources for
                </Typography>
                <ChipComponent
                  label={"Activity: Procure Equipment and Tools"} // change to dynamic activity name
                  color={"success"}
                  variant={"outlined"}
                />
              </Stack>
              <Typography level="body-sm">
                {" "}
                Manage and allocate all resource requirements for this activity.
                Add, edit, or review items to ensure accurate budgeting and
                procurement details.
              </Typography>
            </Stack>

            <Stack>
              <ButtonComponent
                label={"Add a resource"}
                startDecorator={<PlusIcon />}
                onClick={() => navigate("select-resources")}
              />
            </Stack>
          </Stack>

          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            spacing={2}
            mt={3}
          >
            <Stack width={"100%"}>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Stack direction={"row"} spacing={1} width="100%">
                  <CalendarToday sx={{ fontSize: 30, color: blue[800] }} />{" "}
                  <Stack>
                    <Typography level="body-sm">Timeframe</Typography>
                    <Typography level="title-md">August - September</Typography>
                  </Stack>
                </Stack>
                <Stack direction={"row"} spacing={1} width="100%">
                  <Box
                    sx={{ bgcolor: blue[800] }}
                    width={15}
                    height={15}
                    borderRadius={50}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    padding={1}
                  >
                    <PhilippinePesoIcon style={{ color: "white" }} />{" "}
                  </Box>
                  <Stack>
                    <Typography level="body-sm">Total Cost</Typography>
                    <Typography level="title-md">₱ 500,000.00</Typography>
                  </Stack>
                </Stack>

                <Stack direction={"row"} spacing={1} width="100%">
                  <CheckCircle sx={{ fontSize: 30, color: blue[800] }} />{" "}
                  <Stack>
                    <Typography level="body-sm">
                      GAD-related activity
                    </Typography>
                    <Typography level="title-md">Yes</Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Divider sx={{ my: 2, backgroundColor: grey }} />
            </Stack>
          </Stack>

          <Stack direction={"row"} spacing={1} alignItems={"center"}>
            <Typography level="body-xs" sx={{ fontWeight: 600 }}>
              Target (by quarter){" "}
            </Typography>
            <Stack
              direction={"row"}
              spacing={1}
              alignItems={"center"}
              bgcolor={"#F2F2F2"}
              padding={0.5}
              borderRadius={5}
            >
              <Typography level="body-xs">Q1</Typography>
              <Typography sx={{ fontWeight: 600 }}>200</Typography>
            </Stack>
          </Stack>
        </BoxComponent>

        <BoxComponent
          borderColor={grey[300]}
          height={"60vh"}
          borderRadius={10}
          justifyContent={"center"}
          alignItems={"center"}
          display={"flex"}
          flexDirection={"column"}
        >
          <ResourceCardComponent />
          <Typography level="title-md">No resources yet.</Typography>
          <Typography level="body-sm">
            Start by adding the materials, equipment, or other resources needed
            for this activity.
          </Typography>
          <Typography level="body-sm" mb={1}>
            Click “Add a Resource” to begin.
          </Typography>
          <ButtonComponent
            startDecorator={<PlusIcon />}
            label={"Add a resource"}
            onClick={() => navigate("select-resources")}
          />
        </BoxComponent>
      </Stack>
    </Fragment>
  );
}

ManageResources.propTypes = {};

export default ManageResources;
