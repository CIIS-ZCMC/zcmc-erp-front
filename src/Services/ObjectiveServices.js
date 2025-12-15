import { API } from "../Data/constants";
import erp_api from "./ERP_API";

export const GetUserObjectives = async () => {
    return await erp_api.get(API.OBJECTIVE_BY_SECTOR);
}

export const DeleteAppObj = async (id, params) => {
    return await erp_api.delete(`${API.OBJECTIVE_DELETE}/${id}`, { params: params });
}