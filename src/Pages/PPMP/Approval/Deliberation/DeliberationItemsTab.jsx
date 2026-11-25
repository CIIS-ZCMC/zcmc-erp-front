import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Sheet,
  Stack,
  Table,
  Textarea,
  Tooltip,
  Typography,
} from "@mui/joy";
import {
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CloseFullscreen as CloseFullscreenIcon,
  History as HistoryIcon,
  HowToReg as HowToRegIcon,
  Lock as LockIcon,
  OpenInFull as OpenInFullIcon,
  Restore as RestoreIcon,
  Search as SearchIcon,
  Undo as UndoIcon,
  UnfoldMore as UnfoldMoreIcon,
  VerifiedUser as VerifiedUserIcon,
} from "@mui/icons-material";
import PageTitle from "@Components/Common/PageTitle";

const formatCurrency = (val) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(val || 0));

const formatSignedCurrency = (val) => {
  const num = Number(val || 0);
  if (Math.abs(num) < 0.005) return "₱0.00";
  return num < 0
    ? `−${formatCurrency(Math.abs(num))}`
    : `+${formatCurrency(num)}`;
};

const formatDateLabel = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTimeLabel = (isoStr) => {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatDateTimeLabel = (isoStr) => {
  if (!isoStr) return "--";
  const d = new Date(isoStr);
  if (Number.isNaN(d.getTime())) return isoStr;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const ACTION_BADGE_MAP = {
  price_change: { label: "Unit Cost Changed", color: "warning" },
  quantity_change: { label: "Quantity Changed", color: "primary" },
  procurement_mode_change: { label: "Procurement Mode", color: "neutral" },
  source_of_fund_change: { label: "Fund Source", color: "neutral" },
  item_multiple_update: { label: "Multiple Fields", color: "primary" },
  deleted: { label: "Removed", color: "danger" },
  restored: { label: "Restored", color: "success" },
  reverted: { label: "Reverted", color: "success" },
};

const describeLatestChange = (item, latestHistory) => {
  if (!latestHistory) return null;
  const prev = latestHistory.previous_values || {};
  const next = latestHistory.new_values || {};
  const unitLabel = item?.unit || "unit";

  if (latestHistory.action_type === "deleted") {
    return {
      summary: `Removed item (was ${formatCurrency(prev.total_amount)})`,
      undoLabel: "Restore item",
    };
  }

  if (
    latestHistory.action_type === "price_change" ||
    (prev.estimated_budget !== undefined &&
      next.estimated_budget !== undefined &&
      Number(prev.estimated_budget) !== Number(next.estimated_budget))
  ) {
    return {
      summary: `Cost per ${unitLabel}: ${formatCurrency(prev.estimated_budget)} → ${formatCurrency(next.estimated_budget)}`,
      undoLabel: "Undo cost change",
    };
  }

  if (
    latestHistory.action_type === "quantity_change" ||
    (prev.total_quantity !== undefined &&
      next.total_quantity !== undefined &&
      Number(prev.total_quantity) !== Number(next.total_quantity))
  ) {
    return {
      summary: `Quantity: ${prev.total_quantity} → ${next.total_quantity} ${unitLabel}`,
      undoLabel: "Undo qty change",
    };
  }

  if (latestHistory.action_type === "procurement_mode_change") {
    return {
      summary: `Procurement: ${prev.procurement_mode_name || "Previous"} → ${next.procurement_mode_name || "Updated"}`,
      undoLabel: "Undo change",
    };
  }

  if (latestHistory.action_type === "source_of_fund_change") {
    return {
      summary: `Fund source: ${prev.source_of_fund_name || "Previous"} → ${next.source_of_fund_name || "Updated"}`,
      undoLabel: "Undo change",
    };
  }

  return {
    summary: latestHistory.remarks || "Item updated during deliberation",
    undoLabel: "Undo last change",
  };
};

const SortHeaderButton = ({
  label,
  sortKey,
  sortBy,
  sortDir,
  defaultDir = "asc",
  align = "left",
  fontSize = "13px",
  onSort,
}) => {
  const isActive = sortBy === sortKey;
  const SortIcon = !isActive
    ? UnfoldMoreIcon
    : sortDir === "asc"
      ? ArrowUpwardIcon
      : ArrowDownwardIcon;

  return (
    <Box
      component="button"
      type="button"
      onClick={() => onSort(sortKey, defaultDir)}
      title={`Sort by ${label}`}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: align === "right" ? "flex-end" : "flex-start",
        gap: 0.4,
        width: "100%",
        border: "none",
        background: "transparent",
        padding: 0,
        cursor: "pointer",
        fontFamily: '"Poppins", sans-serif',
        fontSize,
        fontWeight: isActive ? 600 : 500,
        color: isActive ? "#0b3a57" : "#4f5e6b",
        "&:hover": { color: "#0b3a57" },
      }}
    >
      <span>{label}</span>
      <SortIcon
        sx={{
          fontSize: 15,
          flexShrink: 0,
          color: isActive ? "#0b3a57" : "#8a99a8",
        }}
      />
    </Box>
  );
};

