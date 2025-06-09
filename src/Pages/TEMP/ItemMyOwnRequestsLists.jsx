import React, { Fragment, useEffect, useRef } from "react";
import { myOwnItemRequestListCols } from "../../Data/Columns";
import ScrollableTableComponent from "../../Components/Common/Table/ScrollableTableComponent";
import useModalHook from "../../Hooks/ModalHook";
import useClassificationHooks from "../../Hooks/Libraries/LibClassificationHooks";
import useClassificationDataTable from "../../Hooks/Libraries/dataTable/dataClassification";
import ServerTableComponent from "../../Components/Common/Table/ServerTableComponent";
import useUserRequestItemHook from "../../Hooks/ItemRequest/EndUserItemRequest";
export const MyOwnRequestsList = () => {
  const { setType, setSelectedData } = useClassificationHooks();
  const { setOpenModal } = useModalHook();
  const {
    getMyItemRequestLists,
    pagination,
    currentPage,
    totalPages,
    setSearchQuery,
    search_Query,
  } = useUserRequestItemHook();
  const setCurrentPage = useUserRequestItemHook(
    (state) => state.setCurrentPage
  );
  const getMyRequestData = useUserRequestItemHook(
    (state) => state.myRequests_dataTable
  );

  // const search_Query = useClassificationDataTable(
  //   (state) => state.search_Query
  // );
  // const setSearchQuery = useClassificationDataTable(
  //   (state) => state.setSearchQuery
  // );
  function transformData(data) {
    return data.map((item) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      category: item.category,
      classification: item.classification,
      created_at: item.updated_at.split("T")[0],
      status: item.status,
    }));
  }

  useEffect(() => {
    getMyItemRequestLists((message) => {
      console.log("Error fetching classification data:", message);
    });
  }, [currentPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      console.log("Search query changed:", search_Query);
      getMyItemRequestLists((message) => {
        console.log("Error fetching classification data:", message);
      });
    }, 500); // Debounce the search query

    return () => {
      clearTimeout(handler); // Cancel previous timeout if input changes quickly
    };
  }, [search_Query]);

  return (
    <Fragment>
      <ServerTableComponent
        data={transformData(getMyRequestData)}
        columns={myOwnItemRequestListCols()}
        pageSize={pagination?.pagination?.per_page || 15}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        paginationMeta={pagination}
        stripe="even"
        withCount={pagination?.pagination?.total}
        fieldsToSearch={["title", "description"]}
        bordered
        hoverRow
        stickLast
        search={search_Query}
        setSearch={setSearchQuery}
      />
    </Fragment>
  );
};
