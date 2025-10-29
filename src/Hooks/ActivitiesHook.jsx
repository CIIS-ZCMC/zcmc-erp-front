import { API } from "../Data/constants";
import { read, post, remove, } from '../Services/RequestMethods';

import useActivitiesStore, { useActivitiesActions } from "../Store/ActivitiesStore";


const useActivitiesHook = () => {

    const { applicationActivities } = useActivitiesStore();
    const { setApplicationActivities, setApplicationAcivity } = useActivitiesActions();

    const getActivities = (params, callBack) => {
        try {
            read({
                url: API.ACTIVITIES,
                failed: callBack,
                params,
                success: (res) => {
                    // console.log(res.data.activities)
                    const {
                        status,
                        data: { activities, message },
                    } = res;
                    setApplicationActivities(Array.isArray(activities) ? activities : []);
                    callBack(status, message)
                }
            });
        } catch (error) {
            console.error('Error fetching application activities:', error);
            callBack?.(false, error.message)
        }
    };

    const createActivity = (body, callBack) => {
        try {
            post({
                url: API.ACTIVITIES_STORE,
                form: body,
                failed: callBack,
                success: async (res) => {
                    console.log(res)
                    const {
                        status,
                        data: { message },
                    } = res;
                    if (status === 201) {
                        getActivities()
                    }
                    callBack?.(status, message);
                },
            })
        }
        catch (error) {
            console.error("Error Creatin Objective:", error);
            callBack(false, error.message);
        }
    }

    const removeActivity = (params, callBack) => {
        try {
            remove({
                url: `${API.ACTIVITIES_DELETE}/${params.id}`,
                params: params,
                failed: callBack,
                success: (res) => {
                    const {
                        status,
                        data: { message },
                    } = res;

                    if (status === 200) {
                        const updatedActivities = applicationActivities.filter(
                            (obj) => obj.id !== params.id
                        );
                        setApplicationActivities(updatedActivities);
                    }
                    callBack?.(status, message);
                },
            })
        }
        catch (error) {
            console.error("Error Deleting Objective:", error);
            callBack(false, error.message);
        }
    }

    return {
        getActivities,
        createActivity,
        removeActivity,
    }
}

export default useActivitiesHook;