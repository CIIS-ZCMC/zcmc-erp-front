import { API } from "../../Data/constants";
import { read, post, update, remove } from "../../Services/RequestMethods";

import {
  useApplicationObjectives,
  useObjectiveByType,
  useObjectivesActions,
} from "../../Store/ObjectivesStore";
import { useFeedbackStoreActions } from "../../Store/FeedbackStore";
// import { GetUserObjectives } from "@Services/ObjectiveServices";

const useObjectivesHook = () => {
  const applicationObjectives = useApplicationObjectives();
  const objectiveByType = useObjectiveByType();

  const {
    setApplicationObjectives,
    setApplicationObjective,
    setFunctionType,
    setObjective,
    setSuccessIndicator,
    setOtherObjective,
    setOtherSuccessIndicator,
    setAopApplication,
    setIsLoading,
    setObjectiveByType,
    setSuccessIndicatorByObjective,
  } = useObjectivesActions();
  const { setFeedback } = useFeedbackStoreActions();

  const getObjectives = async (id, callBack) => {
    try {
      await read({
        url: `${API.OBJECTIVES}/${id}`,
        failed: callBack,
        success: (res) => {
          const {
            status,
            data: { data, message },
          } = res;
          // Transform data structure: flatten comments from objectives
          const transformedData = {
            ...data,
            activity_comments:
              data?.data?.flatMap((obj) => obj.comments || []) || [],
            application_timelines: data?.data || [],
          };
          setFeedback(transformedData); // get the objectives data and set to feedback so we can access the comments and remarks data
          callBack(status, message);
        },
      });
    } catch (error) {
      console.error("Error fetching application objectives:", error);
      callBack?.(false, error.message);
    }
  };
  const getObjectivesByFunctionType = async (id, callBack) => {
    setIsLoading(true);
    try {
      await read({
        url: API.OBJECTIVE_BY_FUNCTION_TYPE,
        params: { type_id: id },
        failed: callBack,
        success: (res) => {
          const {
            status,
            data: { data, message },
          } = res;

          setObjectiveByType(data);
          callBack?.(status, message);
        },
      });
    } catch (error) {
      console.error("Error fetching objectives by function type:", error);
      callBack?.(false, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getSuccessIndicatorsByObjective = async (id, callBack) => {
    setIsLoading(true);
    try {
      await read({
        url: API.SUCCESS_INDICATOR_BY_OBJECTIVE,
        params: { objective_id: id },
        failed: callBack,
        success: (res) => {
          const {
            status,
            data: { data, message },
          } = res;

          setSuccessIndicatorByObjective(data);
          callBack?.(status, message);
        },
      });
    } catch (error) {
      console.error("Error fetching success indicators:", error);
      callBack?.(false, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getObjectivesBySector = async (callBack) => {
    setIsLoading(true);
    try {
      await read({
        url: API.OBJECTIVE_BY_SECTOR,
        failed: callBack,
        success: (res) => {
          const {
            status,
            data: { data, message },
          } = res;

          const { aop_application, application_objectives } = data;

          setAopApplication(aop_application);
          setApplicationObjectives(application_objectives);

          callBack?.(status, message);
        },
      });
    } catch (error) {
      console.error("Error fetching application objectives:", error);
      callBack?.(false, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const showObjective = async (params, callBack) => {
    setIsLoading(true);
    try {
      await read({
        url: `${API.OBJECTIVE_SHOW}/${params.id}`,
        failed: callBack,
        success: (res) => {
          const {
            status,
            data: { data, message },
          } = res;

          setApplicationObjective(data);
          setFunctionType(data?.type || null);
          setObjective(data?.selected_objective || null);
          setSuccessIndicator(data?.selected_success_indicator || null);
          setOtherObjective(
            data?.custom_objective_details?.custom_objective_description ||
              null,
          );
          setOtherSuccessIndicator(
            data?.custom_success_indicator_details
              ?.custom_success_indicator_description || null,
          );

          callBack?.(status, message);
        },
      });
    } catch (error) {
      console.error("Error fetching objective:", error);
      callBack?.(false, error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const createObjective = async (body, callBack) => {
    setIsLoading(true);
    try {
      await post({
        url: API.OBJECTIVE_STORE,
        form: body,
        success: async (res) => {
          const {
            status,
            data: { message },
          } = res;
          if (status === 201) {
            await getObjectivesBySector(); // refresh list
          }
          callBack?.(status, message);
        },
        failed: (res, message) => {
          console.error("Failed to create objective:", message);
          callBack?.(res, message);
        },
      });
    } catch (error) {
      console.error("Error creating objective:", error);
      callBack?.(false, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateObjective = async (params, body, callBack) => {
    setIsLoading(true);
    try {
      await update({
        url: `${API.OBJECTIVE_EDIT}/${params.id}`,
        form: body,
        success: async (res) => {
          const {
            status,
            data: { message },
          } = res;
          if (status === 200) {
            await getObjectivesBySector(); // refresh data
          }
          callBack?.(status, message);
        },
        failed: (res, message) => {
          console.error("Failed to update objective:", message);
          callBack?.(res, message);
          // no need to setIsLoading here because finally handles it
        },
      });
    } catch (error) {
      console.error("Error updating objective:", error);
      callBack?.(false, error.message);
    } finally {
      setIsLoading(false); // ✅ always stops loading
    }
  };

  const removeObjective = async (params, callBack) => {
    setIsLoading(true);
    try {
      await remove({
        url: `${API.OBJECTIVE_DELETE}/${params.id}`,
        params,
        success: (res) => {
          const {
            status,
            data: { message },
          } = res;

          if (status === 200) {
            setApplicationObjectives(
              applicationObjectives.filter((obj) => obj.id !== params.id),
            );
          }

          callBack?.(status, message);
        },
        failed: callBack,
      });
    } catch (error) {
      console.error("Error Deleting Objective:", error);
      callBack(false, error.message);
    } finally {
      setIsLoading(false); // ✅ always executed
    }
  };

  return {
    getObjectives,
    getObjectivesBySector,
    getObjectivesByFunctionType,
    getSuccessIndicatorsByObjective,
    showObjective,
    createObjective,
    updateObjective,
    removeObjective,
  };
};

export default useObjectivesHook;
