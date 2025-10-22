import { API } from "../Data/constants";
import { read, post } from "../Services/RequestMethods";

import { useObjectivesActions } from "../Store/ObjectivesStore";

const useObjectivesHook = () => {

  const { setObjectives } = useObjectivesActions();

  const getObjectives = async (callBack) => {
    try {
      await read({
        url: API.OBJECTIVEBYSECTOR,
        failed: callBack,
        success: (res) => {
          console.log(res)
          const {
            status,
            message,
            data: { data },
          } = res;
          setObjectives(data);
          callBack(status, message)
        }
      });
    } catch (error) {
      console.error('Error fetching application objectives:', error);
      callBack(false, error.message)
    }
  };

  const createObjectives = async (body, callBack) => {
    try {
      await post({
        url: API.OBJECTIVE_STORE,
        form: body,
        failed: callBack,
        success: (res) => {
          const {
            status,
            message,
            data: { data },
          } = res;
          setObjectives(data)
          callBack(status, message);
        },
      })
    }
    catch (error) {
      console.error("Error Creating AOP:", error);
      callBack(false, error.message);
    }
  }

  return {
    getObjectives,
    createObjectives
  }


}

export default useObjectivesHook;