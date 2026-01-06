import React, { Fragment, useEffect, useState } from "react";
import { variantCols } from "../../../Data/Columns";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import useModalHook from "../../../Hooks/ModalHook";
import useVariantHooks from "../../../Hooks/Libraries/LibVarianHooks";
import ServerTableComponent from "../../../Components/Common/Table/ServerTableComponent";
import useTerminologyHooks from "../../../Hooks/Libraries/LibTerminology";
import SearchBarComponentv2 from "../../../Components/SearchBarWithdeBounce";
import { Stack } from "@mui/material";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";
import usePinHook from "../../../Hooks/PinHook";
import ExpandableTable from "@Components/Common/Table/ExpandableTable";

export const Variant = () => {
  const {
    setType,
    selectedData,
    setSelectedData,
    terminology,
    pagination,
    getPaginatedCategories,
    setCurrentPage,
    getTerminology,
  } = useTerminologyHooks();

  const { setOpenModal, setConfirmationModal } = useModalHook();
  const { pin, setPin } = usePinHook();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDel, setOpenDel] = useState(false);

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
    console.log("Transforming category data:", data);
    return data.map((item) => ({
      id: item.id,
      name: item.system,
      code: item.code,
      description: item.description,
      created_at: item.meta.created_at.split("T")[0],
      updated_at: item.meta.updated_at.split("T")[0],
    }));
  }

  useEffect(() => {
    setLoading(true);
    getTerminology({
      page: pagination.current_page,
      callBack: (status, message) => {
        console.log("Callback received:", status, message);
        setLoading(false);
      },
    });
  }, []);

  return (
    <Fragment>
      <Stack mb={2} width="30%">
        <SearchBarComponentv2 value={search} setValue={setSearch} />
      </Stack>

      <ExpandableTable
        isLoading={loading}
        rows={transformData(terminology)}
        columns={variantCols(setUpdateType, setDeleteType)}
      />

      {/* {openUpdate && (

      )} */}
      {openDel && (
        <ConfirmationModalComponent
          status="error"
          rightButtonAction={() => deleteItem(selectedData.id)}
          withAuthPin
          setAuthPin={setPin}
        />
      )}
    </Fragment>
  );
};
