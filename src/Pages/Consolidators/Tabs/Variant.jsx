import React, { Fragment, useEffect } from "react";
import { variantCols } from "../../../Data/Columns";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import useModalHook from "../../../Hooks/ModalHook";
import useVariantHooks from "../../../Hooks/Libraries/LibVarianHooks";
import ServerTableComponent from "../../../Components/Common/Table/ServerTableComponent";
import useTerminologyHooks from "../../../Hooks/Libraries/LibTerminology";

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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    getPaginatedCategories({ page: newPage });
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
      <ScrollableTableComponent
        data={transformData(terminology)}
        columns={variantCols(setUpdateType, setDeleteType)}
        pageSize={15}
      />
    </Fragment>
  );
};
