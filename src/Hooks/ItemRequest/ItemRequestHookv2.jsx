import { API } from '../../Data/constants';
import { read, post, update, remove, } from '../../Services/RequestMethods';

import { useItemRequestActions } from '../../Store/ItemRequestStore';

const useItemRequestsHook = () => {

    const { setRequests, setIsLoading } = useItemRequestActions();

    const getItemRequests = (params, callBack,) => {

        setIsLoading(true)
        read({
            url: API.ITEM_REQUESTS,
            failed: (error) => {
                setIsLoading(false)
                callBack?.(false, error?.message || 'Request failed')
            },
            params: params,
            success: (res) => {
                try {
                    const {
                        status,
                        data: { data, message },
                    } = res;
                    setRequests(data.data);
                    callBack(status, message)
                } catch (error) {
                    console.error('Error processing Item Requests:', error);
                    callBack?.(false, error.message)
                } finally {
                    setIsLoading(false)
                }
            }
        });
    };

    const updateItemRequest = (item_request_id, body, callBack) => {
        setIsLoading(true)
        update({
            url: `${API.APPROVAL_ITEM_REQUEST}/${item_request_id}`,
            form: body,
            failed: (error) => {
                setIsLoading(false)
                callBack?.(false, error?.message || 'Update failed')
            },
            success: (res) => {
                try {
                    const {
                        status,
                        data: { data, message },
                    } = res;
                    callBack?.(status, message);
                } catch (error) {
                    console.error("Error processing update response:", error);
                    callBack?.(false, error.message);
                } finally {
                    setIsLoading(false)
                }
            },
        })
    }

    return {
        getItemRequests,
        updateItemRequest
    }
}

export default useItemRequestsHook;