import { API } from "../Data/constants";
import { read } from "../Services/RequestMethods";

import { useJobPositionActions } from "../Store/JobPositionsStore";

const useJobPositionsHook = () => {

    const { setJobPositions } = useJobPositionActions();

    const getJobPositions = (callBack) => {
        try {
            read({
                url: API.JOB_POSITIONS,
                failed: callBack,
                success: (res) => {
                    const { status, message, data: { data } } = res;
                    setJobPositions(data);
                    callBack(status, message);
                }
            });
        } catch (error) {
            console.error("Error fetching job positions:", error);
            callBack(false, error.message);
        }

    };

    return {
        getJobPositions
    }

}


export default useJobPositionsHook;