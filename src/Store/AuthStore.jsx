import { create } from "zustand";
import erp_api from "../Services/ERP_API";
import { read } from "../Services/RequestMethods";
import { localStorageGetter, localStorageSetter } from "../Utils/LocalStorage";
import { AREA_ID } from "../Data/constants";

const useAuthStore = create((set) => ({
  user: localStorageGetter("user") ?? null,
  loading: false,
  error: null,
  meta: null,
  permissions: [],
  area: localStorageGetter("user")?.assignedArea ?? null,
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

          set({ user: null, meta: null });

          return data.meta.redirect_to;
        })
        .catch((err) => set({ error: err.cause }));
    },

    sessionValidation: (token, callBack) => {
      read({
        url: "/user",
        token: token,
        success: (res) => {
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
          });
          localStorageSetter("user", data.data);
        },
        failed: callBack,
      });
    },
  },
}));

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const meta = useAuthStore((state) => state.meta);
  const permissions = useAuthStore((state) => state.permissions);
  const area = useAuthStore((state) => state.area);
  const loading = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);

  return { user, meta, area, permissions, loading, error };
};

export const useAuthActions = () => {
  const actions = useAuthStore((state) => state.actions);

  return { ...actions };
};

export const useUserTypes = () => {
  const user = useAuthStore((state) => state.user);

  const area = useAuthStore((state) => state.area);

  if (area) {
    return {
      isDivisionHead: false,
      isPlanning:
        area.area_id === AREA_ID.PLANNING_UNIT || area.name === "Planning Unit",
      isDepartmentHead: area.area_id === AREA_ID.OMCC || false,
    };
  }
};
