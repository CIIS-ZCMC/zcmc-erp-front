import { API } from "../Data/constants";
import { read } from "../Services/RequestMethods";

import { useFunctionTypesActions } from "../Store/FunctionTypesStore";

const useFunctionTypeHook = () => {
  const { setFunctionTypes } = useFunctionTypesActions()

  const getFunctionType = (params, callBack) => {
    try {
      read({
        url: API.TYPE_OF_FUNCTIONS,
        params: params,
        failed: callBack,
        success: (res) => {
          const {
            status,
            message,
            data: { data },
          } = res;
          setFunctionTypes(data);
          callBack(status, message);
        },
      });
    } catch (error) {
      console.error("Error fetching function types:", error);
      callBack(false, error.message);
    }
  };

  return {
    getFunctionType,
  };
}

export default useFunctionTypeHook
