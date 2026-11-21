import api from "configs/axios";

export const getCurrentUser = async () => await api.get("/user/me");

export const loginNationalCodePassword = async data => await api.post("/user/login/national-code-password", data);

export const registerStudent = async data => await api.post("/user/register/student", data, { headers: { "Content-Type": 'multipart/form-data' } });

export const getPublicTeachers = async () => await api.get("/user/public?roles=teacher");

export const logoutCurrent = async () => await api.post("/user/logout-current");
