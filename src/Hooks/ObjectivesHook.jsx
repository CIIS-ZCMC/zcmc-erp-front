import { API } from "../Data/constants";
import { read, post, update, remove } from "../Services/RequestMethods";

import { useApplicationObjectives, useObjectivesActions } from "../Store/ObjectivesStore";

const useObjectivesHook = () => {

  const applicationObjectives = useApplicationObjectives();

  const { setApplicationObjectives, setApplicationObjective } = useObjectivesActions();

  const getObjectivesBySector = async (callBack) => {
    try {
      await read({
        url: API.OBJECTIVE_BY_SECTOR,
        failed: callBack,
        success: (res) => {
          const {
            status,
            data: { data, message },
          } = res;
          setApplicationObjectives(Array.isArray(data) ? data : []);
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
            const updatedObjectives = applicationObjectives.filter(
              (obj) => obj.id !== params.id
            );
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
    getObjectivesBySector,
    showObjective,
    createObjective,
    updateObjective,
    removeObjective,
  }

}

export default useObjectivesHook;