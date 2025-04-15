import { create } from 'zustand';
import axios from "axios";
import { API } from '../Data/constants';
import { read } from "../Services/RequestMethods";

const useAOPHook = create((set) => ({
    aop_objectives: [],

    // // methods
    // getAOPApplications: (callBack) => {
    //     read({
    //         url: API.AOP_APPLICATIONS,
    //         failed: callBack,
    //         success: (res) => {
    //             const { status, message, data: { data } } = res;
    //             set({ aop_applications: data });
    //             callBack(status, message);
    //         }
    //     })
    // },


}));

export default useAOPHook