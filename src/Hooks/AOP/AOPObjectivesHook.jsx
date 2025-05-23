import { create } from "zustand";
import { post } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";

const useAOPObjectivesHooks = create((set, get) => ({
  aopObjectives: [],

  create: (form, callBack) => {
    post({
      url: API.AOP_APPLICATIONS_STORE,
      form: form,
      failed: callBack,
      success: (res) => {
        set({ aopObjectives: res.data });
        callBack(200, "Success");
        aopObjectives
      },
    });
  },

  // Delete an entire objective
  // deleteObjective: (id, objectives) => {
  //   set((state) => ({
  //     objectives: state.objectives.filter((row) => console.log(row)),
  //   }));
  // },

}));

export default useAOPObjectivesHooks;
