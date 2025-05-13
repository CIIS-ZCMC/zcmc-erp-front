import {
  IconButton,
  Link,
  Stack,
  Typography,
  Divider,
  Tooltip,
  Box,
} from "@mui/joy";
import { DeleteIcon } from "lucide-react";
import { BsOpencollective } from "react-icons/bs";
import { IoInformationOutline, IoOpen, IoOpenOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { descriptionsData, procurement_mode } from "./dummy";
import ChipComponent from "../Components/Common/ChipComponent";
import React from "react";

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
  {
    field: "id",
    name: "Row #",
    width: "70px",
    align: "center",
  },
  {
    field: "function_type",
    name: "Type of Function",
    inputType: "dropdown",
    width: 200,
    align: "center",
  },
  {
    field: "objectives",
    name: "Objectives",
    width: 200,
    align: "center",
  },
  {
    field: "success_indicator",
    name: "Success Indicator",
    width: 200,
    align: "center",
  },
  {
    field: "action",
    name: "Actions",
    isDropdown: false,
    position: "sticky",
    width: "150px",
    align: "center",
  },
];

export const AOP_ACTIVITIES_HEADER = [
  {
    field: "id",
    name: "Row #",
    width: "4%",
    align: "center",
  },
  {
    field: "name",
    name: "Activities",
    width: "10%",
    align: "center",
  },

  {
    field: "timeframe",
    name: "Timeframe",
    align: "center",
    width: "15%",
    children: [
      { field: "startMonth", name: "Start(Month)" },
      { field: "endMonth", name: "End(Month)" },
    ],
  },
  {
    field: "target",
    name: "Target (by quarter)",
    align: "center",
    width: "20%",
    children: [
      { field: "quarter", name: "Q1", width: "10%" },
      { field: "quarter2", name: "Q2", width: "10%" },
      { field: "quarter3", name: "Q3", width: "10%" },
      { field: "quarter4", name: "Q4", width: "10%" },
    ],
  },

  {
    field: "cost",
    name: "Cost",
    width: "5%",
    align: "center",
  },

  {
    field: "gad_related_activity",
    name: "Is GAD-related activity",
    width: "10%",
    align: "center",
  },

  {
    field: "action",
    width: "15%",
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

export const ppmpHeaders = (handleDeleteRow, items, modes) => [
  {
    field: "id",
    name: "Row #",
    width: "50px",
    align: "center",
    display: "none",
  },
  // {
  //   field: "item_code",
  //   name: "Item Code",
  //   width: "80px",
  //   align: "center",
  //   display: "none",
  // },

  {
    field: "description",
    name: "General description",
    inputType: "dropdown",
    width: "200px",
    align: "center",
    options: items,
    render: (params) => {
      return (
        <>
          <Typography>
            {params?.item?.name ? params?.item?.name : "-"}
          </Typography>
        </>
      );
    },
  },
  {
    field: "activity_code",
    name: "Activity Code",
    width: 150,
    align: "center",
    display: "none",
    render: (params) => {
      const activities = params?.activities || [];
      const visibleActivities = activities.slice(0, 2);
      const hiddenActivities = activities.slice(2);
      const remainingCount = hiddenActivities.length;

      return (
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={0.5}>
          {visibleActivities.map((act, index) => (
            <React.Fragment key={act.id || index}>
              <Link
                underline="always"
                href="#"
                sx={{ fontSize: 12, color: "black" }}
                color="neutral.700"
              >
                {act.activity_code}
              </Link>
              {index < visibleActivities.length - 1 && (
                <Typography component="span">,</Typography>
              )}
            </React.Fragment>
          ))}

          {remainingCount > 0 && (
            <Tooltip
              title={
                <React.Fragment>
                  {hiddenActivities.map((act, idx) => (
                    <div key={idx}>{act.activity_code}</div>
                  ))}
                </React.Fragment>
              }
              placement="top"
              variant="soft"
              color="success"
            >
              <Link
                href="#"
                underline="always"
                variant="soft"
                color="success"
                sx={{
                  fontSize: 12,
                }}
                onClick={(e) => e.preventDefault()}
              >
                +{remainingCount} more
              </Link>
            </Tooltip>
          )}
        </Box>
      );
    },
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
    field: "aop_quantity",
    name: "Quantity",
    width: 95,
    align: "center",
  },
  {
    field: "quantity",
    name: "Quantity Inputted",
    width: 95,
    align: "center",
    render: (params) => {
      return (
        <>
          {params?.quantity ? (
            <Typography>{params?.quantity?.toLocaleString()}</Typography>
          ) : (
            "-"
          )}
        </>
      );
    },
  },
  {
    field: "unit",
    name: "Unit",
    width: 90,
    align: "center",
  },
  {
    field: "total_amount",
    name: "Total amount",
    width: 100,
    align: "center",
    render: (params) => {
      return (
        <>
          {params?.total_amount ? (
            <Typography>
              &#8369; {params?.total_amount?.toLocaleString()}
            </Typography>
          ) : (
            "-"
          )}
        </>
      );
    },
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
    field: "procurement_mode",
    name: "Mode of procurement",
    width: 150,
    align: "center",
    inputType: "dropdown",
    options: modes,
    render: (params) => {
      return (
        <>
          <Typography>
            {params?.procurement_mode?.name
              ? params?.procurement_mode?.name
              : "-"}
          </Typography>
        </>
      );
    },
  },
  {
    field: "remarks",
    name: "Remarks",
    width: 200,
    inputType: "input",
    align: "center",
  },
  {
    field: "action",
    name: "Actions",
    isDropdown: false,
    width: "70px",
    align: "center",
    render: (params) => {
      return (
        <>
          <IconButton
            onClick={() => handleDeleteRow(params.id)}
            color="primary"
            size="lg"
          >
            <MdDeleteOutline />
          </IconButton>
        </>
      );
    },
  },
];
