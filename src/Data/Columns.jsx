import {
  IconButton,
  Link,
  Stack,
  Typography,
  Divider,
  Tooltip,
  Box,
  Chip,
  Button,
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
import {
  CheckOutlined,
  Circle,
  Clear,
  CommentOutlined,
  DeleteOutlineOutlined,
  ModeEditOutlineOutlined,
  WarningAmberOutlined,
  WarningOutlined,
  HourglassEmpty,
  X,
  EditOutlined,
  ArchiveOutlined,
  Edit,
} from "@mui/icons-material";
import { grey, red } from "@mui/material/colors";
import ButtonComponent from "@Components/Common/ButtonComponent";
import { formatPeso } from "../Utils/FormatPeso";
import formattedPrice from "../Utils/formattedPrice";

export const objHeaders = ({
  active,
  onUpdate,
  onDelete,
  onViewIndicators,
}) => [
  {
    field: "function",
    label: "Function",
    width: "100px",
    align: "left",
    render: (params) => {
      return (
        <Stack>
          <Typography fontWeight={600} level="body-sm" color="black">
            {params?.function?.type}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: "objective",
    label: "Objective",
    width: "350px",
    align: "left",
    render: (params) => {
      return (
        <Stack>
          <Typography fontWeight={600} level="body-sm" color="black">
            {params?.objective?.description}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: "success_indicators",
    label: "Success Indicators",
    align: "center",
    render: (params) => {
      return (
        <Chip
          onClick={() => onViewIndicators(params)}
          size="md"
          variant="soft"
          color="neutral"
          underline="hover"
          level="body-sm"
          startDecorator={<IoOpenOutline />}
        >
          {params.success_indicator?.length || 0} success indicator
          {params.success_indicator?.length > 1 ? "s" : ""}
        </Chip>
      );
    },
  },
  {
    field: "created_at",
    label: "Created on",
    align: "center",
    width: "150px",
    render: (params) => {
      return (
        <Stack>
          <Typography level="body-sm">
            {moment(params?.meta?.created_at).format("LL")}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: "updated_at",
    label: "Updated on",
    align: "center",
    width: "150px",
    render: (params) => {
      return (
        <Stack>
          <Typography level="body-sm">
            {moment(params?.meta?.updated_at).format("LL")}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: "action",
    label: "Actions",
    position: "sticky",
    align: "center",
    render: (params) => {
      return (
        <>
          <Stack
            direction="row"
            sx={{ alignItems: "center", justifyContent: "center" }}
            gap={2}
          >
            <Chip
              onClick={() => onUpdate(params)}
              size="md"
              variant="soft"
              color="neutral"
              underline="hover"
              fontSize={14}
              startDecorator={<EditOutlined />}
              sx={{
                display: active ? "flex" : "none",
              }}
            >
              Edit
            </Chip>
            <Chip
              onClick={() => onDelete(params)}
              size="md"
              variant="soft"
              color="neutral"
              underline="hover"
              fontSize={14}
              startDecorator={<DeleteOutlineOutlined />}
            >
              {active ? "Archive" : "Unarchive"}
            </Chip>
          </Stack>
        </>
      );
    },
  },
];

export const successIndicator = [
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
    name: "#",
    width: 20,
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
    width: 100,
    align: "center",
  },
];

export const AOP_ACTIVITIES_HEADER = [
  {
    field: "id",
    name: "#",
    width: 20,
    align: "center",
  },
  {
    field: "name",
    name: "Activities",
    width: 130,
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
    width: 100,
    children: [
      { field: "quarter", name: "Q1", width: 10 },
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
    width: 100,
    align: "center",
  },
];

export const AOP_RESOURCE_HEADER = [
  {
    field: "id_count",
    name: "#",
    width: 20,
    align: "center",
  },
  {
    field: "item_name",
    name: "Item Name",
    width: 200,
    align: "left",
  },

  {
    field: "quantity",
    name: " Quantity",
    width: 25,
    align: "center",
  },

  {
    field: "individual_price",
    name: "individual Price",
    width: 70,
    align: "center",
  },

  {
    field: "total_cost",
    name: "Total Cost",
    width: 70,
    align: "center",
  },

  {
    field: "purchase_type",
    name: "Purchase Type",
    width: 120,
    align: "center",
  },

  {
    field: "expense_class",
    name: "Expense class of unit",
    width: 120,
    align: "center",
  },

  {
    field: "action",
    name: "Actions",
    position: "sticky",
    width: 60,
    right: 0,
    align: "center",
  },
];

export const ppmpHeaders = (handleOpenDel, items, modes, isEditing) => [
  {
    field: "id",
    name: "#",
    width: "30px",
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
          <Typography fontSize={12} textAlign="left">
            {params?.item?.name ? params?.item?.name : "-"}
          </Typography>
        </>
      );
    },
  },
  {
    field: "activity_code",
    name: "Activity Code",
    width: 120,
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
                sx={{ fontSize: 11, color: "black" }}
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
                  fontSize: 11,
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
    name: "Classification",
    width: 110,
    align: "center",
  },
  {
    field: "category",
    name: "Item Category",
    width: 110,
    align: "center",
  },
  // {
  //   field: "aop_quantity",
  //   name: "Quantity",
  //   width: 85,
  //   align: "center",
  // },
  {
    field: "quantity",
    name: "Qty",
    width: 50,
    align: "center",
    render: (params) => {
      return (
        <>
          {params?.quantity ? (
            <Typography fontSize={12}>
              {params?.quantity?.toLocaleString()}
            </Typography>
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
    width: 50,
    align: "center",
  },
  {
    field: "estimated_budget",
    name: "Estimated Budget",
    width: 80,
    align: "center",
    render: (params) => {
      return (
        <>
          {params?.estimated_budget ? (
            <Typography fontSize={12}>
              &#8369; {params?.estimated_budget?.toLocaleString()}
            </Typography>
          ) : (
            "-"
          )}
        </>
      );
    },
  },
  {
    field: "total_amount",
    name: "Total Amount",
    width: 80,
    align: "center",
    render: (params) => {
      return (
        <>
          {params?.total_amount ? (
            <Typography fontSize={12}>
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
    name: "Schedule/Milestone",
    children: [
      {
        field: "jan",
        name: "Jan",
        width: 80,
        align: "center",
        inputType: "input",
      },
      {
        field: "feb",
        name: "Feb",
        width: 80,
        align: "center",
        inputType: "input",
      },
      {
        field: "mar",
        name: "Mar",
        width: 80,
        align: "center",
        inputType: "input",
      },
      {
        field: "apr",
        name: "Apr",
        width: 80,
        align: "center",
        inputType: "input",
      },
      {
        field: "may",
        name: "May",
        width: 80,
        align: "center",
        inputType: "input",
      },
      {
        field: "jun",
        name: "Jun",
        width: 80,
        align: "center",
        inputType: "input",
      },
      {
        field: "jul",
        name: "Jul",
        width: 80,
        align: "center",
        inputType: "input",
      },
      {
        field: "aug",
        name: "Aug",
        width: 80,
        align: "center",
        inputType: "input",
      },
      {
        field: "sep",
        name: "Sep",
        width: 80,
        align: "center",
        inputType: "input",
      },
      {
        field: "oct",
        name: "Oct",
        width: 80,
        align: "center",
        inputType: "input",
      },
      {
        field: "nov",
        name: "Nov",
        width: 80,
        align: "center",
        inputType: "input",
      },
      {
        field: "dec",
        name: "Dec",
        width: 80,
        align: "center",
        inputType: "input",
      },
    ],
    width: 700,
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
          <Typography fontSize={12}>
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

export const variantCols = (
  active,
  setSelectedData,
  updateCallBack,
  delCallback,
  expandedCategories,
  expandCategory,
) => [
  {
    key: "system",
    label: "System",
    width: 150,
    align: "left",
    render: (params) => {
      return <Typography fontWeight={600}>{params.system}</Typography>;
    },
  },
  { key: "code", label: "Code", align: "left", width: 100 },
  {
    key: "category",
    label: "Category",
    align: "left",
    width: 300,
    render: (params) => {
      const categories = params?.categories || [];
      const isExpanded = expandedCategories[params.id];

      if (!categories.length) return "-";

      // Collapsed: first 2 categories
      const collapsedCount = 2;
      const visible = isExpanded
        ? categories
        : categories.slice(0, collapsedCount);

      const remaining = categories.length - collapsedCount;

      return (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => expandCategory(params.id)}
        >
          {isExpanded ? (
            // Expanded view: multiline

            categories.map((cat, index) => (
              <Typography key={cat.id || index} level="body-xs">
                {cat.name}
              </Typography>
            ))
          ) : (
            // Collapsed view: single line
            <Typography level="body-xs">
              {visible.map((cat) => cat.name).join(", ")}
              {remaining > 0 && `, +${remaining} more`}
            </Typography>
          )}
        </div>
      );
    },
  },
  {
    key: "created_at",
    label: "Created on",
    width: 100,
    align: "left",
    render: (params) => {
      return moment(params?.meta?.created_at).format("LL");
    },
  },
  {
    key: "updated_at",
    label: "Updated on",
    width: 100,
    align: "left",
    render: (params) => {
      return moment(params?.meta?.updated_at).format("LL");
    },
  },
  {
    key: "action",
    label: "Actions",
    align: "center",
    render: (params) => {
      return (
        <>
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <Chip
              onClick={() => {
                setSelectedData(params);
                updateCallBack(params);
              }}
              size="md"
              variant="soft"
              color="neutral"
              startDecorator={<EditOutlined />}
              sx={{ display: !active && "none" }}
            >
              Edit
            </Chip>
            <Chip
              onClick={() => {
                setSelectedData(params);
                delCallback(params);
              }}
              size="md"
              variant="soft"
              color="neutral"
              startDecorator={<ArchiveOutlined />}
            >
              {active ? "Archive" : "Unarchive"}
            </Chip>
          </Stack>
        </>
      );
    },
  },
];

export const categoryCols = (
  active,
  setSelectedData,
  updateCallBack,
  delCallback,
) => [
  {
    key: "name",
    label: "Category",
    align: "left",
    render: (params) => (
      <Typography level="body-sm" fontWeight={600} sx={{ color: grey[800] }}>
        {params.name}
      </Typography>
    ),
  },
  {
    key: "created_at",
    label: "Created at",

    align: "left",
    render: (params) => {
      return moment(params.meta.created_at).format("LL");
    },
  },
  {
    key: "updated_at",
    label: "Updated at",

    align: "left",
    render: (params) => {
      return moment(params.meta.created_at).format("LL");
    },
  },
  {
    key: "action",
    label: "Actions",

    align: "center",
    render: (params) => {
      return (
        <>
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <Chip
              onClick={() => {
                setSelectedData(params);
                updateCallBack(params);
              }}
              size="md"
              variant="soft"
              color="neutral"
              startDecorator={<EditOutlined />}
              sx={{ display: !active && "none" }}
            >
              Edit
            </Chip>
            <Chip
              onClick={() => {
                setSelectedData(params);
                delCallback(params);
              }}
              size="md"
              variant="soft"
              color="neutral"
              startDecorator={<ArchiveOutlined />}
            >
              {active ? "Archive" : "Unarchive"}
            </Chip>
          </Stack>
        </>
      );
    },
  },
];

export const classificationCols = (
  active,
  setSelectedData,
  updateCallBack,
  delCallback,
) => [
  {
    key: "name",
    label: "Classification",
    align: "left",
    render: (params) => (
      <Typography level="body-sm" fontWeight={600} sx={{ color: grey[800] }}>
        {params.name}
      </Typography>
    ),
  },
  {
    key: "description",
    label: "Description",
    align: "left",
    render: (params) => params.description,
  },
  {
    key: "created_at",
    label: "Created at",

    align: "left",
    render: (params) => {
      return moment(params.meta.created_at).format("LL");
    },
  },
  {
    key: "updated_at",
    label: "Updated at",

    align: "left",
    render: (params) => {
      return moment(params.meta.updated_at).format("LL");
    },
  },
  {
    key: "action",
    label: "Actions",
    align: "center",
    render: (params) => {
      return (
        <>
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <Chip
              onClick={() => {
                setSelectedData(params);
                updateCallBack(params);
              }}
              size="md"
              variant="soft"
              color="neutral"
              startDecorator={<EditOutlined />}
              sx={{ display: !active && "none" }}
            >
              Edit
            </Chip>
            <Chip
              onClick={() => {
                setSelectedData(params);
                delCallback(params);
              }}
              size="md"
              variant="soft"
              color="neutral"
              startDecorator={<ArchiveOutlined />}
            >
              {active ? "Archive" : "Unarchive"}
            </Chip>
          </Stack>
        </>
      );
    },
  },
];

export const itemCols = (
  active,
  setSelectedData,
  handleUpdate = () => {},
  handleDelete = () => {},
) => [
  {
    key: "name",
    label: "Item name",
    align: "left",
    width: "250px",
    render: (params) => {
      return (
        <>
          <Typography
            level="body-sm"
            fontWeight={600}
            sx={{ color: grey[800] }}
          >
            {params.name}
          </Typography>
          <Typography level="body-sm">{params.unit}</Typography>
        </>
      );
    },
  },
  {
    key: "classification",
    label: "Classification & Category",
    align: "left",
    width: "150px",
    render: (row) => (
      <>
        <Typography level="body-sm" fontWeight={600} sx={{ color: grey[800] }}>
          {row?.classification}
        </Typography>
        <Typography
          level={row?.category && "body-sm"}
          sx={{
            fontSize: row?.classification && 13,
            color: row?.classification ? grey[600] : grey[800],
          }}
          fontWeight={row?.classification ? 500 : 600}
        >
          {row?.category}
        </Typography>
      </>
    ),
  },
  {
    key: "estimated_budget",
    label: "Estimated Budget",
    width: "100px",
    render: (params) => {
      return (
        <>
          <Typography level="body-sm">
            {formatPeso(params.estimated_budget)}
          </Typography>
        </>
      );
    },
  },
  {
    key: "created_on",
    label: "Created on",
    width: "100px",
    align: "left",
    render: (row) => (
      <>
        <Typography level="body-xs">
          {moment(row.created_at).format("LL")}
        </Typography>
      </>
    ),
  },
  {
    key: "terminology",
    label: "Variant",
    width: "100px",
    align: "left",
    render: (row) => (
      <>
        <Chip
          color="primary"
          size="md"
          startDecorator={<Circle sx={{ fontSize: 8 }} />}
        >
          {row.terminology}
        </Chip>
      </>
    ),
  },
  {
    key: "action",
    label: "Actions",
    align: "center",
    render: (params) => {
      return (
        <>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent={"center"}
          >
            <Chip
              onClick={() => {
                setSelectedData(params);
                handleUpdate(params);
              }}
              size="md"
              variant="soft"
              color="neutral"
              startDecorator={<EditOutlined />}
              sx={{ display: !active && "none" }}
            >
              Edit
            </Chip>
            <Chip
              onClick={() => {
                setSelectedData(params);
                handleDelete(params);
              }}
              size="md"
              variant="soft"
              color="neutral"
              startDecorator={<DeleteOutlineOutlined />}
            >
              {active ? "Archive" : "Unarchive"}
            </Chip>
          </Stack>
        </>
      );
    },
  },
];

export const myOwnItemRequestListCols = () => [
  {
    field: "code",
    name: "Code",
    width: "auto",
    align: "left",
  },
  {
    field: "name",
    name: "Name",
    width: "auto",
    align: "left",
  },
  {
    field: "category",
    name: "Category",
    width: "auto",
    align: "left",
  },
  {
    field: "classification",
    name: "Classification",
    width: "auto",
    align: "left",
  },
  {
    field: "created_at",
    name: "Created At",
    width: "auto",
    align: "left",
  },
  {
    field: "status",
    name: "Status",
    width: "auto",
    align: "left",
    render: (row) => {
      const status = row.status?.toLowerCase();

      const getColor = () => {
        switch (status) {
          case "pending":
            return "warning";
          case "approved":
            return "success";
          case "returned":
            return "danger";
          default:
            return "neutral";
        }
      };

      return (
        <Chip variant="soft" color={getColor()} size="sm">
          {row.status}
        </Chip>
      );
    },
  },
];

export const itemRequestDetailsCols = (onUpdate, openModal) => [
  {
    field: "code",
    name: "Code",
    width: "auto",
    align: "left",
  },
  {
    field: "name",
    name: "Name",
    width: 200, // or a fixed pixel width
    align: "left",
    render: (row) => (
      <div
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "180px",
        }}
      >
        {row.name}
      </div>
    ),
  },
  {
    field: "item_terminology",
    name: "Terminology",
    width: "auto",
    align: "left",
    render: (row) => row.item_terminology?.name || "-",
  },
  {
    field: "estimated_budget",
    name: "Estimated Budget",
    width: "auto",
    align: "left",
    render: (row) => {
      const budget = parseFloat(row.estimated_budget);
      return isNaN(budget)
        ? "₱0.00"
        : `₱${budget.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    },
  },
  {
    field: "unit",
    name: "Unit",
    width: "auto",
    align: "left",
    render: (row) => row.item_unit?.name || row.unit,
  },
  {
    field: "category",
    name: "Category",
    width: "auto",
    align: "left",
    render: (row) => row.item_category?.name || row.category,
  },
  {
    field: "classification",
    name: "Classification",
    width: "auto",
    align: "left",
    render: (row) => row.item_classification?.name || row.classification,
  },
  {
    field: "specifications",
    name: "Specifications",
    width: "auto",
    align: "left",
    render: (row) =>
      row.item_specifications?.map((spec) => spec.description).join(", "),
  },
  {
    field: "status",
    name: "Status",
    width: "auto",
    align: "left",
    render: (row) => {
      const status = row.status?.toLowerCase();
      const getColor = () => {
        switch (status) {
          case "pending":
            return "warning";
          case "approved":
            return "success";
          case "returned":
            return "danger";
          default:
            return "neutral";
        }
      };
      return (
        <Chip variant="soft" color={getColor()} size="sm">
          {row.status}
        </Chip>
      );
    },
  },
  {
    field: "created_at",
    name: "Created At",
    width: "auto",
    align: "left",
    render: (row) =>
      new Date(row.created_at).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    field: "actions",
    name: "Actions",
    width: "auto",
    align: "center",
    render: (row) => (
      <Button
        size="sm"
        variant="soft"
        onClick={() => {
          onUpdate(row);
          openModal();
        }}
      >
        Update
      </Button>
    ),
  },
];

// helper to check lock
export const isRowLockedByOther = (rowId, lockedRows, userId) => {
  const key = String(rowId);
  return (
    lockedRows?.[key]?.editorId !== undefined &&
    lockedRows[key].editorId !== userId
  );
};

// Predefine render functions outside array to memoize
const renderItem = (row) => (
  <>
    <Typography level="body-sm" fontWeight={600} sx={{ color: "black" }}>
      {row?.item?.name}
    </Typography>
    <Typography sx={{ fontSize: 14, fontWeight: 500, color: grey[900] }}>
      Qty: {row?.quantity}
    </Typography>
  </>
);

const renderCategory = (row) => (
  <>
    <Typography level="body-sm" fontWeight={600} sx={{ color: "black" }}>
      {row?.item?.item_classification?.name}
    </Typography>
    <Typography
      level={row?.item?.item_category?.name && "body-sm"}
      sx={{
        fontSize: row?.item?.item_classification?.name && 13,
        color: row?.item?.item_classification?.name ? grey[800] : grey[900],
      }}
      fontWeight={500}
    >
      {row?.item?.item_category?.name}
    </Typography>
  </>
);

const renderCost = (row) => (
  <>
    <Typography level="body-sm" fontWeight={600} sx={{ color: grey[900] }}>
      {formattedPrice(row?.total_amount)}
    </Typography>
    <Typography
      sx={{
        fontSize: 14,
        fontWeight: 500,
        color: grey[800],
        textTransform: "lowercase",
      }}
    >
      {formattedPrice(row?.item?.estimated_budget)} per{" "}
      {row?.item?.item_unit?.name}
    </Typography>
  </>
);

const renderProcurement = (row) => (
  <>
    {row?.procurement_mode?.name ? (
      <Chip
        sx={{
          color: "#7008E7",
          bgcolor: "#DDD6FF",
          alignItems: "center",
          maxWidth: 200,
          "& .MuiChip-label": {
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        }}
        size="md"
        variant="soft"
      >
        {row?.procurement_mode?.name}
      </Chip>
    ) : (
      <Typography color="danger" sx={{ fontSize: 12 }}>
        No Mode of Procurement yet.
      </Typography>
    )}
  </>
);

export const PPMP_HEADERS = (
  status,
  editingRows,
  handleComments,
  handleDeletePPMP,
  handleEditToggle,
  lockedRows,
  userId,
) => [
  {
    id: "name",
    label: "Item",
    width: status?.name === "draft" ? "300px" : "400px",
    render: renderItem,
    expandTrigger: true,
  },
  {
    id: "category",
    label: "Classification & Category",
    width: status?.name === "draft" ? "150px" : "auto",
    render: renderCategory,
    expandTrigger: true,
  },
  {
    id: "cost",
    label: "Total Cost & Individual Cost",
    width: status?.name === "draft" ? "200px" : "auto",
    render: renderCost,
    expandTrigger: true,
  },
  {
    id: "procurement",
    label: "Mode of Procurement",
    align: "center",
    expandTrigger: true,

    width: status?.name === "draft" ? "200px" : "auto",
    render: renderProcurement,
  },
  ...(status?.name === "draft"
    ? [
        {
          id: "is_complete",
          label: "",
          width: "150px",
          display: "table-cell",
          render: (row) =>
            row?.is_complete ? (
              ""
            ) : (
              <Box
                p={0.5}
                bgcolor={red[50]}
                display="flex"
                justifyContent="center"
                width="150px"
                borderRadius={5}
              >
                <Typography
                  level="body-xs"
                  color="danger"
                  alignItems="center"
                  gap={1}
                  startDecorator={
                    <WarningAmberOutlined
                      color="danger"
                      style={{ fontSize: 18 }}
                    />
                  }
                >
                  Incomplete Details.
                </Typography>
              </Box>
            ),
        },
      ]
    : []),
  {
    id: "actions",
    label: "Actions",
    align: status?.name === "draft" ? "center" : "right",
    width: status?.name === "draft" ? "200px" : "auto",
    render: (row, { openRow }) => {
      const isEditing = editingRows[row.id];
      const lockedByOther =
        lockedRows[row.id] && lockedRows[row.id].editorId !== userId;
      return (
        <Stack direction="row" spacing={1} justifyContent="center">
          {status?.name !== "draft" && (
            <ChipComponent
              label={row.comments_count}
              startDecorator={<CommentOutlined />}
              variant="soft"
              onClick={(e) => {
                e.stopPropagation();
                handleComments(row);
              }}
            />
          )}
          {status?.name === "draft" && (
            <>
              <ChipComponent
                label={isEditing ? "Save" : "Edit"}
                variant="soft"
                startDecorator={
                  isEditing ? <CheckOutlined /> : <ModeEditOutlineOutlined />
                }
                color={isEditing ? "success" : "neutral"}
                disabled={lockedByOther}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditToggle(row.id, openRow, isEditing); // <--- toggle passed down
                }}
              />
              <ChipComponent
                label="Remove"
                startDecorator={<DeleteOutlineOutlined />}
                variant="soft"
                disabled={lockedByOther}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePPMP(row.id);
                }}
              />
            </>
          )}
        </Stack>
      );
    },
  },
];

export const ITEMS_REQUESTS = (handleOpen, pathName) => [
  {
    key: "item",
    label: "Item & Unit",
    render: (row) => (
      <div>
        <Typography level="body-sm" fontWeight={600} sx={{ color: grey[800] }}>
          {row.name}
        </Typography>
        <Typography level="body-xs">{row.unit}</Typography>
      </div>
    ),
    expandTrigger: true, // ❗ only this column toggles expand
  },
  {
    key: "category",
    label: "Classification & Category",
    render: (r) => (
      <div>
        <Typography level="body-sm" fontWeight={600} sx={{ color: grey[800] }}>
          {r.item_category.name}
        </Typography>
        <Typography level="body-xs">{r.item_category.name}</Typography>
      </div>
    ),
  },
  {
    key: "budget",
    label: "Estimated Budget",
    render: (r) =>
      `₱${r.estimated_budget.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      })}`,
  },
  {
    key: "requested_on",
    label: "Requested On",
    render: (r) => <Typography>{moment(r.created_at).format("ll")}</Typography>,
  },
  {
    key: "variant",
    label: "Variant",
    render: (r) => {
      return r.terminology_category ? (
        <ChipComponent
          size="md"
          label={r.terminology_category?.name || ""}
          startDecorator={<Circle sx={{ fontSize: 10 }} />}
          color={"primary"}
        />
      ) : (
        <>No Variant Available</>
      );
    },
  },

  {
    key: "actions",
    label: "Actions",
    render: (r) => (
      <>
        {pathName === "/ppmp" && (
          <>
            {r.status_id === 3 && (
              <>
                <ChipComponent
                  size="lg"
                  color="primary"
                  variant={"soft"}
                  label={"Pending"}
                  startDecorator={<HourglassEmpty />}
                />
              </>
            )}

            {r.status_id === 4 && (
              <>
                <ChipComponent
                  size="lg"
                  color="success"
                  variant={"soft"}
                  label={"Saved to Library"}
                  startDecorator={<CheckOutlined />}
                />
              </>
            )}

            {r.status_id === 5 && (
              <>
                <ChipComponent
                  size="lg"
                  color="danger"
                  variant={"soft"}
                  label={"Declined"}
                  startDecorator={<Clear />}
                />
              </>
            )}
          </>
        )}

        {pathName === "/item-requests/" && (
          <>
            {r.status_id === 3 && (
              <>
                <ChipComponent
                  size="lg"
                  color="primary"
                  variant={"soft"}
                  label={"Pending"}
                  startDecorator={<HourglassEmpty />}
                />
              </>
            )}

            {r.status_id === 4 && (
              <>
                <ChipComponent
                  size="lg"
                  color="success"
                  variant={"soft"}
                  label={"Saved to Library"}
                  startDecorator={<CheckOutlined />}
                />
              </>
            )}

            {r.status_id === 5 && (
              <>
                <ChipComponent
                  size="lg"
                  color="danger"
                  variant={"soft"}
                  label={"Declined"}
                  startDecorator={<Clear />}
                />
              </>
            )}
          </>
        )}

        {pathName === "/item-requests/pending" && (
          <>
            <div style={{ display: "flex", gap: "8px" }}>
              <ChipComponent
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen(4, r); /* approve */
                }}
                color="success"
                label={"Approve"}
                variant={"soft"}
                startDecorator={<CheckOutlined />}
              />

              <ChipComponent
                size="lg"
                color="danger"
                variant={"soft"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen(5, r); /* decline */
                }}
                label={"Decline"}
                startDecorator={<Clear />}
              />
            </div>
          </>
        )}

        {pathName === "/item-requests/saved" && (
          <>
            {r.status_id === 4 && (
              <>
                <ChipComponent
                  size="lg"
                  color="success"
                  variant={"soft"}
                  label={"Approved"}
                  startDecorator={<CheckOutlined />}
                />
              </>
            )}
          </>
        )}
      </>
    ),
  },
];

export const PPMP_APPROVER_HEADERS = (handleComments) => [
  {
    id: "name",
    label: "Item",
    align: "left",
    width: "250px",
    render: (row) => (
      <>
        <Typography level="body-sm" fontWeight={600} sx={{ color: "black" }}>
          {row?.item?.name}
        </Typography>
        <Typography sx={{ fontSize: 14, color: grey[800] }}>
          Qty: {row?.quantity}
        </Typography>
      </>
    ),
    expandTrigger: true,
  },
  {
    id: "category",
    label: "Classification & Category",
    width: "200px",
    render: (row) => (
      <>
        <Typography level="body-sm" fontWeight={600} sx={{ color: "black" }}>
          {row?.item?.item_classification?.name}
        </Typography>
        <Typography
          level={"body-sm"}
          sx={{
            fontSize: row?.item?.item_classification?.name && 14,
            color: row?.item?.item_classification?.name ? grey[800] : "black",
          }}
          fontWeight={row?.item?.item_category?.name ? 400 : 600}
        >
          {row?.item?.item_category?.name}
        </Typography>
      </>
    ),
    expandTrigger: true,
  },
  {
    id: "cost",
    label: "Total Cost & Individual Cost",
    width: "200px",

    render: (row) => (
      <>
        <Typography level="body-sm" fontWeight={600} sx={{ color: "black" }}>
          ₱{row?.total_amount?.toLocaleString()}
        </Typography>
        <Typography
          sx={{ fontSize: 14, color: grey[600], textTransform: "lowercase" }}
        >
          ₱{" "}
          {(row?.item?.estimated_budget).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          per {row?.item?.item_unit?.name}
        </Typography>
      </>
    ),
    expandTrigger: true,
  },
  {
    id: "procurement",
    label: "Mode of Procurement",
    align: "center",
    width: "250px",
    render: (row) => (
      <Chip
        sx={{
          color: "#7008E7",
          bgcolor: "#DDD6FF",
          alignItems: "center",
          maxWidth: 200, // limit width
          "& .MuiChip-label": {
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        }}
        size="md"
        variant="soft"
      >
        {row?.procurement_mode === null ? "-" : row?.procurement_mode.name}
      </Chip>
    ),
    expandTrigger: true,
  },
  {
    id: "actions",
    label: "Actions",
    align: "center",
    width: "100px",
    render: (row) => {
      return (
        <Stack direction={"row"} spacing={1} justifyContent={"center"}>
          <ChipComponent
            label={`${row?.comments_count}`}
            startDecorator={<CommentOutlined />}
            variant={"soft"}
            onClick={(e) => {
              e.stopPropagation(); // Prevent row expand
              handleComments(row);
              // Your comment click logic here
            }}
          />
        </Stack>
      );
    },
  },
];

export const SUMMARY_RESOURCES = () => [
  {
    id: "name",
    label: "Item",
    align: "left",
    width: "250px",
    render: (row) => (
      <>
        <Typography level="body-sm" fontWeight={600}>
          {row?.item?.name}
        </Typography>
        <Typography sx={{ fontSize: 13, color: grey[600] }}>
          Qty: {row?.quantity}
        </Typography>
      </>
    ),
  },
  {
    id: "category",
    label: "Classification & Category",
    width: "200px",
    render: (row) => (
      <>
        <Typography level="body-sm" fontWeight={600}>
          {row?.item?.item_classification?.name}
        </Typography>
        <Typography
          level={row?.item?.item_category?.name && "body-sm"}
          sx={{
            fontSize: row?.item?.item_classification?.name && 13,
            color: row?.item?.item_classification?.name && grey[600],
          }}
          fontWeight={600}
        >
          {row?.item?.item_category?.name}
        </Typography>
      </>
    ),
  },
  {
    id: "cost",
    label: "Total Cost & Individual Cost",
    width: "200px",

    render: (row) => (
      <>
        <Typography level="body-sm" fontWeight={600}>
          {formattedPrice(row?.total_resource_cost)}
        </Typography>
        <Typography
          sx={{ fontSize: 13, color: grey[600], textTransform: "lowercase" }}
        >
          {formattedPrice(row?.total_resource_cost)} per{" "}
          {row?.item?.item_unit?.name}
        </Typography>
      </>
    ),
  },
];

export const SUMMARY_PEOPLE = () => [
  {
    id: "name",
    label: "Employee Name/Job Position",
    align: "left",
    width: "250px",
    render: (row) => {
      const { user, designation } = row;
      const employeeName = user?.name;
      const jobPosition = designation?.name || user?.designation_name;

      return (
        <>
          <Typography level="title-sm">
            {employeeName ? employeeName : jobPosition}{" "}
          </Typography>
          <Typography level="body-sm" sx={{ color: grey[600] }}>
            {employeeName ? jobPosition : ""}{" "}
            {/* show job position or 'Position' */}
          </Typography>
        </>
      );
    },
    expandTrigger: true,
  },
];

export const MANAGE_CONSOLIDATORS = (
  expandedCategories,
  setExpandedCategories,
  handleUpdate,
) => [
  {
    id: "name",
    label: "Consolidator Name",
    width: "200px",
    render: (row) => (
      <Typography level="body-sm" fontWeight={600} color="black">
        {row?.user_name}
      </Typography>
    ),
  },
  {
    id: "item_category",
    label: "Assigned Item Category",
    width: "350px",
    render: (row) => {
      const categories = row?.assigned_categories || [];
      const rowId = row?.id;

      if (!categories.length) {
        return (
          <Typography level="body-xs" color="neutral">
            —
          </Typography>
        );
      }

      const isExpanded = expandedCategories[rowId];
      const visibleCount = 2;

      const visible = isExpanded
        ? categories
        : categories.slice(0, visibleCount);

      const remaining = categories.length - visibleCount;

      const label = visible.map((c) => c.item_category_name).join(", ");

      return (
        <Typography
          level="body-sm"
          color="neutral"
          sx={{
            cursor: categories.length > visibleCount ? "pointer" : "default",
            userSelect: "none",
            color: "black",
          }}
          onClick={() => {
            if (categories.length > visibleCount) {
              setExpandedCategories((prev) => ({
                ...prev,
                [rowId]: !prev[rowId],
              }));
            }
          }}
        >
          {label}
          {!isExpanded && remaining > 0 && `… +${remaining} more`}
        </Typography>
      );
    },
  },
  {
    id: "updated_on",
    label: "Updated on",
    width: "150px",
    render: (row) => (
      <Typography level="body-sm" color="black">
        {row?.updated_at
          ? moment(row?.updated_at).format("MMMM DD, YYYY")
          : "-"}
      </Typography>
    ),
  },
  {
    id: "actions",
    label: "Actions",
    render: (row) => (
      <Stack>
        <Chip
          variant="soft"
          color="neutral"
          startDecorator={<EditOutlined />}
          onClick={() => handleUpdate(row)}
        >
          Edit
        </Chip>
      </Stack>
    ),
  },
];
