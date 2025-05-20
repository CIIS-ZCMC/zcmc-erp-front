import { create } from "zustand";
import { API } from "../Data/constants";
import { read } from "../Services/RequestMethods";

const usePurchaseTypeHook = create((set) => ({
    purchase_type: [],

    getPurchaseType: (params, callBack) => {
        read({
            url: API.TYPE_OF_PURCHASE,
            params: params,
            failed: callBack,
            success: (res) => {
                // console.log(res.data.data)
                const { status, message, data: { data } } = res;
                set({ purchase_type: data });
                callBack(status, message);
            }
        })
    }

}));

export default usePurchaseTypeHook