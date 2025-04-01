import React, { Fragment } from "react";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import EditableTableComponent from "../../../Components/Common/Table/EditableTableComponent";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import PageTitle from "../../../Components/Common/PageTitle";

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
        actions={<ButtonComponent label="Create new" />}
        sx={{ mt: 3 }}
      >
        <EditableTableComponent />
      </ContainerComponent>
    </Fragment>
  );
}

export default Objectives;
