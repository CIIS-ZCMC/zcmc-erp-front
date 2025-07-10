import React, { Fragment, useEffect, useState } from "react";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import { Typography } from "@mui/joy";
import { Stack, Link } from "@mui/joy";
import { IoInformationOutline, IoOpen, IoOpenOutline } from "react-icons/io5";
import useLibItemHook from "../../../Hooks/Libraries/LibItemHooks";
import useModalHook from "../../../Hooks/ModalHook";
import ServerTableComponent from "../../../Components/Common/Table/ServerTableComponent";
import { itemCols } from "../../../Data/Columns";

export const Items = () => {
  const { openModal, setOpenModal } = useModalHook();
  const {
    resetInput,
    setUpdateData,
    Items,
    getItems,
    pagination,
    navLinks,
    currentPage,
    setCurrentPage,
    setSearchQuery,
    search_Query,
  } = useLibItemHook();

  useEffect(() => {
    if (openModal.isNew) {
      setUpdateData(null);
      resetInput();
    }
  }, [openModal]);

  const data =
    Items.map((row) => ({
      id: row.id,
      name: row.name,
      classification: row.classification,
      item_category: row.category,
      variant: row.variant,
      unit: row.item_unit.name,
      estimated_budget: row.estimated_budget,
    })) || [];

  useEffect(() => {
    if (search_Query.length <= 1) {
      getItems((message) => {
        console.log("Error fetching classification data:", message);
      });
    }
  }, [currentPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      console.log("Search query changed:", search_Query);
      setCurrentPage(1); // ✅ Reset to page 1 when searching
      getItems((message) => {
        console.log("Error fetching classification data:", message);
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [search_Query]);
  return (
    <Fragment>
      <ServerTableComponent
        data={data}
        columns={itemCols}
        pageSize={pagination?.per_page}
        onPageChange={setCurrentPage}
        paginationMeta={pagination}
        stripe="even"
        withCount={pagination?.total}
        fieldsToSearch={["name", "classification", "item_category"]}
        search={search_Query}
        setSearch={setSearchQuery}
        bordered
        hoverRow
        stickLast
      />
    </Fragment>
  );
};
