import { API } from '../../Data/constants';
import { read, post, update, remove, } from '../../Services/RequestMethods';

import { useItemRequestActions } from '../../Store/ItemRequestStore';

const useItemRequestsHook = () => {

    const { setRequests, setIsLoading } = useItemRequestActions();

    const getItemRequests = (callBack, status) => {
        setIsLoading(true)
        try {
            read({
                url: API.ITEM_REQUESTS,
                failed: callBack,
                params: { status },
                success: (res) => {
                    const {
                        status,
                        data: { data, message },
                    } = res;
                    // console.log('from hook', data.data)
                    setRequests(data.data);
                    setIsLoading(false)
                    callBack(status, message)
                }
            });
        } catch (error) {
            console.error('Error fetching Item Requests:', error);
            callBack?.(false, error.message)
        }
        finally {
            setIsLoading(false)
        }
    };

    const updateItemRequest = async (item_request_id, body, callBack) => {
        try {
            await update({
                url: `${API.APPROVAL_ITEM_REQUEST}/${item_request_id}`,
                form: body,
                failed: callBack,
                success: (res) => {
                    // console.log(res)
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
        getItemRequests,
        updateItemRequest
    }
}

export default useItemRequestsHook;