import { create } from "zustand";
import { post, read, remove, update } from "../../Services/RequestMethods";

const applyUpdatedItemsToState = (
  state,
  updatedItem,
  propagatedItems = [],
  newHistoryId = null,
  options = {},
) => {
  const propagatedById = new Map(
    (Array.isArray(propagatedItems) ? propagatedItems : []).map((item) => [
      item.id,
      item,
    ]),
  );
  const nextSummary = { ...state.itemsSummary };

  const applySummaryDelta = (prevItem, nextItem) => {
    if (!prevItem || !nextItem) return;
    const prevDeleted = Boolean(prevItem.is_deleted);
    const nextDeleted = Boolean(nextItem.is_deleted);
    const prevAmt = prevDeleted
      ? 0
      : Number(prevItem.deliberated_total ?? prevItem.total_amount ?? 0);
    const nextAmt = nextDeleted
      ? 0
      : Number(nextItem.deliberated_total ?? nextItem.total_amount ?? 0);

    nextSummary.deliberated_total = Math.max(
      0,
      Number(nextSummary.deliberated_total || 0) - prevAmt + nextAmt,
    );
    nextSummary.total_amount = nextSummary.deliberated_total;

    const wasEdited = Boolean(prevItem.is_edited);
    const nowEdited = Boolean(nextItem.is_edited);
    if (!wasEdited && nowEdited) {
      nextSummary.edited_count = Number(nextSummary.edited_count || 0) + 1;
      nextSummary.unedited_count = Math.max(
        0,
        Number(nextSummary.unedited_count || 0) - 1,
      );
    } else if (wasEdited && !nowEdited) {
      nextSummary.edited_count = Math.max(
        0,
        Number(nextSummary.edited_count || 0) - 1,
      );
      nextSummary.unedited_count = Number(nextSummary.unedited_count || 0) + 1;
    }

    if (!prevDeleted && nextDeleted) {
      nextSummary.removed_count = Number(nextSummary.removed_count || 0) + 1;
    } else if (prevDeleted && !nextDeleted) {
      nextSummary.removed_count = Math.max(
        0,
        Number(nextSummary.removed_count || 0) - 1,
      );
    }
  };

  const nextItems =
    updatedItem || propagatedById.size > 0
      ? state.items.map((it) => {
          const replacement =
            updatedItem && it.id === updatedItem.id
              ? updatedItem
              : propagatedById.get(it.id);
          if (!replacement) return it;
          applySummaryDelta(it, replacement);
          return { ...replacement, item_no: it.item_no };
        })
      : state.items;

  if (newHistoryId) {
    nextSummary.history_count = Number(nextSummary.history_count || 0) + 1;
  }

  let nextUndoStack = state.undoStack;
  if (newHistoryId) {
    nextUndoStack = [...state.undoStack, newHistoryId];
  } else if (options.removeUndoHistoryId) {
    nextUndoStack = state.undoStack.filter(
      (id) => id !== options.removeUndoHistoryId,
    );
  }

  return {
    items: nextItems,
    itemsSummary: nextSummary,
    undoStack: nextUndoStack,
  };
};

