import React, { Fragment, useEffect } from "react";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import { Typography } from "@mui/joy";
import { Stack, Link } from "@mui/joy";
import { IoInformationOutline, IoOpen, IoOpenOutline } from "react-icons/io5";
import useLibItemHook from "../../../Hooks/Libraries/LibItemHooks";
import useModalHook from "../../../Hooks/ModalHook";
export const Items = () => {
  const { resetInput, setUpdateData, updateData } = useLibItemHook();
  const { openModal, setOpenModal } = useModalHook();

  useEffect(() => {
    if (openModal.isNew) {
      setUpdateData(null);
      resetInput();
    }
  }, [openModal]);

  const data = [
    {
      id: 1,
      name: "Ballpen",
      classification: "Office Supply",
      item_category: "Writing Instrument",
      variant: "Blue Ink",
      unit: "Piece",
      estimated_budget: "15.00",
    },
    {
      id: 2,
      name: "Printer Paper",
      classification: "Office Supply",
      item_category: "Paper",
      variant: "A4, 80gsm",
      unit: "Ream",
      estimated_budget: "250.00",
    },
    {
      id: 3,
      name: "Alcohol",
      classification: "Medical Supply",
      item_category: "Disinfectant",
      variant: "70% Solution",
      unit: "Bottle",
      estimated_budget: "120.00",
    },
    {
      id: 4,
      name: "Stapler",
      classification: "Office Equipment",
      item_category: "Fastening Tool",
      variant: "Heavy Duty",
      unit: "Unit",
      estimated_budget: "350.00",
    },
    {
      id: 5,
      name: "Face Mask",
      classification: "Medical Supply",
      item_category: "PPE",
      variant: "3-ply Disposable",
      unit: "Box",
      estimated_budget: "200.00",
    },
  ];

  const objHeaders = [
    { field: "id", name: "Row #", align: "center", width: "50px" },
    { field: "name", name: "Item name", width: 200, align: "left" },
    {
      field: "classification",
      name: "Classification",
      width: 200,
      align: "left",
    },
    { field: "item_category", name: "Category", width: 200, align: "left" },
    { field: "variant", name: "Variant", width: 200, align: "left" },
    {
      field: "unit",
      name: "Unit of Measurement",
      width: 200,
      align: "left",
    },
    {
      field: "estimated_budget",
      name: "Estimated Budget",
      width: 200,
      align: "left",
    },
    {
      field: "action",
      name: "Actions",
      position: "sticky",
      width: "150px",
      right: 0,
      align: "center",
      render: (params) => {
        return (
          <>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
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
      <ScrollableTableComponent
        data={data}
        columns={objHeaders}
        pageSize={5}
        stripe="even"
        bordered
        hoverRow
        isLoading={false}
        stickLast
      />
    </Fragment>
  );
};
