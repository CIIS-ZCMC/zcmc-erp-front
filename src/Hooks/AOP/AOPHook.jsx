import { API } from "../../Data/constants";
import { read, post } from "../../Services/RequestMethods";

import { useAOPActions } from "../../Store/AOPStore";

const useAOPHook = () => {
    const { setAop } = useAOPActions();

    const getAOP = async (callBack) => {
        try {
            await read({
                url: API.AOP_APPLICATIONS,
                failed: callBack,
                success: (res) => {
                    const {
                        status,
                        message,
                        data: { data },
                    } = res;
                    setAop(data);
                    callBack(status, message);
                },
            });
        } catch (error) {
            console.error("Error fetching AOP:", error);
            callBack(false, error.message);
        }
    };

    const createAOP = async (body, callBack) => {
        try {
            await post({
                url: API.AOP_APPLICATIONS_STORE,
                form: body,
                failed: callBack,
                success: (res) => {
                    const {
                        status,
                        message,
                        data: { data },
                    } = res;
                    setAop(data)
                    callBack(status, message);
                },
            })
        }
        catch (error) {
            console.error("Error Creating AOP:", error);
            callBack(false, error.message);
        }
    };

    return {
        getAOP,
        createAOP,
    };

}

export default useAOPHook