const useDeliberationStore = create((set, get) => ({
  year: new Date().getFullYear() + 1,
  fiscalBudget: null,
  metrics: {
    total_budget_ceiling: 0,
    hospital_total_ppmp: 0,
    hospital_confirmed_ppmp: 0,
    remaining_budget: 0,
    is_over_budget: false,
    excess_amount: 0,
    total_areas_count: 0,
    scheduled_areas_count: 0,
    confirmed_areas_count: 0,
    total_history_logs: 0,
    deleted_items_count: 0,
  },
  userCapabilities: {
    role: "Approver",
    is_mcc: false,
    is_budget_officer: false,
    is_planning_unit: false,
    can_schedule: true,
    can_set_budget: true,
    can_toggle_permissions: true,
    can_edit_items: true,
    can_confirm_mcc: true,
  },
  areas: [],
  libraries: {
    categories: [],
    procurement_modes: [],
    source_of_funds: [],
  },
  sessions: [],
  items: [],
  itemsSummary: {
    total_items: 0,
    all_count: 0,
    edited_count: 0,
    unedited_count: 0,
    removed_count: 0,
    total_quantity: 0,
    proposed_total: 0,
    deliberated_total: 0,
    total_amount: 0,
    history_count: 0,
  },
  itemsPagination: {
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  },
  history: [],
  historyPagination: {
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  },
  areaRepresentatives: [],
  undoStack: [], // Stack of history IDs from this session for quick Undo

  isLoadingOverview: false,
  isLoadingItems: false,
  isLoadingHistory: false,
  isSubmitting: false,

  actions: {
    setYear: (year) => set({ year }),

    fetchOverview: (yearParam, callback) => {
      const targetYear = yearParam ?? get().year;
      set({ isLoadingOverview: true });

      read({
        url: "deliberation/overview",
        params: { year: targetYear },
        success: (res) => {
          const payload = res?.data?.data || {};
          set({
            year: payload.year ?? targetYear,
            fiscalBudget: payload.fiscal_budget ?? null,
            metrics: payload.metrics ?? get().metrics,
            userCapabilities:
              payload.user_capabilities ?? get().userCapabilities,
            areas: payload.areas ?? [],
            libraries: payload.libraries ?? get().libraries,
            isLoadingOverview: false,
          });
          callback && callback(200, res?.data?.message);
        },
        failed: (status, message) => {
          set({ isLoadingOverview: false });
          callback && callback(status || 500, message);
        },
      });
    },

    upsertFiscalBudget: (form, callback) => {
      set({ isSubmitting: true });
      post({
        url: "deliberation/fiscal-budget",
        form,
        success: (res) => {
          set({ isSubmitting: false });
          get().actions.fetchOverview(form.year);
          callback && callback(200, res?.data?.message, res?.data?.data);
        },
        failed: (status, message) => {
          set({ isSubmitting: false });
          callback && callback(status || 400, message);
        },
      });
    },

    updateRolePermissions: (form, callback) => {
      set({ isSubmitting: true });
      update({
        url: "deliberation/role-permissions",
        form,
        success: (res) => {
          const payload = res?.data?.data || {};
          set((state) => ({
            isSubmitting: false,
            fiscalBudget: state.fiscalBudget
              ? {
                  ...state.fiscalBudget,
                  allow_mcc_edit: payload.allow_mcc_edit,
                  allow_budget_officer_edit: payload.allow_budget_officer_edit,
                }
              : state.fiscalBudget,
            userCapabilities:
              payload.user_capabilities ?? state.userCapabilities,
          }));
          callback && callback(200, res?.data?.message);
        },
        failed: (status, message) => {
          set({ isSubmitting: false });
          callback && callback(status || 400, message);
        },
      });
    },

    finalizeYear: (form, callback) => {
      set({ isSubmitting: true });
      post({
        url: "deliberation/finalize-year",
        form,
        success: (res) => {
          set({ isSubmitting: false });
          get().actions.fetchOverview(form.year);
          callback && callback(200, res?.data?.message, res?.data?.data);
        },
        failed: (status, message, errors) => {
          set({ isSubmitting: false });
          callback && callback(status || 422, message, errors);
        },
      });
    },

    fetchSessions: (params, callback) => {
      read({
        url: "deliberation/sessions",
        params: { year: get().year, ...params },
        success: (res) => {
          set({ sessions: res?.data?.data ?? [] });
          callback && callback(200, res?.data?.message);
        },
        failed: (status, message) => {
          callback && callback(status || 500, message);
        },
      });
    },

    storeSession: (form, callback) => {
      set({ isSubmitting: true });
      post({
        url: "deliberation/sessions",
        form,
        success: (res) => {
          set({ isSubmitting: false });
          get().actions.fetchOverview(get().year);
          get().actions.fetchSessions({ year: get().year });
          callback &&
            callback(
              200,
              res?.data?.message,
              res?.data?.data,
              res?.data?.conflict_warning,
            );
        },
        failed: (status, message) => {
          set({ isSubmitting: false });
          callback && callback(status || 400, message);
        },
      });
    },

    updateSession: (id, form, callback) => {
      set({ isSubmitting: true });
      update({
        url: `deliberation/sessions/${id}`,
        form,
        success: (res) => {
          set({ isSubmitting: false });
          get().actions.fetchOverview(get().year);
          get().actions.fetchSessions({ year: get().year });
          callback && callback(200, res?.data?.message, res?.data?.data);
        },
        failed: (status, message) => {
          set({ isSubmitting: false });
          callback && callback(status || 400, message);
        },
      });
    },

    destroySession: (id, callback) => {
      set({ isSubmitting: true });
      remove({
        url: `deliberation/sessions/${id}`,
        success: (res) => {
          set({ isSubmitting: false });
          get().actions.fetchOverview(get().year);
          get().actions.fetchSessions({ year: get().year });
          callback && callback(200, res?.data?.message);
        },
        failed: (status, message) => {
          set({ isSubmitting: false });
          callback && callback(status || 400, message);
        },
      });
    },

    fetchAreaRepresentatives: (aopApplicationId, callback) => {
      if (!aopApplicationId) {
        set({ areaRepresentatives: [] });
        return;
      }
      read({
        url: `deliberation/areas/${aopApplicationId}/representatives`,
        success: (res) => {
          set({ areaRepresentatives: res?.data?.data ?? [] });
          callback && callback(200, res?.data?.data);
        },
        failed: (status, message) => {
          callback && callback(status || 500, message);
        },
      });
    },

    confirmMcc: (aopApplicationId, form, callback) => {
      set({ isSubmitting: true });
      post({
        url: `deliberation/areas/${aopApplicationId}/confirm-mcc`,
        form,
        success: (res) => {
          set({ isSubmitting: false });
          get().actions.fetchOverview(get().year);
          callback && callback(200, res?.data?.message, res?.data?.data);
        },
        failed: (status, message) => {
          set({ isSubmitting: false });
          callback && callback(status || 403, message);
        },
      });
    },

    confirmEndUser: (aopApplicationId, form, callback) => {
      set({ isSubmitting: true });
      post({
        url: `deliberation/areas/${aopApplicationId}/confirm-end-user`,
        form,
        success: (res) => {
          set({ isSubmitting: false });
          get().actions.fetchOverview(get().year);
          callback && callback(200, res?.data?.message, res?.data?.data);
        },
        failed: (status, message) => {
          set({ isSubmitting: false });
          callback && callback(status || 403, message);
        },
      });
    },

    fetchItems: (params, callback) => {
      set({ isLoadingItems: true });
      read({
        url: "deliberation/items",
        params: { year: get().year, ...params },
        success: (res) => {
          set({
            items: res?.data?.data ?? [],
            itemsSummary: res?.data?.summary ?? get().itemsSummary,
            itemsPagination: res?.data?.pagination ?? get().itemsPagination,
            isLoadingItems: false,
          });
          callback && callback(200, res?.data?.message);
        },
        failed: (status, message) => {
          set({ isLoadingItems: false });
          callback && callback(status || 500, message);
        },
      });
    },

    updateItem: (ppmpItemId, form, callback) => {
      update({
        url: `deliberation/items/${ppmpItemId}`,
        form,
        success: (res) => {
          const updatedItem = res?.data?.data;
          const historyEntry = res?.data?.history_entry;
          const propagatedItems = Array.isArray(res?.data?.propagated_items)
            ? res.data.propagated_items
            : [];

          set((state) =>
            applyUpdatedItemsToState(
              state,
              updatedItem,
              propagatedItems,
              historyEntry?.id || null,
            ),
          );

          get().actions.fetchOverview(get().year);
          callback &&
            callback(200, res?.data?.message, updatedItem, propagatedItems);
        },
        failed: (status, message) => {
          callback && callback(status || 400, message);
        },
      });
    },

    deleteItem: (ppmpItemId, form, callback) => {
      set({ isSubmitting: true });
      remove({
        url: `deliberation/items/${ppmpItemId}`,
        form,
        success: (res) => {
          const updatedItem = res?.data?.data;
          const historyEntry = res?.data?.history_entry;
          set((state) => {
            const oldItem = state.items.find((it) => it.id === ppmpItemId);
            const nextSummary = { ...state.itemsSummary };

            if (oldItem) {
              const prevAmt = Number(
                oldItem.deliberated_total ?? oldItem.total_amount ?? 0,
              );
              nextSummary.deliberated_total = Math.max(
                0,
                Number(nextSummary.deliberated_total || 0) - prevAmt,
              );
              nextSummary.total_amount = nextSummary.deliberated_total;

              if (!oldItem.is_edited) {
                nextSummary.edited_count =
                  Number(nextSummary.edited_count || 0) + 1;
                nextSummary.unedited_count = Math.max(
                  0,
                  Number(nextSummary.unedited_count || 0) - 1,
                );
              }
              if (!oldItem.is_deleted) {
                nextSummary.removed_count =
                  Number(nextSummary.removed_count || 0) + 1;
              }
            }
            if (historyEntry?.id) {
              nextSummary.history_count =
                Number(nextSummary.history_count || 0) + 1;
            }

            return {
              isSubmitting: false,
              items: updatedItem
                ? state.items.map((it) =>
                    it.id === ppmpItemId
                      ? { ...updatedItem, item_no: it.item_no }
                      : it,
                  )
                : state.items.map((it) =>
                    it.id === ppmpItemId
                      ? {
                          ...it,
                          is_deleted: true,
                          is_edited: true,
                          deliberated_total: 0,
                          total_amount: 0,
                        }
                      : it,
                  ),
              itemsSummary: nextSummary,
              undoStack: historyEntry?.id
                ? [...state.undoStack, historyEntry.id]
                : state.undoStack,
            };
          });

          get().actions.fetchOverview(get().year);
          callback && callback(200, res?.data?.message, updatedItem);
        },
        failed: (status, message) => {
          set({ isSubmitting: false });
          callback && callback(status || 400, message);
        },
      });
    },

    fetchHistory: (params, callback) => {
      set({ isLoadingHistory: true });
      read({
        url: "deliberation/history",
        params: { year: get().year, ...params },
        success: (res) => {
          set({
            history: res?.data?.data ?? [],
            historyPagination:
              res?.data?.pagination ?? get().historyPagination,
            isLoadingHistory: false,
          });
          callback && callback(200, res?.data?.message);
        },
        failed: (status, message) => {
          set({ isLoadingHistory: false });
          callback && callback(status || 500, message);
        },
      });
    },

    restoreOrRevertHistory: (historyId, callback) => {
      set({ isSubmitting: true });
      post({
        url: `deliberation/history/${historyId}/restore`,
        form: {},
        success: (res) => {
          const updatedItem = res?.data?.data;
          const historyEntry = res?.data?.history_entry;
          const propagatedItems = Array.isArray(res?.data?.propagated_items)
            ? res.data.propagated_items
            : [];

          set((state) => ({
            isSubmitting: false,
            ...applyUpdatedItemsToState(
              state,
              updatedItem,
              propagatedItems,
              historyEntry?.id || null,
              { removeUndoHistoryId: historyId },
            ),
          }));
          get().actions.fetchOverview(get().year);
          callback &&
            callback(200, res?.data?.message, updatedItem, propagatedItems);
        },
        failed: (status, message) => {
          set({ isSubmitting: false });
          callback && callback(status || 400, message);
        },
      });
    },
  },
}));

