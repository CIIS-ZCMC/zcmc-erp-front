import { API } from "../Data/constants";
import { read, post, update, remove } from "../Services/RequestMethods";

import useResponsibleStore, {
  useResponsiblePeopleActions,
  getResponsibleState,
} from "../Store/ResponsiblePeopleStore";

const useResponsibleHook = () => {
  const { responsiblePeople } = useResponsibleStore();
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
          callBack(status, message);
        },
      });
    } catch (error) {
      console.error("Error fetching Responsible People:", error);
      callBack?.(false, error.message);
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
            // Get current responsible people from store
            const currentResponsiblePeople =
              getResponsibleState().responsiblePeople;

            {
              console.log(currentResponsiblePeople);
            }
            // Separate users and designations from response
            const newUsers = data.users || [];
            const newDesignations = data.designations || [];

            // Append to existing arrays
            const updatedUsers = [
              ...(currentResponsiblePeople?.responsible_people?.users || []),
              ...newUsers,
            ];
            const updatedDesignations = [
              ...(currentResponsiblePeople?.responsible_people?.designations ||
                []),
              ...newDesignations,
            ];

            // Update store with merged data
            setResponsiblePeople({
              ...currentResponsiblePeople,
              responsible_people: {
                users: updatedUsers,
                designations: updatedDesignations,
              },
            });
          }
          callBack?.(status, message);
        },
      });
    } catch (error) {
      console.error("Error Creating Responsible:", error);
      callBack(false, error.message);
    }
  };

  const removeResponsible = (params, callBack) => {
    try {
      remove({
        url: `${API.PEOPLE_DELETE}/${params.id}`,
        params: params,
        failed: callBack,
        success: (res) => {
          const {
            status,
            data: { data, message },
          } = res;

          if (status === 200) {
            // Get current state from store
            const currentResponsiblePeople =
              getResponsibleState().responsiblePeople;

            // Filter out the removed person from both users and designations
            const updatedUsers =
              currentResponsiblePeople.responsible_people?.users?.filter(
                (person) => person.responsible_person_id !== params.id,
              ) || [];

            const updatedDesignations =
              currentResponsiblePeople.responsible_people?.designations?.filter(
                (designation) =>
                  designation.responsible_person_id !== params.id,
              ) || [];

            // Update store with filtered data
            const updatedData = {
              ...currentResponsiblePeople,
              responsible_people: {
                users: updatedUsers,
                designations: updatedDesignations,
              },
            };

            setResponsiblePeople(updatedData);
          }
          callBack?.(status, message);
        },
      });
    } catch (error) {
      console.error("Error Deleting Responsible:", error);
      callBack(false, error.message);
    }
  };

  return {
    getPeople,
    createResponsible,
    removeResponsible,
  };
};

export default useResponsibleHook;
