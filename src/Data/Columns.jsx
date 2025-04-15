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

export const AOP_HEADER = [
  { field: "id", name: "Row #", align: "center", width: "50px" },
  {
    field: "function",
    name: "Type of Function",
    width: "30%",
    align: "left",
  },
  {
    field: "objectives",
    name: "Objectives",
    width: "20%",
    align: "center",
  },
  {
    field: "success_indicators",
    name: "Success Indicators",
    width: "20%",
    align: "center",
  },
  {
    field: "action",
    name: "Actions",
    position: "sticky",
    width: "150px",
    right: 0,
    align: "center",
  },
];

export const ACTIVITIES_HEADER = [
  {
    field: "id",
    name: "Row #",
    width: "4%",
    align: "center",
  },
  {
    field: "activities",
    name: "Activities",
    width: "10%",
    align: "center",
  },

  {
    field: "",
    name: "Timeframe",
    align: "center",
    width: "15%",
    children: [
      { field: "startMonth", name: "Start(Month)" },
      { field: "endMonth", name: "End(Month)" },
    ],
  },
  {
    field: "",
    name: "Target (by quarter)",
    align: "center",
    width: "20%",
    children: [
      { field: "quarter1", name: "Q1", width: "10%" },
      { field: "quarter2", name: "Q2", width: "10%" },
      { field: "quarter3", name: "Q3", width: "10%" },
      { field: "quarter4", name: "Q4", width: "10%" },
    ],
  },

  {
    field: "cost",
    name: "Cost",
    width: "10%",
    align: "center",
  },

  {
    field: "gad_related_activity",
    name: "Is GAD-related activity",
    width: "10%",
    align: "center",
  },

  {
    field: "object_category",
    name: "Object Category (MOOE or CO)",
    width: "10%",
    align: "center",
  },

  {
    field: "action",
    align: "center",
    name: "Actions",
  },
];

export const AOP_RESOURCE_HEADER = [
  {
    field: "id",
    name: "Row #",
    width: "5%",
    align: "center",
  },
  {
    field: "item_name",
    name: "Item Name",
    width: "15%",
    align: "left",
  },
  {
    field: "resource_type",
    name: "Type of Resource",
    width: "15%",
    align: "center",
  },

  {
    field: "expense_class",
    name: "Expense class of unit",
    width: "20%",
    align: "center",
  },

  {
    field: "procurement_mode",
    name: "Mode of procurement",
    width: "20%",
    align: "center",
  },

  {
    field: "action",
    name: "Actions",
    position: "sticky",
    width: "150px",
    right: 0,
    align: "center",
  },
];
