import React, { Fragment, useEffect, useRef } from "react";
import { classificationCols } from "../../../Data/Columns";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import useModalHook from "../../../Hooks/ModalHook";
import useClassificationHooks from "../../../Hooks/Libraries/LibClassificationHooks";
import useClassificationDataTable from "../../../Hooks/Libraries/dataTable/dataClassification";
import ServerTableComponent from "../../../Components/Common/Table/ServerTableComponent";
export const Classification = () => {
  const { setType, setSelectedData } = useClassificationHooks();
  const { setOpenModal } = useModalHook();
  const {
    classi_dataTable,
    pagination,
    currentPage,
    totalPages,
    setSearchQuery,
    search_Query,
    setCurrentPage,
    getClassifications,
  } = useClassificationDataTable();

  // const search_Query = useClassificationDataTable(
  //   (state) => state.search_Query
  // );
  // const setSearchQuery = useClassificationDataTable(
  //   (state) => state.setSearchQuery
  // );
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

  useEffect(() => {
    if (search_Query.length <= 1) {
      getClassifications((message) => {
        console.log("Error fetching classification data:", message);
      });
    }
  }, [currentPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      console.log("Search query changed:", search_Query);
      setCurrentPage(1); // ✅ Reset to page 1 when searching
      getClassifications((message) => {
        console.log("Error fetching classification data:", message);
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [search_Query]);

  return (
    <Fragment>
      <ServerTableComponent
        data={transformData(classi_dataTable)}
        columns={classificationCols(setUpdateType, setDeleteType)}
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
    </Fragment>
  );
};
