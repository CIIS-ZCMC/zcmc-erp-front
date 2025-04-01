import React, { Fragment } from "react";
import SheetComponent from "../../../Components/Common/SheetComponent";
import { Table, Typography } from "@mui/joy";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import PageTitle from "../../../Components/Common/PageTitle";
import { green } from "@mui/material/colors";


function Objectives({ props }) {
  return (
    <Fragment>
      <PageTitle
        title="Objectives and Success Indicators"
        description="This is a subheading. It should add more context to the interaction."
      />

      <ContainerComponent
        title={"List of Objectives and Success Indicators"}
        description={
          "This is a subheading. It should add more context to the interaction."
        }
        actions={<ButtonComponent label="Create new" color="success" />}
        sx={{ mt: 3 }}
      ></ContainerComponent>
    </Fragment>
  );
}

export default Objectives;

