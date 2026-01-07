import React, { Fragment, useEffect, useState } from "react";
import { categoryCols, classificationCols } from "../../../Data/Columns";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import { Divider, Stack, Switch, Typography } from "@mui/joy";
import useModalHook from "../../../Hooks/ModalHook";
import useCategoryHooks from "../../../Hooks/Libraries/LibCategoryHooks";
import ServerTableComponent from "../../../Components/Common/Table/ServerTableComponent";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import InputComponent from "../../../Components/Form/InputComponent";
import TextareaComponent from "../../../Components/Form/TextareaComponent";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";
import usePinHook from "../../../Hooks/PinHook";
import ExpandableTable from "@Components/Common/Table/ExpandableTable";
import StatusSwitch from "@Components/StatusSwitchComponent";
import SearchWithSuggestions from "@Components/SearchWithSuggestions";
import ButtonComponent from "@Components/Common/ButtonComponent";
import { AddOutlined } from "@mui/icons-material";
import AuthorizationPinComponent from "@Components/AuthorizationPinComponent";

export const Category = () => {
  const {
    setType,
    setSelectedData,
    categories,
    pagination,
    getPaginatedCategories,
    setCurrentPage,
    isLoading,
    search_Query,
    setSearchQuery,
    currentPage,
    selectedData,
  } = useCategoryHooks();
  const { pin, setPin } = usePinHook();
  const { setOpenModal, setConfirmationModal } = useModalHook();
  const [loading, setLoading] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [updateData, setUpdateData] = useState({
    name: "",
    description: "",
  });
  const [page, setPage] = useState(1);
  const [active, setActive] = useState(true);

  const setUpdateType = (data) => {
    setOpenUpdate(true);
    setSelectedData(data);
  };

  const setDeleteType = (params) => {
    setOpenDel(true);
    setSelectedData(params);
    const data = {
      status: "error",
      title: `Delete classification (${params?.name}) ?`,
      description: "This action cannot be undone.",
    };
    setConfirmationModal(data);
  };

  const deleteItem = (selected) => {
    setOpenDel(false);
  };

  function transformData(data) {
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      code: item.code,
      description: item.description,
      created_at: item.meta.created_at.split("T")[0],
      updated_at: item.meta.updated_at.split("T")[0],
    }));
  }

  useEffect(() => {
    setLoading(true);
    getPaginatedCategories({
      page,
      per_page: 15,
      search: search_Query, // Pass the current search query
      callBack: (status, message) => {
        setLoading(false);
        console.log("Response:", status, message);
      },
    });
  }, [page, search_Query]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1); // 👈 Only change the page, let the other useEffect handle loading & fetching
    }, 500);

    return () => clearTimeout(handler);
  }, [search_Query]);

  useEffect(() => {
    if (openUpdate && selectedData) {
      setUpdateData({
        name: selectedData?.name || "",
        description: selectedData?.description || "",
      });
    }
  }, [selectedData, openUpdate]);

  return (
    <Fragment>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack
          direction={"row"}
          spacing={2}
          alignItems={"center"}
          justifyContent={"flex-start"}
        >
          <Typography level="body-sm">View:</Typography>
          <StatusSwitch checked={active} onChange={setActive} />
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <SearchWithSuggestions />
          <ButtonComponent
            label={"Add New Category"}
            startDecorator={<AddOutlined />}
            onClick={() => setOpenNew(true)}
          />
        </Stack>
      </Stack>

      <ExpandableTable
        rows={transformData(categories)}
        isLoading={loading}
        columns={categoryCols(setUpdateType, setDeleteType)}
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
        height="62vh"
      />
      {openNew && (
        <ModalComponent
          title="Create a new category"
          description={"Name your category to create it."}
          isOpen={openNew}
          handleClose={() => setOpenNew(false)}
          content={
            <>
              <Stack mt={2}>
                <InputComponent
                  name={"category"}
                  label={"Category Name"}
                  helperText={
                    "Use a specific and descriptive naming convention for best results."
                  }
                />
                <Divider sx={{ mt: 3 }} />
              </Stack>

              <AuthorizationPinComponent />
            </>
          }
          hasActionButtons
          rightButtonLabel="Confirm and Save"
        />
      )}
      {openUpdate && (
        <ModalComponent
          title={`Update category: ${selectedData?.name}`}
          isOpen={openUpdate}
          handleClose={() => setOpenUpdate(false)}
          hasActionButtons
          content={
            <>
              <Stack gap={2}>
                <InputComponent
                  label={"Category Name"}
                  value={updateData.name}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, name: e.target.value })
                  }
                  helperText={
                    "Use a specific and descriptive naming convention for best results."
                  }
                />
                <TextareaComponent
                  label={"Description"}
                  value={updateData.description}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      description: e.target.value,
                    })
                  }
                />
                <Divider />
                <InputComponent
                  label={"Authorization PIN"}
                  helperText={
                    "Confirm your action by typing-in your authorization PIN."
                  }
                />
              </Stack>
            </>
          }
        />
      )}
      {openDel && (
        <ConfirmationModalComponent
          status="error"
          rightButtonAction={() => deleteItem(updateData.id)}
          withAuthPin
          setAuthPin={setPin}
        />
      )}
    </Fragment>
  );
};
