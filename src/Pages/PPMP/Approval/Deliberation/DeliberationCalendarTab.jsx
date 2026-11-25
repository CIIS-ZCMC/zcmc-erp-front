import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
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
  Switch,
  Table,
  Textarea,
  Tooltip,
  Typography,
} from "@mui/joy";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  EditCalendar as EditCalendarIcon,
  EventBusy as CancelIcon,
  NotificationsActive as CallBackIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import moment from "moment";
import PageTitle from "@Components/Common/PageTitle";

const formatCurrency = (val) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(val || 0));

const formatSessionTimeLabel = (session) => {
  if (!session?.scheduled_date) return { primary: "Not scheduled", secondary: null };
  const dateMom = moment(session.scheduled_date, "YYYY-MM-DD");
  const timeFormatted = session.start_time
    ? moment(session.start_time, ["HH:mm:ss", "HH:mm"]).format("h:mm A")
    : "";
  const isToday = dateMom.isSame(moment(), "day");
  const primary = isToday
    ? `Today${timeFormatted ? `, ${timeFormatted}` : ""}`
    : `${dateMom.format("MMM D")}${timeFormatted ? `, ${timeFormatted}` : ""}`;
  const secondary = dateMom.format("ddd, MMM D");
  return { primary, secondary };
};

function DeliberationCalendarTab({
  year,
  yearOptions = [],
  onChangeYear,
  fiscalBudget = null,
  metrics = {},
  areas = [],
  sessions = [],
  userCapabilities = {},
  isSubmitting = false,
  onOpenBudgetModal,
  onTogglePermission,
  onFinalizeDeliberation,
  onScheduleSession,
  onUpdateSession,
  onCancelSession,
  onOpenAreaDeliberation,
}) {
  const [currentMonth, setCurrentMonth] = useState(() => moment());
  const [selectedDateStr, setSelectedDateStr] = useState(() =>
    moment().format("YYYY-MM-DD"),
  );
  const [permissionsOpen, setPermissionsOpen] = useState(false);

  // Schedule / Edit Session Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [formAopId, setFormAopId] = useState(null);
  const [formDate, setFormDate] = useState(() => moment().format("YYYY-MM-DD"));
  const [formStartTime, setFormStartTime] = useState("09:00");
  const [formEndTime, setFormEndTime] = useState("10:30");
  const [formVenue, setFormVenue] = useState("MCC Conference Room");
  const [formRemarks, setFormRemarks] = useState("");

  // Map active sessions by date (YYYY-MM-DD)
  const sessionsByDate = useMemo(() => {
    const map = {};
    sessions.forEach((s) => {
      if (!s.scheduled_date || s.status === "cancelled") return;
      if (!map[s.scheduled_date]) map[s.scheduled_date] = [];
      map[s.scheduled_date].push(s);
    });
    return map;
  }, [sessions]);

  // Conflict warning inside Schedule Modal
  const overlappingSessions = useMemo(() => {
    if (!formDate || !formStartTime || !formEndTime) return [];
    const daySessions = sessionsByDate[formDate] || [];
    return daySessions.filter((s) => {
      if (editingSession && s.id === editingSession.id) return false;
      if (formAopId && Number(s.aop_application_id) === Number(formAopId))
        return false;
      return !(formEndTime <= s.start_time || formStartTime >= s.end_time);
    });
  }, [
    formDate,
    formStartTime,
    formEndTime,
    sessionsByDate,
    editingSession,
    formAopId,
  ]);

  // Calendar day grid for currentMonth
  const calendarDays = useMemo(() => {
    const startOfMonth = currentMonth.clone().startOf("month");
    const endOfMonth = currentMonth.clone().endOf("month");
    const startGrid = startOfMonth.clone().startOf("week");
    const endGrid = endOfMonth.clone().endOf("week");

    const days = [];
    const day = startGrid.clone();
    while (day.isSameOrBefore(endGrid, "day")) {
      days.push(day.clone());
      day.add(1, "day");
    }
    return days;
  }, [currentMonth]);

  const selectedDaySessions = useMemo(() => {
    const list = sessionsByDate[selectedDateStr] || [];
    return [...list].sort((a, b) =>
      String(a.start_time || "").localeCompare(String(b.start_time || "")),
    );
  }, [sessionsByDate, selectedDateStr]);

  const unscheduledAreas = useMemo(
    () => areas.filter((a) => !a.session),
    [areas],
  );

  const openScheduleModalForArea = (area) => {
    const existing = area?.session || null;
    setEditingSession(existing);
    setFormAopId(area?.aop_application_id ?? null);
    setFormDate(
      existing?.scheduled_date || selectedDateStr || moment().format("YYYY-MM-DD"),
    );
    setFormStartTime(existing?.start_time?.slice(0, 5) || "09:00");
    setFormEndTime(existing?.end_time?.slice(0, 5) || "10:30");
    setFormVenue(existing?.venue || "MCC Conference Room");
    setFormRemarks(existing?.remarks || "");
    setModalOpen(true);
  };

  const openScheduleModalForDate = (dateStr) => {
    setEditingSession(null);
    setFormAopId(
      unscheduledAreas[0]?.aop_application_id ??
        areas[0]?.aop_application_id ??
        null,
    );
    setFormDate(dateStr);
    setFormStartTime("09:00");
    setFormEndTime("10:30");
    setFormVenue("MCC Conference Room");
    setFormRemarks("");
    setModalOpen(true);
  };

  const handleSaveSession = () => {
    if (!formAopId || !formDate || !formStartTime || !formEndTime) return;
    if (editingSession) {
      onUpdateSession(
        editingSession.id,
        {
          scheduled_date: formDate,
          start_time: formStartTime,
          end_time: formEndTime,
          venue: formVenue,
          remarks: formRemarks,
        },
        () => setModalOpen(false),
      );
    } else {
      onScheduleSession(
        {
          aop_application_id: formAopId,
          scheduled_date: formDate,
          start_time: formStartTime,
          end_time: formEndTime,
          venue: formVenue,
          remarks: formRemarks,
        },
        () => setModalOpen(false),
      );
    }
  };

  const handleCallBackForAdjustment = (session) => {
    if (!session) return;
    onUpdateSession(session.id, {
      status: "reopened",
      remarks:
        "Called back for PPMP budget adjustment to fit Fiscal Year ceiling",
    });
  };

  const isFinalized = Boolean(fiscalBudget?.is_deliberation_finalized);
  const totalBudgetCeiling = Number(metrics?.total_budget_ceiling || 0);
  const hospitalProposed = Number(metrics?.hospital_proposed_ppmp || 0);
  const hospitalDeliberated = Number(metrics?.hospital_total_ppmp || 0);
  const totalItemsCount = Number(metrics?.total_items_count || 0);
  const editedItemsCount = Number(metrics?.edited_items_count || 0);
  const isOverBudget = Boolean(metrics?.is_over_budget);
  const excessAmount = Number(metrics?.excess_amount || 0);
  const remainingBudget = Number(metrics?.remaining_budget || 0);
  const confirmedAreasCount = Number(metrics?.confirmed_areas_count || 0);
  const totalAreasCount = Number(metrics?.total_areas_count || areas.length || 0);

  const canCompleteDeliberation =
    totalAreasCount > 0 &&
    confirmedAreasCount >= totalAreasCount &&
    !isOverBudget &&
    totalBudgetCeiling > 0;

  return (
    <Box
      sx={{
        fontFamily: '"Poppins", sans-serif',
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* 1. HEADER BAR — matches Manage AOP and PPMP (PageTitle + top-right Notifications) */}
      <PageTitle
        title="Budget deliberation"
        description="Schedule each office, then open its session in the conference room."
        withArrowBack={false}
      />

      {/* Action Controls Row cleanly below PageTitle */}
      <Stack
        direction="row"
        spacing={1.25}
        alignItems="center"
        justifyContent="flex-end"
        flexWrap="wrap"
      >
        <Typography
          sx={{
            fontFamily: '"Poppins", sans-serif',
            fontSize: "14px",
            color: "#4f5e6b",
          }}
        >
          Fiscal year
        </Typography>
        <Select
          value={year}
          onChange={(e, val) => val && onChangeYear(Number(val))}
          sx={{
            width: "112px",
            height: "40px",
            borderRadius: "8px",
            borderColor: "#b8c3cc",
            backgroundColor: "white",
            fontFamily: '"Poppins", sans-serif',
            fontSize: "14px",
            color: "#13222d",
          }}
        >
          {yearOptions.map((y) => (
            <Option key={y} value={y}>
              FY {y}
            </Option>
          ))}
        </Select>

        {userCapabilities.can_set_budget && (
          <Button
            variant="outlined"
            onClick={onOpenBudgetModal}
            sx={{
              height: "40px",
              px: 2,
              borderRadius: "8px",
              borderColor: "#0b3a57",
              backgroundColor: "white",
              color: "#0b3a57",
              fontFamily: '"Poppins", sans-serif',
              fontSize: "14px",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "#eef6fb",
                borderColor: "#0b3a57",
              },
            }}
          >
            Edit FY budget
          </Button>
        )}

        {userCapabilities.can_toggle_permissions && (
          <Tooltip title="Manage deliberator & Budget Officer edit permissions">
            <IconButton
              variant="outlined"
              onClick={() => setPermissionsOpen(true)}
              sx={{
                height: "40px",
                width: "40px",
                borderRadius: "8px",
                borderColor: "#b8c3cc",
                backgroundColor: "white",
                color: "#0b3a57",
              }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      {/* 2. 4-COLUMN BUDGET SUMMARY CARD */}
      <Sheet
        variant="outlined"
        sx={{
          backgroundColor: "white",
          borderColor: "#dde3e8",
          borderRadius: "10px",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "1fr 1fr 1.15fr 1.25fr",
          },
        }}
      >
        {/* Col 1: Total Annual Budget / Proposed */}
        <Box sx={{ px: 3, py: 2.25 }}>
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: "14px",
              color: "#4f5e6b",
            }}
          >
            Total Annual Budget
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: { xs: "22px", xl: "28px" },
              fontWeight: 500,
              color: "#4f5e6b",
              lineHeight: 1.4,
            }}
          >
            {totalBudgetCeiling > 0
              ? formatCurrency(totalBudgetCeiling)
              : formatCurrency(hospitalProposed)}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: "13px",
              color: "#4f5e6b",
            }}
          >
            {totalItemsCount.toLocaleString()} items as submitted
          </Typography>
        </Box>

        {/* Col 2: Deliberated so far */}
        <Box
          sx={{
            px: 3,
            py: 2.25,
            borderLeft: { sm: "1px solid #dde3e8" },
            borderTop: { xs: "1px solid #dde3e8", sm: "none" },
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: "14px",
              color: "#4f5e6b",
            }}
          >
            Deliberated so far
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: { xs: "22px", xl: "28px" },
              fontWeight: 600,
              color: "#13222d",
              lineHeight: 1.4,
            }}
          >
            {formatCurrency(hospitalDeliberated)}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: "13px",
              color: "#4f5e6b",
            }}
          >
            {editedItemsCount.toLocaleString()} of{" "}
            {totalItemsCount.toLocaleString()} items changed ·{" "}
            <Box
              component="span"
              sx={{
                fontWeight: 600,
                color:
                  totalAreasCount > 0 && confirmedAreasCount >= totalAreasCount
                    ? "#15803d"
                    : "#0b3a57",
              }}
            >
              {confirmedAreasCount} of {totalAreasCount} areas deliberated
            </Box>
          </Typography>
        </Box>

        {/* Col 3: FY Budget Status (All Offices) */}
        <Box
          sx={{
            px: 3,
            py: 2.25,
            borderLeft: {
              lg: isOverBudget
                ? "1px solid #f1c9c4"
                : totalBudgetCeiling > 0
                  ? "1px solid #bbf7d0"
                  : "1px solid #dde3e8",
            },
            borderTop: { xs: "1px solid #dde3e8", lg: "none" },
            backgroundColor: isOverBudget
              ? "#fceeec"
              : totalBudgetCeiling > 0
                ? "#f0fdf4"
                : "#f8fafc",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: "14px",
              color: isOverBudget
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
              fontSize: { xs: "22px", xl: "28px" },
              fontWeight: 600,
              color: isOverBudget
                ? "#b3261e"
                : totalBudgetCeiling > 0
                  ? "#15803d"
                  : "#13222d",
              lineHeight: 1.4,
            }}
          >
            {totalBudgetCeiling <= 0
              ? "Budget not set"
              : isOverBudget
                ? `Over by ${formatCurrency(excessAmount)}`
                : `Remaining ${formatCurrency(remainingBudget)}`}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: "13px",
              color: isOverBudget
                ? "#7a1d17"
                : totalBudgetCeiling > 0
                  ? "#166534"
                  : "#4f5e6b",
            }}
          >
            {totalBudgetCeiling > 0
              ? `${formatCurrency(hospitalDeliberated)} planned against a ${formatCurrency(totalBudgetCeiling)} budget`
              : `${formatCurrency(hospitalDeliberated)} total submitted PPMPs`}
          </Typography>
        </Box>

        {/* Col 4: Complete FY Deliberation Action */}
        <Box
          sx={{
            px: 3,
            py: 2.25,
            borderLeft: { sm: "1px solid #dde3e8" },
            borderTop: { xs: "1px solid #dde3e8", lg: "none" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Button
            variant="solid"
            disabled={
              isSubmitting ||
              (!userCapabilities.is_mcc && !userCapabilities.is_budget_officer) ||
              (!isFinalized && !canCompleteDeliberation)
            }
            onClick={() => onFinalizeDeliberation(isFinalized)}
            sx={{
              height: "44px",
              px: 2.25,
              borderRadius: "8px",
              alignSelf: "flex-start",
              fontFamily: '"Poppins", sans-serif',
              fontSize: "14px",
              fontWeight: 500,
              backgroundColor: isFinalized
                ? "#4f5e6b"
                : canCompleteDeliberation
                  ? "#0b3a57"
                  : "#dde3e8",
              color:
                isFinalized || canCompleteDeliberation ? "white" : "#4f5e6b",
              "&.Mui-disabled": {
                backgroundColor: "#dde3e8",
                color: "#4f5e6b",
              },
            }}
          >
            {isFinalized
              ? "Re-open FY deliberation"
              : "Complete FY deliberation"}
          </Button>
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: "13px",
              color: "#4f5e6b",
              lineHeight: 1.45,
            }}
          >
            {isFinalized
              ? `Finalized by ${fiscalBudget?.finalized_by || "Budget Officer"}. ${confirmedAreasCount} of ${totalAreasCount} areas deliberated .`
              : `Available when all areas are deliberated (confirmed by both Budget Officer & End User) and fit the budget. ${confirmedAreasCount} of ${totalAreasCount} areas deliberated.`}
          </Typography>
        </Box>
      </Sheet>

      {/* 3. OFFICES TABLE + RIGHT CALENDAR CARD */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 2.5,
          alignItems: "flex-start",
        }}
      >
        {/* LEFT: OFFICES TABLE SECTION */}
        <Sheet
          variant="outlined"
          sx={{
            flex: 1,
            minWidth: 0,
            width: "100%",
            backgroundColor: "white",
            borderColor: "#dde3e8",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={1}
            sx={{ px: 3, pt: 2.25, pb: 0.75 }}
          >
            <Typography
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: "18px",
                fontWeight: 600,
                color: "#13222d",
              }}
            >
              Offices
            </Typography>
            <Chip
              size="sm"
              variant="soft"
              color={
                totalAreasCount > 0 && confirmedAreasCount >= totalAreasCount
                  ? "success"
                  : "primary"
              }
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 600,
                fontSize: "12px",
              }}
            >
              {confirmedAreasCount} of {totalAreasCount} areas deliberated
            </Chip>
          </Stack>

          <Box sx={{ overflowX: "auto" }}>
            <Table
              sx={{
                "--TableCell-paddingX": "14px",
                "--TableCell-paddingY": "16px",
                "& thead th": {
                  backgroundColor: "white",
                  borderBottom: "1px solid #dde3e8",
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: "13px",
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
                  <th style={{ width: "28%", paddingLeft: "24px" }}>Office</th>
                  <th style={{ width: "14%", textAlign: "right" }}>Proposed</th>
                  <th style={{ width: "14%", textAlign: "right" }}>Deliberated</th>
                  <th style={{ width: "14%" }}>Session</th>
                  <th style={{ width: "16%" }}>Confirmations</th>
                  <th style={{ width: "14%", paddingRight: "24px" }} />
                </tr>
              </thead>
              <tbody>
                {areas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ textAlign: "center", padding: "36px 24px" }}
                    >
                      <Typography level="body-sm" textColor="neutral.500">
                        No office PPMPs found for FY {year}.
                      </Typography>
                    </td>
                  </tr>
                ) : (
                  areas.map((area) => {
                    const session = area.session;
                    const { primary: sessionPrimary, secondary: sessionSecondary } =
                      formatSessionTimeLabel(session);
                    const hasDeliberationActivity =
                      Boolean(session) || Number(area.edited_items_count || 0) > 0;
                    const budgetOfficerDone = Boolean(
                      session?.budget_officer_confirmed ?? session?.mcc_confirmed,
                    );
                    const repDone = Boolean(session?.end_user_confirmed);

                    return (
                      <tr key={area.aop_application_id}>
                        <td style={{ paddingLeft: "24px" }}>
                          <Typography
                            sx={{
                              fontFamily: '"Poppins", sans-serif',
                              fontSize: "16px",
                              fontWeight: 600,
                              color: "#13222d",
                            }}
                          >
                            {area.area_code}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: '"Poppins", sans-serif',
                              fontSize: "13px",
                              color: "#4f5e6b",
                            }}
                          >
                            {area.area_name}
                          </Typography>
                        </td>

                        <td style={{ textAlign: "right" }}>
                          <Typography
                            sx={{
                              fontFamily: '"Poppins", sans-serif',
                              fontSize: "15px",
                              color: "#4f5e6b",
                            }}
                          >
                            {formatCurrency(
                              area.proposed_total ?? area.combined_ppmp_total,
                            )}
                          </Typography>
                        </td>

                        <td style={{ textAlign: "right" }}>
                          {hasDeliberationActivity ? (
                            <Typography
                              sx={{
                                fontFamily: '"Poppins", sans-serif',
                                fontSize: "15px",
                                fontWeight: 600,
                                color: "#13222d",
                              }}
                            >
                              {formatCurrency(area.combined_ppmp_total)}
                            </Typography>
                          ) : (
                            <Typography
                              sx={{
                                fontFamily: '"Poppins", sans-serif',
                                fontSize: "15px",
                                color: "#4f5e6b",
                              }}
                            >
                              Not yet
                            </Typography>
                          )}
                        </td>

                        <td>
                          {session ? (
                            <Box>
                              <Typography
                                sx={{
                                  fontFamily: '"Poppins", sans-serif',
                                  fontSize: "15px",
                                  fontWeight: 600,
                                  color: "#13222d",
                                }}
                              >
                                {sessionPrimary}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: '"Poppins", sans-serif',
                                  fontSize: "13px",
                                  color: "#4f5e6b",
                                }}
                              >
                                {sessionSecondary}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography
                              sx={{
                                fontFamily: '"Poppins", sans-serif',
                                fontSize: "15px",
                                color: "#4f5e6b",
                              }}
                            >
                              Not scheduled
                            </Typography>
                          )}
                        </td>

                        <td>
                          {session ? (
                            <Box>
                              <Typography
                                sx={{
                                  fontFamily: '"Poppins", sans-serif',
                                  fontSize: "14px",
                                  color: budgetOfficerDone ? "#15803d" : "#4f5e6b",
                                  fontWeight: budgetOfficerDone ? 600 : 400,
                                }}
                              >
                                Budget Officer:{" "}
                                {budgetOfficerDone ? "confirmed" : "waiting"}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: '"Poppins", sans-serif',
                                  fontSize: "14px",
                                  color: repDone ? "#15803d" : "#4f5e6b",
                                  fontWeight: repDone ? 600 : 400,
                                }}
                              >
                                End User:{" "}
                                {repDone ? "confirmed" : "waiting"}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography
                              sx={{
                                fontFamily: '"Poppins", sans-serif',
                                fontSize: "14px",
                                color: "#4f5e6b",
                              }}
                            >
                              Starts after the session
                            </Typography>
                          )}
                        </td>

                        <td style={{ textAlign: "right", paddingRight: "24px" }}>
                          <Stack
                            direction="row"
                            spacing={0.75}
                            justifyContent="flex-end"
                            alignItems="center"
                          >
                            {session ? (
                              <>
                                <Button
                                  variant="solid"
                                  onClick={() =>
                                    onOpenAreaDeliberation(
                                      area.aop_application_id,
                                    )
                                  }
                                  sx={{
                                    height: "42px",
                                    px: 2.25,
                                    borderRadius: "8px",
                                    backgroundColor: "#0b3a57",
                                    color: "white",
                                    fontFamily: '"Poppins", sans-serif',
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    whiteSpace: "nowrap",
                                    "&:hover": { backgroundColor: "#092e45" },
                                  }}
                                >
                                  Open session
                                </Button>
                                {userCapabilities.can_schedule && (
                                  <Tooltip title="Reschedule / edit session">
                                    <IconButton
                                      size="sm"
                                      variant="plain"
                                      onClick={() => openScheduleModalForArea(area)}
                                      sx={{ color: "#4f5e6b" }}
                                    >
                                      <EditCalendarIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {userCapabilities.can_schedule &&
                                  session.is_fully_confirmed && (
                                    <Tooltip title="Call back office for adjustment">
                                      <IconButton
                                        size="sm"
                                        variant="plain"
                                        color="warning"
                                        onClick={() =>
                                          handleCallBackForAdjustment(session)
                                        }
                                      >
                                        <CallBackIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="outlined"
                                  disabled={!userCapabilities.can_schedule}
                                  onClick={() => openScheduleModalForArea(area)}
                                  sx={{
                                    height: "42px",
                                    px: 2.25,
                                    borderRadius: "8px",
                                    borderColor: "#0b3a57",
                                    backgroundColor: "white",
                                    color: "#0b3a57",
                                    fontFamily: '"Poppins", sans-serif',
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    whiteSpace: "nowrap",
                                    "&:hover": {
                                      backgroundColor: "#eef6fb",
                                      borderColor: "#0b3a57",
                                    },
                                  }}
                                >
                                  Schedule
                                </Button>
                                <Tooltip title="Preview office PPMP items">
                                  <Button
                                    size="sm"
                                    variant="plain"
                                    onClick={() =>
                                      onOpenAreaDeliberation(
                                        area.aop_application_id,
                                      )
                                    }
                                    sx={{
                                      color: "#4f5e6b",
                                      fontSize: "12px",
                                      px: 1,
                                    }}
                                  >
                                    View
                                  </Button>
                                </Tooltip>
                              </>
                            )}
                          </Stack>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </Box>
        </Sheet>

        {/* RIGHT: MONTHLY CALENDAR CARD */}
        <Sheet
          variant="outlined"
          sx={{
            width: { xs: "100%", lg: "380px", xl: "440px" },
            flexShrink: 0,
            backgroundColor: "white",
            borderColor: "#dde3e8",
            borderRadius: "10px",
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            gap: 1.75,
          }}
        >
          {/* Calendar Month Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: "18px",
                fontWeight: 600,
                color: "#13222d",
              }}
            >
              {currentMonth.format("MMMM YYYY")}
            </Typography>
            <Stack direction="row" spacing={0.5}>
              <IconButton
                variant="outlined"
                onClick={() =>
                  setCurrentMonth((m) => m.clone().subtract(1, "month"))
                }
                sx={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  borderColor: "#b8c3cc",
                  color: "#13222d",
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                variant="outlined"
                onClick={() =>
                  setCurrentMonth((m) => m.clone().add(1, "month"))
                }
                sx={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  borderColor: "#b8c3cc",
                  color: "#13222d",
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Stack>
          </Stack>

          {/* Weekday Headers */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "2px",
              textAlign: "center",
            }}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <Typography
                key={d}
                sx={{
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: "12px",
                  color: "#4f5e6b",
                  py: 0.5,
                }}
              >
                {d}
              </Typography>
            ))}
          </Box>

          {/* Day Cells */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "4px",
            }}
          >
            {calendarDays.map((day) => {
              const dateKey = day.format("YYYY-MM-DD");
              const isCurrentMonth = day.isSame(currentMonth, "month");
              const isSelected = dateKey === selectedDateStr;
              const dayList = sessionsByDate[dateKey] || [];
              const hasSessions = dayList.length > 0;

              return (
                <Box
                  key={dateKey}
                  component="button"
                  type="button"
                  onClick={() => setSelectedDateStr(dateKey)}
                  sx={{
                    height: "44px",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: isSelected ? "#0b3a57" : "white",
                    color: isSelected
                      ? "white"
                      : isCurrentMonth
                        ? "#13222d"
                        : "#94a3b8",
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: "14px",
                    fontWeight: isSelected ? 600 : 400,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    transition: "background-color 0.12s ease",
                    "&:hover": {
                      backgroundColor: isSelected ? "#0b3a57" : "#f4f6f8",
                    },
                  }}
                >
                  <span>{day.date()}</span>
                  {hasSessions && (
                    <Box
                      sx={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        backgroundColor: isSelected ? "white" : "#0b6aa2",
                        position: "absolute",
                        bottom: "5px",
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>

          <Divider sx={{ borderColor: "#dde3e8" }} />

          {/* Selected Date Agenda */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            <Typography
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: "15px",
                fontWeight: 600,
                color: "#13222d",
              }}
            >
              {moment(selectedDateStr, "YYYY-MM-DD").format("dddd, MMM D")}
            </Typography>

            {selectedDaySessions.length === 0 ? (
              <Typography
                sx={{
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: "13px",
                  color: "#4f5e6b",
                }}
              >
                No sessions scheduled on this date.
              </Typography>
            ) : (
              selectedDaySessions.map((sess) => (
                <Box
                  key={sess.id}
                  onClick={() => onOpenAreaDeliberation(sess.aop_application_id)}
                  sx={{
                    backgroundColor: "#f4f6f8",
                    borderRadius: "8px",
                    px: 1.75,
                    py: 1.25,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#eef6fb" },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      fontSize: "14px",
                      color: "#13222d",
                    }}
                  >
                    {sess.start_time
                      ? `${moment(sess.start_time, ["HH:mm:ss", "HH:mm"]).format("h:mm A")}${
                          sess.end_time
                            ? ` – ${moment(sess.end_time, ["HH:mm:ss", "HH:mm"]).format("h:mm A")}`
                            : ""
                        }`
                      : "--"}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      sx={{
                        fontFamily: '"Poppins", sans-serif',
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#13222d",
                      }}
                    >
                      {sess.area_code}
                    </Typography>
                    {userCapabilities.can_schedule && (
                      <Tooltip title="Cancel session">
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCancelSession(sess.id);
                          }}
                          sx={{ minHeight: "24px", minWidth: "24px", p: 0.25 }}
                        >
                          <CancelIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </Box>
              ))
            )}

            <Typography
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: "13px",
                color: "#4f5e6b",
              }}
            >
              One office per session.
            </Typography>

            <Button
              variant="outlined"
              fullWidth
              disabled={!userCapabilities.can_schedule || areas.length === 0}
              onClick={() => openScheduleModalForDate(selectedDateStr)}
              sx={{
                height: "44px",
                borderRadius: "8px",
                borderColor: "#0b3a57",
                backgroundColor: "white",
                color: "#0b3a57",
                fontFamily: '"Poppins", sans-serif',
                fontSize: "14px",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "#eef6fb",
                  borderColor: "#0b3a57",
                },
              }}
            >
              Schedule an office on this day
            </Button>
          </Box>
        </Sheet>
      </Box>

      {/* SCHEDULE / RESCHEDULE SESSION MODAL */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalDialog sx={{ maxWidth: 480, width: "100%", borderRadius: "12px" }}>
          <ModalClose />
          <Typography level="title-lg" fontWeight={700} mb={0.5}>
            {editingSession
              ? "Reschedule Deliberation Session"
              : "Schedule Deliberation Session"}
          </Typography>
          <Typography level="body-xs" textColor="neutral.500" mb={2}>
            Assign a date and time slot for the office. In-app and email
            notifications are sent automatically.
          </Typography>

          <Stack spacing={1.5}>
            <FormControl required>
              <FormLabel>Office / Area</FormLabel>
              <Select
                disabled={Boolean(editingSession)}
                value={formAopId}
                onChange={(e, val) => setFormAopId(val)}
              >
                {areas.map((a) => (
                  <Option
                    key={a.aop_application_id}
                    value={a.aop_application_id}
                  >
                    {a.area_code} — {a.area_name}
                  </Option>
                ))}
              </Select>
            </FormControl>

            <FormControl required>
              <FormLabel>Session Date</FormLabel>
              <Input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
              />
            </FormControl>

            <Stack direction="row" spacing={1.5}>
              <FormControl required sx={{ flex: 1 }}>
                <FormLabel>Start Time</FormLabel>
                <Input
                  type="time"
                  value={formStartTime}
                  onChange={(e) => setFormStartTime(e.target.value)}
                />
              </FormControl>
              <FormControl required sx={{ flex: 1 }}>
                <FormLabel>End Time</FormLabel>
                <Input
                  type="time"
                  value={formEndTime}
                  onChange={(e) => setFormEndTime(e.target.value)}
                />
              </FormControl>
            </Stack>

            {overlappingSessions.length > 0 && (
              <Chip color="warning" variant="soft" sx={{ whiteSpace: "normal", py: 0.75 }}>
                Warning: Overlaps with{" "}
                {overlappingSessions.map((s) => s.area_code).join(", ")} on{" "}
                {formDate}.
              </Chip>
            )}

            <FormControl>
              <FormLabel>Venue (optional)</FormLabel>
              <Input
                value={formVenue}
                onChange={(e) => setFormVenue(e.target.value)}
                placeholder="MCC Conference Room"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Remarks (optional)</FormLabel>
              <Textarea
                minRows={2}
                value={formRemarks}
                onChange={(e) => setFormRemarks(e.target.value)}
                placeholder="Notes or instructions for attendees..."
              />
            </FormControl>

            <Stack direction="row" spacing={1} justifyContent="flex-end" mt={1}>
              <Button
                variant="outlined"
                color="neutral"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                loading={isSubmitting}
                disabled={!formAopId || !formDate || !formStartTime || !formEndTime}
                onClick={handleSaveSession}
                sx={{ backgroundColor: "#0b3a57" }}
              >
                {editingSession ? "Save Schedule" : "Schedule & Notify"}
              </Button>
            </Stack>
          </Stack>
        </ModalDialog>
      </Modal>

      {/* ROLE EDIT PERMISSIONS MODAL */}
      <Modal open={permissionsOpen} onClose={() => setPermissionsOpen(false)}>
        <ModalDialog sx={{ maxWidth: 420, width: "100%", borderRadius: "12px" }}>
          <ModalClose />
          <Typography level="title-lg" fontWeight={700} mb={0.5}>
            Deliberation Edit Permissions
          </Typography>
          <Typography level="body-xs" textColor="neutral.500" mb={2}>
            Control which roles can edit PPMP items during FY {year}{" "}
            deliberations.
          </Typography>
          <Stack spacing={1.5}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography level="body-sm" fontWeight={600}>
                Allow MCC Edits
              </Typography>
              <Switch
                checked={Boolean(fiscalBudget?.allow_mcc_edit ?? true)}
                onChange={(e) =>
                  onTogglePermission("allow_mcc_edit", e.target.checked)
                }
              />
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography level="body-sm" fontWeight={600}>
                Allow Budget Officer Edits
              </Typography>
              <Switch
                checked={Boolean(fiscalBudget?.allow_budget_officer_edit ?? true)}
                onChange={(e) =>
                  onTogglePermission(
                    "allow_budget_officer_edit",
                    e.target.checked,
                  )
                }
              />
            </Stack>
          </Stack>
        </ModalDialog>
      </Modal>
    </Box>
  );
}

export default DeliberationCalendarTab;
