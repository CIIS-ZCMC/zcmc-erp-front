import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Input,
  Option,
  Select,
  Sheet,
  Stack,
  Table,
  Tooltip,
  Typography,
} from "@mui/joy";
import {
  RestoreFromTrash as RestoreIcon,
  Search as SearchIcon,
  SettingsBackupRestore as RevertIcon,
} from "@mui/icons-material";
import moment from "moment";
import ServerPaginationComponent from "@Components/ServerPaginationComponent";
import ButtonComponent from "@Components/Common/ButtonComponent";

const ACTION_BADGE_MAP = {
  price_change: { label: "Price Change", color: "warning" },
  quantity_change: { label: "Quantity Change", color: "primary" },
  procurement_mode_change: { label: "Procurement Mode", color: "neutral" },
  source_of_fund_change: { label: "Source of Fund", color: "neutral" },
  item_multiple_update: { label: "Multiple Fields Updated", color: "warning" },
  deleted: { label: "Removed / Deleted", color: "danger" },
  restored: { label: "Restored Item", color: "success" },
  reverted: { label: "Reverted Change", color: "success" },
};

const formatCurrency = (val) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(val || 0));

function DeliberationHistoryTab({
  areas = [],
  history = [],
  historyPagination = {},
  userCapabilities = {},
  isLoadingHistory = false,
  isSubmitting = false,
  selectedAopId,
  setSelectedAopId,
  onFetchHistory,
  onRestoreOrRevert,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(20);

  const canEdit = Boolean(userCapabilities?.can_edit_items);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedAopId, actionFilter, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFetchHistory({
        aop_application_id: selectedAopId || undefined,
        action_type: actionFilter || undefined,
        search: searchQuery || undefined,
        page: currentPage,
        per_page: rowsPerPage,
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [selectedAopId, actionFilter, searchQuery, currentPage, rowsPerPage]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedAopId(null);
    setActionFilter(null);
  };

  const renderDiffSummary = (entry) => {
    const prev = entry.previous_values || {};
    const next = entry.new_values || {};

    if (entry.action_type === "deleted") {
      return (
        <Stack spacing={0.25}>
          <Typography level="body-xs" color="danger" fontWeight={700}>
            Removed from PPMP & AOP (Qty: {prev.total_quantity} {entry.item_unit}{" "}
            @ {formatCurrency(prev.estimated_budget)})
          </Typography>
          <Typography level="body-xs" textColor="neutral.500">
            Deducted {formatCurrency(prev.total_amount)} from AOP & PPMP totals
          </Typography>
        </Stack>
      );
    }

    if (entry.action_type === "restored") {
      return (
        <Typography level="body-xs" color="success" fontWeight={700}>
          Restored Item: {next.total_quantity} {entry.item_unit} @{" "}
          {formatCurrency(next.estimated_budget)} (
          {formatCurrency(next.total_amount)})
        </Typography>
      );
    }

    const parts = [];
    if (
      prev.total_quantity !== undefined &&
      next.total_quantity !== undefined &&
      Number(prev.total_quantity) !== Number(next.total_quantity)
    ) {
      parts.push(
        `Qty: ${prev.total_quantity} → ${next.total_quantity} ${entry.item_unit}`,
      );
    }
    if (
      prev.estimated_budget !== undefined &&
      next.estimated_budget !== undefined &&
      Math.abs(Number(prev.estimated_budget) - Number(next.estimated_budget)) >
        0.001
    ) {
      parts.push(
        `Unit Price: ${formatCurrency(prev.estimated_budget)} → ${formatCurrency(next.estimated_budget)}`,
      );
    }
    if (
      prev.procurement_mode_name !== next.procurement_mode_name &&
      (prev.procurement_mode_name || next.procurement_mode_name)
    ) {
      parts.push(
        `Mode: ${prev.procurement_mode_name || "None"} → ${next.procurement_mode_name || "None"}`,
      );
    }
    if (
      prev.source_of_fund_name !== next.source_of_fund_name &&
      (prev.source_of_fund_name || next.source_of_fund_name)
    ) {
      parts.push(
        `Fund: ${prev.source_of_fund_name || "None"} → ${next.source_of_fund_name || "None"}`,
      );
    }

    return (
      <Stack spacing={0.25}>
        <Typography level="body-xs" fontWeight={600} textColor="neutral.800">
          {parts.length > 0 ? parts.join(" | ") : "Item values updated"}
        </Typography>
        <Typography level="body-xs" textColor="neutral.500">
          Item Total: {formatCurrency(prev.total_amount)} →{" "}
          <b>{formatCurrency(next.total_amount)}</b>
        </Typography>
      </Stack>
    );
  };

  return (
    <Box>
      {/* FILTER HEADER */}
      <Sheet
        variant="outlined"
        sx={{
          borderRadius: "10px",
          p: 2,
          mb: 2.5,
          backgroundColor: "white",
        }}
      >
        <Stack spacing={0.5} mb={2}>
          <Typography level="title-md" fontWeight={700}>
            PPMP Item Deliberation History (`ppmp_item_histories`)
          </Typography>
          <Typography level="body-xs" textColor="neutral.500">
            Complete audit log of price changes, quantity adjustments, and soft
            item removals ("deletions"). Removed items are never hard-deleted
            and can be restored with one click.
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1.5}
          alignItems="flex-end"
          flexWrap="wrap"
          useFlexGap
        >
          <Stack spacing={0.5} sx={{ minWidth: "220px", flexGrow: 1 }}>
            <Typography level="body-xs" fontWeight={600} textColor="neutral.600">
              Search Item
            </Typography>
            <Input
              size="sm"
              placeholder="Search by item description or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startDecorator={<SearchIcon sx={{ color: "neutral.400" }} />}
            />
          </Stack>

          <Stack spacing={0.5} sx={{ minWidth: "220px", flexGrow: 1 }}>
            <Typography level="body-xs" fontWeight={600} textColor="neutral.600">
              Area / Office
            </Typography>
            <Select
              size="sm"
              value={selectedAopId}
              placeholder="All Areas"
              onChange={(e, val) => setSelectedAopId(val)}
            >
              <Option value={null}>All Areas</Option>
              {areas.map((a) => (
                <Option key={a.aop_application_id} value={a.aop_application_id}>
                  [{a.area_code}] {a.area_name}
                </Option>
              ))}
            </Select>
          </Stack>

          <Stack spacing={0.5} sx={{ minWidth: "200px", flexGrow: 1 }}>
            <Typography level="body-xs" fontWeight={600} textColor="neutral.600">
              Change / Action Type
            </Typography>
            <Select
              size="sm"
              value={actionFilter}
              placeholder="All Actions"
              onChange={(e, val) => setActionFilter(val)}
            >
              <Option value={null}>All Actions</Option>
              <Option value="price_change">Price Changes</Option>
              <Option value="quantity_change">Quantity Changes</Option>
              <Option value="deleted">Deleted / Removed Items</Option>
              <Option value="restored">Restored Items</Option>
              <Option value="reverted">Reverted Changes</Option>
              <Option value="procurement_mode_change">
                Procurement Mode Changes
              </Option>
              <Option value="source_of_fund_change">
                Source of Fund Changes
              </Option>
            </Select>
          </Stack>

          <ButtonComponent
            size="sm"
            color="neutral"
            variant="outlined"
            label="Clear Filters"
            onClick={clearFilters}
            disabled={!searchQuery && !selectedAopId && !actionFilter}
          />
        </Stack>
      </Sheet>

      {/* HISTORY TABLE */}
      <Sheet
        variant="outlined"
        sx={{
          borderRadius: 8,
          overflow: "auto",
          boxShadow: "sm",
          mb: 3,
          backgroundColor: "white",
        }}
      >
        <Table hoverRow sx={{ fontSize: "13px", minWidth: "1150px" }}>
          <thead>
            <tr>
              <th style={{ width: "155px", backgroundColor: "#F1F5F9" }}>
                Timestamp
              </th>
              <th style={{ width: "120px", backgroundColor: "#F1F5F9" }}>
                Area
              </th>
              <th style={{ width: "260px", backgroundColor: "#F1F5F9" }}>
                PPMP Item
              </th>
              <th style={{ width: "150px", backgroundColor: "#F1F5F9" }}>
                Action Type
              </th>
              <th style={{ width: "310px", backgroundColor: "#F1F5F9" }}>
                Before → After Details
              </th>
              <th style={{ width: "160px", backgroundColor: "#F1F5F9" }}>
                Changed By & Remarks
              </th>
              <th
                style={{
                  width: "135px",
                  textAlign: "right",
                  backgroundColor: "#F1F5F9",
                }}
              >
                Restore / Revert
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoadingHistory ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "36px" }}>
                  <Typography level="body-sm" textColor="neutral.500">
                    Loading PPMP item history...
                  </Typography>
                </td>
              </tr>
            ) : history.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "36px" }}>
                  <Typography level="body-sm" textColor="neutral.500">
                    No PPMP item history entries recorded yet for the selected
                    filters.
                  </Typography>
                </td>
              </tr>
            ) : (
              history.map((entry) => {
                const badge =
                  ACTION_BADGE_MAP[entry.action_type] || {
                    label: entry.action_type,
                    color: "neutral",
                  };

                return (
                  <tr key={entry.id}>
                    <td>
                      <Typography level="body-xs" fontWeight={600}>
                        {moment(entry.created_at).format("MMM D, YYYY")}
                      </Typography>
                      <Typography level="body-xs" textColor="neutral.500">
                        {moment(entry.created_at).format("h:mm:ss A")}
                      </Typography>
                    </td>

                    <td>
                      <Stack spacing={0.25}>
                        <Chip size="sm" variant="soft" color="primary">
                          {entry.area_code}
                        </Chip>
                        <Typography level="body-xs" textColor="neutral.500">
                          {entry.area_name}
                        </Typography>
                      </Stack>
                    </td>

                    <td>
                      <Stack spacing={0.25}>
                        <Typography level="body-sm" fontWeight={600}>
                          {entry.item_name}
                        </Typography>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <Typography level="body-xs" textColor="neutral.500">
                            {entry.item_code}
                          </Typography>
                          {entry.is_item_currently_deleted && (
                            <Chip size="sm" variant="solid" color="danger">
                              Currently Removed
                            </Chip>
                          )}
                        </Stack>
                      </Stack>
                    </td>

                    <td>
                      <Chip size="sm" variant="soft" color={badge.color}>
                        {badge.label}
                      </Chip>
                    </td>

                    <td>{renderDiffSummary(entry)}</td>

                    <td>
                      <Typography level="body-xs" fontWeight={600}>
                        {entry.changed_by?.name || "System"}
                      </Typography>
                      {entry.remarks && (
                        <Typography level="body-xs" textColor="neutral.500">
                          "{entry.remarks}"
                        </Typography>
                      )}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      {canEdit &&
                        entry.action_type !== "restored" &&
                        entry.action_type !== "reverted" && (
                          <Tooltip
                            title={
                              entry.action_type === "deleted"
                                ? "Restore this removed item back into the PPMP and AOP"
                                : "Revert this item back to its values prior to this change"
                            }
                          >
                            <Button
                              size="sm"
                              variant={
                                entry.action_type === "deleted"
                                  ? "solid"
                                  : "outlined"
                              }
                              color={
                                entry.action_type === "deleted"
                                  ? "success"
                                  : "primary"
                              }
                              loading={isSubmitting}
                              startDecorator={
                                entry.action_type === "deleted" ? (
                                  <RestoreIcon fontSize="small" />
                                ) : (
                                  <RevertIcon fontSize="small" />
                                )
                              }
                              onClick={() => onRestoreOrRevert(entry.id)}
                            >
                              {entry.action_type === "deleted"
                                ? "Restore"
                                : "Revert"}
                            </Button>
                          </Tooltip>
                        )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </Sheet>

      <ServerPaginationComponent
        page={currentPage}
        setPage={setCurrentPage}
        perPage={rowsPerPage}
        pagination={{
          last_page: historyPagination.last_page || 1,
          total: historyPagination.total || 0,
        }}
      />
    </Box>
  );
}

export default DeliberationHistoryTab;

