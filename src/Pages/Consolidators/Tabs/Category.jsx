import React, { Fragment, useEffect, useState } from "react";
import { categoryCols, classificationCols } from "../../../Data/Columns";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import { Divider, Stack, Typography } from "@mui/joy";
import useModalHook from "../../../Hooks/ModalHook";
import useCategoryHooks from "../../../Hooks/Libraries/LibCategoryHooks";
import ServerTableComponent from "../../../Components/Common/Table/ServerTableComponent";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import InputComponent from "../../../Components/Form/InputComponent";
import TextareaComponent from "../../../Components/Form/TextareaComponent";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";
import usePinHook from "../../../Hooks/PinHook";

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
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [updateData, setUpdateData] = useState({
    name: "",
    description: "",
  });

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
      per_page: 15,
      search: search_Query, // Pass the current search query
      callBack: (status, message) => {
        setLoading(false);
        console.log("Response:", status, message);
      },
    });
  }, [currentPage, search_Query]);

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
      <ServerTableComponent
        data={transformData(categories)}
        isLoading={loading}
        columns={categoryCols(setUpdateType, setDeleteType)}
        pageSize={pagination?.pagination?.per_page || 20}
        currentPage={pagination?.current_page}
        totalPages={pagination?.total}
        onPageChange={setCurrentPage}
        paginationMeta={pagination}
        search={search_Query}
        setSearch={setSearchQuery}
        stripe="even"
        withCount={pagination?.total}
        fieldsToSearch={["name", "code", "description"]}
        bordered
        hoverRow
        stickLast
      />
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
