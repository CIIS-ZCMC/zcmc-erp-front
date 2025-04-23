import { create } from "zustand";
import { API } from "../Data/constants";
import { read } from "../Services/RequestMethods";

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
            }
        })
    }

}));

export default useUserHook