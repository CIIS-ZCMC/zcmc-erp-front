import {
  IconButton,
  Link,
  Stack,
  Typography,
  Divider,
  Tooltip,
  Box,
} from "@mui/joy";
import { DeleteIcon, DownloadCloud, ExternalLink } from "lucide-react";
import { BsOpencollective } from "react-icons/bs";
import {
  IoInformationOutline,
  IoOpen,
  IoOpenOutline,
  IoTrashBinOutline,
} from "react-icons/io5";
import { IoMdTrash } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { descriptionsData, procurement_mode } from "./dummy";
import ChipComponent from "../Components/Common/ChipComponent";
import React from "react";
import moment from "moment";
import { BiTrash } from "react-icons/bi";
import { getStatusColorScheme } from "../Utils/ColorScheme";
import { toCapitalize } from "../Utils/Typography";

export const objHeaders = ({ onUpdate, onDelete, onViewIndicators }) => [
  { field: "id", name: "Row #", align: "center", width: "50px" },
  {
    field: "function",
    name: "Function",
    width: 100,
    align: "left",
    render: (params) => {
      return (
        <Stack>
          <Typography fontWeight={600} fontSize={13}>
            {params?.function?.type}
          </Typography>
          <Typography level="body-xs" fontSize={13}>
            {params?.function?.code}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: "objective",
    name: "Objective",
    width: 200,
    align: "left",
    render: (params) => {
      return (
        <Stack>
          <Typography
            fontWeight={600}
            fontSize={13}
            sx={{ textTransform: "capitalize" }}
          >
            {params?.objective?.description}
          </Typography>
          <Typography
            level="body-xs"
            sx={{ alignItems: "center", display: "flex", gap: 0.4 }}
          >
            {params?.objective?.code}
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
    render: (params) => {
      return (
        <Link
          onClick={() => onViewIndicators(params)}
          size="md"
          variant="plain"
          color="black"
          underline="hover"
          fontSize={14}
          endDecorator={<IoOpenOutline />}
        >
          See all {params.success_indicator?.length || 0} success indicators
        </Link>
      );
    },
  },
  {
    field: "created_at",
    name: "Created on",
    width: 100,
    align: "center",
    render: (params) => {
      return (
        <Stack>
          <Typography fontSize={13}>
            {moment(params?.meta?.created_at).format("LL")}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: "updated_at",
    name: "Updated on",
    width: 100,
    align: "center",
    render: (params) => {
      return (
        <Stack>
          <Typography fontSize={13}>
            {moment(params?.meta?.updated_at).format("LL")}
          </Typography>
        </Stack>
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
            sx={{ alignItems: "center", justifyContent: "center" }}
            gap={2}
          >
            <Link
              onClick={() => onUpdate(params)}
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
              onClick={() => onDelete(params)}
              size="md"
              variant="plain"
              color="danger"
              underline="hover"
              fontSize={14}
              endDecorator={<BiTrash />}
            >
              Delete
            </Link>
          </Stack>
        </>
      );
    },
  },
];

export const successIndicator = [
  { field: "id", name: "Row #", width: "70px", align: "center" },
  { field: "code", name: "Code", width: "90px", align: "center" },
  {
    field: "description",
    name: "Description",
    width: "150px",
    align: "center",
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
    // field: "action",
    // name: "Actions",
    // isDropdown: false,
    // position: "sticky",
    width: 150,
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
    width: 50,
    align: "center",
  },

  {
    field: "timeframe",
    name: "Timeframe",
    align: "center",
    width: 100,
    children: [
      { field: "startMonth", name: "Start(Month)" },
      { field: "endMonth", name: "End(Month)" },
    ],
  },
  {
    field: "target",
    name: "Target (by quarter)",
    align: "center",
    width: 200,
    children: [
      { field: "quarter", name: "Q1", width: 20 },
      { field: "quarter2", name: "Q2", width: 20 },
      { field: "quarter3", name: "Q3", width: 20 },
      { field: "quarter4", name: "Q4", width: 20 },
    ],
  },

  {
    field: "cost",
    name: "Cost",
    width: 50,
    align: "center",
  },

  {
    field: "gad_related_activity",
    name: "Is GAD-related activity",
    width: 70,
    align: "center",
  },

  {
    field: "action",
    name: "Actions",
    isDropdown: false,
    position: "sticky",
    width: 150,
    align: "center",
  },
];

export const AOP_RESOURCE_HEADER = [
  {
    field: "id_count",
    name: "Row #",
    width: "5%",
    align: "center",
  },
  {
    field: "item_name",
    name: "Item Name",
    width: "20%",
    align: "left",
  },

  {
    field: "quantity",
    name: " Quantity",
    width: "10%",
    align: "center",
  },

  {
    field: "individual_price",
    name: "individual Price",
    width: "20%",
    align: "center",
  },

  {
    field: "total_cost",
    name: "Total Cost",
    width: "20%",
    align: "center",
  },

  {
    field: "purchase_type",
    name: "Purchase Type",
    width: "20%",
    align: "center",
  },

  {
    field: "expense_class",
    name: "Expense class of unit",
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

export const ppmpHeaders = (handleOpenDel, items, modes, isEditing) => [
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
    field: "item",
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
    width: 155,
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
              color="primary"
            >
              <Link
                href="#"
                underline="always"
                variant="soft"
                color="primary"
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
    width: 85,
    align: "center",
  },
  {
    field: "quantity",
    name: "Quantity Inputted",
    width: 85,
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
            onClick={() => {
              handleOpenDel(params);
            }}
            color="danger"
            size="lg"
            disabled={!isEditing}
          >
            <MdDeleteOutline />
          </IconButton>
        </>
      );
    },
  },
];

export const RESOURCES_HEADER = [
  {
    field: "id_count",
    name: "Row #",
    width: "50px",
    align: "center",
  },
  {
    field: "resource_requirements",
    name: "Resource Requirements",
    children: [
      {
        field: "item_name",
        name: "Item name",
        width: 500,
      },
      {
        field: "quantity",
        name: "Quantity of item",
        width: 50,
      },
      {
        field: "unit_cost",
        name: "Individual price",
        width: 50,
        render: (params) => {
          return (
            <Typography textAlign={"end"}>
              &#8369; {params.toLocaleString()}
            </Typography>
          );
        },
      },
      {
        field: "total_cost",
        name: "Total cost",
        width: 50,
        render: (params) => {
          return (
            <Typography textAlign={"end"}>
              &#8369; {params.toLocaleString()}
            </Typography>
          );
        },
      },
    ],
    width: 1100,
    align: "center",
  },
  {
    field: "expense_class",
    name: "Expense class of unit",
    width: 120,
    align: "center",
    render: (params) => {
      return params.expense_class;
    },
  },
  {
    field: "type_of_resource",
    name: "Type of resource",
    width: 200,
    align: "center",
  },
];

export const PPMP_REQUEST_HEADER = (handleOpen, handleExport) => [
  {
    field: "id_count",
    name: "Row #",
    width: "40px",
    align: "center",
  },
  {
    field: "requester",
    name: "Requester",
    width: 300,
    align: "start",
  },
  {
    field: "requester_area",
    name: "Requester",
    width: 300,
    align: "start",
    render: (params) => {
      return params?.requester_area?.name;
    },
  },
  {
    field: "total_items",
    name: "Total items",
    width: 100,
    align: "start",
    render: (params) => {
      return params.total_items.toLocaleString();
    },
  },
  {
    field: "total_budget",
    name: "Amount",
    width: 200,
    align: "start",
    render: (params) => {
      return (
        <Typography textAlign={"end"}>
          &#8369; {params.total_budget.toLocaleString()}
        </Typography>
      );
    },
  },
  {
    field: "status",
    name: "Status",
    width: 100,
    align: "center",
    render: (params) => {
      return (
        <ChipComponent
          label={toCapitalize(params.status)}
          endDecorator
          status={params.status?.toLowerCase()}
          color={getStatusColorScheme(params.status?.toLowerCase())}
        />
      );
    },
  },
  {
    field: "action",
    name: "Actions",
    position: "sticky",
    width: "250px",
    right: 0,
    align: "center",
    render: (params) => {
      return (
        <Stack direction={"row"} spacing={3} justifyContent="space-evenly">
          <Link
            onClick={() => handleOpen(params.id)}
            underline="hover"
            level="body-xs"
            fontWeight={400}
            endDecorator={<ExternalLink size={14} />}
          >
            Open request
          </Link>
          <Link
            onClick={() => handleExport(params.id, params.requester_area)}
            level="body-xs"
            textColor={"neutral.700"}
            underline="hover"
            fontWeight={400}
            endDecorator={<DownloadCloud size={14} />}
          >
            Export as (.xls)
          </Link>
        </Stack>
      );
    },
  },
];

export const PPMP_VIEW_HEADER = [
  {
    field: "id_count",
    name: "Row #",
    width: "50px",
    align: "center",
  },
  {
    field: "general_description",
    name: "General description",
    inputType: "dropdown",
    width: 300,
    // align: "start",
  },
  {
    field: "classification",
    name: "Item Classification",
    width: 150,
    // align: "center",
  },
  {
    field: "item_category",
    name: "Item Category",
    width: 150,
    // align: "center",
  },
  {
    field: "quantity",
    name: "Quantity",
    width: 70,
    align: "center",
  },
  {
    field: "unit",
    name: "Unit",
    width: 100,
    // align: "center",
  },
  {
    field: "total_amount",
    name: "Total amount",
    width: 100,
    align: "end",
    render: (params) => {
      return (
        <Typography textAlign={"end"}>
          &#8369; {params.total_amount.toLocaleString() ?? 0}
        </Typography>
      );
    },
  },
  {
    field: "monthly_distribution",
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
  // {
  //   field: "fund_source",
  //   name: "Mode of procurement",
  //   width: 150,
  //   align: "center",
  // },
  // {
  //   field: "remarks",
  //   name: "Remarks",
  //   width: 200,
  //   inputType: "input",
  //   align: "center",
  // },
];

export const variantCols = (updateCallBack, delCallback) => [
  { field: "id", name: "Row #", align: "left", width: "50px" },
  { field: "clName", name: "Classification", width: 200, align: "left" },

  { field: "created_at", name: "Created at", width: 200, align: "left" },
  { field: "updated_at", name: "Updated at", width: 200, align: "left" },
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
            sx={{ justifyContent: "space-around", alignItems: "center" }}
          >
            <Link
              onClick={() => updateCallBack(params)}
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
              onClick={() => delCallback(params)}
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

export const categoryCols = (updateCallBack, delCallback) => [
  { field: "id", name: "Row #", align: "left", width: "50px" },
  { field: "clName", name: "Classification", width: 200, align: "left" },

  { field: "created_at", name: "Created at", width: 200, align: "left" },
  { field: "updated_at", name: "Updated at", width: 200, align: "left" },
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
            sx={{ justifyContent: "space-around", alignItems: "center" }}
          >
            <Link
              onClick={() => updateCallBack(params)}
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
              onClick={() => delCallback(params)}
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

export const classificationCols = (updateCallBack, delCallback) => [
  { field: "id", name: "Row #", align: "left", width: "50px" },
  { field: "code", name: "Code", width: 100, align: "left" },
  { field: "clName", name: "Classification", width: 200, align: "left" },
  { field: "description", name: "Description", width: 250, align: "left" },
  { field: "created_at", name: "Created at", width: 200, align: "left" },
  { field: "updated_at", name: "Updated at", width: 200, align: "left" },
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
            sx={{ justifyContent: "space-around", alignItems: "center" }}
          >
            <Link
              onClick={() => updateCallBack(params)}
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
              onClick={() => delCallback(params)}
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
