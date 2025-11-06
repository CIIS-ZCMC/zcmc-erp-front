import { API } from "../Data/constants";
import { read, post, update, remove } from '../Services/RequestMethods';

import useResponsibleStore, { useResponsiblePeopleActions } from "../Store/ResponsibleStore";

const useResponsibleHook = () => {
  const { responsiblePeople } = useResponsibleStore()
  const { setResponsiblePeople } = useResponsiblePeopleActions();

  const getPeople = (params, callBack) => {
    try {
      read({
        url: API.PEOPLE,
        failed: callBack,
        params,
        success: (res) => {
          // console.log(res)
          const {
            status,
            data: { message },
          } = res;
          setResponsiblePeople(res.data);
          callBack(status, message)
        }
      });
    } catch (error) {
      console.error('Error fetching Responsible People:', error);
      callBack?.(false, error.message)
    }
  };

  const createResponsible = (body, callBack) => {
    try {
      post({
        url: API.PEOPLE_STORE,
        form: body,
        failed: callBack,
        success: async (res) => {
          const {
            status,
            data: { data, message },
          } = res;
          if (status === 201) {
            const fetchParams = { activity_id: data[0].activity_id };

            getPeople(fetchParams, (status, message) => {
              if (!(status >= 200 && status < 300)) {
                console.error("Failed to refresh activities:", message);
              }
            });
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

  const removeResponsible = (params, callBack) => {
    try {
      remove({
        url: `${API.PEOPLE_DELETE}/${params.id}`,
        params: params,
        failed: callBack,
        success: (res) => {
          const {
            status,
            data: { message },
          } = res;

          if (status === 200) {
            const updatedPeople = responsiblePeople.responsible_people?.filter(
              (obj) => obj.responsible_person_id !== params.responsible_person_id
            );
            setResponsiblePeople(updatedPeople);
          }
          callBack?.(status, message);
        },
      })
    }
    catch (error) {
      console.error("Error Deleting pEOPLE:", error);
      callBack(false, error.message);
    }
  }


  return {
    getPeople,
    createResponsible,
    removeResponsible,
  }

}

export default useResponsibleHook