import React, { Fragment, useEffect } from "react";
import { categoryCols, classificationCols } from "../../../Data/Columns";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import { Typography } from "@mui/joy";
import useModalHook from "../../../Hooks/ModalHook";
import useCategoryHooks from "../../../Hooks/Libraries/LibCategoryHooks";
import { useCategoryHook } from "../../../Hooks/Libraries/dataTable/CategoryHook";
import ServerTableComponent from "../../../Components/Common/Table/ServerTableComponent";

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
  } = useCategoryHooks();

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
    if (search_Query.length <= 1) {
      getPaginatedCategories((message) => {
        console.log("Error fetching classification data:", message);
      });
    }
  }, [currentPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      console.log("Search query changed:", search_Query);
      setCurrentPage(1); // ✅ Reset to page 1 when searching
      getPaginatedCategories((message) => {
        console.log("Error fetching classification data:", message);
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [search_Query]);

  return (
    <Fragment>
      <ServerTableComponent
        data={transformData(categories)}
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
    </Fragment>
  );
};
