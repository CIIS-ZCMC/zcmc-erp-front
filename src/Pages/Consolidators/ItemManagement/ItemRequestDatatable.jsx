import React, { Fragment, useEffect, useRef } from "react";
import {
  itemRequestDetailsCols,
  myOwnItemRequestListCols,
} from "../../../Data/Columns";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import useModalHook from "../../../Hooks/ModalHook";
import useClassificationHooks from "../../../Hooks/Libraries/LibClassificationHooks";
import useClassificationDataTable from "../../../Hooks/Libraries/dataTable/dataClassification";
import ServerTableComponent from "../../../Components/Common/Table/ServerTableComponent";
import useUserRequestItemHook from "../../../Hooks/ItemRequest/EndUserItemRequest";
import useListUserRequestItemHook from "../../../Hooks/ItemRequest/ConsolidatorItemRequestUpdate";
import useLibItemHook from "../../../Hooks/Libraries/LibItemHooks";
export const ItemRequestDatatable = () => {
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
  const { inputs, setInputs } = useLibItemHook();
  const { selected_data } = useListUserRequestItemHook();

  const setSelect = useListUserRequestItemHook(
    (state) => state.setSelectedData
  );

  function transformData(data) {
    return data.map((item) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      estimated_budget: item.estimated_budget,
      unit: item.unit,
      item_unit: item.item_unit,
      category: item.category,
      item_category: item.item_category,
      classification: item.classification,
      item_classification: item.item_classification,
      item_specifications: item.item_specifications,
      item_terminology: item.item_terminology,
      created_at: item.updated_at.split("T")[0],
      status: item.status,
      all: item,
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
        columns={itemRequestDetailsCols(setSelect, () => {
          setOpenModal(true, false, true);
        })}
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
