import api from "configs/axios";

export const getCourseCategory = async () => {
    const response = await api.get("/course-categories");
    return response.data.data;
}
