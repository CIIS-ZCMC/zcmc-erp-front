import { API } from "../Data/constants";
import { read, post, update, remove } from "../Services/RequestMethods";

import useActivitiesStore, {
  useActivitiesActions,
} from "../Store/ActivitiesStore";

const useActivitiesHook = () => {
  const { applicationActivities } = useActivitiesStore();
  const {
    setApplicationActivities,
    setApplicationActivity,
    setIsEditLoading,
    setIsCreateLoading,
    setIsUpdateLoading,
  } = useActivitiesActions();

  const getActivities = (params, callBack) => {
    try {
      read({
        url: API.ACTIVITIES,
        failed: callBack,
        params,
        success: (res) => {
          const { status, data } = res;
          setApplicationActivities(data);
          callBack(status, data.message, data.pagination);
        },
      });
    } catch (error) {
      console.error("Error fetching application activities:", error);
      callBack?.(false, error.message);
    }
  };

  const showActivity = async (params, callBack) => {
    setIsEditLoading(true);
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
          setIsEditLoading(false);
          callBack(status, message);
        },
      });
    } catch (error) {
      console.error("Error fetching application activity:", error);
      setIsEditLoading(false);
      callBack?.(false, error.message);
    }
  };

  const createActivity = (body, callBack, options = {}) => {
    try {
      post({
        url: API.ACTIVITIES_STORE,
        form: body,
        failed: callBack,
        success: (res) => {
          const { status, data } = res;

          if (status === 201) {
            const lastPage =
              data?.pagination?.last_page ||
              data?.meta?.last_page ||
              options.page;

            options.setPage?.(lastPage);

            getActivities(
              {
                page: lastPage,
                search: options.search || "",
                per_page: options.perPage,
                application_objective_id: options.application_objective_id,
              },
              () => {
                callBack?.(status, data.message);
              },
            );

            return;
          }

          callBack?.(status, data.message);
        },
      });
    } catch (error) {
      console.error("Error Creating Activity:", error);
      callBack?.(false, error.message);
    }
  };

  const updateActivity = async (params, body, callBack) => {
    try {
      await update({
        url: `${API.ACTIVITY_EDIT}/${params.id}`,
        form: body,
        failed: callBack,
        success: (res) => {
          const { status, data } = res;
          console.log("Update Activity Response:", res);

          const updatedActivity = data.activities?.[0];

          if (status === 200 && updatedActivity) {
            setApplicationActivities((prev) => ({
              ...prev,
              activities: (prev?.activities || []).map((activity) =>
                activity.id === updatedActivity.id ? updatedActivity : activity,
              ),
            }));
          }

          callBack?.(status, data.message);
        },
      });
    } catch (error) {
      console.error("Error Update Activity:", error);
      callBack?.(false, error.message);
    }
  };

  const removeActivity = (params, callBack, options = {}) => {
    try {
      remove({
        url: `${API.ACTIVITIES_DELETE}/${params.id}`,
        failed: callBack,
        success: (res) => {
          const { status, data } = res;

          if (status === 200) {
            getActivities(
              {
                page: options.page,
                search: options.search,
                per_page: options.perPage,
                application_objective_id: options.application_objective_id,
              },
              () => {
                callBack?.(status, data.message);
              },
            );

            return;
          }

          callBack?.(status, data.message);
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
