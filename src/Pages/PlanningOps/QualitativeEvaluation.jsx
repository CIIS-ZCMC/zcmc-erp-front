import React, { Fragment } from "react";
import SheetComponent from "../../Components/Common/SheetComponent";
import { Table, Typography } from "@mui/joy";
import ContainerComponent from "../../Components/Common/ContainerComponent";
import ButtonComponent from "../../Components/Common/ButtonComponent";
import PageTitle from "../../Components/Common/PageTitle";
import EditableTable from "../../Components/SampleTable";

function QualitativeEvaluation({ props }) {
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
        actions={<ButtonComponent label="Create new" />}
        sx={{ mt: 3 }}
      >
        <EditableTable />
      </ContainerComponent>
    </Fragment>
  );
}

export default QualitativeEvaluation;
