import { create } from "zustand";
import { API } from "../Data/constants";
import { read, post } from "../Services/RequestMethods";

const useUserHook = create((set) => ({
  users: [],

  getUsers: (callBack) => {
    read({
      url: API.USERS,
      failed: callBack,
      success: (res) => {
        const { status, message, data } = res;
        set({ users: data });
        callBack(status, message);
      },
    });
  },

  getAuthorized: (pin, Callback) => {
    if (pin == "12345") {
      Callback(true);
      return;
    }
    Callback(false);
  },

}));

export const useUserTypes = () => {
  const user = useUserHook((state) => state.user);
  return {
    isDivisionHead: user.position === "division",
    isPlanning: user.position === "planning",
  };
};

export default useUserHook;
