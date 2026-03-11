import { API } from "../../Data/constants";
import { read, post, update } from "../../Services/RequestMethods";

import { useAop, useAOPActions } from "../../Store/AOPStore";

const useAOPHook = () => {
  const { setAop, setYears, setAopCheckList, setMission } = useAOPActions();

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
        params,
        failed: callBack,
        success: (res) => {
          const {
            status,
            data: { data, message },
          } = res;
          setAop(data);
          setMission(data.mission);
          callBack(status, message);
        },
      });
    } catch (error) {
      console.error("Error fetching application objectives:", error);
      callBack?.(false, error.message);
    }
  };

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
          callBack(status, message);
        },
      });
    } catch (error) {
      console.error("Error fetching application objectives:", error);
      callBack?.(false, error.message);
    }
  };

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
          setMission(data?.mission);
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
          const {
            status,
            data: { message, data },
          } = res;

          callBack?.(status, message);
        },
      });
    } catch (error) {
      console.error("Error Update Activity:", error);
      callBack(false, error.message);
    }
  };

  const updateMission = async (params, body, callBack) => {
    try {
      await update({
        url: `${API.AOP_UPDATE_MISSION}/${params.id}`,
        form: body,
        failed: callBack,
        success: async (res) => {
          const {
            status,
            data: { data, message },
          } = res;

          setMission(data.mission);

          callBack(status, message);
        },
      });
    } catch (error) {
      console.error("Error Update Activity:", error);
      callBack(false, error.message);
    }
  };

  return {
    getAOP,
    getAopYearList,
    getAopBySectorAndYear,
    getAopChecklist,
    createAOP,
    updateAOP,
    updateMission,
  };
};

export default useAOPHook;
