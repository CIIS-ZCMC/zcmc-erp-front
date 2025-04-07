import React, { Fragment } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { BiPlus } from "react-icons/bi";
import { Stack } from "@mui/joy";
import ScrollableEditableTableComponent from "../../../Components/Common/Table/ScrollableEditableTable";
import { ppmpHeaders } from "../../../Data/Columns";

function EditPPMP({ props }) {
  const sampleData = [
    {
      id: 1,
      description: "Item 1",
      classification: "Type A",
      category: "Category X",
      quantity: 100,
      unit: "pcs",
      total_amount: 5000,
      target_by_quarter: {
        jan: 100,
        feb: 100,
        mar: 100,
        apr: 100,
        may: 100,
        jun: 100,
        jul: 100,
        aug: 100,
        sep: 100,
        oct: 100,
        nov: 100,
        dec: 100,
      },
      fund_source: "Fund A",
      remarks: "No remarks",
    },
    // Add more sample rows as needed
  ];

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
      >
        <ScrollableEditableTableComponent
          columns={ppmpHeaders}
          data={sampleData}
          stickLast
        />
      </ContainerComponent>
    </Fragment>
  );
}

export default EditPPMP;
