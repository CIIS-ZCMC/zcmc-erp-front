import { API } from "../../Data/constants";
import { read, post } from "../../Services/RequestMethods";

import { useAOPActions } from "../../Store/AOPStore";

const useAOPHook = () => {
  const { setAop, setAopCheckList } = useAOPActions();

  const getAOP = async (callBack) => {
    try {
      await read({
        url: API.AOP_APPLICATIONS,
        failed: callBack,
        success: (res) => {
          const {
            status,
            data: { data, message },
          } = res;
          setAop(data);
          callBack(status, message);
        },
      });
    } catch (error) {
      console.error("Error fetching AOP:", error);
      callBack(false, error.message);
    }
  };

  const getAopBySectorAndYear = async (params, callBack) => {
    try {
      await read({
        url: `${API.AOP_BY_SECTOR_AND_YEAR}`,
        params: params,
        failed: callBack,
        success: (res) => {
          const {
            status,
            data: { data, message },
          } = res;
          setAop(data);
          callBack(status, message)
        }
      })
    } catch (error) {
      console.error('Error fetching application objectives:', error);
      callBack?.(false, error.message)
    }
  }

  const getAopChecklist = async (params, callBack) => {
    try {
      await read({
        url: `${API.AOP_CHECKLIST}`,
        params: params,
        failed: callBack,
        success: (res) => {
          const {
            status,
            data: { data, message },
          } = res;
          setAopCheckList(data);
          callBack(status, message)
        }
      })
    } catch (error) {
      console.error('Error fetching application objectives:', error);
      callBack?.(false, error.message)
    }
  }

  const createAOP = async (body, callBack) => {
    try {
      await post({
        url: API.AOP_APPLICATIONS_STORE,
        form: body,
        failed: callBack,
        success: (res) => {
          const {
            status,
            data: { data, message },
          } = res;
          setAop(data);
          callBack(status, message);
        },
      });
    } catch (error) {
      console.error("Error Creating AOP:", error);
      callBack(false, error.message);
    }
  };

  return {
    getAOP,
    getAopBySectorAndYear,
    getAopChecklist,
    createAOP,
  };
};

export default useAOPHook;
