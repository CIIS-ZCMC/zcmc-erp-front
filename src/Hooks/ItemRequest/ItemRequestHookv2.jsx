import { API } from '../../Data/constants';
import { read, post, update, remove, } from '../../Services/RequestMethods';

const useItemRequestsHook = () => {

    const updateItemRequest = async (item_request_id, body, callBack) => {
        try {
            await update({
                url: `${API.APPROVAL_ITEM_REQUEST}/${item_request_id}`,
                form: body,
                failed: callBack,
                success: (res) => {
                    console.log(res)
                    const {
                        status,
                        data: { data, message },
                    } = res;
                    callBack?.(status, message);
                },
            })
        }
        catch (error) {
            console.error("Error Update Item Requests:", error);
            callBack(false, error.message);
        }
    }

    return {
        updateItemRequest
    }
}

export default useItemRequestsHook;