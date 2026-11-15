import api from "configs/axios";

export const getCurrentUser = async () => {
    const response = await api.get("/user/me");
    return response.data.data;
};
