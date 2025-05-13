import { number } from "prop-types";
import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,
  meta: null,
  //Actions
  actions: {
    // Session ID must be pass in call
    authenticate: async (params) => {
      set({ loading: true, error: null });

      return await erp_api
        .post("authenticate", { params })
        .then((res) => {
          const { data, status } = res;

          if (!(status >= 200 && status < 300)) {
            throw new Error("Bad response", { cause: res });
          }

          set({ user: data.data, meta: data.meta, loading: false });

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
  },
}));

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const meta = useAuthStore((state) => state.meta);
  const loading = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);

  return { user, meta, loading, error };
};

export const useAuthActions = () => {
  const actions = useAuthStore((state) => state.actions);

  return { ...actions };
};
