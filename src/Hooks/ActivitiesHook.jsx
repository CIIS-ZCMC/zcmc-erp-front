import { API } from "../Data/constants";
import { read, post, update, remove } from "../Services/RequestMethods";

import useActivitiesStore, {
  useActivitiesActions,
} from "../Store/ActivitiesStore";

const useActivitiesHook = () => {
  const { applicationActivities } = useActivitiesStore();
  const { setApplicationActivities, setApplicationActivity } =
    useActivitiesActions();

  const getActivities = (params, callBack) => {
    try {
      read({
        url: API.ACTIVITIES,
        failed: callBack,
        params,
        success: (res) => {
          console.log(res);
          const { status, data } = res;
          setApplicationActivities(data);
          callBack(status, data.message);
        },
      });
    } catch (error) {
      console.error("Error fetching application activities:", error);
      callBack?.(false, error.message);
    }
  };

  const showActivity = async (params, callBack) => {
    try {
      await read({
        url: `${API.ACTIVITY_SHOW}/${params.id}`,
        failed: callBack,
        success: (res) => {
          const {
            status,
            data: { data, message },
          } = res;
          setApplicationActivity(data);
          callBack(status, message);
        },
      });
    } catch (error) {
      console.error("Error fetching application activity:", error);
      callBack?.(false, error.message);
    }
  };

  const createActivity = (body, callBack) => {
    try {
      post({
        url: API.ACTIVITIES_STORE,
        form: body,
        failed: callBack,
        success: async (res) => {
          console.log(res.data);
          const {
            status,
            data: { data, message },
          } = res;
          if (status === 201) {
            const fetchParams = {
              application_objective_id: data[0].application_objective_id,
            };

            getActivities(fetchParams, (status, message) => {
              if (!(status >= 200 && status < 300)) {
                console.error("Failed to refresh activities:", message);
              }
            });
          }
          callBack?.(status, message);
        },
      });
    } catch (error) {
      console.error("Error Creatin Objective:", error);
      callBack(false, error.message);
    }
  };

  const updateActivity = async (params, body, callBack) => {
    try {
      await update({
        url: `${API.ACTIVITY_EDIT}/${params.id}`,
        form: body,
        failed: callBack,
        success: async (res) => {
          const {
            status,
            data: { data, message },
          } = res;

          if (status === 200) {
            const fetchParams = {
              application_objective_id: data.application_objective_id,
            };

            getActivities(fetchParams, (status, message) => {
              if (!(status >= 200 && status < 300)) {
                console.error("Failed to refresh activities:", message);
              }
            });
          }

          callBack?.(status, message);
        },
      });
    } catch (error) {
      console.error("Error Update Activity:", error);
      callBack(false, error.message);
    }
  };

  const removeActivity = (params, callBack) => {
    try {
      remove({
        url: `${API.ACTIVITIES_DELETE}/${params.id}`,
        failed: callBack,
        success: (res) => {
          const {
            status,
            data: { message },
          } = res;

          console.log("removeActivity response:", res);

          // Remove activity from state
          const newActivities = applicationActivities.activities.filter(
            (activity) => activity.id !== params.id,
          );

          setApplicationActivities({
            ...applicationActivities,
            activities: newActivities,
            meta: {
              ...applicationActivities.meta,
              total_activities: newActivities.length,
            },
          });

          console.log("Deleting activity ID:", params.id);
          console.log("New activities array:", newActivities);
          callBack?.(status, message);
        },
      });
    } catch (error) {
      console.error("Error Deleting Activity:", error);
      callBack?.(false, error.message);
    }
  };

  return {
    getActivities,
    showActivity,
    createActivity,
    updateActivity,
    removeActivity,
  };
};

export default useActivitiesHook;
