import React, { Fragment, useEffect, useRef, useState } from "react";
import { classificationCols } from "../../../Data/Columns";
import useModalHook from "../../../Hooks/ModalHook";
import ServerTableComponent from "../../../Components/Common/Table/ServerTableComponent";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import { Divider, Stack } from "@mui/joy";
import InputComponent from "../../../Components/Form/InputComponent";
import TextareaComponent from "../../../Components/Form/TextareaComponent";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";
import usePinHook from "../../../Hooks/PinHook";
import useClassificationHook from "../../../Hooks/Libraries/LibClassificationHooks";

export const Classification = () => {
  const { pin, setPin } = usePinHook();
  const { setConfirmationModal, closeConfirmation } = useModalHook();
  const {
    classi_dataTable,
    pagination,
    currentPage,
    totalPages,
    setSearchQuery,
    search_Query,
    setCurrentPage,
    getClassifications,
    selectedData,
    setSelectedData,
  } = useClassificationHook();
  const [loading, setLoading] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [updateData, setUpdateData] = useState({
    name: "",
    description: "",
  });

  function transformData(data) {
    return data.map((item) => ({
      id: item.id,
      clName: item.name,
      code: item.code,
      description: item.description,
      created_at: item.meta.created_at.split("T")[0],
      updated_at: item.meta.updated_at.split("T")[0],
    }));
  }

  const handleUpdate = (data) => {
    setOpenUpdate(true);
    setSelectedData(data);
  };

  const handleDelete = (params) => {
    setOpenDel(true);
    setSelectedData(params);
    const data = {
      status: "error",
      title: `Delete classification (${params?.clName}) ?`,
      description: "This action cannot be undone.",
    };
    setConfirmationModal(data);
  };

  const deleteItem = (selected) => {
    setOpenDel(false);
  };

  useEffect(() => {
    setLoading(true);
    getClassifications({
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
        name: selectedData?.clName || "",
        description: selectedData?.description || "",
      });
    }
  }, [selectedData, openUpdate]);

  return (
    <Fragment>
      <ServerTableComponent
        isLoading={loading}
        data={transformData(classi_dataTable)}
        columns={classificationCols(handleUpdate, handleDelete)}
        pageSize={pagination?.pagination?.per_page || 15}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        paginationMeta={pagination}
        stripe="even"
        withCount={pagination?.pagination?.total}
        fieldsToSearch={["clName", "description"]}
        bordered
        hoverRow
        stickLast
        search={search_Query}
        setSearch={setSearchQuery}
      />
      {openUpdate && (
        <ModalComponent
          title={`Update ${selectedData.clName}`}
          isOpen={openUpdate}
          handleClose={() => setOpenUpdate(false)}
          hasActionButtons
          content={
            <>
              <Stack gap={2}>
                <InputComponent
                  label={"Classification Name"}
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
          leftButtonAction={() => {
            closeConfirmation();
            setOpenDel(false);
          }}
          rightButtonAction={() => deleteItem(updateData.id)}
          withAuthPin
          setAuthPin={setPin}
        />
      )}
    </Fragment>
  );
};
