
import { create } from "zustand";
import { API } from "../Data/constants";
import { read } from "../Services/RequestMethods";

import { useFunctionTypesActions } from "../Store/functionTypesStore";

const useFunctionTypeHook = () => {
  const { setFunctionTypes } = useFunctionTypesActions()

  const getFunctionType = async (params, callBack) => {
    try {
      await read({
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

// const useFunctionTypeHook = create((set) => ({

//   const { function_types } = useFunctionTypesStore()

//  getFunctionType: (params, callBack) => {
//     read({
//       url: API.TYPE_OF_FUNCTIONS,
//       params: params,
//       failed: callBack,
//       success: (res) => {
//         // console.log(res.data.data)
//         const {
//           status,
//           message,
//           data: { data },
//         } = res;
//         set({ function_types: data });
//         callBack(status, message);
//       },
//     });
//   },
// }));

// export default useFunctionTypeHook;
