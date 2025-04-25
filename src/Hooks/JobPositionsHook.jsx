import { create } from "zustand";
import { API } from "../Data/constants";
import { read } from "../Services/RequestMethods";

const useJobPositionsHook = create((set) => ({
    jobPositions: [],

    getJobPositions: (callBack) => {
        read({
            url: API.JOB_POSITIONS,
            failed: callBack,
            success: (res) => {
                const { status, message, data: { data } } = res;
                set({ jobPositions: data });
                callBack(status, message);
            }
        })
    }
}))

export default useJobPositionsHook;