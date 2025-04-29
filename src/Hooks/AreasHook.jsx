import { create } from "zustand";
import { API } from "../Data/constants";
import { read } from "../Services/RequestMethods";

const useAreasHook = create((set) => ({
    areas: [],

    getAreas: (callBack) => {
        read({
            url: API.AREAS,
            failed: callBack,
            success: (res) => {
                const { status, message, data } = res;
                set({ areas: data });
                callBack(status, message);
            }
        })
    }
}))

export default useAreasHook;