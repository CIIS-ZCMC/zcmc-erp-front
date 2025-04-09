import React, { Fragment, useState } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { BiPlus } from "react-icons/bi";
import { Stack } from "@mui/joy";
import ScrollableEditableTableComponent from "../../../Components/Common/Table/ScrollableEditableTable";
import { ppmpHeaders } from "../../../Data/Columns";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import AutocompleteComponent from "../../../Components/Form/AutocompleteComponent";

const sampleData = [
  {
    id: 1,
    description: "Item 1",
    classification: "Type A",
    estimated_budget: 5000,
    category: "Category X",
    quantity: 0,
    unit: "pcs",
    total_amount: 0,
    target_by_quarter: {
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
    },
    fund_source: "Fund A",
    remarks: "No remarks",
  },
  {
    id: 3,
    description: "Item 2",
    classification: "Type B",
    category: "Category X",
    estimated_budget: 5000,
    quantity: 0,
    unit: "pcs",
    total_amount: 0,
    target_by_quarter: {
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
    },
    fund_source: "Fund A",
    remarks: "No remarks",
  },
  {
    id: 2,
    description: "Item 3",
    classification: "Type C",
    category: "Category X",
    estimated_budget: 5000,
    quantity: 0,
    unit: "pcs",
    total_amount: 0,
    target_by_quarter: {
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
    },
    fund_source: "Fund A",
    remarks: "No remarks",
  },
  // Add more sample rows as needed
];

const descriptionsData = [
  {
    label: "Option1",
    classification: "Medical Supply",
    category: "Consumable",
    unit: "Bottle",
  },
  {
    label: "Option2",
    classification: "Medical Equipment",
    category: "Non-consumable",
    unit: "Piece",
  },
];

function EditPPMP({ props }) {
  const [tableData, setTableData] = useState(sampleData);
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const calculateQuantity = (targetByQuarter) => {
    // Sum the values from January to December
    return Object.values(targetByQuarter).reduce(
      (sum, value) => sum + value,
      0
    );
  };

  const handleFieldChange = (fieldName, newValue, row, updateRow) => {
    if (fieldName === "description") {
      setLoadingDescription(true);
      const selected = descriptionsData.find((item) => item.label === newValue);
      console.log(selected);

      setTimeout(() => {
        if (selected) {
          updateRow({
            ...row,
            description: newValue,
            classification: selected.classification,
            category: selected.category,
          });
        } else {
          updateRow({
            ...row,
            description: newValue,
            classification: "",
            category: "",
          });
        }
        setLoadingDescription(false);
      }, 1000);
    } else if (fieldName.includes("target_by_quarter")) {
      // Handle the change in target_by_quarter (i.e., the monthly values)
      const updatedTarget = {
        ...row.target_by_quarter,
        [fieldName.split(".")[1]]: parseInt(newValue),
      };
      const updatedQuantity = calculateQuantity(updatedTarget);
      const newTotalAmount =
        updatedQuantity * (parseFloat(row.estimated_budget) || 0);

      updateRow({
        ...row,
        target_by_quarter: updatedTarget,
        quantity: updatedQuantity, // Update the quantity field
        total_amount: newTotalAmount,
      });
      // Simulate loading delay
    } else if (fieldName === "quantity") {
      const newQuantity = parseFloat(newValue) || 0;
      const newTotalAmount =
        newQuantity * (parseFloat(row.estimated_budget) || 0);

      updateRow({
        ...row,
        quantity: newQuantity,
        total_amount: newTotalAmount,
      });
    } else {
      updateRow({
        ...row,
        [fieldName]: newValue,
      });
    }
  };

  const handleDeleteRow = (id) => {
    setTableData((prevRows) => prevRows.filter((row) => row.id !== id));
  };

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
              onClick={() => setOpenAdd(true)}
            />
          </Stack>
        }
      >
        <ScrollableEditableTableComponent
          columns={ppmpHeaders(handleDeleteRow)}
          data={tableData}
          onFieldChange={handleFieldChange}
          isLoading={loadingDescription}
          options={descriptionsData}
          stripe={"even"}
          stickLast
          stickSecond
        />
      </ContainerComponent>
      <ModalComponent
        isOpen={openAdd}
        handleClose={() => setOpenAdd(false)}
        title={"On what activity shall we assign the resources you’ll add?"}
        description={
          "Select a request status and reasons (if returned) to continue. You may add remarks if necessary."
        }
        content={
          <Fragment>
            <AutocompleteComponent label={"Select one activity"} />
          </Fragment>
        }
        leftButtonLabel="Cancel"
        rightButtonLabel="Continue"
        rightButtonAction={() => setOpenAdd(false)}
      />
    </Fragment>
  );
}

export default EditPPMP;
