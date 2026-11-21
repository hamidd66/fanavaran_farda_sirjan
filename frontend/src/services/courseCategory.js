import api from "configs/axios";

export const getCourseCategory = async () => await api.get("/course-categories");
