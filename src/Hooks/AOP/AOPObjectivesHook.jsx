import { create } from "zustand";
import { read, post, update, download } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";

const useAOPObjectivesHooks = create((set, get) => ({
  aopObjectives: [],
  aopObjective: {},
  aop_summary: {},
  aop_timeline: [],
  mission: "",
  aop_id: null,

  actions: {
    setAopObjectives: (data) => {
      set(() => ({
        aopObjectives: data,
      }));
    },

    setAopId: (id) => {
      localStorage.setItem("aop-application-id", id);
      set({ aop_id: id });
    },

    getSummary: (callBack) => {
      read({
        url: API.AOP_APPLICATION_SUMMARY,
        failed: callBack,
        success: (res) => {
          // console.log(res)
          const { status, message, data } = res;
          set({ aop_summary: data });
          callBack(status, message);
        },
      });
    },

    getTimeline: (callBack) => {
      read({
        url: API.AOP_APPLICATION_TIMELINE,
        failed: callBack,
        success: (res) => {
          // console.log(res);
          const {
            status,
            message,
            data: { data },
          } = res;
          set({ aop_timeline: data });
          callBack(status, message);
        },
      });
    },

    getSingleAOP: (id, callBack) => {
      read({
        url: `${API.AOP_APPLICATION_EDIT}/${id}`,
        failed: callBack,

        success: (res) => {
          const { data } = res.data;
          set({ aopObjectives: data, aop_id: data.aop_application_id });
          callBack(200, "Success");
        },
      });
    },

    create: (form, callBack) => {
      post({
        url: API.AOP_APPLICATION_STORE,
        form: form,
        failed: callBack,
        success: (res) => {
          set({ aopObjectives: res.data });
          callBack(200, "Success");
        },
      });
    },

    updateAOP: (form, params, callBack) => {
      update({
        url: `${API.AOP_APPLICATION_UPDATE}/${params}`,
        form: form,
        failed: callBack,
        success: (res) => {
          set({ aopObjectives: res.data });
          callBack(200, "Success");
        },
      });
    },

    exportAsExcel: (id, callBack = () => { }) => {
      download({
        url: `${API.AOP_EXPORT_EXCEL}/${id}`,
        title: "AOP Excel Export",
        fileName: `aop-export-${id}.xlsx`,
        failed: (status, message) => {
          if (callBack) callBack(status, message);
        },
        success: (status, message) => {
          if (callBack) callBack(status, message);
        },
      });
    },
  },
}));

export default useAOPObjectivesHooks;

export const useAOPActions = () =>
  useAOPObjectivesHooks((state) => state.actions);

export const useSetAOPID = () =>
  useAOPObjectivesHooks((state) => state.actions);

