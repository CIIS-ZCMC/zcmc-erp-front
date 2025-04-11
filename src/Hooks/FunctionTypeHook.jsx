import { create } from "zustand";
import { API } from "../Data/constants";
import { read } from "../Services/RequestMethods";

const useFunctionTypeHook = create((set) => ({
    function_types: [],

    getFunctionType: (params, callBack) => {
        read({

            url: API.TYPE_OF_FUNCTIONS,
            params: params,
            failed: callBack,
            success: (res) => {
                const { status, message, data: { data } } = res;
                set({ function_type: data });
                callBack(status, message);
            }
        })
    }

}));

export default useFunctionTypeHook