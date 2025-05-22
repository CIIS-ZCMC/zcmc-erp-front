import { create } from "zustand";
import { post } from "../../Services/RequestMethods";

const useAOPObjectivesHooks = create((set, get) => ({
  aopObjectives: [],

  // Delete an entire objective
  deleteObjective: (id) => {
    set((state) => ({
      aopObjectives: state.aopObjectives.filter((row) => console.log(row)),
    }));
  },
  create: (form, callBack) => {
    post({
      url: "aop-objectives-store",
      form: form,
      failed: callBack,
      success: (res) => {
        set({ aopObjectives: res.data });
        callBack(200, "Success");
      },
    });
  },
}));

export default useAOPObjectivesHooks;
