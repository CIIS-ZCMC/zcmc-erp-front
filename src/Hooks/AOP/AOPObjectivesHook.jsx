import { create } from "zustand";
import { API } from "../../Data/constants";
import { post } from "../../Services/RequestMethods";


const useAOPObjectivesHooks = create((set, get) => ({
  aopObjectives: [],

  // Delete an entire objective
  deleteObjective: (id) => {
    set((state) => ({
      aopObjectives: state.aopObjectives.filter((row) => console.log(row)),
    }));
  },
}));

export default useAOPObjectivesHooks;
