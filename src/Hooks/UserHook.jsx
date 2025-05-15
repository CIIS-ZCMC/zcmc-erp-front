import { create } from "zustand";
import { API } from "../Data/constants";
import { read } from "../Services/RequestMethods";
import { mockUserData } from "../Data/TestData";

const useUserHook = create((set) => ({
  user: { ...mockUserData },

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
}));

export const useUserTypes = () => {
  const user = useUserHook((state) => state.user);
  return {
    isDivisionHead: user.position === "division",
    isPlanning: user.position === "planning",
  };
};

export default useUserHook;
