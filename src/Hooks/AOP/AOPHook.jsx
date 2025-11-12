import { API } from "../../Data/constants";
import { read, post, update } from "../../Services/RequestMethods";

import { useAOPActions } from "../../Store/AOPStore";

const useAOPHook = () => {
  const { setAop, setYears, setAopCheckList } = useAOPActions();

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

  const getAopYearList = async (callBack) => {
    try {
      await read({
        url: API.AOP_YEAR_LIST,
        failed: callBack,
        success: (res) => {
          // console.log(res)
          const {
            status,
            data: { data, message },
          } = res;
          setYears(data);
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

  const updateAOP = async (params, body, callBack) => {
    try {
      await update({
        url: `${API.AOP_UPDATE}/${params.id}`,
        form: body,
        failed: callBack,
        success: async (res) => {

          console.log(res)

          const {
            status,
            data: { message, errors },
          } = res;

          console.log(message, errors)

          // if (status === 200) {

          //   const fetchParams = { application_objective_id: data.application_objective_id };

          //   getActivities(fetchParams, (status, message) => {
          //     if (!(status >= 200 && status < 300)) {
          //       console.error("Failed to refresh activities:", message);
          //     }
          //   });
          // }

          callBack?.(status, message);

        },
      })
    }
    catch (error) {
      console.error("Error Update Activity:", error);
      callBack(false, error.message);
    }
  }



  return {
    getAOP,
    getAopYearList,
    getAopBySectorAndYear,
    getAopChecklist,
    createAOP,
    updateAOP,
  };
};

export default useAOPHook;
