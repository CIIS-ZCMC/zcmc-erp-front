import { IconButton, Link, Stack, Typography } from "@mui/joy";
import { DeleteIcon } from "lucide-react";
import { BsOpencollective } from "react-icons/bs";
import { IoOpen, IoOpenOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";

export const objHeaders = [
  { field: "id", name: "Row #", align: "center", width: "50px" },
  { field: "function", name: "Function", width: 200, align: "left" },
  {
    field: "objective",
    name: "Objective",
    width: 200,
    align: "left",
    render: (params) => {
      return (
        <Stack>
          <Typography fontWeight={600} fontSize={13}>
            {params?.objective}
          </Typography>
          <Typography
            level="body-xs"
            sx={{ alignItems: "center", display: "flex", gap: 0.4 }}
          >
            {params?.objective}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: "success_indicators",
    name: "Success Indicators",
    width: 200,
    align: "center",
  },
  { field: "created_at", name: "Created on", width: 200, align: "center" },
  { field: "updated_at", name: "Updated on", width: 200, align: "center" },
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
              onClick={() => alert(`Action clicked for ID: ${params.function}`)}
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
              onClick={() => alert(`Action clicked for ID: ${params.id}`)}
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

export const ppmpHeaders = (handleDeleteRow) => [
  {
    field: "id",
    name: "Row #",
    width: "70px",
    align: "center",
  },
  {
    field: "description",
    name: "General description",
    inputType: "dropdown",
    width: 200,
    align: "center",
  },
  {
    field: "classification",
    name: "Item Classification",
    width: 150,
    align: "center",
  },
  {
    field: "category",
    name: "Item Category",
    width: 150,
    align: "center",
  },
  {
    field: "quantity",
    name: "Quantity",
    width: 100,
    align: "center",
  },
  {
    field: "unit",
    name: "Unit",
    width: 100,
    align: "center",
  },
  {
    field: "total_amount",
    name: "Total amount",
    width: 100,
    align: "center",
  },
  {
    field: "target_by_quarter",
    name: "Target (by quarter)",
    children: [
      { field: "jan", name: "Jan", width: 100, inputType: "input" },
      { field: "feb", name: "Feb", width: 100, inputType: "input" },
      { field: "mar", name: "Mar", width: 100, inputType: "input" },
      { field: "apr", name: "Apr", width: 100, inputType: "input" },
      { field: "may", name: "May", width: 100, inputType: "input" },
      { field: "jun", name: "Jun", width: 100, inputType: "input" },
      { field: "jul", name: "Jul", width: 100, inputType: "input" },
      { field: "aug", name: "Aug", width: 100, inputType: "input" },
      { field: "sep", name: "Sep", width: 100, inputType: "input" },
      { field: "oct", name: "Oct", width: 100, inputType: "input" },
      { field: "nov", name: "Nov", width: 100, inputType: "input" },
      { field: "dec", name: "Dec", width: 100, inputType: "input" },
    ],
    width: 1000,
    align: "center",
  },
  {
    field: "fund_source",
    name: "Mode of procurement",
    width: 150,
    align: "center",
  },
  {
    field: "remarks",
    name: "Remarks",
    inputType: "input",
    align: "center",
  },
  {
    field: "action",
    name: "Actions",
    isDropdown: false,
    width: "100px",
    align: "center",
    render: (params) => {
      return (
        <>
          <Link
            onClick={() => handleDeleteRow(params.id)}
            size="md"
            variant="plain"
            color="primary"
            underline="hover"
            fontSize={14}
            endDecorator={<MdDeleteOutline />}
          >
            Remove
          </Link>
        </>
      );
    },
  },
];
