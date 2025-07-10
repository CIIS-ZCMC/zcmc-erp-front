import React, { Fragment, useEffect } from "react";
import { categoryCols, classificationCols } from "../../../Data/Columns";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import { Typography } from "@mui/joy";
import useModalHook from "../../../Hooks/ModalHook";
import useCategoryHooks from "../../../Hooks/Libraries/LibCategoryHooks";
import { useCategoryHook } from "../../../Hooks/Libraries/dataTable/CategoryHook";
import ServerTableComponent from "../../../Components/Common/Table/ServerTableComponent";

export const Category = () => {
  const { setType, setSelectedData } = useCategoryHooks();
  const {
    categories,
    pagination,
    getPaginatedCategories,
    setCurrentPage,
    isLoading,
  } = useCategoryHook();
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
      name: item.name,
      code: item.code,
      description: item.description,
      created_at: item.meta.created_at.split("T")[0],
      updated_at: item.meta.updated_at.split("T")[0],
    }));
  }

  useEffect(() => {
    getPaginatedCategories({ page: pagination.current_page });
  }, []);

  return (
    <Fragment>
      <ServerTableComponent
        data={transformData(categories)}
        columns={categoryCols(setUpdateType, setDeleteType)}
        pageSize={pagination?.pagination?.per_page || 20}
        currentPage={pagination?.current_page}
        totalPages={pagination?.total}
        onPageChange={handlePageChange}
        paginationMeta={pagination}
        stripe="even"
        withCount={pagination?.total}
        fieldsToSearch={["title", "description"]}
        bordered
        hoverRow
        stickLast
      />
    </Fragment>
  );
};
