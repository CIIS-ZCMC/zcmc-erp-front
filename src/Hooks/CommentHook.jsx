import { create } from "zustand";
import { post, read } from "../Services/RequestMethods";
import {
  localStorageGetter,
  localStorageRemove,
  localStorageSetter,
} from "../Utils/LocalStorage";

export const COMMENT = "activity-comments";

const useCommentHook = create((set, get) => ({
  comments: [],
  allComments: [],
  comment: "",
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
          localStorageSetter("comments", comments.length === 0 ? [] : comments);
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
        url: `${COMMENT}`,
        params: {
          aop_application_id: localStorageGetter("aop_application_id"),
        },
        success: (response) => {
          const { data } = response.data;
          set({ allComments: data });
          callback(response.status, data);
        },
        failed: (response) => {
          set({ allComments: [] });
          callback(response);
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
        console.error("Error posting comment:", error);
        return callback(
          error?.status || 500,
          error?.response || "Unknown error occurred"
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
export const useAllComments = () =>
  useCommentHook((state) => state.allComments);
export const useCommentActions = () => useCommentHook((state) => state.actions);