export const useDeliberation = () => {
  const year = useDeliberationStore((s) => s.year);
  const fiscalBudget = useDeliberationStore((s) => s.fiscalBudget);
  const metrics = useDeliberationStore((s) => s.metrics);
  const userCapabilities = useDeliberationStore((s) => s.userCapabilities);
  const areas = useDeliberationStore((s) => s.areas);
  const libraries = useDeliberationStore((s) => s.libraries);
  const sessions = useDeliberationStore((s) => s.sessions);
  const items = useDeliberationStore((s) => s.items);
  const itemsSummary = useDeliberationStore((s) => s.itemsSummary);
  const itemsPagination = useDeliberationStore((s) => s.itemsPagination);
  const history = useDeliberationStore((s) => s.history);
  const historyPagination = useDeliberationStore((s) => s.historyPagination);
  const areaRepresentatives = useDeliberationStore(
    (s) => s.areaRepresentatives,
  );
  const undoStack = useDeliberationStore((s) => s.undoStack);
  const isLoadingOverview = useDeliberationStore((s) => s.isLoadingOverview);
  const isLoadingItems = useDeliberationStore((s) => s.isLoadingItems);
  const isLoadingHistory = useDeliberationStore((s) => s.isLoadingHistory);
  const isSubmitting = useDeliberationStore((s) => s.isSubmitting);

  return {
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
    historyPagination,
    areaRepresentatives,
    undoStack,
    isLoadingOverview,
    isLoadingItems,
    isLoadingHistory,
    isSubmitting,
  };
};

export const useDeliberationActions = () =>
  useDeliberationStore((s) => s.actions);

