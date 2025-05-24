import React, { Fragment, useEffect } from "react";
import { classificationCols } from "../../../Data/Columns";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import useModalHook from "../../../Hooks/ModalHook";
import useClassificationHooks from "../../../Hooks/Libraries/LibClassificationHooks";
import useClassificationDataTable from "../../../Hooks/Libraries/dataTable/dataClassification";
import ServerTableComponent from "../../../Components/Common/Table/ServerTableComponent";
export const Classification = () => {
  const { setType, setSelectedData } = useClassificationHooks();
  const { setOpenModal } = useModalHook();
  const { classi_dataTable, pagination, currentPage, totalPages } =
    useClassificationDataTable();
  const setCurrentPage = useClassificationDataTable(
    (state) => state.setCurrentPage
  );
  const getClassification = useClassificationDataTable(
    (state) => state.getClassification
  );

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
    getClassification((message) => {
      console.log("Error fetching classification data:", message);
    });
  }, [getClassification, currentPage]);

  return (
    <Fragment>
      {/* <>{JSON.stringify(pagination)}</>
      <ScrollableTableComponent
        data={transformData(classi_dataTable)}
        columns={classificationCols(setUpdateType, setDeleteType)}
        pageSize={15}
        stripe="even"
        bordered
        hoverRow
        isLoading={false}
        stickLast
      /> */}
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
        fieldsToSearch={["title", "description"]}
        search={""}
        bordered
        hoverRow
        stickLast
      />
    </Fragment>
  );
};
