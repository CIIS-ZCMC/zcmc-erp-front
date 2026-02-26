import ButtonComponent from "@Components/Common/ButtonComponent";
import SelectComponent from "@Components/Form/YearSelectComponent";
import { WarningAmber } from "@mui/icons-material";
import { Box, Grid, Stack, Typography, useTheme } from "@mui/joy";
import React from "react";

export default function DashboardHeader({
  years,
  dashboard = {},
  setYear,
  setOpenSave,
}) {
  const theme = useTheme();
  const color = theme.palette.custom;
  return (
    <Grid
      xs={12}
      bgcolor="#006599"
      sx={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
      p={2}
      mb={1}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        spacing={2}
      >
        <Stack width={"100%"}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography sx={{ color: "white", fontSize: 28, fontWeight: 600 }}>
              PPMP for Fiscal year
            </Typography>
            <SelectComponent
              width="120px"
              bgcolor="#004366"
              txtcolor="white"
              years={years.years}
              onChange={(value) => {
                setYear(value);
              }}
            />
          </Box>
          <Typography level="body-sm" sx={{ color: "white" }}>
            {/* Mission: This is a sample mission written by the requesting
                    body. This could be as short as a single sentence but could be
                    as long as two sentences if necessary. */}
            Mission :{" "}
            {dashboard?.mission ? dashboard?.mission : "No mission yet"}
          </Typography>
        </Stack>
        {dashboard?.ppmp_application?.status_id === 1 ||
        dashboard?.ppmp_application?.status_id === 6 ? (
          <Stack
            bgcolor={"#FFF4E5"}
            borderRadius={5}
            direction={"row"}
            alignItems="center"
            padding={2}
            spacing={1.5}
            width={"75%"}
          >
            <WarningAmber sx={{ color: color.warning, fontSize: 20 }} />
            <Box width={"100%"}>
              <Typography
                level="body-xs"
                color="warning"
                sx={{ fontWeight: 600 }}
              >
                {" "}
                Status: Draft Mode{" "}
              </Typography>
              <Typography level="body-xs" color="warning">
                This is a draft PPMP request that we’ve generated based from the
                AOP you’ve just created recently. Update the draft so you can
                submit it for approval.
              </Typography>
            </Box>
            <Box>
              <ButtonComponent
                label={
                  dashboard?.ppmp_application?.status_id === 1
                    ? "Submit AOP and PPMP for Review"
                    : "Resubmit AOP and PPMP for Review"
                }
                width="250px"
                onClick={() => setOpenSave(true)}
              />
            </Box>
          </Stack>
        ) : dashboard?.ppmp_application?.status_id === null ? (
          <Stack
            bgcolor={"#FFF4E5"}
            borderRadius={5}
            direction={"row"}
            alignItems="center"
            padding={2}
            spacing={1.5}
            width={"75%"}
          >
            <WarningAmber sx={{ color: color.warning, fontSize: 20 }} />
            <Box width={"100%"}>
              <Typography
                level="body-xs"
                color="warning"
                sx={{ fontWeight: 600 }}
              >
                {" "}
                Status: Not Generated
              </Typography>
              <Typography level="body-xs" color="warning">
                AOP for {nextYear} is missing. Submit the AOP to generate the
                PPMP and enable updates.
              </Typography>
            </Box>
          </Stack>
        ) : (
          ""
        )}
      </Stack>
    </Grid>
  );
}
