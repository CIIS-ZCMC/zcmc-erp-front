import { create } from "zustand";

const usePPMPApplicationHook = create(() => ({
  ppmpApplications: [],
  ppmpApplication: null,

  actions: {
    getPPMPApplications: (callback) => {},
  },
}));
