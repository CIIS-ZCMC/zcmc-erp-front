import { create } from "zustand";
import { post, read } from "../Services/RequestMethods";
import {
  localStorageGetter,
  localStorageRemove,
  localStorageSetter,
} from "../Utils/LocalStorage";
// import { APPLICATION_ID } from "./AOP/AOPApplicationsHook";

export const COMMENT = "activity-comments";
export const AOP_COMMENTS = "aop-comments";
export const REMARKS = "aop-remarks";

const useCommentHook = create((set, get) => ({
  comments: [],
  allComments: localStorageGetter("all_comments") ?? [],
  comment: "",
  remarks: localStorageGetter("remarks") ?? [],
  isLoading: false,

  actions: {
    setComment: (data) => set({ comment: data }),
    setIsLoading: (load) => set({ isLoading: load }),

    getCommentsByActivity: (id, callback) => {
      read({
        url: `${COMMENT}/${id}`,
        success: (response) => {
          const {
            data: { comments },
          } = response.data;
          set({ comments: comments });
          callback(response.status, comments);
        },
        failed: () => {
          set({ comments: [] });
          localStorageRemove("comments");
        },
      });
    },

    getCommentsByApplication: (id, callback) => {
        read({
          url: `${AOP_COMMENTS}`,
          params: {
            aop_application_id: id,
          },
          success: (response) => {
            // API may return an array or an object with a 'comments' field.
            const payload = response.data?.data;
            const comments = Array.isArray(payload) ? payload : payload?.comments ?? [];
            set({ allComments: comments });
            // Persist the fresh comment list (empty array clears previous data)
            localStorageSetter("all_comments", comments);
            callback?.(response.status, comments);
          },
          failed: () => {
            // Ensure stale comments are cleared on failure
            set({ allComments: [] });
            localStorageRemove("all_comments");
            if (typeof callback === "function") {
              callback(500, []);
            }
          },
        });
    },

    getRemarksByApplication: (id, callback) => {
        read({
          url: `${REMARKS}/${id}`,
          success: (response) => {
            const payload = response.data?.data;
            const remarks = payload?.remarks ?? [];
            set({ remarks });
            // Store the raw remarks array (empty clears previous)
            localStorageSetter("remarks", remarks);
            callback?.(response.status, remarks);
          },
          failed: (response) => {
            // Clear stale remarks on failure
            set({ remarks: [] });
            localStorageRemove("remarks");
            if (typeof callback === "function") {
              callback(response?.status ?? 500, []);
            }
          },
        });
    },

    postComment: (body, callback) => {
      try {
        const {
          actions: { appendNewComment },
        } = get();
        const dataToSubmit = new FormData();

        dataToSubmit.append("comment", body.comment);
        dataToSubmit.append("activity_id", body.activityId);

        post({
          url: COMMENT,
          form: dataToSubmit,
          success: (response) => {
            const { data } = response.data;

            appendNewComment(data);

            callback(response.status, data);
          },
          failed: callback,
        });
      } catch (error) {
        return callback(
          error?.status || 500,
          error?.response || "Unknown error occurred",
        );
      }
    },

    appendNewComment: (data) => {
      set((state) => ({ comments: [data, ...state.comments] }));
    },
  },
}));

export const useCommentLoading = () =>
  useCommentHook((state) => state.isLoading);
export const useComment = () => useCommentHook((state) => state.comment);
export const useComments = () => useCommentHook((state) => state.comments);
export const useRemarks = () => useCommentHook((state) => state.remarks);
export const useAllComments = () =>
  useCommentHook((state) => state.allComments);
export const useCommentActions = () => useCommentHook((state) => state.actions);
