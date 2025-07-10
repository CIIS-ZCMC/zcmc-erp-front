import React, { Fragment, useEffect, useState } from "react";
import { variantCols } from "../../../Data/Columns";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import useModalHook from "../../../Hooks/ModalHook";
import useVariantHooks from "../../../Hooks/Libraries/LibVarianHooks";
import ServerTableComponent from "../../../Components/Common/Table/ServerTableComponent";
import useTerminologyHooks from "../../../Hooks/Libraries/LibTerminology";
import SearchBarComponentv2 from "../../../Components/SearchBarWithdeBounce";
import { Stack } from "@mui/material";

export const Variant = () => {
  const {
    setType,
    setSelectedData,
    terminology,
    pagination,
    getPaginatedCategories,
    setCurrentPage,
    getTerminology,
  } = useTerminologyHooks();

  const { setOpenModal } = useModalHook();
  const [search, setSearch] = useState("");

  const setUpdateType = (data) => {
    setType("update");
    setOpenModal(true, false, true);
    setSelectedData(data);
  };

  const setDeleteType = (data) => {
    setType("delete");
    setOpenModal(true, false, true);
    setSelectedData(data);
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
    getTerminology({ page: pagination.current_page });
  }, []);

  return (
    <Fragment>
      <Stack mb={2} width="30%">
        <SearchBarComponentv2 value={search} setValue={setSearch} />
      </Stack>

      <ScrollableTableComponent
        data={transformData(terminology)}
        columns={variantCols(setUpdateType, setDeleteType)}
        pageSize={15}
        search={search}
        fieldsToSearch={["name", "code", "description"]}
      />
    </Fragment>
  );
};
