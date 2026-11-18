import api from "configs/axios";

export const getCurrentUser = async () => {
    const response = await api.get("/user/me");
    return response.data.data;
};

export const loginNationalCodePassword = async data => {
    const response = await api.post("/user/login/national-code-password", data);
    return response.data.data;
}

export const registerStudent = async data => {
    const response = await api.post("/user/register/student", data, { headers: { "Content-Type": 'multipart/form-data' } });
    return response.data.data;
}
