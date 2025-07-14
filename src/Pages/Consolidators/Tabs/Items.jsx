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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    getItems({
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
        data={data}
        isLoading={loading}
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
