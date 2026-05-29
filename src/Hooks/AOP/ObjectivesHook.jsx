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
    setIsObjectiveLoading,
    setIsIndicatorLoading,
    setIsShowLoading,
    setObjectiveByType,
    setSuccessIndicatorByObjective,
    setIsBtnLoading,
  } = useObjectivesActions();
  const { setFeedback } = useFeedbackStoreActions();

  const getObjectives = async (id, callBack) => {
    setIsLoading(true);
    try {
      const res = await request(({ success, failed }) =>
        read({
          url: `${API.OBJECTIVES}/${id}`,
          success,
          failed,
        }),
      );

      const {
        status,
        data: { data, message },
      } = res;

      const transformedData = {
        ...data,
        activity_comments:
          data?.data?.flatMap((obj) => obj.comments || []) || [],
        application_timelines: data?.data || [],
      };

      setFeedback(transformedData);
      callBack?.(status, message);
    } catch (error) {
      console.error("Error fetching application objectives:", error);
      callBack?.(false, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getObjectivesByFunctionType = async (id, callBack) => {
    setIsObjectiveLoading(true);

    try {
      const res = await new Promise((resolve, reject) => {
        read({
          url: API.OBJECTIVE_BY_FUNCTION_TYPE,
          params: { type_id: id },
          success: resolve,
          failed: reject,
        });
      });

      const {
        status,
        data: { data, message },
      } = res;

      setObjectiveByType(data);
      callBack?.(status, message);
    } catch (error) {
      console.error("Error fetching objectives by function type:", error);
      callBack?.(false, error.message);
    } finally {
      setIsObjectiveLoading(false);
    }
  };

  const getSuccessIndicatorsByObjective = async (id, callBack) => {
    setIsIndicatorLoading(true);

    try {
      const res = await new Promise((resolve, reject) => {
        read({
          url: API.SUCCESS_INDICATOR_BY_OBJECTIVE,
          params: { objective_id: id },
          success: (res) => resolve(res),
          failed: (err) => reject(err),
        });
      });

      const {
        status,
        data: { data, message },
      } = res;

      setSuccessIndicatorByObjective(data);
      callBack?.(status, message);
    } catch (error) {
      console.error("Error fetching success indicators:", error);
      callBack?.(false, error.message);
    } finally {
      setIsIndicatorLoading(false);
    }
  };

  const getObjectivesBySector = async (params = {}, callBack) => {
    setIsLoading(true);

    try {
      await new Promise((resolve, reject) => {
        read({
          url: API.OBJECTIVE_BY_SECTOR,
          params,
          success: (res) => {
            const {
              status,
              data: { data, message, pagination },
            } = res;

            const { aop_application, application_objectives } = data;

            setAopApplication(aop_application);
            setApplicationObjectives(application_objectives);

            callBack?.(status, message, pagination);
            resolve(res);
          },
          failed: (err) => {
            callBack?.(false, err?.message);
            reject(err);
          },
        });
      });
    } catch (error) {
      console.error("Error fetching application objectives:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showObjective = async (params, callBack) => {
    setIsShowLoading(true);

    try {
      await new Promise((resolve, reject) => {
        read({
          url: `${API.OBJECTIVE_SHOW}/${params.id}`,
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
            resolve(res);
          },
          failed: (err) => {
            callBack?.(false, err?.message);
            reject(err);
          },
        });
      });
    } catch (error) {
      console.error("Error fetching objective:", error);
    } finally {
      setIsShowLoading(false);
    }
  };

  const createObjective = async (body, callBack) => {
    setIsBtnLoading(true);

    try {
      const res = await new Promise((resolve, reject) => {
        post({
          url: API.OBJECTIVE_STORE,
          form: body,
          success: resolve,
          failed: (res, message) => {
            reject({ res, message });
          },
        });
      });

      const {
        status,
        data: {
          message,
          data: { application_objective },
        },
      } = res;

      console.log("application_objective", application_objective);
      if (status === 201) {
        setApplicationObjectives((prev) => [...prev, application_objective]);
      }
      callBack?.(status, message);
    } catch ({ res, message }) {
      console.error("Failed to create objective:", message);
      callBack?.(res, message);
    } finally {
      setIsBtnLoading(false);
    }
  };

  const updateObjective = async (params, body, callBack) => {
    setIsBtnLoading(true);

    try {
      const res = await new Promise((resolve, reject) => {
        update({
          url: `${API.OBJECTIVE_EDIT}/${params.id}`,
          form: body,
          success: resolve,
          failed: (res, message) => {
            reject({ res, message });
          },
        });
      });

      const {
        status,
        data: { message, data },
      } = res;

      if (status === 200) {
        setApplicationObjectives((prev) =>
          prev.map((obj) => (obj.id === data.id ? data : obj)),
        );
      }

      callBack?.(status, message);
    } catch ({ res, message }) {
      console.error("Error updating objective:", message);
      callBack?.(res, message);
    } finally {
      setIsBtnLoading(false);
    }
  };

  const removeObjective = async (params, callBack) => {
    setIsBtnLoading(true);

    try {
      await new Promise((resolve, reject) => {
        remove({
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
            resolve(res);
          },
          failed: (err) => {
            callBack?.(false, err?.message);
            reject(err);
          },
        });
      });
    } catch (error) {
      console.error("Error Deleting Objective:", error);
    } finally {
      setIsBtnLoading(false);
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
