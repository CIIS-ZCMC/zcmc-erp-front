import React, { Fragment, useState } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { BiPlus } from "react-icons/bi";
import { Autocomplete, Divider, Stack, Typography } from "@mui/joy";
import ScrollableEditableTableComponent from "../../../Components/Common/Table/ScrollableEditableTable";
import { ppmpHeaders } from "../../../Data/Columns";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import AutocompleteComponent from "../../../Components/Form/AutocompleteComponent";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const sampleData = [
  {
    id: 1,
    item_code: "ITM001",
    activity_code: "ACT001",
    activity_id: 1,
    expense_class_id: 1,
    description: "Item 1",
    classification: "Type A",
    estimated_budget: 5000,
    category: "Category X",
    aop_quantity: 50,
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
    item_code: "ITM002",
    activity_code: "ACT002",
    activity_id: 1,
    expense_class_id: 1,
    description: "Item 2",
    classification: "Type B",
    category: "Category X",
    estimated_budget: 5000,
    aop_quantity: 50,
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
    item_code: "ITM003",
    activity_code: "ACT003",
    activity_id: 1,
    expense_class_id: 1,
    description: "Item 3",
    classification: "Type C",
    category: "Category X",
    estimated_budget: 5000,
    aop_quantity: 50,
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

const activityData = [
  {
    value: 1,
    label: "#0001",
    description: "Sample description for activity 1",
  },
  {
    value: 2,
    label: "#0002",
    description: "Sample description for activity 2",
  },
  {
    value: 3,
    label: "#0003",
    description: "Sample description for activity 3",
  },
];

//dummy data for item description
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

const expenseClassData = [
  {
    label: "MOOE",
    value: "MOOE",
  },
  {
    label: "CO",
    value: "CO",
  },
];

function PPMPItems(props) {
  const [tableData, setTableData] = useState(sampleData);
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [activity, setActivity] = useState("");
  const [activityId, setActivityId] = useState("");
  const [description, setDescription] = useState("");
  const [expenseClass, setExpenseClass] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const calculateQuantity = (targetByQuarter) => {
    // Sum the values from January to December
    return Object.values(targetByQuarter).reduce(
      (sum, value) => sum + value,
      0
    );
  };

  const handleFieldChange = (fieldName, newValue, row, updateRow) => {
    if (fieldName === "description") {
      setLoading(true);
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
        setLoading(false);
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
    setLoading(id); // start loading

    // Simulate async behavior (like API call)
    setTimeout(() => {
      setTableData((prevData) => [...prevData.filter((row) => row.id !== id)]);
      setLoading(null); // end loading
    }, 1000); // simulate 1 second delay

    console.log("delete");
  };

  const handleSelectActivity = (event) => {
    console.log(event);
    setActivity(event.label);
    setActivityId(event.value);
    setDescription(event.description);
  };

  const handleSelectExpense = (event) => {
    setExpenseClass(event.value);
  };

  return (
    <Fragment>
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
              label={"Add item"}
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
          isLoading={loading}
          options={descriptionsData}
          setData={setTableData}
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
        minWidth={"380px"}
        maxWidth={"480px"}
        content={
          <Fragment>
            <Stack spacing={2}>
              <AutocompleteComponent
                label={"Select one activity"}
                options={activityData}
                setValue={setActivity}
                handleSelect={handleSelectActivity}
                value={activity}
                size="sm"
              />
              {description !== "" && (
                <>
                  <Divider />
                  <Typography sx={{ fontSize: 12, color: "gray" }}>
                    Description of selected activity
                  </Typography>
                  <Typography sx={{ fontSize: 14 }}>{description}</Typography>
                  <Divider />
                </>
              )}

              <AutocompleteComponent
                label={"Select expense class"}
                helperText={
                  "Expense class determine the type of budget to be used for the items that are to be selected."
                }
                options={expenseClassData}
                value={expenseClass}
                setValue={setExpenseClass}
                handleSelect={handleSelectExpense}
              />
            </Stack>
          </Fragment>
        }
        leftButtonLabel="Cancel"
        rightButtonLabel="Continue"
        rightButtonAction={() =>
          navigate(`add-item/${activityId}/${expenseClass}`)
        }
      />
    </Fragment>
  );
}

export default PPMPItems;
