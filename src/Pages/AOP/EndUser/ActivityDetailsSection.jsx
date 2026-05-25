import React from "react";

import { Stack, Box, Divider, useTheme, Typography } from "@mui/joy";
import { PhilippinePesoIcon, PlusIcon } from "lucide-react";
import { CalendarToday, CheckCircle } from "@mui/icons-material";
import moment from "moment";
import { blue } from "@mui/material/colors";

export default function ActivityDetailsSection({
  start_month,
  end_month,
  cost,
  is_gad_related,
  target,
}) {
  const theme = useTheme();

  const { first_quarter, second_quarter, third_quarter, fourth_quarter } =
    target || {};

  const formattedStartMonth = moment(start_month, "YYYY-MM").format(
    "MMMM YYYY",
  );
  const formattedEndMonth = moment(end_month, "YYYY-MM").format("MMMM YYYY");

  const timeframe = `${start_month ? formattedStartMonth : ""} - ${
    end_month ? formattedEndMonth : ""
  }`;

  const formattedPrice = (price) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(price);
  };

  const QuarterTarget = ({ quarter, value }) => (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      bgcolor="#F2F2F2"
      padding={0.5}
      borderRadius={5}
      gap={1}
    >
      <Typography level="body-xs">{quarter}</Typography>
      <Typography sx={{ fontWeight: 600 }}>{value || "0"}</Typography>
    </Stack>
  );

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-center"
      mt={3}
      spacing={3}
    >
      <Stack width="100%">
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" spacing={1} width="100%">
            <CalendarToday sx={{ fontSize: 20, color: blue[800] }} />
            <Stack>
              <Typography level="body-sm">Timeframe</Typography>
              <Typography level="title-md">{timeframe}</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} width="100%">
            <Box
              sx={{ bgcolor: blue[800] }}
              width={10}
              height={10}
              borderRadius={50}
              display="flex"
              justifyContent="center"
              alignItems="center"
              padding={1}
            >
              <PhilippinePesoIcon style={{ color: "white" }} />
            </Box>
            <Stack>
              <Typography level="body-sm">Total Cost</Typography>
              <Typography level="title-md">{formattedPrice(cost)}</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} width="100%">
            <CheckCircle sx={{ fontSize: 26, color: blue[800] }} />
            <Stack>
              <Typography level="body-sm">GAD-related activity</Typography>
              <Typography level="title-md">
                {is_gad_related === 0 ? "No" : "Yes"}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={3} alignItems="center" width="60%">
        <Typography level="body-xs" sx={{ fontWeight: 600 }}>
          Target (by quarter)
        </Typography>

        <QuarterTarget quarter="Q1" value={first_quarter} />
        <QuarterTarget quarter="Q2" value={second_quarter} />
        <QuarterTarget quarter="Q3" value={third_quarter} />
        <QuarterTarget quarter="Q4" value={fourth_quarter} />
      </Stack>
    </Stack>
  );
}
