import { IconButton, Link, Stack, Typography } from "@mui/joy";
import { BsOpencollective } from "react-icons/bs";
import { IoOpen, IoOpenOutline } from "react-icons/io5";

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

export const ppmpHeaders = [
  {
    field: "id",
    name: "Row #",
    width: "70px",
  },
  {
    field: "description",
    name: "General description",
    isDropdown: true,
    width: "70px",
  },
  {
    field: "classification",
    name: "Item Classification",
    isDropdown: true,
    width: 150,
  },
  {
    field: "category",
    name: "Item Category",
    isDropdown: true,
    width: 150,
  },
  {
    field: "quantity",
    name: "Quantity",
    isDropdown: false,
    width: 100,
  },
  {
    field: "unit",
    name: "Unit",
    isDropdown: false,
    width: 100,
  },
  {
    field: "total_amount",
    name: "Total amount",
    isDropdown: false,
    width: 100,
  },
  {
    field: "target_by_quarter",
    name: "Target (by quarter)",
    isDropdown: false,
    children: [
      { field: "jan", name: "Jan", width: "100" },
      { field: "feb", name: "Feb", width: "100" },
      { field: "mar", name: "Mar", width: "100" },
      { field: "apr", name: "Apr", width: "100" },
      { field: "may", name: "May", width: "100" },
      { field: "jun", name: "Jun", width: "100" },
      { field: "jul", name: "Jul", width: "100" },
      { field: "aug", name: "Aug", width: "100" },
      { field: "sep", name: "Sep", width: "100" },
      { field: "oct", name: "Oct", width: "100" },
      { field: "nov", name: "Nov", width: "100" },
      { field: "dec", name: "Dec", width: "100" },
    ],
    width: 550,
  },
  {
    field: "fund_source",
    name: "Mode of procurement",
    isDropdown: true,
    width: 150,
  },
  {
    field: "remarks",
    name: "Remarks",
    isDropdown: true,
  },
  {
    field: "action",
    name: "Actions",
    isDropdown: false,
    width: "150px",
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
