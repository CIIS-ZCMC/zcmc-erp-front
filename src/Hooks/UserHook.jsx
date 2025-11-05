import { API } from "../Data/constants";
import { read } from "../Services/RequestMethods";
import { useUsersActions } from "../Store/UsersStore";

const useUserHook = () => {

  const { setUsers } = useUsersActions();

  const getUsers = (callBack) => {
    try {
      read({
        url: API.USERS,
        failed: callBack,
        success: (res) => {
          const { status, message, data } = res;
          setUsers(data);
          callBack(status, message);
        },
      });
    } catch (error) {
      console.error("Error fetching job positions:", error);
      callBack(false, error.message);
    }
  }

  const getAuthorized = (pin, Callback) => {
    if (pin == "12345") {
      Callback(true);
      return;
    }
  }

  return {
    getUsers,
    getAuthorized,
  }
}

export default useUserHook;
