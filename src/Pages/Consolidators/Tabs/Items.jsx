import React, { Fragment, useEffect, useState } from "react";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import { Typography } from "@mui/joy";
import { Stack, Link } from "@mui/joy";
import { IoInformationOutline, IoOpen, IoOpenOutline } from "react-icons/io5";
import useLibItemHook from "../../../Hooks/Libraries/LibItemHooks";
import useModalHook from "../../../Hooks/ModalHook";
import ServerTableComponent from "../../../Components/Common/Table/ServerTableComponent";

export const Items = () => {
  const { resetInput, setUpdateData, updateData } = useLibItemHook();
  const { openModal, setOpenModal } = useModalHook();
  const { Items, getItems, pagination, navLinks, currentPage, setCurrentPage } =
    useLibItemHook();

  const fetchAll = async () => {
    const wrap = (fn) => new Promise((resolve) => fn(() => resolve()));

    try {
      await Promise.all([
        wrap(getItems(currentPage)),
        // wrap((done) => getFunctionType({ mode: "selection" }, done)),
      ]);
    } catch (err) {
      console.error("Fetching error:", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [currentPage]);

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

  const objHeaders = [
    { field: "id", name: "Row #", align: "center", width: "20px" },
    { field: "name", name: "Item name", width: 200, align: "left" },
    {
      field: "classification",
      name: "Classification",
      width: 80,
      align: "left",
    },
    { field: "item_category", name: "Category", width: 60, align: "left" },
    { field: "variant", name: "Variant", width: 90, align: "left" },
    {
      field: "unit",
      name: "Unit of Measurement",
      width: 60,
      align: "left",
    },
    {
      field: "estimated_budget",
      name: "Estimated Budget",
      width: 70,
      align: "left",
      render: (params) => {
        return (
          <>
            <Typography>
              {"\u20B1"} {params.estimated_budget.toLocaleString()}
            </Typography>
          </>
        );
      },
    },
    {
      field: "action",
      name: "Actions",
      position: "sticky",
      width: "100px",
      right: 0,
      align: "center",
      render: (params) => {
        return (
          <>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
              }}
            >
              <Link
                onClick={() => {
                  setUpdateData(params);
                  setOpenModal(false, false, true);
                  resetInput();
                }}
                size="md"
                variant="plain"
                color="primary"
                underline="hover"
                fontSize={14}
                endDecorator={<IoOpenOutline />}
              >
                Update
              </Link>
              <Link
                onClick={() => {
                  setOpenModal(false, true, true);
                  // alert(`Action clicked for ID: ${params.id}`)
                }}
                size="md"
                variant="plain"
                color="danger"
                underline="hover"
                fontSize={14}
                endDecorator={<IoOpenOutline />}
              >
                Delete
              </Link>
            </Stack>
          </>
        );
      },
    },
  ];

  return (
    <Fragment>
      <ServerTableComponent
        data={data}
        columns={objHeaders}
        pageSize={pagination?.per_page}
        currentPage={currentPage}
        totalPages={0}
        onPageChange={setCurrentPage}
        paginationMeta={pagination}
        stripe="even"
        withCount={pagination?.total}
        fieldsToSearch={["title", "description"]}
        search={""}
        bordered
        hoverRow
        stickLast
      />
      {/* <ScrollableTableComponent
        data={data}
        columns={objHeaders}
        pageSize={5}
        stripe="even"
        bordered
        hoverRow
        isLoading={false}
        stickLast
      /> */}
    </Fragment>
  );
};
