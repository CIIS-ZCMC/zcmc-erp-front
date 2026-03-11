import ButtonComponent from "@Components/Common/ButtonComponent";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import PageTitle from "@Components/Common/PageTitle";
import ExpandableTable from "@Components/Common/Table/ExpandableTable";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import { MANAGE_CONSOLIDATORS } from "../../../Data/Columns";
import { Add } from "@mui/icons-material";
import { Divider, Stack, Typography, useTheme } from "@mui/joy";
import React, { Fragment, useEffect, useState } from "react";
import useManageConsolidatorsHook from "../../../Hooks/ManageConsolidatorHook";
import BasicTableComponent from "@Components/Common/Table/BasicTableComponent";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import InputComponent from "@Components/Form/InputComponent";
import MultipleAutocompleteComponent from "@Components/Form/MultipleAutcompleteComponent";
import AuthorizationPinComponent from "@Components/AuthorizationPinComponent";
import usePinHook from "../../../Hooks/PinHook";
import useItemsHook from "../../../Hooks/ItemManagementHook";
import useSnackbarHook from "../../../Hooks/SnackbarHook";
import useModalHook from "../../../Hooks/ModalHook";

export default function ManageConsolidators() {
  const theme = useTheme();
  const color = theme.palette;

  const { consolidators, isLoading, actions, pagination } =
    useManageConsolidatorsHook();
  const { getItemCategories, categories } = useItemsHook();
  const { setPin, pin } = usePinHook();
  const { showSnack } = useSnackbarHook();
  const { setAlertDialog } = useModalHook();
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const handleUpdate = React.useCallback((row) => {
    const updateData = {
      consolidator: {
        id: row.user_id,
        name: row.user_name,
      },
      authorization_pin: row.authorization_pin,
      item_categories: row.assigned_categories.map((cat) => ({
        id: cat.item_category_id,
        name: cat.item_category_name,
        code: cat.item_category_code,
      })),
    };

    setSelectedData(updateData);
    setOpenUpdate(true);
  }, []);

  const handleSubmit = () => {
    const payload = {
      authorization_pin: pin,
      user_id: selectedData.consolidator.id,
      item_category_id: selectedData.item_categories.map((cat) => cat.id),
    };

    actions.updateConsolidator(payload, (status, message) => {
      if (status === 200) {
        showSnack(status, message);
        setOpenUpdate(false);
        setPin("");
      } else {
        setAlertDialog({
          status: "error",
          title: message,
          description: "",
        });
      }
    });
  };

  useEffect(() => {
    actions.getConsolidators(searchQuery, (status, message) => {
      console.log(status, message);
    });
    getItemCategories(() => {});
  }, [searchQuery]);

  const columns = React.useMemo(
    () =>
      MANAGE_CONSOLIDATORS(
        expandedCategories,
        setExpandedCategories,
        handleUpdate,
      ),
    [expandedCategories, handleUpdate],
  );

  return (
    <Fragment>
      <PageTitle
        title={"Manage Dispensing Units"}
        description={
          "Create, update, and maintain dispensing unit assignments to ensure accurate and timely data consolidation."
        }
      />
      <BoxComponent bgColor={color.background.surface} my={2} p={2}>
        <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
          <Stack>
            <Typography level="body-md" fontWeight={600}>
              Dispensing Unit Library{" "}
            </Typography>
            <Typography level="body-xs">
              Manage the library for dispensing units managing AOP and PPMP
              items
            </Typography>
          </Stack>
        </Stack>
      </BoxComponent>

      <Stack
        direction={"row"}
        spacing={2}
        sx={{ justifyContent: "flex-start", pb: 2 }}
      >
        <SearchBarComponentv2
          placeholder="Search employee/area..."
          setValue={setSearchQuery}
          value={searchQuery}
          fullWidth
        />
      </Stack>
      <ExpandableTable
        columns={columns}
        rows={consolidators}
        currentPage={pagination?.current_page}
        totalPages={pagination?.last_page}
        onNextPage={() => {
          if (page < pagination?.last_page) setPage(page + 1);
        }}
        onPrevPage={() => {
          if (page > 1) setPage(page - 1);
        }}
        totalRows={pagination?.total}
        stickyFooter
      />

      {openUpdate && (
        <ModalComponent
          title={"Update Consolidator"}
          description={
            "Update the assigned categories or details for this consolidator"
          }
          isOpen={openUpdate}
          isLoading={isLoading}
          handleClose={() => setOpenUpdate(false)}
          maxWidth={"480px"}
          hasActionButtons
          rightButtonAction={() => handleSubmit()}
          content={
            <Stack spacing={2.5}>
              <InputComponent
                label={"Dispensing Unit (Employee)"}
                helperText={
                  "Type to search for an employee or select from the list"
                }
                value={selectedData?.consolidator?.name || ""}
              />
              <MultipleAutocompleteComponent
                name={"name"}
                label={"Assigned Item Category"}
                helperText={
                  "Select one or more categories this consolidator will manage"
                }
                options={categories || []}
                value={selectedData?.item_categories || []}
                setValue={(value) =>
                  setSelectedData((prev) => ({
                    ...prev,
                    item_categories: value,
                  }))
                }
              />
              <Divider />
              <AuthorizationPinComponent setPin={setPin} />
            </Stack>
          }
        />
      )}
    </Fragment>
  );
}
