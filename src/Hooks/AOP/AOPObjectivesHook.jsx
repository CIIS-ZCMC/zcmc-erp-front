import { create } from "zustand";

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
