import { create } from "zustand";
import { erp_api } from "../Services/ERP_API";

const useCommentHook = create((set) => ({
  comment: "",

  actions: {
    setComment: (data) => set({ comment: data }),
    postComment: (body, callback) => {
      try {
        const dataToSubmit = new FormData();

        dataToSubmit.append("comment", body.comment);
        dataToSubmit.append("activity_id", body.activityId);

        return erp_api
          .post(`/activity-comments`, dataToSubmit)
          .then((response) => {
            const { data } = response.data;
            set({ activity: data });

            callback(response.status, data);
          })
          .catch((error) => {
            console.error("Error fetching activity:", error);
            return callback(
              error?.status || 500,
              error?.response || "Unknown error occurred"
            );
          });
      } catch (error) {
        console.error("Error posting comment:", error);
        return callback(
          error?.status || 500,
          error?.response || "Unknown error occurred"
        );
      }
    },
  },
}));

export const useComment = () => useCommentHook((state) => state.comment);

export const useCommentActions = () => useCommentHook((state) => state.actions);
