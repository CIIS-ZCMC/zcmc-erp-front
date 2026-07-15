// Store/AuthStore.js

import { create } from "zustand";
import erp_api from "../Services/ERP_API";
import { read } from "../Services/RequestMethods";
import { localStorageGetter, localStorageSetter, clearLocalStorage } from "../Utils/LocalStorage";
import { AREA_ID } from "../Data/constants";
import { BASE_URL } from "../Services/Config";

const useAuthStore = create((set) => ({
  user: localStorageGetter("user") ?? null,
  loading: false,
  error: null,
  meta: null,
  permissions: localStorageGetter("user")?.meta?.permissions ?? [], // Try to get permissions from stored user
  area: localStorageGetter("user")?.assignedArea ?? null,
  isAuthenticated: !!localStorageGetter("user"),
  //Actions
  actions: {
    // Session ID must be pass in call
    authenticate: async (params) => {
      set({ loading: true, error: null });

      return await erp_api
        .post("authenticate", params)
        .then((res) => {
          const { data, status } = res;

          if (!(status >= 200 && status < 300)) {
            throw new Error("Bad response", { cause: res });
          }

          set({
            user: data.data,
            area: data.data.assignedArea,
            meta: data.meta,
            permissions: data.data.meta.permissions,
            loading: false,
            isAuthenticated: true,
          });

          localStorageSetter("user", data.data);

          return data.meta.redirect_to;
        })
        .catch((err) => {
          set({ error: err.cause });
          return;
        });
    },

    logout: async () => {
      return await erp_api
        .delete("/logout")
        .then((res) => {
          const { data, status } = res;

          if (!(status >= 200 && status < 300)) {
            throw new Error("Bad response", { cause: res });
          }

          set({
            user: null,
            meta: null,
            isAuthenticated: false,
            permissions: [],
          });

          clearLocalStorage();

          return data?.meta?.redirect_to || BASE_URL.umis_landing_page;
        })
        .catch((err) => {
          set({
            user: null,
            meta: null,
            isAuthenticated: false,
            permissions: [],
            error: err?.cause || err?.message || err,
          });

          clearLocalStorage();

          return BASE_URL.umis_landing_page;
        });
    },

    sessionValidation: (token, callBack) => {
      read({
        url: "/user",
        token: token,
        success: (res) => {
          const { data, status } = res;

          if (!(status >= 200 && status < 300)) {
            if (callBack) callBack(status);
            return;
          }

          console.log("Session validation success:", data);

          set({
            user: data.data,
            area: data.data.assignedArea,
            meta: data.meta,
            permissions: data.data.meta.permissions,
            loading: false,
            isAuthenticated: true,
          });

          localStorageSetter("user", data.data);

          // IMPORTANT: Call the callback with success status
          if (callBack) callBack(status);
        },
        failed: (error) => {
          console.log("Session validation failed:", error);
          if (callBack) callBack(error?.status || 401);
        },
      });
    },
  },
}));

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const meta = useAuthStore((state) => state.meta);
  const permissions = useAuthStore((state) => state.permissions);
  const area = useAuthStore((state) => state.area);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return { user, meta, area, permissions, loading, error, isAuthenticated };
};

export const useAuthActions = () => {
  const actions = useAuthStore((state) => state.actions);
  return { ...actions };
};

export const useUserTypes = () => {
  const area = useAuthStore((state) => state.area);
  const { type, is_head } = area || {};

  if (area) {
    return {
      isDivisionHead:
        type === "division" && is_head && area.area_id !== AREA_ID.OMCC,
      isPlanning:
        area.area_id === AREA_ID.PLANNING_UNIT || area.name === "Planning Unit",
      isDepartmentHead: area.area_id === AREA_ID.OMCC || false,
      isMCC: area.area_id === AREA_ID.OMCC && is_head,
      isBudget: area.area_id === AREA_ID.BUDGET && is_head,
    };
  }

  return {};
};
