import React, { Fragment } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { BiPlus } from "react-icons/bi";
import { Stack } from "@mui/joy";

function EditPPMP({ props }) {
  return (
    <Fragment>
      <PageTitle
        title={"Edit PPMP"}
        description={"Edit you unit's Project Procurement Management Plan"}
      />
      <ContainerComponent
        title={"List of items"}
        description={
          "This is a subheading. It should add more context to the interaction."
        }
        sx={{ mt: 3 }}
        actions={
          <Stack direction={"row"} spacing={1}>
            <ButtonComponent
              label={"Read comments"}
              color="success"
              variant={"outlined"}
            />
            <ButtonComponent
              label={"Add resources"}
              color="success"
              variant={"outlined"}
              endDecorator={<BiPlus />}
            />
          </Stack>
        }
      ></ContainerComponent>
    </Fragment>
  );
}

export default EditPPMP;
