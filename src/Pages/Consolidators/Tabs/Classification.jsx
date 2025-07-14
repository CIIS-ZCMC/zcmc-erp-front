import React, { Fragment, useEffect, useRef, useState } from "react";
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
  const [loading, setLoading] = useState(false);

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

  return (
    <Fragment>
      <ServerTableComponent
        isLoading={loading}
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
