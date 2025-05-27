import { create } from "zustand";
import { read, post, update } from "../../Services/RequestMethods";
import { API } from "../../Data/constants";

const useDeadlinesHook = create((set) => ({

    deadlines: [],

    actions: {
        // get deadlines based on aop or ppmp
        getDeadlines: (params, callback) => {
            read({
                url: API.DEADLINES,
                params: params,
                failed: callback,
                success: (res) => {
                    console.log(res)
                    const {
                        status,
                        message,
                        data: { data },
                    } = res;
                    set({ deadlines: data });
                    callBack(status, message);
                }
            })
        },

        //create aop deadline
        createAopDeadline: (params, form, callback) => {
            post({
                url: API.AOP_DEADLINE_STORE,
                params: params,
                form: form,
                failed: callback,
                success: (res) => {
                    set({ deadlines: res.data });
                    callBack(200, 'Success');
                    deadlines
                }
            })
        },

        //update aop deadline
        updateAopDeadline: (params, form, callback) => {
            update({
                url: `${API.AOP_DEADLINE_UPDATE}/${id}`,
                params: params,
                form: form,
                failed: callback,
                success: (res) => {
                    set({ deadlines: res.data });
                    callBack(200, 'Success');
                    deadlines
                }
            })
        },

        //create ppmp deadline
        createPpmpDeadline: (params, form, callback) => {
            post({
                url: API.PPMP_DEADLINE_STORE,
                params: params,
                form: form,
                failed: callback,
                success: (res) => {
                    set({ deadlines: res.data });
                    callBack(200, 'Success');
                    deadlines
                }
            })
        },

        //update ppmp deadline
        updateAopDeadline: (id, params, form, callback) => {
            update({
                url: `${API.PPMP_DEADLINE_UPDATE}/${id}`,
                params: params,
                form: form,
                failed: callback,
                success: (res) => {
                    set({ deadlines: res.data });
                    callBack(200, 'Success');
                    deadlines
                }
            })
        },

    }
}))

export default useDeadlinesHook;

export const useDeadlinesActions = () =>
    useDeadlinesHook((state) => state.actions);

