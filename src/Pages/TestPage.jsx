import React from "react";
import ObjectivesList from "./PlanningOps/Approval/Contents/ObjectivesList";
import { Grid } from "@mui/joy";
import ContainerComponent from "../Components/Common/ContainerComponent";

export const TestPage = () => {
  return (
    <Grid
      container
      columns={{ xs: 4, sm: 4, md: 4, lg: 12 }}
      columnSpacing={{ md: 0, lg: 3 }}
      rowSpacing={{ xs: 1, sm: 3, md: 1 }}
    >
      <Grid item="true" xs={4}>
        <ContainerComponent>
          <ObjectivesList />
        </ContainerComponent>
      </Grid>
    </Grid>
  );
};
