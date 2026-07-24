import React, { Fragment, useState, useMemo, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Select,
  Option,
  Input,
  Link,
  Avatar,
  Table,
  Sheet,
  Button,
  IconButton,
} from "@mui/joy";
import {
  Undo as UndoIcon,
  Redo as RedoIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { nextYear } from "@Utils/Functions";
import CountUp from "react-countup";
import PageTitle from "@Components/Common/PageTitle";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import NotificationMain from "@Components/Notification/NotificationMain";
import ServerPaginationComponent from "@Components/ServerPaginationComponent";
import ButtonComponent from "@Components/Common/ButtonComponent";

// Baseline rich dummy data for the budget deliberation page
const INITIAL_DUMMY_DATA = [
  {
    id: 1,
    generalDescription: "Paper shredder 30 liters, cross cut, heavy duty",
    itemCategory: "Office Equipment",
    qty: 20,
    unit: "piece",
    unitCost: 1600.0,
    procurementMode: "Direct Purchase",
    area: "HRMO",
    projectType: "Support to Operations",
  },
  {
    id: 2,
    generalDescription: "Disk Station Local Server Storage",
    itemCategory: "ICT Equipment",
    qty: 5,
    unit: "piece",
    unitCost: 50000.0,
    procurementMode: "Direct Purchase",
    area: "ICTD",
    projectType: "Core Operations",
  },
  {
    id: 3,
    generalDescription: "Paper shredder 30 liters, cross cut, heavy duty",
    itemCategory: "ICT Equipment",
    qty: 20,
    unit: "piece",
    unitCost: 50000.0,
    procurementMode: "Public Bidding",
    area: "ICTD",
    projectType: "Core Operations",
  },
  {
    id: 4,
    generalDescription: "3D Workstation for Simulation and CAD Designing",
    itemCategory: "ICT Equipment",
    qty: 20,
    unit: "piece",
    unitCost: 50000.0,
    procurementMode: "Competitive Bidding",
    area: "Engineering",
    projectType: "General Administration",
  },
  {
    id: 5,
    generalDescription:
      "Reconstruction of Laboratory with Central hallway, retrofitting central hallway, furnishings, conference room tables and chairs, storage units, and sofa",
    itemCategory: "Building and Construction",
    qty: 20,
    unit: "piece",
    unitCost: 50000.0,
    procurementMode: "Public Bidding",
    area: "Laboratory",
    projectType: "Core Operations",
  },
  {
    id: 6,
    generalDescription: "3D Workstation for Simulation and CAD Designing",
    itemCategory: "ICT Equipment",
    qty: 20,
    unit: "piece",
    unitCost: 50000.0,
    procurementMode: "Competitive Bidding",
    area: "Engineering",
    projectType: "Support to Operations",
  },
  {
    id: 7,
    generalDescription: "Ergonomic Office Chairs with Mesh Backrest",
    itemCategory: "Office Equipment",
    qty: 15,
    unit: "piece",
    unitCost: 4500.0,
    procurementMode: "Shopping",
    area: "HRMO",
    projectType: "General Administration",
  },
  {
    id: 8,
    generalDescription: "Heavy Duty Air Conditioning Unit 2.0 HP",
    itemCategory: "Office Equipment",
    qty: 8,
    unit: "unit",
    unitCost: 35000.0,
    procurementMode: "Public Bidding",
    area: "Finance",
    projectType: "Support to Operations",
  },
  {
    id: 9,
    generalDescription: "Medical Refrigerator for Vaccine Storage",
    itemCategory: "Medical Supplies",
    qty: 3,
    unit: "unit",
    unitCost: 120000.0,
    procurementMode: "Negotiated Procurement",
    area: "Pediatrics",
    projectType: "Core Operations",
  },
  {
    id: 10,
    generalDescription: "High-Speed Document Scanner",
    itemCategory: "ICT Equipment",
    qty: 10,
    unit: "piece",
    unitCost: 18000.0,
    procurementMode: "Direct Purchase",
    area: "Records Section",
    projectType: "General Administration",
  },
  {
    id: 11,
    generalDescription: "Laser Printer Multi-function (Print, Scan, Copy)",
    itemCategory: "ICT Equipment",
    qty: 12,
    unit: "piece",
    unitCost: 15000.0,
    procurementMode: "Shopping",
    area: "Admitting",
    projectType: "Support to Operations",
  },
  {
    id: 12,
    generalDescription: "A4 Copy Paper 80GSM",
    itemCategory: "Office Supplies",
    qty: 500,
    unit: "box",
    unitCost: 1200.0,
    procurementMode: "Shopping",
    area: "Supply Section",
    projectType: "General Administration",
  },
  {
    id: 13,
    generalDescription: "Surgical Gloves (Sterile, Powder-Free) Size 7.0",
    itemCategory: "Medical Supplies",
    qty: 200,
    unit: "box",
    unitCost: 650.0,
    procurementMode: "Direct Purchase",
    area: "OR Complex",
    projectType: "Core Operations",
  },
  {
    id: 14,
    generalDescription: "Digital Sphygmomanometer",
    itemCategory: "Medical Supplies",
    qty: 30,
    unit: "piece",
    unitCost: 3200.0,
    procurementMode: "Shopping",
    area: "Outpatient Clinic",
    projectType: "Core Operations",
  },
  {
    id: 15,
    generalDescription: "Steel Filing Cabinet (4 Drawers)",
    itemCategory: "Office Equipment",
    qty: 10,
    unit: "unit",
    unitCost: 8500.0,
    procurementMode: "Shopping",
    area: "Admin Office",
    projectType: "General Administration",
  },
  {
    id: 16,
    generalDescription: "Fiber Optic Cable Patch Cord 3m",
    itemCategory: "ICT Equipment",
    qty: 50,
    unit: "piece",
    unitCost: 450.0,
    procurementMode: "Direct Purchase",
    area: "ICTD",
    projectType: "Support to Operations",
  },
  {
    id: 17,
    generalDescription: "Patient Ward Bed (Manual 2-Crank)",
    itemCategory: "Medical Supplies",
    qty: 25,
    unit: "unit",
    unitCost: 28000.0,
    procurementMode: "Public Bidding",
    area: "Medicine Ward",
    projectType: "Core Operations",
  },
  {
    id: 18,
    generalDescription: "Conference Table (Wooden, 10-Seater)",
    itemCategory: "Office Equipment",
    qty: 2,
    unit: "piece",
    unitCost: 22000.0,
    procurementMode: "Shopping",
    area: "Executive Office",
    projectType: "General Administration",
  },
  {
    id: 19,
    generalDescription: "Wall Mounted LED Monitor 55 inch",
    itemCategory: "ICT Equipment",
    qty: 5,
    unit: "unit",
    unitCost: 45000.0,
    procurementMode: "Competitive Bidding",
    area: "Conference Room",
    projectType: "Support to Operations",
  },
  {
    id: 20,
    generalDescription: "Centrifuge Machine (Benchtop)",
    itemCategory: "Medical Supplies",
    qty: 4,
    unit: "unit",
    unitCost: 75000.0,
    procurementMode: "Public Bidding",
    area: "Laboratory",
    projectType: "Core Operations",
  },
];

function BudgetDeliberation() {
  // STATE MANAGEMENT FOR EDIT HISTORY (UNDO/REDO)
  const [history, setHistory] = useState([INITIAL_DUMMY_DATA]);
  const [historyPointer, setHistoryPointer] = useState(0);

  // Active data is derived from current history pointer
  const currentData = useMemo(() => {
    return history[historyPointer] || [];
  }, [history, historyPointer]);

  // STATE MANAGEMENT FOR FILTERING
  const [searchQuery, setSearchQuery] = useState("");
  const [filterArea, setFilterArea] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterProjectType, setFilterProjectType] = useState(null);
  const [filterProcurementMode, setFilterProcurementMode] = useState(null);

  // STATE MANAGEMENT FOR PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // Selected row tracking for border highlight
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Reset pagination to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    filterArea,
    filterCategory,
    filterProjectType,
    filterProcurementMode,
  ]);

  // EXTRACT FILTER DROPDOWN OPTIONS DYNAMICALLY
  const uniqueAreas = useMemo(() => {
    return Array.from(new Set(INITIAL_DUMMY_DATA.map((item) => item.area)));
  }, []);

  const uniqueCategories = useMemo(() => {
    return Array.from(
      new Set(INITIAL_DUMMY_DATA.map((item) => item.itemCategory)),
    );
  }, []);

  const uniqueProjectTypes = useMemo(() => {
    return Array.from(
      new Set(INITIAL_DUMMY_DATA.map((item) => item.projectType)),
    );
  }, []);

  const uniqueProcurementModes = useMemo(() => {
    return Array.from(
      new Set(INITIAL_DUMMY_DATA.map((item) => item.procurementMode)),
    );
  }, []);

  // FILTERED DATA CALCULATION
  const filteredData = useMemo(() => {
    return currentData.filter((item) => {
      const matchesSearch = item.generalDescription
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesArea = filterArea ? item.area === filterArea : true;
      const matchesCategory = filterCategory
        ? item.itemCategory === filterCategory
        : true;
      const matchesProjectType = filterProjectType
        ? item.projectType === filterProjectType
        : true;
      const matchesProcurementMode = filterProcurementMode
        ? item.procurementMode === filterProcurementMode
        : true;

      return (
        matchesSearch &&
        matchesArea &&
        matchesCategory &&
        matchesProjectType &&
        matchesProcurementMode
      );
    });
  }, [
    currentData,
    searchQuery,
    filterArea,
    filterCategory,
    filterProjectType,
    filterProcurementMode,
  ]);

  // PAGINATED DATA CALCULATION
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / rowsPerPage) || 1;
  }, [filteredData, rowsPerPage]);

  // DYNAMIC COMPUTATIONS FOR CARD METRICS
  // Total Amount Submitted: Sum of Qty * Unit Cost of INITIAL dummy data
  const totalAmountSubmitted = useMemo(() => {
    return INITIAL_DUMMY_DATA.reduce(
      (sum, item) => sum + item.qty * item.unitCost,
      0,
    );
  }, []);

  // Total Items Submitted: Sum of Qty of INITIAL dummy data
  const totalItemsSubmitted = useMemo(() => {
    return INITIAL_DUMMY_DATA.reduce((sum, item) => sum + item.qty, 0);
  }, []);

  // Edited Items Count: Count of items that differ from INITIAL dummy data
  const editedItemsCount = useMemo(() => {
    const initial = history[0] || [];
    let count = 0;
    currentData.forEach((item, index) => {
      const initItem = initial[index];
      if (initItem) {
        const isModified =
          item.itemCategory !== initItem.itemCategory ||
          item.qty !== initItem.qty ||
          item.unit !== initItem.unit ||
          item.unitCost !== initItem.unitCost ||
          item.procurementMode !== initItem.procurementMode;
        if (isModified) count++;
      }
    });
    return count;
  }, [history, currentData]);

  // CELL EDIT ACTION WITH HISTORY PROPAGATION
  const handleCellEdit = (itemId, field, value) => {
    const updatedData = currentData.map((item) => {
      if (item.id === itemId) {
        return { ...item, [field]: value };
      }
      return item;
    });

    // Save state to history stack and clear any redo history
    const nextHistory = history.slice(0, historyPointer + 1);
    setHistory([...nextHistory, updatedData]);
    setHistoryPointer(nextHistory.length);
  };

  // UNDO/REDO ACTIONS
  const handleUndo = () => {
    if (historyPointer > 0) {
      setHistoryPointer(historyPointer - 1);
    }
  };

  const handleRedo = () => {
    if (historyPointer < history.length - 1) {
      setHistoryPointer(historyPointer + 1);
    }
  };

  // CLEAR ALL FILTERS
  const clearFilters = () => {
    setSearchQuery("");
    setFilterArea(null);
    setFilterCategory(null);
    setFilterProjectType(null);
    setFilterProcurementMode(null);
  };

  // FORMAT CURRENCY HELPER
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(val);
  };

  // HELPERS TO IDENTIFY STATE CHANGES FOR STYLING
  const isRowEdited = (item) => {
    const initial = history[0] || [];
    const initItem = initial.find((i) => i.id === item.id);
    if (!initItem) return false;
    return (
      item.itemCategory !== initItem.itemCategory ||
      item.qty !== initItem.qty ||
      item.unit !== initItem.unit ||
      item.unitCost !== initItem.unitCost ||
      item.procurementMode !== initItem.procurementMode
    );
  };

  return (
    <Fragment>
      {/* 1. Header Layout Row */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <PageTitle
          title={`PPMP for Fiscal Year ${nextYear}`}
          items={[{ label: "Deliberation", current: true }]}
          withArrowBack={true}
        />
      </Stack>

      {/* 2. Headline & History Actions */}
      <BoxComponent mt={2} alignItems={"center"} boxShadow="xs" p={2} mb={3}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          width={"100%"}
          mb={2}
        >
          <Stack spacing={0.5}>
            <Typography level="title-lg" textColor="neutral.900">
              PPMP Resource Items
            </Typography>
            <Typography level="body-sm" textColor="neutral.600">
              The below contains a list of PPMP resources items submitted by
              different areas.
            </Typography>
          </Stack>

          <Stack direction={"row"} spacing={1}>
            <ButtonComponent
              size="sm"
              color="primary"
              variant="solid"
              onClick={handleUndo}
              disabled={historyPointer === 0}
              startDecorator={<UndoIcon />}
              label="Undo"
            />
            <ButtonComponent
              size="sm"
              color="primary"
              variant="solid"
              onClick={handleRedo}
              disabled={historyPointer === history.length - 1}
              startDecorator={<RedoIcon />}
              label="Redo"
            />
          </Stack>
        </Stack>

        {/* 3. Summary Widgets stack */}
        <Stack direction="row" spacing={3} mb={3} width="100%">
          {/* Card 1: TOTAL AMOUNT */}
          <BoxComponent
            flex={1}
            p={2.5}
            bgColor={"white"}
            borderRadius={10}
            boxShadow="xs"
            sx={{ border: "1px solid #E2E8F0" }}
          >
            <Typography
              level="body-xs"
              fontWeight={600}
              textColor="neutral.500"
              textTransform="uppercase"
              mb={1}
            >
              Total Amount
            </Typography>
            <Typography
              level="h3"
              fontWeight={700}
              textColor="primary.solidBg"
              mb={0.5}
            >
              ₱{" "}
              <CountUp
                start={0}
                end={totalAmountSubmitted}
                duration={1}
                separator=","
                decimals={2}
                decimal="."
              />
            </Typography>
            <Typography level="body-xs" textColor="neutral.500">
              As submitted
            </Typography>
          </BoxComponent>

          {/* Card 2: TOTAL ITEMS */}
          <BoxComponent
            flex={1}
            p={2.5}
            bgColor={"white"}
            borderRadius={10}
            boxShadow="xs"
            sx={{ border: "1px solid #E2E8F0" }}
          >
            <Typography
              level="body-xs"
              fontWeight={600}
              textColor="neutral.500"
              textTransform="uppercase"
              mb={1}
            >
              Total Items
            </Typography>
            <Typography
              level="h3"
              fontWeight={700}
              textColor="primary.solidBg"
              mb={0.5}
            >
              <CountUp
                start={0}
                end={totalItemsSubmitted}
                duration={1}
                separator=","
              />
            </Typography>
            <Typography level="body-xs" textColor="neutral.500">
              As submitted
            </Typography>
          </BoxComponent>

          {/* Card 3: EDITED ITEMS COUNTER */}
          <BoxComponent
            flex={1}
            p={2.5}
            bgColor={"white"}
            borderRadius={10}
            boxShadow="xs"
            sx={{ border: "1px solid #E2E8F0" }}
          >
            <Typography
              level="body-xs"
              fontWeight={600}
              textColor="neutral.500"
              textTransform="uppercase"
              mb={1}
            >
              Edited Items
            </Typography>
            <Typography
              level="h3"
              fontWeight={700}
              textColor={editedItemsCount > 0 ? "warning.400" : "neutral.700"}
              mb={0.5}
            >
              <CountUp start={0} end={editedItemsCount} duration={0.8} />
            </Typography>
            <Typography level="body-xs" textColor="neutral.500">
              As edited
            </Typography>
          </BoxComponent>
        </Stack>

        {/* 4. Filter Controls bar */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="flex-end"
          flexWrap="wrap"
          useFlexGap
        >
          <Stack spacing={0.5} sx={{ minWidth: "100px", flexGrow: 1 }}>
            <Typography
              level="body-xs"
              fontWeight={600}
              textColor="neutral.600"
            >
              Search Items
            </Typography>
            <Input
              size="sm"
              placeholder="Search here to find items fast"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startDecorator={<SearchIcon sx={{ color: "neutral.400" }} />}
              sx={{
                backgroundColor: "white",
                borderColor: "neutral.300",
                "&:hover": { borderColor: "neutral.400" },
              }}
            />
          </Stack>

          <Stack spacing={0.5} sx={{ minWidth: "200px", flexGrow: 1 }}>
            <Typography
              level="body-xs"
              fontWeight={600}
              textColor="neutral.600"
            >
              Area/Office
            </Typography>
            <Select
              size="sm"
              value={filterArea}
              placeholder="Sample placeholder"
              onChange={(e, val) => setFilterArea(val)}
              sx={{ backgroundColor: "white" }}
            >
              <Option value={null}>All Areas</Option>
              {uniqueAreas.map((a) => (
                <Option key={a} value={a}>
                  {a}
                </Option>
              ))}
            </Select>
          </Stack>

          <Stack spacing={0.5} sx={{ minWidth: "150px", flexGrow: 1 }}>
            <Typography
              level="body-xs"
              fontWeight={600}
              textColor="neutral.600"
            >
              Item Category
            </Typography>
            <Select
              size="sm"
              value={filterCategory}
              placeholder="Sample placeholder"
              onChange={(e, val) => setFilterCategory(val)}
              sx={{ backgroundColor: "white" }}
            >
              <Option value={null}>All Categories</Option>
              {uniqueCategories.map((c) => (
                <Option key={c} value={c}>
                  {c}
                </Option>
              ))}
            </Select>
          </Stack>

          <Stack spacing={0.5} sx={{ minWidth: "150px", flexGrow: 1 }}>
            <Typography
              level="body-xs"
              fontWeight={600}
              textColor="neutral.600"
            >
              Project Type
            </Typography>
            <Select
              size="sm"
              value={filterProjectType}
              placeholder="Sample placeholder"
              onChange={(e, val) => setFilterProjectType(val)}
              sx={{ backgroundColor: "white" }}
            >
              <Option value={null}>All Project Types</Option>
              {uniqueProjectTypes.map((p) => (
                <Option key={p} value={p}>
                  {p}
                </Option>
              ))}
            </Select>
          </Stack>

          <Stack spacing={0.5} sx={{ minWidth: "160px", flexGrow: 1 }}>
            <Typography
              level="body-xs"
              fontWeight={600}
              textColor="neutral.600"
            >
              Procurement Mode
            </Typography>
            <Select
              size="sm"
              value={filterProcurementMode}
              placeholder="Sample placeholder"
              onChange={(e, val) => setFilterProcurementMode(val)}
              sx={{ backgroundColor: "white" }}
            >
              <Option value={null}>All Modes</Option>
              {uniqueProcurementModes.map((m) => (
                <Option key={m} value={m}>
                  {m}
                </Option>
              ))}
            </Select>
          </Stack>

          {/* Clear Filters — always visible, disabled when no filters active */}
          <ButtonComponent
            size="sm"
            color="neutral"
            variant="outlined"
            label="Clear Filters"
            onClick={clearFilters}
            disabled={
              !searchQuery &&
              !filterArea &&
              !filterCategory &&
              !filterProjectType &&
              !filterProcurementMode
            }
          />
        </Stack>
      </BoxComponent>

      {/* 5. Resource Items Table Container */}
      <Sheet
        variant="outlined"
        sx={{
          borderRadius: 8,
          overflow: "auto",
          boxShadow: "sm",
          mb: 3,
        }}
      >
        <Table
          hoverRow
          sx={{
            "--TableCell-height": "auto",
            tableLayout: "fixed",
            width: "100%",
            fontSize: "13px",
            minWidth: "1200px",
            border: "none",
          }}
        >
          {/* Column width definitions: # | Description | Category | Qty | Unit | [spacer] | Unit Cost | Total Cost | [spacer] | Procurement */}
          <colgroup>
            <col style={{ width: "40px" }} />
            <col style={{ width: "350px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "70px" }} />
            <col style={{ width: "80px" }} />
            <col style={{ width: "3px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "140px" }} />
            <col style={{ width: "3px" }} />
            <col style={{ width: "200px" }} />
          </colgroup>
          <thead>
            {/* Header Row 1 - Group Headings */}
            <tr>
              <th
                colSpan={5}
                style={{
                  backgroundColor: "#004366",
                  color: "white",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "13px",
                  letterSpacing: "0.5px",
                  padding: "10px",
                }}
              >
                ITEM DETAILS
              </th>
              {/* Spacer between ITEM DETAILS and BUDGET */}
              <th
                style={{ backgroundColor: "white", width: "3px", padding: 0 }}
              />
              <th
                colSpan={2}
                style={{
                  backgroundColor: "#004366",
                  color: "white",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "13px",
                  letterSpacing: "0.5px",
                  padding: "10px",
                }}
              >
                BUDGET
              </th>
              {/* Spacer between BUDGET and PROCUREMENT */}
              <th style={{ width: "3px", padding: 0 }} />
              <th
                colSpan={1}
                style={{
                  backgroundColor: "#004366",
                  color: "white",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "13px",
                  letterSpacing: "0.5px",
                  padding: "10px",
                }}
              >
                PROCUREMENT
              </th>
            </tr>
            {/* Header Row 2 - Column Headings */}
            <tr>
              <th
                style={{
                  textAlign: "center",
                  fontWeight: 600,
                  color: "#334155",
                  backgroundColor: "#D4D4D4",
                }}
              >
                #
              </th>
              <th
                style={{
                  fontWeight: 600,
                  color: "#334155",
                  backgroundColor: "#D4D4D4",
                }}
              >
                General Description
              </th>
              <th
                style={{
                  fontWeight: 600,
                  color: "#334155",
                  backgroundColor: "#D4D4D4",
                }}
              >
                Item Category
              </th>
              <th
                style={{
                  textAlign: "center",
                  fontWeight: 600,
                  color: "#334155",
                  backgroundColor: "#D4D4D4",
                }}
              >
                Qty
              </th>
              <th
                style={{
                  textAlign: "center",
                  fontWeight: 600,
                  color: "#334155",
                  backgroundColor: "#D4D4D4",
                }}
              >
                Unit
              </th>
              {/* Spacer between ITEM DETAILS and BUDGET */}
              <th
                style={{
                  backgroundColor: "#ffffffff",
                  width: "3px",
                  padding: 0,
                }}
              />
              <th
                style={{
                  textAlign: "right",
                  fontWeight: 600,
                  color: "#334155",
                  backgroundColor: "#D4D4D4",
                }}
              >
                Unit Cost
              </th>
              <th
                style={{
                  textAlign: "right",
                  fontWeight: 600,
                  color: "#334155",
                  backgroundColor: "#D4D4D4",
                }}
              >
                Total Cost
              </th>
              {/* Spacer between BUDGET and PROCUREMENT */}
              <th style={{ width: "8px", padding: 0 }} />
              <th
                style={{
                  fontWeight: 600,
                  color: "#334155",
                  backgroundColor: "#D4D4D4",
                }}
              >
                Mode of Procurement
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => {
                const globalIndex = (currentPage - 1) * rowsPerPage + index + 1;
                const isEdited = isRowEdited(item);
                const isSelected = selectedRowId === item.id;

                // Calculate row styling classes dynamically
                let rowBgColor = "transparent";
                let leftBorderColor = "transparent";

                if (isEdited) {
                  rowBgColor = "#FFF8F2"; // Soft orange
                  leftBorderColor = "#ED6C02"; // Orange bar
                }
                if (isSelected) {
                  rowBgColor = "#F0F9FF"; // Soft blue
                  leftBorderColor = "#1D70BC"; // Blue bar
                }

                const calculatedTotalCost = item.qty * item.unitCost;

                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedRowId(item.id)}
                    style={{
                      backgroundColor: rowBgColor,
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    {/* # Index Column */}
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: 500,
                        borderLeft: `4px solid ${leftBorderColor}`,
                        color: isSelected ? "#0F172A" : "#64748B",
                      }}
                    >
                      {globalIndex}
                    </td>

                    {/* General Description */}
                    <td
                      style={{
                        verticalAlign: "middle",
                        color: "#1E293B",
                        fontWeight: 600,
                      }}
                    >
                      {item.generalDescription}
                    </td>

                    {/* Item Category Dropdown */}
                    <td>
                      <Select
                        size="sm"
                        variant="plain"
                        value={item.itemCategory}
                        onChange={(e, val) =>
                          handleCellEdit(item.id, "itemCategory", val)
                        }
                        sx={{
                          "--Select-minHeight": "32px",
                          fontSize: "13px",
                          backgroundColor: "transparent",
                          fontWeight: 500,
                          "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.02)",
                          },
                        }}
                      >
                        <Option value="Office Equipment">
                          Office Equipment
                        </Option>
                        <Option value="ICT Equipment">ICT Equipment</Option>
                        <Option value="Building and Construction">
                          Building and Construction
                        </Option>
                        <Option value="Medical Supplies">
                          Medical Supplies
                        </Option>
                        <Option value="Office Supplies">Office Supplies</Option>
                      </Select>
                    </td>

                    {/* Quantity Underline Input */}
                    <td>
                      <Input
                        type="number"
                        size="sm"
                        variant="plain"
                        value={item.qty}
                        onChange={(e) =>
                          handleCellEdit(
                            item.id,
                            "qty",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        slotProps={{
                          input: {
                            style: {
                              textAlign: "center",
                              paddingBottom: "2px",
                            },
                          },
                        }}
                        sx={{
                          borderBottom: "1px solid #CBD5E1",
                          borderRadius: 0,
                          width: "55px",
                          fontSize: "13px",
                          mx: "auto",
                          backgroundColor: "transparent",
                          "&:focus-within": {
                            borderBottom: "2px solid #004366",
                          },
                        }}
                      />
                    </td>

                    {/* Unit Dropdown - end of ITEM DETAILS group */}
                    <td>
                      <Select
                        size="sm"
                        variant="plain"
                        value={item.unit}
                        onChange={(e, val) =>
                          handleCellEdit(item.id, "unit", val)
                        }
                        sx={{
                          "--Select-minHeight": "32px",
                          fontSize: "13px",
                          backgroundColor: "transparent",
                          fontWeight: 500,
                          mx: "auto",
                          width: "80px",
                          "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.02)",
                          },
                        }}
                      >
                        <Option value="piece">piece</Option>
                        <Option value="box">box</Option>
                        <Option value="pack">pack</Option>
                        <Option value="unit">unit</Option>
                        <Option value="set">set</Option>
                      </Select>
                    </td>

                    {/* Spacer between ITEM DETAILS and BUDGET */}
                    <td style={{ padding: 0, backgroundColor: "white" }} />

                    {/* Unit Cost Underline Input */}
                    <td>
                      <Input
                        type="number"
                        size="sm"
                        variant="plain"
                        value={item.unitCost}
                        onChange={(e) =>
                          handleCellEdit(
                            item.id,
                            "unitCost",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        startDecorator={
                          <Typography
                            level="body-xs"
                            sx={{ color: "neutral.500", mr: 0.5 }}
                          >
                            ₱
                          </Typography>
                        }
                        slotProps={{
                          input: {
                            style: {
                              textAlign: "right",
                              paddingBottom: "2px",
                            },
                          },
                        }}
                        sx={{
                          borderBottom: "1px solid #CBD5E1",
                          borderRadius: 0,
                          width: "100px",
                          fontSize: "13px",
                          ml: "auto",
                          backgroundColor: "transparent",
                          "&:focus-within": {
                            borderBottom: "2px solid #004366",
                          },
                        }}
                      />
                    </td>

                    {/* Computed Total Cost - end of BUDGET group */}
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: 700,
                        fontSize: "14px",
                        color: "#0F172A",
                        verticalAlign: "middle",
                      }}
                    >
                      {formatCurrency(calculatedTotalCost)}
                    </td>

                    {/* Spacer between BUDGET and PROCUREMENT */}
                    <td style={{ padding: 0, backgroundColor: "white" }} />

                    {/* Mode of Procurement Dropdown */}
                    <td>
                      <Select
                        size="sm"
                        variant="outlined"
                        value={item.procurementMode}
                        onChange={(e, val) =>
                          handleCellEdit(item.id, "procurementMode", val)
                        }
                        sx={{
                          backgroundColor: "white",
                          borderRadius: "6px",
                          fontSize: "13px",
                          width: "100%",
                          fontWeight: 500,
                          borderColor: "neutral.200",
                          boxShadow: "none",
                          "&:hover": { borderColor: "neutral.300" },
                        }}
                      >
                        <Option value="Direct Purchase">Direct Purchase</Option>
                        <Option value="Public Bidding">Public Bidding</Option>
                        <Option value="Competitive Bidding">
                          Competitive Bidding
                        </Option>
                        <Option value="Shopping">Shopping</Option>
                        <Option value="Negotiated Procurement">
                          Negotiated Procurement
                        </Option>
                      </Select>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", py: 5 }}>
                  <Typography level="body-md" color="neutral">
                    No resources found matching the criteria.
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Sheet>

      {/* 6. Footer Pagination bar */}
      <ServerPaginationComponent
        page={currentPage}
        setPage={setCurrentPage}
        perPage={rowsPerPage}
        pagination={{
          last_page: totalPages,
          total: filteredData.length,
        }}
      />
    </Fragment>
  );
}

export default BudgetDeliberation;
