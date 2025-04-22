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
                // console.log(res.data.data)
                const { status, message, data: { data } } = res;
                set({ function_types: data });
                callBack(status, message);
            }
        })
    }

}));

export default useFunctionTypeHook