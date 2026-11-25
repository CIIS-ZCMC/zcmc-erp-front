import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import useSnackbarHook from "../../../Hooks/SnackbarHook";
import useModalHook from "../../../Hooks/ModalHook";
import {
  useDeliberation,
  useDeliberationActions,
} from "../../../Hooks/PPMP/DeliberationHook";
import DeliberationCalendarTab from "./Deliberation/DeliberationCalendarTab";
import DeliberationItemsTab from "./Deliberation/DeliberationItemsTab";

function BudgetDeliberation() {
  const {
    year,
    fiscalBudget,
    metrics,
    userCapabilities,
    areas,
    libraries,
    sessions,
    items,
    itemsSummary,
    itemsPagination,
    history,
    areaRepresentatives,
    undoStack,
    isLoadingItems,
    isLoadingHistory,
    isSubmitting,
  } = useDeliberation();

  const {
    setYear,
    fetchOverview,
    upsertFiscalBudget,
    updateRolePermissions,
    finalizeYear,
    fetchSessions,
    storeSession,
    updateSession,
    destroySession,
    fetchAreaRepresentatives,
    confirmMcc,
    confirmEndUser,
    fetchItems,
    updateItem,
    deleteItem,
    fetchHistory,
    restoreOrRevertHistory,
  } = useDeliberationActions();

  const { showSnack } = useSnackbarHook();
  const { setAlertDialog } = useModalHook();

  // Active Screen View (no tabs): "overview" (Tab 1 Calendar & Offices) | "session" (Tab 2 Deliberation)
  const [activeView, setActiveView] = useState("overview");
  const [displayMode, setDisplayMode] = useState(false);

  // Selected Office (AOP Application) & PPMP Type
  const [selectedAopId, setSelectedAopId] = useState(null);
  const [selectedPpmpType, setSelectedPpmpType] = useState(null);

  // Fiscal Year Total Budget Modal State
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [budgetRemarks, setBudgetRemarks] = useState("");

  useEffect(() => {
    fetchOverview(year);
    fetchSessions({ year });
  }, [year]);

  const handleOpenBudgetModal = () => {
    setBudgetInput(String(fiscalBudget?.total_budget ?? 0));
    setBudgetRemarks(fiscalBudget?.remarks ?? "");
    setBudgetModalOpen(true);
  };

  const handleSaveFiscalBudget = () => {
    const amount = parseFloat(budgetInput);
    if (isNaN(amount) || amount < 0) return;

    upsertFiscalBudget(
      {
        year,
        total_budget: amount,
        remarks: budgetRemarks,
      },
      (status, message) => {
        if (status === 200) {
          showSnack(200, message);
          setBudgetModalOpen(false);
        } else {
          setAlertDialog({
            status: "error",
            title: "Unable to Save Budget",
            description: message || "Failed to update Fiscal Year Total Budget.",
          });
        }
      },
    );
  };

  const handleTogglePermission = (field, checked) => {
    updateRolePermissions(
      {
        year,
        [field]: checked,
      },
      (status, message) => {
        if (status === 200) {
          showSnack(200, message);
        } else {
          setAlertDialog({
            status: "error",
            title: "Permission Update Failed",
            description: message,
          });
        }
      },
    );
  };

  const handleFinalizeDeliberation = (reopen = false) => {
    finalizeYear({ year, reopen }, (status, message) => {
      if (status === 200) {
        showSnack(200, message);
      } else {
        setAlertDialog({
          status: "error",
          title: "Cannot Finalize Fiscal Year Deliberation",
          description:
            message ||
            "Total sum of submitted PPMPs still exceeds the Fiscal Year Total Budget. Please call areas for adjustments.",
        });
      }
    });
  };

  const handleScheduleSession = (form, onSuccess) => {
    storeSession(form, (status, message, data, conflictWarning) => {
      if (status === 200) {
        showSnack(
          200,
          conflictWarning ? `${message} (${conflictWarning})` : message,
        );
        onSuccess && onSuccess(data);
      } else {
        setAlertDialog({
          status: "error",
          title: "Scheduling Failed",
          description: message,
        });
      }
    });
  };

  const handleUpdateSession = (sessionId, form, onSuccess) => {
    updateSession(sessionId, form, (status, message, data) => {
      if (status === 200) {
        showSnack(200, message);
        onSuccess && onSuccess(data);
      } else {
        setAlertDialog({
          status: "error",
          title: "Session Update Failed",
          description: message,
        });
      }
    });
  };

  const handleCancelSession = (sessionId) => {
    destroySession(sessionId, (status, message) => {
      if (status === 200) {
        showSnack(200, message);
      } else {
        setAlertDialog({
          status: "error",
          title: "Cancellation Failed",
          description: message,
        });
      }
    });
  };

  const handleOpenAreaDeliberation = (aopApplicationId) => {
    setSelectedAopId(aopApplicationId);
    setSelectedPpmpType(null);
    setDisplayMode(false);
    setActiveView("session");
  };

  const handleUpdateItem = (ppmpItemId, form) => {
    updateItem(ppmpItemId, form, (status, message) => {
      if (status === 200) {
        showSnack(200, message);
      } else {
        setAlertDialog({
          status: "error",
          title: "Item Edit Failed",
          description: message,
        });
      }
    });
  };

  const handleDeleteItem = (ppmpItemId, form, onSuccess) => {
    deleteItem(ppmpItemId, form, (status, message) => {
      if (status === 200) {
        showSnack(200, message);
        onSuccess && onSuccess();
      } else {
        setAlertDialog({
          status: "error",
          title: "Remove Item Failed",
          description: message,
        });
      }
    });
  };

  const handleRestoreOrRevert = (historyId, onSuccess) => {
    restoreOrRevertHistory(historyId, (status, message, updatedItem) => {
      if (status === 200) {
        showSnack(200, message);
        onSuccess && onSuccess(updatedItem);
      } else {
        setAlertDialog({
          status: "error",
          title: "Restore / Revert Failed",
          description: message,
        });
      }
    });
  };

  const handleFetchItemHistory = (ppmpItemId) => {
    if (!ppmpItemId) return;
    fetchHistory({
      year,
      ppmp_item_id: ppmpItemId,
      per_page: 50,
      page: 1,
    });
  };

  const handleConfirmMcc = (aopApplicationId, form, onSuccess) => {
    confirmMcc(aopApplicationId, form, (status, message) => {
      if (status === 200) {
        showSnack(200, message);
        onSuccess && onSuccess();
      } else {
        setAlertDialog({
          status: "error",
          title: "Budget Officer Confirmation Failed",
          description: message,
        });
      }
    });
  };

  const handleConfirmEndUser = (aopApplicationId, form, onSuccess) => {
    confirmEndUser(aopApplicationId, form, (status, message) => {
      if (status === 200) {
        showSnack(200, message);
        onSuccess && onSuccess();
      } else {
        setAlertDialog({
          status: "error",
          title: "Area Representative Confirmation Failed",
          description: message,
        });
      }
    });
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    currentYear - 1,
    currentYear,
    currentYear + 1,
    currentYear + 2,
  ];

  return (
    <Fragment>
      {activeView === "overview" ? (
        <DeliberationCalendarTab
          year={year}
          yearOptions={yearOptions}
          onChangeYear={setYear}
          fiscalBudget={fiscalBudget}
          metrics={metrics}
          areas={areas}
          sessions={sessions}
          userCapabilities={userCapabilities}
          isSubmitting={isSubmitting}
          onOpenBudgetModal={handleOpenBudgetModal}
          onTogglePermission={handleTogglePermission}
          onFinalizeDeliberation={handleFinalizeDeliberation}
          onScheduleSession={handleScheduleSession}
          onUpdateSession={handleUpdateSession}
          onCancelSession={handleCancelSession}
          onOpenAreaDeliberation={handleOpenAreaDeliberation}
        />
      ) : (
        <Box
          sx={{
            height: "calc(100vh - 48px)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DeliberationItemsTab
            year={year}
            areas={areas}
            metrics={metrics}
            fiscalBudget={fiscalBudget}
            items={items}
            itemsSummary={itemsSummary}
            itemsPagination={itemsPagination}
            libraries={libraries}
            userCapabilities={userCapabilities}
            areaRepresentatives={areaRepresentatives}
            undoStack={undoStack}
            itemHistoryEntries={history}
            isLoadingHistory={isLoadingHistory}
            isLoadingItems={isLoadingItems}
            isSubmitting={isSubmitting}
            selectedAopId={selectedAopId}
            setSelectedAopId={setSelectedAopId}
            selectedPpmpType={selectedPpmpType}
            setSelectedPpmpType={setSelectedPpmpType}
            displayMode={displayMode}
            onToggleDisplayMode={() => setDisplayMode((prev) => !prev)}
            onBackToCalendar={() => {
              setDisplayMode(false);
              setActiveView("overview");
            }}
            onFetchItems={fetchItems}
            onFetchItemHistory={handleFetchItemHistory}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onUndoLastChange={handleRestoreOrRevert}
            onFetchRepresentatives={fetchAreaRepresentatives}
            onConfirmMcc={handleConfirmMcc}
            onConfirmEndUser={handleConfirmEndUser}
          />
        </Box>
      )}

      {/* ASSIGN FISCAL YEAR TOTAL BUDGET MODAL */}
      <Modal open={budgetModalOpen} onClose={() => setBudgetModalOpen(false)}>
        <ModalDialog sx={{ minWidth: 460, borderRadius: "12px" }}>
          <ModalClose />
          <Typography level="title-lg" fontWeight={700}>
            Assign Fiscal Year {year} Total Budget
          </Typography>
          <Typography level="body-xs" textColor="neutral.600">
            This single overall Fiscal Year Total Budget pool is shared across
            all areas&apos; PPMPs. At the end of deliberations, the grand total of
            all areas&apos; PPMPs must fit within this ceiling.
          </Typography>

          <Divider sx={{ my: 1 }} />

          <Stack spacing={2}>
            <FormControl required>
              <FormLabel>Total Budget Ceiling for FY {year} (PHP)</FormLabel>
              <Input
                type="number"
                startDecorator="₱"
                placeholder="0.00"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                slotProps={{ input: { min: 0, step: "0.01" } }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Budget Notes / Remarks</FormLabel>
              <Textarea
                minRows={2}
                placeholder="Optional notes regarding the FY budget allocation..."
                value={budgetRemarks}
                onChange={(e) => setBudgetRemarks(e.target.value)}
              />
            </FormControl>

            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="neutral"
                onClick={() => setBudgetModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                sx={{ backgroundColor: "#0b3a57" }}
                loading={isSubmitting}
                onClick={handleSaveFiscalBudget}
              >
                Save FY {year} Budget
              </Button>
            </Stack>
          </Stack>
        </ModalDialog>
      </Modal>
    </Fragment>
  );
}

export default BudgetDeliberation;
