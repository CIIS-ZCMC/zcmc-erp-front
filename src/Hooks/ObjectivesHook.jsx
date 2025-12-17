import { API } from "../Data/constants";
import { read, post, update, remove } from "../Services/RequestMethods";

import { useApplicationObjectives, useObjectivesActions } from "../Store/ObjectivesStore";
import { useFeedbackStoreActions } from "../Store/FeedbackStore";
// import { GetUserObjectives } from "@Services/ObjectiveServices";

const useObjectivesHook = () => {

  const applicationObjectives = useApplicationObjectives();

  const { setApplicationObjectives, setApplicationObjective, setAopApplication, setIsLoading, } = useObjectivesActions();
  const { setFeedback } = useFeedbackStoreActions()

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
            activity_comments: data?.data?.flatMap(obj => obj.comments || []) || [],
            application_timelines: data?.data || [],
          };
          setFeedback(transformedData); // get the objectives data and set to feedback so we can access the comments and remarks data
          callBack(status, message)
        }
      });
    } catch (error) {
      console.error('Error fetching application objectives:', error);
      callBack?.(false, error.message)
    }
  };

  const getObjectivesBySector = async (callBack) => {
    setIsLoading(true)
    try {
      await read({
        url: API.OBJECTIVE_BY_SECTOR,
        failed: callBack,
        success: (res) => {
          const { data: { data, message } } = res;
          const { aop_application, application_objectives } = data
          // console.log(application_objectives)
          // setApplicationObjectives(Array.isArray(data) ? data : []);
          setIsLoading(false)
          setAopApplication(aop_application)
          setApplicationObjectives(application_objectives)
          callBack(status, message)
        }
      });
    } catch (error) {
      console.error('Error fetching application objectives:', error);
      callBack?.(false, error.message)
    }
  };

  const showObjective = async (params, callBack) => {
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
          callBack(status, message)
        }
      })
    } catch (error) {
      console.error('Error fetching application objectives:', error);
      callBack?.(false, error.message)
    }
  }

  const createObjective = async (body, callBack) => {
    try {
      await post({
        url: API.OBJECTIVE_STORE,
        form: body,
        failed: callBack,
        success: async (res) => {

          const {
            status,
            data: { data, message },
          } = res;
          if (status === 201) {
            getObjectivesBySector()
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

  const updateObjective = async (params, body, callBack) => {
    try {
      await update({
        url: `${API.OBJECTIVE_EDIT}/${params.id}`,
        form: body,
        failed: callBack,
        success: async (res) => {
          const {
            status,
            data: { message },
          } = res;
          if (status === 200) {
            getObjectivesBySector()
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

  const removeObjective = async (params, callBack) => {
    try {
      await remove({
        url: `${API.OBJECTIVE_DELETE}/${params.id}`,
        params: params,
        failed: callBack,
        success: (res) => {
          const {
            status,
            data: { message },
          } = res;

          if (status === 200) {
            const updatedObjectives = applicationObjectives.filter((obj) => obj.id !== params.id)
            // console.log(updatedObjectives)
            setApplicationObjectives(updatedObjectives);
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
    getObjectives,
    getObjectivesBySector,
    showObjective,
    createObjective,
    updateObjective,
    removeObjective,
  }

}

export default useObjectivesHook;