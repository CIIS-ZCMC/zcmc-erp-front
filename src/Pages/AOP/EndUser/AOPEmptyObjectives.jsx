import React from "react";

import { Box, Stack, Skeleton, Typography, Grid } from "@mui/joy";

import BoxComponent from "@Components/Common/Card/BoxComponent";
import ButtonComponent from "@Components/Common/ButtonComponent";

import { AOP } from "../../../Data/constants";
import { useTheme } from "@mui/material";
import { Divider } from "@mui/joy";

const AOPEmptyObjectives = ({ isLoading, handleNavigate }) => {
  const { AOP_EMPTY_OBJECTIVE_TITLE, AOP_EMPTY_OBJECTIVE_DESC } = AOP;

  const theme = useTheme();
  const color = theme.palette.custom;

  return (
    <Grid container spacing={2}>
      <Grid xs={8}>
        <BoxComponent
          justifyContent="center"
          alignItems="center"
          height="59vh"
          display="flex"
          padding={2}
        >
          <Box textAlign="center">
            <Stack direction={"column"} mb={2}>
              <Skeleton loading={isLoading} animation="wave" variant="text" />

              <Skeleton loading={isLoading} animation="wave" variant="text" />
            </Stack>

            {!isLoading && (
              <>
                <Typography>{AOP_EMPTY_OBJECTIVE_TITLE}</Typography>

                <Typography fontWeight={600} mb={2}>
                  {AOP_EMPTY_OBJECTIVE_DESC}
                </Typography>
              </>
            )}

            <ButtonComponent
              isLoading={isLoading}
              label={"Go to Manage Objectives"}
              onClick={handleNavigate}
            />
          </Box>
        </BoxComponent>
      </Grid>
      <Grid xs={4}>
        <BoxComponent height="59vh" padding={2}>
          <Typography level="title-lg">Approval Timeline</Typography>
          <Typography level="body-xs" mt={0.5} sx={{ color: color.fontLight }}>
            {" "}
            The list below shows the current status of the request.
          </Typography>
          <Divider sx={{ my: 1, color: "gray" }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            height={"50vh"}
          >
            <Typography level="body-sm" sx={{ color: color.fontLight }}>
              No transactions done yet.
            </Typography>
          </Box>
        </BoxComponent>
      </Grid>
    </Grid>
  );
};

export default AOPEmptyObjectives;
