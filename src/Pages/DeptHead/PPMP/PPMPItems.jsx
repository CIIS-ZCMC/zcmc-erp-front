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
import useItemsHook from "../../../Hooks/ItemsHook";
import { expenseClassData } from "../../../Data/constants";

function PPMPItems(props) {
  const navigate = useNavigate();
  const {
    tableData,
    loading,
    activityObject,
    activity,
    activityId,
    description,
    expenseClass,
    setTableData,
    setItemsData,
    setLoading,
    handleFieldChange,
    handleDeleteRow,
    handleSelectActivity,
    handleSelectExpense,
  } = usePPMPItemsHook();
  const { ppmp, modes, activities, getPPMPItems, getProcModes, getActivities } =
    usePPMPHook();
  const { items, getItems } = useItemsHook();

  const [openAdd, setOpenAdd] = useState(false);

  const calculateQuantity = (targetByQuarter) => {
    // Sum the values from January to December
    return Object.values(targetByQuarter).reduce(
      (sum, value) => sum + value,
      0
    );
  };

  const handleSubmit = () => {};

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        await Promise.all([
          new Promise((resolve) =>
            getPPMPItems((status, message, data) => resolve())
          ),
          new Promise((resolve) =>
            getItems((status, message, data) => resolve())
          ),
          new Promise((resolve) =>
            getProcModes((status, message, data) => resolve())
          ),
          new Promise((resolve) =>
            getActivities((status, message, data) => resolve())
          ),
        ]);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (ppmp?.ppmp_items?.length && tableData.length === 0) {
        setTableData(ppmp.ppmp_items);
      }
    }
  }, [loading, ppmp]);

  useEffect(() => {
    if (!loading && items?.length) {
      setItemsData(items);
    }
  }, [loading, items]);
  // useEffect(() => {
  //   if (tableData.length === 0) {
  //     setTableData(sampleData);
  //   }
  // }, [ppmp]);

  return (
    <Fragment>
      {console.log(items)}
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
            <ButtonComponent
              label={"Save"}
              color="success"
              variant={"outlined"}
              endDecorator={<BiPlus />}
              onClick={() => setOpenAdd(true)}
            />
          </Stack>
        }
      >
        <ScrollableEditableTableComponent
          columns={ppmpHeaders(handleDeleteRow, items, modes)}
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
                options={activities}
                getOptionLabel={(option) => option.activity_code || ""}
                handleSelect={handleSelectActivity}
                value={activityObject}
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
          navigate(`add-item/${expenseClass}`, { state: { activityObject } })
        }
        hasActionButtons
      />
    </Fragment>
  );
}

export default PPMPItems;
