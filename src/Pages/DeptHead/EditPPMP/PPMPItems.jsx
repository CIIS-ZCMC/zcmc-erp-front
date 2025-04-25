import React, { Fragment, useEffect, useState } from "react";
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
import { usePPMPItemsHook } from "../../../Hooks/PPMPItemsHook";
import { descriptionsData, procurement_mode } from "../../../Data/dummy";
import usePPMPHook from "../../../Hooks/PPMPHook";

const sampleData = [
  {
    id: 1,
    item_code: "ITM001",
    activity_code: "ACT001",
    activity_id: 1,
    expense_class_id: "MOOE",
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
    procurement_mode: "Fund A",
    remarks: "No remarks",
  },
  {
    id: 2,
    item_code: "ITM002",
    activity_code: "ACT002",
    activity_id: 1,
    expense_class_id: "MOOE",
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
    procurement_mode: "Fund A",
    remarks: "No remarks",
  },
  {
    id: 3,
    item_code: "ITM003",
    activity_code: "ACT003",
    activity_id: 1,
    expense_class_id: "MOOE",
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
    procurement_mode: "Fund A",
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
  const {
    tableData,
    loading,
    activity,
    activityId,
    description,
    expenseClass,
    setTableData,
    setDescriptionData,
    setLoading,
    handleFieldChange,
    handleDeleteRow,
    handleSelectActivity,
    handleSelectExpense,
  } = usePPMPItemsHook();
  const { ppmp, getPPMPItems } = usePPMPHook();

  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);

  const calculateQuantity = (targetByQuarter) => {
    // Sum the values from January to December
    return Object.values(targetByQuarter).reduce(
      (sum, value) => sum + value,
      0
    );
  };

  useEffect(() => {
    setTimeout(() => {
      // getPPMPItems((status, message, data) => {
      //   if (status === 200) {
      //     console.log("Items fetched successfully:", data);
      //   } else {
      //     console.error("Error fetching items:", message);
      //   }
      // });
      setDescriptionData(descriptionsData);
    }, 1000);
  }, []);

  // useEffect(() => {
  //   if (ppmp?.ppmp_items && tableData.length === 0) {
  //     setTableData(ppmp.ppmp_items);
  //   }
  // }, [ppmp]);

  useEffect(() => {
    if (tableData.length === 0) {
      setTableData(sampleData);
    }
  }, [ppmp]);

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
        hasActionButtons
      />
    </Fragment>
  );
}

export default PPMPItems;
