import { create } from "zustand";
import { post } from "../Services/RequestMethods";
import { API } from "../Data/constants";

const useCommentHook = create((set) => ({
  comment: "",

  actions: {
    setComment: (data) => set({ comment: data }),
    postComment: (body, callback) => {
      try {
        const dataToSubmit = new FormData();

        dataToSubmit.append("comment", body.comment);
        dataToSubmit.append("activity_id", body.activityId);

        post({
          url: API.COMMENT,
          form: dataToSubmit,
          success: (response) => {
            const { data } = response.data;
            set({ activity: data });

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
  },
}));

export const useComment = () => useCommentHook((state) => state.comment);

export const useCommentActions = () => useCommentHook((state) => state.actions);
