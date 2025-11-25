import { API } from "../../Data/constants";

import { read } from '../../Services/RequestMethods';

import { useTimelinesActions } from "../../Store/TimelinesStore";

const useTimelineHook = () => {

    const { setTimelines, setApproverTimelines, setIsLoading } = useTimelinesActions();

    const getTimelines = (aopId, callBack) => {

        setIsLoading(true)

        try {
            read({
                url: `${API.APPROVAL_TIMELINE}/${aopId}`,
                failed: callBack,
                success: (res) => {
                    const {
                        status,
                        data: { data, message },
                    } = res;
                    setTimelines(data)
                    setIsLoading(false)
                    callBack(status, message)
                }
            });
        } catch (error) {
            console.error('Error fetching approval timelines:', error);
            callBack?.(false, error.message)
        }
    }

    const getApproverTimeline = (params, callBack) => {
        // console.log("Calling API...");
        setIsLoading(true);

        try {
            read({
                url: API.APPROVER_TIMELINE,
                params,
                failed: callBack,
                success: (res) => {
                    const { status, data: { data, message } } = res;

                    setTimelines(data);
                    callBack(status, message);
                },
                failed: (err) => {
                    console.error(err);
                    callBack(false, err);
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        getTimelines,
        getApproverTimeline,
    }

}

export default useTimelineHook;