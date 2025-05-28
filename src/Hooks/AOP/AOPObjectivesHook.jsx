import { create } from "zustand";
import { read, post } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";


const useAOPObjectivesHooks = create((set, get) => ({
  aopObjectives: [],
  aopObjective: {},
  aop_summary: {},
  aop_timeline: [],

  actions: {
    getSummary: (callBack) => {
      read({
        url: API.AOP_APPLICATION_SUMMARY,
        failed: callBack,
        success: (res) => {
          // console.log(res)
          const {
            status,
            message,
            data,
          } = res;
          set({ aop_summary: data });
          callBack(status, message)
        }
      })
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
          callBack(status, message)
        }
      })
    },


    create: (form, callBack) => {
      post({
        url: API.AOP_APPLICATION_STORE,
        form: form,
        failed: callBack,
        success: (res) => {
          set({ aopObjectives: res.data });
          callBack(200, "Success");
          aopObjectives
        },
      });
    },

    getSingleAOP: (callBack) => {
      read({
        url: `${API.AOP_APPLICATION_EDIT}`,
        failed: callBack,
        success: (res) => {
          // console.log(res)
          set({ aopObjectives: res.data.data });
          callBack(200, "Success");
          aopObjectives
        }
      })
    }
  }

  // Delete an entire objective
  // deleteObjective: (id, objectives) => {
  //   set((state) => ({
  //     objectives: state.objectives.filter((row) => console.log(row)),
  //   }));
  // },

}));

export default useAOPObjectivesHooks

export const useAOPActions = () =>
  useAOPObjectivesHooks((state) => state.actions);
