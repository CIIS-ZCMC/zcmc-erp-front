// Store/ItemRequestStore.js

import { create } from "zustand";
import { API } from "@Data/constants";
import { post, read, update } from "@Services/RequestMethods";

const useItemRequestHook = create((set, get) => ({
  requests: [],
  requestsByUser: [],
  isLoading: false,

  actions: {
    setIsLoading: (isLoading) => set({ isLoading }),

    getItemRequests: (params, callBack) => {
      set({ isLoading: true });

      read({
        url: API.ITEM_REQUESTS,
        params,
        failed: (error) => {
          set({ isLoading: false });
          callBack?.(false, error?.message || "Request failed");
        },
        success: (res) => {
          try {
            const {
              status,
              data: { data, message },
            } = res;

            set({ requests: data });
            callBack?.(status, message);
          } catch (error) {
            console.error("Error processing Item Requests:", error);
            callBack?.(false, error.message);
          } finally {
            set({ isLoading: false });
          }
        },
      });
    },

    getItemRequestByUser: (params, callBack) => {
      set({ isLoading: true });

      read({
        url: API.ITEM_REQUESTS_BY_USER,
        params,
        failed: (error) => {
          set({ isLoading: false });
          callBack?.(false, error?.message || "Request failed");
        },
        success: (res) => {
          try {
            const {
              status,
              data: { data, message },
            } = res;

            set({ requestsByUser: data });
            callBack?.(status, message);
          } catch (error) {
            console.error("Error processing Item Requests:", error);
            callBack?.(false, error.message);
          } finally {
            set({ isLoading: false });
          }
        },
      });
    },

    updateItemRequest: (item_request_id, body, callBack) => {
      set({ isLoading: true });

      update({
        url: `${API.APPROVAL_ITEM_REQUEST}/${item_request_id}`,
        form: body,
        failed: (status, message) => {
          set({ isLoading: false });
          callBack?.(status, message);
        },
        success: (res) => {
          try {
            const {
              status,
              data: { data, message },
            } = res;

            set((state) => ({
              requests: state.requests?.data
                ? {
                    ...state.requests,
                    data: state.requests.data.map((item) =>
                      item.id === data.id ? { ...item, ...data } : item,
                    ),
                  }
                : state.requests,

              requestsByUser: state.requestsByUser?.data
                ? {
                    ...state.requestsByUser,
                    data: state.requestsByUser.data.map((item) =>
                      item.id === data.id ? { ...item, ...data } : item,
                    ),
                  }
                : state.requestsByUser,
            }));

            callBack?.(status, message);
          } catch (error) {
            console.error("Error processing update response:", error);
            callBack?.(false, error);
          } finally {
            set({ isLoading: false });
          }
        },
      });
    },

    postItmRequest: (body, callBack) => {
      set({ isLoading: true });

      post({
        url: `item-request-store`,
        form: body,
        failed: (status, message) => {
          set({ isLoading: false });
          callBack?.(status, message);
        },
        success: ({ data: response, status }) => {
          const newItem = response?.data?.data?.[0];

          set((state) => ({
            requestsByUser: {
              ...state.requestsByUser,

              data: newItem
                ? [newItem, ...(state.requestsByUser?.data || [])]
                : state.requestsByUser?.data || [],

              total: (state.requestsByUser?.total || 0) + 1,
            },

            isLoading: false,
          }));

          callBack?.(status, response?.message, newItem);
        },
      });
    },

    cancelItemRequest: (item_request_id, body, callBack) => {
      set({ isLoading: true });

      update({
        url: `cancel-item-request/${item_request_id}`,
        form: body,

        failed: (error) => {
          set({ isLoading: false });

          callBack?.(false, error?.message || "Failed to cancel item request");
        },

        success: ({ data: response, status }) => {
          const cancelledItem = response?.data;
          set((state) => ({
            requestsByUser: {
              ...state.requestsByUser,

              data:
                state.requestsByUser?.data?.filter(
                  (item) => item.id !== cancelledItem?.id,
                ) || [],

              total: Math.max(0, (state.requestsByUser?.total || 1) - 1),
            },

            requests: {
              ...state.requests,

              data:
                state.requests?.data?.filter(
                  (item) => item.id !== cancelledItem?.id,
                ) || [],

              total: Math.max(0, (state.requests?.total || 1) - 1),
            },

            isLoading: false,
          }));
          callBack?.(status, response?.message, cancelledItem);
        },
      });
    },
  },
}));

export default useItemRequestHook;

export const useItemRequests = () =>
  useItemRequestHook((state) => state.requests);

export const useItemRequestsByUser = () =>
  useItemRequestHook((state) => state.requestsByUser);

export const useItemRequestLoading = () =>
  useItemRequestHook((state) => state.isLoading);

export const useItemRequestActions = () =>
  useItemRequestHook((state) => state.actions);