function DeliberationItemsTab({
  year = new Date().getFullYear() + 1,
  areas = [],
  metrics = {},
  items = [],
  itemsSummary = {},
  itemsPagination = {},
  libraries = {},
  userCapabilities = {},
  areaRepresentatives = [],
  undoStack = [],
  itemHistoryEntries = [],
  isLoadingHistory = false,
  isLoadingItems = false,
  isSubmitting = false,
  selectedAopId,
  setSelectedAopId,
  selectedPpmpType,
  setSelectedPpmpType,
  displayMode = false,
  onToggleDisplayMode,
  onBackToCalendar,
  onFetchItems,
  onFetchItemHistory,
  onUpdateItem,
  onDeleteItem,
  onUndoLastChange,
  onFetchRepresentatives,
  onConfirmMcc,
  onConfirmEndUser,
}) {
  // Filter & Sorting States
  const [searchQuery, setSearchQuery] = useState("");
  const [editStatusFilter, setEditStatusFilter] = useState("all"); // 'all' | 'edited' | 'unedited' | 'removed'
  const [filterCategoryId, setFilterCategoryId] = useState(null);
  const [sortBy, setSortBy] = useState("item_no"); // 'item_no' | 'name' | 'code' | 'quantity' | 'unit_cost' | 'total_cost' | 'category'
  const [sortDir, setSortDir] = useState("asc"); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(15);

  // Master-detail selection & expansion
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isInspectorExpanded, setIsInspectorExpanded] = useState(false);
  const [expandedDetailRowId, setExpandedDetailRowId] = useState(null);
  const [gotoInput, setGotoInput] = useState("");
  const pendingSelectionRef = useRef(null);

  // Side-panel live drafts (Split View)
  const [draftQty, setDraftQty] = useState("");
  const [draftUnitCost, setDraftUnitCost] = useState("");

  // Per-row inline drafts (Display Mode spreadsheet)
  const [inlineDrafts, setInlineDrafts] = useState({});
  const [inlineActivityQtyDrafts, setInlineActivityQtyDrafts] = useState({});

  // Activity breakdown modal (Split View)
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [activityQtyDrafts, setActivityQtyDrafts] = useState({});

  // Per-Item History Modal State
  const [historyItemTarget, setHistoryItemTarget] = useState(null);

  // Remove Item Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteRemarks, setDeleteRemarks] = useState("");

  // MCC Confirmation Modal State
  const [mccModalOpen, setMccModalOpen] = useState(false);
  const [mccPin, setMccPin] = useState("");

  // End User (Area Representative) Confirmation Modal State
  const [repModalOpen, setRepModalOpen] = useState(false);
  const [selectedRepUserId, setSelectedRepUserId] = useState(null);
  const [repPin, setRepPin] = useState("");

  const canEdit = Boolean(userCapabilities?.can_edit_items);

  const selectedAreaObj = useMemo(() => {
    if (!selectedAopId) return null;
    return (
      areas.find((a) => Number(a.aop_application_id) === Number(selectedAopId)) ||
      null
    );
  }, [areas, selectedAopId]);

  const buildFetchParams = useCallback(
    (pageOverride) => ({
      aop_application_id: selectedAopId || undefined,
      ppmp_type: selectedPpmpType || undefined,
      category_id: filterCategoryId || undefined,
      edit_status: editStatusFilter !== "all" ? editStatusFilter : undefined,
      sort_by: sortBy,
      sort_dir: sortDir,
      search: searchQuery.trim() || undefined,
      page: pageOverride ?? currentPage,
      per_page: rowsPerPage,
    }),
    [
      selectedAopId,
      selectedPpmpType,
      filterCategoryId,
      editStatusFilter,
      sortBy,
      sortDir,
      searchQuery,
      currentPage,
      rowsPerPage,
    ],
  );

  // Keep outer viewport unscrollable while inside Tab 2
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  // Collapse expanded inspector on Escape
  useEffect(() => {
    if (!isInspectorExpanded) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsInspectorExpanded(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isInspectorExpanded]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    pendingSelectionRef.current = "first";
  }, [
    selectedAopId,
    selectedPpmpType,
    filterCategoryId,
    editStatusFilter,
    sortBy,
    sortDir,
    searchQuery,
  ]);

  const handleToggleColumnSort = (colKey, defaultDir = "asc") => {
    if (sortBy === colKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(colKey);
      setSortDir(defaultDir);
    }
  };

  // Fetch items whenever query params change
  useEffect(() => {
    const timer = setTimeout(() => {
      onFetchItems(buildFetchParams());
    }, 200);
    return () => clearTimeout(timer);
  }, [buildFetchParams, onFetchItems]);

  // Sync active selection when items list changes
  useEffect(() => {
    if (!items || items.length === 0) {
      setSelectedItemId(null);
      pendingSelectionRef.current = null;
      return;
    }

    const pending = pendingSelectionRef.current;
    if (pending === "first") {
      setSelectedItemId(items[0].id);
      pendingSelectionRef.current = null;
      return;
    }
    if (pending === "last") {
      setSelectedItemId(items[items.length - 1].id);
      pendingSelectionRef.current = null;
      return;
    }
    if (
      pending &&
      typeof pending === "object" &&
      typeof pending.offset === "number"
    ) {
      const clampedIdx = Math.max(0, Math.min(items.length - 1, pending.offset));
      setSelectedItemId(items[clampedIdx].id);
      pendingSelectionRef.current = null;
      return;
    }

    const stillVisible = items.some((it) => it.id === selectedItemId);
    if (!stillVisible) {
      setSelectedItemId(items[0].id);
    }
  }, [items, selectedItemId]);

  const selectedIndex = useMemo(
    () => items.findIndex((it) => it.id === selectedItemId),
    [items, selectedItemId],
  );

  const selectedItem = useMemo(
    () => (selectedIndex >= 0 ? items[selectedIndex] : items[0] || null),
    [items, selectedIndex],
  );

  // Clear stale inline drafts on new page fetch
  useEffect(() => {
    setInlineDrafts({});
    setInlineActivityQtyDrafts({});
  }, [items]);

  // Sync side-panel draft values with active selected item
  useEffect(() => {
    if (!selectedItem) {
      setDraftQty("");
      setDraftUnitCost("");
      return;
    }
    setDraftQty(String(selectedItem.total_quantity ?? 1));
    setDraftUnitCost(String(Number(selectedItem.estimated_budget ?? 0)));
    const itemNo =
      selectedItem.item_no ??
      ((itemsPagination?.current_page || 1) - 1) * rowsPerPage +
      Math.max(0, selectedIndex) +
      1;
    setGotoInput(String(itemNo));
  }, [
    selectedItem?.id,
    selectedItem?.total_quantity,
    selectedItem?.estimated_budget,
    selectedItem?.item_no,
    itemsPagination?.current_page,
    rowsPerPage,
    selectedIndex,
  ]);

  // Fetch area representatives when area changes
  useEffect(() => {
    if (selectedAopId && onFetchRepresentatives) {
      onFetchRepresentatives(selectedAopId);
    }
  }, [selectedAopId, onFetchRepresentatives]);

  const openItemHistoryModal = (item) => {
    if (!item) return;
    setHistoryItemTarget(item);
    onFetchItemHistory && onFetchItemHistory(item.id);
  };

  // Summary metrics
  const allCount = Number(itemsSummary?.all_count ?? itemsSummary?.total_items ?? 0);
  const editedCount = Number(itemsSummary?.edited_count ?? 0);
  const uneditedCount = Number(
    itemsSummary?.unedited_count ?? Math.max(0, allCount - editedCount),
  );
  const removedCount = Number(itemsSummary?.removed_count ?? 0);
  const proposedTotal = Number(itemsSummary?.proposed_total ?? 0);
  const deliberatedTotal = Number(
    itemsSummary?.deliberated_total ?? itemsSummary?.total_amount ?? 0,
  );
  const totalDelta = deliberatedTotal - proposedTotal;
  const totalDeltaPct =
    proposedTotal > 0 ? Math.abs((totalDelta / proposedTotal) * 100) : 0;

  const totalBudgetCeiling = Number(metrics?.total_budget_ceiling || 0);
  const hospitalTotalPpmp = Number(metrics?.hospital_total_ppmp || 0);
  const isHospitalOverBudget = Boolean(metrics?.is_over_budget);
  const hospitalExcess = Number(metrics?.excess_amount || 0);
  const hospitalRemaining = Number(metrics?.remaining_budget || 0);

  // Side-panel live calculations (Split View)
  const parsedDraftQty = Math.max(
    1,
    parseInt(draftQty, 10) || Number(selectedItem?.total_quantity || 1),
  );
  const parsedDraftCost = Math.max(
    0,
    Number.isFinite(parseFloat(draftUnitCost))
      ? parseFloat(draftUnitCost)
      : Number(selectedItem?.estimated_budget || 0),
  );

  const isSelectedDeleted = Boolean(selectedItem?.is_deleted);
  const origQty = Number(
    selectedItem?.original_quantity ?? selectedItem?.total_quantity ?? 0,
  );
  const origUnitCost = Number(
    selectedItem?.original_unit_cost ?? selectedItem?.estimated_budget ?? 0,
  );
  const origTotal = Number(
    selectedItem?.original_total_amount ?? selectedItem?.total_amount ?? 0,
  );

  const liveTotal = isSelectedDeleted
    ? 0
    : Math.round(parsedDraftQty * parsedDraftCost * 100) / 100;
  const itemDelta = liveTotal - origTotal;
  const itemDeltaPct = origTotal > 0 ? Math.abs((itemDelta / origTotal) * 100) : 0;
  const isCostModifiedVsOriginal =
    !isSelectedDeleted && Math.abs(parsedDraftCost - origUnitCost) > 0.009;
  const hasUnsavedQtyOrCost =
    Boolean(selectedItem) &&
    !isSelectedDeleted &&
    (parsedDraftQty !== Number(selectedItem.total_quantity) ||
      Math.abs(parsedDraftCost - Number(selectedItem.estimated_budget)) > 0.009);

  const commitQuantityAndCost = useCallback(() => {
    if (!selectedItem || !canEdit || isSelectedDeleted) return;
    const payload = {};
    if (parsedDraftQty !== Number(selectedItem.total_quantity)) {
      payload.total_quantity = parsedDraftQty;
    }
    if (Math.abs(parsedDraftCost - Number(selectedItem.estimated_budget)) > 0.009) {
      payload.estimated_budget = parsedDraftCost;
    }
    if (Object.keys(payload).length === 0) return;

    onUpdateItem(selectedItem.id, payload);
  }, [
    selectedItem,
    canEdit,
    isSelectedDeleted,
    parsedDraftQty,
    parsedDraftCost,
    onUpdateItem,
  ]);

  const commitInlineRowChange = (row, field) => {
    if (!canEdit || row.is_deleted) return;
    const draft = inlineDrafts[row.id];
    if (!draft) return;

    if (field === "total_quantity" && draft.total_quantity !== undefined) {
      const parsed = Math.max(1, parseInt(draft.total_quantity, 10) || 1);
      if (parsed !== Number(row.total_quantity)) {
        onUpdateItem(row.id, { total_quantity: parsed });
      }
    } else if (
      field === "estimated_budget" &&
      draft.estimated_budget !== undefined
    ) {
      const parsed = Math.max(0, parseFloat(draft.estimated_budget) || 0);
      if (Math.abs(parsed - Number(row.estimated_budget)) > 0.009) {
        onUpdateItem(row.id, { estimated_budget: parsed });
      }
    }
  };

  const commitInlineActivityQty = (row, actId) => {
    if (!canEdit || row.is_deleted) return;
    const valStr = inlineActivityQtyDrafts[`${row.id}_${actId}`];
    if (valStr === undefined) return;
    const activity_quantities = (row.activities || []).map((act) => ({
      activity_id: act.activity_id,
      quantity:
        act.activity_id === actId
          ? Math.max(0, parseInt(valStr, 10) || 0)
          : Math.max(
            0,
            parseInt(
              inlineActivityQtyDrafts[`${row.id}_${act.activity_id}`] ??
              act.quantity,
              10,
            ) || 0,
          ),
    }));
    const sum = activity_quantities.reduce((s, a) => s + a.quantity, 0);
    if (sum < 1) return;
    onUpdateItem(row.id, { activity_quantities });
  };

  const handleFieldSelectChange = (itemObj, fieldName, value) => {
    if (!itemObj || !canEdit || itemObj.is_deleted) return;
    if (Number(itemObj[fieldName] || 0) === Number(value || 0)) return;
    onUpdateItem(itemObj.id, { [fieldName]: value });
  };

  const handleOpenActivityModal = () => {
    if (!selectedItem) return;
    const drafts = {};
    (selectedItem.activities || []).forEach((act) => {
      drafts[act.activity_id] = String(act.quantity ?? 0);
    });
    setActivityQtyDrafts(drafts);
    setActivityModalOpen(true);
  };

  const handleSaveActivityBreakdown = () => {
    if (!selectedItem) return;
    const activity_quantities = (selectedItem.activities || []).map((act) => ({
      activity_id: act.activity_id,
      quantity: Math.max(
        0,
        parseInt(activityQtyDrafts[act.activity_id], 10) || 0,
      ),
    }));
    const newSum = activity_quantities.reduce((s, a) => s + a.quantity, 0);
    if (newSum < 1) return;

    onUpdateItem(selectedItem.id, { activity_quantities });
    setActivityModalOpen(false);
  };

  const handlePreviousItem = () => {
    if (items.length === 0) return;
    if (!displayMode && hasUnsavedQtyOrCost) commitQuantityAndCost();

    if (selectedIndex > 0) {
      setSelectedItemId(items[selectedIndex - 1].id);
    } else if (currentPage > 1) {
      pendingSelectionRef.current = "last";
      setCurrentPage((p) => Math.max(1, p - 1));
    }
  };

  const handleNextItem = () => {
    if (items.length === 0) return;
    if (!displayMode && hasUnsavedQtyOrCost) commitQuantityAndCost();

    const lastPage = Number(itemsPagination?.last_page || 1);
    if (selectedIndex >= 0 && selectedIndex < items.length - 1) {
      setSelectedItemId(items[selectedIndex + 1].id);
    } else if (currentPage < lastPage) {
      pendingSelectionRef.current = "first";
      setCurrentPage((p) => Math.min(lastPage, p + 1));
    }
  };

  const handleGoToItemNo = (e) => {
    if (e) e.preventDefault();
    const totalFiltered = Number(itemsPagination?.total || items.length || 0);
    if (!totalFiltered) return;

    const targetNo = Math.max(
      1,
      Math.min(totalFiltered, parseInt(gotoInput, 10) || 1),
    );
    const targetPage = Math.ceil(targetNo / rowsPerPage);
    const offsetOnPage = (targetNo - 1) % rowsPerPage;

    if (targetPage === currentPage) {
      if (items[offsetOnPage]) setSelectedItemId(items[offsetOnPage].id);
    } else {
      pendingSelectionRef.current = { offset: offsetOnPage };
      setCurrentPage(targetPage);
    }
  };

  const handleUndoLatestInDisplayMode = () => {
    const latestFromStack = undoStack?.[undoStack.length - 1];
    const targetHistoryId =
      latestFromStack || selectedItem?.recent_histories?.[0]?.id;
    if (!targetHistoryId) return;
    onUndoLastChange(targetHistoryId, () => {
      onFetchItems(buildFetchParams());
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    onDeleteItem(
      deleteTarget.id,
      { remarks: deleteRemarks.trim() || "Removed during deliberation" },
      () => {
        setDeleteTarget(null);
        setDeleteRemarks("");
      },
    );
  };

  const handleSubmitMccConfirm = () => {
    if (!selectedAopId || !mccPin) return;
    onConfirmMcc(selectedAopId, { authorization_pin: mccPin }, () => {
      setMccModalOpen(false);
      setMccPin("");
    });
  };

  const handleSubmitRepConfirm = () => {
    if (!selectedAopId || !selectedRepUserId || !repPin) return;
    onConfirmEndUser(
      selectedAopId,
      { representative_user_id: selectedRepUserId, authorization_pin: repPin },
      () => {
        setRepModalOpen(false);
        setSelectedRepUserId(null);
        setRepPin("");
      },
    );
  };

  const isPrevDisabled =
    selectedIndex <= 0 && Number(itemsPagination?.current_page || 1) <= 1;
  const isNextDisabled =
    selectedIndex >= items.length - 1 &&
    Number(itemsPagination?.current_page || 1) >=
    Number(itemsPagination?.last_page || 1);

  const pageTotal = Number(itemsPagination?.total || 0);
  const fromNo =
    pageTotal === 0
      ? 0
      : (Number(itemsPagination?.current_page || 1) - 1) * rowsPerPage + 1;
  const toNo =
    pageTotal === 0 ? 0 : Math.min(fromNo + items.length - 1, pageTotal);

  const latestHistory = selectedItem?.recent_histories?.[0] || null;
  const latestChangeInfo = describeLatestChange(selectedItem, latestHistory);
  const currentItemDisplayNo =
    selectedItem?.item_no ??
    (selectedIndex >= 0
      ? (Number(itemsPagination?.current_page || 1) - 1) * rowsPerPage +
      selectedIndex +
      1
      : 0);
  const progressPct =
    pageTotal > 0
      ? Math.min(100, Math.max(0, (currentItemDisplayNo / pageTotal) * 100))
      : 0;

  const totalActivityQty = (selectedItem?.activities || []).reduce(
    (sum, a) => sum + Number(a.quantity || 0),
    0,
  );
  const activityCodesLabel = (selectedItem?.activities || [])
    .map((a) => a.activity_code)
    .filter(Boolean)
    .join(", ");

  const sessionDateText = selectedAreaObj?.session?.scheduled_date
    ? `Session of ${formatDateLabel(selectedAreaObj.session.scheduled_date)}`
    : "No deliberation session scheduled";

  // Category header stats map for Display Mode when sortBy === 'category'
  const categoryGroupStats = useMemo(() => {
    if (!displayMode || sortBy !== "category") return {};
    const stats = {};
    items.forEach((it, idx) => {
      const cat = it.item_category || "Uncategorized";
      if (!stats[cat]) {
        stats[cat] = {
          startNo: it.item_no || idx + 1,
          endNo: it.item_no || idx + 1,
          proposed: 0,
          deliberated: 0,
        };
      }
      stats[cat].endNo = it.item_no || idx + 1;
      stats[cat].proposed += Number(
        it.original_total_amount ?? it.total_amount ?? 0,
      );
      stats[cat].deliberated += it.is_deleted
        ? 0
        : Number(it.deliberated_total ?? it.total_amount ?? 0);
    });
    return stats;
  }, [displayMode, sortBy, items]);

  return (
    <Box
      sx={{
        fontFamily: '"Poppins", sans-serif',
        backgroundColor: "transparent",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      {/* 1. HEADER (Exact Manage AOP and PPMP PageTitle alignment) */}
      <Box sx={{ flexShrink: 0 }}>
        <PageTitle
          title="PPMP Budget Deliberation"
          withArrowBack={true}
          onClickArrow={onBackToCalendar}
          items={[
            {
              label: (
                <Tooltip
                  title={
                    selectedAreaObj
                      ? `${selectedAreaObj.area_code} — ${selectedAreaObj.area_name}`
                      : "All submitted hospital areas"
                  }
                  arrow
                  placement="bottom-start"
                >
                  <Typography
                    component="span"
                    sx={{
                      display: "inline-block",
                      maxWidth: { xs: "150px", md: "260px", xl: "360px" },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      verticalAlign: "bottom",
                      fontSize: "inherit",
                      fontWeight: 700,
                      color: "#1a1a1a",
                      cursor: "default",
                    }}
                  >
                    {selectedAreaObj
                      ? `${selectedAreaObj.area_code} — ${selectedAreaObj.area_name}`
                      : "All Areas"}
                  </Typography>
                </Tooltip>
              ),
              current: true,
            },
          ]}
          description={
            selectedAreaObj
              ? `${selectedAreaObj.area_name} · FY ${year} · ${sessionDateText}`
              : `All submitted hospital areas · FY ${year}`
          }
        />
      </Box>

      {/* Action Buttons Row cleanly below PageTitle (No collision with Notifications) */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="flex-end"
        flexWrap="wrap"
        sx={{ flexShrink: 0 }}
      >
        {selectedAreaObj && (
          <Fragment>
            {(selectedAreaObj.session?.budget_officer_confirmed ??
              selectedAreaObj.session?.mcc_confirmed) ? (
              <Chip
                size="sm"
                color="success"
                variant="soft"
                startDecorator={<VerifiedUserIcon fontSize="small" />}
                sx={{
                  height: "38px",
                  px: 1.5,
                  borderRadius: "8px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Budget Officer Confirmed
              </Chip>
            ) : (
              <Button
                size="sm"
                variant="outlined"
                disabled={
                  !(
                    userCapabilities?.can_confirm_budget_officer ??
                    userCapabilities?.can_confirm_mcc
                  )
                }
                startDecorator={<VerifiedUserIcon fontSize="small" />}
                onClick={() => setMccModalOpen(true)}
                sx={{
                  height: "38px",
                  px: 1.5,
                  borderRadius: "8px",
                  borderColor: "#0b3a57",
                  color: "#0b3a57",
                  backgroundColor: "white",
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: "13px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Confirm Budget Officer
              </Button>
            )}

            {selectedAreaObj.session?.end_user_confirmed ? (
              <Tooltip
                title={`End User Confirmed (${selectedAreaObj.session.end_user_confirmed_by})`}
              >
                <Chip
                  size="sm"
                  color="success"
                  variant="soft"
                  startDecorator={<HowToRegIcon fontSize="small" />}
                  sx={{
                    height: "38px",
                    px: 1.5,
                    borderRadius: "8px",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  End User Confirmed
                </Chip>
              </Tooltip>
            ) : (
              <Button
                size="sm"
                variant="outlined"
                startDecorator={<HowToRegIcon fontSize="small" />}
                onClick={() => setRepModalOpen(true)}
                sx={{
                  height: "38px",
                  px: 1.5,
                  borderRadius: "8px",
                  borderColor: "#8a4b00",
                  color: "#8a4b00",
                  backgroundColor: "white",
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: "13px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Confirm End User
              </Button>
            )}
          </Fragment>
        )}

        {onToggleDisplayMode && (
          <Box
            sx={{
              display: "inline-flex",
              border: "1px solid #0b3a57",
              borderRadius: "8px",
              overflow: "hidden",
              height: "38px",
              backgroundColor: "white",
            }}
          >
            {[
              { id: "mode1", active: !displayMode, label: "Mode 1: Focus Panel" },
              {
                id: "mode2",
                active: displayMode,
                label: "Mode 2: Quick-Edit Table",
              },
            ].map((m, idx) => (
              <Box
                key={m.id}
                component="button"
                type="button"
                onClick={() => {
                  if (!m.active) onToggleDisplayMode();
                }}
                sx={{
                  px: 1.5,
                  border: "none",
                  borderLeft: idx > 0 ? "1px solid #0b3a57" : "none",
                  backgroundColor: m.active ? "#0b3a57" : "white",
                  color: m.active ? "white" : "#0b3a57",
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: m.active ? "default" : "pointer",
                  whiteSpace: "nowrap",
                  transition: "background-color 0.15s ease",
                  "&:hover": {
                    backgroundColor: m.active ? "#0b3a57" : "#eef6fb",
                  },
                }}
              >
                {m.label}
              </Box>
            ))}
          </Box>
        )}
      </Stack>

      {/* 2. 4-COLUMN BUDGET SUMMARY BAR */}
      <Sheet
        variant="outlined"
        sx={{
          flexShrink: 0,
          backgroundColor: "white",
          borderColor: "#dde3e8",
          borderRadius: "10px",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "1fr 1fr 1fr 1.3fr",
          },
        }}
      >
        <Box sx={{ px: 2.5, py: 1.5 }}>
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: "13px",
              color: "#4f5e6b",
            }}
          >
            Proposed by {selectedAreaObj?.area_code || "All Areas"}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: { xs: "20px", md: "24px" },
              fontWeight: 600,
              color: "#13222d",
              lineHeight: 1.3,
            }}
          >
            {formatCurrency(proposedTotal)}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: "12px",
              color: "#4f5e6b",
            }}
          >
            {allCount} items as submitted
          </Typography>
        </Box>

        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            borderLeft: { sm: "1px solid #dde3e8" },
            borderTop: { xs: "1px solid #dde3e8", sm: "none" },
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: "13px",
              color: "#4f5e6b",
            }}
          >
            Deliberated so far
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: { xs: "20px", md: "24px" },
              fontWeight: 600,
              color: "#13222d",
              lineHeight: 1.3,
            }}
          >
            {formatCurrency(deliberatedTotal)}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: "12px",
              color: "#4f5e6b",
            }}
          >
            {editedCount} of {allCount} items changed
          </Typography>
        </Box>

        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            borderLeft: { lg: "1px solid #dde3e8" },
            borderTop: { xs: "1px solid #dde3e8", lg: "none" },
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: "13px",
              color: "#4f5e6b",
            }}
          >
            Change from proposal
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: { xs: "20px", md: "24px" },
              fontWeight: 600,
              color:
                totalDelta < -0.005
                  ? "#0b6aa2"
                  : totalDelta > 0.005
                    ? "#b3261e"
                    : "#13222d",
              lineHeight: 1.3,
            }}
          >
            {formatSignedCurrency(totalDelta)}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: "12px",
              color: "#4f5e6b",
            }}
          >
            {Math.abs(totalDelta) < 0.005
              ? "No changes from proposal yet"
              : `${totalDeltaPct.toFixed(1)}% ${totalDelta < 0 ? "lower" : "higher"} than proposed`}
          </Typography>
        </Box>

        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            borderLeft: {
              sm: isHospitalOverBudget
                ? "1px solid #f1c9c4"
                : totalBudgetCeiling > 0
                  ? "1px solid #bbf7d0"
                  : "1px solid #dde3e8",
            },
            borderTop: { xs: "1px solid #dde3e8", lg: "none" },
            backgroundColor: isHospitalOverBudget
              ? "#fceeec"
              : totalBudgetCeiling > 0
                ? "#f0fdf4"
                : "#f8fafc",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: "13px",
              color: isHospitalOverBudget
                ? "#7a1d17"
                : totalBudgetCeiling > 0
                  ? "#166534"
                  : "#4f5e6b",
            }}
          >
            FY {year} budget, all offices
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: { xs: "20px", md: "24px" },
              fontWeight: 600,
              color: isHospitalOverBudget
                ? "#b3261e"
                : totalBudgetCeiling > 0
                  ? "#15803d"
                  : "#13222d",
              lineHeight: 1.3,
            }}
          >
            {totalBudgetCeiling <= 0
              ? "Budget not assigned"
              : isHospitalOverBudget
                ? `Over by ${formatCurrency(hospitalExcess)}`
                : `Remaining ${formatCurrency(hospitalRemaining)}`}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: "12px",
              color: isHospitalOverBudget
                ? "#7a1d17"
                : totalBudgetCeiling > 0
                  ? "#166534"
                  : "#4f5e6b",
            }}
          >
            {totalBudgetCeiling > 0
              ? `${formatCurrency(hospitalTotalPpmp)} planned against a ${formatCurrency(totalBudgetCeiling)} budget`
              : `${formatCurrency(hospitalTotalPpmp)} planned hospital-wide`}
          </Typography>
        </Box>
      </Sheet>

      {!canEdit && (
        <Sheet
          variant="soft"
          color="warning"
          sx={{
            flexShrink: 0,
            px: 2,
            py: 0.75,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <LockIcon fontSize="small" />
          <Typography level="body-xs" fontWeight={600}>
            Read-only mode: Editing is currently locked (either finalized or
            disabled for {userCapabilities.role}).
          </Typography>
        </Sheet>
      )}

      {/* ===================================================================== */}
      {/* 3A. DISPLAY MODE: FULL INLINE TABLE SPREADSHEET VIEW (Figma 9890:75825)*/}
      {/* ===================================================================== */}
      {displayMode ? (
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {/* Confirmations Bar */}
          {selectedAreaObj && (
            <Sheet
              variant="outlined"
              sx={{
                flexShrink: 0,
                backgroundColor: "white",
                borderColor: "#dde3e8",
                borderRadius: "10px",
                px: 3,
                py: 1.25,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
                <Typography
                  sx={{
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#13222d",
                  }}
                >
                  Confirmations
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: "12px",
                    color: "#13222d",
                  }}
                >
                  Budget Officer:{" "}
                  <Box
                    component="span"
                    sx={{
                      color: (selectedAreaObj.session
                        ?.budget_officer_confirmed ??
                        selectedAreaObj.session?.mcc_confirmed)
                        ? "#15803d"
                        : "#4f5e6b",
                      fontWeight: (selectedAreaObj.session
                        ?.budget_officer_confirmed ??
                        selectedAreaObj.session?.mcc_confirmed)
                        ? 600
                        : 400,
                    }}
                  >
                    {(selectedAreaObj.session?.budget_officer_confirmed ??
                      selectedAreaObj.session?.mcc_confirmed)
                      ? "confirmed"
                      : "waiting"}
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: "12px",
                    color: "#13222d",
                  }}
                >
                  End User:{" "}
                  <Box
                    component="span"
                    sx={{
                      color: selectedAreaObj.session?.end_user_confirmed
                        ? "#15803d"
                        : "#4f5e6b",
                      fontWeight: selectedAreaObj.session?.end_user_confirmed
                        ? 600
                        : 400,
                    }}
                  >
                    {selectedAreaObj.session?.end_user_confirmed
                      ? `confirmed (${selectedAreaObj.session.end_user_confirmed_by})`
                      : "waiting"}
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: "12px",
                    color: "#4f5e6b",
                  }}
                >
                  Each confirms from their own device.
                </Typography>
              </Stack>

              <Button
                variant="solid"
                onClick={() =>
                  setEditStatusFilter((prev) =>
                    prev === "edited" ? "all" : "edited",
                  )
                }
                sx={{
                  height: "38px",
                  px: 2.25,
                  borderRadius: "8px",
                  backgroundColor: "#0b3a57",
                  color: "white",
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: "13px",
                  fontWeight: 500,
                  "&:hover": { backgroundColor: "#092e45" },
                }}
              >
                {editStatusFilter === "edited"
                  ? `Showing ${editedCount} changes (Show all)`
                  : `Review ${editedCount} changes`}
              </Button>
            </Sheet>
          )}

          {/* Full-Width Inline Items Table Card */}
          <Sheet
            variant="outlined"
            sx={{
              flex: 1,
              minHeight: 0,
              backgroundColor: "white",
              borderColor: "#dde3e8",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Table Toolbar */}
            <Box
              sx={{
                flexShrink: 0,
                px: 2.5,
                py: 1.5,
                borderBottom: "1px solid #dde3e8",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                flexWrap="wrap"
              >
                <Input
                  placeholder="Search item, code or number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  startDecorator={<SearchIcon sx={{ color: "#4f5e6b" }} />}
                  sx={{
                    width: { xs: "220px", xl: "300px" },
                    height: "40px",
                    borderRadius: "8px",
                    borderColor: "#b8c3cc",
                    fontSize: "13px",
                  }}
                />

                {/* Segmented Filter: All | Changed | Unchanged | Removed */}
                <Box
                  sx={{
                    display: "inline-flex",
                    border: "1px solid #b8c3cc",
                    borderRadius: "8px",
                    overflow: "hidden",
                    height: "40px",
                  }}
                >
                  {[
                    { id: "all", label: `All ${allCount}` },
                    { id: "edited", label: `Changed ${editedCount}` },
                    { id: "unedited", label: `Unchanged ${uneditedCount}` },
                    { id: "removed", label: `Removed ${removedCount}` },
                  ].map((seg, idx) => {
                    const isActive = editStatusFilter === seg.id;
                    return (
                      <Box
                        key={seg.id}
                        component="button"
                        type="button"
                        onClick={() => setEditStatusFilter(seg.id)}
                        sx={{
                          px: 1.5,
                          border: "none",
                          borderLeft: idx > 0 ? "1px solid #b8c3cc" : "none",
                          backgroundColor: isActive ? "#0b3a57" : "white",
                          color: isActive ? "white" : "#13222d",
                          fontFamily: '"Poppins", sans-serif',
                          fontSize: "12px",
                          fontWeight: isActive ? 600 : 400,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {seg.label}
                      </Box>
                    );
                  })}
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <Box
                    sx={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "#0b6aa2",
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "12px",
                      color: "#4f5e6b",
                    }}
                  >
                    Edited in deliberation
                  </Typography>
                </Stack>

                <Button
                  size="sm"
                  variant="outlined"
                  startDecorator={<UndoIcon sx={{ fontSize: 16 }} />}
                  disabled={
                    !canEdit ||
                    isSubmitting ||
                    (!undoStack?.length && !selectedItem?.recent_histories?.[0])
                  }
                  onClick={handleUndoLatestInDisplayMode}
                  sx={{
                    height: "40px",
                    borderRadius: "8px",
                    borderColor: "#b8c3cc",
                    color: "#13222d",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                >
                  Undo last edit
                </Button>
              </Stack>
            </Box>

            {/* Internally Scrollable Table */}
            <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
              {isLoadingItems ? (
                <Box
                  sx={{
                    py: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <CircularProgress size="sm" />
                  <Typography level="body-sm" textColor="neutral.500">
                    Loading PPMP deliberation items...
                  </Typography>
                </Box>
              ) : (
                <Table
                  stickyHeader
                  sx={{
                    minWidth: "1220px",
                    "--TableCell-paddingX": "10px",
                    "--TableCell-paddingY": "12px",
                    "& thead th": {
                      backgroundColor: "#f4f6f8",
                      borderBottom: "1px solid #dde3e8",
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#4f5e6b",
                    },
                    "& tbody td": {
                      borderBottom: "1px solid #dde3e8",
                      fontFamily: '"Poppins", sans-serif',
                    },
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ width: "68px", textAlign: "right" }}>
                        <SortHeaderButton
                          label="No."
                          sortKey="item_no"
                          sortBy={sortBy}
                          sortDir={sortDir}
                          align="right"
                          fontSize="12px"
                          onSort={handleToggleColumnSort}
                        />
                      </th>
                      <th style={{ width: "20%" }}>
                        <SortHeaderButton
                          label="Item"
                          sortKey="name"
                          sortBy={sortBy}
                          sortDir={sortDir}
                          fontSize="12px"
                          onSort={handleToggleColumnSort}
                        />
                      </th>
                      <th style={{ width: "135px", textAlign: "right" }}>
                        Proposed
                      </th>
                      <th style={{ width: "125px" }}>
                        <SortHeaderButton
                          label="Quantity"
                          sortKey="quantity"
                          sortBy={sortBy}
                          sortDir={sortDir}
                          defaultDir="desc"
                          fontSize="12px"
                          onSort={handleToggleColumnSort}
                        />
                      </th>
                      <th style={{ width: "155px" }}>
                        <SortHeaderButton
                          label="Unit cost"
                          sortKey="unit_cost"
                          sortBy={sortBy}
                          sortDir={sortDir}
                          defaultDir="desc"
                          fontSize="12px"
                          onSort={handleToggleColumnSort}
                        />
                      </th>
                      <th style={{ width: "130px", textAlign: "right" }}>
                        <SortHeaderButton
                          label="Deliberated"
                          sortKey="total_cost"
                          sortBy={sortBy}
                          sortDir={sortDir}
                          defaultDir="desc"
                          align="right"
                          fontSize="12px"
                          onSort={handleToggleColumnSort}
                        />
                      </th>
                      <th style={{ width: "120px", textAlign: "right" }}>
                        Change
                      </th>
                      <th style={{ width: "175px" }}>Procurement mode</th>
                      <th style={{ width: "125px" }}>Fund source</th>
                      <th style={{ width: "170px", textAlign: "right" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((row, idx) => {
                      const prevRow = idx > 0 ? items[idx - 1] : null;
                      const showCategoryBar =
                        sortBy === "category" &&
                        (!prevRow ||
                          (prevRow.item_category || "Uncategorized") !==
                          (row.item_category || "Uncategorized"));

                      const rowCategory = row.item_category || "Uncategorized";
                      const catStat = categoryGroupStats[rowCategory];

                      const isSelected = selectedItem?.id === row.id;
                      const isDeleted = Boolean(row.is_deleted);
                      const isEdited = Boolean(row.is_edited);
                      const isDetailsOpen = expandedDetailRowId === row.id;

                      const rowNo =
                        row.item_no ??
                        (Number(itemsPagination?.current_page || 1) - 1) *
                        rowsPerPage +
                        idx +
                        1;

                      const inlineDraft = inlineDrafts[row.id] || {};
                      const qtyVal =
                        inlineDraft.total_quantity !== undefined
                          ? inlineDraft.total_quantity
                          : String(row.total_quantity ?? 1);
                      const costVal =
                        inlineDraft.estimated_budget !== undefined
                          ? inlineDraft.estimated_budget
                          : String(Number(row.estimated_budget ?? 0));

                      const liveRowQty = Math.max(
                        1,
                        parseInt(qtyVal, 10) || Number(row.total_quantity || 1),
                      );
                      const liveRowCost = Math.max(
                        0,
                        parseFloat(costVal) || 0,
                      );
                      const liveRowTotal = isDeleted
                        ? 0
                        : Math.round(liveRowQty * liveRowCost * 100) / 100;

                      const rowOrigQty = Number(
                        row.original_quantity ?? row.total_quantity ?? 0,
                      );
                      const rowOrigCost = Number(
                        row.original_unit_cost ?? row.estimated_budget ?? 0,
                      );
                      const rowProposed = Number(
                        row.original_total_amount ?? row.total_amount ?? 0,
                      );
                      const rowDelta = liveRowTotal - rowProposed;
                      const hasDelta = Math.abs(rowDelta) > 0.009;
                      const pctDiff =
                        rowProposed > 0
                          ? Math.abs((rowDelta / rowProposed) * 100)
                          : 0;
                      const rowLatestHist = row.recent_histories?.[0] || null;
                      const rowHistDesc = describeLatestChange(
                        row,
                        rowLatestHist,
                      );

                      return (
                        <Fragment key={row.id}>
                          {showCategoryBar && catStat && (
                            <tr>
                              <td
                                colSpan={10}
                                style={{
                                  backgroundColor: "#e6ecf1",
                                  padding: "10px 20px",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontFamily: '"Poppins", sans-serif',
                                    fontSize: "12px",
                                    color: "#13222d",
                                  }}
                                >
                                  <Box
                                    component="span"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    {rowCategory}
                                  </Box>{" "}
                                  <Box
                                    component="span"
                                    sx={{ color: "#4f5e6b" }}
                                  >
                                    · items {catStat.startNo}–{catStat.endNo} ·{" "}
                                    {formatCurrency(catStat.proposed)} proposed ·{" "}
                                    {formatCurrency(catStat.deliberated)}{" "}
                                    deliberated
                                  </Box>
                                </Typography>
                              </td>
                            </tr>
                          )}

                          <tr
                            onClick={() => setSelectedItemId(row.id)}
                            style={{
                              backgroundColor: isSelected
                                ? "#eef6fb"
                                : isDeleted
                                  ? "#f5f5f4"
                                  : "white",
                              boxShadow: isSelected
                                ? "inset 4px 0 0 0 #0b6aa2"
                                : "none",
                              cursor: "pointer",
                            }}
                          >
                            {/* No. */}
                            <td style={{ textAlign: "right" }}>
                              <Stack
                                direction="row"
                                spacing={0.75}
                                alignItems="center"
                                justifyContent="flex-end"
                              >
                                {(isDeleted || isEdited) && (
                                  <Box
                                    sx={{
                                      width: "9px",
                                      height: "9px",
                                      borderRadius: "50%",
                                      backgroundColor: isDeleted
                                        ? "#b3261e"
                                        : "#0b6aa2",
                                    }}
                                  />
                                )}
                                <Typography
                                  sx={{
                                    fontSize: "13px",
                                    fontWeight: isSelected ? 600 : 400,
                                    color: isSelected ? "#0b6aa2" : "#4f5e6b",
                                  }}
                                >
                                  {rowNo}
                                </Typography>
                              </Stack>
                            </td>

                            {/* Item */}
                            <td>
                              {isSelected && (
                                <Typography
                                  sx={{
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    color: "#0b3a57",
                                    letterSpacing: "0.48px",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  Now discussing
                                </Typography>
                              )}
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  color: isDeleted ? "#4f5e6b" : "#13222d",
                                  textDecoration: isDeleted
                                    ? "line-through"
                                    : "none",
                                }}
                              >
                                {row.general_description}
                              </Typography>
                              <Typography
                                sx={{ fontSize: "12px", color: "#4f5e6b" }}
                              >
                                {row.item_code || rowCategory} ·{" "}
                                {row.expense_class}
                              </Typography>
                              {row.ppmp_type === "dispensed" &&
                                Array.isArray(row.requesting_areas) &&
                                row.requesting_areas.length > 0 && (
                                  <Typography
                                    sx={{
                                      fontSize: "11px",
                                      color: "#0b3a57",
                                      fontWeight: 500,
                                      mt: 0.25,
                                    }}
                                  >
                                    Requested by:{" "}
                                    {row.requesting_areas
                                      .slice(0, 3)
                                      .map((ra) => `${ra.area_code} (${ra.quantity})`)
                                      .join(", ")}
                                    {row.requesting_areas.length > 3
                                      ? ` +${row.requesting_areas.length - 3} more`
                                      : ""}
                                  </Typography>
                                )}
                              {isDeleted ? (
                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    color: "#b3261e",
                                  }}
                                >
                                  Removed
                                </Typography>
                              ) : (
                                isEdited && (
                                  <Typography
                                    sx={{
                                      fontSize: "12px",
                                      fontWeight: 600,
                                      color: "#0b6aa2",
                                    }}
                                  >
                                    {row.cost_changed
                                      ? rowDelta < 0
                                        ? "Edited · unit cost reduced"
                                        : "Edited · unit cost changed"
                                      : row.quantity_changed
                                        ? "Edited · quantity changed"
                                        : "Edited"}
                                  </Typography>
                                )
                              )}
                            </td>

                            {/* Proposed */}
                            <td style={{ textAlign: "right" }}>
                              <Typography
                                sx={{
                                  fontSize: "12px",
                                  color: "#4f5e6b",
                                  textDecoration:
                                    hasDelta || isDeleted
                                      ? "line-through"
                                      : "none",
                                }}
                              >
                                {formatCurrency(rowProposed)}
                              </Typography>
                              <Typography
                                sx={{ fontSize: "11px", color: "#4f5e6b" }}
                              >
                                {rowOrigQty} {row.unit} ×{" "}
                                {formatCurrency(rowOrigCost)}
                              </Typography>
                            </td>

                            {/* Quantity */}
                            <td onClick={(e) => e.stopPropagation()}>
                              {isDeleted ? (
                                <Typography
                                  sx={{ fontSize: "12px", color: "#4f5e6b" }}
                                >
                                  0 {row.unit}
                                </Typography>
                              ) : (
                                <Stack
                                  direction="row"
                                  spacing={0.75}
                                  alignItems="center"
                                >
                                  <Input
                                    size="sm"
                                    type="number"
                                    disabled={!canEdit}
                                    value={qtyVal}
                                    onChange={(e) =>
                                      setInlineDrafts((prev) => ({
                                        ...prev,
                                        [row.id]: {
                                          ...prev[row.id],
                                          total_quantity: e.target.value,
                                        },
                                      }))
                                    }
                                    onBlur={() =>
                                      commitInlineRowChange(
                                        row,
                                        "total_quantity",
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        commitInlineRowChange(
                                          row,
                                          "total_quantity",
                                        );
                                      }
                                    }}
                                    slotProps={{
                                      input: {
                                        min: 1,
                                        style: { textAlign: "right" },
                                      },
                                    }}
                                    sx={{
                                      width: "66px",
                                      height: "40px",
                                      borderRadius: "8px",
                                      borderColor: "#b8c3cc",
                                      backgroundColor: "white",
                                      fontSize: "13px",
                                    }}
                                  />
                                  <Typography
                                    sx={{ fontSize: "12px", color: "#4f5e6b" }}
                                  >
                                    {row.unit}
                                  </Typography>
                                </Stack>
                              )}
                            </td>

                            {/* Unit Cost */}
                            <td onClick={(e) => e.stopPropagation()}>
                              {isDeleted ? (
                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    color: "#4f5e6b",
                                    textAlign: "right",
                                  }}
                                >
                                  {formatCurrency(row.estimated_budget)}
                                </Typography>
                              ) : (
                                <Input
                                  size="sm"
                                  type="number"
                                  disabled={!canEdit}
                                  value={costVal}
                                  startDecorator="₱"
                                  onChange={(e) =>
                                    setInlineDrafts((prev) => ({
                                      ...prev,
                                      [row.id]: {
                                        ...prev[row.id],
                                        estimated_budget: e.target.value,
                                      },
                                    }))
                                  }
                                  onBlur={() =>
                                    commitInlineRowChange(
                                      row,
                                      "estimated_budget",
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      commitInlineRowChange(
                                        row,
                                        "estimated_budget",
                                      );
                                    }
                                  }}
                                  slotProps={{
                                    input: {
                                      min: 0,
                                      step: "0.01",
                                      style: { textAlign: "right" },
                                    },
                                  }}
                                  sx={{
                                    height: "40px",
                                    borderRadius: "8px",
                                    borderWidth: row.cost_changed ? "2px" : "1px",
                                    borderColor: row.cost_changed
                                      ? "#0b6aa2"
                                      : "#b8c3cc",
                                    backgroundColor: "white",
                                    fontSize: "13px",
                                    fontWeight: row.cost_changed ? 600 : 400,
                                  }}
                                />
                              )}
                            </td>

                            {/* Deliberated */}
                            <td style={{ textAlign: "right" }}>
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  color: isDeleted ? "#4f5e6b" : "#13222d",
                                }}
                              >
                                {formatCurrency(liveRowTotal)}
                              </Typography>
                            </td>

                            {/* Change */}
                            <td style={{ textAlign: "right" }}>
                              <Typography
                                sx={{
                                  fontSize: "12px",
                                  fontWeight: hasDelta ? 600 : 400,
                                  color: hasDelta ? "#0b6aa2" : "#4f5e6b",
                                }}
                              >
                                {hasDelta
                                  ? formatSignedCurrency(rowDelta)
                                  : "No change"}
                              </Typography>
                            </td>

                            {/* Procurement Mode */}
                            <td onClick={(e) => e.stopPropagation()}>
                              {isDeleted ? (
                                <Typography
                                  sx={{ fontSize: "12px", color: "#4f5e6b" }}
                                >
                                  {row.procurement_mode || "Not set"}
                                </Typography>
                              ) : (
                                <Select
                                  size="sm"
                                  disabled={!canEdit}
                                  value={row.procurement_mode_id || null}
                                  onChange={(e, val) =>
                                    val &&
                                    handleFieldSelectChange(
                                      row,
                                      "procurement_mode_id",
                                      val,
                                    )
                                  }
                                  sx={{
                                    height: "40px",
                                    borderRadius: "8px",
                                    borderColor: "#b8c3cc",
                                    backgroundColor: "white",
                                    fontSize: "12px",
                                  }}
                                >
                                  {(libraries.procurement_modes || []).map(
                                    (pm) => (
                                      <Option key={pm.id} value={pm.id}>
                                        {pm.name}
                                      </Option>
                                    ),
                                  )}
                                </Select>
                              )}
                            </td>

                            {/* Source of Fund */}
                            <td onClick={(e) => e.stopPropagation()}>
                              {isDeleted ? (
                                <Typography
                                  sx={{ fontSize: "12px", color: "#4f5e6b" }}
                                >
                                  {row.source_of_fund || "Not set"}
                                </Typography>
                              ) : (
                                <Select
                                  size="sm"
                                  disabled={!canEdit}
                                  value={row.source_of_fund_id || null}
                                  onChange={(e, val) =>
                                    val &&
                                    handleFieldSelectChange(
                                      row,
                                      "source_of_fund_id",
                                      val,
                                    )
                                  }
                                  sx={{
                                    height: "40px",
                                    borderRadius: "8px",
                                    borderColor: "#b8c3cc",
                                    backgroundColor: "white",
                                    fontSize: "12px",
                                  }}
                                >
                                  {(libraries.source_of_funds || []).map(
                                    (sf) => (
                                      <Option key={sf.id} value={sf.id}>
                                        {sf.name}
                                      </Option>
                                    ),
                                  )}
                                </Select>
                              )}
                            </td>

                            {/* Row Actions (Per-Item History + Details + Remove/Restore) */}
                            <td
                              style={{ textAlign: "right" }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Stack
                                direction="row"
                                spacing={0.5}
                                justifyContent="flex-end"
                                alignItems="center"
                              >
                                <Tooltip title="View item history">
                                  <Button
                                    size="sm"
                                    variant="plain"
                                    startDecorator={
                                      <HistoryIcon sx={{ fontSize: 15 }} />
                                    }
                                    onClick={() => openItemHistoryModal(row)}
                                    sx={{
                                      minHeight: "30px",
                                      px: 0.75,
                                      fontSize: "12px",
                                      color: "#0b3a57",
                                    }}
                                  >
                                    History
                                  </Button>
                                </Tooltip>

                                {!isDeleted ? (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="plain"
                                      onClick={() =>
                                        setExpandedDetailRowId((cur) =>
                                          cur === row.id ? null : row.id,
                                        )
                                      }
                                      sx={{
                                        minHeight: "30px",
                                        px: 0.75,
                                        fontSize: "12px",
                                        fontWeight: isDetailsOpen ? 600 : 500,
                                        color: "#0b6aa2",
                                      }}
                                    >
                                      {isDetailsOpen ? "Hide" : "Details"}
                                    </Button>

                                    <Button
                                      size="sm"
                                      variant="plain"
                                      disabled={!canEdit}
                                      onClick={() => setDeleteTarget(row)}
                                      sx={{
                                        minHeight: "30px",
                                        px: 0.75,
                                        fontSize: "12px",
                                        color: "#b3261e",
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outlined"
                                    disabled={!canEdit || !rowLatestHist}
                                    onClick={() =>
                                      rowLatestHist &&
                                      onUndoLastChange(rowLatestHist.id, () =>
                                        onFetchItems(buildFetchParams()),
                                      )
                                    }
                                    sx={{
                                      minHeight: "30px",
                                      px: 1.25,
                                      borderRadius: "8px",
                                      borderColor: "#0b3a57",
                                      color: "#0b3a57",
                                      backgroundColor: "white",
                                      fontSize: "12px",
                                    }}
                                  >
                                    Restore
                                  </Button>
                                )}
                              </Stack>
                            </td>
                          </tr>

                          {/* Expanded Inline Details Sub-Row */}
                          {isDetailsOpen && !isDeleted && (
                            <tr>
                              <td
                                colSpan={10}
                                style={{
                                  backgroundColor: "#eef6fb",
                                  padding: "0 24px 18px 24px",
                                  boxShadow: "inset 4px 0 0 0 #0b6aa2",
                                }}
                              >
                                <Sheet
                                  variant="outlined"
                                  sx={{
                                    backgroundColor: "white",
                                    borderColor: "#dde3e8",
                                    borderRadius: "8px",
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.5,
                                  }}
                                >
                                  {hasDelta && (
                                    <Box
                                      sx={{
                                        backgroundColor: "#fff4db",
                                        borderRadius: "6px",
                                        px: 1.75,
                                        py: 1,
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: "12px",
                                          color: "#5c3d00",
                                        }}
                                      >
                                        <Box
                                          component="span"
                                          sx={{ fontWeight: 600 }}
                                        >
                                          Large change.
                                        </Box>{" "}
                                        The revised amount is{" "}
                                        {pctDiff.toFixed(1)}%{" "}
                                        {rowDelta < 0 ? "lower" : "higher"} than
                                        proposed. Check the figure before
                                        confirming.
                                      </Typography>
                                    </Box>
                                  )}

                                  <Box
                                    sx={{
                                      display: "grid",
                                      gridTemplateColumns: {
                                        xs: "1fr",
                                        md: "1.6fr 1fr",
                                      },
                                      gap: 3,
                                    }}
                                  >
                                    {/* Left: Changes to this item */}
                                    <Box>
                                      <Typography
                                        sx={{
                                          fontSize: "12px",
                                          fontWeight: 600,
                                          color: "#4f5e6b",
                                          mb: 0.75,
                                        }}
                                      >
                                        Changes to this item
                                      </Typography>
                                      {rowLatestHist && rowHistDesc ? (
                                        <Stack
                                          direction="row"
                                          justifyContent="space-between"
                                          alignItems="center"
                                          spacing={2}
                                        >
                                          <Box>
                                            <Typography
                                              sx={{
                                                fontSize: "12px",
                                                color: "#13222d",
                                              }}
                                            >
                                              {rowHistDesc.summary}{" "}
                                              <Box
                                                component="span"
                                                sx={{ color: "#4f5e6b" }}
                                              >
                                                · {rowLatestHist.changed_by}
                                                {rowLatestHist.created_at
                                                  ? `, ${formatTimeLabel(rowLatestHist.created_at)}`
                                                  : ""}
                                              </Box>
                                            </Typography>
                                            <Typography
                                              sx={{
                                                fontSize: "12px",
                                                color: "#4f5e6b",
                                              }}
                                            >
                                              Fund source:{" "}
                                              {row.source_of_fund || "Not set"}{" "}
                                              · Procurement:{" "}
                                              {row.procurement_mode ||
                                                "Not set"}
                                            </Typography>
                                          </Box>

                                          <Button
                                            size="sm"
                                            variant="outlined"
                                            disabled={!canEdit || isSubmitting}
                                            onClick={() =>
                                              onUndoLastChange(
                                                rowLatestHist.id,
                                                () =>
                                                  onFetchItems(
                                                    buildFetchParams(),
                                                  ),
                                              )
                                            }
                                            sx={{
                                              borderRadius: "8px",
                                              borderColor: "#0b3a57",
                                              color: "#0b3a57",
                                              fontSize: "12px",
                                              whiteSpace: "nowrap",
                                            }}
                                          >
                                            {rowHistDesc.undoLabel}
                                          </Button>
                                        </Stack>
                                      ) : (
                                        <Typography
                                          sx={{
                                            fontSize: "12px",
                                            color: "#4f5e6b",
                                          }}
                                        >
                                          No changes logged on this item yet.
                                        </Typography>
                                      )}
                                    </Box>

                                    {/* Right: Linked AOP activity */}
                                    <Box>
                                      <Typography
                                        sx={{
                                          fontSize: "12px",
                                          fontWeight: 600,
                                          color: "#4f5e6b",
                                          mb: 0.75,
                                        }}
                                      >
                                        Linked AOP activity
                                      </Typography>
                                      {(row.activities || []).length === 0 ? (
                                        <Typography
                                          sx={{
                                            fontSize: "12px",
                                            color: "#4f5e6b",
                                          }}
                                        >
                                          No linked AOP activities
                                        </Typography>
                                      ) : (
                                        <Stack spacing={0.75}>
                                          {row.activities.map((act) => (
                                            <Stack
                                              key={act.activity_id}
                                              direction="row"
                                              spacing={1}
                                              alignItems="center"
                                              justifyContent="space-between"
                                            >
                                              <Typography
                                                sx={{
                                                  fontSize: "12px",
                                                  color: "#13222d",
                                                }}
                                              >
                                                {act.activity_code} ·{" "}
                                                {act.activity_name}
                                              </Typography>
                                              <Stack
                                                direction="row"
                                                spacing={0.75}
                                                alignItems="center"
                                              >
                                                <Typography
                                                  sx={{
                                                    fontSize: "12px",
                                                    color: "#13222d",
                                                  }}
                                                >
                                                  Activity qty
                                                </Typography>
                                                <Input
                                                  size="sm"
                                                  type="number"
                                                  disabled={!canEdit}
                                                  value={
                                                    inlineActivityQtyDrafts[
                                                    `${row.id}_${act.activity_id}`
                                                    ] ?? String(act.quantity)
                                                  }
                                                  onChange={(e) =>
                                                    setInlineActivityQtyDrafts(
                                                      (prev) => ({
                                                        ...prev,
                                                        [`${row.id}_${act.activity_id}`]:
                                                          e.target.value,
                                                      }),
                                                    )
                                                  }
                                                  onBlur={() =>
                                                    commitInlineActivityQty(
                                                      row,
                                                      act.activity_id,
                                                    )
                                                  }
                                                  sx={{
                                                    width: "68px",
                                                    borderRadius: "8px",
                                                  }}
                                                />
                                              </Stack>
                                            </Stack>
                                          ))}
                                        </Stack>
                                      )}

                                      {row.ppmp_type === "dispensed" &&
                                        Array.isArray(row.requesting_areas) &&
                                        row.requesting_areas.length > 0 && (
                                          <Box sx={{ mt: 1.5, pt: 1.25, borderTop: "1px dashed #dde3e8" }}>
                                            <Typography
                                              sx={{
                                                fontSize: "12px",
                                                fontWeight: 600,
                                                color: "#0b3a57",
                                                mb: 0.75,
                                              }}
                                            >
                                              Requesting Areas &amp; Quantities ({row.requesting_areas.length})
                                            </Typography>
                                            <Stack spacing={0.5}>
                                              {row.requesting_areas.map((ra, raIdx) => (
                                                <Stack
                                                  key={`${ra.aop_application_id || ra.area_code}-${raIdx}`}
                                                  direction="row"
                                                  justifyContent="space-between"
                                                  alignItems="center"
                                                  spacing={1.5}
                                                  sx={{
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: "6px",
                                                    backgroundColor: "#f8fafc",
                                                  }}
                                                >
                                                  <Typography
                                                    sx={{
                                                      fontSize: "12px",
                                                      color: "#13222d",
                                                      fontWeight: 500,
                                                    }}
                                                  >
                                                    {ra.area_code} — {ra.area_name}
                                                  </Typography>
                                                  <Typography
                                                    sx={{
                                                      fontSize: "12px",
                                                      fontWeight: 600,
                                                      color: "#0b3a57",
                                                      whiteSpace: "nowrap",
                                                    }}
                                                  >
                                                    {Number(ra.quantity || 0).toLocaleString()} {row.unit}
                                                  </Typography>
                                                </Stack>
                                              ))}
                                            </Stack>
                                          </Box>
                                        )}
                                    </Box>
                                  </Box>
                                </Sheet>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </Box>
          </Sheet>

          {/* Sticky Bottom Navy Progress Bar */}
          <Sheet
            sx={{
              flexShrink: 0,
              backgroundColor: "#0b3a57",
              borderRadius: "10px",
              px: 2.5,
              py: 1.5,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1, minWidth: "240px" }}>
              <Typography
                sx={{
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: "14px",
                  color: "white",
                  mb: 0.75,
                }}
              >
                <Box component="span" sx={{ fontWeight: 600 }}>
                  Item {currentItemDisplayNo} of {pageTotal}
                </Box>
                {selectedItem && (
                  <Box component="span" sx={{ color: "#c9d8e3" }}>
                    {" "}
                    · {selectedItem.general_description} ·{" "}
                    {selectedItem.item_category}
                  </Box>
                )}
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: "6px",
                  backgroundColor: "#1b5478",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${progressPct}%`,
                    height: "100%",
                    backgroundColor: "white",
                    transition: "width 0.2s ease",
                  }}
                />
              </Box>
            </Box>

            <Stack direction="row" spacing={1.25} alignItems="center">
              <Box
                component="form"
                onSubmit={handleGoToItemNo}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography
                  component="label"
                  htmlFor="display-mode-goto"
                  sx={{
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: "13px",
                    color: "#c9d8e3",
                  }}
                >
                  Go to item no.
                </Typography>
                <Input
                  id="display-mode-goto"
                  size="sm"
                  type="number"
                  value={gotoInput}
                  onChange={(e) => setGotoInput(e.target.value)}
                  onBlur={() => {
                    if (
                      gotoInput &&
                      parseInt(gotoInput, 10) !== currentItemDisplayNo
                    ) {
                      handleGoToItemNo();
                    }
                  }}
                  slotProps={{
                    input: {
                      min: 1,
                      max: Math.max(1, pageTotal),
                      style: { textAlign: "right" },
                    },
                  }}
                  sx={{
                    width: "74px",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    borderColor: "white",
                    color: "#13222d",
                    fontSize: "14px",
                  }}
                />
              </Box>

              <Button
                variant="outlined"
                disabled={isPrevDisabled || !selectedItem}
                onClick={handlePreviousItem}
                sx={{
                  height: "40px",
                  borderColor: "white",
                  color: "white",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.12)",
                    borderColor: "white",
                  },
                }}
              >
                ← Previous item
              </Button>

              <Button
                variant="solid"
                disabled={isNextDisabled || !selectedItem}
                onClick={handleNextItem}
                sx={{
                  height: "40px",
                  backgroundColor: "white",
                  color: "#0b3a57",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#eef6fb" },
                }}
              >
                Next item →
              </Button>
            </Stack>
          </Sheet>
        </Box>
      ) : (
        /* ================================================================= */
        /* 3B. STANDARD SPLIT VIEW (Figma 9914:55690 + 9914:56273)           */
        /* ================================================================= */
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 2,
            alignItems: "stretch",
          }}
        >
          {/* LEFT PANEL: ITEMS TABLE & FILTERS */}
          <Sheet
            variant="outlined"
            sx={{
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              height: "100%",
              backgroundColor: "white",
              borderColor: "#dde3e8",
              borderRadius: "12px",
              display: isInspectorExpanded ? "none" : "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Filter Toolbar */}
            <Box
              sx={{
                flexShrink: 0,
                px: 2.5,
                py: 1.5,
                borderBottom: "1px solid #dde3e8",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 1.25,
              }}
            >
              <Input
                placeholder="Search item, code or number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startDecorator={<SearchIcon sx={{ color: "#4f5e6b" }} />}
                sx={{
                  flex: 1,
                  minWidth: "180px",
                  height: "42px",
                  borderRadius: "8px",
                  borderColor: "#b8c3cc",
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: "13px",
                }}
              />

              <Box
                sx={{
                  display: "inline-flex",
                  border: "1px solid #b8c3cc",
                  borderRadius: "8px",
                  overflow: "hidden",
                  height: "42px",
                  flexShrink: 0,
                }}
              >
                {[
                  { id: "all", label: `All ${allCount}` },
                  { id: "edited", label: `Edited ${editedCount}` },
                  { id: "unedited", label: `Not yet edited ${uneditedCount}` },
                ].map((seg, idx) => {
                  const isActive = editStatusFilter === seg.id;
                  return (
                    <Box
                      key={seg.id}
                      component="button"
                      type="button"
                      onClick={() => setEditStatusFilter(seg.id)}
                      sx={{
                        px: 1.5,
                        border: "none",
                        borderLeft: idx > 0 ? "1px solid #b8c3cc" : "none",
                        backgroundColor: isActive ? "#0b3a57" : "white",
                        color: isActive ? "white" : "#13222d",
                        fontFamily: '"Poppins", sans-serif',
                        fontSize: "13px",
                        fontWeight: isActive ? 600 : 500,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {seg.label}
                    </Box>
                  );
                })}
              </Box>

              <Select
                placeholder="All categories"
                value={filterCategoryId}
                onChange={(e, val) => setFilterCategoryId(val)}
                sx={{
                  width: { xs: "100%", sm: "170px" },
                  height: "42px",
                  borderRadius: "8px",
                  borderColor: "#b8c3cc",
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: "13px",
                }}
              >
                <Option value={null}>All categories</Option>
                {(libraries.categories || []).map((cat) => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Option>
                ))}
              </Select>

              <Select
                placeholder="All project types"
                value={selectedPpmpType}
                onChange={(e, val) => setSelectedPpmpType(val)}
                sx={{
                  width: { xs: "100%", sm: "155px" },
                  height: "42px",
                  borderRadius: "8px",
                  borderColor: "#b8c3cc",
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: "13px",
                }}
              >
                <Option value={null}>All project types</Option>
                <Option value="regular">Not dispensed</Option>
                <Option value="dispensed">Dispensed</Option>
              </Select>
            </Box>

            {/* Table Header */}
            <Box
              sx={{
                flexShrink: 0,
                backgroundColor: "#f4f6f8",
                borderBottom: "1px solid #dde3e8",
                px: 2.5,
                py: 1.25,
                display: "grid",
                gridTemplateColumns:
                  "56px minmax(175px, 1fr) 95px 110px 120px 100px 46px",
                gap: 1.25,
                alignItems: "center",
              }}
            >
              <SortHeaderButton
                label="No."
                sortKey="item_no"
                sortBy={sortBy}
                sortDir={sortDir}
                align="right"
                onSort={handleToggleColumnSort}
              />
              <SortHeaderButton
                label="Item"
                sortKey="name"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleToggleColumnSort}
              />
              <SortHeaderButton
                label="Price"
                sortKey="unit_cost"
                sortBy={sortBy}
                sortDir={sortDir}
                defaultDir="desc"
                align="right"
                onSort={handleToggleColumnSort}
              />
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#4f5e6b",
                  textAlign: "right",
                }}
              >
                Proposed
              </Typography>
              <SortHeaderButton
                label="Deliberated"
                sortKey="total_cost"
                sortBy={sortBy}
                sortDir={sortDir}
                defaultDir="desc"
                align="right"
                onSort={handleToggleColumnSort}
              />
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#4f5e6b",
                  textAlign: "right",
                }}
              >
                Change
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#4f5e6b",
                  textAlign: "center",
                }}
              >
                Hist.
              </Typography>
            </Box>

            {/* Internally Scrollable Rows */}
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "auto",
              }}
            >
              {isLoadingItems ? (
                <Box
                  sx={{
                    py: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <CircularProgress size="sm" />
                  <Typography level="body-sm" textColor="neutral.500">
                    Loading PPMP deliberation items...
                  </Typography>
                </Box>
              ) : items.length === 0 ? (
                <Box sx={{ py: 10, textAlign: "center", px: 2 }}>
                  <Typography
                    sx={{ fontSize: "15px", fontWeight: 600, color: "#4f5e6b" }}
                  >
                    No PPMP items match the active filters.
                  </Typography>
                </Box>
              ) : (
                items.map((row, idx) => {
                  const isSelected = selectedItem?.id === row.id;
                  const isDeleted = Boolean(row.is_deleted);
                  const isEdited = Boolean(row.is_edited);
                  const rowNo =
                    row.item_no ??
                    (Number(itemsPagination?.current_page || 1) - 1) *
                    rowsPerPage +
                    idx +
                    1;

                  const rowProposed = Number(
                    row.original_total_amount ?? row.total_amount ?? 0,
                  );
                  const rowDeliberated = isDeleted
                    ? 0
                    : Number(row.deliberated_total ?? row.total_amount ?? 0);
                  const rowChange = rowDeliberated - rowProposed;
                  const hasFinancialChange = Math.abs(rowChange) > 0.009;

                  const rowBg = isSelected
                    ? "#0b3a57"
                    : isDeleted
                      ? "#fef2f2"
                      : "white";

                  return (
                    <Box
                      key={row.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        if (selectedItem?.id !== row.id && hasUnsavedQtyOrCost) {
                          commitQuantityAndCost();
                        }
                        setSelectedItemId(row.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedItemId(row.id);
                        }
                      }}
                      sx={{
                        px: 2.5,
                        py: 1.25,
                        minHeight: "64px",
                        display: "grid",
                        gridTemplateColumns:
                          "56px minmax(175px, 1fr) 95px 110px 120px 100px 46px",
                        gap: 1.25,
                        alignItems: "center",
                        backgroundColor: rowBg,
                        borderBottom: isSelected
                          ? "1px solid #0b3a57"
                          : "1px solid #e6e6e6",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: isSelected
                            ? "#0b3a57"
                            : isDeleted
                              ? "#fee2e2"
                              : "#f8fafc",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: isSelected ? "#c9d8e3" : "#4f5e6b",
                          textAlign: "right",
                        }}
                      >
                        {rowNo}
                      </Typography>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: isSelected
                              ? "white"
                              : isDeleted
                                ? "#7a1d17"
                                : "#13222d",
                            textDecoration: isDeleted ? "line-through" : "none",
                            lineHeight: 1.35,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.general_description}
                        </Typography>

                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          mt={0.5}
                          flexWrap="wrap"
                        >
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: isSelected ? "#c9d8e3" : "#4f5e6b",
                            }}
                          >
                            {row.item_code || row.item_category}
                          </Typography>

                          <Box
                            sx={{
                              px: 1,
                              py: "1px",
                              borderRadius: "999px",
                              backgroundColor: isSelected
                                ? "#375e75"
                                : "#e6ecf1",
                              color: isSelected ? "white" : "#0b3a57",
                              fontSize: "11px",
                              fontWeight: 500,
                              lineHeight: "18px",
                            }}
                          >
                            {row.ppmp_type === "dispensed"
                              ? "Dispensed"
                              : "Not dispensed"}
                          </Box>

                          {row.ppmp_type === "dispensed" &&
                            Array.isArray(row.requesting_areas) &&
                            row.requesting_areas.length > 0 && (
                              <Tooltip
                                title={row.requesting_areas
                                  .map(
                                    (ra) =>
                                      `${ra.area_code} (${ra.area_name}): ${ra.quantity} ${row.unit || "units"}`,
                                  )
                                  .join(" | ")}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "11px",
                                    fontWeight: 500,
                                    color: isSelected ? "#c9d8e3" : "#0b6aa2",
                                  }}
                                >
                                  {row.requesting_areas.length} req.{" "}
                                  {row.requesting_areas.length === 1
                                    ? "area"
                                    : "areas"}
                                  :{" "}
                                  {row.requesting_areas
                                    .slice(0, 2)
                                    .map((ra) => `${ra.area_code} (${ra.quantity})`)
                                    .join(", ")}
                                  {row.requesting_areas.length > 2
                                    ? ` +${row.requesting_areas.length - 2}`
                                    : ""}
                                </Typography>
                              </Tooltip>
                            )}

                          {(isDeleted || isEdited) && (
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                            >
                              <Box
                                sx={{
                                  width: "7px",
                                  height: "7px",
                                  borderRadius: "50%",
                                  backgroundColor: isSelected
                                    ? "#ffc98a"
                                    : isDeleted
                                      ? "#b3261e"
                                      : "#8a4b00",
                                }}
                              />
                              <Typography
                                sx={{
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  color: isSelected
                                    ? "#ffc98a"
                                    : isDeleted
                                      ? "#b3261e"
                                      : "#8a4b00",
                                }}
                              >
                                {isDeleted ? "Removed" : "Edited"}
                              </Typography>
                            </Stack>
                          )}
                        </Stack>
                      </Box>

                      <Box sx={{ textAlign: "right" }}>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: isSelected ? "white" : "#13222d",
                          }}
                        >
                          {formatCurrency(row.estimated_budget)}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "11px",
                            color: isSelected ? "#c9d8e3" : "#4f5e6b",
                          }}
                        >
                          {Number(row.total_quantity || 0).toLocaleString()} {row.unit}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: isSelected ? "#c9d8e3" : "#4f5e6b",
                          textAlign: "right",
                        }}
                      >
                        {formatCurrency(rowProposed)}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: isEdited || isDeleted ? 600 : 400,
                          color: isSelected ? "white" : "#13222d",
                          textAlign: "right",
                        }}
                      >
                        {formatCurrency(rowDeliberated)}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: hasFinancialChange ? 600 : 400,
                          color: isSelected
                            ? "white"
                            : hasFinancialChange
                              ? "#13222d"
                              : "#4f5e6b",
                          textAlign: "right",
                        }}
                      >
                        {hasFinancialChange
                          ? formatSignedCurrency(rowChange)
                          : "No change"}
                      </Typography>

                      {/* Per-item History Button */}
                      <Box
                        sx={{ display: "flex", justifyContent: "center" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openItemHistoryModal(row);
                        }}
                      >
                        <Tooltip title="View this item's history">
                          <IconButton
                            size="sm"
                            variant="plain"
                            sx={{
                              color: isSelected ? "white" : "#0b3a57",
                              "&:hover": {
                                backgroundColor: isSelected
                                  ? "rgba(255,255,255,0.16)"
                                  : "#eef6fb",
                              },
                            }}
                          >
                            <HistoryIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  );
                })
              )}
            </Box>

            {/* Left Pagination Footer */}
            <Box
              sx={{
                flexShrink: 0,
                px: 2.5,
                py: 1.25,
                borderTop: "1px solid #dde3e8",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography sx={{ fontSize: "13px", color: "#4f5e6b" }}>
                  Items {fromNo} to {toNo} of {pageTotal}
                </Typography>

                {Number(itemsPagination?.last_page || 1) > 1 && (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <IconButton
                      size="sm"
                      variant="outlined"
                      disabled={currentPage <= 1}
                      onClick={() => {
                        pendingSelectionRef.current = "first";
                        setCurrentPage((p) => Math.max(1, p - 1));
                      }}
                      sx={{ borderColor: "#b8c3cc", borderRadius: "6px" }}
                    >
                      <ChevronLeftIcon fontSize="small" />
                    </IconButton>
                    <Typography
                      sx={{ fontSize: "12px", color: "#4f5e6b", px: 0.75 }}
                    >
                      Page {itemsPagination?.current_page || 1} /{" "}
                      {itemsPagination?.last_page || 1}
                    </Typography>
                    <IconButton
                      size="sm"
                      variant="outlined"
                      disabled={
                        currentPage >= Number(itemsPagination?.last_page || 1)
                      }
                      onClick={() => {
                        pendingSelectionRef.current = "first";
                        setCurrentPage((p) => p + 1);
                      }}
                      sx={{ borderColor: "#b8c3cc", borderRadius: "6px" }}
                    >
                      <ChevronRightIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                )}
              </Stack>

              <Box
                component="form"
                onSubmit={handleGoToItemNo}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography
                  component="label"
                  htmlFor="deliberation-goto-input"
                  sx={{ fontSize: "13px", color: "#4f5e6b" }}
                >
                  Go to item no.
                </Typography>
                <Input
                  id="deliberation-goto-input"
                  size="sm"
                  type="number"
                  value={gotoInput}
                  onChange={(e) => setGotoInput(e.target.value)}
                  onBlur={() => {
                    if (
                      gotoInput &&
                      parseInt(gotoInput, 10) !== currentItemDisplayNo
                    ) {
                      handleGoToItemNo();
                    }
                  }}
                  slotProps={{
                    input: {
                      min: 1,
                      max: Math.max(1, pageTotal),
                      style: { textAlign: "right" },
                    },
                  }}
                  sx={{
                    width: "74px",
                    height: "38px",
                    borderRadius: "8px",
                    borderColor: "#b8c3cc",
                    fontSize: "13px",
                  }}
                />
              </Box>
            </Box>
          </Sheet>

          {/* RIGHT PANEL: ITEM UNDER DISCUSSION (9914:56273) */}
          <Sheet
            variant="outlined"
            sx={{
              width: isInspectorExpanded
                ? "100%"
                : { xs: "100%", lg: "520px", xl: "570px" },
              height: "100%",
              minHeight: 0,
              flexShrink: 0,
              backgroundColor: "white",
              borderColor: "#0b3a57",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Fixed Navy Header */}
            <Box
              sx={{
                flexShrink: 0,
                backgroundColor: "#0b3a57",
                minHeight: "64px",
                pl: 3,
                pr: 1.5,
                py: 1.25,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.25,
              }}
            >
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Typography
                  sx={{ fontSize: "15px", fontWeight: 600, color: "white" }}
                >
                  Now Discussing
                </Typography>
                {selectedItem && (
                  <Typography sx={{ fontSize: "14px", color: "white" }}>
                    Item {currentItemDisplayNo} of {pageTotal}
                  </Typography>
                )}
              </Stack>

              <Stack direction="row" spacing={0.75} alignItems="center">
                <Button
                  size="sm"
                  variant="outlined"
                  disabled={isPrevDisabled || !selectedItem}
                  onClick={handlePreviousItem}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    borderRadius: "8px",
                    px: 1.25,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.12)",
                      borderColor: "white",
                    },
                    "&.Mui-disabled": {
                      opacity: 0.4,
                      borderColor: "white",
                      color: "white",
                    },
                  }}
                >
                  ← Previous
                </Button>
                <Button
                  size="sm"
                  variant="outlined"
                  disabled={isNextDisabled || !selectedItem}
                  onClick={handleNextItem}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    borderRadius: "8px",
                    px: 1.25,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.12)",
                      borderColor: "white",
                    },
                    "&.Mui-disabled": {
                      opacity: 0.4,
                      borderColor: "white",
                      color: "white",
                    },
                  }}
                >
                  Next →
                </Button>
                <Tooltip
                  title={
                    isInspectorExpanded
                      ? "Show items table side-by-side (Esc)"
                      : "Expand to focus on this item only"
                  }
                >
                  <IconButton
                    size="sm"
                    variant="outlined"
                    onClick={() => setIsInspectorExpanded((prev) => !prev)}
                    sx={{
                      borderColor: "white",
                      color: "white",
                      borderRadius: "8px",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.12)",
                        borderColor: "white",
                      },
                    }}
                  >
                    {isInspectorExpanded ? (
                      <CloseFullscreenIcon fontSize="small" />
                    ) : (
                      <OpenInFullIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>

            {/* Internally Scrollable Inspector Body */}
            {!selectedItem ? (
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  py: 10,
                  px: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{ fontSize: "15px", fontWeight: 600, color: "#4f5e6b" }}
                >
                  Select an item from the list to begin board review
                </Typography>
              </Box>
            ) : (
              <Fragment>
                <Box
                  sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    px: 3,
                    py: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  {/* Item Identity */}
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "22px",
                        fontWeight: 600,
                        color: isSelectedDeleted ? "#7a1d17" : "#13222d",
                        textDecoration: isSelectedDeleted
                          ? "line-through"
                          : "none",
                        lineHeight: 1.3,
                      }}
                    >
                      {selectedItem.general_description}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1.25}
                      alignItems="center"
                      mt={0.5}
                      flexWrap="wrap"
                    >
                      <Typography sx={{ fontSize: "14px", color: "#4f5e6b" }}>
                        {selectedItem.item_code || `ITEM-${selectedItem.item_id}`}
                      </Typography>

                      {(isSelectedDeleted ||
                        selectedItem.is_edited ||
                        hasUnsavedQtyOrCost) && (
                          <Stack direction="row" spacing={0.75} alignItems="center">
                            <Box
                              sx={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: isSelectedDeleted
                                  ? "#b3261e"
                                  : "#8a4b00",
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: isSelectedDeleted ? "#b3261e" : "#8a4b00",
                              }}
                            >
                              {isSelectedDeleted
                                ? "Removed during deliberation"
                                : isCostModifiedVsOriginal
                                  ? "Cost changed"
                                  : selectedItem.quantity_changed ||
                                    hasUnsavedQtyOrCost
                                    ? "Quantity changed"
                                    : "Edited"}
                            </Typography>
                          </Stack>
                        )}
                    </Stack>

                    {isInspectorExpanded &&
                      Array.isArray(selectedItem.specifications) &&
                      selectedItem.specifications.length > 0 && (
                        <Box
                          sx={{
                            mt: 1,
                            p: 1.25,
                            borderRadius: "8px",
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "#4f5e6b",
                              mb: 0.25,
                            }}
                          >
                            Technical Specifications
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "#13222d",
                              lineHeight: 1.5,
                            }}
                          >
                            {selectedItem.specifications.join(" • ")}
                          </Typography>
                        </Box>
                      )}
                  </Box>

                  {/* Classification Card */}
                  <Box
                    sx={{
                      backgroundColor: "#f4f6f8",
                      borderRadius: "8px",
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: "13px", color: "#4f5e6b" }}>
                        Item category
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#13222d",
                          mt: 0.25,
                        }}
                      >
                        {selectedItem.item_category || "Uncategorized"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{ fontSize: "13px", color: "#4f5e6b", mb: 0.5 }}
                        >
                          Project type
                        </Typography>
                        <Box
                          sx={{
                            display: "inline-flex",
                            px: 1.25,
                            py: "2px",
                            borderRadius: "999px",
                            backgroundColor: "#e6ecf1",
                            color: "#0b3a57",
                            fontSize: "13px",
                            fontWeight: 500,
                          }}
                        >
                          {selectedItem.ppmp_type === "dispensed"
                            ? "Dispensed"
                            : "Not dispensed"}
                        </Box>
                      </Box>

                      <Box>
                        <Typography
                          sx={{ fontSize: "13px", color: "#4f5e6b", mb: 0.5 }}
                        >
                          Expense class
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#13222d",
                          }}
                        >
                          {selectedItem.expense_class || "MOOE"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Requesting Areas Breakdown (for Dispensed PPMP items) */}
                  {selectedItem.ppmp_type === "dispensed" && (
                    <Box
                      sx={{
                        backgroundColor: "#eef6fb",
                        border: "1px solid #cce3f2",
                        borderRadius: "8px",
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#0b3a57",
                          }}
                        >
                          Requesting Areas &amp; Quantities
                        </Typography>
                        <Chip
                          size="sm"
                          variant="soft"
                          color="primary"
                          sx={{ fontSize: "11px", fontWeight: 600 }}
                        >
                          {(selectedItem.requesting_areas || []).length}{" "}
                          {(selectedItem.requesting_areas || []).length === 1
                            ? "area"
                            : "areas"}
                        </Chip>
                      </Stack>

                      {Array.isArray(selectedItem.requesting_areas) &&
                      selectedItem.requesting_areas.length > 0 ? (
                        <Stack spacing={0.75}>
                          {selectedItem.requesting_areas.map((ra, raIdx) => (
                            <Box
                              key={`${ra.aop_application_id || ra.area_code}-${raIdx}`}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 1.5,
                                px: 1.25,
                                py: 0.75,
                                borderRadius: "6px",
                                backgroundColor: "white",
                                border: "1px solid #dde9f2",
                              }}
                            >
                              <Box sx={{ minWidth: 0 }}>
                                <Typography
                                  sx={{
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "#13222d",
                                  }}
                                >
                                  {ra.area_code}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    color: "#4f5e6b",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {ra.area_name}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                                <Typography
                                  sx={{
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "#0b3a57",
                                  }}
                                >
                                  {Number(ra.quantity || 0).toLocaleString()}{" "}
                                  {selectedItem.unit}
                                </Typography>
                                {ra.total_amount !== undefined && (
                                  <Typography
                                    sx={{ fontSize: "11px", color: "#4f5e6b" }}
                                  >
                                    {formatCurrency(ra.total_amount)}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Typography sx={{ fontSize: "12px", color: "#4f5e6b" }}>
                          No linked requesting office quantities found for this dispensed item.
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* Warning Banner */}
                  {!isSelectedDeleted && Math.abs(itemDelta) > 0.009 && (
                    <Box
                      sx={{
                        backgroundColor: "#fff3e0",
                        borderRadius: "8px",
                        px: 1.75,
                        py: 1.5,
                        color: "#5c3d00",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#5c3d00",
                          mb: 0.25,
                        }}
                      >
                        Check the cost before moving on
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: "#5c3d00",
                          lineHeight: 1.45,
                        }}
                      >
                        The revised amount is {itemDeltaPct.toFixed(1)}%{" "}
                        {itemDelta < 0 ? "lower" : "higher"} than proposed.
                        Confirm the unit cost is correct before the next item.
                      </Typography>
                    </Box>
                  )}

                  {/* Financial Impact Comparison Card */}
                  <Box
                    sx={{
                      backgroundColor: "#eef6fb",
                      borderRadius: "8px",
                      px: 2.5,
                      py: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                        alignItems: "start",
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: "14px", color: "#4f5e6b" }}>
                          Originally proposed
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "20px",
                            fontWeight: 600,
                            color: "#4f5e6b",
                            textDecoration: "line-through",
                            lineHeight: 1.4,
                          }}
                        >
                          {formatCurrency(origTotal)}
                        </Typography>
                        <Typography sx={{ fontSize: "12px", color: "#4f5e6b" }}>
                          {origQty} {selectedItem.unit} ×{" "}
                          {formatCurrency(origUnitCost)}
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: "right" }}>
                        <Typography sx={{ fontSize: "14px", color: "#4f5e6b" }}>
                          Revised total
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: "24px", sm: "28px" },
                            fontWeight: 600,
                            color: isSelectedDeleted ? "#b3261e" : "#0b3a57",
                            lineHeight: 1.25,
                          }}
                        >
                          {formatCurrency(liveTotal)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ height: "1px", backgroundColor: "#dde3e8" }} />

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography sx={{ fontSize: "14px", color: "#4f5e6b" }}>
                        {itemDelta < -0.009
                          ? "Reduction"
                          : itemDelta > 0.009
                            ? "Increase"
                            : "Difference"}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: itemDelta > 0.009 ? "#b3261e" : "#0b6aa2",
                        }}
                      >
                        {Math.abs(itemDelta) < 0.009
                          ? "₱0.00"
                          : formatSignedCurrency(itemDelta)}
                      </Typography>
                    </Stack>
                  </Box>

                  {/* Amount for Board Review */}
                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#13222d",
                        }}
                      >
                        Amount for board review
                      </Typography>
                      {hasUnsavedQtyOrCost && canEdit && (
                        <Button
                          size="sm"
                          variant="soft"
                          color="warning"
                          onClick={commitQuantityAndCost}
                          sx={{ minHeight: "26px", fontSize: "12px", py: 0 }}
                        >
                          Save changes
                        </Button>
                      )}
                    </Stack>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{ fontSize: "14px", color: "#4f5e6b", mb: 0.75 }}
                        >
                          Quantity ({selectedItem.unit})
                        </Typography>
                        <Input
                          type="number"
                          disabled={!canEdit || isSelectedDeleted}
                          value={draftQty}
                          onChange={(e) => setDraftQty(e.target.value)}
                          onBlur={commitQuantityAndCost}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              commitQuantityAndCost();
                            }
                          }}
                          slotProps={{ input: { min: 1 } }}
                          sx={{
                            height: "46px",
                            borderRadius: "8px",
                            borderColor:
                              parsedDraftQty !== origQty && !isSelectedDeleted
                                ? "#8a4b00"
                                : "#dde3e8",
                            fontSize: "14px",
                            fontWeight: parsedDraftQty !== origQty ? 600 : 400,
                          }}
                        />
                      </Box>

                      <Box>
                        <Typography
                          sx={{ fontSize: "14px", color: "#4f5e6b", mb: 0.75 }}
                        >
                          Unit Cost
                        </Typography>
                        <Input
                          type="number"
                          disabled={!canEdit || isSelectedDeleted}
                          value={draftUnitCost}
                          onChange={(e) => setDraftUnitCost(e.target.value)}
                          onBlur={commitQuantityAndCost}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              commitQuantityAndCost();
                            }
                          }}
                          startDecorator="₱"
                          slotProps={{ input: { min: 0, step: "0.01" } }}
                          sx={{
                            height: "46px",
                            borderRadius: "8px",
                            borderColor: isCostModifiedVsOriginal
                              ? "#8a4b00"
                              : "#dde3e8",
                            fontSize: "14px",
                            fontWeight: isCostModifiedVsOriginal ? 600 : 400,
                          }}
                        />
                      </Box>
                    </Box>

                    <Typography sx={{ fontSize: "14px", color: "#4f5e6b", mt: 1 }}>
                      {parsedDraftQty} {selectedItem.unit} ×{" "}
                      {formatCurrency(parsedDraftCost)} ={" "}
                      {formatCurrency(liveTotal)}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", color: "#0b6aa2", mt: 0.5 }}>
                      Updating Unit Cost syncs the price across all matching PPMP items and the master item catalog.
                    </Typography>
                  </Box>

                  {/* Purchasing & Funding */}
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#13222d",
                        mb: 1,
                      }}
                    >
                      Purchasing &amp; funding
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{ fontSize: "14px", color: "#4f5e6b", mb: 0.75 }}
                        >
                          How this will be purchased
                        </Typography>
                        <Select
                          disabled={!canEdit || isSelectedDeleted}
                          value={selectedItem.procurement_mode_id || null}
                          onChange={(e, val) =>
                            val &&
                            handleFieldSelectChange(
                              selectedItem,
                              "procurement_mode_id",
                              val,
                            )
                          }
                          sx={{
                            height: "46px",
                            borderRadius: "8px",
                            borderColor: "#dde3e8",
                            fontSize: "14px",
                          }}
                        >
                          {(libraries.procurement_modes || []).map((pm) => (
                            <Option key={pm.id} value={pm.id}>
                              {pm.name}
                            </Option>
                          ))}
                        </Select>
                      </Box>

                      <Box>
                        <Typography
                          sx={{ fontSize: "14px", color: "#4f5e6b", mb: 0.75 }}
                        >
                          Where funds come from
                        </Typography>
                        <Select
                          disabled={!canEdit || isSelectedDeleted}
                          value={selectedItem.source_of_fund_id || null}
                          onChange={(e, val) =>
                            val &&
                            handleFieldSelectChange(
                              selectedItem,
                              "source_of_fund_id",
                              val,
                            )
                          }
                          sx={{
                            height: "46px",
                            borderRadius: "8px",
                            borderColor: "#dde3e8",
                            fontSize: "14px",
                          }}
                        >
                          {(libraries.source_of_funds || []).map((sf) => (
                            <Option key={sf.id} value={sf.id}>
                              {sf.name}
                            </Option>
                          ))}
                        </Select>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ height: "1px", backgroundColor: "#e6e6e6", my: 0.5 }} />

                  {/* Latest Change + Per-Item History Button + Linked Activity */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#13222d",
                        }}
                      >
                        Latest change
                      </Typography>
                      <Button
                        size="sm"
                        variant="plain"
                        startDecorator={<HistoryIcon sx={{ fontSize: 16 }} />}
                        onClick={() => openItemHistoryModal(selectedItem)}
                        sx={{
                          color: "#0b3a57",
                          fontSize: "12px",
                          fontWeight: 600,
                          minHeight: "26px",
                          py: 0,
                        }}
                      >
                        Item history ({selectedItem.histories_count || 0})
                      </Button>
                    </Stack>

                    {latestHistory && latestChangeInfo ? (
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontSize: "13px", color: "#4f5e6b" }}>
                            {latestChangeInfo.summary}
                          </Typography>
                          <Typography sx={{ fontSize: "13px", color: "#4f5e6b" }}>
                            {latestHistory.changed_by}
                            {latestHistory.created_at
                              ? ` · ${formatTimeLabel(latestHistory.created_at)}`
                              : ""}
                          </Typography>
                        </Box>

                        <Button
                          variant="outlined"
                          disabled={!canEdit || isSubmitting}
                          onClick={() =>
                            onUndoLastChange(latestHistory.id, () =>
                              onFetchItems(buildFetchParams()),
                            )
                          }
                          sx={{
                            flexShrink: 0,
                            borderRadius: "8px",
                            borderColor: "#0b3a57",
                            color: "#0b3a57",
                            backgroundColor: "white",
                            px: 1.5,
                            py: 0.75,
                            fontSize: "13px",
                            fontWeight: 500,
                          }}
                        >
                          {latestChangeInfo.undoLabel}
                        </Button>
                      </Stack>
                    ) : (
                      <Typography sx={{ fontSize: "13px", color: "#4f5e6b" }}>
                        No board changes recorded on this item yet.
                      </Typography>
                    )}

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography sx={{ fontSize: "13px", color: "#4f5e6b" }}>
                        Activity:{" "}
                        {activityCodesLabel ||
                          `${selectedItem.activities?.length || 0} linked`}{" "}
                        · Quantity: {totalActivityQty || selectedItem.total_quantity}
                      </Typography>
                      {(selectedItem.activities?.length || 0) > 0 &&
                        canEdit &&
                        !isSelectedDeleted && (
                          <Typography
                            component="button"
                            type="button"
                            onClick={handleOpenActivityModal}
                            sx={{
                              border: "none",
                              background: "none",
                              padding: 0,
                              cursor: "pointer",
                              fontSize: "13px",
                              color: "#0b3a57",
                              textDecoration: "underline",
                            }}
                          >
                            Edit
                          </Typography>
                        )}
                    </Stack>
                  </Box>
                </Box>

                {/* Fixed Inspector Footer */}
                <Box
                  sx={{
                    flexShrink: 0,
                    borderTop: "1px solid #dde3e8",
                    px: 3,
                    py: 1.75,
                    backgroundColor: "white",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 2,
                    }}
                  >
                    {isSelectedDeleted ? (
                      <Button
                        variant="outlined"
                        disabled={!canEdit || isSubmitting || !latestHistory}
                        onClick={() =>
                          latestHistory &&
                          onUndoLastChange(latestHistory.id, () =>
                            onFetchItems(buildFetchParams()),
                          )
                        }
                        sx={{
                          height: "46px",
                          borderRadius: "8px",
                          borderColor: "#0b3a57",
                          color: "#0b3a57",
                          fontSize: "15px",
                          fontWeight: 600,
                        }}
                      >
                        Restore item
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        disabled={!canEdit || isSubmitting}
                        onClick={() => setDeleteTarget(selectedItem)}
                        sx={{
                          height: "46px",
                          borderRadius: "8px",
                          borderColor: "#b3261e",
                          color: "#b3261e",
                          backgroundColor: "white",
                          fontSize: "15px",
                          fontWeight: 600,
                          "&:hover": {
                            backgroundColor: "#fef2f2",
                            borderColor: "#b3261e",
                          },
                        }}
                      >
                        Remove item
                      </Button>
                    )}

                    <Button
                      variant="solid"
                      disabled={isNextDisabled}
                      onClick={handleNextItem}
                      sx={{
                        height: "46px",
                        borderRadius: "8px",
                        backgroundColor: "#0b3a57",
                        color: "white",
                        fontSize: "15px",
                        fontWeight: 600,
                        "&:hover": { backgroundColor: "#092e45" },
                      }}
                    >
                      Next item →
                    </Button>
                  </Box>

                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#4f5e6b",
                      textAlign: "center",
                    }}
                  >
                    Review the revised cost before continuing.
                  </Typography>
                </Box>
              </Fragment>
            )}
          </Sheet>
        </Box>
      )}

      {/* PER-ITEM HISTORY MODAL (Replaces removed Tab 3) */}
      <Modal
        open={Boolean(historyItemTarget)}
        onClose={() => setHistoryItemTarget(null)}
      >
        <ModalDialog
          sx={{
            maxWidth: 780,
            width: "95%",
            maxHeight: "85vh",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <ModalClose />
          <Typography level="title-lg" fontWeight={700} pr={4}>
            Item Change History
          </Typography>
          <Typography level="body-sm" textColor="neutral.600" mb={1}>
            <strong>{historyItemTarget?.general_description}</strong>{" "}
            {historyItemTarget?.item_code
              ? `(${historyItemTarget.item_code})`
              : ""}
          </Typography>

          {(() => {
            const liveTarget =
              items.find((it) => it.id === historyItemTarget?.id) ||
              historyItemTarget;
            if (!liveTarget) return null;
            return (
              <Box
                sx={{
                  mb: 1.5,
                  px: 1.5,
                  py: 1,
                  borderRadius: "8px",
                  backgroundColor: "#eef6fb",
                  border: "1px solid #cce3f2",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography level="body-xs" fontWeight={600} sx={{ color: "#0b3a57" }}>
                  Current value:{" "}
                  {liveTarget.is_deleted ? (
                    <span style={{ color: "#b3261e" }}>Removed (₱0.00)</span>
                  ) : (
                    <>
                      {liveTarget.total_quantity} {liveTarget.unit} ×{" "}
                      {formatCurrency(liveTarget.estimated_budget)} ={" "}
                      {formatCurrency(
                        liveTarget.deliberated_total ?? liveTarget.total_amount,
                      )}
                    </>
                  )}
                </Typography>
                <Typography level="body-xs" textColor="neutral.600">
                  Original proposed: {formatCurrency(liveTarget.original_total_amount ?? liveTarget.total_amount)}
                </Typography>
              </Box>
            );
          })()}

          <Divider sx={{ mb: 1.5 }} />

          <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", pr: 0.5 }}>
            {isLoadingHistory ? (
              <Box
                sx={{
                  py: 6,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <CircularProgress size="sm" />
                <Typography level="body-sm">Loading item history...</Typography>
              </Box>
            ) : itemHistoryEntries.length === 0 ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography level="body-sm" textColor="neutral.500">
                  No changes recorded yet for this item.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1.25}>
                {itemHistoryEntries.map((entry, entryIdx) => {
                  const badge = ACTION_BADGE_MAP[entry.action_type] || {
                    label: entry.action_type,
                    color: "neutral",
                  };
                  const prev = entry.previous_values || {};
                  const next = entry.new_values || {};
                  const isDeleteAction = entry.action_type === "deleted";
                  const liveTarget =
                    items.find((it) => it.id === historyItemTarget?.id) ||
                    historyItemTarget;
                  const matchesCurrentState =
                    Boolean(liveTarget) &&
                    Boolean(prev.is_deleted) === Boolean(liveTarget.is_deleted) &&
                    Number(prev.total_quantity ?? 0) ===
                      Number(liveTarget.total_quantity ?? 0) &&
                    Math.abs(
                      Number(prev.estimated_budget ?? 0) -
                        Number(liveTarget.estimated_budget ?? 0),
                    ) <= 0.009 &&
                    Number(prev.procurement_mode_id ?? 0) ===
                      Number(liveTarget.procurement_mode_id ?? 0) &&
                    Number(prev.source_of_fund_id ?? 0) ===
                      Number(liveTarget.source_of_fund_id ?? 0);

                  const revertButtonLabel = isDeleteAction
                    ? "Restore item"
                    : entry.action_type === "reverted"
                      ? `Undo revert (back to ${formatCurrency(prev.estimated_budget)})`
                      : `Revert to ${formatCurrency(prev.estimated_budget)}`;

                  const cleanRemarks = entry.remarks
                    ? entry.remarks.replace(
                        /Reverted change from history #\d+/i,
                        "Undid earlier change back to previous value",
                      )
                    : "";

                  return (
                    <Sheet
                      key={entry.id}
                      variant="outlined"
                      sx={{
                        p: 1.75,
                        borderRadius: "8px",
                        borderColor: entryIdx === 0 ? "#b8c9d6" : "#dde3e8",
                        backgroundColor: isDeleteAction ? "#fef2f2" : "white",
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        spacing={1}
                        mb={1}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          flexWrap="wrap"
                        >
                          <Chip size="sm" variant="soft" color={badge.color}>
                            {badge.label}
                          </Chip>
                          {entryIdx === 0 && (
                            <Chip size="sm" variant="outlined" color="primary">
                              Latest
                            </Chip>
                          )}
                          <Typography level="body-xs" textColor="neutral.600">
                            by <strong>{entry.changed_by?.name || "System"}</strong>{" "}
                            · {formatDateTimeLabel(entry.created_at)}
                          </Typography>
                        </Stack>

                        {canEdit &&
                          entry.previous_values &&
                          (matchesCurrentState ? (
                            <Typography
                              level="body-xs"
                              sx={{
                                color: "#15803d",
                                fontWeight: 600,
                                px: 1,
                                py: 0.25,
                                borderRadius: "6px",
                                backgroundColor: "#f0fdf4",
                              }}
                            >
                              Current active values match BEFORE
                            </Typography>
                          ) : (
                            <Button
                              size="sm"
                              variant="outlined"
                              startDecorator={<RestoreIcon fontSize="small" />}
                              disabled={isSubmitting}
                              onClick={() =>
                                onUndoLastChange(entry.id, () => {
                                  onFetchItems(buildFetchParams());
                                  onFetchItemHistory(historyItemTarget.id);
                                })
                              }
                              sx={{
                                borderColor: "#0b3a57",
                                color: "#0b3a57",
                                borderRadius: "8px",
                              }}
                            >
                              {revertButtonLabel}
                            </Button>
                          ))}
                      </Stack>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                          gap: 1.5,
                          backgroundColor: "#f4f6f8",
                          borderRadius: "6px",
                          p: 1.25,
                        }}
                      >
                        <Box>
                          <Typography
                            level="body-xs"
                            fontWeight={700}
                            textColor="neutral.500"
                          >
                            BEFORE
                          </Typography>
                          <Typography level="body-sm">
                            {prev.total_quantity ?? "--"}{" "}
                            {historyItemTarget?.unit} ×{" "}
                            {formatCurrency(prev.estimated_budget)} ={" "}
                            <strong>{formatCurrency(prev.total_amount)}</strong>
                          </Typography>
                          {prev.procurement_mode_name && (
                            <Typography level="body-xs" textColor="neutral.600">
                              Mode: {prev.procurement_mode_name} · Fund:{" "}
                              {prev.source_of_fund_name || "N/A"}
                            </Typography>
                          )}
                        </Box>

                        <Box>
                          <Typography
                            level="body-xs"
                            fontWeight={700}
                            textColor="neutral.500"
                          >
                            AFTER
                          </Typography>
                          <Typography level="body-sm">
                            {next.is_deleted ? (
                              <strong style={{ color: "#b3261e" }}>
                                Removed (₱0.00)
                              </strong>
                            ) : (
                              <>
                                {next.total_quantity ?? "--"}{" "}
                                {historyItemTarget?.unit} ×{" "}
                                {formatCurrency(next.estimated_budget)} ={" "}
                                <strong>
                                  {formatCurrency(next.total_amount)}
                                </strong>
                              </>
                            )}
                          </Typography>
                          {!next.is_deleted && next.procurement_mode_name && (
                            <Typography level="body-xs" textColor="neutral.600">
                              Mode: {next.procurement_mode_name} · Fund:{" "}
                              {next.source_of_fund_name || "N/A"}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {cleanRemarks && (
                        <Typography
                          level="body-xs"
                          textColor="neutral.600"
                          mt={0.75}
                        >
                          Note: {cleanRemarks}
                        </Typography>
                      )}
                    </Sheet>
                  );
                })}
              </Stack>
            )}
          </Box>
        </ModalDialog>
      </Modal>

      {/* LINKED ACTIVITY QUANTITY BREAKDOWN MODAL */}
      <Modal
        open={activityModalOpen}
        onClose={() => setActivityModalOpen(false)}
      >
        <ModalDialog sx={{ maxWidth: 540, width: "100%", borderRadius: "12px" }}>
          <ModalClose />
          <Typography level="title-md" fontWeight={700} mb={0.5}>
            Linked AOP Activity Breakdown
          </Typography>
          <Typography level="body-xs" textColor="neutral.500" mb={1.5}>
            Adjust quantities per linked AOP activity. Saving automatically
            updates the PPMP total quantity and AOP resource costs.
          </Typography>

          <Stack spacing={1.25} mb={2} maxHeight="320px" overflow="auto">
            {(selectedItem?.activities || []).map((act) => (
              <Sheet
                key={act.activity_id}
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography level="body-sm" fontWeight={700} color="primary">
                    {act.activity_code}
                  </Typography>
                  <Typography level="body-xs" textColor="neutral.600">
                    {act.activity_name}
                  </Typography>
                </Box>
                <Input
                  size="sm"
                  type="number"
                  value={
                    activityQtyDrafts[act.activity_id] ?? String(act.quantity)
                  }
                  onChange={(e) =>
                    setActivityQtyDrafts((prev) => ({
                      ...prev,
                      [act.activity_id]: e.target.value,
                    }))
                  }
                  slotProps={{ input: { min: 0 } }}
                  sx={{ width: "90px", flexShrink: 0 }}
                />
              </Sheet>
            ))}
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setActivityModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              sx={{ backgroundColor: "#0b3a57" }}
              loading={isSubmitting}
              onClick={handleSaveActivityBreakdown}
            >
              Save Activity Quantities
            </Button>
          </Stack>
        </ModalDialog>
      </Modal>

      {/* SOFT-DELETE CONFIRMATION MODAL */}
      <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <ModalDialog sx={{ maxWidth: 460, width: "100%", borderRadius: "12px" }}>
          <ModalClose />
          <Typography
            level="title-lg"
            fontWeight={700}
            sx={{ color: "#b3261e" }}
            mb={1}
          >
            Remove PPMP Item from Deliberation
          </Typography>
          <Typography level="body-sm" mb={1.5}>
            Are you sure you want to remove{" "}
            <strong>{deleteTarget?.general_description}</strong>? This records a
            full snapshot in the item&apos;s history so it can be restored
            anytime, and recalculates the Area&apos;s AOP &amp; PPMP totals.
          </Typography>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Reason / Deliberation Remarks</FormLabel>
            <Textarea
              minRows={2}
              placeholder="e.g., Deferred to next FY per Budget Officer deliberation..."
              value={deleteRemarks}
              onChange={(e) => setDeleteRemarks(e.target.value)}
            />
          </FormControl>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="danger"
              loading={isSubmitting}
              onClick={handleConfirmDelete}
            >
              Confirm Remove Item
            </Button>
          </Stack>
        </ModalDialog>
      </Modal>

      {/* BUDGET OFFICER CONFIRMATION PIN MODAL */}
      <Modal open={mccModalOpen} onClose={() => setMccModalOpen(false)}>
        <ModalDialog sx={{ maxWidth: 420, width: "100%", borderRadius: "12px" }}>
          <ModalClose />
          <Typography level="title-lg" fontWeight={700} mb={0.5}>
            Budget Officer Deliberation Confirmation
          </Typography>
          <Typography level="body-xs" textColor="neutral.500" mb={2}>
            Confirming approved PPMP items for{" "}
            <strong>{selectedAreaObj?.area_name}</strong>. Enter your 6-digit
            authorization PIN to record the Budget Officer&apos;s sign-off.
          </Typography>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Budget Officer Authorization PIN (6 digits)</FormLabel>
            <Input
              type="password"
              placeholder="Enter 6-digit PIN"
              value={mccPin}
              onChange={(e) => setMccPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmitMccConfirm()}
            />
          </FormControl>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setMccModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="success"
              loading={isSubmitting}
              disabled={!mccPin}
              onClick={handleSubmitMccConfirm}
            >
              Confirm as Budget Officer
            </Button>
          </Stack>
        </ModalDialog>
      </Modal>

      {/* END USER / AREA REPRESENTATIVE CONFIRMATION PIN MODAL */}
      <Modal open={repModalOpen} onClose={() => setRepModalOpen(false)}>
        <ModalDialog sx={{ maxWidth: 460, width: "100%", borderRadius: "12px" }}>
          <ModalClose />
          <Typography level="title-lg" fontWeight={700} mb={0.5}>
            End-User Representative Sign-off
          </Typography>
          <Typography level="body-xs" textColor="neutral.500" mb={2}>
            Select the End-User representative physically present during the{" "}
            <strong>{selectedAreaObj?.area_code}</strong> deliberation session
            and have them enter their personal 6-digit authorization PIN.
          </Typography>
          <Stack spacing={1.5} mb={2}>
            <FormControl required>
              <FormLabel>Present Area Representative</FormLabel>
              <Select
                placeholder="Select employee from Area"
                value={selectedRepUserId}
                onChange={(e, val) => setSelectedRepUserId(val)}
              >
                {areaRepresentatives.map((rep) => (
                  <Option key={rep.id} value={rep.id}>
                    {rep.name} {rep.position ? `(${rep.position})` : ""}
                  </Option>
                ))}
              </Select>
            </FormControl>

            <FormControl required>
              <FormLabel>Representative Authorization PIN (6 digits)</FormLabel>
              <Input
                type="password"
                placeholder="Representative enters PIN"
                value={repPin}
                onChange={(e) => setRepPin(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitRepConfirm()}
              />
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setRepModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="success"
              loading={isSubmitting}
              disabled={!selectedRepUserId || !repPin}
              onClick={handleSubmitRepConfirm}
            >
              Confirm Area Concurrence
            </Button>
          </Stack>
        </ModalDialog>
      </Modal>
    </Box>
  );
}

export default DeliberationItemsTab;
