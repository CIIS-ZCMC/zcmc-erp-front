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

export const AOP_STEP_HEADER = [
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
    field: 'expense_class',
    name: "Expense class of unit",
    width: "15%",
    align: "center",
  },

  {
    field: 'jan',
    name: "Jan",
    width: "5%",
    align: "center",
  },

  {
    field: 'feb',
    name: "Feb",
    width: "5%",
    align: "center",
  },

  {
    field: 'mar',
    name: "Mar",
    width: "5%",
    align: "center",
  },

  {
    field: 'apr',
    name: "Apr",
    width: "5%",
    align: "center",
  },

  {
    field: 'may',
    name: "May",
    width: "5%",
    align: "center",
  },

  {
    field: 'jun',
    name: "June",
    width: "5%",
    align: "center",
  },

  {
    field: 'jul',
    name: "Jul",
    width: "5%",
    align: "center",
  },

  {
    field: 'aug',
    name: "Aug",
    width: "5%",
    align: "center",
  },
  {
    field: 'sep',
    name: "Sep",
    width: "5%",
    align: "center",
  },

  {
    field: 'oct',
    name: "Oct",
    width: "5%",
    align: "center",
  },

  {
    field: 'nov',
    name: "Nov",
    width: "5%",
    align: "center",
  },

  {
    field: 'dec',
    name: "Dec",
    width: "5%",
    align: "center",
  },

  {
    field: 'procurement_mode',
    name: "Mode of procurement",
    width: "15%",
    align: "center",
  },

  {
    field: "actions",
    align: "center",
    name: "Actions",
  },

];
